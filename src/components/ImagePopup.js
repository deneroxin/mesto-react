import React from 'react';
import PopupClosable from './PopupClosable';

export default function ImagePopup({card, isOpen, handlePopupClose}) {

  const popupClosable = React.useRef(PopupClosable(close)).current;

  React.useEffect(() => {
    popupClosable.manageKeyboardListener(isOpen);
  }, [isOpen]);

  function close() {
    handlePopupClose('view-card');
  }

  return (
    <div
      className={`popup popup_type_view-card popup-close ${isOpen ? 'popup_opened' : ''}`}
      onMouseDown={popupClosable.handleMouseDown}
      onMouseUp={popupClosable.handleMouseUp}
    >
      <div className="popup__container">
        <img className="popup__image"
          src={card ? card.link : ''}
          alt={card ? card.name : ''}
        />
        <h2 className="popup__subscript">{ card ? card.name : '' }</h2>
        <button type="button"
          className="interactive popup__close-button popup-close"
          aria-label="Закрыть просмотр"
        ></button>
      </div>
    </div>
  );
}
