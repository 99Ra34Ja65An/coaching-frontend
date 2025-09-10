import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = (password) => {
    if (password.length < 6) return "weak";
    if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8)
      return "strong";
    return "medium";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/student/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setSuccess(res.data.message);
      setError("");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed!");
      setSuccess("");
    }
    setLoading(false);
  };

  return (
    <div style={styles.signupContainer}>
      <div style={styles.signupCard}>
        {/* Branding */}
        <h1 style={styles.brandTitle}>IBS Classes</h1>
        <h2 style={styles.signupTitle}>Create Your Account</h2>
        <p style={styles.signupSubtitle}>Join us and start learning today!</p>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} style={styles.signupForm}>
          {/* Full Name */}
          <div style={styles.inputGroup}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          {/* Email */}
          <div style={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          {/* Password */}
          <div style={{ ...styles.inputGroup, ...styles.passwordGroup }}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
            {formData.password && (
              <p
                style={{
                  ...styles.passwordStrength,
                  ...(getPasswordStrength(formData.password) === "weak"
                    ? { color: "#ff3b3b" }
                    : getPasswordStrength(formData.password) === "medium"
                    ? { color: "#ff9900" }
                    : { color: "#00b300" }),
                }}
              >
                Password Strength: {getPasswordStrength(formData.password)}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div style={styles.inputGroup}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          {/* Alerts */}
          {error && <div style={{ ...styles.alert, ...styles.errorAlert }}>{error}</div>}
          {success && <div style={{ ...styles.alert, ...styles.successAlert }}>{success}</div>}

          {/* Signup Button */}
          <button
            type="submit"
            style={{
              ...styles.signupButton,
              ...(loading ? { cursor: "not-allowed", background: "#b3c7ff" } : {}),
            }}
            disabled={loading}
          >
            {loading ? <span style={styles.loader}>⏳</span> : "Sign Up"}
          </button>
        </form>

        {/* Redirect */}
        <p style={styles.redirectText}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={styles.redirectLink}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

/* ===== Inline CSS Styles ===== */
const styles = {
  signupContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0052cc, #007bff, #00c6ff)",
    backgroundSize: "300% 300%",
    animation: "gradientBG 10s ease infinite",
    padding: "20px",
  },
  signupCard: {
    background: "#fff",
    padding: "35px",
    width: "420px",
    borderRadius: "16px",
    boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15)",
    animation: "fadeIn 0.7s ease-in-out",
    transition: "all 0.3s ease-in-out",
  },
  brandTitle: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#0052cc",
    textAlign: "center",
    marginBottom: "8px",
  },
  signupTitle: {
    textAlign: "center",
    fontSize: "22px",
    color: "#222",
    fontWeight: "700",
  },
  signupSubtitle: {
    textAlign: "center",
    color: "#666",
    fontSize: "14px",
    marginBottom: "20px",
  },
  signupForm: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  inputGroup: {
    position: "relative",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #d9d9d9",
    borderRadius: "10px",
    fontSize: "15px",
    transition: "all 0.3s ease-in-out",
  },
  passwordGroup: {
    display: "flex",
    flexDirection: "column",
  },
  passwordStrength: {
    fontSize: "12px",
    marginTop: "5px",
  },
  alert: {
    padding: "10px",
    borderRadius: "8px",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "500",
  },
  errorAlert: {
    background: "#ffe5e5",
    color: "#d90429",
  },
  successAlert: {
    background: "#e5ffe5",
    color: "#059669",
  },
  signupButton: {
    background: "#0052cc",
    color: "#fff",
    fontWeight: "600",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    transition: "all 0.3s ease-in-out",
  },
  loader: {
    animation: "spin 1s linear infinite",
  },
  redirectText: {
    textAlign: "center",
    marginTop: "12px",
    color: "#555",
    fontSize: "14px",
  },
  redirectLink: {
    color: "#0052cc",
    fontWeight: "600",
    textDecoration: "none",
    cursor: "pointer",
  },
};

export default StudentSignup;
