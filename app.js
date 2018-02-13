const start = document.getElementById('start'),
  stop = document.getElementById('stop'),
  pause = document.getElementById('pause'),
  allBtns = Array.from(document.querySelectorAll('button')),
  hideMe = Array.from(document.querySelectorAll('.hide-me')),
  pauseIcon = document.getElementById('pause-icon'),
  timers = [{
      minutes: 5,
      seconds: 0,
      minCounter: 5,
      secCounter: 0,
      totalTime: 0,
      progress: 0,
      display: document.getElementById('int-time'),
      bar: document.getElementById('interval-bar'),
      id: 0
    },
    {
      minutes: 5,
      seconds: 0,
      minCounter: 5,
      secCounter: 0,
      totalTime: 0,
      progress: 0,
      display: document.getElementById('break-time'),
      bar: document.getElementById('break-bar'),
      id: 1
    }
  ],
  bleep = new Howl({
    src: ['bleep.mp3']
  }),
  toggleHidden = () => hideMe.forEach(x => x.classList.toggle('is-hidden')),
  minTwoDidgets = num => String(num).length < 2 ? num = `0${num}` : num,
  setDisplay = x => x.display.textContent = `${minTwoDidgets(x.minutes)}:${minTwoDidgets(x.seconds)}`

let interval,
  btnRepeat,
  timerSwitch,
  running

document.getElementById('sm').addEventListener('mousedown', () => minus(timers[0]))
document.getElementById('sp').addEventListener('mousedown', () => plus(timers[0]))
document.getElementById('bm').addEventListener('mousedown', () => minus(timers[1]))
document.getElementById('bp').addEventListener('mousedown', () => plus(timers[1]))
allBtns.forEach(x => x.addEventListener('mouseout', () => clearInterval(btnRepeat)))
allBtns.forEach(x => x.addEventListener('mouseup', () => clearInterval(btnRepeat)))
stop.addEventListener('click', () => {
  clearInterval(interval)
  reset.call(timers[0])
  reset.call(timers[1])
  toggleHidden()
})
pause.addEventListener('click', () => {
  if (running) {
    clearInterval(interval)
    running = false
    showPlay()
  } else {
    timer.call(timers[timerSwitch])
    showPause()
  }
})
start.addEventListener('click', () => {
  reset.call(timers[0])
  reset.call(timers[1])
  timer.call(timers[0])
  toggleHidden()
  showPause()
})

function showPause() {
  pauseIcon.innerHTML = '<i class="fas fa-pause"></i>'
  pause.classList.remove('is-success')
  pause.classList.add('is-info')
}

function showPlay() {
  pauseIcon.innerHTML = '<i class="fas fa-play"></i>'
  pause.classList.remove('is-info')
  pause.classList.add('is-success')
}

//minus button stuff to do
function minus(x) {
  minusAction(x)
  btnRepeat = setInterval(() => {
    minusAction(x)
  }, 100)
}

function minusAction(x) {
  if (x.minutes > 1) {
    x.minutes--
  } else if (x.seconds === 0) {
    x.minutes = 0
    x.seconds = 59
  } else {
    x.seconds > 1 ? x.seconds-- : false
  }
  setDisplay(x)
}

//plus button stuff to do
function plus(x) {
  plusAction(x)
  btnRepeat = setInterval(() => {
    plusAction(x)
  }, 100)
}

function plusAction(x) {
  if (x.seconds < 59 && x.seconds !== 0) {
    x.seconds++
  } else {
    x.minutes++
      x.seconds = 0
  }
  setDisplay(x)
}

function timer() {
  timerSwitch = this.id
  running = true
  interval = setInterval(() => {
    this.display.textContent = `${minTwoDidgets(this.minCounter)}:${minTwoDidgets(this.secCounter)}`
    this.bar.value = this.progress
    this.progress++
      this.totalTime--
      this.secCounter--
      this.secCounter < 0 ? (this.secCounter = 59, this.minCounter--) : false
    if (this.totalTime < 0) {
      clearInterval(interval)
      bleep.play()
      this.display.textContent = `00:00`
      this.bar.max = 1
      this.bar.value = 1
      setTimeout(() => {
        reset.call(this)
      }, 1000) 
      this.id === 0 ? timer.call(timers[1]) : timer.call(timers[0])
    }
  }, 1000)
}

function reset(timer) {
    this.minCounter = this.minutes
    this.secCounter = this.seconds
    this.progress = 0
    this.bar.value = 0
    this.totalTime = this.minCounter * 60 + this.secCounter
    this.bar.max = this.totalTime
    setDisplay(this)
}