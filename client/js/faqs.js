const faqDivContainers = document.querySelectorAll('.faq__div__container')
let openDescription = null
let openIcon = null

faqDivContainers.forEach(function (faqDivContainer) {
  const faqDiv = faqDivContainer.querySelector('.faq__div')
  const descriptionContainer = faqDivContainer.querySelector('.description__container')
  const description = descriptionContainer.querySelector('.faq__description')
  const icon = faqDiv.querySelector('i')

  faqDiv.addEventListener('click', function () {
    // If another FAQ is open, close it
    if (openDescription && openDescription !== description) {
      openDescription.style.display = 'none'
      openIcon.style.transform = 'rotate(0deg)'
    }

    // If the clicked FAQ is already open, close it
    if (description.style.display === 'block') {
      description.style.display = 'none'
      icon.style.transform = 'rotate(0deg)'
    } else {
      // Otherwise, open the clicked FAQ and update the currently open FAQ and icon
      description.style.display = 'block'
      icon.style.transform = 'rotate(180deg)'
      openDescription = description
      openIcon = icon
    }
  })
})