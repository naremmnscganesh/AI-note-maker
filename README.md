# Multimodal AI Note-Taker 🧠✍️

A powerful AI-powered application that transforms lecture audio, whiteboard images, and rough notes into structured, high-quality study guides using Google Gemini.

**Project View**
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/08c36a2a-c1a8-4c9a-835b-c9bf497ffc24" />


## 🚀 Features

*   **Multimodal Input**: Accepts Audio (lectures), Images (whiteboards/slides), and Text (scratch notes) simultaneously.
*   **AI Synthesis**: Uses **Google Gemini 1.5/2.5** to understand and fuse information from all sources.
*   **Smart Formatting**: Generates clean Markdown notes with LaTeX support for mathematical formulas ($E=mc^2$).
*   **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS.
*   **Real-time Processing**: Visual feedback during the upload and generation process.

## 🛠️ Tech Stack

*   **Frontend**: Next.js 14, TypeScript, Tailwind CSS, React Markdown, KaTeX
*   **Backend**: FastAPI, Python, Uvicorn
*   **AI Model**: Google Gemini 1.5 Pro / 2.5 Flash
*   **Storage**: Local file handling (MVP)

## 🏁 Getting Started

### Prerequisites

*   Python 3.9+
*   Node.js 18+
*   A Google Gemini API Key (Get one from [Google AI Studio](https://aistudio.google.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/naremmnscganesh/AI-note-maker.git
cd AI-note-maker
```

### 2. Backend Setup

Navigate to the backend folder and install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

**Configure Environment:**
Create a `.env` file in the `backend` directory:

```env
PROJECT_NAME="Multimodal AI Note-Taker"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
MONGODB_URL="mongodb://localhost:27017" 
```

Run the server:

```bash
uvicorn app.main:app --reload
```
The backend will start at `http://localhost:8000`.

### 3. Frontend Setup

Open a new terminal, navigate to the frontend folder:

```bash
cd frontend
npm install
```

Run the development server:

```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

## 📖 Usage

1.  **Upload Audio**: Drag & drop your lecture recording.
2.  **Upload Images**: Select photos of the whiteboard or presentation slides.
3.  **Add Notes**: Paste any rough notes you took during class.
4.  **Generate**: Click "Generate Magic Notes" and watch the AI synthesize a perfect study guide!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
