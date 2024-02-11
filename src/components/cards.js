import { myID, deleteCardServer, putLike, deleteLike } from "./api";

const cardTemplate = document.querySelector('#card-template').content;

function createCard(cardData, deleteCard, likeCard, showImage) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const likesCounter = cardElement.querySelector('.card__like-counter');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  cardImage.addEventListener('click', () => showImage(cardImage));
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  likesCounter.textContent = !(cardData.likes.length === 0) ? cardData.likes.length : 0;
  cardElement.querySelector('.card__title').textContent = cardData.name;

  if (cardData.owner._id !== myID) {
    deleteButton.style.display = 'none';
  } else {
    deleteButton.id = cardData._id;
    deleteButton.addEventListener('click', () => {
      deleteCard(cardElement, deleteButton.id);
    })
  }

  const likeButton = cardElement.querySelector('.card__like-button');
  cardData.likes.forEach(element => {
    if (element._id === myID) {
      likeButton.classList.add('card__like-button_is-active')
    }
  });
  likeButton.addEventListener('click', () => {
    likeCard(likeButton, cardData._id);
  });

  return cardElement;
}

function deleteCard(cardElement, cardId) {
  cardElement.remove();
  deleteCardServer(cardId)
}

function likeCard(e, cardId) {
  if (e.classList.contains('card__like-button_is-active')) {
    deleteLike(cardId)
      .then(() => {
        e.nextElementSibling.textContent = Number(e.nextElementSibling.textContent) - 1;
      })
      .catch(err => {
        console.log(err)
      })
    e.classList.remove('card__like-button_is-active');
  } else {
    putLike(cardId)
      .then(() => {
        e.nextElementSibling.textContent = Number(e.nextElementSibling.textContent) + 1;
      })
      .catch(err => {
        console.log(err)
      })
    e.classList.add('card__like-button_is-active');
  }
}


export { createCard, deleteCard, likeCard };