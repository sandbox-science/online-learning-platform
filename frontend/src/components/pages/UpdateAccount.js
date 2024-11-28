import React, { useState } from "react";

export function UpdateAccount() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = async (type) => {
    const url =
      type === "username"
        ? "http://localhost:4000/update-username"
        : type === "email"
        ? "http://localhost:4000/update-email"
        : "http://localhost:4000/update-password";

    const payload =
      type === "username"
        ? { username }
        : type === "email"
        ? { email, confirm_email: confirmEmail }
        : { password, confirm_password: confirmPassword };

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      setMessage(result.message || "Update successful!");
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Update Account</h2>
      <div>
        <h3>Update Username</h3>
        <input
          type="text"
          placeholder="New Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={() => handleUpdate("username")}>Update Username</button>
      </div>
      <div>
        <h3>Update Email</h3>
        <input
          type="email"
          placeholder="New Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="email"
          placeholder="Confirm Email"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
        />
        <button onClick={() => handleUpdate("email")}>Update Email</button>
      </div>
      <div>
        <h3>Update Password</h3>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={() => handleUpdate("password")}>Update Password</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}
