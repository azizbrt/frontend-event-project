import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
  // State for the 6-digit code, each digit in its own slot
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  // Refs for each input field to control focus
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { error, isLoading, verifyEmail } = useAuthStore();

  // Handle changes in the input fields
  const handleChange = (index, value) => {
    const newCode = [...code];
    if (value.length === 1) {
      newCode[index] = value;
      setCode(newCode);
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value.length > 1) {
      // Handle paste: split the pasted value and fill in the inputs
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const firstEmptyIndex = newCode.findIndex((digit) => digit === "");
      if (firstEmptyIndex !== -1) {
        inputRefs.current[firstEmptyIndex].focus();
      }
    }
  };

  // Handle backspace: move focus to the previous input if current is empty
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Modified handleSubmit that doesn't require an event parameter
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const verificationCode = code.join("");
    try {
      await verifyEmail(verificationCode);
      toast.success("Verified successfully!");
      navigate("/utilisateurs");
    } catch (error) {
      toast.error("Verification failed!");
    }
  };

  // Auto-submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(); // Call handleSubmit directly without creating a new event
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-orange-500 to-orange-400 text-transparent bg-clip-text">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter the 6-digit code sent to your email address.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none"
              />
            ))}
          </div>
          {error && (
            <div className="text-red-500 text-center">
              {error.message}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-orange-600 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
