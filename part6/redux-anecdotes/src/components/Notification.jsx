import React from 'react';
import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector(state => state.notification);
  
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  };

  
  return (
    <div style={notification !== "" ? style : { padding: 0 }}>
      {notification}
    </div>
  );
};

export default Notification;
