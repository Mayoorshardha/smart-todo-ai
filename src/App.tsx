import { useState, useEffect } from 'react';
import { Plus, Trash2, Sparkles, Check } from 'lucide-react';
import { AIService } from './lib/aiService';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Todo, UserProfile } from './types';
import { cn, getCategoryColor, getPriorityColor } from './lib/utils';
import ApiKeySetup from './components/ApiKeySetup';
import UserProfileComponent from './components/UserProfile';
import SmartSuggestions from './components/SmartSuggestions';

const defaultProfile: UserProfile = {
  name: '',
  workHours: '9-17',
  categories: [],
  routineTasks: [],
  priorities: []
};

function App() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('smart-todos', []);
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('user-profile', defaultProfile);
  const [newTodo, setNewTodo] = useState('');
  const [aiService, setAiService] = useState<AIService | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize AI service if API key exists
  useEffect(() => {
    const apiKey = localStorage.getItem('claude-api-key');
    if (apiKey) {
      setAiService(new AIService(apiKey));
    }
  }, []);

  const handleApiKeySet = (apiKey: string | null) => {
    if (apiKey) {
      setAiService(new AIService(apiKey));
    } else {
      setAiService(null);
    }
  };

  const addTodo = async (todoText: string = newTodo) => {
    if (!todoText.trim()) return;

    setIsProcessing(true);

    const todo: Todo = {
      id: Date.now(),
      text: todoText,
      category: 'Processing...',
      priority: 'Medium',
      completed: false,
      createdAt: new Date().toISOString(),
      fromSuggestion: todoText !== newTodo
    };

    // Add todo immediately for better UX
    setTodos(prevTodos => [...prevTodos, todo]);
    if (todoText === newTodo) {
      setNewTodo('');
    }

    // Get AI categorization if service is available
    if (aiService) {
      try {
        const aiResult = await aiService.categorizeTodo(todoText, userProfile);

        // Update the todo with AI results
        setTodos(prevTodos =>
          prevTodos.map(t =>
            t.id === todo.id
              ? {
                ...t,
                category: aiResult.category,
                priority: aiResult.priority,
                aiReasoning: aiResult.reasoning,
                suggestedTime: aiResult.suggestedTime,
                isRoutine: aiResult.isRoutine
              }
              : t
          )
        );
      } catch (error) {
        console.error('AI categorization failed:', error);
        // Fallback to default categorization
        setTodos(prevTodos =>
          prevTodos.map(t =>
            t.id === todo.id
              ? { ...t, category: 'Other' }
              : t
          )
        );
      }
    } else {
      // No AI service, use default
      setTodos(prevTodos =>
        prevTodos.map(t =>
          t.id === todo.id
            ? { ...t, category: 'Other' }
            : t
        )
      );
    }

    setIsProcessing(false);
  };

  const deleteTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleProfileUpdate = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              borderRadius: '1rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <Sparkles style={{ width: '2rem', height: '2rem', color: 'white' }} />
            </div>
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #ffffff, #f1f5f9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              Smart Todo
            </h1>
          </div>
          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '2rem',
            fontWeight: '300'
          }}>
            AI-powered task management with smart categorization and personalization
          </p>
          {totalCount > 0 && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1.5rem',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '2rem',
              padding: '1rem 2rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  backgroundColor: '#10b981',
                  borderRadius: '50%'
                }}></div>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  {completedCount} completed
                </span>
              </div>
              <div style={{
                width: '1px',
                height: '1rem',
                backgroundColor: '#d1d5db'
              }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%'
                }}></div>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  {totalCount - completedCount} remaining
                </span>
              </div>
              <div style={{
                width: '1px',
                height: '1rem',
                backgroundColor: '#d1d5db'
              }}></div>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 'bold',
                color: '#4f46e5'
              }}>
                {Math.round((completedCount / totalCount) * 100)}% done
              </span>
            </div>
          )}
        </div>

        <ApiKeySetup onApiKeySet={handleApiKeySet} hasApiKey={!!aiService} />

        <UserProfileComponent
          profile={userProfile}
          onProfileUpdate={handleProfileUpdate}
        />

        <SmartSuggestions
          aiService={aiService}
          profile={userProfile}
          todos={todos}
          onAddTodo={addTodo}
        />

        {/* Add Todo Input */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '1.5rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            <Plus style={{ width: '1.5rem', height: '1.5rem', color: '#4f46e5' }} />
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: 0
            }}>
              Add New Task
            </h2>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); addTodo(); }} style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder={aiService ? "✨ Add a task (AI will categorize it automatically)..." : "Add a new task..."}
              disabled={isProcessing}
              style={{
                flex: 1,
                padding: '1rem 1.5rem',
                border: '2px solid #e5e7eb',
                borderRadius: '1rem',
                fontSize: '1.125rem',
                outline: 'none',
                transition: 'all 0.2s',
                backgroundColor: 'white'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#4f46e5';
                e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="submit"
              disabled={isProcessing || !newTodo.trim()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 2rem',
                background: isProcessing || !newTodo.trim() 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: 'white',
                border: 'none',
                borderRadius: '1rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isProcessing || !newTodo.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!isProcessing && newTodo.trim()) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(79, 70, 229, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(79, 70, 229, 0.3)';
              }}
            >
              {isProcessing ? (
                <Sparkles style={{ width: '1.25rem', height: '1.25rem', animation: 'spin 1s linear infinite' }} />
              ) : (
                <Plus style={{ width: '1.25rem', height: '1.25rem' }} />
              )}
              {isProcessing ? 'Processing...' : 'Add Task'}
            </button>
          </form>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="card mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 animate-pulse">
            <div className="flex items-center gap-4 text-blue-700">
              <div className="p-2 bg-blue-100 rounded-full">
                <Sparkles className="w-5 h-5 animate-spin text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">AI is analyzing your task...</p>
                <p className="text-sm text-blue-600">Determining category, priority, and optimal timing</p>
              </div>
            </div>
          </div>
        )}

        {/* Todos List */}
        {todos.length > 0 && (
          <div className="mb-8">
            <h2 className="section-header mb-6">
              <span className="text-2xl">📋</span>
              Your Tasks
              <span className="ml-auto text-sm font-normal text-gray-500">
                {todos.length} total
              </span>
            </h2>
            <div className="space-y-4">
              {todos.map(todo => (
                <div
                  key={todo.id}
                  className={cn(
                    "card-compact transition-all duration-300 hover:scale-[1.02]",
                    todo.completed && "opacity-70 bg-gray-50",
                    todo.fromSuggestion && "border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-white",
                    !todo.completed && "hover:shadow-lg"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleComplete(todo.id)}
                      className={cn(
                        "mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 hover:scale-110",
                        todo.completed
                          ? "bg-green-500 border-green-500 text-white shadow-md"
                          : "border-gray-300 hover:border-green-400 hover:bg-green-50"
                      )}
                    >
                      {todo.completed && <Check className="w-4 h-4" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-lg font-medium break-words mb-3",
                        todo.completed ? "line-through text-gray-500" : "text-gray-900"
                      )}>
                        {todo.text}
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn(
                          "badge font-semibold",
                          getCategoryColor(todo.category)
                        )}>
                          {todo.category}
                        </span>

                        <span className={cn(
                          "badge font-semibold",
                          getPriorityColor(todo.priority)
                        )}>
                          {todo.priority} Priority
                        </span>

                        {todo.isRoutine && (
                          <span className="badge bg-cyan-100 text-cyan-800 font-semibold">
                            🔄 Routine
                          </span>
                        )}

                        {todo.suggestedTime && todo.suggestedTime !== 'anytime' && (
                          <span className="badge bg-purple-100 text-purple-800 font-semibold">
                            ⏰ {todo.suggestedTime}
                          </span>
                        )}

                        {todo.aiReasoning && (
                          <span
                            className="badge bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 cursor-help font-semibold"
                            title={todo.aiReasoning}
                          >
                            🤖 AI Analyzed
                          </span>
                        )}

                        {todo.fromSuggestion && (
                          <span className="badge bg-purple-100 text-purple-800 font-semibold">
                            ✨ AI Suggested
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {todos.length === 0 && (
          <div className="card text-center py-16 bg-gradient-to-br from-blue-50 to-purple-50 border-dashed border-2 border-blue-200">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to get organized?</h3>
              <p className="text-gray-600 mb-6 text-lg">Add your first task above and let AI help you stay productive!</p>
              {aiService && (
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <p className="text-blue-700 font-semibold flex items-center justify-center gap-2">
                    <span className="text-2xl">🤖</span>
                    AI categorization is ready to help organize your tasks
                  </p>
                </div>
              )}
              {!aiService && (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <p className="text-yellow-800 font-medium">
                    💡 Set up your API key above to enable AI-powered task categorization
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;