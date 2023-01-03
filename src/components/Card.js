import React from 'react';
import api from '../utils/Api';
import fallbackImage from '../blocks/card/__image/card__image-fallback.jpg';

export default function Card({cardData, myID, cardHandlers}) {

  const [likes, setLikes] = React.useState(cardData.likes);
  const likeStatus = React.useRef(null);
  const cardElement = React.useRef(null);

  function isMine() {
    return cardData.owner._id == myID;
  }

  function isLiked() {
    likeStatus.current = likes.some(user => user._id == myID);
    return likeStatus.current;
  }

  function getNumLikes() {
    return likes.length;
  }

  function buildURL()  {
    return `url(${cardData.link}), url(${fallbackImage})`;
  }

  function handleClick() {
    cardHandlers.handleCardClick(cardData);
  }

  function handleRemove(evt) {
    evt.stopPropagation();
    cardHandlers.handleCardRemoveClick(cardData, removeEffect);
  }

  function removeEffect() {
    return new Promise(resolve => {
      cardElement.current.classList.add('card_removed');
      const style = window.getComputedStyle(cardElement.current);
      const transDur = style.getPropertyValue('transition-duration');
      const durSec = Number(transDur.slice(0, transDur.indexOf('s')));
      setTimeout(resolve, durSec * 1000);
    });
  }

  function handleLike() {
    api.likeCard(!likeStatus.current, cardData)
    .then(updatedCard => {
        if (updatedCard) setLikes(updatedCard.likes);
    })
    .catch(err => {
      console.log(`Api.likeCard() failed with: ${err.message}`);
    });
  }

  return (
    <li className="card" ref={cardElement}>
      <div
        className="card__image"
        style={{backgroundImage: buildURL()}}
        onClick={handleClick}
      >
        { isMine() && (
          <button type="button"
            className="interactive card__remove-button"
            aria-label="Удалить место"
            onClick={handleRemove}
          ></button>)
        }
      </div>
      <div className="card__footer">
        <h2 className="card__subscript">{cardData.name}</h2>
        <button type="button"
          className={`interactive card__like-button ${isLiked() ? 'card__like-button_active' : ''}`}
          aria-label="Поставить лайк"
          onClick={handleLike}
        ></button>
        <p className="card__num-likes">{getNumLikes()}</p>
      </div>
    </li>
  )
}
