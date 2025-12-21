import React from "react";
import "../App.css";

function Profile({ user }) {
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
