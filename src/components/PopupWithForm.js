import React from 'react';
import PopupClosable from './PopupClosable';
import InputWithError from './InputWithError';

// Почему описал содержимое попапа не разметкой, передаваемой через свойство props.children, а с помощью данных:
// потому что в разметку тогда пришлось бы включить и элемент submitButton, но это невозможно,
// так как текст и внешний вид кнопки зависят от состояний submitButtonAvailable и requestState,
// которые объявлены здесь, внутри компонента PopupWithFrom (выносить их наружу противоречило бы здравому смыслу).
// Оставалось лишь одно: в качестве дочерних элементов передавать только <InputWithError ... />
// Но тогда всё равно пришлось бы передавать и title, и buttonText (раз кнопка внутри), и buttonRequestText
// как отдельные пропсы. Получалось бы, что мы передаём часть данных одним способом - через разметку,
// а другую часть передаём через пропсы, и такая разобщённость показалась мне плохой идеей.
// Более удобным способом показалось собрать все данные формы в единый объект, на основе которого
// выстраивать разметку. Есть сомнения относительно того, где всё-таки должна находиться
// переменная popupData - в модуле PopupWithForm или в модуле App.

const popupData = {
  'edit-profile': {
    title: 'Редактировать профиль',
    inputList: [
      { name: 'name', type: 'text', placeholder: 'Имя', minLength: '2', maxLength: '40' },
      { name: 'about', type: 'text', placeholder: 'О себе', minLength: '2', maxLength: '200' }
    ],
    buttonText: 'Сохранить',
    buttonRequestText: 'Сохранение'
  },
  'add-card': {
    title: 'Новое место',
    inputList: [
      { name: 'name', type: 'text', placeholder: 'Название', minLength: '2', maxLength: '30' },
      { name: 'link', type: 'url', placeholder: 'Ссылка на картиинку', minLength: '', maxLength: '' }
    ],
    buttonText: 'Создать',
    buttonRequestText: 'Создание'
  },
  'change-avatar': {
    title: 'Обновить аватар',
    inputList: [
      { name: 'avatar', type: 'url', placeholder: 'Ссылка на фото', minLength: '', maxLength: '' }
    ],
    buttonText: 'Сохранить',
    buttonRequestText: 'Сохранение'
  },
  'confirmation': {
    title: 'Вы уверены?',
    inputList: [],
    buttonText: 'Да',
    buttonRequestText: 'Удаление'
  }
};

export default function PopupWithForm({name, isOpen, handlePopupClose, submitRequest, submitCallback, initialText}) {

  const data = popupData[name];

  const resetOnNextOpen = React.useRef(true);
  const validationState = React.useRef(Object.fromEntries(data.inputList.map(({name}) => [name, false]))).current;
  const inputsContent = React.useRef(Object.fromEntries(data.inputList.map(({name}) => [name, '']))).current;
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
      if (!data.inputList.length) document.addEventListener('keydown', handleEnter);
    } else {
      if (!data.inputList.length) document.removeEventListener('keydown', handleEnter);
    }
    popupClosable.manageKeyboardListener(isOpen);
  }, [isOpen]);

  React.useEffect(() => {
    setShouldReset(x => x + 1);
  }, [initialText])

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
      error => setServerErrorText(error.message)
    )
    .finally(() => setRequestState(false));
  }

  return (
    <div
      className={`popup popup_type_${name} popup-close ${isOpen ? 'popup_opened' : ''}`}
      onMouseDown={popupClosable.handleMouseDown}
      onMouseUp={popupClosable.handleMouseUp}
    >
      <div className="popup__container popup__container_type_dialog">
        <h2 className="popup__title">{ data.title }</h2>
        <form className="popup__form" name={name} noValidate onSubmit={handleFormSubmit}>
          {data.inputList.map ( inputData => (
            <InputWithError
              key={inputData.name}
              inputProps={inputData}
              initialText={initialText ? initialText[inputData.name] : ''}
              shouldReset={shouldReset}
              {...{updatePopupData}}
            />
          ))}
          <button type="submit"
            className={`interactive popup__confirm-button ${submitButtonAvailable ? '' : 'popup__confirm-button_disabled'}`}
            disabled={!submitButtonAvailable}
          >{ requestState ? data.buttonRequestText : data.buttonText }</button>
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
