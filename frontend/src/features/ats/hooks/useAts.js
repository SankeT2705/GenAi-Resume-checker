import { useState } from "react";
import { analyzeResumeAts, getResumeCheckById, getAllResumeChecks } from "../services/ats.api";

export const useAts = () => {
  const [loading, setLoading] = useState(false);
  const [atsReport, setAtsReport] = useState(null);
  const [atsHistory, setAtsHistory] = useState([]);

  const runAtsCheck = async ({ resumeFile }) => {
    setLoading(true);
    try {
      const response = await analyzeResumeAts({ resumeFile });
      setAtsReport(response.resumeCheck);
      return response.resumeCheck;
    } catch (err) {
      console.error("useAts runAtsCheck error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAtsReportById = async ({ checkId }) => {
    setLoading(true);
    try {
      const response = await getResumeCheckById({ checkId });
      setAtsReport(response.resumeCheck);
      return response.resumeCheck;
    } catch (err) {
      console.error("useAts fetchAtsReportById error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAtsHistory = async () => {
    setLoading(true);
    try {
      const response = await getAllResumeChecks();
      setAtsHistory(response.checks);
      return response.checks;
    } catch (err) {
      console.error("useAts fetchAtsHistory error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    atsReport,
    atsHistory,
    runAtsCheck,
    fetchAtsReportById,
    fetchAtsHistory
  };
};
