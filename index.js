const BUBBLE_HEIGHT = '60px'

var currentQuestions
var playedBlocks = []
var blocks = [
  {name: 'projects', title: 'Vos projets'},
  {name: 'technos', title: 'Vos technos'},
  {name: 'contact', title: 'Vous contacter'}
]

var theater = theaterJS({ autoplay: true })

theater
  .on('type:start, erase:start', function () {
    // add a class to actor's dom element when he starts typing/erasing
    var actor = theater.getCurrentActor()
    actor.$element.classList.add('is-typing')
    theater.getCurrentActor().$element.scrollIntoView()
    theater.getCurrentActor().$element.style.height = BUBBLE_HEIGHT
  })
  .on('type:end, erase:end', function () {
    // and then remove it when he's done
    var actor = theater.getCurrentActor()
    actor.$element.classList.remove('is-typing')
  })

function showQuestions() {
  var button
  var questions = document.createElement('div')
  questions.classList.add('questions')
  blocks.forEach(function (block) {
    if (playedBlocks.indexOf(block.name) === -1) {
      button = document.createElement('button')
      button.innerHTML = block.title
      button.onclick = function () { goTo(block) }
      questions.appendChild(button)
    }
  })
  document.querySelector('#player').appendChild(questions)
  questions.scrollIntoView()
  currentQuestions = questions
}

function goTo(block) {
  var span = document.createElement('span')
  span.innerHTML = block.title
  while (currentQuestions.firstChild) {
      currentQuestions.removeChild(currentQuestions.firstChild)
  }
  currentQuestions.appendChild(span)
  currentQuestions.classList.add('answered')
  playBlock(block.name)
}

function playBlock(block) {
  playedBlocks.push(block)
  var selector = 'div[block="' + block + '"]'
  document.querySelectorAll(selector).forEach(function (node, idx, nodes) {
    var actor = block + '-' + node.attributes.step.value
    var actorSelector = 'div[step="' + node.attributes.step.value + '"][' + 'block="' + block + '"]'
    theater.addActor(actor, {accuracy: 0.7, speed: 1.0}, actorSelector)
    // add a span to let display:flex v-center stuff correctly
    var text = '<span>' + node.innerHTML + '</span>'
    var isFirstScene = (idx === 0 && block === 'start')
    // weird hack to add blinking (...)
    // first an empty string w/ actor to allow getCurrentActor()
    // and then set height manually to make it appear
    // finally we can launch our animation by adding a class
    if (isFirstScene) {
      theater.addScene(actor + ':')
      theater.addScene(function (done) {
        console.log('Start')
        theater.getCurrentActor().$element.style.height = BUBBLE_HEIGHT
        theater.getCurrentActor().$element.classList.add('blinking-intro')
        setTimeout(function() {
          theater.getCurrentActor().$element.classList.remove('blinking-intro')
          done()
        }, 3000);
      })
    }
    // add main text from configuration node
    theater.addScene(actor + ':' + text)
    // add a delay after very first sentence
    if (isFirstScene) theater.addScene(1000)
    // show questions when a block is over
    theater.addScene(function (done) {
      if (idx === nodes.length - 1) showQuestions()
      done()
    })
    // erase the configuration text before displaying the node
    node.innerHTML = ''
    document.querySelector('#player').appendChild(node)
  })
}

playBlock('start')
