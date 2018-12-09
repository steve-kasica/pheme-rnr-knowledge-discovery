"""
    @name :pheme_parsing.py
    @description: A Python 3 module for parsing raw data from the PHEME rumor non-rumor dataset and saving it in tabular form
    @author: Steve Kasica <kasica@alumni.cs.ubc.ca>
"""

import os, json, errno, time
import pandas as pd
import numpy as np

def pheme_to_csv(event):
    """ Parses json data stored in directories of the PHEME dataset into a CSV file.
    
    Params:
        - event: Name fake news event and directory name in PHEME dataset
    
    Return: None
    """
    start = time.time()
    dataset = "../raw/pheme-rnr-dataset"
    fn = "../data/pheme-rnr-dataset/%s.csv" % (event)
    header = True
    data = pd.DataFrame()   
    thread_number=0         
    for category in os.listdir("%s/%s" % (dataset, event)):
        for thread in os.listdir("%s/%s/%s" % (dataset, event, category)):
            with open("%s/%s/%s/%s/source-tweet/%s.json" % (dataset, event, category, thread, thread)) as f:
                tweet = json.load(f)
            df = tweet_to_df(tweet, category, thread)
            data = data.append(df)
            thread_number+=1
            for reaction in os.listdir("%s/%s/%s/%s/reactions" % (dataset, event, category, thread)):
                with open("%s/%s/%s/%s/reactions/%s" % (dataset, event, category, thread, reaction)) as f:
                    tweet = json.load(f)
                df = tweet_to_df(tweet, category, thread,False)
                data = data.append(df)
    data.to_csv(fn, index=False)
    print("%s was generated in %s minutes" % (fn, (time.time() - start) / 60))
    return None

def tweet_to_df(twt, cat, thrd, is_source_tweet=False):
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