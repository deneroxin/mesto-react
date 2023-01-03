import React from 'react';
import api from '../utils/Api';
import Header from './Header';
import Main from './Main.js';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';

const defaultText = {
  'add-card': {name: '', link: ''},
  'change-avatar': {avatar: ''}
}

export default function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddCardPopupOpen, setIsAddCardPopupOpen] = React.useState(false);
  const [isChangeAvatarPopupOpen, setIsChangeAvatarPopupOpen] = React.useState(false);
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = React.useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [userData, setUserData] = React.useState(null);
  const [cards, setCards] = React.useState(null);
  const cardToRemove = React.useRef(null);

  React.useEffect(() => {
    api.getUserInfo()
      .then(setUserData)
      .catch(err => console.log(err));
    api.getInitialCards()
    .then(res => {
      res.sort(sortByRatingThenByName);
      setCards(res);
    })
    .catch(err => console.log(err));
  }, []);

  function sortByRatingThenByName(a, b) {
    if (a.likes.length != b.likes.length) return b.likes.length - a.likes.length;
    return (a.name < b.name ? -1 : (b.name < a.name) ? 1 : 0);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddClick() {
    setIsAddCardPopupOpen(true);
  }

  function handleAvatarClick() {
    setIsChangeAvatarPopupOpen(true);
  }

  function handleCardClick(cardData) {
    setSelectedCard(cardData);
    setIsImagePopupOpen(true);
  }

  function handlePopupClose(popupName) {
    ({
      'edit-profile': setIsEditProfilePopupOpen,
      'add-card': setIsAddCardPopupOpen,
      'change-avatar': setIsChangeAvatarPopupOpen,
      'confirmation': setIsConfirmationPopupOpen,
      'view-card': setIsImagePopupOpen
    })
    [popupName](false);
  }

  function handleAddCardSubmit(newCard) {
    setCards(cards => [newCard, ...cards]);
  }

  function handleCardRemoveClick(cardData, cardRemoveEffect) {
    cardToRemove.current = {cardData, cardRemoveEffect};
    setIsConfirmationPopupOpen(true);
  }

  function handleCardRemove() {
    cardToRemove.current.cardRemoveEffect()
    .then(() => setCards(cards => cards.filter(card => card != cardToRemove.current.cardData)));
  }

  return (
    <div className="entire-space">
      <div className="page">
        <Header />
        <Main
          {...{userData}}
          {...{setUserData}}
          {...{cards}}
          cardHandlers={{
            handleCardClick,
            handleCardRemoveClick
          }}
          popupTriggers={{
            handleEditProfileClick,
            handleAddClick,
            handleAvatarClick
          }}
        />
        <Footer />
      </div>
      <PopupWithForm
        name="edit-profile"
        isOpen={isEditProfilePopupOpen}
        initialText={userData}
        submitRequest={api.editProfile.bind(api)}
        submitCallback={setUserData}
        {...{handlePopupClose}}
      />
      <PopupWithForm
        name="add-card"
        isOpen={isAddCardPopupOpen}
        initialText={defaultText['add-card']}
        submitRequest={api.addNewCard.bind(api)}
        submitCallback={handleAddCardSubmit}
        {...{handlePopupClose}}
      />
      <PopupWithForm
        name="change-avatar"
        isOpen={isChangeAvatarPopupOpen}
        initialText={defaultText['change-avatar']}
        submitRequest={api.setAvatar.bind(api)}
        submitCallback={setUserData}
        {...{handlePopupClose}}
      />
      <PopupWithForm
        name="confirmation"
        isOpen={isConfirmationPopupOpen}
        initialText={null}
        submitRequest={() => api.removeCard(cardToRemove.current.cardData)}
        submitCallback={handleCardRemove}
        {...{handlePopupClose}}
      />
      <ImagePopup
        card={selectedCard}
        isOpen={isImagePopupOpen}
        {...{handlePopupClose}}
      />
    </div>
  );
}
