import React from 'react'

const Notification = ({ message, isError }) => {
  const notificationStyle = {
    color: isError ? 'red' : 'green',
    fontSize: 20,
    fontWeight: 600,
    padding: 10,
    borderWidth: 2,
    borderColor: isError ? 'red' : 'green',
    borderStyle: 'solid',
    borderRadius: 6,
    backgroundColor: 'lightgrey',
    marginBottom: 10,
  }

  if (!message) {
    return null
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

export default Notification
