# AI Interview Platform

A full-stack AI-powered interview platform that helps users practice and prepare for technical interviews with the help of AI.

## 🚀 Technologies

### Frontend
- React 19 with Vite
- Material-UI (MUI) v7 for UI components
- React Router for navigation
- Axios for API requests
- Framer Motion for animations
- Socket.io Client for real-time communication
- Styled Components for styling

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM (Stores User Auth & Application Data)
- Supabase (Used strictly for File Storage, e.g., Resumes)
- Redis for caching and session management
- WebRTC (Mediasoup / LiveKit) & Socket.io for real-time video/audio
- JSON Web Tokens (JWT) for authentication
- AI / LLM capabilities via LangChain and Google Gemini
- Google Cloud Text-to-Speech & Piper (Local TTS engine)
- PDF parsing for resume analysis

## 🛠️ Project Structure

```
AI-Interview/
├── backendAiInterview/     # Backend server
│   ├── src/                # Source code
│   ├── .env                # Environment variables
│   └── package.json        # Backend dependencies
└── frontendAiInterview/    # Frontend React app
    ├── src/                # Source code
    ├── public/             # Static files
    └── package.json        # Frontend dependencies
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas or local MongoDB instance
- Redis Server (local or hosted)
- Supabase project (for Resume storage)
- Google Cloud credentials (for TTS, optional if using Piper locally)
- Google Gemini API key
- SuFu API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI-Interview
   ```

2. **Backend Setup**
   ```bash
   cd backendAiInterview
   npm install
   # Set up your environment variables
   cp .env.example .env 
   ```
   *Note: The backend automatically runs `setupPiper.sh` on startup to download and configure Piper for local text-to-speech generation.*

3. **Frontend Setup**
   ```bash
   cd ../frontendAiInterview
   npm install
   # Set up your environment variables
   cp .env.template .env
   ```

## 🚦 Running the Application

1. **Start Backend**
   ```bash
   cd backendAiInterview
   npm start
   ```

2. **Start Frontend**
   ```bash
   cd ../frontendAiInterview
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 🔒 Environment Variables

### Backend (`backendAiInterview/.env`)
```env
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credentials.json
GOOGLE_API_KEY=your_gemini_api_key
```

### Frontend (`frontendAiInterview/.env`)
```env
VITE_SUFU_API_KEY=YOUR_SUFU_API_KEY_HERE
```

## 📝 Features

- User authentication (Register/Login via custom JWT and MongoDB)
- AI-powered mock interviews using LangChain & Google Gemini
- **Adaptive Difficulty Selection**: Support for both *Guided Mode* and *Hard Mode*
- **Interactive Assistance**: Ask for question explanations interactively mid-interview
- **Granular Skill-based Analytics**: Detailed post-interview scoring broken down by Technical Knowledge, Problem Solving, and Communication Clarity, alongside AI-suggested answers
- Real-time video/audio handling powered by WebRTC & Socket.io
- Dual TTS capabilities (Google Cloud & Local Piper Models)
- Resume analysis via PDF Parsing (Stored in Supabase)
- Paginated interview history and progress tracking
