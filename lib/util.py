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
    """ Convert Datetime instance to Unix timestamp """
    return pd.DatetimeIndex(col).astype(np.int64) / 1e6

def parse_twitter_datetime(timestr):
    """ Convert Twitter's datetime format into a Datetime instance """
    return pd.datetime.strptime(timestr, "%a %b %d %H:%M:%S %z %Y")

def fetch_X(thread_level_csv_file_address):
    """ Read a CSV file with thread-level features and drop all column that are not used in prediction.
    
    Note: 
        - Setting engine to "python" helps with large datasets
    
    Params:
        - event {str} the name of the event
    
    Return: a Pandas dataframe
    
    """
    X= pd.read_csv(thread_level_csv_file_address,engine="python")
    X=gw_thrds_without_rumor_tag=X.drop(['event'],axis=1)
    return X

def fetch_thread(event, is_normalized=True):
    """ Return dataset X and results vector y 
    
    Params:
        - event {str} the name of the event in the PHEME dataset
        - is_normalized {bool} returned X matrix as normalized. Deafult is True
    """ 
    X = pd.read_csv("data/threads/%s.csv" % event, engine="python")
    y = X.is_rumor
    X = X.drop(["is_rumor", "thread"], axis=1)
    if is_normalized:
        X = (X - X.mean()) / X.std()
    return X, y
