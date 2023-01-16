const board = document.querySelector("#board")
const score = document.querySelector("#score")
const restartBtn = document.querySelector("#restart-btn")
const summary = document.querySelector(".summary")
const hammer = document.querySelector(".hammer")
const easyLvl = document.querySelector(".lvl-easy")
const mediumLvl = document.querySelector(".lvl-medium")
const hardLvl = document.querySelector(".lvl-hard")
const levels = document.querySelector(".levels")
const timeLeftHolder = document.querySelector("#time-left")
const audio = document.querySelector("audio")
let timeLeft = 0
let isPlaying = false
let timeLeftTimer = null
let timer = null
let points = 0
let lastBeaverIndex = 0
let playerBlocked = false

// === GAME LEVELS === //
const EASY_TIMER = 1400
const MEDIUM_TIMER = 900
const HARD_TIMER = 600

// =================== //

initGame()

function initGame() {
  for (let i = 0; i < 3; i++) {
    const row = `<div class="row row-${i}"></div>`
    board.insertAdjacentHTML("afterbegin", row)
    const newRow = document.querySelector(`.row-${i}`)
    for (let j = 0; j < 3; j++) {
      const hole = `
    <div class="hole hole-${i * 3 + j}">
      <img src="./assets/beaver.png" class="beaver-${
        i * 3 + j
      } beaver hidden-beaver" alt="" />
    </div>`
      newRow.insertAdjacentHTML("afterbegin", hole)
    }
  }
}

function getNewBeaverIndex() {
  const newIndex = Math.floor(Math.random() * 8)
  if (newIndex === lastBeaverIndex) return getNewBeaverIndex()
  else return newIndex
}

function getTimerValue(lvl) {
  switch (lvl) {
    case "easy":
      return EASY_TIMER
    case "medium":
      return MEDIUM_TIMER
    case "hard":
      return HARD_TIMER
  }
}

function endGame() {
  isPlaying = false
  summary.style.display = "block"
  levels.style.display = "none"
  board.style.display = "none"
  timeLeftHolder.style.display = "none"
  score.style.display = "none"
  document.querySelector(
    "#end-score"
  ).innerHTML = `Udało ci się zdobyć ${points} punktów!`
  clearInterval(timer)
}

function animateBeaver() {
  if (!isPlaying) return
  const newBeaverIndex = getNewBeaverIndex()
  const newBeaver = document.querySelector(`.beaver-${newBeaverIndex}`)
  const lastBeaver = document.querySelector(`.beaver-${lastBeaverIndex}`)

  newBeaver.classList.remove("hidden-beaver")
  lastBeaver.classList.add("hidden-beaver")
  lastBeaverIndex = newBeaverIndex
  playerBlocked = false
}

setInterval(() => {
  if (!isPlaying) return
  timeLeft--
  timeLeftHolder.innerHTML = `Pozostały czas: ${timeLeft}s`
  if (timeLeft < 1) endGame()
}, 1000)

setTimeout(() => {
  const holes = document.querySelectorAll(".hole")

  holes.forEach((hole) =>
    hole.addEventListener("click", () => {
      if (playerBlocked) return
      playerBlocked = true
      const index = Number(hole.classList[1].slice(5))
      const lastBeaver = document.querySelector(`.beaver-${lastBeaverIndex}`)
      if (index === lastBeaverIndex) {
        points++
        lastBeaver.classList.add("hidden-beaver")
        score.innerHTML = `Twój wynik: ${points}`
        audio.play()
      }
    })
  )
}, 50)

window.addEventListener("mousemove", (e) => {
  hammer.style.top = `${e.pageY - 60}px`
  hammer.style.left = `${e.pageX - 60}px`
})

window.addEventListener("mousedown", () => {
  hammer.classList.add("hammer-bang")
  setTimeout(() => {
    hammer.classList.remove("hammer-bang")
  }, 200)
})

function startGame(lvl) {
  points = 0
  timeLeft = 60
  timer && clearInterval(timer)
  isPlaying = true
  score.style.display = "inline"
  levels.style.display = "none"
  board.style.display = "block"
  timeLeftHolder.style.display = "inline"
  score.innerHTML = `Twój wynik: ${points}`
  if (lvl === "easy") timer = setInterval(animateBeaver, EASY_TIMER)
  if (lvl === "medium") timer = setInterval(animateBeaver, MEDIUM_TIMER)
  if (lvl === "hard") timer = setInterval(animateBeaver, HARD_TIMER)
}

easyLvl.addEventListener("click", () => startGame("easy"))
mediumLvl.addEventListener("click", () => startGame("medium"))
hardLvl.addEventListener("click", () => startGame("hard"))
restartBtn.addEventListener("click", () => {
  score.style.display = "inline"
  score.innerHTML = "Wybierz poziom trudności"
  levels.style.display = "flex"
  summary.style.display = "none"
})
