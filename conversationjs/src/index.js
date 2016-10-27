import html from './html'

export default class Conversation {
  constructor (configSelector, playerSelector, typeDelay = [50, 100]) {
    this.typeDelay = typeDelay
    this.config = document.querySelector(configSelector)
    this.player = document.querySelector(playerSelector)

    // extract the main data structure
    this.blocks = [...this.config.querySelectorAll('[step="0"]')].map(block => {
      return {
        id: block.attributes.block.value,
        title: block.innerHTML,
        played: false,
        sentences: this.config.querySelectorAll(`[block="${block.attributes.block.value}"]:not([step="0"])`)
      }
    })
  }

  _answer (block) {
    this.questions.remove()
    let answer = document.createElement('div')
    answer.classList.add('questions')
    answer.classList.add('answered')
    let inner = document.createElement('span')
    inner.innerHTML = block.title
    answer.appendChild(inner)
    this.player.appendChild(answer)
    this._playBlock(block)
  }

  _showQuestions (blocks) {
    if (blocks.length === 0) return
    this.questions = document.createElement('div')
    this.questions.classList.add('questions')
    blocks.forEach(block => {
      let button = document.createElement('button')
      button.innerHTML = block.title
      button.onclick = () => { this._answer(block) }
      this.questions.appendChild(button)
    })
    this.player.appendChild(this.questions)
  }

  _getTypeDelay () {
    return Math.random() * (this.typeDelay[1] - this.typeDelay[0]) + this.typeDelay[0]
  }

  _playLetter (letters, sentence, htmlMap, doneCallback) {
    if (letters.length === 0) {
      return doneCallback()
    }
    let text = html.strip(sentence.innerHTML) + letters.shift()
    sentence.innerHTML = html.inject(text, htmlMap)
    // schedule the next letter after type delay
    setTimeout(() => {
      this._playLetter(letters, sentence, htmlMap, doneCallback)
    }, this._getTypeDelay())
  }

  _playSentence (sentences, doneCallback) {
    if (sentences.length === 0) {
      return doneCallback()
    }
    let sentence = sentences.shift()
    // inject a span to allow flexbox centering
    let text = `<span>${sentence.innerHTML}</span>`
    let htmlMap = html.map(text)
    let letters = [...html.strip(text)]
    sentence.innerHTML = ''
    this._playLetter(letters, sentence, htmlMap, () => {
      // this sentence has finished playing, queue the next
      sentence.classList.remove('is-typing')
      this._playSentence(sentences, doneCallback)
    })
    sentence.classList.add('is-typing')
    this.player.appendChild(sentence)
  }

  _playBlock (block) {
    block.played = true
    this._playSentence([...block.sentences], () => {
      this._showQuestions(this.blocks.filter(block => !block.played))
    })
  }

  play () {
    this._playBlock(this.blocks.find(block => block.id === 'start'))
  }
}
