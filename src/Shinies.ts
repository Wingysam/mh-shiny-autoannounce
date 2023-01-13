import { EventEmitter } from 'node:events'

import fetch from 'node-fetch'

const MILLISECONDS_IN_SECOND = 1000
const POLL_RATE = 5 * MILLISECONDS_IN_SECOND

type SlenderApiData = {
  recshinies: [
    {
      _id: string
      shinies: SlenderApiShiny[]
    }
  ]
}

type SlenderApiShiny = {
  timetick: number
  username: string
  itemname: string
  timeGot: {
    min: number
    hour: number
    year: number
    wday: number
    day: number
    month: number
    sec: number
    yday: number
    isdst: boolean
  }
  rarity: number
  itempic: string
  rank: number
  userid: number
}

export class Shinies extends EventEmitter {
  mostRecent: number | null
  recshinies: SlenderApiData['recshinies']
  constructor () {
    super()
    this.mostRecent = null
    setInterval(() => this.checkShinies(), POLL_RATE)
  }

  async checkShinies () {
    try {
      const res = await fetch('https://mh.slender.dev/shinies')
      const data = (await res.json()) as SlenderApiData
      const shinies = data.recshinies[0].shinies
      if (!this.mostRecent) this.mostRecent = shinies[shinies.length - 1].timetick
      for (const shiny of shinies) {
        if (shiny.timetick > this.mostRecent) {
          this.mostRecent = shiny.timetick
          this.emit('shiny', new Shiny(shiny))
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
}

export declare interface Shinies {
  on(event: 'shiny', listener: (shiny: Shiny) => void): this
  on(event: string, listener: Function): this
}

class Shiny {
  date: Date

  user: {
    id: number
    username: string
  }

  item: {
    name: string
    rarity: number
    thumbnail: string
  }

  constructor (apiShiny: SlenderApiShiny) {
    this.date = new Date(apiShiny.timetick * MILLISECONDS_IN_SECOND)
    this.user = {
      id: apiShiny.userid,
      username: apiShiny.username
    }
    this.item = {
      name: apiShiny.itemname,
      rarity: apiShiny.rarity,
      thumbnail: apiShiny.itempic
    }
  }
}
