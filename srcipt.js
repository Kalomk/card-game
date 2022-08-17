class AudioController {
  constructor() {
    this.bgMusic = new Audio("Assets/Audio/creepy.mp3");
    this.flipMusic = new Audio("Assets/Audio/flip.wav");
    this.matchMusic = new Audio("Assets/Audio/match.wav");
    this.victoryMusic = new Audio("Assets/Audio/victory.wav");
    this.gameOveryMusic = new Audio("Assets/Audio/gameOver.wav");
    this.bgMusic.volume = 0.5;
    this.bgMusic.loop = true;
  }
  startMusic() {
    this.bgMusic.play();
  }
  stopMusic() {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }
  flip() {
    this.flipMusic.play();
  }
  match() {
    this.matchMusic.play();
  }
  victory() {
    this.stopMusic();
    this.victoryMusic.play();
  }
  gameOver() {
    this.stopMusic();
    this.gameOveryMusic.play();
  }
}
class MixOrMatch {
  constructor(totalTime, cards) {
    this.cardsArray = cards;
    this.timeRemaining = totalTime;
    this.totalTime = totalTime;
    this.timer = document.getElementById("timer");
    this.ticker = document.getElementById("flips");
    this.audioController = new AudioController();
  }
  startGame() {
    this.cardToCheck = null;
    this.totalClicks = 0;
    this.timeRemaining = this.totalTime;
    this.matchedCard = [];
    this.busy = true;
    setTimeout(() => {
      this.audioController.startMusic();
      this.shuffleCard();
      this.countDown = this.startCountDown();
      this.busy = false;
    }, 500);
    this.hideCards();
    this.ticker.innerText = this.totalClicks;
    this.timer.innerText = this.timeRemaining;
  }
  hideCards() {
    this.cardsArray.forEach((cards) => {
      cards.classList.remove("visible");
      cards.classList.remove("matched");
    });
  }
  startCountDown() {
    return setInterval(() => {
      this.timeRemaining--;
      this.timer.innerText = this.timeRemaining;
      if (this.timeRemaining === 0) {
        this.gameOver();
      }
    }, 1000);
  }
  gameOver() {
    clearInterval(this.countDown);
    this.audioController.gameOver();
    document.getElementById("game__over-text").classList.add("visible");
  }
  victory() {
    clearInterval(this.countDown);
    this.audioController.victory();
    document.getElementById("victory-text").classList.add("visible");
  }
  flipCard(card) {
    if (this.canFlipCard(card)) {
      this.audioController.flip();
      this.totalClicks++;
      this.ticker.innerText = this.totalClicks;
      card.classList.add("visible");
      if (this.cardToCheck) this.matched(card);
      else this.cardToCheck = card;
    }
  }
  matched(card) {
    if (this.getTypeCard(card) === this.getTypeCard(this.cardToCheck)) {
      this.cardMatch(card, this.cardToCheck);
    } else {
      this.missCardMatch(card, this.cardToCheck);
    }
    this.cardToCheck = null;
  }
  cardMatch(card1, card2) {
    this.matchedCard.push(card1);
    this.matchedCard.push(card2);
    card1.classList.add("matched");
    card2.classList.add("matched");
    this.audioController.match();
    if (this.matchedCard.length === this.cardsArray.length) {
      this.victory();
    }
  }
  missCardMatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      card1.classList.remove("visible");
      card2.classList.remove("visible");
    }, 1000);
    this.busy = false;
  }
  getTypeCard(card) {
    return card.getElementsByClassName("card-value")[0].src;
  }
  shuffleCard() {
    for (let i = this.cardsArray.length - 1; i > 0; i--) {
      let randomIndex = Math.floor(Math.random() * (i + 1));
      this.cardsArray[randomIndex].style.order = i;
      this.cardsArray[i].style.order = randomIndex;
    }
  }
  canFlipCard(card) {
    return (
      !this.busy &&
      !this.matchedCard.includes(card) &&
      card !== this.cardToCheck
    );
  }
}

function ready() {
  let overlays = Array.from(document.getElementsByClassName("overlay__text"));
  let cards = Array.from(document.getElementsByClassName("card"));
  let game = new MixOrMatch(100, cards);

  overlays.forEach((overlay) => {
    overlay.addEventListener("click", () => {
      overlay.classList.remove("visible");
      game.startGame();
      //   let audioController = new AudioController();
      //   audioController.startMusic();
    });
  });

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      game.flipCard(card);
    });
  });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ready());
} else {
  ready();
}
