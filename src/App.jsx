import React from 'react';
import Calculator from './components/calculator.jsx';
import ErrorBoundary from './errorBoundary.jsx';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="app-container">
        <h1>Algebrix</h1>
        <ErrorBoundary>
          <Calculator />
        </ErrorBoundary>
        <div className="instructions">
          <p>A fully functional calculator with basic operations</p>
        </div>
      </div>
    </div>
  );
}

export default App;
