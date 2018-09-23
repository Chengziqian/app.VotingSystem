import React from 'react';
import ReactDOM from 'react-dom';
import Auth from './components/Auth/auth';
import preprocess from './preprocess';
preprocess().then(() => {
  ReactDOM.render(<div>get auth!</div>, document.getElementById('root'));
}).catch(() => {
  ReactDOM.render(<Auth/>, document.getElementById('root'));
});


