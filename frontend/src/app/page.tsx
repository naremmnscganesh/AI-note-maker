"use client";

import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function Home() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [notesText, setNotesText] = useState("");
  const [status, setStatus] = useState("idle"); // idle, uploading, processing, complete, error
  const [jobId, setJobId] = useState<string | null>(null);
  const [generatedNotes, setGeneratedNotes] = useState<any>(null);

  const handleUpload = async () => {
    if (!audioFile && !imageFiles && !notesText) {
      alert("Please provide at least one input (audio, image, or text).");
      return;
    }

    setStatus("uploading");
    const formData = new FormData();
    if (audioFile) formData.append("audio", audioFile);
    if (imageFiles) {
      Array.from(imageFiles).forEach((file) => formData.append("images", file));
    }
    formData.append("notes", notesText);

    try {
      const res = await fetch("http://localhost:8000/api/v1/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setJobId(data.job_id);
        setStatus("processing");
        pollNotes(data.job_id);
      } else {
        setStatus("error");
        alert("Upload failed");
      }
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  const pollNotes = async (id: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/notes/${id}`);
        if (res.ok) {
          const data = await res.json();
          setGeneratedNotes(data);
          setStatus("complete");
          clearInterval(interval);
        } else {
          // 404 means still processing usually
          console.log("Still processing...");
        }
      } catch (e) {
        console.error(e);
        clearInterval(interval);
        setStatus("error");
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <header className="mb-16 text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            Multimodal AI Note-Taker
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Drag and drop your lecture audio, whiteboard photos, and messy scribbles.
            We'll synthesize them into perfect study guides.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Input Section */}
          <section className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col gap-8 transition-all hover:shadow-2xl">

            {/* Audio Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Lecture Audio</label>
              <div className="relative group">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={e => setAudioFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer border border-dashed border-gray-300 rounded-xl p-4 group-hover:border-indigo-400 transition-colors"
                />
              </div>
            </div>

            {/* Image Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Whiteboard / Slides</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={e => setImageFiles(e.target.files)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 cursor-pointer border border-dashed border-gray-300 rounded-xl p-4 hover:border-pink-400 transition-colors"
              />
            </div>

            {/* Text Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Your Scratch Notes</label>
              <textarea
                value={notesText}
                onChange={e => setNotesText(e.target.value)}
                placeholder="Paste your rough notes here..."
                className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none text-gray-700 bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Action Button */}
            <button
              onClick={handleUpload}
              disabled={status === 'uploading' || status === 'processing'}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'idle' && "Generate Magic Notes ✨"}
              {status === 'uploading' && "Uploading..."}
              {status === 'processing' && "Synthesizing... (this may take a minute)"}
              {status === 'complete' && "Generate Another"}
              {status === 'error' && "Try Again"}
            </button>
          </section>

          {/* Output Section */}
          <section className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 min-h-[600px] flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              Notes
              {status === 'complete' && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Ready</span>}
            </h2>

            <div className="flex-grow bg-gray-50 rounded-xl p-6 overflow-y-auto max-h-[600px] prose prose-indigo max-w-none">
              {status === 'idle' && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <p>Your generated notes will appear here.</p>
                </div>
              )}

              {status === 'processing' && (
                <div className="h-full flex flex-col items-center justify-center text-indigo-500 animate-pulse">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                  <p className="font-medium">Analyzing inputs...</p>
                </div>
              )}

              {status === 'error' && (
                <div className="h-full flex flex-col items-center justify-center text-red-500">
                  <p>Something went wrong. Please check the backend.</p>
                </div>
              )}

              {status === 'complete' && generatedNotes && (
                <div className="markdown-preview prose prose-indigo max-w-none dark:prose-invert">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {generatedNotes.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
