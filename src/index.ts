import * as dotenv from 'dotenv'
import fetch from 'node-fetch'

import { Shinies } from './Shinies.js'

dotenv.config()

const shinies = new Shinies()

shinies.on('shiny', async shiny => {
  if (shiny.user.username !== process.env.ROBLOX_USER) return
  fetch(process.env.WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: process.env.NICK,
      avatar_url: process.env.PFP,
      content: `${process.env.PING} obtained a ${shiny.item.name}!`
    })
  })
})
