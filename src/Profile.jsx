import React, { useEffect, useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [depositDetails, setDepositDetails] = useState(null);
  const [error, setError] = useState(null);

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/");
      return;
    }

    // 1) Profile
    api
      .get(`/auth/profile/${userId}/`)
      .then((res) => setProfileData(res.data))
      .catch(() => setError("Failed to load profile"));

    // 2) Deposit Account Details (optional endpoint)
    api
      .get(`/auth/deposit-account-details/`)
      .then((res) => setDepositDetails(res.data))
      .catch(() => {
        // optional hai; fail ho to UI still chalega
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
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

  if (error) return <p style={{ padding: 16 }}>{error}</p>;
  if (!profileData) return <p style={{ padding: 16 }}>Loading...</p>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>User Profile</h2>

        <div style={styles.row}>
          <div style={styles.label}>Name:</div>
          <div style={styles.value}>{profileData.Name || "—"}</div>
        </div>

        <div style={styles.row}>
          <div style={styles.label}>Email:</div>
          <div style={styles.value}>{profileData.Email || "—"}</div>
        </div>

        <div style={styles.row}>
          <div style={styles.label}>Phone:</div>
          <div style={styles.value}>{profileData.Phone || "—"}</div>
        </div>

        <div style={styles.row}>
          <div style={styles.label}>PAN:</div>
          <div style={styles.value}>{profileData.Pan || "—"}</div>
        </div>

        <div style={styles.row}>
          <div style={styles.label}>PAN Image:</div>
          <button
            style={styles.viewBtn}
            onClick={() => openImageModal(profileData.Pan_card_Image)}
            disabled={!profileData.Pan_card_Image}
          >
            👁 View
          </button>
        </div>

        <div style={styles.row}>
          <div style={styles.label}>Account No:</div>
          <div style={styles.value}>{profileData.Account_No || "—"}</div>
        </div>

        <div style={styles.row}>
          <div style={styles.label}>IFSC Code:</div>
          <div style={styles.value}>{profileData.IFSC_code || "—"}</div>
        </div>

        <div style={styles.row}>
          <div style={styles.label}>Bank Statement/Cheque:</div>
          <button
            style={styles.viewBtn}
            onClick={() =>
              openImageModal(profileData.Cancel_cheque_or_bank_statement)
            }
            disabled={!profileData.Cancel_cheque_or_bank_statement}
          >
            👁 View
          </button>
        </div>

        <button style={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Account Balance Card */}
      <div style={styles.balanceCard}>
        <div style={styles.balanceTitle}>Account Balance</div>
        <div style={styles.balanceValue}>
          Rs.{Number(profileData.Account_Balance || 0).toFixed(2)}
        </div>
      </div>

      {/* Deposit Details Card */}
      {depositDetails && (
        <div style={styles.depositCard}>
          <div style={styles.depositTitle}>Deposit Details</div>

          <div style={styles.row}>
            <div style={styles.label}>Bank Name:</div>
            <div style={styles.value}>{depositDetails.Bank_Name || "—"}</div>
          </div>

          <div style={styles.row}>
            <div style={styles.label}>Holder Name:</div>
            <div style={styles.value}>{depositDetails.Holder_Name || "—"}</div>
          </div>

          <div style={styles.row}>
            <div style={styles.label}>Account No:</div>
            <div style={styles.value}>{depositDetails.Account_No || "—"}</div>
          </div>

          <div style={styles.row}>
            <div style={styles.label}>IFSC Code:</div>
            <div style={styles.value}>{depositDetails.IFSC || "—"}</div>
          </div>

          <div style={styles.row}>
            <div style={styles.label}>QR:</div>
            <button
              style={styles.viewBtn}
              onClick={() => openImageModal(depositDetails.QR)}
              disabled={!depositDetails.QR}
            >
              👁 View
            </button>
          </div>
        </div>
      )}

      {/* Image Modal */}
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
