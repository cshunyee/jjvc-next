import { useState } from 'react';

const useInput = (validateInputRule, isFileType=false) =>{
  const [inputValue, setInputValue] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  const isValid = validateInputRule(inputValue);
  const hasError = !isValid && isTouched;

  const inputChangeHandler = (event) => {
    let value = isFileType ? event.target?.files : event.target.value;
    setInputValue(value);
  }

  const inputBlurHandler = () => {
    setIsTouched(true);
  }

  const reset = () => {
      setInputValue('');
      setIsTouched(false);
  }

  return {
    value: inputValue,
    isValid,
    hasError,
    inputChangeHandler,
    inputBlurHandler,
    reset,
  }
}

export default useInput;
