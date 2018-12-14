"""
    to_beeswarm.py
"""

from util import fetch_tweets, to_unix_tmsp
from sys import argv
import pandas as pd

def main(event):
    fn = "data/tweets/%s.csv" % event
    out = "data/beeswarm/%s.csv" % event
    twts = pd.read_csv(fn, engine="python")
    twts = twts[["text", "user.handle", "user.name", "is_rumor", "created"]]
    twts.to_csv(out, index=False)
    return out

if __name__ == "__main__":
    filename = main(argv[1])
    print("Successfully output %s" % filename)

