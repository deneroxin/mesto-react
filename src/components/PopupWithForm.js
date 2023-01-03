import React from 'react';
import PopupClosable from './PopupClosable';

export default function PopupWithForm({
  name, isOpen, handlePopupClose, submitRequest, submitCallback,
  title, buttonText, buttonRequestText, children }) {

  const inputList = React.Children.toArray(children);

  const resetOnNextOpen = React.useRef(true);
  const validationState = React.useRef(Object.fromEntries(inputList.map(({props}) => [props.name, false]))).current;
  const inputsContent = React.useRef(Object.fromEntries(inputList.map(({props}) => [props.name, '']))).current;
  const popupClosable = React.useRef(PopupClosable(close)).current;
  const [requestState, setRequestState] = React.useState(false);
  const [submitButtonAvailable, setSubmitButtonAvailable] = React.useState(isFormValid());
  const [serverErrorText, setServerErrorText] = React.useState('');
  const [shouldReset, setShouldReset] = React.useState(0);

  const handleEnter = React.useRef((evt) => {
    if (evt.key == 'Enter') handleFormSubmit();
  }).current;

  React.useEffect(() => {
    if (isOpen) {
      if (resetOnNextOpen.current) setShouldReset(x => x + 1);
      resetOnNextOpen.current = false;
      setServerErrorText('');
      if (!inputList.length) document.addEventListener('keydown', handleEnter);
    } else {
      if (!inputList.length) document.removeEventListener('keydown', handleEnter);
    }
    popupClosable.manageKeyboardListener(isOpen);
  }, [isOpen]);

  function isFormValid() {
    return Object.values(validationState).every(value => value);
  }

  function updateSubmitButtonState() {
    setSubmitButtonAvailable(isFormValid());
  }

  function updatePopupData(errorStateChanged, inputName, validationResult, inputContent) {
    inputsContent[inputName] = inputContent;
    if (errorStateChanged) {
      validationState[inputName] = validationResult;
      updateSubmitButtonState();
    }
  }

  function close(scheduleReset) {
    resetOnNextOpen.current = scheduleReset;
    handlePopupClose(name);
  }

  function handleFormSubmit(evt) {
    if (evt) evt.preventDefault();
    setRequestState(true);
    submitRequest(inputsContent)
    .then(result => {
        submitCallback(result);
        close(true);
      },
      error => setServerErrorText(error.message)  // Здесь есть обработчик reject - он выводит текст ошибки в разметке;
    )                                             // он обслуживает запросы: api.editProfile(), api.addNewCard(),
    .finally(() => setRequestState(false));       // api.setAvatar() и api.removeCard()
  }

  // Не самый рациональный способ добавить пропсы элементу от родителя,
  // в следующем спринте станет ясно, как это можно сделать лучше,
  // но на данном этапе приходится выкручиваться так.
  function renderChildren() {
    return React.Children.map(children,
      child => React.cloneElement(child, {shouldReset, updatePopupData})
    );
  }

  return (
    <div
      className={`popup popup_type_${name} popup-close ${isOpen ? 'popup_opened' : ''}`}
      onMouseDown={popupClosable.handleMouseDown}
      onMouseUp={popupClosable.handleMouseUp}
    >
      <div className="popup__container popup__container_type_dialog">
        <h2 className="popup__title">{ title }</h2>
        <form className="popup__form" name={name} noValidate onSubmit={handleFormSubmit}>
          { renderChildren() }
          <button type="submit"
            className={`interactive popup__confirm-button ${submitButtonAvailable ? '' : 'popup__confirm-button_disabled'}`}
            disabled={!submitButtonAvailable}
          >{ requestState ? buttonRequestText : buttonText }</button>
          {serverErrorText && (
            <span className="popup__server-error">{ serverErrorText }</span>
          )}
        </form>
        <button type="button"
          className="interactive popup__close-button popup-close"
          aria-label="Закрыть окно"
        ></button>
      </div>
    </div>
  );
}
