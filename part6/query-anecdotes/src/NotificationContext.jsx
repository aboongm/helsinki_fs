import { createContext, useContext, useReducer } from 'react';

const NotificationContext = createContext();

const initialState = {
  message: '',
  isVisible: false,
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return {
        ...state,
        message: action.payload,
        isVisible: true,
      };
    case 'CLEAR_NOTIFICATION':
      return {
        ...state,
        isVisible: false,
      };
    default:
      return state;
  }
};

export const NotificationContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const showNotification = (message, timeInSeconds) => {
    dispatch({ type: 'SHOW_NOTIFICATION', payload: message });
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' });
    }, timeInSeconds * 1000);
  };

  return (
    <NotificationContext.Provider value={{ notification: state, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};
