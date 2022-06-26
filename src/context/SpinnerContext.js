import  { createContext, useState } from 'react';

const SpinnerContext = createContext();

export const SpinnerContextProvider = ({children}) => {
    const [ spinnerState, setSpinnerState ] = useState(false);

    const updateSpinnerState = state => {
        setSpinnerState(state)
    }

    // activating spinner
    const activateSpinner = () => {
        setSpinnerState(true);
    }

    // deactivating spinner
    const deactivateSpinner = () => {
        setSpinnerState(false);
    }

    // activating element click and also deactivating spinner
    const activateClick = element => {
        element.style.pointerEvents = "auto";
        deactivateSpinner();
    }

    // deactivating element click and also activating spinner
    const deactivateClick = element => {
        element.style.pointerEvents = "auto";
        activateSpinner();
    }

    return (
        <SpinnerContext.Provider value={{ spinnerState, updateSpinnerState, activateSpinner, deactivateSpinner, activateClick, deactivateClick }}>
            {children}
        </SpinnerContext.Provider>
    )
}

export default SpinnerContext;