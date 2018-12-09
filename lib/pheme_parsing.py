# Load dependencies for this Jupyter Notebook
import os, json, errno
import pandas as pd
from pandas.io.json import json_normalize

def get_event_data(event, dataset="pheme-rnr-dataset", refresh=False):
    """ Fetches event data as a Pandas DataFrame. If cleaned CSV file does not exist, then create it.
    
    Params:
        - event: Name of fake news event
        - dataset: fake news dataset, default to PHEME dataset
        - refresh: if True, then reparse raw PHEME to CSV and overwrite existing CSV file.
    
    Return: Pandas DataFrame
    """
    fn = "../data/%s/%s.csv" % (dataset, event)  
    if refresh:
        clean_pheme_by_event(event)
        event = pd.read_csv(fn)
    else:
        try:
            event = pd.read_csv(fn)
        except OSError as e:
            clean_pheme_by_event(event)
            event = pd.read_csv(fn)
    return event;

def clean_pheme_by_event(event):
    """ Parses json data stored in directories of the PHEME dataset into a CSV file.
    
    Params:
        - event: Name fake news event and directory name in PHEME dataset
    
    Return: None
    """
    dataset = "../raw/pheme-rnr-dataset"
    fn = "../data/pheme-rnr-dataset/%s.csv" % (event)
    header = True
    data = pd.DataFrame()   
    thread_number=0         
    for category in os.listdir("%s/%s" % (dataset, event)):
        print('category:',category,category=='rumours')
        for thread in os.listdir("%s/%s/%s" % (dataset, event, category)):
            with open("%s/%s/%s/%s/source-tweet/%s.json" % (dataset, event, category, thread, thread)) as f:
                tweet = json.load(f)
            df = tweet_to_df(tweet, category, thread)
            data = data.append(df)
            thread_number+=1
            #if thread_number>10:
            #    break;
            print('thread:',thread_number)
            for reaction in os.listdir("%s/%s/%s/%s/reactions" % (dataset, event, category, thread)):
                with open("%s/%s/%s/%s/reactions/%s" % (dataset, event, category, thread, reaction)) as f:
                    tweet = json.load(f)
                df = tweet_to_df(tweet, category, thread,False)
                data = data.append(df)
    data.to_csv(fn, index=False)
    return None

def tweet_to_df(twt, cat, thrd, is_source_tweet=True):
    """  Convert tweet meta-data to DataFrame instance
    
    Params:
        - twt: The new tweet to add to the table
        - cat: The category of the tweet, either rumor or non rumor
        - thrd: The thread id of the tweet
        - is_source_tweet : True if it's a source tweet and false if it is a reaction
    """
    
    return pd.DataFrame([{
        # Tweet data
        "thread": thrd,        
        "tweet_length": len(twt.get("text","")),
        "text": twt.get("text"),
        "id": twt.get("id"),
        "in_reply_id": twt.get("in_reply_to_status_id", None),
        "in_reply_user": twt.get("in_reply_to_user", None),
        "is_rumor": True if cat is "rumours" else False,
        "is_source_tweet" : is_source_tweet,
        "has_url": True if len(twt["entities"]["urls"]) > 0 else False,
        "symbols_count": len(twt["entities"]["symbols"]),
        "hashtags_count": len(twt["entities"]["hashtags"]),                                          
        "urls_count": len(twt["entities"]["urls"]),
        "created": twt.get("created_at"),
        "lang": twt.get("lang"),
        "is_truncated": twt.get("truncated", False),
        
        # Interaction meta-data
        "favorite_count": twt.get("favorite_count"),
        "retweeted": twt.get("retweeted"),
        "retweet_count": twt.get("retweet_count", 0),
        "mentions_count": len(twt["entities"]["user_mentions"]),        
        
        # Geolocation meta-data
        "coordinates": twt.get("coordinates"),
        
        # user meta-data
        "user.tweets_count": twt["user"]["statuses_count"],
        "user.followers_count": twt["user"]["followers_count"],
        "user.listed_count": twt["user"]["listed_count"],
        "user.friends_count": twt["user"]["friends_count"],
        "user.location": twt["user"]["location"],
        "user.geo_enabled": twt["user"]["geo_enabled"],
        "user.description": twt["user"]["description"],
        "user.created_at": twt["user"]["created_at"],
        "user.default_profile": twt["user"]["default_profile"],
        "user.utf_offset": twt["user"]["utc_offset"],
        "user.profile_users_background_image": twt["user"]["profile_use_background_image"],
        "user.verified": twt["user"]["verified"],
        "user.contributors_enabled": twt["user"]["contributors_enabled"],
        "user.time_zone": twt["user"]["time_zone"]
    }])

charliehebdo = get_event_data("ottawashooting", refresh=True)
charliehebdo.head()