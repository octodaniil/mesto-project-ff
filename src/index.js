import './pages/index.css';
import {openModal, closeModal} from './components/modal.js';
import {createCards, initialCards, deleteCard, likeCard} from './components/cards.js';
export {cardTemplate};

const cardTemplate = document.querySelector('#card-template').content;
const cardsContainer = document.querySelector('.places__list');

const profileEdit = document.querySelector('.profile__edit-button');
const profileAdd = document.querySelector('.profile__add-button');
const cardList = document.querySelector('.places__list');

const allPopups = document.querySelectorAll('.popup');
const editPopup = document.querySelector('.popup_type_edit');
const addPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

let profileTitle = document.querySelector('.profile__title');
let profileDescription = document.querySelector('.profile__description');

const editForm = document.forms.editProfile;
const editFormInputName = editForm.elements.name;
const editFormInputDescription = editForm.elements.description;

const addForm = document.forms.newPlace;
const addFormInputName = addForm.elements.placeName;
const addFormInputLink = addForm.elements.link;

const imageInPopup = document.querySelector('.popup__image');
let imagePopupCaption = document.querySelector('.popup__caption');

function showImage(e) {
  imageInPopup.src = e.src;
  imageInPopup.alt = e.alt;
  imagePopupCaption.textContent = e.alt;
}

initialCards.forEach((cardData) => {
  const cardElement = createCards(cardData, deleteCard, likeCard, showImage);
  cardsContainer.append(cardElement);
});

allPopups.forEach((popup) => {
  popup.addEventListener('click', (evt) => {
    let evtTarget = evt.target.classList;
    if(evtTarget.contains('popup__close') || evtTarget.contains('popup')) {
      closeModal(popup);
    }
  })
});

profileEdit.addEventListener('click', () => {
  openModal(editPopup);
  editFormInputName.value = profileTitle.textContent;
  editFormInputDescription.value = profileDescription.textContent;
})

function handleEditFormSubmit(evt) {
  evt.preventDefault();

  let nameValue = editFormInputName.value;
  let descriptionValue = editFormInputDescription.value;

  profileTitle.textContent = nameValue;
  profileDescription.textContent = descriptionValue;

  closeModal(editPopup);
}

editForm.addEventListener('submit', handleEditFormSubmit);

profileAdd.addEventListener('click', () => {
  openModal(addPopup);
})

function handleAddFormSubmit(evt) {
  evt.preventDefault();

  let nameValue = addFormInputName.value;
  let linkValue = addFormInputLink.value;

  const cardElement = createCards({name: nameValue, link: linkValue}, deleteCard, likeCard, showImage);
  cardsContainer.prepend(cardElement);

  addForm.reset();
  closeModal(addPopup);
}

addForm.addEventListener('submit', handleAddFormSubmit);

cardList.addEventListener('click', (evt) => {
  if(evt.target.classList.contains('card__image')) {
    openModal(imagePopup);
  }
})


