import React from 'react';
import api from '../utils/Api';
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import {PopupClosableContext} from '../contexts/PopupClosableContext';
import Header from './Header';
import Main from './Main.js';
import Footer from './Footer';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmationPopup from './ConfirmationPopup';
import ImagePopup from './ImagePopup';
import PopupClosable from './PopupClosable';

export default function App() {

  const [currentUser, setCurrentUser] = React.useState(null);
  const [cards, setCards] = React.useState(null);
  const [currentPopup, setCurrentPopup] = React.useState(null);  // В каждый момент времени открыт только один попап. Это обусловлено тем, что обработчик клавиатуры (закрытие по Esc) цепляется глобально, что не даст нам возможности когда-либо задействовать несколько попапов.
  const [selectedCard, setSelectedCard] = React.useState(null);
  const cardToRemove = React.useRef(null);  // Здесь мы запоминаем данные карточки, которую собираемся удалить, а после подтверждения их используем
  const popupClosable = React.useRef(PopupClosable(handlePopupClose)).current;  // Создаём "объект" интерфейса, управляющего закрытием всех попапов

  React.useEffect(() => {
    api.getUserInfo()
      .then(setCurrentUser)
      .catch(err => console.log(`Api.getUserInfo() failed with: ${err.message}`));
    api.getInitialCards()
      .then(res => {
        res.sort(sortByRatingThenByName);
        setCards(res);
      })
      .catch(err => console.log(`Api.getInitialCards() failed with: ${err.message}`));
  }, []);

  function sortByRatingThenByName(a, b) {
    if (a.likes.length != b.likes.length) return b.likes.length - a.likes.length;
    return (a.name < b.name ? -1 : (b.name < a.name) ? 1 : 0);
  }

  function handleCardClick(cardData) {
    setSelectedCard(cardData);
    setCurrentPopup('view-card');
  }

  function handlePopupClose() {
    setCurrentPopup(null);
  }

  function handleCardLike(cardData) {
    const isLiked = cardData.likes.some(user => user._id == currentUser._id);
    api.likeCard(!isLiked, cardData)
      .then(updatedCard => setCards(
          cards => cards.map(card => card == cardData ? updatedCard : card)
        )
      )
      .catch(err => {
        console.log(`Api.likeCard() failed with: ${err.message}`);
      });
  }

  function handleCardRemoveClick(cardData, cardRemoveEffect) {
    cardToRemove.current = {cardData, cardRemoveEffect};
    setCurrentPopup('confirmation');
  }

  // Все попапы обернуты в React.memo, чтобы ре-рендер не происходил всякий раз у всех.
  // Вряд ли это увеличит производительность, учитывая накладки по вызову React.memo и React.useCallback,
  // но мне хотелось протестировать такой вариант и увидеть, как это влияет на рендер.
  // Поначалу вписал зависимости: cards, cardToRemove, из-за чего наблюдался ре-рендеринг попапов, зависящих от cards,
  // но потом заметил, что должно работать и без них - по причинам, изложенным ниже - и рендеринг прекратился.

  const handleAddCardSubmit = React.useCallback(newCard =>
    setCards(cards => [newCard, ...cards])
  , []); // Зависимостей нет, так как setCards использует отложенную установку значения, аргумент cards примет наиболее актуальное состояние.

  const handleCardRemove = React.useCallback(() =>
    cardToRemove.current.cardRemoveEffect()
    .then(() => setCards(cards => cards.filter(card => card != cardToRemove.current.cardData)))
  , []); // Зависимостей нет, так как setCards использует отложенную установку, а cardToRemove.current всегда вернёт актуальное значение

  const confirmationRequest = React.useCallback(() =>
    api.removeCard(cardToRemove.current.cardData)
  , []); // Зависимостей нет, так как cardToRemove.current будет возвращать актуальное значение с момента создания Ref

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="entire-space">
        <div className="page">
          <Header />
          <Main
            {...{cards}}
            cardHandlers={{
              handleCardClick,
              handleCardRemoveClick,
              handleCardLike
            }}
            handleOpenPopup={setCurrentPopup}
          />
          <Footer />
        </div>
        <PopupClosableContext.Provider value={popupClosable}>
          <EditProfilePopup
            isOpen={currentPopup === 'edit-profile'}
            submitCallback={setCurrentUser} //свойство называется submitCallback, так как это только часть обработчика submit
          />
          <AddPlacePopup
            isOpen={currentPopup === 'add-card'}
            submitCallback={handleAddCardSubmit}
          />
          <EditAvatarPopup
            isOpen={currentPopup === 'change-avatar'}
            submitCallback={setCurrentUser}
          />
          <ConfirmationPopup
            isOpen={currentPopup === 'confirmation'}
            submitRequest={confirmationRequest}
            submitCallback={handleCardRemove}
          />
          <ImagePopup
            isOpen={currentPopup === 'view-card'}
            card={selectedCard}
          />
        </PopupClosableContext.Provider>
      </div>
    </CurrentUserContext.Provider>
  );
}
