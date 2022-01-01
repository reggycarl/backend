import { combineReducers } from 'redux';
import authentication_reducer from './authentication_reducers';
// import navigation_reducer from './navigation_reducers';



const rootreducer = combineReducers({ authentication: authentication_reducer });

export default rootreducer;