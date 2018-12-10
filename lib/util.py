"""
    @name: util.py
    @description: A module of utility functions used in Jupyter Notebooks
    @author: Steve Kasica <kasica@alumni.cs.ubc.ca>
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
                    'is_source_tweet': np.bool,
                    'is_rumor': np.bool,
                    'is_truncated': np.bool,
                    'user.verified': np.bool,
                    'user.default_pic': np.bool,
                    "has_smile_emoji": np.bool,
                    'user.has_bg_img': np.bool,
                    'tweet_id': str,
                    'in_reply_tweet': str,
                    'thread': str,
                    'user_id': str,
                    'in_reply_user': str
                 },
                 parse_dates=['created', 'user.created_at'],
                 date_parser=lambda timestr: pd.datetime.strptime(timestr, "%a %b %d %H:%M:%S %z %Y"),
                 engine="python")

def to_unix_tmsp(col):
    return pd.DatetimeIndex(col).astype(np.int64) / 1e6