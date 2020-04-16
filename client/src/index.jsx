import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { reducer } from './reducers/reducers';
import MainView from './components/main-view/main-view';
import './index.scss';

const store = createStore(reducer);

function MyFlixApplication() {
    return (
        <Provider store={store}>
            <MainView />
        </Provider>
    );
}

const el = document.querySelector('.app-container');
ReactDOM.render(React.createElement(MyFlixApplication), el);