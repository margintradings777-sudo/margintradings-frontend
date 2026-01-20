import React, { useEffect, useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/");
      return;
    }

    api
      .get(`/arkbackend/auth/profile/${userId}/`)
      .then((res) => setUserDetails(res.data))
      .catch(() => setError("Failed to load profile"));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (error) return <p>{error}</p>;
  if (!userDetails) return <p>Loading...</p>;

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {userDetails.Name}</p>
      <p>Email: {userDetails.Email}</p>
      <p>Phone: {userDetails.Phone}</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;

