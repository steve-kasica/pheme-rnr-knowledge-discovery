"""
    to_beeswarm.py
"""

from pheme_parsing import Tweets, pheme_to_csv
from sys import argv

class TweetData(Tweets):

    def append(self, twt, cat, thrd, is_src):

        features = {
            "text": lambda obj: obj["text"],
            "is_rumor": lambda obj : 1 if cat == "rumours" else 0,
            "user.handle": lambda obj: obj["user"].get("screen_name"),
            "created": lambda obj : self.datestr_to_tmsp(obj.get("created_at")),
        }

        for col in features:
            self.data.setdefault(col, []).append(features[col](twt))

if __name__ == "__main__":
    event = argv[1]
    output_dir = 'data/beeswarm'
    pheme_to_csv(event, TweetData, output_dir)
