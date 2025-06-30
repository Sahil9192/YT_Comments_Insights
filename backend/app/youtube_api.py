import requests
from typing import List
from dotenv import load_dotenv
import os

load_dotenv()
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

def fetch_comments(video_id: str, max_results: int = 50) -> List[str]:
    comments = []
    url = "https://www.googleapis.com/youtube/v3/commentThreads"

    params = {
        "part": "snippet",
        "videoId": video_id,
        "maxResults": max_results,
        "textFormat": "plainText",
        "key": YOUTUBE_API_KEY
    }

    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        for item in data.get("items", []):
            top_comment = item["snippet"]["topLevelComment"]["snippet"]["textDisplay"]
            comments.append(top_comment)
    else:
        print(f"Failed to fetch comments. Status Code: {response.status_code}")

    return comments
