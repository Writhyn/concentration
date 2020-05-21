import cardList from './components/cardList.js';

let cardsInPlay = [];
cardList.map(el => {
    cardsInPlay.push(el);
    cardsInPlay.push(el);
})
cardsInPlay = cardsInPlay
    .map((a) => ({sort: Math.random(), value: a}))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value)

let chosenCards = [];


const grid = document.querySelector('#app');

const createGrid = () => {
    cardsInPlay.map((el, i) => {
        const cardCont = document.createElement('div');
        const card = document.createElement('img');
        card.setAttribute('class', 'card');
        card.setAttribute('src', 'images/card-back.png');
        card.setAttribute('id', i);
        card.setAttribute('data-img', el.img);
        card.setAttribute('name', el.name);
        card.addEventListener('click', flipCard);
        // card.addEventListener('click', burn);
        cardCont.appendChild(card);
        grid.appendChild(cardCont);
    })
}

const checkMatch = () => {
    console.log(chosenCards);
    if (chosenCards[0].name === chosenCards[1].name) {
        chosenCards[0].setAttribute('class', 'matched');
        chosenCards[1].setAttribute('class', 'matched');
    } else {
        chosenCards[0].setAttribute('src', 'images/card-back.png');
        chosenCards[1].setAttribute('src', 'images/card-back.png');
    }
    chosenCards = [];
}

let burningCards = [];
function burn() {
    const num = Math.floor(Math.random() * cardsInPlay.length);
    const burningCard = document.querySelectorAll('.card')[num];
    const flame = document.createElement('img');
    flame.setAttribute('src', 'images/fire.png');
    flame.setAttribute('class', 'fire');
    burningCard.insertAdjacentElement('beforebegin', flame);
    burningCards.push(burningCard.id);
}

function flipCard() {
    this.setAttribute('src', this.dataset.img);
    chosenCards.push(this);
    if (chosenCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

createGrid();