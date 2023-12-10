const cardTemplate = document.querySelector('#card-template').content;
const cardsContainer = document.querySelector('.places__list');

function createCards(cardData, deleteCard) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  cardElement.querySelector('.card__image').src = cardData.link;
  cardElement.querySelector('.card__image').alt = 'Картинка пейзажа';
  cardElement.querySelector('.card__title').textContent = cardData.name;

  const deleteButton = cardElement.querySelector('.card__delete-button');
  deleteButton.addEventListener('click', deleteCard);

  return cardElement;
}

function deleteCard(event) {
  const delCard = event.target.closest('.card');
  delCard.remove();
}

initialCards.forEach((cardData) => {
  const cardElement = createCards(cardData, deleteCard);
  cardsContainer.append(cardElement);
});
