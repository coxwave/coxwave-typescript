import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { track, log, feedback, identify, Identify } from '@coxwave/analytics-browser';

function App() {
  useEffect(() => {
    track('Page View', {
      name: 'App',
    });
  }, []);
  const [generationId, setGenerationId] = useState<string>('');

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Coxwave Analytics Browser Example with React</h2>

        <button onClick={() => identify('test-app-user', new Identify().set('role', 'engineer'))}>
          Identify
        </button>

        <button onClick={() => track('Button Click', { name: 'App' })}>
          Track
        </button>

        <button onClick={() => {
          const id = log('ButtonGeneration', { input: { name: "buttonPushed" }}).id;
          setGenerationId(id);
          }}>
          Log
        </button>

        <button onClick={() => feedback('Rating', { name: 'App', generationId: generationId})}>
          Feedback
        </button>
      </header>
    </div>
  );
}

export default App;
