var firstIndex = 0

const automaticSlide = () => {
  setTimeout(automaticSlide, 5000)
  var pics
  const img = document.querySelectorAll('.lms__image')
  for (pics = 0; pics < img.length; pics++) {
    img[pics].style.display = 'none'
  }

  img[firstIndex].style.display = 'block'

  firstIndex++
  if (firstIndex === img.length) {
    firstIndex = 0
  }
}

automaticSlide()
