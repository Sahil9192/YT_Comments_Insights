from wordcloud import WordCloud
import matplotlib.pyplot as plt
import io
import base64
from typing import List

def generate_wordcloud(comments: List[str]) -> str:
    text = ' '.join(comments)
    wordcloud = WordCloud(width=800, height=400, background_color='white').generate(text)

    img_buffer = io.BytesIO()
    plt.figure(figsize=(10, 5))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis('off')
    plt.tight_layout(pad=0)
    plt.savefig(img_buffer, format='png')
    plt.close()

    img_buffer.seek(0)
    img_base64 = base64.b64encode(img_buffer.getvalue()).decode('utf-8')
    return img_base64