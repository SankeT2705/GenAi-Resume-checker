import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAts } from "../hooks/useAts";
import "./Ats.scss";

const AtsResult = () => {
  const { checkId } = useParams();
  const navigate = useNavigate();
  const { loading, atsReport, fetchAtsReportById } = useAts();

  useEffect(() => {
    if (checkId) {
      fetchAtsReportById({ checkId }).catch(console.error);
    }
  }, [checkId]);

  if (loading || !atsReport) {
    return (
      <div className="ats-page">
        <div className="ats-loading">
          <div className="loader"></div>
          <h2>Loading ATS Audit Results...</h2>
        </div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="ats-page">
      <div className="ats-container">
        <button className="back-btn" onClick={() => navigate("/ats-checker")}>
          ← Back to ATS Checker
        </button>

        <div className="ats-result-header">
          <div className="score-circle-wrapper">
            <div 
              className="score-circle" 
              style={{ background: `conic-gradient(${getScoreColor(atsReport.atsScore)} ${atsReport.atsScore * 3.6}deg, rgba(255,255,255,0.1) 0deg)` }}
            >
              <div className="inner">
                <span className="number">{atsReport.atsScore}%</span>
                <span className="label">ATS SCORE</span>
              </div>
            </div>
          </div>

          <div className="summary-box">
            <h2>Overall Assessment</h2>
            <p>{atsReport.summary}</p>
          </div>
        </div>

        <div className="ats-grid">
          {/* Strong & Weak Points */}
          <div className="ats-card">
            <h3>💪 Strong Points</h3>
            <ul className="point-list positive">
              {atsReport.strongPoints?.map((pt, idx) => (
                <li key={idx}>✓ {pt}</li>
              ))}
            </ul>
          </div>

          <div className="ats-card">
            <h3>⚠️ Weak Points & Missing Elements</h3>
            <ul className="point-list negative">
              {atsReport.weakPoints?.map((pt, idx) => (
                <li key={idx}>✕ {pt}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section Analysis */}
        <div className="ats-card full">
          <h3>📊 Section-by-Section Breakdown</h3>
          <div className="sections-grid">
            {atsReport.sectionAnalysis?.map((sec, idx) => (
              <div key={idx} className={`section-card status-${sec.status.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="sec-header">
                  <h4>{sec.section}</h4>
                  <span className="badge">{sec.status}</span>
                </div>
                <p>{sec.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Typos and Grammar */}
        {atsReport.typosAndGrammar && atsReport.typosAndGrammar.length > 0 && (
          <div className="ats-card full">
            <h3>✍️ Spelling, Grammar & Formatting Issues</h3>
            <div className="typo-list">
              {atsReport.typosAndGrammar.map((item, idx) => (
                <div key={idx} className="typo-item">
                  <div className="issue"><strong>Issue:</strong> {item.issue}</div>
                  <div className="suggestion"><strong>Suggestion:</strong> {item.suggestion}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actionable Recommendations */}
        <div className="ats-card full">
          <h3>🚀 Actionable Recommendations</h3>
          <ul className="recommendation-list">
            {atsReport.actionableRecommendations?.map((rec, idx) => (
              <li key={idx}>
                <span className="num">{idx + 1}</span>
                <span className="txt">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AtsResult;
