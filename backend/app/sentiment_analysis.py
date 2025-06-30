from textblob import TextBlob
from typing import List, Dict

def analyze_sentiment(comments: List[str]) -> Dict:
    results = {"positive": 0, "negative": 0, "neutral": 0, "detailed":[]}

    for comment in comments:
        blob = TextBlob(comment)
        polarity = blob.sentiment.polarity
        if polarity > 0:
            sentiment = "positive"
            results["positive"] += 1
        elif polarity < 0:
            sentiment = "negative"
            results["negative"] += 1
        else:
            sentiment = "neutral"
            results["neutral"] += 1

        results["detailed"].append({
            "comment": comment,
            "sentiment": sentiment,
            "polarity": polarity
        })
    
    total = len(comments)
    if total > 0:
        results["percentages"] = {
            "positive": (results["positive"] / total) * 100,
            "negative": (results["negative"] / total) * 100,
            "neutral": (results["neutral"] / total) * 100

        }

    return results