import cardList from './components/cardList.js';

// figure out why buckets updating is intermittent

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
    const note = document.createElement('h1');
    note.innerHTML = `${num}<br>Water!`;
    note.setAttribute('class', targ.src.indexOf('fire') > -1 ? 'water-red' : 'water-blue');
    if (targ.src.indexOf('fire') > -1) {
        const img = targ.parentNode.childNodes[0];
        img.classList.add('faded');
        setTimeout(() => {
            img.classList.remove('faded');
        }, 1000)
    }
    targ.parentNode.append(note);
    note.classList.add('water-notification');
    setTimeout(() => {
        note.parentNode.removeChild(note);
        console.log(Number(num));
        displayBuckets(Number(num));
    }, 1000);
}

let matchedIds = [];
const checkMatch = (e) => {
    if (chosenCards[0].name === chosenCards[1].name) {
        chosenCards[0].classList.remove('visible');
        chosenCards[1].classList.remove('visible');
        matchedIds.push(Number(chosenCards[0].id));
        matchedIds.push(Number(chosenCards[1].id));
        if (chosenCards[0].name === 'hydrant') {
            console.log('hydrant');
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
        chosenCards[0].setAttribute('src', 'images/card-back.png');
        chosenCards[1].setAttribute('src', 'images/card-back.png');
        chosenCards[0].classList.remove('selected');
        chosenCards[1].classList.remove('selected');
    }
    chosenCards = [];
    if (matchedIds.length === 30) {
        document.querySelector('#app').innerHTML = '';
        document.querySelector('#end').classList.add('fade-in');
        document.querySelector('#end').innerHTML += '...But you won! Congratulations!'
    }
}

let burningCards = [];

const filteredCards = (targId) => {
    return burningCards.filter(el => {
        return el !== targId;
    });
}

// if (lockBoard === true) {
//     return;
// } THIS

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
        console.log('parent: ', burningCard.parentNode.childNodes);
        burningCards.push(Number(burningCard.id));
        oddsOfFire -= 2;
        
        if (burningCards.length > document.querySelectorAll('.visible').length / 2) {
            document.querySelector('#app').innerHTML = '';
            document.querySelector('#end').classList.add('fade-in');
            document.querySelector('#end').innerHTML += '...And that killed you';
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