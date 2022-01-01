import { errorMessages } from '../components/misc/Axios'
const authentication_reducer =  (initialState = { user: JSON.parse(localStorage.getItem("user")) || "", token: localStorage.getItem("token") || "", uid: localStorage.getItem("uid") || "" , client: localStorage.getItem("client") || "" , default_path: localStorage.getItem("default_path") || "" , loggedIn: localStorage.getItem("loggedIn") || false, error_message: null }, action) => {
    switch (action.type) {
        case "SAVE_USER":
            return {
                ...action.payload
            }
            break;

        case "TOGGLE_APP_DRAWER": 
        return {
            ...initialState,
            show_app_drawer: !(initialState.show_app_drawer || false)
        }
        break;
        case "PRINTDOCUMENT": 
        return {
            ...initialState,
            show_print_dialog: true
        }
        case "LOGGINGIN":
        
        return{
            ...initialState,
            loading: true
        }
        case "HIDE_APP_DRAWER": 
        return {
            ...initialState,
            show_app_drawer: false,
        }
        break;
       
        case "LOGIN_SUCCESS":
            
            setLocalData(action);

            return {
                ...initialState,
                user: action.user.data,
                token: action.token,
                uid: action.uid,
                client: action.client,
                default_path: action.default_path,
                loggedIn: true,
                loginErrorMessage: null,
                loading: false
            }
            break;
        case "SIGNUP_FAILED": 
            return {
                ...initialState,
                signing_up: false,
                signupErrorMessage: action.error_message.response.data.errors.full_messages

            }
        break;
        case "UPDATE_USER": 
        localStorage.setItem("user", JSON.stringify(action.user))
        return {
            ...initialState,
            user: action.user
        }
    break;
        case "SIGNUP_IN_PROGRESS": 
        return {
            ...initialState,
            signupErrorMessage: null,
            signing_up: true
        }
        break;
        case "SIGNUP_SUCCESS":
            return {
                ...initialState,
                signupErrorMessage: null,
                signing_up: false,
                signupSuccessMessage: "An email has been sent to your email. Kindly Confirm your Account via the email"
            }
        break;
        case "LOGIN_FAILED":
            
            if (action.hasOwnProperty('error_message')) {

                localStorage.setItem("user", null)
                localStorage.setItem("token", null)
                localStorage.setItem("uid", null)
                localStorage.setItem("client", null)
                localStorage.setItem("loggedIn", false)
                var state = {
                    ...initialState,
                    user: "",
                    token: "",
                    uid: "",
                    client: "",
                    user: "",
                    company: "",
                    loading: false,
                    loginErrorMessage: typeof action.error_message == 'string' ? action.error_message : errorMessages(action.error_message.response.data)
                }
            }
            else {
                state = {
                    ...initialState,
                    user: "",
                    token: "",
                    uid: "",
                    client: "",
                    user: "",
                    company: "",
                    loading: false,
                    loginErrorMessage: errorMessages("Something Strange Happened")

                }
            }
            return state
            break;
        case "LOGOUT_SUCCESS":
            console.log("CLEARING USER DATA")
            state = {
                ...initialState,
                user: "",
                token: "",
                uid: "",
                client: "",
                user: "",
                company: "",
                loading: false,
                loggedIn: false,
                default_path: "",
                authentication: {}
            }
            localStorage.removeItem("user", null)
            localStorage.removeItem("token", null)
            localStorage.removeItem("uid", null)
            localStorage.removeItem("client", null)
            localStorage.removeItem("loggedIn")
            localStorage.removeItem("default_path")
            window.location.href = "/" //TODO This is just a temp soln
            return state
            break;
        default:
            return initialState
            break;
    }
}

async function  setLocalData(action){
    await  localStorage.setItem("user", JSON.stringify(action.user.data))
    await  localStorage.setItem("token", action.token)
    await localStorage.setItem("uid", action.uid)
    await localStorage.setItem("client", action.client)
    await localStorage.setItem("default_path", action.default_path)
    await localStorage.setItem("loggedIn", true)
}

export default authentication_reducer;