import React, { useState, useRef, useEffect } from "react";
import { useInterview } from "../hooks/useinterview";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";

const Home = () => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const [fileName, setFileName] = useState("");
  const { loading, generateReport, reports, getReports } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setselfDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const resumeInputRef = useRef();
  const [activeTab, setActiveTab] = useState("create");

  useEffect(() => {
    if (activeTab === "history") {
      getReports().catch(err => {
        console.error("Failed to load reports history:", err);
      });
    }
  }, [activeTab]);

  const handleGenerateReport = async () => {
    setErrorMsg("");
    const resumeFile = resumeInputRef.current?.files[0];

    if (!resumeFile) {
      setErrorMsg("Please upload your resume PDF.");
      return;
    }
    if (!selfDescription.trim()) {
      setErrorMsg("Please enter a self-description.");
      return;
    }
    if (!jobDescription.trim()) {
      setErrorMsg("Please enter the job description.");
      return;
    }

    try {
      const data = await generateReport({ jobDescription, selfDescription, resumeFile });
      if (data && data._id) {
        navigate(`/interview/${data._id}`);
      } else {
        setErrorMsg("Failed to generate interview report. Please try again.");
      }
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : "An error occurred while generating report.");
    }
  };

  if (loading) {
    return (
      <div className="home">
        <div className="home__loading">
          <div className="loader"></div>
          <h2>Generating Interview Report...</h2>
          <p>
            Analyzing resume, matching job description,
            and preparing questions.
          </p>
        </div>
      </div>
    );
  }

  const handleUserLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="home">
        <div className="home__container">

          <div className="home__header">
            <div className="home__actions">
              <div className="home__tabs">
                <button
                  className={activeTab === "create" ? "active" : ""}
                  onClick={() => setActiveTab("create")}
                >
                  Create Report
                </button>

                <button
                  className={activeTab === "history" ? "active" : ""}
                  onClick={() => setActiveTab("history")}
                >
                  Previous Reports
                </button>
              </div>

              <button
                className="logout-btn"
                onClick={handleUserLogout}
              >
                Logout
              </button>
            </div>

            <h1>AI Interview Analyzer</h1>
            <p>
              Upload your resume and provide job details to generate
              a personalized interview report.
            </p>
          </div>

          {errorMsg && (
            <div style={{ padding: "1rem", marginBottom: "1rem", backgroundColor: "#ef444422", border: "1px solid #ef4444", borderRadius: "8px", color: "#fca5a5", textAlign: "center" }}>
              {errorMsg}
            </div>
          )}

          {activeTab === "create" && (
            <div className="home__content">

              <div className="home__card">
                <h2>Resume Upload</h2>

                <label className="upload-box">
                  <input
                    type="file"
                    id="resume"
                    name="resume"
                    ref={resumeInputRef}
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFileName(file.name);
                      }
                    }}
                  />
                  <span>
                    {fileName ? `✓ ${fileName}` : "Click to Upload Resume (PDF)"}
                  </span>
                </label>
              </div>

              <div className="home__card">
                <h2>Self Description</h2>

                <textarea
                  placeholder="Tell us about yourself..."
                  id="selfDescription"
                  value={selfDescription}
                  onChange={(e) => setselfDescription(e.target.value)}
                />
              </div>

              <div className="home__card home__card--full">
                <h2>Job Description</h2>

                <textarea
                  placeholder="Paste the job description here..."
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <button className="generate-btn" onClick={handleGenerateReport}>
                Generate Interview Report
              </button>

            </div>
          )}

          {activeTab === "history" && (
            <div className="home__history">

              {reports?.length === 0 ? (
                <div className="home__empty">
                  <h3>No Reports Found</h3>
                  <p>
                    Generate your first interview report to see it here.
                  </p>
                </div>
              ) : (
                reports?.map((report) => (
                  <div
                    key={report._id}
                    className="report-card"
                    onClick={() => navigate(`/interview/${report._id}`)}
                  >
                    <div className="report-card__left">
                      <h3>{report.title || "Interview Report"}</h3>
                      <p>
                        Match Score: <span>{report.matchScore}%</span>
                      </p>
                    </div>

                    <div className="report-card__right">
                      <span>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}

            </div>
          )}

        </div>
      </div>
    </main>
  );
};

export default Home;