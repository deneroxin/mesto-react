import React from 'react';
import api from '../utils/Api';
import Header from './Header';
import Main from './Main.js';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import InputWithError from './InputWithError';
import ImagePopup from './ImagePopup';

export default function App() {

  const [currentPopup, setCurrentPopup] = React.useState(null);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [userData, setUserData] = React.useState(null);
  const [cards, setCards] = React.useState(null);
  const cardToRemove = React.useRef(null);

  React.useEffect(() => {
    api.getUserInfo()
      .then(setUserData)
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

  function handleAddCardSubmit(newCard) {
    setCards(cards => [newCard, ...cards]);
  }

  function handleCardRemoveClick(cardData, cardRemoveEffect) {
    cardToRemove.current = {cardData, cardRemoveEffect};
    setCurrentPopup('confirmation');
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
          handleOpenPopup={setCurrentPopup}
        />
        <Footer />
      </div>
      <PopupWithForm
        name="edit-profile"
        title="Редактировать профиль"
        buttonText="Сохранить"
        buttonRequestText="Сохранение"
        isOpen={currentPopup === 'edit-profile'}
        submitRequest={api.editProfile.bind(api)}
        submitCallback={setUserData}
        {...{handlePopupClose}}
      >
        <InputWithError name="name" type="text" placeholder="Имя" minLength="2" maxLength="40" required>
          {userData && userData.name}
        </InputWithError>
        <InputWithError name="about" type="text" placeholder="О себе" minLength="2" maxLength="200" required>
          {userData && userData.about}
        </InputWithError>
      </PopupWithForm>
      <PopupWithForm
        name="add-card"
        title="Новое место"
        buttonText="Создать"
        buttonRequestText="Создание"
        isOpen={currentPopup === 'add-card'}
        submitRequest={api.addNewCard.bind(api)}
        submitCallback={handleAddCardSubmit}
        {...{handlePopupClose}}
      >
        <InputWithError name="name" type="text" placeholder="Название" minLength="2" maxLength="30" required />
        <InputWithError name="link" type="url" placeholder="Ссылка на картиинку" required />
      </PopupWithForm>
      <PopupWithForm
        name="change-avatar"
        title="Обновить аватар"
        buttonText="Сохранить"
        buttonRequestText="Сохранение"
        isOpen={currentPopup === 'change-avatar'}
        submitRequest={api.setAvatar.bind(api)}
        submitCallback={setUserData}
        {...{handlePopupClose}}
      >
        <InputWithError name="avatar" type="url" placeholder="Ссылка на фото" required />
      </PopupWithForm>
      <PopupWithForm
        name="confirmation"
        title="Вы уверены?"
        buttonText="Да"
        buttonRequestText="Удаление"
        isOpen={currentPopup === 'confirmation'}
        submitRequest={() => api.removeCard(cardToRemove.current.cardData)}
        submitCallback={handleCardRemove}
        {...{handlePopupClose}}
      ></PopupWithForm>
      <ImagePopup
        card={selectedCard}
        isOpen={currentPopup === 'view-card'}
        {...{handlePopupClose}}
      />
    </div>
  );
}
