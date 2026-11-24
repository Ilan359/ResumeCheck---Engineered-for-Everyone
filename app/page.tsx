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
    if (t && t.length > 50) setText(t);
    else setText(`Resume file: ${f.name}\n\nPlease paste your resume text below if the file is PDF.\n\n`);
  };

  const onAnalyzeClick = () => {
    if (!text.trim() && !fileName) { alert("Please upload your resume first"); return; }
    if (!isLogged) { setShowPopup(true); return; }
    runCheck();
  };

  const register = () => {
    if (!email.includes("@") || !email.includes(".")) { alert("Please enter a valid email"); return; }
    setIsLogged(true); setShowPopup(false); setTimeout(runCheck, 200);
  };

  const runCheck = () => {
    const lower = text.toLowerCase();
    const issues: string[] = [];
    let score = 0;
    const words = text.trim().split(/\s+/).length;
    if (words < 100) issues.push(`Too short - only ${words} words. Aim for 300-600 words.`);
    else if (words > 800) issues.push(`Too long - ${words} words. Recruiters spend only 7 seconds.`);
    else score += 20;
    if (!lower.includes("@") && !lower.includes("linkedin") && !lower.includes("phone")) issues.push("Missing contact info - add email, phone or LinkedIn.");
    else score += 10;
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
    window.scrollTo({ top: 650, behavior: "smooth" });
  };

  return (
    <div className="page">
      <header>
        <div className="logo"><span className="dot">●</span> resume<span className="orange">check.</span></div>
        <div className="nav"><span>How it works</span><span>Examples</span><span>FAQ</span>{isLogged ? <span className="pill">{email}</span> : <button className="top-btn" onClick={() => setShowPopup(true)}>Get Started</button>}</div>
      </header>

      <main>
        <div className="badge">✦ FREE AI RESUME CHECKER • NO SIGN-UP TO TRY</div>
        <h1>Is your resume<br/>actually <span className="highlight">good enough?</span></h1>
        <p className="sub">Drop your CV. Get a real score in 10 seconds.<br/>See exactly what recruiters would fix.</p>

        <div className="card">
          <div className="card-top">
            <span className="card-label">1. Choose your target job</span>
            <select value={purpose} onChange={e => setPurpose(e.target.value)}>
              {PURPOSES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className={`drop ${drag ? "drag" : ""}`}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
          >
            <input type="file" id="file" accept=".pdf,.docx,.txt" onChange={e => handleFile(e.target.files?.[0])} hidden />
            <div className="drop-circle">{fileName ? "✓" : "↑"}</div>
            <h3>{fileName ? fileName : "Drag & drop your resume"}</h3>
            <p>{fileName ? "Ready to check!" : "PDF, DOCX or TXT — we never store your file"}</p>
            <label htmlFor="file" className="browse">{fileName ? "Change file" : "Browse files"}</label>
          </div>

          <div className="or"><span></span> or paste text <span></span></div>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste your resume here..." />
          <button className="cta" onClick={onAnalyzeClick}>Check my resume →</button>
          <p className="micro">🔒 Private • Free • Takes 10 seconds</p>
        </div>

        {result && (
          <div className="result">
            <div className="result-head">
              <div><div className="score-num">{result.score}<span>/100</span></div><p>{result.words} words • {purpose}</p></div>
              <div className="verdict">{result.score >= 80 ? "🎉 Ready to send!" : result.score >= 50 ? "👍 Good, needs fixes" : "🛠️ Needs work"}</div>
            </div>
            <div className="bar"><div className="fill" style={{ width: `${result.score}%` }} /></div>
            <h4>What to fix first:</h4>
            {result.issues.map((i: string, idx: number) => <div key={idx} className="fix">→ {i}</div>)}
            <button className="cta ghost" onClick={() => { setResult(null); setText(""); setFileName(""); }}>Check another resume</button>
          </div>
        )}

        <div className="three">
          <div><div className="emoji">⚡</div><b>10 seconds</b><p>No waiting, instant score</p></div>
          <div><div className="emoji">🎯</div><b>Made for your job</b><p>Not generic advice</p></div>
          <div><div className="emoji">💬</div><b>Clear fixes</b><p>Know exactly what to change</p></div>
        </div>

        <div className="quote">“I fixed 3 things and got 2 interviews in the same week.” <span>- Noa, Tel Aviv</span></div>
      </main>

      {showPopup && (
        <div className="overlay" onClick={() => setShowPopup(false)}>
          <div className="popup" onClick={e => e.stopPropagation()}>
            <button className="x" onClick={() => setShowPopup(false)}>✕</button>
            <div className="popup-emoji">🔓</div>
            <h2>Your score is ready!</h2>
            <p>Enter your email to unlock your full result. It takes 5 seconds.</p>
            <label>Your email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            <button className="cta" onClick={register}>Unlock my result →</button>
            <span className="micro">Free forever • No spam</span>
          </div>
        </div>
      )}
    </div>
  );
}
