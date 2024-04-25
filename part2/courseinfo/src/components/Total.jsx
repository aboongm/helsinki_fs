import React from "react";

const Total = ({ parts }) => {
  const totalExercises = parts.reduce((acc, part) => acc + part.exercises, 0);

  return <p style={{fontWeight: 600}}>total of {totalExercises} exercises</p>;
};

export default Total;
