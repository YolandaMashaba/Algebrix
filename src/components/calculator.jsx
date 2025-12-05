import React, { useState } from "react";
import "./calculator.css";

const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [previousResult, setPreviousResult] = useState('');

  const handleClick = (value) => {
    if (value === '=') {
      try {
        // Using eval for simplicity (in production, use a safe eval alternative)
        const evalResult = eval(input);
        setPreviousResult(input);
        setResult(evalResult);
        setInput(evalResult.toString());
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
        if (input.charAt(0) === '-') {
          setInput(input.slice(1));
        } else {
          setInput('-' + input);
        }
      }
    } else {
      // Prevent multiple decimal points in a number
      if (value === '.') {
        const parts = input.split(/[+\-*/]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes('.')) {
          return;
        }
      }
      
      // Prevent multiple operators in sequence
      const lastChar = input.slice(-1);
      const operators = ['+', '-', '*', '/'];
      if (operators.includes(lastChar) && operators.includes(value)) {
        setInput(input.slice(0, -1) + value);
      } else {
        setInput(input + value);
      }
    }
  };

  const buttons = [
    ['C', 'CE', '±', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  return (
    <div className="calculator">
      <div className="display">
        <div className="previous-operation">{previousResult}</div>
        <div className="current-input">{input || '0'}</div>
        <div className="result">{result ? `= ${result}` : ''}</div>
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
  );
};

export default Calculator;