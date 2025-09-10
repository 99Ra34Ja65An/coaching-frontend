import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Loader, User, BookOpen, GraduationCap } from "lucide-react";
import API from "../API"; // Axios instance

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (token && user && location.pathname === "/login") {
      if (user.role === "admin") navigate("/admin/dashboard", { replace: true });
      else navigate("/student/dashboard", { replace: true });
    }

    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [navigate, location]);

  // =========================
  // Handle Login
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Admin login first
      const res = await API.post("/auth/admin/login", { email, password });
      if (res.data.success) {
        setOtpSent(true);
        alert("OTP sent to your email!");
        setIsLoading(false);
        return;
      }
    } catch (adminErr) {
      // Student login fallback
      try {
        const studentRes = await API.post("/auth/student/login", { email, password });
        if (studentRes.data.success) {
          localStorage.setItem("token", studentRes.data.token);
          localStorage.setItem("user", JSON.stringify(studentRes.data.user));
          rememberMe ? localStorage.setItem("rememberedEmail", email) : localStorage.removeItem("rememberedEmail");
          navigate("/student/dashboard");
          return;
        }
      } catch (studentErr) {
        setError(studentErr.response?.data?.msg || "Invalid email or password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // Handle OTP Verification
  // =========================
  const handleOtpVerify = async () => {
    if (!otp) return setError("Please enter OTP");

    setIsLoading(true);
    try {
      const res = await API.post("/auth/admin/verify-otp", { email, otp });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        rememberMe ? localStorage.setItem("rememberedEmail", email) : localStorage.removeItem("rememberedEmail");
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    if (role === "admin") {
      setEmail("admin@snaplearn.com");
      setPassword("admin123");
    } else {
      setEmail("student@snaplearn.com");
      setPassword("student123");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <BookOpen size={38} />
            <h1>IBS CLASSES</h1>
          </div>
          <h2>Welcome Back 👋</h2>
          <p>Please sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || otpSent}
              />
            </div>
          </div>

          {!otpSent && (
            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {otpSent && (
            <div className="input-group">
              <label>Enter OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}

          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                disabled={isLoading}
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          {error && <div className="error-message">{error}</div>}

          {!otpSent ? (
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader className="spinner" size={18} />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          ) : (
            <button type="button" className="login-button" onClick={handleOtpVerify} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader className="spinner" size={18} />
                  Verifying OTP...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
          )}
        </form>

        <div className="demo-section">
          <p className="demo-label">Quick demo access:</p>
          <div className="demo-buttons">
            <button type="button" className="demo-button admin-demo" onClick={() => handleDemoLogin("admin")} disabled={isLoading}>
              <User size={16} /> Admin Demo
            </button>
            <button type="button" className="demo-button student-demo" onClick={() => handleDemoLogin("student")} disabled={isLoading}>
              <GraduationCap size={16} /> Student Demo
            </button>
          </div>
        </div>

        <div className="signup-link">
          <p>
            Don't have an account? <Link to="/signup" className="signup-text">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
