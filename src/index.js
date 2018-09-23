import React from 'react';
import ReactDOM from 'react-dom';
import Auth from './components/Auth/auth';
import App from './components/App/App';
import preprocess from './preprocess';
preprocess().then(() => {
  ReactDOM.render(<App/>, document.getElementById('root'));
}).catch(() => {
  ReactDOM.render(<Auth/>, document.getElementById('root'));
});


