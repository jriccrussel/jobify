import React, { useEffect, createContext, useState, useContext, useReducer } from 'react'
import reducer from './reducer' 
import axios from 'axios' 
import { 
    DISPLAY_ALERT,
    CLEAR_ALERT,
    REGISTER_USER_BEGIN,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR,
    LOGIN_USER_BEGIN,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR,    
    SETUP_USER_BEGIN,
    SETUP_USER_SUCCESS,
    SETUP_USER_ERROR
} from "./actions"

// set as default
const token = localStorage.getItem('token')
const user = localStorage.getItem('user')
const userLocation = localStorage.getItem('location')

const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: user ? JSON.parse(user) : null,
    token: token,
    userLocation: userLocation || '',
    jobLocation: userLocation || '',
}

const AppContext = createContext()

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const displayAlert = () => {
        dispatch({ type: DISPLAY_ALERT })
        clearAlert()
    }

    const clearAlert = () => {
        setTimeout(() => dispatch({ type: CLEAR_ALERT }), 3000)
    }

    const addUserToLocalStorage = ({ user, token, location }) => {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        localStorage.setItem('location', location)
    }
    
    const removeUserFromLocalStorage = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('location')
    }

    const registerUser = async (currentUser) => {
        // console.log("%c Line:30 🍒 currentUser", "color:#b03734", currentUser)
        dispatch({ type: REGISTER_USER_BEGIN })
        try {
            const response = await axios.post('/api/v1/auth/register', currentUser)
            console.log("%c Line:36 🥤 response", "color:#42b983", response)

            const {
                user,
                token,
                location 
            } = response.data

            dispatch({
                type: REGISTER_USER_SUCCESS,
                payload: { user, token, location }
            })
            // Local storage
            addUserToLocalStorage({ user, token, location })
        } catch (error) {
            // console.log("%c Line:54 🥒 error", "color:#b03734", error.response)            
            dispatch({
                type: REGISTER_USER_ERROR,
                payload: { msg: error.response.data.msg }
            })
        }
        clearAlert()
    }

    const loginUser = async (currentUser) => {
        dispatch({ type: LOGIN_USER_BEGIN })
        try {
            const { data } = await axios.post('/api/v1/auth/login', currentUser)
            const { user, token, location } = data
        
            dispatch({
                type: LOGIN_USER_SUCCESS,
                payload: { user, token, location },
            })
        
            addUserToLocalStorage({ user, token, location })
        } catch (error) {
            dispatch({
                type: LOGIN_USER_ERROR,
                payload: { msg: error.response.data.msg },
            })
        }
        clearAlert()
    }

    const setupUser = async ({ currentUser, endPoint, alertText}) => {
        dispatch({ type: SETUP_USER_BEGIN })
        try {
            const { data } = await axios.post(`/api/v1/auth/${endPoint}`, currentUser)
            const { user, token, location } = data
        
            dispatch({
                type: SETUP_USER_SUCCESS,
                payload: { user, token, location, alertText },
            })
        
            addUserToLocalStorage({ user, token, location })
        } catch (error) {
            dispatch({
                type: SETUP_USER_ERROR,
                payload: { msg: error.response.data.msg },
            })
        }
        clearAlert()
    }

    return (
        <AppContext.Provider value={{ 
            ...state,
            displayAlert,
            registerUser,
            loginUser,
            setupUser
        }}>
            {children}
        </AppContext.Provider>
    )
}

const useAppContext = () => {
    return useContext(AppContext)
}
 
export { AppProvider, initialState, useAppContext } 