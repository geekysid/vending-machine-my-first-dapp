import  { createContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationContextProvider = ({children}) => {
    const [ notificationState, setNotificationState ] = useState(false);
    const [ notificationMessage, setNotificationMessage ] = useState({
        type: "",
        title: "",
        message: ""
    });

    const updateNotificationState = ( state, message ) => {
        setNotificationState(state);
        setNotificationMessage(prevState => message);
        if (state) {
            setTimeout(() => {
                setNotificationState(false);
                setNotificationMessage({
                    type: "",
                    title: "",
                    message: ""
                });
            }, 7000)
        }
    }

    return (
        <NotificationContext.Provider value={{
            notificationState,
            notificationMessage,
            updateNotificationState
        }}>
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationContext;