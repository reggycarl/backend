import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
// import App from './components/App';
import * as serviceWorker from './serviceWorker';

import 'bootstrap/dist/css/bootstrap.min.css';
import App from './components/App';
import ActionCableProvider from 'react-actioncable-provider'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import createSagaMiddleware from 'redux-saga'
import { authSaga } from './sagas/authentication_saga'
import { createBrowserHistory } from 'history'
import {API_WS_ROOT} from './components/misc/Axios'
const sagaMiddleware = createSagaMiddleware();
export const store = createStore(reducer, applyMiddleware(sagaMiddleware))
export const history = createBrowserHistory({ forceRefresh: true })
export const no_refresh_history = createBrowserHistory({ forceRefresh: false })

sagaMiddleware.run(authSaga);

ReactDOM.render(<Provider store={store}>
    <ActionCableProvider url={API_WS_ROOT}><App /> </ActionCableProvider></Provider >, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
