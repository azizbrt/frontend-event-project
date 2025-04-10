import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";

const Popup = ({ orderPopup, setOrderPopup }) => {
  const [registerPopup, setRegisterPopup] = useState(false);


  return (
    <>
      {orderPopup && <Login setOrderPopup={setOrderPopup} setRegisterPopup={setRegisterPopup} />}
      {registerPopup && <Register setRegisterPopup={setRegisterPopup} setOrderPopup={setOrderPopup} />}

    </>
  );
};

export default Popup;
