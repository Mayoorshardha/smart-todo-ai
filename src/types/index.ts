export interface Todo {
  id: number;
  text: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  createdAt: string;
  aiReasoning?: string;
  suggestedTime?: 'morning' | 'afternoon' | 'evening' | 'anytime';
  isRoutine?: boolean;
  fromSuggestion?: boolean;
}

export interface UserProfile {
  name: string;
  workHours: string;
  categories: string[];
  routineTasks: string[];
  priorities: string[];
}

export interface AICategorizationResult {
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  reasoning: string;
  isRoutine?: boolean;
  suggestedTime?: 'morning' | 'afternoon' | 'evening' | 'anytime';
}

export interface AISuggestionsResult {
  suggestions: string[];
}

export interface AIServiceInterface {
  categorizeTodo(todoText: string, profile?: UserProfile): Promise<AICategorizationResult>;
  generateSuggestions(context: SuggestionContext): Promise<AISuggestionsResult>;
}

export interface SuggestionContext {
  profile: UserProfile;
  recentCompletedTasks: string[];
  currentIncompleteTasks: string[];
  timeOfDay: number;
  dayOfWeek: number;
}