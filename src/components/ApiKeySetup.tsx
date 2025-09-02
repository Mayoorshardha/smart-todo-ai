import React, { useState } from 'react';
import { Eye, EyeOff, Key } from 'lucide-react';

interface ApiKeySetupProps {
  onApiKeySet: (apiKey: string | null) => void;
  hasApiKey: boolean;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySet, hasApiKey }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('claude-api-key', apiKey.trim());
      onApiKeySet(apiKey.trim());
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem('claude-api-key');
    onApiKeySet(null);
    setApiKey('');
  };

  if (hasApiKey) {
    return (
      <div className="card mb-6 bg-green-50 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">✅ AI categorization enabled</span>
          </div>
          <button onClick={clearApiKey} className="btn-secondary text-sm">
            Change API Key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-6 border-2 border-dashed border-blue-300 bg-blue-50">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">Enable AI Categorization</h3>
      <p className="text-blue-600 mb-4">
        Get your free Claude API key from{' '}
        <a 
          href="https://console.anthropic.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline hover:text-blue-800"
        >
          console.anthropic.com
        </a>
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Claude API key..."
            className="input-field pr-10"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        
        <button type="submit" disabled={!apiKey.trim()} className="btn-primary">
          Save API Key
        </button>
      </form>
      
      <p className="text-xs text-blue-600 mt-3 italic">
        Your API key is stored locally in your browser and never sent to our servers.
      </p>
    </div>
  );
};

export default ApiKeySetup;