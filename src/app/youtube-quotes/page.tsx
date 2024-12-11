
'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

export default function YouTubeQuotes() {
  const [videoUrl, setVideoUrl] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [quotes, setQuotes] = useState<string[]>([]);
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [fullTranscript, setFullTranscript] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showSelection, setShowSelection] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const formatText = (text: string) => {
    return text
      .replace(/&amp;#39;/g, "'")
      .replace(/&amp;quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSelectedQuotes([]);
    setCurrentQuoteIndex(0);
    
    try {
      const response = await fetch('/api/youtube/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl })
      });
      
      const data = await response.json();
      if (data.error) {
        console.error('Error:', data.error);
        alert(data.error);
        return;
      }
      setQuotes(data.quotes || []);
      setFullTranscript(data.fullText || '');
      if (data.metadata) {
        setMetadata(data.metadata);
      }
      setShowSelection(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process video. Please make sure the URL is correct and the video has subtitles enabled.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteSelection = (accepted: boolean) => {
    if (accepted) {
      setSelectedQuotes([...selectedQuotes, quotes[currentQuoteIndex]]);
    }
    if (currentQuoteIndex < quotes.length - 1) {
      setCurrentQuoteIndex(currentQuoteIndex + 1);
    } else {
      setShowSelection(false);
    }
  };

  const exportAsPNG = async () => {
    if (!exportRef.current) return;
    
    const canvas = await html2canvas(exportRef.current, {
      scale: 3, // Increase quality
      logging: false,
      useCORS: true,
      allowTaint: true
    });
    const image = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.href = image;
    link.download = 'youtube-quotes.png';
    link.click();
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">YouTube Quote Extractor</h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter YouTube URL"
          className="w-full p-2 border rounded mb-4"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Processing...' : 'Extract Quotes'}
        </button>
      </form>

      {loading && (
        <div className="text-center mt-4 space-y-2">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <div className="text-lg">Extracting quotes from video...</div>
          <div className="text-sm text-gray-600">This may take a few moments</div>
        </div>
      )}

      {metadata && (
        <div className="mt-6 mb-6 text-center">
          <h2 className="text-xl font-bold mb-4">{metadata.title}</h2>
          <img 
            src={metadata.thumbnail} 
            alt={metadata.title}
            className="mx-auto rounded-lg shadow-lg max-w-full h-auto"
          />
          <p className="mt-2 text-gray-600">{metadata.channelTitle}</p>
        </div>
      )}

      {showSelection && quotes[currentQuoteIndex] && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Select Quotes ({currentQuoteIndex + 1}/{quotes.length})</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-xl mb-6 text-gray-800">{formatText(quotes[currentQuoteIndex])}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleQuoteSelection(false)}
                className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600"
              >
                Skip
              </button>
              <button
                onClick={() => handleQuoteSelection(true)}
                className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
              >
                Keep
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedQuotes.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Selected Quotes</h2>
          <div ref={exportRef} className="bg-white p-8 rounded-lg shadow-lg max-w-2xl">
            {metadata && (
              <div className="mb-8 text-center">
                <img 
                  src={metadata.thumbnail} 
                  alt={metadata.title}
                  className="mx-auto rounded-lg shadow-md mb-4 max-w-full h-auto"
                />
                <h2 className="text-xl font-bold text-gray-800">{metadata.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{metadata.channelTitle}</p>
              </div>
            )}
            {selectedQuotes.map((quote, index) => (
              <div key={index} className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-gray-800 text-sm leading-relaxed font-light tracking-wide">
                  {formatText(quote)}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={exportAsPNG}
            className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Export as PNG
          </button>
        </div>
      )}

      {fullTranscript && (
        <div className="mt-8">
          <details className="w-full">
            <summary className="text-xl font-bold mb-4 cursor-pointer hover:text-gray-600">
              Full Transcript
            </summary>
            <div className="bg-gray-100 p-4 rounded whitespace-pre-line mb-2">
              {formatText(fullTranscript)}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(formatText(fullTranscript));
                alert('Transcript copied to clipboard!');
              }}
              className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy to Clipboard
            </button>
          </details>
        </div>
      )}
    </div>
  );
}
