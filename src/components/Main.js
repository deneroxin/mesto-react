import React from 'react';
import emptyIndicator from '../blocks/elements/__empty-indicator/elements__empty-indicator.jpg';
import Card from './Card';

export default function Main({userData, cards, cardHandlers, popupTriggers}) {

  // И [cards, setCards], и [userData, setUserData] пришлось перенести из Main в App,
  // потому что обработчики добавления и удаления карты, изменяющие массив карт, находятся там,
  // а переместить обработчики сюда не представилось возможным, так как все всплывающие окна,
  // чьи пропсы ссылаются на эти обработчики, описываются в App.
  // В дальнейшем, когда научимся работать с контекстами, вероятно, удастся рассовать всё по своим местам.

  return (
    <main>
      { userData && (
        <section className="profile" aria-label="Профиль" hidden>
          <div className="profile__avatar"
            style={{backgroundImage: `url(${userData.avatar})`}}
            onClick={popupTriggers.handleAvatarClick}>
          </div>
          <div className="profile__text-container">
            <div className="profile__name-container">
              <h1 className="profile__name">{userData.name}</h1>
              <button type="button" className="interactive profile__edit-button"
                aria-label="Редактировать профиль"
                onClick={popupTriggers.handleEditProfileClick}
              ></button>
            </div>
            <p className="profile__about">{userData.about}</p>
          </div>
          <button type="button" className="interactive profile__add-button"
            aria-label="Добавить"
            onClick={popupTriggers.handleAddClick}
          ></button>
        </section>
      )}
      { userData && cards && (
        <section className="elements" aria-label="Места">
          <ul className="elements__cards">
            { cards.map(card => (<Card
                key={card._id}
                cardData={card}
                myID={userData._id}
                {...{cardHandlers}}
              />))
            }
          </ul>
          { !cards.length &&
            <img
              className="elements__empty-indicator"
              src={emptyIndicator}
              alt="Нет карточек"
            />
          }
        </section>
      )}
    </main>
  );
}
