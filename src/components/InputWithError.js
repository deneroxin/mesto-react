import React from 'react';
import {PopupWithFormContext} from '../contexts/PopupWithFormContext';

export default function InputWithError({children, ...inputProps}) {
  //                                      ^---проп children содержит исходный текст для поля

  const [errorText, setErrorText] = React.useState('');
  const inputElement = React.useRef(null);
  const isValid = React.useRef(false);
  const parentForm = React.useContext(PopupWithFormContext);

  React.useEffect(() => {
    inputElement.current.value = children ? children : '';
    validateInput();
    setErrorText('');
  }, [parentForm.shouldReset, children]);

  function validateInput() {
    const previousState = isValid.current;
    isValid.current = inputElement.current.checkValidity();
    parentForm.updateOverallData(
      isValid.current != previousState,
      inputProps.name,
      isValid.current,
      inputElement.current.value
    );
  }

  function handleInput() {
    validateInput();
    setErrorText(inputElement.current.validationMessage);
  }

  return (
    <>
      <input
        ref={inputElement}
        className="popup__input-box"
        {...inputProps}
        aria-label={inputProps.placeholder}
        onInput={handleInput}
      />
      <span className="popup__error">{ errorText }</span>
    </>
  );
}
