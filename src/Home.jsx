import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function Home() {
  /* ===================== STATE ===================== */
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const [loginForm, setLoginForm] = useState({
    Email: "",
    Password: "",
  });
  const [loginError, setLoginError] = useState(null);

  const [registerForm, setRegisterForm] = useState({
    Name: "",
    Email: "",
    Password: "",
    Phone: "",
    Pan: "",
    Pan_card_Image: null,
    Account_No: "",
    IFSC_code: "",
    Cancel_cheque_or_bank_statement: null,
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);

  /* ===================== AUTH PERSIST ===================== */
  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    const storedUserName = localStorage.getItem("userName");

    if (storedIsLoggedIn === "true") {
      setIsLoggedIn(true);
      setUserName(storedUserName || "");
    }
  }, []);

  /* ===================== API SAFE CALLS ===================== */
  const safeGet = async (url) => {
    if (!API_BASE) return;
    try {
      await axios.get(`${API_BASE}${url}`);
    } catch (err) {
      console.warn("API skipped:", url);
    }
  };

  useEffect(() => {
    safeGet("/apis/v1/withdrawal");
  }, []);

  /* ===================== HANDLERS ===================== */
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((p) => ({ ...p, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value, files } = e.target;
    setRegisterForm((p) => ({
      ...p,
      [name]: files ? files[0] : value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);

    if (!API_BASE) {
      setLoginError("Backend not configured");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/auth/login/`, loginForm);
      setIsLoggedIn(true);
      setUserName(res.data?.name || "User");

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", res.data?.name || "User");
      setShowLoginModal(false);
    } catch {
      setLoginError("Invalid credentials");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setFormError(null);

    if (!API_BASE) {
      setFormError("Backend not configured");
      return;
    }

    const fd = new FormData();
    Object.keys(registerForm).forEach((k) => fd.append(k, registerForm[k]));

    try {
      await axios.post(`${API_BASE}/auth/register/`, fd);
      alert("Registration successful");
      setShowRegisterModal(false);
    } catch {
      setFormError("Registration failed");
    }
  };

  /* ===================== UI ===================== */
  return (
    <div>
      {/* ===== HEADER ===== */}
      <header className="navbar">
        <div className="logo">
          <img src="logo.png" alt="Logo" />
        </div>

        <div className="auth">
          {isLoggedIn ? (
            <span>Welcome, {userName}</span>
          ) : (
            <>
              <button className="btn green" onClick={() => setShowRegisterModal(true)}>
                OPEN ACCOUNT
              </button>
              <button className="btn outline" onClick={() => setShowLoginModal(true)}>
                LOG IN
              </button>
            </>
          )}
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-left">
          <h1>DEPOSITS <em>AND</em><br />WITHDRAWALS</h1>
          <p>Fast, convenient & secure transactions.</p>
        </div>
        <div className="hero-right">
          <img
            src="https://eu-images.contentstack.com/v3/assets/blt73dfd92ee49f59a6/blt842b91c2f0323bb8/6780412520a74477d5c611e0/Image.webp"
            alt="Hero"
          />
        </div>
      </section>

      {/* ===== LOGIN MODAL ===== */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Login</h2>
            <button onClick={() => setShowLoginModal(false)}>×</button>
            {loginError && <p className="error-message">{loginError}</p>}
            <form onSubmit={handleLoginSubmit}>
              <input name="Email" placeholder="Email" onChange={handleLoginChange} />
              <input name="Password" type="password" placeholder="Password" onChange={handleLoginChange} />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}

      {/* ===== REGISTER MODAL ===== */}
      {showRegisterModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Register</h2>
            <button onClick={() => setShowRegisterModal(false)}>×</button>
            {formError && <p className="error-message">{formError}</p>}
            <form onSubmit={handleRegisterSubmit}>
              <input name="Name" placeholder="Full Name" onChange={handleRegisterChange} />
              <input name="Email" placeholder="Email" onChange={handleRegisterChange} />
              <input name="Password" type="password" placeholder="Password" onChange={handleRegisterChange} />
              <button type="submit">Register</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
