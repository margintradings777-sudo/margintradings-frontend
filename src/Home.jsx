import React, { useEffect, useState } from "react";
import api from "./api";

function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedLogin = localStorage.getItem("isLoggedIn");

    if (storedLogin === "true") {
      setIsLoggedIn(true);
      setUserName(storedName);
    }
  }, []);

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const res = await api.post("/arkbackend/auth/login/", {
        email: loginForm.email,
        password: loginForm.password,
      });

      localStorage.setItem("userId", res.data.user_id);
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("isLoggedIn", "true");

      setIsLoggedIn(true);
      setUserName(res.data.name);
      setShowLoginModal(false);
    } catch (err) {
      setLoginError("Invalid email or password");
    }
  };

  return (
    <>
      {/* HEADER */}
      <header style={{ padding: "20px", borderBottom: "1px solid #ddd" }}>
        {isLoggedIn ? (
          <h3>Welcome, {userName}</h3>
        ) : (
          <button onClick={() => setShowLoginModal(true)}>Login</button>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main style={{ padding: "20px" }}>
        <h1>Margin Tradings</h1>
        <p>
          Trade smarter. Manage your margin positions securely and efficiently.
        </p>

        {!isLoggedIn && (
          <p style={{ color: "#666" }}>
            Please login to access your dashboard.
          </p>
        )}
      </main>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div style={{ padding: "20px", border: "1px solid #ccc" }}>
          <form onSubmit={handleLoginSubmit}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleLoginChange}
              required
            />
            <br />

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleLoginChange}
              required
            />
            <br />

            <button type="submit">Login</button>

            {loginError && (
              <p style={{ color: "red" }}>{loginError}</p>
            )}
          </form>
        </div>
      )}
    </>
  );
}

export default Home;
