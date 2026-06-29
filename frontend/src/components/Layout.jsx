import React from "react";
import Navbar from "./Navbar";
import AnimatedBackground from "./AnimatedBackground";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router";

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="layout-wrapper" style={{ minHeight: "100vh", position: "relative" }}>
      <AnimatedBackground />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="layout-content"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Layout;
