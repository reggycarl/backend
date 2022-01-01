import axios from "axios";
import { bindActionCreators } from "redux";
import * as actions from "../../actions";
import { logout } from "../../actions/";
import { connect } from "react-redux";
import { store } from "../../index";
import { toast } from "react-toastify";
import React from "react";
import _ from "lodash";
export var baseurl = process.env.REACT_APP_BASEURL;
export var mainBaseurl = process.env.REACT_APP_MAINBASEURL;
export const API_WS_ROOT = process.env.REACT_APP_API_WS_ROOT;
export const FRONTENDURL = process.env.REACT_APP_FRONTENDURL;

var header_information;
export const HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};
const axiosInstance = axios.create({
  baseURL: mainBaseurl,
});
async function getCredentials() {
  var token = await localStorage.getItem("token");
  var uid = await localStorage.getItem("uid");
  var client = await localStorage.getItem("client");
  return { token, uid };
}
async function getheaderInformation() {
  var token = await localStorage.getItem("token");
  var uid = await localStorage.getItem("uid");
  var client = await localStorage.getItem("client");
  return { token: token, uid: uid, client: client };
}
axiosInstance.interceptors.request.use(function (config) {
  var headerInformation = getheaderInformation();
  var { token, uid, client } = getCredentials();
  config.headers = {
    "Content-Type": "application/json",
    "access-token": localStorage.getItem("token"),
    uid: localStorage.getItem("uid"),
    client: localStorage.getItem("client"),
  };
  return config;
});
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.status == 202) {
      toast.success(response.data.message);
    }
    if (response.status == 200 && !_.isEmpty(response.data.message)) {
      toast.success(response.data.message);
    }
    if (response.status == 200 && !_.isEmpty(response.data.error)) {
      toast.error(response.data.error);
    }
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // console.log("THIS IS ERROR", error.response);
    if (error.response.status == 400) {
      toast.error(errorMessages(error.response.data));
      // store.dispatch(logout())
    }
    if (error.response.status == 401) {
      toast.error(errorMessages(error.response.data));
      store.dispatch(logout());
    }
    if (error.response.status == 404) {
      toast.error(errorMessages(error.response.data));
      // store.dispatch(logout())
    }
    return Promise.reject(error);
  }
);

export function errorMessages(errors) {
  console.log(errors);
  var string = [];
  var keys = Object.keys(errors.errors);
  errors = errors.errors;
  keys.map((row, i) => {
    console.log("THIS IS ROW", row);
    if (row == "full_messages") {
      return false;
    } else if (Number.isInteger(row)) {
      string.push(<li>{errors[row]}</li>);
    } else {
      var new_row = row.replace("_", " ");
      new_row = new_row.charAt(0).toUpperCase() + new_row.slice(1);
      string.push(<li>{errors[row]}</li>);
    }
    return string;
  });
  return <ul>{string}</ul>;
}
const mapStateToProps = (state) => {
  return { user: state.authentication.user, token: state.authentication.token };
};
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(axiosInstance);
