"""
    @name: util.py
    @description: A module of utility functions used in Jupyter Notebooks
"""

import pandas as pd
import numpy as np

def fetch_tweets(event):
    """ Read a CSV file with cleaned PHEME event tweets
    
    Note: 
        - Setting engine to "python" helps with large datasets
    
    Params:
        - event {str} the name of the event
    
    Return: a Pandas dataframe
    
    """
    return pd.read_csv("data/tweets/%s.csv" % event, 
                 dtype={
                    'tweet_id': str,
                    'in_reply_tweet': str,
                    'thread': str,
                    'user_id': str,
                    'in_reply_user': str
                 },
                 engine="python")

def to_unix_tmsp(col):
    return pd.DatetimeIndex(col).astype(np.int64) / 1e6

def parse_twitter_datetime(timestr):
    return pd.datetime.strptime(timestr, "%a %b %d %H:%M:%S %z %Y")