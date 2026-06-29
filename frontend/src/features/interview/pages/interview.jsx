import React, { useState,useEffect } from "react";
import "./interview.scss";
import { useInterview } from "../hooks/useinterview";
import { useParams } from "react-router";
import { downloadPerfectResumeApi } from "../services/interview.api";

function Interview() {
  const [activeTab, setActiveTab] = useState("technical");
  const { report, loading,getReportById } = useInterview();
  const { interviewId } = useParams();
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  useEffect(() => {
    if (interviewId) {
      getReportById({ interviewId });
    }
  }, [interviewId]);

  const handleDownloadPdf = async () => {
    setDownloadError("");
    setDownloading(true);
    try {
      await downloadPerfectResumeApi({ interviewId });
    } catch (err) {
      setDownloadError("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="interview">
        <div className="interview__container">
          <h2 style={{ color: "white" }}>Loading Report...</h2>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="interview">
        <div className="interview__container">
          <h2 style={{ color: "white" }}>No Report Found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="interview">
      <div className="interview__container">

        {/* Sidebar */}
        <aside className="interview__sidebar">
          <h2>Interview Report</h2>

          <button
            className={activeTab === "technical" ? "active" : ""}
            onClick={() => setActiveTab("technical")}
          >
            Technical Questions
          </button>

          <button
            className={activeTab === "behavioral" ? "active" : ""}
            onClick={() => setActiveTab("behavioral")}
          >
            Behavioral Questions
          </button>

          <button
            className={activeTab === "roadmap" ? "active" : ""}
            onClick={() => setActiveTab("roadmap")}
          >
            Preparation Roadmap
          </button>
        </aside>

        {/* Main Content */}
        <main className="interview__content">

          {activeTab === "technical" && (
            <>
              <h2>Technical Questions</h2>

              {report.technicalQuestions?.map((question, index) => (
                <div className="question-card" key={index}>
                  <h3>{question.question}</h3>

                  <h4>Intention</h4>
                  <p>{question.intention}</p>

                  <h4>Expected Answer</h4>
                  <p>{question.answer}</p>
                </div>
              ))}
            </>
          )}

          {activeTab === "behavioral" && (
            <>
              <h2>Behavioral Questions</h2>

              {report.behavioralQuestions?.map((question, index) => (
                <div className="question-card" key={index}>
                  <h3>{question.question}</h3>

                  <h4>Intention</h4>
                  <p>{question.intention}</p>

                  <h4>Expected Answer</h4>
                  <p>{question.answer}</p>
                </div>
              ))}
            </>
          )}

          {activeTab === "roadmap" && (
            <>
              <h2>Preparation Roadmap</h2>

              {report.preparationPlan?.map((plan) => (
                <div
                  className="roadmap-card"
                  key={plan._id || plan.day}
                >
                  <span>Day {plan.day}</span>

                  <h3>{plan.focus}</h3>

                  <ul>
                    {plan.tasks?.map((task, idx) => (
                      <li key={idx}>{task}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )}

        </main>

        {/* Right Panel */}
        <aside className="interview__skills">

          <div className="score-card">
            <h3>Match Score</h3>

            <span>
              {report.matchScore}%
            </span>
          </div>

          <button 
            className="download-resume-btn" 
            onClick={handleDownloadPdf}
            disabled={downloading}
          >
            {downloading ? "Generating Perfect Resume..." : "📄 Download Perfect Resume (PDF)"}
          </button>

          {downloadError && (
            <div className="download-error">{downloadError}</div>
          )}

          <h3>Skill Gaps</h3>

          <div className="skill-list">

            {report.skillGaps?.map((gap, index) => (
              <div
                key={index}
                className={`skill-card ${gap.severity.toLowerCase()}`}
              >
                {gap.skill}
              </div>
            ))}

          </div>

        </aside>

      </div>
    </div>
  );
}

export default Interview;