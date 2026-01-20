import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function Home() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 🔥 FIXED: Django uses username + password
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [loginError, setLoginError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  // -------------------------------
  // Restore login from localStorage
  // -------------------------------
  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    const storedUser = localStorage.getItem("userName");

    if (storedLogin === "true") {
      setIsLoggedIn(true);
      setUserName(storedUser || "");
    }
  }, []);

  // -------------------------------
  // Input change
  // -------------------------------
  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  // -------------------------------
  // LOGIN SUBMIT (FIXED)
  // -------------------------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const res = await axios.post(
        `${API_BASE}/auth/login/`,
        {
          username: loginForm.username,
          password: loginForm.password,
        },
        { withCredentials: true }
      );

      // ✅ success
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", res.data.username || loginForm.username);
      localStorage.setItem("userId", res.data.user_id || "");

      setIsLoggedIn(true);
      setUserName(res.data.username || loginForm.username);
      setShowLoginModal(false);
    } catch (err) {
      setLoginError("Invalid username or password");
      localStorage.setItem("isLoggedIn", "false");
    }
  };

  // -------------------------------
  // LOGOUT
  // -------------------------------
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserName("");
  };

  return (
    <div>
      {/* ================= HEADER ================= */}
      <header className="navbar">
        <div className="logo">
          <img src="logo.png" alt="Margin Traders" />
        </div>

        <div className="auth">
          {isLoggedIn ? (
            <>
              <span className="welcome">Welcome, {userName}</span>
              <button className="btn outline" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="btn outline"
                onClick={() => setShowLoginModal(true)}
              >
                LOG IN
              </button>
            </>
          )}
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-left">
          <h1>
            DEPOSITS <em>AND</em>
            <br />
            WITHDRAWALS
          </h1>
          <p>Fast, convenient and secure transactions.</p>
        </div>

        <div className="hero-right">
          <img
            src="https://eu-images.contentstack.com/v3/assets/blt73dfd92ee49f59a6/blt842b91c2f0323bb8/6780412520a74477d5c611e0/Image.webp"
            alt="Hero"
          />
        </div>
      </section>

      {/* ================= LOGIN MODAL ================= */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Login</h2>

            <button
              className="close-button"
              onClick={() => setShowLoginModal(false)}
            >
              &times;
            </button>

            {loginError && <p className="error-message">{loginError}</p>}

            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={loginForm.username}
                  onChange={handleLoginChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                />
              </div>

              <button type="submit" className="cta-buttonFUNDS">
                Login
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= FOOTER (SAFE PLACEHOLDER) ================= */}
      <footer className="footer">
        <p>© 2026 Margin Tradings. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
