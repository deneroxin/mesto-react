export default function PopupClosable(handlePopupClose) {

  let mousePushedOnOverlay = false;

  function handleKeyDown(evt) {
    if (evt.key == 'Escape') handlePopupClose(false);
  }

  function manageKeyboardListener(isAttached) {
    if (isAttached) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }

  // Целью использования пары событий (mouseDown, mouseUp) вместо простого "click"
  // является обход неправильной реализации браузерами события "click",
  // благодаря чему удастся избежать закрытия окна в следующих случаях:
  // когда кнопка нажата внутри окна и отпущена на оверлее, или
  // когда кнопка нажата на оверлее и отпущена внутри окна.

  function handleMouseDown(evt) {
    if (evt.target.classList.contains('popup-close')) mousePushedOnOverlay = true;
  }

  function handleMouseUp(evt) {
    if (evt.target.classList.contains('popup-close') && mousePushedOnOverlay) handlePopupClose(false);
    mousePushedOnOverlay = false;
  }

  return { manageKeyboardListener, handleMouseDown, handleMouseUp }
}
