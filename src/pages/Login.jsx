import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader,
  User,
  BookOpen,
  GraduationCap,
} from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false); // OTP step active
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
      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/student/dashboard", { replace: true });
      }
    }

    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [navigate, location]);

  // =========================
  // Handle Login (Admin + Student)
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Admin login first step: email + password
      const res = await axios.post("http://192.168.0.121:5000/api/auth/admin/login", {
        email,
        password,
      });

      if (res.data.success) {
        setOtpSent(true);
        alert("OTP sent to your email!");
        setIsLoading(false);
        return;
      }
    } catch (adminErr) {
      // Admin failed → try student login
      try {
        const studentRes = await axios.post(
          "http://192.168.0.121:5000/api/auth/student/login",
          { email, password }
        );

        if (studentRes.data.success) {
          localStorage.setItem("token", studentRes.data.token);
          localStorage.setItem("user", JSON.stringify(studentRes.data.user));

          if (rememberMe) localStorage.setItem("rememberedEmail", email);
          else localStorage.removeItem("rememberedEmail");

          navigate("/student/dashboard");
          return;
        }
      } catch (studentErr) {
        setError(
          studentErr.response?.data?.msg || "Invalid email or password. Please try again."
        );
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
      const res = await axios.post("http://192.168.0.121:5000/api/auth/admin/verify-otp", {
        email,
        otp,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        if (rememberMe) localStorage.setItem("rememberedEmail", email);
        else localStorage.removeItem("rememberedEmail");

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
    <>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #4f46e5, #06b6d4);
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .login-container { display: flex; justify-content: center; align-items: center; width: 100%; }
        .login-card {
          background-color: #fff;
          padding: 35px 40px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          width: 420px;
          max-width: 90%;
          animation: fadeIn 0.5s ease-in-out;
        }
        .login-header { text-align: center; margin-bottom: 25px; }
        .logo { display: flex; align-items: center; justify-content: center; gap: 10px; }
        .logo h1 { font-size: 26px; font-weight: 700; color: #4f46e5; }
        .login-header h2 { font-size: 22px; margin-top: 12px; color: #111827; }
        .login-header p { color: #6b7280; font-size: 14px; margin-top: 4px; }
        .login-form { display: flex; flex-direction: column; gap: 18px; }
        .input-group label { font-weight: 600; margin-bottom: 6px; display: inline-block; color: #374151; }
        .input-wrapper { display: flex; align-items: center; position: relative; }
        .input-icon { position: absolute; left: 12px; color: #6b7280; }
        input { width: 100%; padding: 12px 40px; font-size: 14px; border: 1.5px solid #d1d5db; border-radius: 10px; outline: none; transition: all 0.3s ease; }
        input:focus { border-color: #4f46e5; box-shadow: 0 0 5px rgba(79, 70, 229, 0.3); }
        .password-toggle { background: none; border: none; position: absolute; right: 12px; cursor: pointer; color: #6b7280; }
        .login-options { display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
        .remember-me { display: flex; align-items: center; gap: 5px; }
        .forgot-password { color: #4f46e5; font-weight: 500; text-decoration: none; }
        .forgot-password:hover { text-decoration: underline; }
        .error-message { background-color: #fee2e2; color: #dc2626; padding: 8px; border-radius: 8px; font-size: 14px; text-align: center; }
        .login-button {
          background-color: #4f46e5;
          color: #fff;
          font-weight: 600;
          padding: 12px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .login-button:hover { background-color: #4338ca; }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .demo-section { margin-top: 20px; text-align: center; }
        .demo-label { font-size: 13px; color: #6b7280; }
        .demo-buttons { display: flex; justify-content: center; gap: 10px; margin-top: 8px; }
        .demo-button { display: flex; align-items: center; gap: 5px; padding: 8px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.3s ease; }
        .admin-demo { background-color: #4f46e5; color: #fff; }
        .admin-demo:hover { background-color: #4338ca; }
        .student-demo { background-color: #06b6d4; color: #fff; }
        .student-demo:hover { background-color: #0891b2; }
        .signup-link { margin-top: 20px; text-align: center; font-size: 14px; }
        .signup-text { color: #4f46e5; font-weight: 600; text-decoration: none; }
        .signup-text:hover { text-decoration: underline; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

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
              <button
                type="button"
                className="login-button"
                onClick={handleOtpVerify}
                disabled={isLoading}
              >
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
              <button
                type="button"
                className="demo-button admin-demo"
                onClick={() => handleDemoLogin("admin")}
                disabled={isLoading}
              >
                <User size={16} />
                Admin Demo
              </button>
              <button
                type="button"
                className="demo-button student-demo"
                onClick={() => handleDemoLogin("student")}
                disabled={isLoading}
              >
                <GraduationCap size={16} />
                Student Demo
              </button>
            </div>
          </div>

          <div className="signup-link">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="signup-text">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
