import React, {FunctionComponent} from 'react';
import {createRoot} from 'react-dom/client';
import {App} from './App';

/**
 * @function main
 */
async function main() {
  const Index: FunctionComponent = () => (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  const container = document.getElementById('app');
  const root = createRoot(container!);
  root.render(<Index/>);
}

void main();