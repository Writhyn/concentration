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
        card.setAttribute('id', i)
        card.addEventListener('click', flipCard);
        cardCont.appendChild(card);
        grid.appendChild(cardCont);
    })
}

const checkMatch = () => {
    const visibleCards = document.querySelectorAll('img');
    if (chosenCards[0].card === chosenCards[1].card) {
        visibleCards[chosenCards[0].id].setAttribute('class', 'matched');
        visibleCards[chosenCards[1].id].setAttribute('class', 'matched');
    } else {
        visibleCards[chosenCards[0].id].setAttribute('src', 'images/card-back.png');
        visibleCards[chosenCards[1].id].setAttribute('src', 'images/card-back.png');
    }
    chosenCards = [];
}

const burningCards = [];
document.addEventListener('click', burn);

function burn() {
    const num = Math.floor(Math.random() * cardsInPlay.length);
    const burningCard = document.querySelectorAll('img')[num];
    const flame = document.createElement('img');
    flame.setAttribute('src', 'images/fire.png');
    flame.setAttribute('class', 'fire');
    burningCard.insertAdjacentElement('beforebegin', flame);
    burningCards.push(burningCard.id);
}

function flipCard() {
    const thisCard = cardsInPlay[this.id];
    this.setAttribute('src', thisCard.img);
    chosenCards.push({
        card: thisCard.name,
        id: this.id
    });
    if (chosenCards.length === 2) {
        setTimeout(checkMatch, 800);
    }
}

createGrid();