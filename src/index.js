import './pages/index.css';
import { openModal, closeModal } from './components/modal.js';
import { createCard, deleteCard, likeCard } from './components/cards.js';
import { enableValidation, clearValidation, validationConfig } from './components/validation.js';
import { getInitialCards, updateProfile, addCard, myID, updateProfileImg, getInitialProfile } from './components/api.js';

const cardsContainer = document.querySelector('.places__list');

const profileEdit = document.querySelector('.profile__edit-button');
const profileAdd = document.querySelector('.profile__add-button');
const cardList = document.querySelector('.places__list');

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

// Показ картинки карточки
function showImage(e) {
  imageInPopup.src = e.src;
  imageInPopup.alt = e.alt;
  imagePopupCaption.textContent = e.alt;
  openModal(imagePopup);
}

// Получение карточек и данных профиля
Promise.all([getInitialProfile(), getInitialCards()])
  .then(([profileData, cardDataList]) => {
    profileTitle.textContent = profileData.name;
    profileDescription.textContent = profileData.about
    profileImage.style.backgroundImage = `url('${profileData.avatar}')`;

    cardDataList.forEach((cardData) => {
      const cardElement = createCard(cardData, deleteCard, likeCard, showImage);
      cardsContainer.append(cardElement);
    })
  })
  .catch(err => {
    console.log(err);
  })

// Слушатель события на закрытие карточек
allPopups.forEach((popup) => {
  popup.addEventListener('click', (evt) => {
    const evtTarget = evt.target.classList;
    if (evtTarget.contains('popup__close') || evtTarget.contains('popup')) {
      closeModal(popup);
    }
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
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, editForm);
    })

  closeModal(editPopup);
}

editForm.addEventListener('submit', handleEditFormSubmit);

// Открытие формы добавления карточки
profileAdd.addEventListener('click', () => {
  addForm.reset();
  clearValidation(addForm, validationConfig)
  openModal(addPopup);
})

// Обработка формы добавления карточки
function handleAddFormSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, addForm);

  const nameValue = addFormInputName.value;
  const linkValue = addFormInputLink.value;

  addCard(nameValue, linkValue)
    .then(() => {
      const cardElement = createCard({ name: nameValue, link: linkValue, likes: [], owner: { _id: myID } }, deleteCard, likeCard, showImage);
      cardsContainer.prepend(cardElement);
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, addForm);
    })

  addForm.reset();
  closeModal(addPopup);
  clearValidation(addForm, validationConfig);
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
  avatarForm.reset();
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