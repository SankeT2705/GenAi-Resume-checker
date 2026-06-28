import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    try {
      await handleLogin({ email, password });
      navigate("/");
    } catch (err) {
      setErrorMsg(typeof err === "string" ? err : "Invalid email or password.");
    }
  };

  if (loading) {
    return (
      <div className="auth__loading">
        <div className="loader"></div>
        <h2>Logging in...</h2>
        <p>Setting up your profile and preparing your workspace.</p>
      </div>
    );
  }

  return (
    <div className="auth">
      <div className="auth__container">
        <div className="auth__left">
          <h1>Welcome Back</h1>
          <p>Sign in to continue managing your account and access all features.</p>
        </div>

        <div className="auth__right">
          <form className="auth__form" onSubmit={handleSubmit}>
            <h2>Login</h2>

            {errorMsg && (
              <div style={{ padding: "0.75rem", marginBottom: "1rem", backgroundColor: "#ef444422", border: "1px solid #ef4444", borderRadius: "6px", color: "#fca5a5", fontSize: "0.9rem", textAlign: "center" }}>
                {errorMsg}
              </div>
            )}

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <button type="submit">Login</button>

            <p className="switch-auth">
              Don't have an account?{" "}
              <Link to={"/register"}>
                <span>Register</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
