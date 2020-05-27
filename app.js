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
        // if (card.dataset.img.includes('hydrant')) {
        //     card.setAttribute('style', 'border: 2px solid red;');
        // }
        card.setAttribute('name', el.name);
        card.addEventListener('click', flipCard);
        cardCont.appendChild(card);
        grid.appendChild(cardCont);
    })
}

let matches = [];
setTimeout(() => {
    let matchesTemp = [];
    const testCards = document.querySelectorAll('.card');
    testCards.forEach(el => {
        const arr = [];
        let sister = -1;
        testCards.forEach(em => {
            if (em.name === el.name && em.id !== el.id) {
                sister = em.id;
            } 
        })
        arr.push(Number(el.id));
        arr.push(Number(sister));
        arr.sort((a, b) => a - b);
        if (!matchesTemp.includes(arr[0])) {
            matchesTemp.push(...arr);
        }
    })
    while (matchesTemp.length > 0) {
        matches.push(matchesTemp.splice(0, 2));
    }
}, 10)

const checkWinnable = () => {
    const check = matches.map(el => {
        return !burningCards.includes(el[0]) && !burningCards.includes(el[1]) && !matchedIds.includes(el[0]);
    })
    if (!check.includes(true) && bucketsOfWater === 0 || burningCards.length > document.querySelectorAll('.visible').length * 0.75) {
        return false;
    }
    return true;
}

let lockBoard = false;

let bucketsOfWater = 0;
const displayBuckets = (num) => {
    bucketsOfWater += num;
    if (burningCards.length > 0) {
        document.querySelector('#buckets').classList.add('fade-in');
        document.querySelector('#buckets').innerText = `...And you have ${bucketsOfWater} ${bucketsOfWater === 1 ? 'bucket' : 'buckets'} of water.`;
    }
}

const waterNotification = (num, e) => {
    if (!document.querySelector('#but').classList.contains('invisible')) {
        const targ = e.target;
        const note = document.createElement('div');
        const text = document.createElement('p');
        text.innerHTML = `${num}<br>Water!`;
        note.append(text);
        note.setAttribute('class', targ.src.indexOf('fire') > -1 ? 'water-red' : 'water-blue');
        targ.parentNode.append(note);
        note.classList.add('water-notification');
        setTimeout(() => {
            note.parentNode.removeChild(note);
        }, 1000);
    }
    displayBuckets(Number(num));
}

const gameEnd = (win, blobOrigin) => {
    const blob = document.createElement('div');
    blob.setAttribute('id', 'endBlob');
    blob.style.backgroundColor = win ? 'cornflowerblue' : 'tomato';
    blobOrigin.parentNode.append(blob);
    setTimeout(() => {
        blob.setAttribute('class', 'end-anim');
    }, 50)
    setTimeout(() => {
        document.querySelector('#endContainer').classList.remove('display-none');
        document.querySelector('#end').classList.add('fade-in');
        document.querySelector('#end').innerHTML += win
            ? 'You won! Congratulations!'
            : '...You died by fire';
        setTimeout(() => {
            const button = document.querySelector('.tryAgain');
            button.style.color = win ? 'cornflowerblue' : 'tomato';
            button.classList.remove('invisible');
            button.classList.add('fade-in');
            button.addEventListener('click', () => {
                location.reload();
            })
        }, 1200)
    }, 1000)
    
}

let matchedIds = [];
const checkMatch = (e) => {
    if (chosenCards[0].name === chosenCards[1].name) {
        waterNotification('+1', e);
        chosenCards.map(el => el.classList.remove('visible'));
        chosenCards.map(el => el.classList.add('swirl-out-bck'));
        chosenCards.map(el => matchedIds.push(Number(el.id)));
        oddsOfFire -= 1;
        if (chosenCards[0].name === 'hydrant') {
            Array.prototype.map.call(document.querySelectorAll('img'), el => {
                if (el.src.includes('fire')) {
                    el.parentNode.removeChild(el);
                }
            });
            burningCards = [];
            oddsOfFire = 0;
        }
    } else {
        chosenCards.map(el => el.setAttribute('src', 'images/card-back.png'));
        chosenCards.map(el => el.classList.remove('selected'));
    }
    chosenCards = [];
    if (matchedIds.length === 30) {
        gameEnd(true, e.target);
    }
}

let burningCards = [];

const putOutFire = (event) => {
    if (bucketsOfWater > 0) {
        waterNotification('-1', event);
        const targId = Number(event.target.id);  
        burningCards = burningCards.filter(el => {
            return el !== targId;
        });
        event.target.parentNode.removeChild(event.target);
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

let oddsOfFire = -1;
function burn(event) {
    const targetCards = document.querySelectorAll('.card');

    const unfortunateName = event.target.name;
    const unfortunateId = event.target.id;
    let unfortunateTarget = -1;
    targetCards.forEach(el => {
        if (el.name === unfortunateName && el.id !== unfortunateId) {
            unfortunateTarget = Number(el.id);
        }
    })

    const randNum = Math.floor((Math.random() * 10) + 1);
    if (randNum < oddsOfFire && matchedIds.length < (cardsInPlay.length) - 2) {
        document.querySelector('#but').classList.remove('invisible');
        document.querySelector('#but').classList.add('fade-in');
        const num = getUnburntCard(event);
        const burningCard = targetCards[num];
        const flame = document.createElement('img');
        flame.setAttribute('src', 'images/fire.png');
        flame.setAttribute('class', 'fire');
        
        flame.addEventListener('click', putOutFire);
        if (randNum === 1 && burningCards.indexOf(unfortunateTarget) === -1 && Number(chosenCards[0].id) !== unfortunateTarget) {
            flame.setAttribute('id', unfortunateTarget);
            targetCards[unfortunateTarget].parentNode.append(flame);
            burningCards.push(Number(unfortunateTarget));
        } else {
            flame.setAttribute('id', num);
            burningCard.parentNode.append(flame);
            burningCards.push(Number(burningCard.id));
        }
        flame.classList.add('puff-in-center');
        setTimeout(() => {
            flame.classList.remove('puff-in-center');
        }, 700)
        oddsOfFire -= 1;
        // if (burningCards.length > document.querySelectorAll('.visible').length / 2) {
        //     gameEnd(false, burningCard);
        // }
        if (checkWinnable() === false) {
            gameEnd(false, burningCard); 
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
        if (burningCards.length !== document.querySelectorAll('.visible').length - 2) {
            burn(e);
        }
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