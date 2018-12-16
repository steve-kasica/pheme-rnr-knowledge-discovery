# coding: utf-8
# Load dependencies for this Jupyter Notebook
import os, json, errno
import pandas as pd
import numpy as np
from sys import argv
import string
import time
from util import to_unix_tmsp, parse_twitter_datetime
from multiprocessing import Process


#imports for text feature extraction:
import nltk
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
import re
from nltk.corpus import stopwords as stp
from textblob import TextBlob


class Tweets:

    def __init__(self, event_name, output_dir="data/tweets"):
        self.event = event_name
        self.data = {}
        self.output_dir = output_dir
        self.printable = set(string.printable)

        utc_offset = {
            "germanwings-crash": 1,
            "sydneysiege": 11,
            "ottawashooting": -4,
            "ferguson":-5,
            "charliehebdo":+1,
        }
        self.utc_offset = utc_offset[self.event]
    
    def append(self, twt, cat, thrd, is_src):
        """ Convert tweet metadata into features.

        Key to the `self.data` dictionary defined in this function define columns in
        the CSV file produced by the `export` method.

        Params:
            - twt: The new tweet to add to the table
            - cat: The category of the tweet, e.g. rumour
            - thrd: The thread id of the tweet
            - is_src : True if it's a source tweet and false if it is a reaction
        """
        twt['category'] = cat
        twt["thread"] = thrd
        twt["event"] = self.event
        twt["is_src"] = is_src

        twt_text=twt["text"]
        twt_text_filtered=str()
        for c in twt_text:
            if c in self.printable:
                twt_text_filtered+=c

        #print('twt text:',twt_text_filtered)
        #print('type of twt_text', type(twt_text_filtered))
        text_features=self.tweettext2features(twt_text_filtered)
        
        def get_utc_dist(obj):
            offset = obj["user"].get("utc_offset")
            conversion = 3600
            return abs(self.utc_offset - offset / conversion) if offset else None

        has_question = "?" in twt["text"]
        has_exclaim = "!" in twt["text"]

        features = {
            # Thread metadata
            "is_rumor": lambda obj : 1 if obj['category'] == "rumours" else 0,
            
            # Conservation metadata
            "thread" : lambda obj : obj["thread"],
            "in_reply_tweet" : lambda obj : obj.get("in_reply_to_status_id"),
            "event" : lambda obj : obj.get("event"),
            "tweet_id" : lambda obj : obj.get("id"),
            "is_source_tweet" : lambda obj : 1 if twt["is_src"] else 0,
            "in_reply_user" : lambda obj : obj.get("in_reply_to_user_id"),
            "user_id" : lambda obj : obj["user"].get("id"),
            
            # Tweet metadata
            "tweet_length": lambda obj : len(obj.get("text","")),
            "symbol_count": lambda obj: len(obj["entities"].get("symbols", [])),
            "user_mentions": lambda obj: len(obj["entities"].get("user_mentions", [])),
            "urls_count": lambda obj : len(obj["entities"].get("urls", [])),
            "media_count": lambda obj: len(obj["entities"].get("media", [])),
            "hashtags_count": lambda obj : len(obj["entities"].get("hashtags", [])),
            "retweet_count": lambda obj : obj.get("retweet_count", 0),
            "favorite_count": lambda obj : obj.get("favorite_count"),
            "mentions_count": lambda obj : len(obj["entities"].get("user_mentions", "")),
            "is_truncated": lambda obj : 1 if obj.get("truncated") else 0,
            "created": lambda obj : self.datestr_to_tmsp(obj.get("created_at")),
            "has_smile_emoji": lambda obj: 1 if "😊" in obj["text"] else 0,
            "sensitive": lambda obj: 1 if obj.get("possibly_sensitive") else 0,
            "has_place": lambda obj: 1 if obj.get("place") else 0,
            "has_coords": lambda obj: 1 if obj.get("coordinates") else 0,
            "has_quest": lambda obj: 1 if has_question else 0,
            "has_exclaim": lambda obj: 1 if has_exclaim else 0,
            "has_quest_or_exclaim": lambda obj: 1 if (has_question or has_exclaim) else 0,

            # User metadata
            "user.tweets_count": lambda obj: obj["user"].get("statuses_count", 0),
            "user.verified": lambda obj: 1 if obj["user"].get("verified") else 0,
            "user.followers_count": lambda obj: obj["user"].get("followers_count"),
            "user.listed_count": lambda obj: obj["user"].get("listed_count"),
            "user.desc_length": lambda obj: len(obj["user"].get("description", "")),
            "user.handle_length": lambda obj: len(obj["user"].get("name", "")),
            "user.name_length": lambda obj: len(obj["user"].get("screen_name", "")),
            "user.notifications": lambda obj: 1 if obj["user"].get("notifications") else 0,
            "user.friends_count": lambda obj: obj["user"].get("friends_count"),
            "user.time_zone": lambda obj: obj["user"].get("time_zone"),
            "user.desc_length": lambda obj: len(obj["user"]["description"]) if obj["user"]["description"] else 0,
            "user.has_bg_img": lambda obj: 1 if obj["user"].get("profile_use_background_image") else 0,
            "user.default_pic": lambda obj: 1 if obj["user"].get("default_profile") else 0,
            "user.created_at": lambda obj: self.datestr_to_tmsp(obj["user"].get("created_at")),
            "user.location": lambda obj: 1 if obj["user"].get("location") else 0,
            "user.profile_sbcolor": lambda obj: int(obj["user"].get("profile_sidebar_border_color"), 16),
            "user.profile_bgcolor": lambda obj: int(obj["user"].get("profile_background_color"), 16),
            "user.utc_dist": get_utc_dist,
        }

        for col in features:
            self.data.setdefault(col, []).append(features[col](twt))

        for col in text_features:
            self.data.setdefault(col, []).append(text_features[col])

    def tweettext2features(self, tweet_text):   
        """ Extracts some text features from the text of each tweet. The extracted features are as follows:
        hasperiod: has period
        number_punct: number of punctuation marks
        negativewordcount: the count of the defined negative word counts
        positivewordcount :the count of the defined positive word counts
        capitalratio: ratio of capital letters to all the letters
        contentlength: length of text
        sentimentscore: sentiment score by textBlob
        Noun: number of nouns
        Verb: number of verbs
        Adjective: number of adjectives
        Pronoun: number of pronouns
        Adverb: number of adverbs
        Param:
            - tweet_text: text of tweet
        Return: a dict containing the mentioned text features
        """
        #punctuations
        def punctuationanalysis(tweet_text):
            punctuations= ["\"","(",")","*",",","-","_",".","~","%","^","&","!","#",'@'
               "=","\'","\\","+","/",":","[","]","«","»","،","؛","?",".","…","$",
               "|","{","}","٫",";",">","<","1","2","3","4","5","6","7","8","9","0"]
            hasperiod=sum(c =='.' for c in tweet_text)
            number_punct=sum(c in punctuations for c in tweet_text)
            return {'hasperiod':hasperiod,'number_punct':number_punct}

        def negativewordcount(tokens):
            count = 0
            negativeFeel = ['tired', 'sick', 'bord', 'uninterested', 'nervous', 'stressed',
                            'afraid', 'scared', 'frightened', 'boring','bad',
                            'distress', 'uneasy', 'angry', 'annoyed', 'pissed',"hate",
                            'sad', 'bitter', 'down', 'depressed', 'unhappy','heartbroken','jealous', 'fake', 'stupid', 'strange','absurd', 'crazy']
            for negative in negativeFeel:
                if negative in tokens:
                    count += 1
            return count

        def positivewordcount(tokens):
            count = 0
            positivewords = ['joy', ' happy', 'hope', 'kind', 'surprise'
                            , 'excite', ' interest', 'admire',"delight","yummy",
                            'confidenc', 'good', 'satisf', 'pleasant',
                            'proud', 'amus', 'amazing', 'awesome',"love","passion","great","like","wow","delicious", "true", "correct", "crazy"]
            for pos in positivewords:
                if pos in tokens:
                    count += 1
            return count

        def capitalratio(tweet_text):
            uppers = [l for l in tweet_text if l.isupper()]
            capitalratio = len(uppers) / len(tweet_text)
            return capitalratio

        def contentlength(words):
            wordcount = len(words)
            return wordcount

        def sentimentscore(tweet_text):
            analysis = TextBlob(tweet_text)
            return analysis.sentiment.polarity

        def getposcount(tweet_text):
            postag = []
            poscount = {}
            poscount['Noun']=0
            poscount['Verb']=0
            poscount['Adjective'] = 0
            poscount['Pronoun']=0
            poscount['FirstPersonPronoun']=0
            poscount['SecondPersonPronoun']=0
            poscount['ThirdPersonPronoun']=0
            poscount['Adverb']=0
            Nouns = {'NN','NNS','NNP','NNPS'}
            Verbs={'VB','VBP','VBZ','VBN','VBG','VBD','To'}
            first_person_pronouns=['I','me','my','mine','we','us','our','ours']
            second_person_pronouns=['you','your','yours']
            third_person_pronouns=['he','she','it','him','her','it','his','hers','its','they','them','their','theirs']

            word_tokens = nltk.word_tokenize(re.sub(r'([^\s\w]|_)+', '', tweet_text))
            for word in word_tokens:
                w_lower=word.lower()
                if w_lower in first_person_pronouns:
                    poscount['FirstPersonPronoun']+=1
                elif w_lower in second_person_pronouns:
                    poscount['SecondPersonPronoun']+=1
                elif w_lower in third_person_pronouns:
                    poscount['ThirdPersonPronoun']+=1

            postag = nltk.pos_tag(word_tokens)
            for g1 in postag:
                if g1[1] in Nouns:
                    poscount['Noun'] += 1
                elif g1[1] in Verbs:
                    poscount['Verb']+= 1
                elif g1[1]=='ADJ'or g1[1]=='JJ':
                    poscount['Adjective']+=1
                elif g1[1]=='PRP' or g1[1]=='PRON':
                    poscount['Pronoun']+=1
                elif g1[1]=='ADV':
                    poscount['Adverb']+=1
            return poscount
        def tweets2tokens(tweet_text):
            tokens = nltk.word_tokenize(re.sub(r'([^\s\w]|_)+','', tweet_text.lower()))
            url=0
            for token in tokens:
                if token.startswith( 'http' ):
                    url=1

            return tokens,url


        # the code for def tweettext2features(tweet_text):
        features=dict()

        tokens,url=tweets2tokens(tweet_text)

        punc_dict=punctuationanalysis(tweet_text)
        features.update(punc_dict)
        features['negativewordcount']=(negativewordcount(tokens))
        features['positivewordcount']=(positivewordcount(tokens))
        features['capitalratio']=(capitalratio(tweet_text))
        features['contentlength']=(contentlength(tokens))
        features['sentimentscore']=(sentimentscore(tweet_text))
        pos_dict=getposcount(tweet_text)
        features.update(pos_dict)
        features['has_url_in_text']=(url)
        # print("features",features)
        return features

    def export(self):
        fn = "%s/%s.csv" % (self.output_dir, self.event)
        df = pd.DataFrame(data=self.data)
        df.to_csv(fn, index=False)
        return fn
    
    def datestr_to_tmsp(self, datestr):
        """ Converts Twitter's datetime format to Unix timestamp 

        Param:
            - datestr: datetime string, e.g. Mon Dec 10 4:12:32.33 +7000 2018
        Return: Unix timestamp
        """
        return to_unix_tmsp([parse_twitter_datetime(datestr)])[0]

def pheme_to_csv(event, Parser=Tweets, output="data/tweets"):
    """ Parses json data stored in directories of the PHEME dataset into a CSV file.
    
    Params:
        - event: Name fake news event and directory name in PHEME dataset
    
    Return: None
    """
    start = time.time()
    data = Parser(event, output_dir=output)
    dataset = "raw/pheme-rnr-dataset"
    thread_number = 0         
    for category in os.listdir("%s/%s" % (dataset, event)):
        print('event:',event,'category:',category,category=='rumours')
        for thread in os.listdir("%s/%s/%s" % (dataset, event, category)):
            with open("%s/%s/%s/%s/source-tweet/%s.json" % (dataset, event, category, thread, thread)) as f:
                tweet = json.load(f)
            data.append(tweet, category, thread, True)
            thread_number += 1
            for reaction in os.listdir("%s/%s/%s/%s/reactions" % (dataset, event, category, thread)):
                with open("%s/%s/%s/%s/reactions/%s" % (dataset, event, category, thread, reaction)) as f:
                    tweet = json.load(f)
                data.append(tweet, category, thread, False)
    fn = data.export()
    print("%s was generated in %s minutes" % (fn, (time.time() - start) / 60))
    return None

def agg_event_data(df, limit=0):
    """ Aggregate tabular tweet data from a PHEME event into aggregated thread-level data
    
    Params:
        - df: the DataFrame with tabular tweet data
       
    Return: A DataFrame with thread-level data for this event
    """
    data = df.head(limit) if limit > 0 else df
    data = data.replace({"has_url": {"True": True, "False": False}})
    agg = data.groupby("thread") \
        .agg({"favorite_count": sum,
              "retweet_count": sum,
              "is_rumor": max,
              "has_url": lambda col: np.count_nonzero(col) / len(col),
              "id": len,
              "hashtags_count": lambda col: len([True for total in col if total > 0]) / len(col),
              "text": lambda col: len([True for txt in col if "😊" in txt]) / len(col)}) \
        .rename(columns={"favorite_count": "favorite_total",
                         "retweet_count": "retweet_total",
                         "user.friends_count": "friends_total",
                         "id": "thread_length",
                         "has_url":"url_proportion",
                         "hashtags_count": "hashtag_proportion",
                         "text": "smile_emoji_proportion"})
    src = data[data["thread"] == data["id"]][["thread", "user.followers_count"]]  # source tweets will have equal thread id and tweet id
    src = src.rename(columns={"user.followers_count": "src_followers_count"})
    thrd_data = pd.merge(agg, src, on="thread")
    return thrd_data

if __name__ == "__main__":
    print("Running %s to parse %s" % (argv[0], argv[1]))
    if(argv[1]=="all"):
        events=[
            "germanwings-crash",
            "sydneysiege",
            "ottawashooting",
            "ferguson",
            #"charliehebdo",
        ]
        dataset = "../raw/pheme-rnr-dataset"
        processes=[]
        for event in events:
            p=Process(target=pheme_to_csv,args=(event,))
            p.start()
            processes.append(p)
            #pheme_to_csv(event)
        for p in processes:
            p.join()
            
    else:
        pheme_to_csv(argv[1])
