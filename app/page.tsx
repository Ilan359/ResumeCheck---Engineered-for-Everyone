"use client";
import { useState } from "react";

const PURPOSES = ["Software / הייטק", "Marketing / שיווק", "Finance / כספים", "Design / עיצוב", "General / כללי"];

export default function Home() {
  const [fileName, setFileName] = useState("");
  const [text, setText] = useState("");
  const [purpose, setPurpose] = useState("Software / הייטק");
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [drag, setDrag] = useState(false);

  const handleFile = async (f: File | undefined) => {
    if (!f) return;
    setFileName(f.name);
    const t = await f.text().catch(() => "");
    // For PDF, text() won't work perfectly, so we use file name + allow paste as fallback
    if (t && t.length > 50) setText(t);
    else setText(`Resume file: ${f.name}\n\nPlease paste your resume text below if the file is PDF, or continue with manual check.\n\n`);
  };

  const onAnalyzeClick = () => {
    if (!text.trim() && !fileName) {
      alert("Please upload your resume first");
      return;
    }
    if (!isLogged) {
      setShowPopup(true);
      return;
    }
    runCheck();
  };

  const register = () => {
    if (!email.includes("@") || !email.includes(".")) {
      alert("Please enter a valid email");
      return;
    }
    setIsLogged(true);
    setShowPopup(false);
    setTimeout(runCheck, 200);
  };

  const runCheck = () => {
    const lower = text.toLowerCase();
    const issues: string[] = [];
    let score = 0;
    const words = text.trim().split(/\s+/).length;

    if (words < 100) issues.push(`Too short - only ${words} words. Aim for 300-600 words.`);
    else if (words > 800) issues.push(`Too long - ${words} words. Recruiters spend only 7 seconds.`);
    else score += 20;

    if (!lower.includes("@") && !lower.includes("linkedin") && !lower.includes("phone")) {
      issues.push("Missing contact info - add email, phone or LinkedIn.");
    } else score += 10;

    if (!lower.includes("experience")) issues.push("Missing 'Experience' section - the most important part.");
    else score += 15;
    if (!lower.includes("education")) issues.push("Missing 'Education' section.");
    else score += 10;
    if (!lower.includes("skills")) issues.push("Missing 'Skills' section.");
    else score += 10;

    if (!/\d+%|\d+/.test(text)) issues.push("Add numbers - 'Increased sales by 30%' is much stronger than 'Increased sales'.");
    else score += 15;

    const verbs = ["achieved", "improved", "led", "built", "increased", "managed"];
    if (!verbs.some(v => lower.includes(v))) issues.push("Use strong action verbs: Achieved, Led, Built, Improved...");
    else score += 20;

    if (issues.length === 0) issues.push("Excellent! Your resume looks professional.");
    setResult({ score, issues, words });
    window.scrollTo({ top: 600, behavior: "smooth" });
  };

  return (
    <div className="page">
      <header>
        <div className="logo"><span className="logo-icon">✓</span> ResumeCheck</div>
        <div className="header-links"><span>Tools</span><span>Blog</span><span>Pricing</span>{isLogged ? <span className="user-badge">{email}</span> : <button className="login-btn" onClick={() => setShowPopup(true)}>Log in</button>}</div>
      </header>

      <main>
        <h1>Check Your Resume <span>for Free</span></h1>
        <p className="subtitle">Upload your CV, choose your target job, and get a professional score + exactly what to fix.</p>

        <div className="purpose-row">
          <span>Resume for:</span>
          <select value={purpose} onChange={e => setPurpose(e.target.value)}>
            {PURPOSES.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>

        <div className={`upload-box ${drag ? "drag" : ""}`}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
        >
          <input type="file" id="file" accept=".pdf,.docx,.txt" onChange={e => handleFile(e.target.files?.[0])} hidden />
          <div className="upload-icon">⬆</div>
          <h2>{fileName ? `✓ ${fileName}` : "Drop your resume here"}</h2>
          <p>{fileName ? "File uploaded! Now click Check below." : "or"}</p>
          {!fileName && <label htmlFor="file" className="choose-btn">Choose File</label>}
          {fileName && <label htmlFor="file" className="choose-btn outline">Change File</label>}
          <span className="formats">PDF, DOCX, TXT • 100% Free • Private</span>
        </div>

        <div className="paste-wrap">
          <label>Or paste your resume text here (for best accuracy):</label>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste your resume here...&#10;&#10;Example:&#10;John Doe - Software Engineer&#10;Email: john@gmail.com&#10;Experience: ...&#10;Skills: React, Python..." />
        </div>

        <button className="big-check" onClick={onAnalyzeClick}>Check My Resume →</button>
        <p className="under-btn">🔒 Free • No credit card • Your file is not stored</p>

        {result && (
          <div className="result-card">
            <div className="score-left">
              <div className="big-score" style={{ color: result.score >= 80 ? "#16a34a" : result.score >= 50 ? "#f59e0b" : "#ef4444" }}>{result.score}<span>/100</span></div>
              <div><b>{result.score >= 80 ? "Excellent - Ready to send!" : result.score >= 50 ? "Good, but needs fixes" : "Needs major improvements"}</b><p>{result.words} words • Target: {purpose}</p></div>
            </div>
            <div className="bar"><div className="fill" style={{ width: `${result.score}%`, background: result.score >= 80 ? "#16a34a" : result.score >= 50 ? "#f59e0b" : "#ef4444" }} /></div>
            <h3>What to fix:</h3>
            {result.issues.map((i: string, idx: number) => <div key={idx} className="issue">⚠️ {i}</div>)}
            <button className="big-check" onClick={() => { setResult(null); setText(""); setFileName(""); }}>Check Another Resume</button>
          </div>
        )}

        <div className="features">
          <div><b>⚡ 10 Seconds</b><p>Get instant feedback</p></div>
          <div><b>🎯 Targeted</b><p>Optimized for your job</p></div>
          <div><b>🔒 Private</b><p>We never store your CV</p></div>
        </div>
      </main>

      {showPopup && (
        <div className="overlay" onClick={() => setShowPopup(false)}>
          <div className="popup" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setShowPopup(false)}>✕</button>
            <div className="popup-icon">✦</div>
            <h2>Sign up to see your result</h2>
            <p>Create a free account to unlock your full resume score and personalized fixes.</p>
            <label>Your email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            <button className="popup-btn" onClick={register}>Continue - It's Free →</button>
            <span className="popup-small">By continuing you agree to our Terms. No spam, ever.</span>
            <div className="popup-benefits">✓ Full score breakdown<br />✓ Save your history<br />✓ Unlimited checks</div>
          </div>
        </div>
      )}
    </div>
  );
}
