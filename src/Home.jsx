import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // ✅ FIXED LOGIN STATE
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [loginError, setLoginError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    if (storedIsLoggedIn === "true") {
      setIsLoggedIn(true);
      setUserName(storedUserName);
    }
  }, []);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ FIXED LOGIN SUBMIT
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login/`,
        {
          username: loginForm.username,
          password: loginForm.password,
        },
        { withCredentials: true }
      );

      localStorage.setItem("userName", res.data.username || loginForm.username);
      localStorage.setItem("userId", res.data.user_id);
      localStorage.setItem("isLoggedIn", "true");

      setIsLoggedIn(true);
      setUserName(res.data.username || loginForm.username);
      setShowLoginModal(false);
    } catch (err) {
      setLoginError("Invalid username or password");
    }
  };

  return (
    <div>
      {/* ================= HEADER ================= */}
      <header className="navbar">
        <div className="logo">
          <img src="logo.png" alt="Logo" />
        </div>

        <div className="auth">
          {isLoggedIn ? (
            <a href="#/profile">Welcome, {userName}</a>
          ) : (
            <>
              <button onClick={() => setShowRegisterModal(true)}>
                OPEN ACCOUNT
              </button>
              <button onClick={() => setShowLoginModal(true)}>LOG IN</button>
            </>
          )}
        </div>
      </header>

      {/* ================= LOGIN MODAL ================= */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Login</h2>
            <button onClick={() => setShowLoginModal(false)}>×</button>

            {loginError && <p style={{ color: "red" }}>{loginError}</p>}

            <form onSubmit={handleLoginSubmit}>
              {/* ✅ username */}
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={loginForm.username}
                onChange={handleLoginChange}
                required
              />

              {/* ✅ password */}
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={handleLoginChange}
                required
              />

              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}

      {/* ================= HERO (UNCHANGED UI) ================= */}
      <section className="hero">
        <h1>DEPOSITS AND WITHDRAWALS</h1>
        <p>Fast, convenient and secure.</p>
      </section>

      {/* बाकी पूरा UI SAME रहेगा */}
    </div>
  );
}

export default Home;
