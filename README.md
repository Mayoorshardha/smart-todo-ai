# 🤖 Smart Todo App with AI Categorization

A modern, AI-powered todo application built with React, TypeScript, and Claude AI. Features intelligent task categorization, personalized suggestions, and a clean, responsive interface.

## ✨ Features

- **AI-Powered Categorization**: Automatically categorizes tasks using Claude AI
- **Smart Suggestions**: Personalized task recommendations based on your patterns
- **User Profiles**: Customize categories, routine tasks, and priority keywords

## 🚀 Live Demo

**🌐 [Try it now: https://smart-todo-ai-nine.vercel.app/](https://smart-todo-ai-nine.vercel.app/)**

## 🎯 How to Use

### 1. Setup Your Profile
- Add your name and work hours
- Define custom categories for your workflow
- List routine tasks you do regularly
- Set priority keywords that matter to you

### 2. Add Tasks
- Simply type your task and press Enter
- AI will automatically categorize and prioritize it
- Context from your profile makes suggestions more accurate

### 3. Smart Suggestions
- AI suggests relevant tasks based on:
  - Your completion patterns
  - Time of day
  - Your routine tasks
  - Current incomplete tasks

### 4. Stay Organized
- Tasks are color-coded by category and priority
- See AI reasoning by hovering over the AI badge
- Mark tasks complete with satisfaction!

## 🎨 Customization

### Adding Custom Categories
The app supports unlimited custom categories. Add them in your profile:
- Work-related: "Client Work", "Admin Tasks"
- Personal: "Side Projects", "Learning"
- Life: "Errands", "Household"

### Priority Keywords
Set words that automatically make tasks high priority:
- "deadline", "urgent", "meeting"
- "client", "presentation", "call"
- Customize based on your work style

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Claude API (Anthropic)
- **Storage**: Browser LocalStorage
- **Deployment**: Vercel
- **Icons**: Lucide React

## 🔧 Development

### Project Structure

```
src/
├── components/          # React components
│   ├── ApiKeySetup.tsx
│   ├── UserProfile.tsx
│   └── SmartSuggestions.tsx
├── hooks/              # Custom React hooks
│   └── useLocalStorage.ts
├── lib/                # Utilities and services
│   ├── aiService.ts
│   └── utils.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main app component
└── main.tsx           # App entry point
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Setup
The app uses browser localStorage, so no environment variables are needed for basic functionality.

### Prerequisites

- Node.js 18+ installed
- Claude API key (free from [console.anthropic.com](https://console.anthropic.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mayoorshardha/smart-todo-ai.git
   cd smart-todo-ai
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Start the backend server**
   ```bash
   cd server
   npm start
   ```
   Server will run on `http://localhost:3001`

5. **Start the frontend (in a new terminal)**
   ```bash
   npm run dev
   ```
   App will run on `http://localhost:5173`

6. **Get your Claude API key**
   - Visit [console.anthropic.com](https://console.anthropic.com/)
   - Sign up for free (no credit card required)
   - Create an API key
   - Add it in the app interface

### Development vs Production

- **Development**: Uses local Express server (`/server`) to avoid CORS issues
- **Production**: Uses Vercel serverless functions for automatic scaling
- **Both**: Use official Anthropic SDK for secure, reliable API communication


## 🚀 Deployment

### Deploy to Vercel (Recommended) - 2 Minutes Setup!

[Deploy to Vercel in 2 minutes](https://vercel.com/new/clone?repository-url=https://github.com/Mayoorshardha/smart-todo-ai) 

#### How Vercel Deployment Works

- **Frontend**: Static files served by Vercel CDN globally
- **API**: `/api/claude` becomes a serverless function automatically
- **CORS**: Handled seamlessly by Vercel infrastructure
- **Scaling**: Automatic based on usage (0 to millions of users)
- **Security**: No server-side API key storage needed

#### No Environment Variables Required!

The app is designed for maximum security:
- ✅ Users enter their Claude API key in the app interface
- ✅ API keys stored in browser localStorage only
- ✅ Each user uses their own Claude API quota
- ✅ No server-side secrets to manage

### Monitoring & Troubleshooting

- **Vercel Dashboard**: View deployment logs and analytics
- **Health Check**: Visit your-app.vercel.app/api/claude (should return "Method not allowed")
- **Common Issues**: Check browser console for any CORS or API errors

**🎯 Recommended**: GitHub → Vercel → Live App (2 minutes total)

## 💡 Tips for Best Results

- Be specific in your task descriptions for better AI categorization
- Update your profile regularly as your workflow changes
- Use consistent language for similar types of tasks
- The AI learns from your patterns over time

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Claude AI](https://claude.ai) by Anthropic
- Icons by [Lucide React](https://lucide.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Built with [Vite](https://vitejs.dev) and [React](https://react.dev)

---

⭐ If you found this project helpful, please consider giving it a star on GitHub!