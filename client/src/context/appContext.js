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
    SETUP_USER_ERROR,
    TOGGLE_SIDEBAR,
    LOGOUT_USER,
    UPDATE_USER_BEGIN,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    HANDLE_CHANGE,
    CLEAR_VALUES,
    CREATE_JOB_BEGIN,
    CREATE_JOB_SUCCESS,
    CREATE_JOB_ERROR,
    GET_JOBS_BEGIN,
    GET_JOBS_SUCCESS,
    SET_EDIT_JOB,
    DELETE_JOB_BEGIN,
    EDIT_JOB_BEGIN,
    EDIT_JOB_SUCCESS,
    EDIT_JOB_ERROR,    
    SHOW_STATS_BEGIN,
    SHOW_STATS_SUCCESS,
    CLEAR_FILTERS
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
    showSidebar: false,
    isEditing: false,
    editJobId: '',
    position: '',
    company: '',
    jobLocation: userLocation || '',
    jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
    jobType: 'full-time',
    statusOptions: ['pending', 'interview', 'declined'],
    status: 'pending',
    jobs: [],
    totalJobs: 0,
    numOfPages: 1,
    page: 1,
    stats: {},
    monthlyApplications: [],
    search: '',
    searchStatus: 'all',
    searchType: 'all',
    sort: 'latest',
    sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
}

const AppContext = createContext()

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    // axios global setup for headers
    // authorization para sa headers
    // axios.defaults.headers['Authorization'] = `Bearer ${state.token}`

    // axios instance and can be used globally(also needed when using an interceptor)
    const authFetch = axios.create({
        baseURL: '/api/v1',
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
    })

    // axios interceptor(in a way its like a middleware)
    // it means is that you can attach some functionality as your request leave the application and as the requests are coming back. So in a way, you can think of it as a middleware.
    
    // request
    // we do something before the request is sent
    authFetch.interceptors.request.use(
        (config) => {
            // add the headers before the request is sent
            config.headers['Authorization'] = `Bearer ${state.token}`

            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    // response
    // we get the response data after we made the request
    authFetch.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            // console.log("%c Line:74 🍫 error", "color:#ea7e5c", error.response)
            // if ang token nag error 401 then logout ang user
            if (error.response.status === 401) {
                // console.log("%c Line:76 🥪 error", "color:#7f2b82", 'AUTH ERROR')
                // from LOGOUT_USER
                logoutUser()
            }
            return Promise.reject(error)
        }
    )
    
    // from DISPLAY_ALERT
    const displayAlert = () => {
        dispatch({ type: DISPLAY_ALERT })
        // from CLEAR_ALERT
        clearAlert()
    }

    // from CLEAR_ALERT
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

    // from REGISTER_USER_BEGIN, REGISTER_USER_SUCCESS, REGISTER_USER_ERROR
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
        // from CLEAR_ALERT
        clearAlert()
    }

    // from LOGIN_USER_BEGIN, LOGIN_USER_SUCCESS, LOGIN_USER_ERROR
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
        // from CLEAR_ALERT
        clearAlert()
    }
    
    // from SETUP_USER_BEGIN, SETUP_USER_SUCCESS, SETUP_USER_ERROR
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
        // from CLEAR_ALERT
        clearAlert()
    }
    
    // from UPDATE_USER_BEGIN, UPDATE_USER_SUCCESS, UPDATE_USER_ERROR
    const updateUser = async (currentUser) => {
        // console.log("%c Line:135 🍩 currentUser", "color:#33a5ff", currentUser)
        dispatch({ type: UPDATE_USER_BEGIN })
        try {
            // manual approach
            // const { data } = await axios.patch('/api/v1/auth/updateUser', currentUser, {
            //     headers: {
            //         Authorization: `Bearer ${state.token}`,
            //     },
            // })

            // global headers approach
            // const { data } = await axios.patch('/api/v1/auth/updateUser', currentUser)

            // using instance
            const { data } = await authFetch.patch('/auth/updateUser', currentUser)
            // console.log("%c Line:138 🍉 data", "color:#93c0a4", data)

            const { user, location, token } = data

            dispatch({
                type: UPDATE_USER_SUCCESS,
                payload: { user, location, token },
            })

            addUserToLocalStorage({ user, location, token })
            // addUserToLocalStorage({ user, location, token: initialState.token })
        } catch (error) {
            // console.log("%c Line:144 🍧 error", "color:#ed9ec7", error.response)
            // dispatch({
            //     type: UPDATE_USER_ERROR,
            //     payload: { msg: error.response.data.msg },
            // })
            if (error.response.status !== 401) {
                dispatch({
                    type: UPDATE_USER_ERROR,
                    payload: { msg: error.response.data.msg },
                })
            }
        }
        // from CLEAR_ALERT
        clearAlert()
    }
    // from CREATE_JOB_BEGIN, CREATE_JOB_SUCCESS, CREATE_JOB_ERROR
    const createJob = async () => {
        dispatch({ type: CREATE_JOB_BEGIN })
        try {
            const { position, company, jobLocation, jobType, status } = state
        
            await authFetch.post('/jobs', {
                company,
                position,
                jobLocation,
                jobType,
                status,
            })
            dispatch({
                type: CREATE_JOB_SUCCESS,
            })
            // call function instead clearValues()
            dispatch({ type: CLEAR_VALUES })
        } catch (error) {
            if (error.response.status === 401) return
            dispatch({
                type: CREATE_JOB_ERROR,
                payload: { msg: error.response.data.msg },
            })
        }
        // from CLEAR_ALERT
        clearAlert()
    }

    // from HANDLE_CHANGE
    const handleChange = ({ name, value }) => {
        dispatch({
          type: HANDLE_CHANGE,
          payload: { name, value },
        })
    }

    // from CLEAR_VALUES
    const clearValues = () => {
        dispatch({ type: CLEAR_VALUES })
    }

    // from GET_JOBS_BEGIN, GET_JOBS_SUCCESS
    const getJobs = async () => {
        let url = `/jobs`
      
        dispatch({ type: GET_JOBS_BEGIN })
        try {
            const { data } = await authFetch(url)
            const { jobs, totalJobs, numOfPages } = data
            dispatch({
                type: GET_JOBS_SUCCESS,
                payload: {
                    jobs,
                    totalJobs,
                    numOfPages,
                },
            })
        } catch (error) {
            console.log(error.response)
            // comment kai when ever we had an error 400 or 401 it will logout automatically and its kinda annoying since we only want to fetch the getJobs 
            // from LOGOUT_USER
            // logoutUser()
        }
        // clear the alert after fetching the getJobs
        // from CLEAR_ALERT
        clearAlert()
    }

    useEffect(() => {
        // from GET_JOBS_BEGIN, GET_JOBS_SUCCESS
        getJobs()
    }, [])

    // from SET_EDIT_JOB
    const setEditJob = (id) => {
        // console.log(`set edit job : ${id}`)
        dispatch({ type: SET_EDIT_JOB, payload: { id } })
    }

    // from EDIT_JOB_BEGIN, EDIT_JOB_SUCCESS, EDIT_JOB_ERROR
    const editJob = async () => {
        // console.log('edit job')
        dispatch({ type: EDIT_JOB_BEGIN })
        try {
            const { position, company, jobLocation, jobType, status } = state

            await authFetch.patch(`/jobs/${state.editJobId}`, {
                company,
                position,
                jobLocation,
                jobType,
                status,
            })
            dispatch({
                type: EDIT_JOB_SUCCESS,
            })
            dispatch({ type: CLEAR_VALUES })
        } catch (error) {
            if (error.response.status === 401) return

            dispatch({
                type: EDIT_JOB_ERROR,
                payload: { msg: error.response.data.msg },
            })
        }
        clearAlert()
    }

    // from DELETE_JOB_BEGIN
    const deleteJob = async (jobId) =>{
        // console.log(`delete : ${id}`)
        dispatch({ type: DELETE_JOB_BEGIN })
        try {
            await authFetch.delete(`/jobs/${jobId}`)
            getJobs()
        } catch (error) {
            logoutUser()
        }
    }

    // from SHOW_STATS_BEGIN, SHOW_STATS_SUCCESS
    const showStats = async () => {
        dispatch({ type: SHOW_STATS_BEGIN })
        try {
            const { data } = await authFetch('/jobs/stats')
            dispatch({
                type: SHOW_STATS_SUCCESS,
                payload: {
                    stats: data.defaultStats,
                    monthlyApplications: data.monthlyApplications,
                },
            })
        } catch (error) {
            console.log(error.response)
            // logoutUser()
        }
        clearAlert()
    }
    
    // from CLEAR_FILTERS
    const clearFilters = () =>{
        // console.log('clear filters')
        dispatch({ type: CLEAR_FILTERS })
    }

    // from TOGGLE_SIDEBAR
    const toggleSidebar = () => {
        dispatch({ type: TOGGLE_SIDEBAR })
    }
    
    // from LOGOUT_USER
    const logoutUser = () => {
        dispatch({ type: LOGOUT_USER })
        removeUserFromLocalStorage()
    }

    return (
        <AppContext.Provider value={{ 
            ...state,
            displayAlert,
            registerUser,
            loginUser,
            setupUser,
            updateUser,
            toggleSidebar,
            logoutUser,
            handleChange,
            clearValues,
            createJob,
            getJobs,
            setEditJob,
            editJob,
            deleteJob,
            showStats,
            clearFilters
        }}>
            {children}
        </AppContext.Provider>
    )
}

const useAppContext = () => {
    return useContext(AppContext)
}
 
export { AppProvider, initialState, useAppContext } 