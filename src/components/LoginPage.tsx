import { useState } from "react";
import ResetPasswordModal from "./ResetPasswordModal";
import MarketData from "./MarketData";
import "./LoginPage.css";

interface FormData {
  username: string;
  password: string;
}

const LoginPage = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setTimeout(() => {
        if (formData.username && formData.password) {
          alert("Login successful! (This is a demo)");
        } else {
          alert("Please fill in all fields");
        }
        setIsSubmitting(false);
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <h1>ORTEX</h1>
        <p>Financial Intelligence Platform</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username or Email</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your username or email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              ></i>
            </button>
          </div>
        </div>

        <button type="submit" className="login-btn" disabled={isSubmitting}>
          {isSubmitting ? <span className="loading"></span> : "Sign In"}
        </button>
      </form>

      <div className="forgot-password">
        <button type="button" onClick={() => setShowResetModal(true)}>
          Forgot your password?
        </button>
      </div>

      <MarketData />

      <ResetPasswordModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
      />
    </div>
  );
};

export default LoginPage;
