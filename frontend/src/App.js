import React, { useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

function App() {
  const [videoId, setVideoId] = useState('');
  const [result, setResult] = useState(null);
  const [toxicData, setToxicData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const COLORS = ['#00C49F', '#FF8042', '#0088FE']; // Sentiment colors
  const TOXIC_COLORS = ['#FF4C4C', '#4CAF50']; // Toxic / Non-toxic

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    setToxicData(null);

    try {
      const [sentimentRes, toxicRes] = await Promise.all([
        axios.get(`http://127.0.0.1:8000/analyze_comments/?video_id=${videoId}`),
        axios.get(`http://127.0.0.1:8000/detect_toxic/?video_id=${videoId}`)
      ]);
      setResult(sentimentRes.data);
      setToxicData(toxicRes.data);
    } catch (err) {
      console.error(err);
      setError('Error fetching data. Please check backend server or video ID.');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!toxicData) return;

    const csv = [
      ['Comment', 'Toxic', 'Confidence'],
      ...toxicData.comments.map((c) => [
        c.comment.replace(/"/g, '""'),
        c.is_toxic ? 'Toxic' : 'Non-Toxic',
        c.confidence.toFixed(2),
      ]),
    ]
      .map((row) => row.map(String).map((val) => `"${val}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'toxicity_report.csv';
    a.click();
  };

  const pieData = result
    ? [
        { name: 'Positive', value: result.sentiment_analysis.positive },
        { name: 'Negative', value: result.sentiment_analysis.negative },
        { name: 'Neutral', value: result.sentiment_analysis.neutral },
      ]
    : [];

  const toxicityPieData = toxicData
    ? [
        { name: 'Toxic', value: toxicData.toxic_count },
        { name: 'Non-Toxic', value: toxicData.non_toxic_count },
      ]
    : [];

  return (
    <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'Arial' }}>
      <h1>YouTube Comment Sentiment Analyzer</h1>

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

      {loading && <p>Analyzing... Please wait</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* SENTIMENT SECTION */}
      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Sentiment Analysis Results:</h2>
          <p><strong>Total Comments:</strong> {result.total_comments}</p>
          <p><strong>Positive:</strong> {result.sentiment_analysis.positive}</p>
          <p><strong>Negative:</strong> {result.sentiment_analysis.negative}</p>
          <p><strong>Neutral:</strong> {result.sentiment_analysis.neutral}</p>

          <PieChart width={400} height={300}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
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

      {/* TOXICITY SECTION */}
      {toxicData && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Toxicity Detection Results:</h2>
          <p><strong>Total Comments:</strong> {toxicData.total_comments}</p>
          <p><strong>Toxic:</strong> {toxicData.toxic_count}</p>
          <p><strong>Non-Toxic:</strong> {toxicData.non_toxic_count}</p>

          <PieChart width={400} height={300}>
            <Pie
              data={toxicityPieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {toxicityPieData.map((entry, index) => (
                <Cell key={`toxicity-${index}`} fill={TOXIC_COLORS[index % TOXIC_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>

          <button onClick={downloadCSV} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Export Toxicity Report
          </button>

          <h3 style={{ marginTop: '2rem' }}>Toxic Comment Details:</h3>
          <table style={{ margin: '0 auto', borderCollapse: 'collapse' }} border="1">
            <thead>
              <tr>
                <th style={{ padding: '8px' }}>Comment</th>
                <th style={{ padding: '8px' }}>Toxic?</th>
                <th style={{ padding: '8px' }}>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {toxicData.comments.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '8px', maxWidth: '300px' }}>{item.comment}</td>
                  <td style={{ padding: '8px', color: item.is_toxic ? 'red' : 'green' }}>
                    {item.is_toxic ? 'Toxic' : 'Non-Toxic'}
                  </td>
                  <td style={{ padding: '8px' }}>{item.confidence.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
