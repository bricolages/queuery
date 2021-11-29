/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
const { AppContainer } = require("react-hot-loader");

import * as React from 'react';
import { render } from 'react-dom';

const rootElem = document.getElementById('root');
require('./index.css');

import App from './App';

function renderApp() {
  const App = require('./App').default;
  render(<App />, rootElem);
}

renderApp();

(module as any).hot.accept(renderApp);
