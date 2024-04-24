var swiper = new Swiper(".slide-content", {
  slidesPerView: 3,
  spaceBetween: 40,
  centerSlide: "true",
  fade: "true",
  gragCursor: "true",
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    // nextEl: ".swiper-button-next",
    // prevEl: ".swiper-button-prev",
  },
   breakpoints: {
     0: {
       slidesPerView: 1,
       spaceBetween: 10,
     },
     520: {
       slidesPerView: 2,
       spaceBetween: 20,
     },
     950: {
       slidesPerView: 3,
       spaceBetween: 20,
     },
   }
});
