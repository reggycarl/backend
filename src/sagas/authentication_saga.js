import { takeLatest, put } from "@redux-saga/core/effects";
// import { baseurl } from "../../components/Common/Axios";
import axios_original from "axios";
import {
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  SIGNUP_FAILED,
  LOGIN,
  LOGOUT,
  SIGNUP_SUCCESS,
  LOGINADMIN,
  LOGOUT_SUCCESS,
  SIGNUP,
  PARTNER_SIGNUP,
  LOGGINGIN,
  SIGNUP_IN_PROGRESS,
  PARTNER_LOGIN,
} from "../actions/";
import { baseurl } from "../components/misc/Axios";
import { toast } from "react-toastify";
import { delay } from "redux-saga/effects";
export function* authSaga() {
  console.log("in AUTHSAGA");
  // yield takeLatest(LOGIN, loginAsync);
  yield takeLatest(LOGOUT, logoutAsync);
  yield takeLatest(SIGNUP, signupAsync);
  yield takeLatest(PARTNER_SIGNUP, partnerSignupAsync);
  // yield takeLatest(PARTNER_LOGIN, partnerLoginAsync)
  yield takeLatest(PARTNER_LOGIN, partnerLoginAsync);
  yield takeLatest(LOGINADMIN, loginAdminAsync);
  // takeLatest(LOGOUT, logoutAsync);
}
function* loginAdminAsync(action) {
  console.log("Logging in admin", action);
  try {
    const response = yield axios_original.post(
      baseurl + "/management/sign_in",
      { email: action.email, password: action.password }
    );

    toast.success("Successfully Logged In");
    yield put({
      type: LOGIN_SUCCESS,
      token: response.headers["access-token"],
      uid: response.headers.uid,
      client: response.headers.client,
      user: response.data,
      default_path: "/admins/",
    });
  } catch (error) {
    console.log("AN ERROR OCCURED", error);
    yield put({ type: LOGIN_FAILED, error_message: error });
  }
}

// function* loginAsync(action) {
//     console.log("ASYNINC LOGGIN IN")
//     yield put({ type: LOGGINGIN })
//     try {
//         const response = yield axios_original.post(baseurl + '/accounts/sign_in', { email: action.email, password: action.password })

//         toast.success("Successfully Logged In")
//         yield put({ type: LOGIN_SUCCESS, token: response.headers["access-token"], uid: response.headers.uid, client: response.headers.client, user: response.data, default_path: "/users/" })

//     }
//     catch (error) {
//         console.log("AN ERROR OCCURED", error);
//         yield put({ type: LOGIN_FAILED, error_message: error })
//     }
// }

function* partnerLoginAsync(action) {
  console.log("ASYNINC LOGGIN IN");
  yield put({ type: LOGGINGIN });
  try {
    const response = yield axios_original.post(baseurl + "/partners/sign_in", {
      email: action.email,
      password: action.password,
    });
    console.log("THESE ARE HEADERS", response.headers);
    toast.success("Successfully Logged In");
    yield put({
      type: LOGIN_SUCCESS,
      token: response.headers["access-token"],
      uid: response.headers.uid,
      client: response.headers.client,
      user: response.data,
      default_path: "/partners/",
    });
  } catch (error) {
    console.log("AN ERROR OCCURED", error);
    yield put({ type: LOGIN_FAILED, error_message: error });
  }
}

function* partnerSignupAsync(action) {
  console.log("SIGNING UP");
  yield put({ type: SIGNUP_IN_PROGRESS });
  try {
    const response = yield axios_original.post(baseurl + "/partners", {
      first_name: action.first_name,
      last_name: action.last_name,
      username: action.username,
      email: action.email,
      password: action.password,
      password_confirmation: action.password_confirmation,
      phone: action.phone,
      temp_company_name: action.company_name,
      partner_type_id: action.partner_type_id,
      steaman_commerce_partner_terms: action.steaman_commerce_partner_terms,
    });
    toast.success("Account Succesfully Created. Kindly Confirm email address.");
    console.log("THIS IS THE SIGNUP RESPONSE", response);

    yield put({ type: SIGNUP_SUCCESS });
  } catch (error) {
    // alert("ERROR" + error)
    // console.log("ERROS OCCURED", error.response.data.errors.full_messages)
    yield put({ type: SIGNUP_FAILED, error_message: error });
  }
}

function* signupAsync(action) {
  console.log("SIGNING UP");
  yield put({ type: SIGNUP_IN_PROGRESS });
  try {
    const response = yield axios_original.post(baseurl + "/accounts", {
      first_name: action.first_name,
      last_name: action.last_name,
      username: action.username,
      email: action.email,
      password: action.password,
      password_confirmation: action.password_confirmation,
      phone: action.phone,
      account_type_id: action.account_type_id,
    });
    toast.success("Account Succesfully Created. Kindly Confirm email address.");
    console.log("THIS IS THE SIGNUP RESPONSE", response);
    yield put({ type: SIGNUP_SUCCESS });
  } catch (error) {
    // alert("ERROR" + error)
    // console.log("ERROS OCCURED", error.response.data.errors.full_messages)
    yield put({ type: SIGNUP_FAILED, error_message: error });
  }
}
function* logoutAsync(action) {
  console.log("LOGGING OUT IN SAGA");

  try {
    const response = yield axios_original.delete(baseurl + "/accounts/", {
      headers: {
        "access-token": action.token,
        uid: action.uid,
        client: action.client,
      },
    });
    yield put({ type: LOGOUT_SUCCESS, token: response.headers.authorization });
  } catch (error) {
    yield put({ type: LOGOUT_SUCCESS });
  }
}
