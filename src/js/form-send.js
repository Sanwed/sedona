const form = document.querySelector('.form-review');
const requiredInputs = form.querySelectorAll('[data-required]');
const modalError = document.getElementById('modal-error');
const modalSuccess = document.getElementById('modal-success');
const phoneInput = form.querySelector('#phone');
const checkboxes = form.querySelectorAll('fieldset.fieldset--checkbox input[type="checkbox"]');

// Маска для телефона
phoneInput.addEventListener('input', function (e) {
  let value = phoneInput.value.replace(/\D/g, '');
  if (value.startsWith('8')) value = '7' + value.slice(1);
  if (!value.startsWith('7')) value = '7' + value;

  let formatted = '+7 (';
  if (value.length > 1) formatted += value.slice(1, 4);
  if (value.length >= 4) formatted += ') ' + value.slice(4, 7);
  if (value.length >= 7) formatted += '-' + value.slice(7, 9);
  if (value.length >= 9) formatted += '-' + value.slice(9, 11);

  phoneInput.value = formatted;
});

// Функция открытия и закрытия модалок
function showModal(modal) {
  modal.classList.remove('modal--hidden');
}

function hideModal(modal) {
  modal.classList.add('modal--hidden');
}

document.querySelectorAll('.modal').forEach((modal) => {
  const btn = modal.querySelector('.modal__button');
  btn.addEventListener('click', () => {
    hideModal(modal);
  });
});

// Проверка кириллицы
function isCyrillic(value) {
  return /^[а-яё\s-]+$/i.test(value.trim());
}

// Проверка заполненности обязательных полей
function isRequiredFilled(input) {
  return input.value.trim() !== '';
}

// Проверка хотя бы одного чекбокса
function isAnyCheckboxChecked() {
  return Array.from(checkboxes).some(checkbox => checkbox.checked);
}

// Валидация email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let isValid = true;

  form.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));

  requiredInputs.forEach(input => {
    if (!isRequiredFilled(input)) {
      input.classList.add('error');
      isValid = false;
    } else if (
      (input.id === 'name' || input.id === 'surname' || input.id === 'patronymic') &&
      !isCyrillic(input.value)
    ) {
      input.classList.add('error');
      isValid = false;
    } else if (input.type === 'email' && !isValidEmail(input.value)) {
      input.classList.add('error');
      isValid = false;
    }
  });

  if (isValid) {
    showModal(modalSuccess);
    form.reset();
  } else {
    showModal(modalError);
  }
});