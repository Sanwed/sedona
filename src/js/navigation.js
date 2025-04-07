const header = document.querySelector('.header')
const nav = document.querySelector('.navigation')

header.classList.remove('header--no-js')
nav.classList.remove('navigation--no-js')

const navButton = document.querySelector('.navigation__menu-button')
const navList = document.querySelector('.navigation__list')

navButton.addEventListener('click', () => {
  navList.classList.toggle('navigation__list--opened')
})

window.addEventListener('click', (e) => {
  const target = e.target
  if (!target.closest('.navigation__list') && !target.closest('.navigation__menu-button')) {
    navList.classList.remove('navigation__list--opened')
  }
})
