import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

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

  const [list, SetList] = useState([]);
  const [list1, SetList1] = useState([]);

  const [item, SetItem] = useState({
    Status: "Panding",
  });

  const [activeTab, setActiveTab] = useState("deposit");

  useEffect(() => {
    getdata();
  }, []);

  useEffect(() => {
    // Check if user is logged in by checking localStorage
    const storedUserName = localStorage.getItem("userName");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    if (storedIsLoggedIn === "true") {
      setIsLoggedIn(true);
      setUserName(storedUserName || "");
    }
  }, []);

  const getdata1 = () => {
    axios
      .get(`${BASE}/apis/v1/Deposit/`)
      .then((res) => SetList1(res.data || []))
      .catch((err) => console.log(err));
  };

  const additem = () => {
    axios
      .post(`${BASE}/apis/v1/withdrawal/`, item)
      .then(() => {
        getdata();
      })
      .catch((err) => console.log(err));
  };

  const getdata = () => {
    axios
      .get(`${BASE}/apis/v1/withdrawal/`)
      .then((res) => SetList(res.data || []))
      .catch((err) => console.log(err));
  };

  const handleRegisterChange = (e) => {
    const { name, value, files } = e.target;
    setRegisterForm((prevForm) => ({
      ...prevForm,
      [name]: files ? files[0] : value,
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const response = await axios.post(
        `${BASE}/apis/v1/login/`,
        {
          Email: loginForm.Email,
          Password: loginForm.Password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setIsLoggedIn(true);
      setUserName(response.data.name || "");

      localStorage.setItem("userName", response.data.name || "");
      localStorage.setItem("userId", response.data.user_id);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userPassword", loginForm.Password);

      setShowLoginModal(false);
    } catch (error) {
      console.error(
        "Login failed:",
        error.response ? error.response.data : error.message
      );
      setLoginError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
      localStorage.setItem("isLoggedIn", "false");
    }
  };

  const handleRegisterChange = (e) => {
  const { name, value } = e.target;

  const file =
    e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;

  setRegisterForm((prev) => ({
    ...prev,
    [name]: file ? file : value,
  }));

  // field change hote hi error clear
  setErrors((prev) => ({ ...prev, [name]: "" }));
};

  const handleRegisterSubmit = async (e) => {
  e.preventDefault();

  setErrors({});
  setFormError(null);

  try {
    // ✅ strict required field check (simple & safe)
    const requiredFields = [
      "Name",
      "Email",
      "Password",
      "Phone",
      "Pan",
      "Pan_card_Image",
      "Account_No",
      "IFSC_code",
      "Cancel_cheque_or_bank_statement",
    ];

    const newErrors = {};
    let isValid = true;

    requiredFields.forEach((key) => {
      const v = registerForm[key];

      if (key === "Pan_card_Image" || key === "Cancel_cheque_or_bank_statement") {
        if (!(v instanceof File)) {
          newErrors[key] = "This field is mandatory.";
          isValid = false;
        }
        return;
      }

      if (!v || String(v).trim() === "") {
        newErrors[key] = "This field is mandatory.";
        isValid = false;
      }
    });

    // extra validations (same as before)
    if (registerForm.Email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(registerForm.Email)) {
      newErrors.Email = "Invalid email format.";
      isValid = false;
    }

    if (registerForm.Password && registerForm.Password.length < 6) {
      newErrors.Password = "Password must be at least 6 characters long.";
      isValid = false;
    }

    if (registerForm.Phone && !/^\d{10}$/.test(registerForm.Phone)) {
      newErrors.Phone = "Phone number must be 10 digits.";
      isValid = false;
    }

    if (registerForm.Pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(registerForm.Pan)) {
      newErrors.Pan = "Invalid PAN format.";
      isValid = false;
    }

    if (registerForm.Account_No && !/^\d+$/.test(registerForm.Account_No)) {
      newErrors.Account_No = "Account number must be numeric.";
      isValid = false;
    }

    if (registerForm.IFSC_code && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(registerForm.IFSC_code)) {
      newErrors.IFSC_code = "Invalid IFSC code format.";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      setFormError("Please correct the errors in the form.");
      return;
    }

    // ✅ build FormData (file + text)
    const formData = new FormData();
    Object.keys(registerForm).forEach((key) => {
      const val = registerForm[key];
      formData.append(key, val instanceof File ? val : (val ?? ""));
    });

    // ✅ correct endpoint (tumhare backend ke hisaab se)
    const res = await axios.post(`${BASE}/auth/register/`, formData, ...

      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Registration successful:", res.data);
    alert("Registration successful!");
    setShowRegisterModal(false);
  } catch (error) {
    console.log("Registration failed:", error?.response?.data || error.message);

    // backend errors show
    const data = error?.response?.data;
    if (data && typeof data === "object") {
      setErrors(data);
      setFormError("Registration failed. Please fix the highlighted fields.");
    } else {
      setFormError("Registration failed. Please try again.");
    }
  }
};


  // text fields
  if (!v || String(v).trim() === "") {
    newErrors[key] = "This field is mandatory.";
    isValid = false;
  }
});


    // Email validation
    if (
      registerForm.Email &&
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(registerForm.Email)
    ) {
      newErrors.Email = "Invalid email format.";
      isValid = false;
    }

    // Password strength (example: at least 6 characters)
    if (registerForm.Password && registerForm.Password.length < 6) {
      newErrors.Password = "Password must be at least 6 characters long.";
      isValid = false;
    }

    // Phone number validation (example: 10 digits)
    if (registerForm.Phone && !/^\d{10}$/.test(registerForm.Phone)) {
      newErrors.Phone = "Phone number must be 10 digits.";
      isValid = false;
    }

    // PAN validation (example: 10 alphanumeric characters)
    if (
      registerForm.Pan &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(registerForm.Pan)
    ) {
      newErrors.Pan = "Invalid PAN format.";
      isValid = false;
    }

    // Account Number validation (example: numeric)
    if (registerForm.Account_No && !/^\d+$/.test(registerForm.Account_No)) {
      newErrors.Account_No = "Account number must be numeric.";
      isValid = false;
    }

    // IFSC Code validation (example: 11 alphanumeric characters)
    if (
      registerForm.IFSC_code &&
      !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(registerForm.IFSC_code)
    ) {
      newErrors.IFSC_code = "Invalid IFSC code format.";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      setFormError("Please correct the errors in the form.");
      return;
    }

    setFormError(null);

    const formData = new FormData();
    for (const key in registerForm) {
      formData.append(key, registerForm[key]);
    }

    try {
      const response = await axios.post(`${BASE}/apis/v1/register/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Registration successful:", response.data);
      setFormError(null);
      alert("Registration successful!");
      setShowRegisterModal(false); // Close modal on success
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response ? error.response.data : error.message
      );
      setFormError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div>
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

          <div className="app-buttons">
            <a
              href="https://apps.apple.com/jo/app/osense-trader/id6741929487"
              target="_blank"
              rel="noopener noreferrer"
              className="app-button apple-store"
            >
              <i className="fab fa-apple"></i> App Store
            </a>
            <a
              href="https://arktrader.co/androidapks/ArkTrader.apk"
              target="_blank"
              rel="noopener noreferrer"
              className="app-button play-store"
            >
              <i className="fab fa-google-play"></i> Play Store
            </a>
          </div>
        </div>

        <div className="hero-right">
          <img
            src="https://eu-images.contentstack.com/v3/assets/blt73dfd92ee49f59a6/blt842b91c2f0323bb8/6780412520a74477d5c611e0/Image.webp?quality=90&format=webp"
            alt="FBS Coins"
          />
        </div>
      </section>

      {showRegisterModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Register Account</h2>
            <button
              className="close-button"
              onClick={() => setShowRegisterModal(false)}
            >
              &times;
            </button>

            {formError && <p className="error-message">{formError}</p>}

            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="Name"
                  value={registerForm.Name}
                  onChange={handleRegisterChange}
                  required
                />
                {errors.Name && <p className="error-message">{errors.Name}</p>}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="Email"
                  value={registerForm.Email}
                  onChange={handleRegisterChange}
                  required
                />
                {errors.Email && <p className="error-message">{errors.Email}</p>}
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="Password"
                  value={registerForm.Password}
                  onChange={handleRegisterChange}
                  required
                />
                {errors.Password && (
                  <p className="error-message">{errors.Password}</p>
                )}
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="Phone"
                  value={registerForm.Phone}
                  onChange={handleRegisterChange}
                  required
                />
                {errors.Phone && <p className="error-message">{errors.Phone}</p>}
              </div>

              <div className="form-group">
                <label>PAN</label>
                <input
                  type="text"
                  name="PAN_No"
                  value={registerForm.PAN_No}
                  onChange={handleRegisterChange}
                  required
                />
                {errors.PAN_No && <p className="error-message">{errors.PAN_No}</p>}
              </div>

              <div className="form-group">
                <label>PAN Card Image</label>
                <input
                  type="file"
                  name="PAN_Image"
                  onChange={handleRegisterChange}
                  accept="image/*"
                  required
                />
                {errors.PAN_Image && (
                  <p className="error-message">{errors.PAN_Image}</p>
                )}
              </div>

              <div className="form-group">
                <label>Account Number</label>
                <input
                  type="text"
                  name="Account_No"
                  value={registerForm.Account_No}
                  onChange={handleRegisterChange}
                  required
                />
                {errors.Account_No && (
                  <p className="error-message">{errors.Account_No}</p>
                )}
              </div>

              <div className="form-group">
                <label>IFSC Code</label>
                <input
                  type="text"
                  name="IFSC_code"
                  value={registerForm.IFSC_code}
                  onChange={handleRegisterChange}
                  required
                />
                {errors.IFSC_code && (
                  <p className="error-message">{errors.IFSC_code}</p>
                )}
              </div>

              <div className="form-group">
                <label>Cancel Cheque or Bank Statement</label>
                <input
                  type="file"
                  name="Bank_Document"
                  onChange={handleRegisterChange}
                  accept="image/*,application/pdf"
                  required
                />
                {errors.Bank_Document && (
                  <p className="error-message">
                    {errors.Bank_Document}
                  </p>
                )}
              </div>

              <button type="submit" className="cta-buttonFUNDS">
                Register
              </button>
            </form>
          </div>
        </div>
      )}

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

      <div className="container1">
        <div className="box1">
          UNLIMITED TRANSACTIONS
          <br />
          AFTER FULL VERIFICATION
        </div>
        <div className="box1">
          GLOBAL AND LOCAL
          <br />
          PAYMENT METHODS
        </div>
        <div className="box1">
          COMMISSIONS FROM
          <br />0
        </div>
        <div className="box1">
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

      <div className="headline">
        <span>YOUR FUNDS ARE SAFE</span>
        <br />
        WITH FBS
      </div>

      <div className="cardsFUNDS">
        <div className="cardFUNDS">
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

        <div className="cardFUNDS">
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

        <div className="cardFUNDS">
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

        <div className="cardFUNDS">
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

      <button className="cta-buttonFUNDS">Fund account</button>

      <div className="deposit">
        <div className="section-title">
          DEPOSIT IN <span>THREE STEPS</span>
        </div>

        <div className="contentdeposit">
          <div className="left-box">
            <h4>Step 2</h4>
            <h2>CHOOSE PREFERRED PAYMENT METHOD</h2>
            <p>
              Click the <span>Deposit</span> button to view both global and
              local ways to deposit.
            </p>

            <div className="nav-dots">
              <div className="dots">
                <div className="dot"></div>
                <div className="dot active"></div>
                <div className="dot"></div>
              </div>
              <div className="arrows">
                <button className="arrow-btn">&#8592;</button>
                <button className="arrow-btn">&#8594;</button>
              </div>
            </div>
          </div>

          <div className="right-box">
            <img
              src="https://t4.ftcdn.net/jpg/10/25/20/99/240_F_1025209992_cBIaceKCiASpJMTR5yhWYPwa9n4zjGFW.jpg"
              alt="Phone Deposit Example"
            />
          </div>
        </div>

        <button className="cta-buttondeposit">Open account</button>
      </div>

      <section className="conditions-section">
        <div className="conditions-left">
          <h1>
            OUR CONDITIONS
            <span>UNCOVER YOUR POTENTIAL</span>
          </h1>
        </div>
        <div className="conditions-right">
          <p>
            Order execution from 0.01 seconds. Floating spreads from 0.7 pips.
            Demo and Swap Free options available.
          </p>
          <div className="features-grid">
            <div className="feature">
              Open positions <b>up to 500, including 200 pending orders</b>
            </div>
            <div className="feature">
              Flexible leverage <b>up to 1:3000</b>
            </div>
            <div className="feature">
              Initial deposit <b>from $5</b>
            </div>
            <div className="feature">
              Order volume <b>from 0.01 to 500 lots</b>
            </div>
            <div className="feature">
              Margin call <b>40%</b>
            </div>
            <div className="feature">
              Stop out <b>20%</b>
            </div>
          </div>
          <a href="#" className="cta-btnour">
            See all conditions →
          </a>
        </div>
      </section>

      <section className="faq-section">
        <div className="faq-left">
          <h2>
            NEED MORE <span>INFORMATION?</span>
          </h2>
        </div>
        <div className="faq-right">
          <div className="faq-item">
            <div className="faq-question">How does FBS secure my funds?</div>
            <div className="faq-icon">+</div>
            <div className="faq-answer">
              FBS secures your funds through segregated accounts and
              industry-standard encryption protocols.
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">How do I deposit funds?</div>
            <div className="faq-icon">+</div>
            <div className="faq-answer">
              You can deposit funds using bank transfer, credit/debit cards, or
              e-wallets in your client area.
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">How do I withdraw funds?</div>
            <div className="faq-icon">+</div>
            <div className="faq-answer">
              Withdrawals can be requested via your dashboard using the same
              method as your deposit.
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-top">
          <div className="social-media">
            <strong>FBS at social media</strong>
            <div className="social-icons">
              <i className="fab fa-facebook-f"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-youtube"></i>
              <i className="fab fa-telegram-plane"></i>
            </div>
          </div>

          <div className="contact-us">
            <strong>Contact us</strong>
            <div className="contact-icons">
              <i className="fas fa-envelope"></i>
              <i className="fab fa-telegram-plane"></i>
              <i className="fab fa-whatsapp"></i>
            </div>
          </div>

          <a href="#" className="google-play-btn">
            <i className="fab fa-google-play"></i> Get on the Google Play
          </a>
        </div>

        <div className="footer-links">
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
