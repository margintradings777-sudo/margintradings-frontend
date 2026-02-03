import React, { useEffect, useMemo, useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [depositDetails, setDepositDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const navigate = useNavigate();

  const userId = useMemo(() => localStorage.getItem("userId"), []);
  const userPassword = useMemo(() => localStorage.getItem("userPassword"), []);

  const safe = (v) => {
    if (v === null || v === undefined || v === "") return "—";
    return String(v);
  };

  const openImageModal = (imageUrl) => {
    if (!imageUrl) return;
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage("");
  };

  const logoutHard = () => {
    localStorage.clear();
    navigate("/");
  };

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      if (!userId) {
        setError("User ID missing. Please login again.");
        setLoading(false);
        return;
      }
      if (!userPassword) {
        setError("Session expired (password missing). Please login again.");
        setLoading(false);
        return;
      }

      // ✅ Profile (GET) with password query param
      const prof = await api.get(`/apis/v1/profile/${userId}/`, {
        params: { password: userPassword },
      });
      setProfileData(prof.data);

      // ✅ Deposit account details (optional)
      try {
        const dep = await api.get(`/apis/v1/deposit-account-details/`);
        setDepositDetails(dep.data);
      } catch (e) {
        // optional: ignore
      }

      setLoading(false);
    } catch (e) {
      console.log("PROFILE LOAD ERROR:", e);
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.error ||
        (Array.isArray(e?.response?.data) ? e.response.data.join(", ") : "") ||
        e?.message ||
        "Failed to load profile";
      setError(msg);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- UI states (never blank) -----
  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.title}>User Profile</h2>
          <p style={{ padding: 8 }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.title}>User Profile</h2>
          <p style={{ color: "crimson", padding: 8 }}>{error}</p>

          <button style={styles.logout} onClick={loadAll}>
            Retry
          </button>

          <button
            style={{ ...styles.logout, background: "#111", marginTop: 10 }}
            onClick={logoutHard}
          >
            Login Again
          </button>
        </div>
      </div>
    );
  }

  // ----- field mapping (backend keys as per your screenshot) -----
  const name = profileData?.Name || profileData?.name;
  const email = profileData?.Email || profileData?.email;
  const phone = profileData?.Phone || profileData?.phone;

  const pan =
    profileData?.PAN_No ||
    profileData?.Pan ||
    profileData?.PAN ||
    profileData?.pan;

  const panImage =
    profileData?.PAN_Image ||
    profileData?.Pan_card_Image ||
    profileData?.PANImage ||
    profileData?.pan_image;

  const accountNo =
    profileData?.Account_No ||
    profileData?.AccountNumber ||
    profileData?.account_no;

  const ifsc =
    profileData?.IFSC_Code ||
    profileData?.IFSC_code ||
    profileData?.IFSC ||
    profileData?.ifsc;

  const bankDoc =
    profileData?.Bank_Document ||
    profileData?.Cancel_cheque_or_bank_statement ||
    profileData?.Bank_Statement;

  const balanceRaw = profileData?.Account_Balance ?? 0;

  // deposit details mapping
  const depBankName =
    depositDetails?.BankName ||
    depositDetails?.Bank_Name ||
    depositDetails?.bank_name;

  const depHolderName =
    depositDetails?.HolderName ||
    depositDetails?.Holder_Name ||
    depositDetails?.holder_name;

  const depAccountNo =
    depositDetails?.AccountNumber ||
    depositDetails?.Account_No ||
    depositDetails?.account_no;

  const depIFSC =
    depositDetails?.IFSC ||
    depositDetails?.IFSC_Code ||
    depositDetails?.IFSC_code ||
    depositDetails?.ifsc;

  const depQR = depositDetails?.QR || depositDetails?.qr;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>User Profile</h2>

        <div style={styles.row}>
          <div style={styles.label}>Name:</div>
          <div style={styles.value}>{safe(name)}</div>
        </div>

        <div style={styles.row}>
          <div style={styles.label}>Email:</div>
          <div style={styles.value}>{safe(email)}</div>
        </div>

        <div style={styles.row}>
          <div style={styles.label}>Phone:</div>
          <div style={styles.value}>{safe(phone)}</div>
        </div>

        <div style={styles.row}>
          <div style={styles.label}>PAN:</div>
          <div style={styles.value}>{safe(pan)}</div>
        </div>

        <div style={styles.row}>
          <div style={styles.label}>PAN Image:</div>
          <button
            style={styles.viewBtn}
            onClick={() => openImageModal(panImage)}
            disabled={!panImage}
          >
            👁 View
          </button>
        </div>

        <div style={styles.row}>
          <div style={styles.label}>Account No:</div>
          <div style={styles.value}>{safe(accountNo)}</div>
        </div>

        <div style={styles.row}>
          <div style={styles.label}>IFSC Code:</div>
          <div style={styles.value}>{safe(ifsc)}</div>
        </div>

        <div style={styles.row}>
          <div style={styles.label}>Bank Statement/Cheque:</div>
          <button
            style={styles.viewBtn}
            onClick={() => openImageModal(bankDoc)}
            disabled={!bankDoc}
          >
            👁 View
          </button>
        </div>

        <button style={styles.logout} onClick={logoutHard}>
          Logout
        </button>
      </div>

      <div style={styles.balanceCard}>
        <div style={styles.balanceTitle}>Account Balance</div>
        <div style={styles.balanceValue}>
          Rs.{Number(balanceRaw || 0).toFixed(2)}
        </div>
      </div>

      <div style={styles.depositCard}>
        <div style={styles.depositTitle}>Deposit Details</div>

        <div style={styles.row}>
          <div style={styles.label}>Bank Name:</div>
          <div style={styles.value}>{safe(depBankName)}</div>
        </div>

        <div style={styles.row}>
          <div style={styles.label}>Holder Name:</div>
          <div style={styles.value}>{safe(depHolderName)}</div>
        </div>

        <div style={styles.row}>
          <div style={styles.label}>Account No:</div>
          <div style={styles.value}>{safe(depAccountNo)}</div>
        </div>

        <div style={styles.row}>
          <div style={styles.label}>IFSC Code:</div>
          <div style={styles.value}>{safe(depIFSC)}</div>
        </div>

        <div style={styles.row}>
          <div style={styles.label}>QR:</div>
          <button
            style={styles.viewBtn}
            onClick={() => openImageModal(depQR)}
            disabled={!depQR}
          >
            👁 View
          </button>
        </div>
      </div>

      {showImageModal && (
        <div style={styles.modalOverlay} onClick={closeImageModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={closeImageModal}>
              ×
            </button>
            <img
              src={selectedImage}
              alt="Document"
              style={{ width: "100%", borderRadius: 10 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    padding: 16,
    maxWidth: 520,
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
    color: "#1e88e5",
    marginBottom: 16,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },
  label: { fontWeight: 600, color: "#555" },
  value: { color: "#111" },

  viewBtn: {
    border: "none",
    background: "transparent",
    color: "#111",
    cursor: "pointer",
    fontWeight: 600,
  },

  logout: {
    width: "100%",
    marginTop: 14,
    padding: "12px 14px",
    background: "#1e88e5",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    cursor: "pointer",
  },

  balanceCard: {
    background: "#eaf4ff",
    borderRadius: 12,
    padding: 18,
    textAlign: "center",
    marginBottom: 16,
    border: "1px solid #d6ecff",
  },
  balanceTitle: { fontSize: 26, fontWeight: 700, color: "#1e88e5" },
  balanceValue: { fontSize: 34, fontWeight: 800, color: "#22a447", marginTop: 10 },

  depositCard: {
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    marginBottom: 16,
  },
  depositTitle: {
    fontSize: 26,
    fontWeight: 800,
    color: "#1e88e5",
    textAlign: "center",
    marginBottom: 10,
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    zIndex: 9999,
  },
  modalContent: {
    background: "#fff",
    borderRadius: 12,
    padding: 12,
    maxWidth: 520,
    width: "100%",
    position: "relative",
  },
  modalClose: {
    position: "absolute",
    top: 6,
    right: 10,
    border: "none",
    background: "transparent",
    fontSize: 26,
    cursor: "pointer",
  },
};

export default Profile;
