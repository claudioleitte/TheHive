const swiper = document.querySelector("#swiper");
const cards = Array.from(document.querySelectorAll(".card"));

let startX = 0;
let currentCard = null;

cards.forEach((card) => {
  card.addEventListener("mousedown", startDrag);
  card.addEventListener("touchstart", startDrag);
});

function startDrag(e) {
  currentCard = cards[0];

  startX = e.pageX || e.touches[0].pageX;

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", endDrag);

  document.addEventListener("touchmove", drag);
  document.addEventListener("touchend", endDrag);
}

function drag(e) {
  if (!currentCard) return;

  let x = e.pageX || e.touches[0].pageX;
  let dx = x - startX;

  currentCard.style.transform =
    `translateX(${dx}px) rotate(${dx / 15}deg)`;
}

function endDrag(e) {
  if (!currentCard) return;

  let x = e.pageX || (e.changedTouches && e.changedTouches[0].pageX);
  let dx = x - startX;

  const threshold = 120;

  if (dx > threshold) {
    likeCard();
  } else if (dx < -threshold) {
    dislikeCard();
  } else {
    currentCard.style.transform = "";
  }

  currentCard = null;

  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", endDrag);

  document.removeEventListener("touchmove", drag);
  document.removeEventListener("touchend", endDrag);
}

function likeCard() {
  const card = cards.shift();
  card.style.transition = "0.5s";
  card.style.transform = "translateX(500px) rotate(30deg)";
  setTimeout(() => card.remove(), 500);
}

function dislikeCard() {
  const card = cards.shift();
  card.style.transition = "0.5s";
  card.style.transform = "translateX(-500px) rotate(-30deg)";
  setTimeout(() => card.remove(), 500);
}
