import { useEffect, useState } from "react";
import { Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import { getAdminToken, saveAdminToken } from "../../services/adminAuth";
import { getErrorMessage } from "../../services/apiClient";
import { loginAdmin } from "../../services/adminService";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAdminToken();

    if (token) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const validate = () => {
    let newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const data = await loginAdmin({ email, password });
      const token = data?.token;

      if (!token) {
        setErrors({ api: "Login succeeded, but no auth token was returned." });
        return;
      }

      saveAdminToken(token);
      navigate("/admin", { replace: true });
    } catch (error) {
      setErrors({ api: getErrorMessage(error, "Server not reachable.") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-wrapper login-page">
      <div className="login-container">
        <div className="admin-card login-card">
          <div className="admin-card-header login-card-header">
            <img src="/images/logo.png" alt="Pirnav Logo" className="login-logo" />
            <h2>Welcome back</h2>
            <p>Use your authorized admin credentials to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <span className="input-icon" aria-hidden="true">
                <Mail size={14} />
              </span>
              <input
                id="admin-email"
                type="email"
                className="form-input"
                placeholder=" "
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
              />
              <label htmlFor="admin-email" className="form-label">
                Email Address
              </label>
              {errors.email && (
                <small className="error-text">{errors.email}</small>
              )}
            </div>

            <div className="form-group">
              <span className="input-icon" aria-hidden="true">
                <Lock size={14} />
              </span>
              <input
                id="admin-password"
                type="password"
                className="form-input"
                placeholder=" "
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
              <label htmlFor="admin-password" className="form-label">
                Password
              </label>
              {errors.password && (
                <small className="error-text">{errors.password}</small>
              )}
            </div>

            {errors.api && (
              <small className="error-text center">{errors.api}</small>
            )}

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? "Logging in..." : "Secure Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
