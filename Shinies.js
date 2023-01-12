const { EventEmitter } = require('node:events')

const fetch = require('node-fetch')

class Shinies extends EventEmitter {
  constructor() {
    super()
    this.mostRecent = null
    setInterval(() => this.checkShinies(), 5000)
  }

  async checkShinies() {
    const res = await fetch('https://www.slender.dev/shinies')
    const data = await res.json()
    const shinies = data.recshinies[0].shinies
    if (!this.mostRecent) this.mostRecent = shinies[shinies.length - 1].timetick
    for (const shiny of shinies) {
      if (shiny.timetick > this.mostRecent) {
        this.mostRecent = shiny.timetick
        this.emit('shiny', { username: shiny.username, item: shiny.itemname })
      }
    }
  }
}

module.exports = Shinies