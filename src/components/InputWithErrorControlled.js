import React from 'react';
import {PopupWithFormContext} from '../contexts/PopupWithFormContext';

export default function InputWithErrorControlled({children, ...inputProps}) {
  //                                                 ^---проп children содержит исходный текст для поля
  // Это управляемая версия полей, которая используется, чтобы попробовать и так, и так.
  // Важно: компиллятор ругается, что подконтрольный элемент имеет явную ссылку, и может стать управляемым,
  // но здесь по-другому не получится, так как требуется явно задавать начальный текст полям,
  // а значит, валидацию нужно проводить после того как текст задан
  // (текст необязательно будет валидный: например, пустой текст не является валидным),
  // валидация нужна, так как дело не только в тексте ошибок - надо вычислить доступность кнопки в исходном состоянии.
  // А так как DOM-элемент приобретёт нужное value только после ре-рендеринга, вызванного setValue(),
  // то валидацию мы сможем сделать только внутри эффекта с зависимостью [value] (когда value устаканилось),
  // где нам уже не будет доступен evt.target, поэтому нужна ссылка на фактический DOM-элемент -
  // ведь браузерная валидация основывается на фактическом содержимом элемента разметки.

  const [value, setValue] = React.useState('');
  const [errorText, setErrorText] = React.useState('');
  const neverTouched = React.useRef(true); // кроме этого пришлось ввести дополнительное свойство, чтобы при первичном открытии окна ошибки не выскакивали
  const inputElement = React.useRef(null); // ссылку придётся оставить, так как валидация будет происходить не только при вводе текста, но и при вставке значения явно, а в этом случае evt.target у нас не будет
  const isValid = React.useRef(false);
  const parentForm = React.useContext(PopupWithFormContext);

  React.useEffect(validateInput, [value]); // т.к. эффект вызывается после рендеринга, можно полагаться на то, что DOM-элементы уже содержат обновлённый текст, и валидация даст корректные результаты

  React.useEffect(() => {
    neverTouched.current = true;  // Если поле сбросило свой текст (после подтверждения формы), то у свежего ошибки не должны выводиться
    setValue(children ? children : '');
  }, [parentForm.shouldReset, children]);

  function validateInput() {
    const previousState = isValid.current;
    isValid.current = inputElement.current.checkValidity();
    setErrorText(neverTouched.current ? '' : inputElement.current.validationMessage);
    parentForm.updateOverallData(
      isValid.current != previousState,
      inputProps.name,
      isValid.current,
      inputElement.current.value
    );
  }

  function handleInput(evt) {
    neverTouched.current = false;
    setValue(evt.target.value);
  }

  return (
    <>
      <input
        ref={inputElement}
        className="popup__input-box"
        {...inputProps}
        aria-label={inputProps.placeholder}
        value={value}
        onInput={handleInput}
      />
      <span className="popup__error">{ errorText }</span>
    </>
  );
}
