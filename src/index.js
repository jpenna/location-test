import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './app';

export default ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.querySelector('#container')); //eslint-disable-line

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./app', () => {
    const NextApp = require('./app').default; // eslint-disable-line
    ReactDOM.render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      document.getElementById('container') // eslint-disable-line
    );
  });
}
