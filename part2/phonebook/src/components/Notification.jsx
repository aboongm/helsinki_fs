import React from 'react'

const Notification = ({ message }) => {
    const notificationStyle = {
        color: 'green',
        fontSize: 16,
        fontWeight: 600,
        padding: 10,
        borderWidth: 2,
        borderColor: 'green',
        borderStyle: 'solid',
        borderRadius: 6,
        backgroundColor: 'lightgrey',
        marginBottom: 6
    }
    console.log(message, notificationStyle);

    if (message === null) {
        return null
    }
  return (
    <div style={notificationStyle}>
        {message}
    </div>
  )
}

export default Notification