import React, { useState } from "react";
import "./calculator.css";

const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [previousResult, setPreviousResult] = useState('');
  const [history, setHistory] = useState([]);

  const handleClick = (value) => {
    if (value === '=') {
      try {

        const evalResult = eval(input);
        setPreviousResult(input);
        setResult(evalResult);
        setInput(evalResult.toString());
        
        // Add to history
        setHistory(prev => [
          ...prev,
          { 
            calculation: input, 
            result: evalResult,
            timestamp: new Date().toLocaleTimeString()
          }
        ].slice(-5)); // Keep only last 5 calculations
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
      
      {/* History Panel */}
      <div className="history-panel">
        <div className="history-header">
          <h3>History</h3>
          {history.length > 0 && (
            <button 
              className="clear-history-btn" 
              onClick={handleClearHistory} 
            >
              Clear
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <div className="empty-history">No calculations yet</div>
        ) : (
          <div className="history-list">
            {history.slice().reverse().map((item, index) => (
              <div 
                key={index} 
                className="history-item"
                onClick={() => handleUseHistory(item)}
                title="Click to use this calculation"
              >
                <div className="history-calculation">{item.calculation}</div>
                <div className="history-result">= {item.result}</div>
                <div className="history-time">{item.timestamp}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;