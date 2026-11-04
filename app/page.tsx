"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [score, setScore] = useState<number | null>(null);

  const checkResume = () => {
    let s = 50;
    if (text.length > 200) s += 20;
    if (text.toLowerCase().includes("experience")) s += 10;
    if (text.toLowerCase().includes("skills")) s += 10;
    if (text.toLowerCase().includes("education")) s += 10;
    setScore(Math.min(s, 100));
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 20, background: "white", borderRadius: 12 }}>
      <h1>ResumeCheck - Engineered for Everyone</h1>
      <p>Paste your resume and get a score</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your resume here..."
        style={{ width: "100%", height: 200, padding: 12, borderRadius: 8 }}
      />
      <button onClick={checkResume} style={{ marginTop: 12, padding: "12px 24px", background: "black", color: "white", borderRadius: 8, cursor: "pointer" }}>
        Check My Resume
      </button>
      {score !== null && (
        <div style={{ marginTop: 20, fontSize: 24 }}>
          Your Score: <b>{score}/100</b>
        </div>
      )}
    </div>
  );
}
