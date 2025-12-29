"use client";
import React, { useState } from "react";

export default function WelcomeModal({ users }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState("input"); // input | otp | welcome
  const [inputValue, setInputValue] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(null);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [error, setError] = useState("");
  const [debugOtp, setDebugOtp] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
    setStep("input");
    d;
    setError("");
  };

  // 1️⃣ EMAIL / PHONE SUBMIT
  const handleUserSubmit = async (e) => {
    e.preventDefault();

    // const user = users.find(
    //   (u) => u.email === inputValue || u.phone === inputValue
    // );
    const resa = await fetch(`/api/users?search=${inputValue}`);
    const dataa = await resa.json();
console.log(dataa,"aq")
    if (!dataa.users || dataa.users.length === 0) {
      setError("User not found ❌");
      return;
    }
    const user = dataa.users[0];

    if (!user) {
      setError("User not found ❌");
      return;
    }

    setUserId(user._id);
    const res = await fetch("/api/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id, value: inputValue }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }
    // setFoundUser(data.user); // optional
    // setUserId(data.userId);  // important
    setFoundUser(user);
    setStep("otp");
    setDebugOtp(data.otp);
    setError("");
    // const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    // setGeneratedOtp(otpCode);
    // setFoundUser(user);
    // setStep("otp");

    // console.log("OTP (demo):", otpCode); // 👈 SMS later
  };

  // 2️⃣ OTP VERIFY
  const handleOtpVerify = async (e) => {
    e.preventDefault();

    // if (otp !== generatedOtp) {
    //   setError("Invalid OTP ❌");
    //   return;
    // }
    setError("");
    console.log("VERIFY 👉", { userId, otp });
    const res = await fetch("/api/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        otp,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }
    console.log("VERIFY SUCCESS 👉", data);
    setStep("welcome");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setInputValue("");
    setOtp("");
    setFoundUser(null);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Find USER
      </button>

      {isModalOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            {/* STEP 1 */}
            {step === "input" && (
              <form onSubmit={handleUserSubmit}>
                <h3 className="font-bold mb-3">Enter Email or Phone</h3>
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="border w-full p-2 rounded"
                  required
                />
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <button className="bg-green-600 text-white w-full mt-3 p-2 rounded">
                  Send OTP
                </button>
              </form>
            )}

            {/* STEP 2 */}
            {step === "otp" && (
              <form onSubmit={handleOtpVerify}>
                <h3 className="font-bold mb-3">Enter OTP</h3>
                <p className="text-sm text-gray-500 mb-2">
                  OTP (dev): <b>{debugOtp}</b>
                </p>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="border w-full p-2 rounded"
                  required
                />
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <button className="bg-green-600 text-white w-full mt-3 p-2 rounded">
                  Verify OTP
                </button>
              </form>
            )}

            {/* STEP 3 */}
            {step === "welcome" && (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={foundUser.image || " avatar.png"}
                  alt="user"
                  classname="w-35 h-35 rounded-full object-cover border"
                />
                <h2 className="text-xl font-bold">Welcome 🎉</h2>
                <p className="mt-2">{foundUser.username}</p>
              </div>
            )}

            <button
              onClick={closeModal}
              className="bg-red-500 text-white mt-4 px-4 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    width: 300,
    textAlign: "center",
  },
};
