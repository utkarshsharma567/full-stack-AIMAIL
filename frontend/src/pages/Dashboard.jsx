import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/ai/generate-email', { prompt });
      setResult(data);
      toast.success('Generated successfully!');
    } catch (error) {
      toast.error('Failed to generate.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success('Copied!');
    setTimeout(() => setCopied(''), 1500);
  };

  const ResultCard = ({ title, content, type }) => (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-2xl mb-4 hover:border-green-500/30 transition">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-white">{title}</h3>
        <button
          onClick={() => copyToClipboard(content, type)}
          className="text-gray-400 hover:text-green-400 transition"
        >
          {copied === type ? (
            <CheckIcon className="w-5 h-5 text-green-400" />
          ) : (
            <ClipboardDocumentIcon className="w-5 h-5" />
          )}
        </button>
      </div>
      <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
        {content}
      </p>
    </div>
  );

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* LEFT PANEL */}
        <div className="w-full lg:w-1/3 bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-2xl flex flex-col">
          <h2 className="text-lg font-semibold mb-4">New Campaign</h2>
          <form onSubmit={handleGenerate} className="flex flex-col flex-1">
            <label className="text-sm text-gray-400 mb-2">Prompt / Context</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Write a cold email to a SaaS founder about improving retention using AI..."
              className="flex-1 w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="mt-4 w-full py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/30 transition disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </form>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full lg:w-2/3 flex flex-col overflow-y-auto pr-1">
          {result ? (
            <>
              <h2 className="text-lg font-semibold mb-4">AI Results</h2>
              <ResultCard title="Subject Line" content={result.subject} type="subject" />
              <ResultCard title="Cold Email" content={result.emailBody} type="email" />
              <ResultCard title="LinkedIn DM" content={result.linkedInDM} type="linkedin" />
              <ResultCard title="Follow-up Email" content={result.followUpEmail} type="followup" />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center border border-white/10 rounded-2xl bg-white/5 text-gray-500">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                <ClipboardDocumentIcon className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-sm">Start by entering a prompt to generate content</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;