const activeCards = [];
const selectedCards = [];

if (activeCards.length === 16) {
  confirm('победа! Еще раз?') && renderCards();
}

function cardClick(target, id) {
  if (!target.classList.contains('disabled')) {
    if (!target.classList.contains('selected')) {
      if (selectedCards.length >= 2) {
        selectedCards[0].element.classList.remove('selected');
        selectedCards[1].element.classList.remove('selected');
        if (!selectedCards[0].element.classList.contains('disabled')
          && !selectedCards[0].element.classList.contains('disabled')) {
          selectedCards[0].element.querySelector('.card').classList.remove('active');
          selectedCards[1].element.querySelector('.card').classList.remove('active');
        }
        selectedCards.length = 0;
        console.log(selectedCards)
      }
      target.classList.add('selected');
      target.querySelector('.card').classList.add('active');
      checkActiveCards(id, target)
    }
  }
}

function checkActiveCards(id, target) {
  if (selectedCards.length < 2) {
    selectedCards.push(
      {
        id,
        element: target
      }
    );
  }
  if (selectedCards.length === 2) {

    if (selectedCards[0].id === selectedCards[1].id) {
      console.log('id === id');
      selectedCards[0].element.classList.add('disabled');
      selectedCards[1].element.classList.add('disabled');
      activeCards.push(selectedCards[0], selectedCards[1]);
      selectedCards.slice(0, 0);
    }
  }
  console.log('selected: ', selectedCards, 'active: ', activeCards);
}

function rotateCard(e, target) {
  const card = target.querySelector('.card');
  const halfWidth = target.offsetWidth / 2;
  const halfHeight = target.offsetHeight / 2;
  const degX = String((e.offsetY - halfHeight) / 4);
  const degY = String((e.offsetX - halfWidth) / 4);

  card.style.transform = `rotateX(${(e.offsetY - halfHeight) > 0 ? -degX : degX.slice(1)}deg) rotateY(${degY}deg)`;
}

function defaultPos(target) {
  const card = target.querySelector('.card');
  card.style.transform = 'rotateX(0deg) rotateY(0deg)';
}

async function renderCards() {
  const cardsList = document.querySelector('.cards-list');

  cardsList.innerHTML = '';

  const docFragment = document.createDocumentFragment();

  const response = await fetch('/API/cards.json');
  const cards = await response.json();

  const sortedCards = cards.sort(sortArr)
    .sort(sortArr);
  const currentCards = sortedCards.slice(0, 8).concat(sortedCards.slice(0, 8))
    .sort(sortArr)
    .sort(sortArr)

  currentCards.forEach(el => {
    const newCard = document.createElement('li');
    newCard.classList.add('card-item');

    newCard.addEventListener('click', function () {
      return cardClick(this, el.id);
    });

    newCard.addEventListener('mousemove', function (e) {
      return rotateCard(e, this);
    });

    newCard.addEventListener('mouseout', function () {
      return defaultPos(this);
    });

    newCard.innerHTML = `
    <div class="card-wrapper">
        <div class="card">
          <div class="card-back"></div>
          <div class="card-front">
            <img class="card-img" src="${el.url}" alt="img">
          </div>
        </div>
      </div>
    `

    docFragment.append(newCard);
  })

  cardsList.append(docFragment);
}

renderCards();

function sortArr() {
  return Math.round(Math.random()) || -1;
}