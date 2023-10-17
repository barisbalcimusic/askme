const express = require('express')
const app = express()
const ejs = require('ejs')
const axios = require('axios')
const port = 3000

app.set('view engine', 'ejs')

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})

app.use(express.json())

app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.render('index.ejs', { answer: '' })
})

app.use(express.static('public'))

app.post('/', async (req, res) => {
  try {
    // getting input value
    const inputValue = req.body.inputValue

    // sending input value to chat GPT
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: inputValue,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer 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',
        },
      },
    )

    // selecting the answer of chat GPT
    const aiResponse = '"' + response.data.choices[0].message.content + '"'

    // printing the answer
    res.render('index.ejs', { answer: aiResponse })
  } catch (error) {
    res.status(500).send("Sorry dude, I'm busy now, try again later :)")
  }
})
