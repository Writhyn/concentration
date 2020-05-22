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
        cardCont.setAttribute('class', 'flex');
        const card = document.createElement('img');
        card.setAttribute('class', 'card');
        card.classList.add('visible');
        card.setAttribute('src', 'images/card-back.png');
        card.setAttribute('id', i);
        card.setAttribute('data-img', el.img);
        card.setAttribute('name', el.name);
        card.addEventListener('click', flipCard);
        card.addEventListener('click', burn);
        cardCont.appendChild(card);
        grid.appendChild(cardCont);
    })
}

let bucketsOfWater = 500;
const displayBuckets = () => {
    if (burningCards.length > 0) {
        document.querySelector('#buckets').innerText = `...And you have ${bucketsOfWater} buckets of water.`;
    }
}

let matchedIds = [];
const checkMatch = () => {
    if (chosenCards[0].name === chosenCards[1].name) {
        chosenCards[0].classList.remove('visible');
        chosenCards[1].classList.remove('visible');
        matchedIds.push(Number(chosenCards[0].id));
        matchedIds.push(Number(chosenCards[1].id));
        console.log('matchedIds: ', matchedIds);
        if (chosenCards[0].name === 'hydrant') {
            bucketsOfWater += 4;
            displayBuckets();
        } else {
            bucketsOfWater++;
            displayBuckets();
        }
    } else {
        chosenCards[0].setAttribute('src', 'images/card-back.png');
        chosenCards[1].setAttribute('src', 'images/card-back.png');
    }
    chosenCards = [];
}

let burningCards = [];

const filteredCards = (targId) => {
    return burningCards.filter(el => {
        return el !== targId;
    });
}
const putOutFire = (event) => {
    if (bucketsOfWater > 0) {
        const targId = Number(event.target.id);
        console.log('targId:', targId);
        
        event.target.parentNode.removeChild(event.target);
        console.log('before filter: ', burningCards);
        burningCards = filteredCards(targId);
        --bucketsOfWater;
        displayBuckets();
        oddsOfFire = 0;
    }
    console.log('after filter: ', burningCards);
    
}

const getUnburntCard = (event) => {
    const num = Math.floor(Math.random() * (cardsInPlay.length));
    if (!burningCards.includes(num) && !matchedIds.includes(num) && Number(event.target.id) !== num) {
        console.log('id:', Number(event.target.id));
        return num;
    }
    return getUnburntCard();
}
let oddsOfFire = 0;
function burn(event) {
    // if (Math.floor((Math.random() * 10) + 1) < oddsOfFire) {
        document.querySelector('#but').classList.remove('invisible');
        setTimeout(() => {
            displayBuckets();
        }, 1000);
        const num = getUnburntCard(event);
        const burningCard = document.querySelectorAll('.visible')[num];
        console.log("burningCard", burningCard);
        console.log("attempted num", num);
        const flame = document.createElement('img');
        flame.setAttribute('src', 'images/fire.png');
        flame.setAttribute('class', 'fire');
        flame.setAttribute('id', num);
        flame.addEventListener('click', putOutFire);
        burningCard.parentNode.append(flame);
        burningCards.push(Number(burningCard.id));
        oddsOfFire -= 2;
        
        if (burningCards.length > document.querySelectorAll('.visible').length / 2) {
            document.querySelector('#app').innerHTML = '';
            document.querySelector('#but').innerHTML += '<br><br><br><br><br><br><h2>...And that killed you</h2>';
        }
    // } else {
    //     oddsOfFire++;
    // }
}

function flipCard() {
    if (this.getAttribute('src') === 'images/card-back.png' && !burningCards.includes(Number(this.id))) {
        this.setAttribute('src', this.dataset.img);
        chosenCards.push(this);
        if (chosenCards.length === 2) {
            setTimeout(checkMatch, 300);
        }
    }
    
}

createGrid();