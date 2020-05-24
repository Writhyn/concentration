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

let lockBoard = false;

let bucketsOfWater = 5;
const displayBuckets = (num) => {
    bucketsOfWater += num;
    if (burningCards.length > 0) {
        document.querySelector('#buckets').classList.add('fade-in');
        document.querySelector('#buckets').innerText = `...And you have ${bucketsOfWater} ${bucketsOfWater === 1 ? 'bucket' : 'buckets'} of water.`;
    }
}

const waterNotification = (num, e) => {
    const targ = e.target;
    const note = document.createElement('div');
    const text = document.createElement('p');
    text.innerHTML = `${num}<br>Water!`;
    note.append(text);
    note.setAttribute('class', targ.src.indexOf('fire') > -1 ? 'water-red' : 'water-blue');
    targ.parentNode.append(note);
    note.classList.add('water-notification');
    displayBuckets(Number(num));
    setTimeout(() => {
        note.parentNode.removeChild(note);
    }, 1000);
}

let matchedIds = [];
const checkMatch = (e) => {
    if (chosenCards[0].name === chosenCards[1].name) {
        chosenCards.map(el => el.classList.remove('visible'));
        chosenCards.map(el => el.classList.add('swirl-out-bck'));
        chosenCards.map(el => matchedIds.push(Number(el.id)));
        if (chosenCards[0].name === 'hydrant') {
            waterNotification('+3', e);
            Array.prototype.map.call(document.querySelectorAll('img'), el => {
                if (el.src.includes('fire')) {
                    el.parentNode.removeChild(el);
                }
            });
            burningCards = [];
        } else {
            waterNotification('+1', e);
        }
    } else {
        chosenCards.map(el => el.setAttribute('src', 'images/card-back.png'));
        chosenCards.map(el => el.classList.remove('selected'));
    }
    chosenCards = [];
    if (matchedIds.length === 30) {
        document.querySelector('#app').innerHTML = '';
        document.querySelector('#end').classList.add('fade-in');
        document.querySelector('#buckets').classList.add('invisible');
        document.querySelector('#end').innerHTML += '<br>...But you won! Congratulations!';
    }
}

let burningCards = [];

const filteredCards = (targId) => {
    return burningCards.filter(el => {
        return el !== targId;
    });
}

const putOutFire = (event) => {
    if (bucketsOfWater > 0) {
        waterNotification('-1', event);
        const targId = Number(event.target.id);        
        event.target.parentNode.removeChild(event.target);
        burningCards = filteredCards(targId);
        oddsOfFire = oddsOfFire === 0 ? 0 : oddsOfFire -= 1;
    }    
}

const getUnburntCard = (event) => {
    const num = Math.floor(Math.random() * (cardsInPlay.length));
    const cardList = document.querySelectorAll('.card');
    if (burningCards.includes(num)
        || matchedIds.includes(num)
        || Number(event.target.id) === num
        || !cardList[num].src.includes('images/card-back.png')) {
        return getUnburntCard(event);
    }
    return num;
}

let oddsOfFire = 0;
function burn(event) {
    if (Math.floor((Math.random() * 10) + 1) < oddsOfFire && matchedIds.length < (cardsInPlay.length) - 3) {
        document.querySelector('#but').classList.remove('invisible');
        document.querySelector('#but').classList.add('fade-in');
        const num = getUnburntCard(event);
        const burningCard = document.querySelectorAll('.card')[num];
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
            document.querySelector('#end').classList.add('fade-in');
            document.querySelector('#end').innerHTML += '<br>...And that killed you';
        }
    } else {
        oddsOfFire++;
    }
}


function flipCard(e) {
    if (lockBoard === true) {
        return;
    }
    if (this.getAttribute('src') === 'images/card-back.png' && !burningCards.includes(Number(this.id))) {
        this.classList.add('selected');
        this.setAttribute('src', this.dataset.img);
        chosenCards.push(this);
        if (chosenCards.length === 2) {
            lockBoard = true;
            setTimeout(() => {
                lockBoard = false;
                checkMatch(e);
            }, 500);
        }
    }
    
}

createGrid();