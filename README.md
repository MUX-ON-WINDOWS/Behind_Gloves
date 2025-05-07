[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)
[![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white)](#)
[![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=fff)](#)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)](#)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=fff)](#)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-886FBF?logo=googlegemini&logoColor=fff)](#)
[![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?logo=vercel&logoColor=white)](#)


# Goalie Vision Charts

A modern web application for analyzing and visualizing hockey goalie performance data, built with React, TypeScript, and Express.

## Project Structure

The project consists of two main parts:
- Frontend: React application with TypeScript and Vite
- Backend: Express.js server with TypeScript

## Frontend Features

- Modern UI built with React and Shadcn UI components
- TypeScript for type safety
- Tailwind CSS for styling
- React Router for navigation
- React Query for data fetching
- Recharts for data visualization
- Form handling with React Hook Form and Zod validation

## Backend Features

- Express.js server with TypeScript
- File upload handling
- Integration with various AI services (Google GenAI, Hugging Face)
- Supabase integration for data storage
- Video processing capabilities with FFmpeg

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- FFmpeg (for video processing features)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd goalie-vision-charts
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

## Development

1. Start the frontend development server:
```bash
npm run dev
```

2. Start the backend server (in a separate terminal):
```bash
cd backend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000`.

## Building for Production

1. Build the frontend:
```bash
npm run build
```

2. Build the backend:
```bash
cd backend
npm run build
```

## Environment Variables

Create a `.env` file in the root directory and backend directory with the following variables:

Frontend `.env`:
```
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Backend `.env`:
```
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
GOOGLE_API_KEY=your_google_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

## Technologies Used

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- React Router
- React Query
- Recharts
- React Hook Form
- Zod

### Backend
- Express.js
- TypeScript
- FFmpeg
- Supabase
- Google GenAI
- Hugging Face

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
