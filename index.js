require('dotenv').config()

const fetch = require('node-fetch')

const Shinies = require('./Shinies')
const shinies = new Shinies()

shinies.on('shiny', async shiny => {
  if (shiny.username !== process.env.ROBLOX_USER) return
  fetch(process.env.WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: process.env.NICK,
      avatar_url: process.env.PFP,
      content: `${process.env.PING} obtained a ${shiny.item}!`
    })
  })
})