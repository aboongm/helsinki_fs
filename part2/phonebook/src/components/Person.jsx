import React from "react";

const Person = ({ person, removePerson }) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ marginRight: "6px"}}>
        {person.name} {person.number}
      </div>
      <button 
      onClick={removePerson}
        style={{ 
          padding: "0", 
          paddingLeft: "6px", 
          paddingRight: "6px", 
          fontSize: 11 }}
      >
        delete
      </button>
    </div>
  );
};

export default Person;
