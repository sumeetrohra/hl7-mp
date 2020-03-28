import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import AuthConfig from './AuthConfig';

ReactDOM.render(
  <AuthConfig>
    <App />
  </AuthConfig>,
  document.getElementById('root')
);
