import React, { useContext } from 'react';
import NotificationContext from '../context/NotificationContext';

const Notification = () => {
    const { notificationState, notificationMessage, updateNotificationState } = useContext(NotificationContext)

    const closeNotification = () => {
        console.log()
        updateNotificationState(false, {
            type: "",
            title: "",
            message: ""
        })
    }

    return (
    <>
    {
        notificationState
        &&
        <div className="notification">
            <div className={`notfication-container notfication-${notificationMessage.type} ${!notificationState &&  "notfication-hide"}`}>
                <div className="notfication--message">
                    <div className="notfication--message--text">
                        <span className="notfication--message--text--title">{notificationMessage.title}</span>
                        <span className="notfication--message--text--msg">: {notificationMessage.message}</span>
                    </div>
                </div>
                <div className="notfication--btn" onClick={closeNotification}>
                <div className="notification--btn--close">
                    X
                </div>
                </div>
            </div>
        </div>
    }
    </>
  )
}

export default Notification