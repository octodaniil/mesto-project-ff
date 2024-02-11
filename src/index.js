import './pages/index.css';
import { openModal, closeModal, handleClosePopupByClick } from './components/modal.js';
import { createCard, deleteCard, likeCard } from './components/card.js';
import { enableValidation, clearValidation, validationConfig } from './components/validation.js';
import { getInitialCards, updateProfile, addCard, updateProfileImg, getProfile } from './components/api.js';

const cardsContainer = document.querySelector('.places__list');

const profileEdit = document.querySelector('.profile__edit-button');
const profileAdd = document.querySelector('.profile__add-button');

const allPopups = document.querySelectorAll('.popup');
const editPopup = document.querySelector('.popup_type_edit');
const addPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const avatarPopup = document.querySelector('.popup_type_avatar');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');

const editForm = document.forms.editProfile;
const editFormInputName = editForm.elements.name;
const editFormInputDescription = editForm.elements.description;

const addForm = document.forms.newPlace;
const addFormInputName = addForm.elements.placeName;
const addFormInputLink = addForm.elements.link;

const avatarForm = document.forms.avatar;
const avatarFormInputUrl = avatarForm.elements.link;

const imageInPopup = document.querySelector('.popup__image');
const imagePopupCaption = document.querySelector('.popup__caption');

const avatar = document.querySelector('.profile__edit-mode');

export let userId;

// Показ картинки карточки
function showImage(imageElement) {
  imageInPopup.src = imageElement.src;
  imageInPopup.alt = imageElement.alt;
  imagePopupCaption.textContent = imageElement.alt;
  openModal(imagePopup);
}

// Получение карточек и данных профиля
Promise.all([getProfile(), getInitialCards()])
  .then(([profileData, cardDataList]) => {
    profileTitle.textContent = profileData.name;
    profileDescription.textContent = profileData.about
    profileImage.style.backgroundImage = `url('${profileData.avatar}')`;
    userId = profileData._id

    cardDataList.forEach((cardData) => {
      const cardElement = createCard(cardData, deleteCard, likeCard, showImage, userId);
      cardsContainer.append(cardElement);
    })
  })
  .catch(err => {
    console.log(err);
  })

// Слушатель события на закрытие карточек
allPopups.forEach((popup) => {
  popup.addEventListener('click', (evt) => {
    handleClosePopupByClick(evt, popup);
  })
});

// Открытие формы профиля
profileEdit.addEventListener('click', () => {
  editFormInputName.value = profileTitle.textContent;
  editFormInputDescription.value = profileDescription.textContent;
  openModal(editPopup);
  clearValidation(editForm, validationConfig);
})

// Обработка формы профиля
function handleEditFormSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, editForm);

  updateProfile(editFormInputName.value, editFormInputDescription.value)
    .then((result) => {
      profileTitle.textContent = result.name;
      profileDescription.textContent = result.about
      profileImage.style.backgroundImage = `url('${result.avatar}')`;
      closeModal(editPopup);
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, editForm);
    })
}

editForm.addEventListener('submit', handleEditFormSubmit);

// Открытие формы добавления карточки
profileAdd.addEventListener('click', () => {
  openModal(addPopup);
})

// Обработка формы добавления карточки
function handleAddFormSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, addForm);

  const nameValue = addFormInputName.value;
  const linkValue = addFormInputLink.value;

  addCard(nameValue, linkValue)
    .then((result) => {
      const cardElement = createCard(result, deleteCard, likeCard, showImage, userId);
      cardsContainer.prepend(cardElement);
      addForm.reset();
      closeModal(addPopup);
      clearValidation(addForm, validationConfig);
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, addForm);
    })
}

addForm.addEventListener('submit', handleAddFormSubmit);

// Открытие формы загрузки аватара
avatar.addEventListener('click', () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(avatarPopup);
})

// Обработка формы загрзуки аватара
function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, avatarForm);

  const newAvatarUrl = avatarFormInputUrl.value;

  updateProfileImg(newAvatarUrl)
    .then(() => {
      profileImage.style.backgroundImage = `url('${newAvatarUrl}')`;
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, avatarForm);
    })
  closeModal(avatarPopup)
}

avatarForm.addEventListener('submit', handleAvatarFormSubmit);

// Функция отображения загрузки для кнопок
function renderLoading(isLoading, form) {
  const loadingButton = form.querySelector('.popup__button');
  if (isLoading) {
    loadingButton.textContent = 'Сохранение...'
  } else {
    loadingButton.textContent = 'Сохранить'
  }
}

// Валидация форм
enableValidation(validationConfig);