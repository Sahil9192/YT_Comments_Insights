from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

model_name = "cardiffnlp/twitter-roberta-base-offensive"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

def detect_toxicity(comments):
    toxic_count = 0
    results = []

    for comment in comments:
        inputs = tokenizer(comment, return_tensors="pt", truncation=True)
        outputs = model(**inputs)
        scores = torch.nn.functional.softmax(outputs.logits, dim=1)
        toxic_prob = scores[0][1].item()
        is_toxic = toxic_prob > 0.5
        if is_toxic:
            toxic_count += 1

        results.append({
            "comment":comment,
            "is_toxic":is_toxic,
            "confidence":round(toxic_prob,3)
        })

    return {
        "total":len(comments),
        "toxic":toxic_count,
        "non_toxic":len(comments) - toxic_count,
        "details": results
    }
