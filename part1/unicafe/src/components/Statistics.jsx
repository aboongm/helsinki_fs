import React from "react";

const Statistics = (props) => {
  const { good, neutral, bad } = props;
  return (
    <div>
      <h1>statistics</h1>
      <div>good {good}</div>
      <div>neutral {neutral}</div>
      <div>bad {bad}</div>
      <div>all {good + neutral + bad}</div>
      <div>average {(good - bad) / (good + neutral + bad)}</div>
      <div>positive {(good * 100) / (good + neutral + bad)} %</div>
    </div>
  );
};

export default Statistics;
