function openModal(popupClass) {
  popupClass.classList.add('popup_is-opened');
  document.addEventListener('keydown', closePopupByEsc);
}

function closePopupByEsc(event) {
  if (event.key === 'Escape') {
    closeModal(document.querySelector('.popup_is-opened'));
  }
}

function closeModal(popupClass) {
  popupClass.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', closePopupByEsc);
}

export { openModal, closeModal };