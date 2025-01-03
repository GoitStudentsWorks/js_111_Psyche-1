'use strict';
import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import Swiper from 'swiper/bundle';
import 'swiper/css';
const listReviews = document.querySelector('.reviews-list');
const leftSwiperBtn = document.querySelector('.prev-btn');
const rightSwiperBtn = document.querySelector('.next-btn');
const BASE_URL_REVIEWS = 'https://portfolio-js.b.goit.study/api/reviews';

const swiperReviews = new Swiper('.swiper', {
  speed: 400,
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1440: {
      slidesPerView: 4,
    },
  },
  keyboard: {
    enabled: true,
    onlyInViewport: false,
    pageUpDown: true,
  },
  mousewheel: {
    invert: true,
  },
});

let arrayReviews;
// We monitor the Reviews section so that the error window does not pop up until you view the Reviews section
const guard = document.querySelector('.sec-reviews');
const options = {
  root: null,
  rootMargin: '0px',
  threshold: 1.0,
};
const guardService = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.intersectionRatio) {
      async function serviceReviews(url = BASE_URL_REVIEWS, optionsA = {}) {
        swiperReviews.enable();
        const response = await axios(url, optionsA);

        return response.data;
      }

      serviceReviews()
        .then(data => {
          arrayReviews = data;

          listReviews.insertAdjacentHTML(
            'beforeend',
            createMarkupReviews(data)
          );
          swiperReviews.update();

          leftSwiperBtn.classList.remove('isHIdden');
          rightSwiperBtn.classList.remove('isHIdden');
          leftSwiperBtn.disabled = true;

          swiperReviews.on('reachEnd', function () {
            return (rightSwiperBtn.disabled = true);
          });
          swiperReviews.on('reachBeginning', function () {
            return (leftSwiperBtn.disabled = true);
          });
        })
        .catch(err => {
          iziToast.show({
            theme: 'dark',
            position: 'topRight',
            message: `Sorry, ${err}`,
            messageColor: '#fff',
            messageSize: '16px',
            messageLineHeight: '24px',
            backgroundColor: '#EF4040',
            timeout: 5000,
            displayMode: 1,
          });
          listReviews.innerHTML = '<p>Not found</p>';
          swiperReviews.disable();
          leftSwiperBtn.classList.add('isHIdden');
          rightSwiperBtn.classList.add('isHIdden');
        });
    }
  });
};
const observer = new IntersectionObserver(guardService, options);
observer.observe(guard);

function createMarkupReviews(arr) {
  return arr
    .map(
      ({ _id, author, avatar_url, review }) =>
        `<div class="swiper-slide"><li data-id="${_id}" class="review-card">
        <img class="avatar-review" src="${avatar_url}" alt="${author}" width="48" height="48"></img>
        <h3 class="author-review">${author}</h3>
        <p class="comment-review">${review}</p>
    </li></div>`
    )
    .join('');
}

rightSwiperBtn.addEventListener('click', handleNext);
function handleNext(event) {
  leftSwiperBtn.disabled = false;
  rightSwiperBtn.classList.remove('isHIdden');
  swiperReviews.slideNext(400);
}

leftSwiperBtn.addEventListener('click', handlePrev);
function handlePrev(event) {
  rightSwiperBtn.disabled = false;
  leftSwiperBtn.disabled = false;
  leftSwiperBtn.classList.remove('isHIdden');
  swiperReviews.slidePrev(400);
}
