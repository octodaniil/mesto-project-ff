const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};
const regex = /^[\p{L}\s-]+$/u;

function showInputError(formElement, inputElement, errorMessage, dataSet) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(dataSet.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(dataSet.errorClass);
}

function hideInputError(formElement, inputElement, dataSet) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(dataSet.inputErrorClass);
  errorElement.classList.remove(dataSet.errorClass);
  errorElement.textContent = '';
}

function checkInputValidity(formElement, inputElement, dataSet) {
  if (!regex.test(inputElement.value) && inputElement.name !== 'link') {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, dataSet);
  } else {
    hideInputError(formElement, inputElement, dataSet);
  }
}

function setEventListeners(formElement, dataSet) {
  const inputList = Array.from(formElement.querySelectorAll(dataSet.inputSelector));
  const buttonElement = formElement.querySelector(dataSet.submitButtonSelector);


  toggleButtonState(inputList, buttonElement, dataSet);

  inputList.forEach(function (inputElement) {
    inputElement.addEventListener('input', function () {
      checkInputValidity(formElement, inputElement, dataSet);
      toggleButtonState(inputList, buttonElement, dataSet);
    });
  });
}

function toggleButtonState(inputList, buttonElement, dataSet) {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(dataSet.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(dataSet.inactiveButtonClass);
  }
}

function enableValidation(dataSet) {
  const formList = Array.from(document.querySelectorAll(dataSet.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener('submit', function (evt) {
      evt.preventDefault();
    });

    setEventListeners(formElement, dataSet);
  });
}

function hasInvalidInput(inputList) {
  return inputList.some(function (inputElement) {
    return !inputElement.validity.valid;
  });
}

function clearValidation(form, validationConfig) {
  const inputList = Array.from(form.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = form.querySelector(validationConfig.submitButtonSelector);

  inputList.forEach((input) => {
    input.setCustomValidity('');
    hideInputError(form, input, validationConfig);
  })

  toggleButtonState(inputList, buttonElement, validationConfig)
}

export { enableValidation, clearValidation, validationConfig };