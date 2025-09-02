import { useState, useEffect } from 'react';
import { Lightbulb, Plus, RefreshCw } from 'lucide-react';
import type { AIServiceInterface, UserProfile, Todo } from '../types';

interface SmartSuggestionsProps {
  aiService: AIServiceInterface | null;
  profile: UserProfile;
  todos: Todo[];
  onAddTodo: (todoText: string) => Promise<void>;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({ 
  aiService, 
  profile, 
  todos, 
  onAddTodo 
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestions = async () => {
    if (!aiService || !profile.name) return;

    setIsLoading(true);
    
    try {
      const completedTasks = todos.filter(t => t.completed).slice(-10);
      const incompleteTasks = todos.filter(t => !t.completed);
      
      const context = {
        profile,
        recentCompletedTasks: completedTasks.map(t => t.text),
        currentIncompleteTasks: incompleteTasks.map(t => t.text),
        timeOfDay: new Date().getHours(),
        dayOfWeek: new Date().getDay()
      };

      const suggestionResult = await aiService.generateSuggestions(context);
      setSuggestions(suggestionResult.suggestions || []);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (aiService && profile.name) {
      generateSuggestions();
    }
  }, [aiService, profile, todos.length]);

  const addSuggestion = async (suggestion: string) => {
    await onAddTodo(suggestion);
    setSuggestions(suggestions.filter(s => s !== suggestion));
  };

  if (!aiService || !profile.name) {
    return null;
  }

  return (
    <div className="card mb-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          <h4 className="text-lg font-semibold">Smart Suggestions</h4>
        </div>
        <button 
          onClick={generateSuggestions} 
          disabled={isLoading}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.slice(0, 3).map((suggestion, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/10 rounded-md backdrop-blur-sm">
              <span className="text-sm flex-1">{suggestion}</span>
              <button 
                onClick={() => addSuggestion(suggestion)}
                className="ml-3 p-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {suggestions.length === 0 && !isLoading && (
        <p className="text-center text-white/80 italic">
          Great job! You seem to be on top of things. 🎉
        </p>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <RefreshCw className="w-5 h-5 animate-spin mr-2" />
          <span>Generating suggestions...</span>
        </div>
      )}
    </div>
  );
};

export default SmartSuggestions;