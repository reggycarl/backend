export const SAVE_USER = "SAVE_USER";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const LOGINADMIN = "LOGINADMIN";
export const LOGOUTADMIN = "LOGOUTADMIN";
export const LOGGINGIN = "LOGGINGIN";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILED = "LOGIN_FAILED";
export const SIGNUP = "SIGNUP";
export const SIGNUP_FAILED = "SIGNUP_FAILED";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_IN_PROGRESS = "SIGNUP_IN_PROGRESS";
export const PRINTDOCUMENT = "PRINTDOCUMENT";
export const PARTNER_SIGNUP = "PARTNER_SIGNUP";
export const PARTNER_LOGIN = "PARTNER_LOGIN";
export const UPDATE_USER = "UPDATE_USER";

export const login_admin = (email, password) => {
  return { type: LOGINADMIN, email, password };
};
export const logout_admin = (admin) => {
  return { type: LOGOUTADMIN, admin };
};
export const save_user = (user) => {
  return { type: SAVE_USER, user };
};

export const update_user = (user) => {
  return { type: UPDATE_USER, user };
};

export const login = (email, password) => {
  return { type: LOGIN, email, password };
};
export const partner_login = (email, password) => {
  return { type: PARTNER_LOGIN, email, password };
};

export const signup = (
  first_name,
  last_name,
  phone,
  email,
  password,
  password_confirmation,
  account_type_id,
  steaman_commerce_partner_terms
) => {
  return {
    type: SIGNUP,
    first_name,
    last_name,
    phone,
    email,
    password,
    password_confirmation,
    account_type_id,
    steaman_commerce_partner_terms,
  };
};
export const partner_signup = (
  first_name,
  last_name,
  username,
  email,
  phone,
  company_name,
  password,
  password_confirmation,
  partner_type_id,
  steaman_commerce_partner_terms
) => {
  return {
    type: PARTNER_SIGNUP,
    first_name,
    last_name,
    username,
    email,
    phone,
    company_name,
    password,
    password_confirmation,
    partner_type_id,
    steaman_commerce_partner_terms,
  };
};

export const printDocument = (documenturl) => {
  return { type: PRINTDOCUMENT, documenturl };
};

export const test_actions = () => {
  console.log("TESTING ACTIONS");
  return { type: SAVE_USER };
};

export const logout = () => {
  return { type: LOGOUT };
};
