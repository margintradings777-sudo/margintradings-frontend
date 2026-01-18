import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  useEffect(() => {
    getdata();
  }, []);
  useEffect(() => {
    getdata1();
  }, []);

  const [list, SetList] = useState([]);
  const [list1, SetList1] = useState([]);
  const [item, SetItem] = useState({
    Status: "Panding",
  });
  const [activeTab, setActiveTab] = useState("deposit");

  const getdata1 = () => {
    axios
      .get("https://arktrader.in/arkbackend/apis/v1/Deposit")
      .then((res) => SetList1(res.data || []));
  };
  const additem = () => {
    axios
      .post("https://arktrader.in/arkbackend/apis/v1/withdrawal", item)
      .then(() => {
        getdata();
      });
  };

  const getdata = () => {
    axios
      .get("https://arktrader.in/arkbackend/apis/v1/withdrawal")
      .then((res) => SetList(res.data || []));
  };
  return (
    <div>
      <header class="navbar">
        <div class="logo">
          <img
            src="https://upload.meeshosupplyassets.com/cataloging/1746964597587/Screenshot2025-05-11172618.png"
            alt="FBS Logo"
          />
        </div>

        {/* <nav class="menu">
      <span>Trading <span class="arrow">▼</span></span>
      <span>Analytics & Education <span class="arrow">▼</span></span>
      <span>Company <span class="arrow">▼</span></span>
      <span>Partnership programs <span class="arrow">▼</span></span>
    </nav> */}

        <div class="auth">
          <button class="btn green">OPEN ACCOUNT</button>
          <button class="btn outline">LOG IN</button>
          <div class="lang">
            🌐 <span>EN</span>
          </div>
        </div>
      </header>

      <section class="hero">
        <div class="hero-left">
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
          <button class="cta">Deposit to trade</button>
        </div>
        <div class="hero-right">
          <img
            src="https://eu-images.contentstack.com/v3/assets/blt73dfd92ee49f59a6/blt842b91c2f0323bb8/6780412520a74477d5c611e0/Image.webp?quality=90&format=webp"
            alt="FBS Coins"
          />
        </div>
      </section>

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

        <div className="tabs">
          <div
            className={`tab ${activeTab === "deposit" ? "active" : ""}`}
            onClick={() => setActiveTab("deposit")}
          >
            To deposit
          </div>
          <div
            className={`tab ${activeTab === "withdraw" ? "active" : ""}`}
            onClick={() => setActiveTab("withdraw")}
          >
            To withdraw
          </div>
        </div>

{/*   
        {activeTab === "deposit" &&
          list1?.map((i, n) => (
            <div className="deposit-page">
              <div className="bank-info">
                <h2>
                  Deposit to Bank: <span>{i.BankName}</span>
                </h2>
              </div>

              <div className="qr-section">
                <h3>Scan QR to Deposit</h3>
                <img src={i.QR} alt="QR Code" />
              </div>
            </div>
          ))}

      
        {activeTab === "withdraw" && (
          <div className="form-section">
            <h2>Withdrawal Form</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                additem();
              }}
            >
              <div className="form-group">
                <label>Full Name</label>
                <input
                  value={item.Name}
                  onChange={(e) => SetItem({ ...item, Name: e.target.value })}
                  type="text"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  value={item.Amount}
                  onChange={(e) => SetItem({ ...item, Amount: e.target.value })}
                  type="number"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <button className="cta-buttonFUNDS" type="submit">
                Submit Withdrawal
              </button>
            </form>
          </div>
        )} */}
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
            <h4>Partnership programs</h4>
            <a href="#">IB Program</a>
            <a href="#">IB Multi-level Partnership</a>
            <a href="#">CPA Program</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
