from fastapi import FastAPI
from app.youtube_api import fetch_comments
from app.sentiment_analysis import analyze_sentiment
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message":"YouTube Comments Analyzer Backend Running"}

@app.get("/fetch_comments/")
def get_comments(video_id: str):
    comments = fetch_comments(video_id)
    return {"video_id": video_id, "total_comments_fetched": len(comments), "comments": comments}

@app.get("/analyze_comments/")
def analyze_video_comments(video_id: str):
    comments = fetch_comments(video_id)
    if not comments:
        return {"error": "No comments fetched for this video."}
    
    analysis_results = analyze_sentiment(comments)
    return {
        "video_id": video_id,
        "total_comments": len(comments),
        "sentiment_analysis": analysis_results
    }