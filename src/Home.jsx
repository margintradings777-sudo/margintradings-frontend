import React, { useEffect, useState } from "react";
import api from "./api";

function Home() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
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
      <header>
        {isLoggedIn ? (
          <h3>Welcome, {userName}</h3>
        ) : (
          <button onClick={() => setShowLoginModal(true)}>Login</button>
        )}
      </header>

      {showLoginModal && (
        <div>
          <form onSubmit={handleLoginSubmit}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleLoginChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleLoginChange}
              required
            />
            <button type="submit">Login</button>
            {loginError && <p>{loginError}</p>}
          </form>
        </div>
      )}
    </>
  );
}

export default Home;
