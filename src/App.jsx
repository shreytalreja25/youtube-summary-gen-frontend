import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import './App.css';
import ReactMarkdown from 'react-markdown';  // Import react-markdown

function App() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSummary('');

    try {
      // Backend API call to Flask endpoint
      const response = await fetch('https://youtube-summary-gen-backend.onrender.com/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtube_url: url }), // Corrected body to 'youtube_url'
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      console.log('Error:', err);
      setError('An error occurred while generating the summary. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-900">YouTube Video Summarizer</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4" id='youtube-link-form'>
          <input
            type="url"
            placeholder="Paste YouTube URL here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              'Summarize'
            )}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-md mt-4">
            {error}
          </div>
        )}

        {summary && (
          <div className="bg-white p-6 rounded-md shadow-md mt-4">
            {/* Using ReactMarkdown to render markdown summary */}
            <ReactMarkdown className="text-gray-700 whitespace-pre-wrap">{summary}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
