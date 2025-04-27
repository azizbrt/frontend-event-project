import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";

const Popup = ({ orderPopup, setOrderPopup }) => {
  const [registerPopup, setRegisterPopup] = useState(false);

  return (
    <>
      {orderPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          {registerPopup ? (
            <Register setRegisterPopup={setRegisterPopup} setOrderPopup={setOrderPopup} />
          ) : (
            <Login setOrderPopup={setOrderPopup} setRegisterPopup={setRegisterPopup} />
          )}
        </div>
      )}
    </>
  );
};

export default Popup;
