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
  })
  .on('type:end, erase:end', function () {
    // and then remove it when he's done
    var actor = theater.getCurrentActor()
    actor.$element.classList.remove('is-typing')
  })

function showQuestions() {
  var button
  var questions = document.createElement('div')
  blocks.forEach(function (block) {
    if (playedBlocks.indexOf(block) === -1) {
      button = document.createElement('button')
      button.innerHTML = block.title
      button.onclick = function () { goTo(block) }
      questions.appendChild(button)
    }
  })
  document.querySelector('#player').appendChild(questions)
  currentQuestions = questions
}

function goTo(block) {
  currentQuestions.innerHTML = block.title
  currentQuestions.classList.add('answered')
  playBlock(block.name)
}

function playBlock(block) {
  console.log('playBlock', block)
  playedBlocks.push(block)
  var selector = '.me[block="' + block + '"]'
  document.querySelectorAll(selector).forEach(function (node, idx, nodes) {
    var actor = block + '-' + node.attributes.step.value
    var actorSelector = '.me[step="' + node.attributes.step.value + '"][' + 'block="' + block + '"]'
    theater.addActor(actor, {accuracy: 0.8, speed: 1.0}, actorSelector)
    theater.addScene(actor + ':' + node.innerHTML)
    theater.addScene(function (done) {
      if (idx === nodes.length - 1) {
        showQuestions()
      }
      done()
    })
    node.innerHTML = ''
    document.querySelector('#player').appendChild(node)
  })
}

playBlock('start')

