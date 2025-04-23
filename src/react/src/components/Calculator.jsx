import React, { useState } from "react";
import CompButton from "./CompButton";
import "./Calculator.css";

function Calculator() {
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? String(digit) : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const toggleSign = () => {
    const newValue = parseFloat(display) * -1;
    setDisplay(String(newValue));
  };

  const calculatePercentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const clearAll = () => {
    setDisplay("0");
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);
    
    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      const result = calculate(prevValue, inputValue, operation);
      setDisplay(String(result));
      setPrevValue(result);
    }
    
    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstOperand, secondOperand, operation) => {
    switch (operation) {
      case "+":
        return firstOperand + secondOperand;
      case "-":
        return firstOperand - secondOperand;
      case "*":
        return firstOperand * secondOperand;
      case "/":
        return firstOperand / secondOperand;
      case "=":
        return secondOperand;
      default:
        return secondOperand;
    }
  };

  const handleButton = (value) => {
    if (typeof value === "number") {
      inputDigit(value);
    } else if (value === ".") {
      inputDot();
    } else if (value === "c") {
      clearAll();
    } else if (value === "\xB1") {
      toggleSign();
    } else if (value === "%") {
      calculatePercentage();
    } else if (["+", "-", "*", "/", "="].includes(value)) {
      performOperation(value);
    }
  };

  return (
    <div className="calculator">
      <div className="calculator-input">
        <div className="result">{display}</div>
      </div>
      <div className="calculator-keypad">
        <div className="keys-function">
          <CompButton keyValue={"c"} onClick={handleButton} />
          <CompButton keyValue={"\xB1"} onClick={handleButton} />
          <CompButton keyValue={"%"} onClick={handleButton} />
        </div>
        <div className="keys-operators">
          <CompButton keyValue={"+"} onClick={handleButton} />
          <CompButton keyValue={"-"} onClick={handleButton} />
          <CompButton keyValue={"*"} onClick={handleButton} />
          <CompButton keyValue={"/"} onClick={handleButton} />
          <CompButton keyValue={"="} onClick={handleButton} />
        </div>
        <div className="keys-numbers">
          <CompButton keyValue={7} onClick={handleButton} />
          <CompButton keyValue={8} onClick={handleButton} />
          <CompButton keyValue={9} onClick={handleButton} />
          <CompButton keyValue={4} onClick={handleButton} />
          <CompButton keyValue={5} onClick={handleButton} />
          <CompButton keyValue={6} onClick={handleButton} />
          <CompButton keyValue={1} onClick={handleButton} />
          <CompButton keyValue={2} onClick={handleButton} />
          <CompButton keyValue={3} onClick={handleButton} />
          <CompButton keyValue={0} onClick={handleButton} className="key-zero" />
          <CompButton keyValue={"."} onClick={handleButton} />
        </div>
      </div>
    </div>
  );
}

export default Calculator;
