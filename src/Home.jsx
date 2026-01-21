import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();


  const [loginForm, setLoginForm] = useState({
    Email: "",
    Password: "",
  });

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
    const storedUserName = localStorage.getItem("userName");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    if (storedIsLoggedIn === "true") {
      setIsLoggedIn(true);
      setUserName(storedUserName);
    }
  }, []);

  const handleRegisterChange = (e) => {
    const { name, value, files } = e.target;
    setRegisterForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ LOGIN FIX (payload backend-safe)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login/`,
        {
          email: loginForm.Email,
          password: loginForm.Password,
        }
      );

      setIsLoggedIn(true);
      setUserName(res.data.name || loginForm.Email);

      localStorage.setItem("userName", res.data.name || loginForm.Email);
      localStorage.setItem("userId", res.data.user_id);
      localStorage.setItem("isLoggedIn", "true");

      setShowLoginModal(false);

      navigate("/profile");
  
    } catch (err) {
      setLoginError("Login failed. Please check your credentials.");
      localStorage.setItem("isLoggedIn", "false");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    let isValid = true;

    for (const key in registerForm) {
      if (!registerForm[key]) {
        newErrors[key] = "This field is mandatory.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    if (!isValid) {
      setFormError("Please correct the errors in the form.");
      return;
    }

    const formData = new FormData();
    for (const key in registerForm) {
      formData.append(key, registerForm[key]);
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Registration successful!");
      setShowRegisterModal(false);
    } catch (error) {
      setFormError("Registration failed. Please try again.");
    }
  };

  return (
    <div>
      {/* ================= HEADER ================= */}
      <header className="navbar">
        <div className="logo">
          <img src="logo.png" alt="Margin traders Logo" />
        </div>

        <div className="auth">
          {isLoggedIn ? (
            <div className="user-profile">
              <a href="#/profile" className="profile-link">
                Welcome, {userName}
              </a>
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
          <div className="lang">
            🌐 <span>EN</span>
          </div>
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
          <p>
            Every transaction you make with FBS is fast,
            <br />
            convenient, and secure.
          </p>
        </div>

        <div className="hero-right">
          <img
            src="https://eu-images.contentstack.com/v3/assets/blt73dfd92ee49f59a6/blt842b91c2f0323bb8/6780412520a74477d5c611e0/Image.webp"
            alt="FBS Coins"
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
                <label>Email</label>
                <input
                  type="email"
                  name="Email"
                  value={loginForm.Email}
                  onChange={handleLoginChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="Password"
                  value={loginForm.Password}
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

      <div class="container1">
        <div class="box1">
          UNLIMITED TRANSACTIONS
          <br />
          AFTER FULL VERIFICATION
        </div>
        <div class="box1">
          GLOBAL AND LOCAL
          <br />
          PAYMENT METHODS
        </div>
        <div class="box1">
          COMMISSIONS FROM
          <br />0
        </div>
        <div class="box1">
          INSTANT AUTOMATED <br /> WITHDRAWALS
          <br />
          AVAILABLE
        </div>
      </div>

      <section className="payment-section">
        <div className="header-row">
          <h1>
            <span>200+</span> PAYMENT METHODS
          </h1>
          <div className="country-dropdown">Aland Islands ⌄</div>
        </div>

      </section>

      <div class="headline">
        <span>YOUR FUNDS ARE SAFE</span>
        <br />
        WITH FBS
      </div>

      <div class="cardsFUNDS">
        <div class="cardFUNDS">
          <img
            src="https://eu-images.contentstack.com/v3/assets/blt73dfd92ee49f59a6/bltb9d387936add8ff4/6780412eab896b7bfcdc4442/5370677516396677523.webp"
            alt="Icon"
          />
          <h3>SEGREGATED ACCOUNTS</h3>
          <p>
            We keep traders’ funds in insured accounts at multiple tier-1 banks,
            separate from company balances.
          </p>
        </div>
        <div class="cardFUNDS">
          <img
            src="https://eu-images.contentstack.com/v3/assets/blt73dfd92ee49f59a6/bltb9d387936add8ff4/6780412eab896b7bfcdc4442/5370677516396677523.webp"
            alt="Icon"
          />
          <h3>SECURE WITHDRAWALS</h3>
          <p>
            We safeguard your withdrawals with one-time password (OTP)
            verification methods.
          </p>
        </div>
        <div class="cardFUNDS">
          <img
            src="https://eu-images.contentstack.com/v3/assets/blt73dfd92ee49f59a6/bltb9d387936add8ff4/6780412eab896b7bfcdc4442/5370677516396677523.webp"
            alt="Icon"
          />
          <h3>PCI DSS</h3>
          <p>
            We comply with the Payment Card Industry Data Security Standard to
            reduce card fraud and secure cardholder data.
          </p>
        </div>
        <div class="cardFUNDS">
          <img
            src="https://eu-images.contentstack.com/v3/assets/blt73dfd92ee49f59a6/bltb9d387936add8ff4/6780412eab896b7bfcdc4442/5370677516396677523.webp"
            alt="Icon"
          />
          <h3>3D SECURE PAYMENTS</h3>
          <p>
            We provide extra security with SMS code authentication for online
            card transactions, so only you can authorize them.
          </p>
        </div>
      </div>

      <button class="cta-buttonFUNDS">Fund account</button>

      <div className="deposit">
        <div class="section-title">
          DEPOSIT IN <span>THREE STEPS</span>
        </div>

        <div class="contentdeposit">
          <div class="left-box">
            <h4>Step 2</h4>
            <h2>CHOOSE PREFERRED PAYMENT METHOD</h2>
            <p>
              Click the <span>Deposit</span> button to view both global and
              local ways to deposit.
            </p>

            <div class="nav-dots">
              <div class="dots">
                <div class="dot"></div>
                <div class="dot active"></div>
                <div class="dot"></div>
              </div>
              <div class="arrows">
                <button class="arrow-btn">&#8592;</button>
                <button class="arrow-btn">&#8594;</button>
              </div>
            </div>
          </div>

          <div class="right-box">
            <img
              src="https://t4.ftcdn.net/jpg/10/25/20/99/240_F_1025209992_cBIaceKCiASpJMTR5yhWYPwa9n4zjGFW.jpg"
              alt="Phone Deposit Example"
            />
          </div>
        </div>

        <button class="cta-buttondeposit">Open account</button>
      </div>

      <section class="conditions-section">
        <div class="conditions-left">
          <h1>
            OUR CONDITIONS
            <span>UNCOVER YOUR POTENTIAL</span>
          </h1>
        </div>
        <div class="conditions-right">
          <p>
            Order execution from 0.01 seconds. Floating spreads from 0.7 pips.
            Demo and Swap Free options available.
          </p>
          <div class="features-grid">
            <div class="feature">
              Open positions <b>up to 500, including 200 pending orders</b>
            </div>
            <div class="feature">
              Flexible leverage <b>up to 1:3000</b>
            </div>
            <div class="feature">
              Initial deposit <b>from $5</b>
            </div>
            <div class="feature">
              Order volume <b>from 0.01 to 500 lots</b>
            </div>
            <div class="feature">
              Margin call <b>40%</b>
            </div>
            <div class="feature">
              Stop out <b>20%</b>
            </div>
          </div>
          <a href="#" class="cta-btnour">
            See all conditions →
          </a>
        </div>
      </section>

      <section class="faq-section">
        <div class="faq-left">
          <h2>
            NEED MORE <span>INFORMATION?</span>
          </h2>
        </div>
        <div class="faq-right">
          <div class="faq-item">
            <div class="faq-question">How does FBS secure my funds?</div>
            <div class="faq-icon">+</div>
            <div class="faq-answer">
              FBS secures your funds through segregated accounts and
              industry-standard encryption protocols.
            </div>
          </div>
          <div class="faq-item">
            <div class="faq-question">How do I deposit funds?</div>
            <div class="faq-icon">+</div>
            <div class="faq-answer">
              You can deposit funds using bank transfer, credit/debit cards, or
              e-wallets in your client area.
            </div>
          </div>
          <div class="faq-item">
            <div class="faq-question">How do I withdraw funds?</div>
            <div class="faq-icon">+</div>
            <div class="faq-answer">
              Withdrawals can be requested via your dashboard using the same
              method as your deposit.
            </div>
          </div>
        </div>
      </section>

      <footer class="footer">
        <div class="footer-top">
          <div class="social-media">
            <strong>FBS at social media</strong>
            <div class="social-icons">
              <i class="fab fa-facebook-f"></i>
              <i class="fab fa-instagram"></i>
              <i class="fab fa-youtube"></i>
              <i class="fab fa-telegram-plane"></i>
            </div>
          </div>
          <div class="contact-us">
            <strong>Contact us</strong>
            <div class="contact-icons">
              <i class="fas fa-envelope"></i>
              <i class="fab fa-telegram-plane"></i>
              <i class="fab fa-whatsapp"></i>
            </div>
          </div>
          <a href="#" class="google-play-btn">
            <i class="fab fa-google-play"></i> Get on the Google Play
          </a>
        </div>

        <div class="footer-links">
          <div>
            <h4>Trading</h4>
            <a href="#">Trading conditions</a>
            <a href="#">Deposits & withdrawals</a>
            <a href="#">FBS app</a>
            <a href="#">MetaTrader 5</a>
            <a href="#">MetaTrader 4</a>
            <a href="#">Open a Forex account</a>
          </div>
          <div>
            <h4>Market</h4>
            <a href="#">Forex</a>
            <a href="#">Metals</a>
            <a href="#">Indices</a>
            <a href="#">Energies</a>
            <a href="#">Stocks</a>
            <a href="#">Forex Exotic</a>
          </div>
          <div>
            <h4>Tools</h4>
            <a href="#">Economic calendar</a>
            <a href="#">Trading calculators</a>
            <a href="#">VPS</a>
          </div>
          <div>
            <h4>Analytics</h4>
            <a href="#">Market Analytics</a>
            <a href="#">VIP Analytics</a>
            <a href="#">Top trades of the hour</a>
          </div>
          <div>
            <h4>Education</h4>
            <a href="#">FBS Academy</a>
            <a href="#">Trader's blog</a>
            <a href="#">Glossary</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#">About FBS</a>
            <a href="#">Legal documents</a>
            <a href="#">Company news</a>
            <a href="#">Career at FBS</a>
            <a href="#">FC Leicester City</a>
            <a href="#">Live Chat</a>
            <a href="#">Callback</a>
            <a href="#">Help Center</a>
          </div>
          <div>
            <h4>Address</h4>
            <p>Sky City at Borivali, E Block 808,</p>
            <p>Borivali West, Mumbai, Maharashtra,</p>
            <p>Pin Code: 400092, India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
