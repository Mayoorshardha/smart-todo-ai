import type { AIServiceInterface, AICategorizationResult, AISuggestionsResult, UserProfile, SuggestionContext } from '../types';

// Use different endpoints for development vs production
const CLAUDE_API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api/claude' : 'http://localhost:3001/api/claude');

export class AIService implements AIServiceInterface {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async categorizeTodo(todoText: string, profile: UserProfile = {} as UserProfile): Promise<AICategorizationResult> {
    try {
      const customCategories = profile.categories || [];
      const priorityKeywords = profile.priorities || [];
      const routineTasks = profile.routineTasks || [];

      const prompt = this.buildCategorizationPrompt(todoText, profile, customCategories, priorityKeywords, routineTasks);
      const response = await this.makeAPICall(prompt, 300);
      return this.parseCategorizationResponse(response);
    } catch (error) {
      console.error('AI categorization failed:', error);
      return this.getDefaultCategorization();
    }
  }

  async generateSuggestions(context: SuggestionContext): Promise<AISuggestionsResult> {
    try {
      const prompt = this.buildSuggestionsPrompt(context);
      const response = await this.makeAPICall(prompt, 400);
      return this.parseSuggestionsResponse(response);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      return { suggestions: [] };
    }
  }

  private buildCategorizationPrompt(
    todoText: string,
    profile: UserProfile,
    customCategories: string[],
    priorityKeywords: string[],
    routineTasks: string[]
  ): string {
    return `Analyze this todo item for ${profile.name || 'the user'} and categorize it appropriately with their personal context.

Todo: "${todoText}"

User's Custom Categories: ${customCategories.join(', ') || 'None'}
User's Priority Keywords: ${priorityKeywords.join(', ') || 'None'}
User's Routine Tasks: ${routineTasks.join(', ') || 'None'}
User's Work Hours: ${profile.workHours || 'Not specified'}

Please respond with ONLY a JSON object in this exact format:
{
  "category": "Work|Personal|Health|Shopping|Education|Finance|Home|${customCategories.join('|')}|Other",
  "priority": "High|Medium|Low",
  "reasoning": "Brief explanation considering user's personal context",
  "isRoutine": false,
  "suggestedTime": "morning|afternoon|evening|anytime"
}

Priority Logic:
- High if contains user's priority keywords: ${priorityKeywords.join(', ')}
- High if it's work-related and during user's work hours
- Medium/Low based on urgency and user patterns

Category Logic:
- Use user's custom categories when appropriate: ${customCategories.join(', ')}
- Check if this matches any of their routine tasks: ${routineTasks.join(', ')}
- Default to standard categories if no custom match`;
  }

  private buildSuggestionsPrompt(context: SuggestionContext): string {
    const { profile, recentCompletedTasks, currentIncompleteTasks, timeOfDay, dayOfWeek } = context;

    return `Generate 3-5 personalized task suggestions for ${profile.name} based on their context.

User Profile:
- Name: ${profile.name}
- Work Hours: ${profile.workHours}
- Custom Categories: ${profile.categories?.join(', ') || 'None'}
- Routine Tasks: ${profile.routineTasks?.join(', ') || 'None'}
- Priority Keywords: ${profile.priorities?.join(', ') || 'None'}

Recent Context:
- Recently completed: ${recentCompletedTasks.join(', ') || 'None'}
- Current incomplete tasks: ${currentIncompleteTasks.join(', ') || 'None'}
- Current time: ${timeOfDay}:00 (${timeOfDay < 12 ? 'morning' : timeOfDay < 17 ? 'afternoon' : 'evening'})
- Day of week: ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]}

Please suggest tasks that:
1. Complement their incomplete tasks
2. Match their routine tasks if appropriate for the time
3. Consider the time of day and day of week
4. Are realistic and actionable
5. Fit their work schedule and personal patterns

Respond with ONLY a JSON object:
{
  "suggestions": ["task1", "task2", "task3", "task4", "task5"]
}`;
  }

  private async makeAPICall(prompt: string, maxTokens: number): Promise<any> {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: maxTokens,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private parseCategorizationResponse(data: any): AICategorizationResult {
    const content = data.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Could not parse AI response');
  }

  private parseSuggestionsResponse(data: any): AISuggestionsResult {
    const content = data.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { suggestions: [] };
  }

  private getDefaultCategorization(): AICategorizationResult {
    return {
      category: 'Other',
      priority: 'Medium',
      reasoning: 'AI categorization failed, using defaults',
      isRoutine: false,
      suggestedTime: 'anytime'
    };
  }
}