import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ Email: "", Password: "" });
  const [loginError, setLoginError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

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

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    const storedUserName = localStorage.getItem("userName");
    if (storedIsLoggedIn === "true") {
      setIsLoggedIn(true);
      setUserName(storedUserName);
    }
  }, []);

  const handleRegisterChange = (e) => {
    const { name, value, files } = e.target;
    setRegisterForm((p) => ({ ...p, [name]: files ? files[0] : value }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((p) => ({ ...p, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login/`,
        loginForm
      );
      setIsLoggedIn(true);
      setUserName(res.data.name);
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("isLoggedIn", "true");
      setShowLoginModal(false);
    } catch (err) {
      setLoginError("Login failed");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(registerForm).forEach((k) =>
      formData.append(k, registerForm[k])
    );
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register/`,
        formData
      );
      alert("Registration successful");
      setShowRegisterModal(false);
    } catch {
      setFormError("Registration failed");
    }
  };

  return (
    <div>
      <header className="navbar">
        <div className="logo">
          <img src="logo.png" alt="Logo" />
        </div>

        <div className="auth">
          {isLoggedIn ? (
            <div className="user-profile">
              Welcome, {userName}
            </div>
          ) : (
            <>
              <button
                className="btn green"
                onClick={() => setShowRegisterModal(true)}
              >
                OPEN ACCOUNT
              </button>
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

      <section className="hero">
        <div className="hero-left">
          <h1>
            DEPOSITS <em>AND</em> <br /> WITHDRAWALS
          </h1>
        </div>
        <div className="hero-right">
          <img
            src="https://eu-images.contentstack.com/v3/assets/blt73dfd92ee49f59a6/blt842b91c2f0323bb8/6780412520a74477d5c611e0/Image.webp"
            alt="Hero"
          />
        </div>
      </section>

      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Login</h2>
            <button onClick={() => setShowLoginModal(false)}>×</button>
            {loginError && <p>{loginError}</p>}
            <form onSubmit={handleLoginSubmit}>
              <input
                type="email"
                name="Email"
                value={loginForm.Email}
                onChange={handleLoginChange}
                placeholder="Email"
              />
              <input
                type="password"
                name="Password"
                value={loginForm.Password}
                onChange={handleLoginChange}
                placeholder="Password"
              />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}

      {showRegisterModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Register</h2>
            <button onClick={() => setShowRegisterModal(false)}>×</button>
            {formError && <p>{formError}</p>}
            <form onSubmit={handleRegisterSubmit}>
              <input name="Name" onChange={handleRegisterChange} placeholder="Name" />
              <input name="Email" onChange={handleRegisterChange} placeholder="Email" />
              <input name="Password" type="password" onChange={handleRegisterChange} placeholder="Password" />
              <button type="submit">Register</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
