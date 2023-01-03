import React from 'react';

export default function InputWithError({inputProps, updatePopupData, shouldReset, initialText}) {

  const [errorText, setErrorText] = React.useState('');
  const inputElement = React.useRef(null);
  const isValid = React.useRef(false);

  React.useEffect(() => {
    inputElement.current.value = initialText;
    validateInput();
    setErrorText('');
  }, [shouldReset]);

  function validateInput() {
    const previousState = isValid.current;
    isValid.current = inputElement.current.checkValidity();
    updatePopupData(
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
        required
        onInput={handleInput}
      />
      <span className="popup__error">{ errorText }</span>
    </>
  );
}
