import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAts } from "../hooks/useAts";
import "./Ats.scss";

const AtsChecker = () => {
  const navigate = useNavigate();
  const { loading, runAtsCheck, atsHistory, fetchAtsHistory } = useAts();
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("check");
  const resumeInputRef = useRef();

  useEffect(() => {
    if (activeTab === "history") {
      fetchAtsHistory().catch(console.error);
    }
  }, [activeTab]);

  const handleAudit = async () => {
    setErrorMsg("");
    const file = resumeInputRef.current?.files[0];
    if (!file) {
      setErrorMsg("Please upload a PDF resume to audit.");
      return;
    }

    try {
      const data = await runAtsCheck({ resumeFile: file });
      if (data && data._id) {
        navigate(`/ats-checker/${data._id}`);
      }
    } catch (err) {
      setErrorMsg(typeof err === "string" ? err : "An error occurred during ATS audit.");
    }
  };

  if (loading) {
    return (
      <div className="ats-page">
        <div className="ats-loading">
          <div className="loader"></div>
          <h2>Auditing Resume for ATS Compliance...</h2>
          <p>Evaluating formatting, typos, grammar, section strength, and recruiter readability.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ats-page">
      <div className="ats-container">
        <div className="ats-header">
          <h1>Standalone Resume ATS Checker</h1>
          <p>Upload your resume PDF to receive an instant ATS score, grammar & typo checks, and actionable recruiter feedback.</p>
          
          <div className="ats-tabs">
            <button 
              className={activeTab === "check" ? "active" : ""}
              onClick={() => setActiveTab("check")}
            >
              Audit Resume
            </button>
            <button 
              className={activeTab === "history" ? "active" : ""}
              onClick={() => setActiveTab("history")}
            >
              Past Audits
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="ats-error-banner">
            {errorMsg}
          </div>
        )}

        {activeTab === "check" && (
          <div className="ats-card-single">
            <h2>Upload Resume for ATS Audit</h2>
            <label className="ats-upload-box">
              <input 
                type="file" 
                ref={resumeInputRef} 
                accept=".pdf"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setFileName(e.target.files[0].name);
                  }
                }}
              />
              <div className="upload-content">
                <span className="icon">📄</span>
                <span className="text">{fileName ? `✓ ${fileName}` : "Click or drag your PDF Resume here"}</span>
                <span className="subtext">Supports PDF format up to 10MB</span>
              </div>
            </label>

            <button className="ats-submit-btn" onClick={handleAudit}>
              Run Comprehensive ATS Audit
            </button>
          </div>
        )}

        {activeTab === "history" && (
          <div className="ats-history-list">
            {atsHistory?.length === 0 ? (
              <div className="ats-empty">
                <h3>No Previous Audits Found</h3>
                <p>Upload a resume above to start your first ATS compliance audit.</p>
              </div>
            ) : (
              atsHistory?.map((item) => (
                <div 
                  key={item._id} 
                  className="ats-history-item"
                  onClick={() => navigate(`/ats-checker/${item._id}`)}
                >
                  <div className="left">
                    <div className="score-badge" style={{
                      borderColor: item.atsScore >= 75 ? "#10b981" : item.atsScore >= 50 ? "#f59e0b" : "#ef4444",
                      color: item.atsScore >= 75 ? "#34d399" : item.atsScore >= 50 ? "#fbbf24" : "#fca5a5"
                    }}>
                      {item.atsScore}%
                    </div>
                    <div className="info">
                      <h3>ATS Compliance Audit</h3>
                      <p>{item.summary}</p>
                    </div>
                  </div>
                  <div className="right">
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AtsChecker;
