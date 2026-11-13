import {
  questions,
  showToast,
  showModal,
  closeModal,
} from "../public/modules/utilities.js";

const inputsContainer = document.querySelector(".inputs");
const hintWord = document.querySelector(".hint-word");
const userWritted = document.querySelector(".user-writted");
const continueBtn = document.querySelector(".continue");
const guessCountContainer = document.querySelector(".guess-count");
const modalScreen = document.querySelector(".modal-screen");
const modalCard = document.querySelector(".modal-card");
const modalIcon = document.querySelector(".modal-icon");
const modalContent = document.querySelector(".modal-content");
const cancelModalBtn = document.querySelector("#cancel");
const tryagainModalBtn = document.querySelector("#try-again");
const resetBtn = document.querySelector(".reset");
const score = document.querySelector(".score");

let questionNum = 0;
let wordWritten = "";
let guessCount = 3;
let scoreSum = 0;

const loadQuestion = () => {
  inputsContainer.innerHTML = "";
  userWritted.innerHTML = "";
  wordWritten = "";

  for (let i = 0; i < questions[questionNum].answer.length; i++) {
    inputsContainer.insertAdjacentHTML(
      "beforeend",
      `
      <input type="text" class="letter" maxlength="1" autocomplete="off" autocapitalize="characters" autocorrect="off" spellcheck="false"/>
      `,
    );
  }

  hintWord.innerHTML = questions[questionNum].hint;
  score.innerHTML = scoreSum;

  inputHandlers();
};

const inputHandlers = () => {
  const letterInputs = document.querySelectorAll(".letter");

  letterInputs[0].focus();

  letterInputs.forEach((input) => (input.value = ""));

  updateWrittenWord();
};

const updateWrittenWord = () => {
  const letterInputsArray = [...document.querySelectorAll(".letter")];

  wordWritten = letterInputsArray
    .map((input) => input.value)
    .join("")
    .toLocaleUpperCase();

  userWritted.innerHTML = wordWritten;
};

inputsContainer.addEventListener("input", (event) => {
  if (!event.target.classList.contains("letter")) return;

  const { target } = event;

  const letterInputsArray = [...document.querySelectorAll(".letter")];

  const index = letterInputsArray.indexOf(target);

  target.value = target.value.replace(/[^\w]/g, "");

  if (target.value === "") {
    if (index > 0) {
      letterInputsArray[index - 1].focus();
    }
  } else if (target.value) {
    if (index < letterInputsArray.length - 1) {
      letterInputsArray[index + 1].focus();
    }
  }

  updateWrittenWord();
});

const guessChancesHandler = () => {
  guessCountContainer.textContent = guessCount;
};

const validateAnswer = () => {
  if (wordWritten === questions[questionNum].answer) {
    updateScore(questionNum);

    if (questionNum < questions.length - 1) {
      ++questionNum;
    } else {
      showFinalResult(scoreSum);
    }

    showToast(
      `آفرین <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48">
                <filter id="boil" x="-30%" y="-30%" width="160%" height="160%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="2" seed="1" result="noise">
                    <animate attributeName="seed" values="1;2;3;4;5;6" dur="0.86s" repeatCount="indefinite" calcMode="discrete"/>
                  </feTurbulence>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
                </filter>
                <g filter="url(#boil)">
                  <rect width="48" height="48" fill="none"/>
                  <path pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1;visibility:hidden;animation:draw 0.52s cubic-bezier(.65,.05,.36,1) 0.00s forwards" d="M 19.4 38.8 C 14.6 35.1, 10.2 31.5, 8.8 26.9 C 7.8 23.5, 9.5 20.4, 12.5 19.8 C 15.3 19.4, 17.8 21, 19.4 23.5 C 20.9 20.9, 23.5 19.3, 26.2 19.8 C 29.3 20.5, 31 23.5, 29.9 26.9 C 28.5 31.6, 24.1 35.2, 19.4 38.8 Z"/>
                  <path pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1;visibility:hidden;animation:draw 0.27s cubic-bezier(.65,.05,.36,1) 0.36s forwards" d="M 34.3 9.2 C 34.8 10.6, 35 12, 35.2 13.5 C 36.7 13.6, 38.1 14, 39.5 14.5 C 38.1 14.9, 36.7 15.3, 35.1 15.4 C 35 16.9, 34.8 18.3, 34.2 19.7 C 33.8 18.3, 33.5 16.9, 33.3 15.5 C 31.8 15.3, 30.3 14.9, 29 14.4 C 30.3 13.9, 31.7 13.6, 33.2 13.5 C 33.5 12, 33.8 10.6, 34.3 9.2 Z"/>
                </g>
            </svg>جواب درست بود`,
      true,
      continueBtn,
    );

    guessCount = 3;
    guessChancesHandler();
    loadQuestion();
  } else if (wordWritten !== questions[questionNum].answer) {
    if (guessCount > 1) {
      --guessCount;
      guessChancesHandler();
      inputHandlers();
      showToast(`مجدد امتحان کنید`, false, continueBtn);
    } else {
      showModal(
        "error",
        "شما بیش از حد مجاز تلاش کردید !",
        modalScreen,
        modalCard,
        modalIcon,
        modalContent,
      );
      continueBtn.classList.add("disabled");
      continueBtn.disabled = true;
    }
  }
};

const gotoNextQuestion = (event) => {
  if (continueBtn.disabled) return;

  if (event.key === "Enter") {
    validateAnswer();
  } else if (event.target.className.includes("continue")) {
    validateAnswer();
  }
};

const cancelGame = () => {
  closeModal(modalScreen, modalCard);
  continueBtn.disabled = true;
  continueBtn.classList.add("disabled");
};

const resetGame = () => {
  questionNum = 0;
  guessCount = 3;
  scoreSum = 0;
  guessChancesHandler();
  loadQuestion();
};

const resetGameFromModal = () => {
  closeModal(modalScreen, modalCard);
  resetGame();
};

const updateScore = (questionNum) => {
  scoreSum += questions[questionNum].score;
  score.innerHTML = scoreSum;
};

const showFinalResult = (scoreSum) => {
  showModal(
    "success",
    `آفرین بازیو تموم کردی<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48">
        <filter id="boil-big" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="2" seed="1" result="noise">
            <animate attributeName="seed" values="1;2;3;4;5;6" dur="0.86s" repeatCount="indefinite" calcMode="discrete"/>
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <g filter="url(#boil-big)">
          <rect width="48" height="48" fill="none"/>
          <path pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1;visibility:hidden;animation:draw 0.56s cubic-bezier(.65,.05,.36,1) 0.00s forwards" d="M 30.8 8.1 C 31.8 10.4, 32.7 12.6, 33.7 14.8 C 36.1 15.1, 38.5 15.4, 40.9 15.8 C 39.1 17.4, 37.3 19, 35.5 20.5 C 36.1 22.9, 36.6 25.2, 36.9 27.6 C 34.9 26.4, 32.8 25.1, 30.8 23.9 C 28.8 25.1, 26.7 26.4, 24.7 27.6 C 25 25.2, 25.5 22.9, 26.1 20.5 C 24.3 19, 22.5 17.4, 20.7 15.8 C 23.1 15.4, 25.5 15.1, 27.9 14.8 C 28.9 12.6, 29.8 10.4, 30.8 8.1 Z"/>
          <path pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1;visibility:hidden;animation:draw 0.15s cubic-bezier(.65,.05,.36,1) 0.39s forwards" d="M 9.2 39.1 C 12.7 35.8, 16.1 32.3, 19.3 28.7"/>
          <path pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1;visibility:hidden;animation:draw 0.15s cubic-bezier(.65,.05,.36,1) 0.49s forwards" d="M 7.4 31.1 C 11.1 27.7, 14.7 24.3, 18.2 20.7"/>
          <path pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1;visibility:hidden;animation:draw 0.15s cubic-bezier(.65,.05,.36,1) 0.60s forwards" d="M 16.6 40.2 C 19.2 37.8, 21.7 35.4, 24 32.8"/>
        </g>
      </svg>
    امتیازت : ${scoreSum}`,
    modalScreen,
    modalCard,
    modalIcon,
    modalContent,
  );
};

continueBtn.addEventListener("click", gotoNextQuestion);
window.addEventListener("keyup", gotoNextQuestion);
window.addEventListener("load", loadQuestion);
cancelModalBtn.addEventListener("click", cancelGame);
tryagainModalBtn.addEventListener("click", resetGameFromModal);
resetBtn.addEventListener("click", resetGame);
