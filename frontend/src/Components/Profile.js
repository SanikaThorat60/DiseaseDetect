import React, { useEffect } from "react";
import { toast } from "react-toastify";
import "../App.css";

function Profile({ user }) {
  useEffect(() => {
    if (user) {
      toast.success(`Welcome back, ${user.name}!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [user]);

  if (!user) return "Please login first";

  return (
    <div className="Profile">
      <h1>Welcome {user.name}!!</h1>
      <div className="card">
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
      </div>
    </div>
  );
}

export default Profile;
