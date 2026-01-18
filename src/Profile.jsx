import React, { useState, useEffect } from 'react';
import './Profile.css'; // Assuming a new CSS file for profile styling
import axios from 'axios';
import Footer from './components/footer';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [accountBalance, setAccountBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalError, setWithdrawalError] = useState(null);
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);
  const [depositDetails, setDepositDetails] = useState(null);
  const [depositError, setDepositError] = useState(null);
  const navigate = useNavigate()


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const userPassword = localStorage.getItem('userPassword');

        if (!userId || !userPassword) {
          setError('User is not logged in. Please log in first.');
          setLoading(false);
          return;
        }

        const url = `${import.meta.env.VITE_API_BASE_URL}/auth/profile/${userId}/?password=${encodeURIComponent(userPassword)}`;
        const response = await axios.get(url); 
        
        setUserDetails(response.data);
        setAccountBalance(response.data.Account_Balance);
      } catch (err) {
        setError('Failed to fetch profile data. Please try again later.');
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = () => {
  // Remove all user-related data from localStorage
  localStorage.removeItem('userName');
  localStorage.removeItem('userId');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userPassword');
  alert("Logged out successfully!")
  navigate('/')

  // Update your state to reflect logout
  setIsLoggedIn(false);
  setUserName(null);

  console.log("User logged out successfully");
};


  useEffect(() => {
    const fetchDepositDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/deposit-account-details/`);
        setDepositDetails(response.data);
      } catch (err) {
        setDepositError('Failed to fetch deposit details. Please try again later.');
        console.error('Error fetching deposit details:', err);
      }
    };

    fetchDepositDetails();
  }, []);

  const openImageModal = (imageUrl) => {
    setCurrentImage(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setCurrentImage('');
  };

  const handleWithdrawalChange = (e) => {
    setWithdrawalAmount(e.target.value);
  };

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();
    setWithdrawalError(null);
    setWithdrawalSuccess(false);

    const amount = parseFloat(withdrawalAmount);

    if (isNaN(amount) || amount <= 0) {
      setWithdrawalError('Please enter a valid positive amount.');
      return;
    }

    if (amount > accountBalance) {
      setWithdrawalError('Withdrawal amount exceeds available balance.');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/withdrawal/`, { Amount: amount, user: localStorage.getItem('userId'), password: localStorage.getItem('userPassword') });
      setWithdrawalSuccess(true);
      setWithdrawalAmount('');
      alert('Withdrawal request placed successfully. Funds will be distributed within 2 business days!');
    } catch (err) {
      setWithdrawalError(err.response?.data?.message || 'Withdrawal failed. Please try again.');
      console.error('Error during withdrawal:', err);
    }
  };

  if (loading) {
    return <div className="profile-container">Loading profile...</div>;
  }

  if (error) {
    return <div className="profile-container error-message">{error}</div>;
  }

  if (!userDetails) {
    return <div className="profile-container">No user details found.</div>;
  }

  return (
    <>
    <div className="profile-container">
      <h2 className="profile-heading">User Profile</h2>
      <div className="profile-details">
        <div className="detail-item">
          <strong>Name:</strong> <span>{userDetails.Name}</span>
        </div>
        <div className="detail-item">
          <strong>Email:</strong> <span>{userDetails.Email}</span>
        </div>
        <div className="detail-item">
          <strong>Phone:</strong> <span>{userDetails.Phone}</span>
        </div>
        <div className="detail-item">
          <strong>PAN:</strong> <span>{userDetails.Pan}</span>
        </div>
        <div className="detail-item">
          <strong>PAN Image:</strong> 
          {userDetails.Pan_card_Image && (
            <span className="view-image" onClick={() => openImageModal(userDetails.Pan_card_Image)}>
              <i className="fas fa-eye"></i> View
            </span>
          )}
        </div>
        <div className="detail-item">
          <strong>Account No:</strong> <span>{userDetails.Account_No}</span>
        </div>
        <div className="detail-item">
          <strong>IFSC Code:</strong> <span>{userDetails.IFSC_code}</span>
        </div>
        <div className="detail-item">
          <strong>Bank Statement/Cheque:</strong>
          {userDetails.Cancel_cheque_or_bank_statement && (
            <span className="view-image" onClick={() => openImageModal(userDetails.Cancel_cheque_or_bank_statement)}>
              <i className="fas fa-eye"></i> View
            </span>
          )}
        </div>
        <br/>
        <br/>
        <button onClick={handleLogout}>Logout</button>

        {/* Add more details as needed from registration process */}
      </div>

      <div className="account-balance">
        <h3>Account Balance</h3>
        <p className="balance-amount">{accountBalance !== null ? `Rs.${accountBalance}` : 'N/A'}</p>
      </div>

      <div className="deposit-details-section">
        <h3>Deposit Details</h3>
        {depositError && <p className="error-message">{depositError}</p>}
        {depositDetails ? (
          <div className="deposit-details-content">
            <div className="detail-item">
              <strong>Bank Name:</strong> <span>{depositDetails.BankName}</span>
            </div>
            <div className="detail-item">
              <strong>Holder Name:</strong> <span>{depositDetails.HolderName}</span>
            </div>
            <div className="detail-item">
              <strong>Account Number:</strong> <span>{depositDetails.AccountNumber}</span>
            </div>
            <div className="detail-item">
              <strong>IFSC:</strong> <span>{depositDetails.IFSC}</span>
            </div>
            {depositDetails.QRImage && (
              <div className="qr-code-section">
                <strong>QR Code:</strong>
                <img src={`${depositDetails.QRImage}`} alt="QR Code" className="qr-image" />
              </div>
            )}
          </div>
        ) : (
          !depositError && <p>Loading deposit details...</p>
        )}
      </div>

      <div className="withdrawal-section">
        <h3>Withdraw Funds</h3>
        <form onSubmit={handleWithdrawalSubmit} className="withdrawal-form">
          <div className="form-group">
            <label htmlFor="withdrawalAmount">Amount:</label>
            <input
              type="number"
              id="withdrawalAmount"
              value={withdrawalAmount}
              onChange={handleWithdrawalChange}
              placeholder="Enter amount to withdraw"
              min="0"
              step="0.01"
              required
            />
          </div>
          {withdrawalError && <p className="error-message">{withdrawalError}</p>}
          {withdrawalSuccess && <p className="success-message">Withdrawal request placed successfully. Funds will be distributed within 2 business days!</p>}
          <button type="submit" className="btn green">Request Withdrawal</button>
        </form>
      </div>

      {showImageModal && (
        <div className="image-modal-overlay" onClick={closeImageModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeImageModal}>&times;</span>
            <img src={currentImage} alt="Document" className="modal-image" />
          </div>
        </div>
      )}
    </div>
    <Footer/>

    </>
  );
};

export default Profile;
