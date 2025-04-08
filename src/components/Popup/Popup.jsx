import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

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
