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
    DELETE_JOB_ERROR,
    EDIT_JOB_BEGIN,
    EDIT_JOB_SUCCESS,
    EDIT_JOB_ERROR,    
    SHOW_STATS_BEGIN,
    SHOW_STATS_SUCCESS,
    CLEAR_FILTERS,
    CHANGE_PAGE
} from "./actions"

import { initialState } from './appContext'

const reducer = (state, action) => {
    if(action.type === DISPLAY_ALERT) {
        return {
            ...state,
            showAlert: true,
            alertType: 'danger',
            alertText: 'Please provide all values!',
        }
    }
    if(action.type === CLEAR_ALERT) {
        return {
            ...state,
            showAlert: false,
            alertType: '',
            alertText: '',
        }
    }
    if(action.type === REGISTER_USER_BEGIN) {
        return {
            ...state, 
            isLoading: true 
        }
    }
    if(action.type === REGISTER_USER_SUCCESS) {
        return {
            ...state, 
            isLoading: false,
            // token: action.payload.token,
            user: action.payload.user,
            userLocation: action.payload.location,
            jobLocation: action.payload.location,
            showAlert: true,
            alertType: 'success',
            alertText: 'User Created! Redirecting...'
        }
    }
    if(action.type === REGISTER_USER_ERROR) {
        return {
            ...state, 
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg
        }
    }
    if(action.type === LOGIN_USER_BEGIN) {
        return {
            ...state, 
            isLoading: true 
        }
    }
    if(action.type === LOGIN_USER_SUCCESS) {
        return {
            ...state, 
            isLoading: false,
            user: action.payload.user,
            // token: action.payload.token,
            userLocation: action.payload.location,
            jobLocation: action.payload.location,
            showAlert: true,
            alertType: 'success',
            alertText: 'Login Successful! Redirecting...'
        }
    }
    if(action.type === LOGIN_USER_ERROR) {
        return {
            ...state, 
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg
        }
    }
    if(action.type === SETUP_USER_BEGIN) {
        return {
            ...state, 
            isLoading: true 
        }
    }
    if(action.type === SETUP_USER_SUCCESS) {
        return {
            ...state, 
            isLoading: false,
            user: action.payload.user,
            // token: action.payload.token,
            userLocation: action.payload.location,
            jobLocation: action.payload.location,
            showAlert: true,
            alertType: 'success',
            alertText: action.payload.alertText
        }
    }
    if(action.type === SETUP_USER_ERROR) {
        return {
            ...state, 
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg
        }
    }
    if (action.type === TOGGLE_SIDEBAR) {
        return { ...state, showSidebar: !state.showSidebar }
    }
    // para sa logout sa ato reducer instead of using ...state we use ...initialState inig logout nato we need to set it to default g avoid nato e grab ato state kai naa dto ang mga data
    if (action.type === LOGOUT_USER) {
        return {
          ...initialState,
          user: null,
          // token: null,
          userLocation: '',
          jobLocation: '',
        }
    }
    if (action.type === UPDATE_USER_BEGIN) {
        return { ...state, isLoading: true }
    }      
    if (action.type === UPDATE_USER_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            token:action.payload.token,
            user: action.payload.user,
            userLocation: action.payload.location,
            jobLocation: action.payload.location,
            showAlert: true,
            alertType: 'success',
            alertText: 'User Profile Updated!',
        }
    }
    if (action.type === UPDATE_USER_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg,
        }
    }
    // HANDLE_CHANGE
    if (action.type === HANDLE_CHANGE) {
        // return { ...state, [action.payload.name]: action.payload.value }
        // we add 'page: 1'  to set as default for page para sa ato state, we want it so kung mag search ta, search what status, type or sort sa ato search form component we always set back to page 1 

        // issue if exmaple ni adto ka page 3 then ang search ka, then ang request naa permi sa page 3, we need the request always set back to page 1 every timne mag search ta, search what status, type or sort sa ato search form component
        return { ...state, page: 1, [action.payload.name]: action.payload.value }
    }
    // CLEAR_VALUES
    if (action.type === CLEAR_VALUES) {
        const initialState = {
            isEditing: false,
            editJobId: '',
            position: '',
            company: '',
            jobLocation: state.userLocation,
            jobType: 'full-time',
            status: 'pending',
        }
        return { ...state, ...initialState }
    }
    // from CREATE_JOB_BEGIN
    if (action.type === CREATE_JOB_BEGIN) {
        return { ...state, isLoading: true }
    }
    // from CREATE_JOB_SUCCESS
    if (action.type === CREATE_JOB_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'success',
            alertText: 'New Job Created!',
        }
    }
    // from CREATE_JOB_ERROR
    if (action.type === CREATE_JOB_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg,
        }
    }
    // from GET_JOBS_BEGIN
    if (action.type === GET_JOBS_BEGIN) {
        return { ...state, isLoading: true, showAlert: false }
    }
    // from GET_JOBS_SUCCESS
    if (action.type === GET_JOBS_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            jobs: action.payload.jobs,
            totalJobs: action.payload.totalJobs,
            numOfPages: action.payload.numOfPages,
        }
    }
    // from SET_EDIT_JOB
    if (action.type === SET_EDIT_JOB) {
        const job = state.jobs.find((job) => job._id === action.payload.id)
        const { _id, position, company, jobLocation, jobType, status } = job
        return {
            ...state,
            isEditing: true,
            editJobId: _id,
            position,
            company,
            jobLocation,
            jobType,
            status,
        }
    }
    
    // from DELETE_JOB_BEGIN
    if (action.type === DELETE_JOB_BEGIN) {
        return { ...state, isLoading: true }
    }

    // from DELETE_JOB_ERROR
    if (action.type === DELETE_JOB_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg,
        }
    }

    // from EDIT_JOB_BEGIN
    if (action.type === EDIT_JOB_BEGIN) {
        return { ...state, isLoading: true }
    }

    // from EDIT_JOB_SUCCESS
    if (action.type === EDIT_JOB_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'success',
            alertText: 'Job Updated!',
        }
    }

    // from EDIT_JOB_ERROR
    if (action.type === EDIT_JOB_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg,
        }
    }

    // from SHOW_STATS_BEGIN
    if (action.type === SHOW_STATS_BEGIN) {
        return { ...state, isLoading: true, showAlert: false }
    }

    // from SHOW_STATS_SUCCESS
    if (action.type === SHOW_STATS_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            stats: action.payload.stats,
            monthlyApplications: action.payload.monthlyApplications,
        }
    }

    // from CLEAR_FILTERS
    if (action.type === CLEAR_FILTERS) {
        return {
            ...state,
            search: '',
            searchStatus: 'all',
            searchType: 'all',
            sort: 'latest',
        }
    }

    // from CHANGE_PAGE
    if (action.type === CHANGE_PAGE) {
        return { ...state, page: action.payload.page };
    }
        
    throw new Error(`no such action ${action.type}`)
}

export default reducer