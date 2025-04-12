import React from "react";
import AddEvent from "./AddEvent";
import EventsList from "./EventsList";

const CRUDevenement = () => {
  return (
    <div style={{ padding: "20px" }}>
      <AddEvent />
      <EventsList />
    </div>
  );
};

export default CRUDevenement;
