"use client";
import { useState } from "react";

const PURPOSES: any = {
  "Software / הייטק": ["javascript", "python", "react", "node", "sql", "git", "api", "cloud"],
  "Marketing / שיווק": ["campaign", "seo", "social", "content", "analytics", "brand", "conversion"],
  "Finance / כספים": ["excel", "financial", "budget", "analysis", "audit", "accounting", "forecast"],
  "Design / עיצוב": ["figma", "photoshop", "ui", "ux", "portfolio", "illustrator", "prototype"],
  "General / כללי": ["experience", "skills", "education", "leadership", "communication"],
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [purpose, setPurpose] = useState("Software / הייטק");
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);

  const login = () => {
    if (!email.includes("@") || !email.includes(".")) {
      alert("Please enter a valid email");
      return;
    }
    setLoggedIn(true);
  };

  const checkResume = () => {
    if (text.trim().length < 50) {
      alert("Please paste a longer resume - at least a few lines");
      return;
    }
    const lower = text.toLowerCase();
    const issues: string[] = [];
    let score = 0;

    // Length
    const words = text.trim().split(/\s+/).length;
    if (words < 100) { issues.push(`Too short - only ${words} words. A good resume should have 300-600 words.`); }
    else if (words > 800) { issues.push(`Too long - ${words} words. Recruiters spend 7 seconds, keep it concise.`); }
    else { score += 20; }

    // Contact
    if (!lower.includes("@") && !lower.includes("phone") && !lower.includes("linkedin")) {
      issues.push("Missing contact info - add email, phone or LinkedIn.");
    } else score += 10;

    // Sections
    if (!lower.includes("experience")) { issues.push("Missing 'Experience' section - this is the most important part."); }
    else score += 15;
    if (!lower.includes("education")) { issues.push("Missing 'Education' section."); }
    else score += 10;
    if (!lower.includes("skills")) { issues.push("Missing 'Skills' section - recruiters search by keywords."); }
    else score += 10;

    // Keywords for purpose
    const keywords = PURPOSES[purpose];
    const found = keywords.filter((k: string) => lower.includes(k));
    const missing = keywords.filter((k: string) => !lower.includes(k));
    if (found.length < 2) {
      issues.push(`For ${purpose} you are missing keywords like: ${missing.slice(0, 4).join(", ")}`);
    } else score += 20;

    // Action verbs
    const verbs = ["achieved", "improved", "led", "built", "increased", "managed", "created"];
    const hasVerbs = verbs.some(v => lower.includes(v));
    if (!hasVerbs) issues.push("Use strong action verbs: Achieved, Improved, Led, Built, Increased...");
    else score += 10;

    // Numbers
    if (!/\d+%|\d+/.test(text)) issues.push("Add numbers - e.g. 'Increased sales by 30%' is much stronger than 'Increased sales'.");
    else score += 5;

    if (issues.length === 0) issues.push("Excellent! Your resume looks professional and complete.");

    setResult({ score: Math.min(score, 100), issues, found, words });
  };

  if (!loggedIn) {
    return (
      <div className="login-wrap">
        <div className="login-card">
          <div className="logo">✓ ResumeCheck</div>
          <h1>Engineered for Everyone</h1>
          <p className="sub">Get a professional, AI-powered review of your resume in 10 seconds.</p>
          <label>Enter your email to start</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          <button onClick={login}>Continue - It's Free →</button>
          <span className="small">No spam. Your resume stays private.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <header><div className="logo">✓ ResumeCheck</div><div className="user">{email} • <span onClick={() => setLoggedIn(false)}>Logout</span></div></header>
      <div className="container">
        <h1>Check Your Resume</h1>
        <p className="sub">Select your target role, paste your resume, get a real score + fixes.</p>
        <label>What is this resume for?</label>
        <div className="purposes">
          {Object.keys(PURPOSES).map(p => (
            <button key={p} className={purpose === p ? "pill active" : "pill"} onClick={() => setPurpose(p)}>{p}</button>
          ))}
        </div>
        <label>Paste your resume here</label>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder={"Example:\nJohn Doe - Software Engineer\nEmail: john@gmail.com | LinkedIn...\n\nExperience...\nEducation...\nSkills: React, Python..."} />
        <button className="check-btn" onClick={checkResume}>Analyze My Resume →</button>

        {result && (
          <div className="result">
            <div className="score-box">
              <div className="score-num" style={{ color: result.score >= 80 ? "#16a34a" : result.score >= 50 ? "#ea580c" : "#dc2626" }}>{result.score}<span>/100</span></div>
              <div>
                <b>{result.score >= 80 ? "Excellent - Ready to send!" : result.score >= 50 ? "Good start, needs fixes" : "Needs major improvements"}</b>
                <p>{result.words} words • {result.found.length} relevant keywords found for {purpose}</p>
              </div>
            </div>
            <h3>What to fix:</h3>
            {result.issues.map((iss: string, i: number) => (
              <div key={i} className="issue">⚠️ {iss}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
