import React from "react";
import StatisticLine from "./StatisticLine";

const Statistics = (props) => {
  const { good, neutral, bad } = props;

  if (good === 0 && neutral === 0 && bad === 0) {
    return (
        <p>No feedback given</p>
    )
  }

  return (
    <div>      
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="all" value={good + neutral + bad} />
      <StatisticLine text="average" value={(good - bad) / (good + neutral + bad)} />
      <StatisticLine text="positive" value={(good * 100) / (good + neutral + bad)} />
    </div>
  );
};

export default Statistics;
