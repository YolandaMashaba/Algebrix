import React, { useState, useEffect } from "react";
import "./calculator.css";

const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [previousResult, setPreviousResult] = useState('');
  const [history, setHistory] = useState([]);

  //Load history from localStorage when component mounts
  useEffect(() => {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to load history:', error);
        localStorage.removeItem('calculatorHistory');
      }
    }
  }, []);

  //Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('calculatorHistory', JSON.stringify(history));
    } else {
      localStorage.removeItem('calculatorHistory');
    }
  }, [history]);

  const handleClick = (value) => {
    if (value === '=') {
      try {
        // eslint-disable-next-line no-eval
        const evalResult = eval(input);
        setPreviousResult(input);
        setResult(evalResult);
        setInput(evalResult.toString());
        
        // Add to history
        const newHistoryItem = { 
          calculation: input, 
          result: evalResult,
          timestamp: new Date().toLocaleTimeString(),
          date: new Date().toLocaleDateString() // Added date for better tracking
        };
        
        setHistory(prev => [
          newHistoryItem,
          ...prev.slice(0, 9) // Keep only last 10 calculations
        ]);
      } catch {
        setResult('Error');
      }
    } else if (value === 'C') {
      setInput('');
      setResult('');
      setPreviousResult('');
    } else if (value === 'CE') {
      setInput(input.slice(0, -1));
    } else if (value === '±') {
      if (input) {
        setInput(input.charAt(0) === '-' ? input.slice(1) : '-' + input);
      }
    } else {
      if (value === '.') {
        const parts = input.split(/[+\-*/]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes('.')) return;
      }
      
      const lastChar = input.slice(-1);
      const operators = ['+', '-', '*', '/'];
      if (operators.includes(lastChar) && operators.includes(value)) {
        setInput(input.slice(0, -1) + value);
      } else {
        setInput(input + value);
      }
    }
  };

  const handleUseHistory = (item) => {
    setInput(item.calculation);
    setResult(item.result);
  };

  const handleClearHistory = () => {
    setHistory([]);
    //Also clear from localStorage
    localStorage.removeItem('calculatorHistory');
  };

  //Export history as JSON
  const handleExportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'calculator-history.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  //Import history from JSON
  const handleImportHistory = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedHistory = JSON.parse(e.target.result);
        if (Array.isArray(importedHistory)) {
          setHistory(importedHistory.slice(0, 10)); // Limit to 10 items
          alert('History imported successfully!');
        } else {
          alert('Invalid history file format.');
        }
      } catch (error) {
        alert('Failed to import history: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const buttons = [
    ['C', 'CE', '±', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="display">
          {previousResult && <div className="previous-operation">{previousResult}</div>}
          <div className="current-input">{input || '0'}</div>
          {result && <div className="result">= {result}</div>}
        </div>
        <div className="buttons">
          {buttons.map((row, rowIndex) => (
            <div key={rowIndex} className="button-row">
              {row.map((button) => {
                let buttonClass = 'button';
                if (button === '=') buttonClass += ' equals';
                if (['C', 'CE'].includes(button)) buttonClass += ' clear';
                if (['/', '*', '-', '+', '='].includes(button)) buttonClass += ' operator';
                if (button === '0') buttonClass += ' zero';
                
                return (
                  <button
                    key={button}
                    className={buttonClass}
                    onClick={() => handleClick(button)}
                  >
                    {button}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Updated History Panel with Import/Export */}
      <div className="history-panel">
        <div className="history-header">
          <h3>History</h3>
          <div className="history-controls">
            {history.length > 0 && (
              <>
                <button 
                  className="history-control-btn export-btn"
                  onClick={handleExportHistory}
                  title="Export history as JSON"
                >
                  Export
                </button>
                <label 
                  className="history-control-btn import-btn"
                  title="Import history from JSON"
                >
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportHistory}
                    style={{ display: 'none' }}
                  />
                </label>
                <button 
                  className="history-control-btn clear-btn"
                  onClick={handleClearHistory}
                  title="Clear all history"
                >
                  Clear
                </button>
              </>
            )}
          </div>
        </div>
        
        {history.length === 0 ? (
          <div className="empty-history">
            <p>No calculations yet</p>
            <p className="storage-info">
              Calculations will be saved automatically
            </p>
          </div>
        ) : (
          <div className="history-list">
            {history.map((item, index) => (
              <div 
                key={index} 
                className="history-item"
                onClick={() => handleUseHistory(item)}
                title="Click to use this calculation"
              >
                <div className="history-calculation">{item.calculation}</div>
                <div className="history-result">= {item.result}</div>
                <div className="history-meta">
                  <span className="history-date">{item.date}</span>
                  <span className="history-time">{item.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Storage Status Indicator */}
        <div className="storage-status">
          <div className="storage-indicator">
            <div className="storage-dot"></div>
            <span className="storage-text">
              {history.length > 0 
                ? `Saved ${history.length} calculation${history.length === 1 ? '' : 's'}`
                : 'No saved calculations'}
            </span>
          </div>
          <button 
            className="storage-help"
            onClick={() => alert('Your calculations are automatically saved in your browser. They will persist even after closing the browser.')}
            title="About local storage"
          >
            ?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;