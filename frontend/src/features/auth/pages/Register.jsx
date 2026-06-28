import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();

  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { loading, handleRegister } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    try {
      await handleRegister({ username, email, password });
      navigate("/");
    } catch (err) {
      setErrorMsg(typeof err === "string" ? err : "Registration failed.");
    }
  };

  if (loading) {
    return (
      <div className="auth__loading">
        <div className="loader"></div>
        <h2>Creating Your Account...</h2>
        <p>Setting up your profile and preparing your workspace.</p>
      </div>
    );
  }

  return (
    <div className="auth">
      <div className="auth__container">
        <div className="auth__left">
          <h1>Create Account</h1>
          <p>Join our platform and start managing your work more efficiently.</p>
        </div>

        <div className="auth__right">
          <form className="auth__form" onSubmit={handleSubmit}>
            <h2>Register</h2>

            {errorMsg && (
              <div style={{ padding: "0.75rem", marginBottom: "1rem", backgroundColor: "#ef444422", border: "1px solid #ef4444", borderRadius: "6px", color: "#fca5a5", fontSize: "0.9rem", textAlign: "center" }}>
                {errorMsg}
              </div>
            )}

            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                name="username"
                placeholder="Enter your name"
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                name="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                placeholder="Create password"
              />
            </div>

            <button type="submit">Register</button>

            <p className="switch-auth">
              Already have an account?{" "}
              <Link to={"/login"}>
                <span>Login</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;