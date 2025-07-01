import React, { useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend} from 'recharts';

function App() {
  const [videoId, setVideoId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/analyze_comments/?video_id=${videoId}`);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Error fetching sentiment analysis. Please check backend server or video ID.');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#00C49F','#FF8042','#0088FE'];
  const pieData = result ? [
    {name: 'Positive', value: result.sentiment_analysis.positive},
    {name: 'Negative', value: result.sentiment_analysis.negative},
    {name: 'Neutral', value: result.sentiment_analysis.neutral}
  ] : [];

  return (
    <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'Arial' }}>
      <h1>YouTube Comment Sentiment Analyzer </h1>

      <input
        type="text"
        placeholder="Enter YouTube Video ID"
        value={videoId}
        onChange={(e) => setVideoId(e.target.value)}
        style={{ padding: '0.5rem', width: '300px', marginRight: '10px' }}
      />

      <button onClick={handleAnalyze} style={{ padding: '0.5rem 1rem' }}>
        Analyze
      </button>

      {loading && <p>Analyzing... Please wait </p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Sentiment Analysis Results:</h2>
          <p><strong>Total Comments:</strong> {result.total_comments}</p>
          <p><strong>Positive:</strong> {result.sentiment_analysis.positive}</p>
          <p><strong>Negative:</strong> {result.sentiment_analysis.negative}</p>
          <p><strong>Neutral:</strong> {result.sentiment_analysis.neutral}</p>

          <PieChart width={400} height={300}>
            <Pie
              data = {pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      )}
    </div>
  );
}

export default App;
