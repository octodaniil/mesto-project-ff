function openModal(popupElement) {
  popupElement.classList.add('popup_is-opened');
  document.addEventListener('keydown', closePopupByEsc);
}

function closePopupByEsc(event) {
  if (event.key === 'Escape') {
    closeModal(document.querySelector('.popup_is-opened'));
  }
}

function closeModal(popupElement) {
  popupElement.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', closePopupByEsc);
}

function handleClosePopupByClick(evt, popup) {
  const evtTarget = evt.target.classList;
  if (evtTarget.contains('popup__close') || evtTarget.contains('popup')) {
    closeModal(popup);
  }
}

export { openModal, closeModal, handleClosePopupByClick };