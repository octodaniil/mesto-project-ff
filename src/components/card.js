import { deleteCardServer, putLike, deleteLike } from "./api";

const cardTemplate = document.querySelector('#card-template').content;

function createCard(cardData, deleteCard, likeCard, showImage, userId) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const likesCounter = cardElement.querySelector('.card__like-counter');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  cardImage.addEventListener('click', () => showImage(cardImage));
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  likesCounter.textContent = cardData.likes.length;
  cardElement.querySelector('.card__title').textContent = cardData.name;

  if (cardData.owner._id !== userId) {
    deleteButton.style.display = 'none';
  } else {
    deleteButton.addEventListener('click', () => {
      deleteCard(cardElement, cardData._id);
    })
  }

  const likeButton = cardElement.querySelector('.card__like-button');
  cardData.likes.forEach(element => {
    if (element._id === userId) {
      likeButton.classList.add('card__like-button_is-active')
    }
  });
  likeButton.addEventListener('click', () => {
    likeCard(likeButton, cardData._id, likesCounter);
  });

  return cardElement;
}

function deleteCard(cardElement, cardId) {
  deleteCardServer(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.log(err);
    })
}

function likeCard(likeButton, cardId, likesCounter) {
  if (likeButton.classList.contains('card__like-button_is-active')) {
    deleteLike(cardId)
      .then((result) => {
        likesCounter.textContent = result.likes.length
        likeButton.classList.remove('card__like-button_is-active');
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    putLike(cardId)
      .then((result) => {
        likesCounter.textContent = result.likes.length
        likeButton.classList.add('card__like-button_is-active');
      })
      .catch(err => {
        console.log(err)
      })
  }
}


export { createCard, deleteCard, likeCard };