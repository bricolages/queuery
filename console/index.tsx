import * as React from 'react';
import { render } from 'react-dom';
import App from './App';

const rootElem = document.getElementById('root');
render(<App />, rootElem);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((import.meta as any).hot) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (import.meta as any).hot.accept('./App', (nextModule: any) => {
    render(<nextModule.default />, rootElem);
  });
}
