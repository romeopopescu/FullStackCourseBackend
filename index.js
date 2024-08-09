const express = require('express')
const morgan = require('morgan')
const app = express()

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
})

app.use(express.json())
app.use(morgan('combined'))

app.get('/', (request, response) => {
  response.send('<h1>Hello world!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const len = persons.length
  const date = new Date().toString()
  response.send(`<p>Phonebook has info for ${len} people</p><p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const rand = Math.random() * 100
  const maxid = parseInt(String(rand), 10)

  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }
  else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }
  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'the name already exists in phonebook'
    })
  }
  const person = {
    id: String(maxid), 
    name: body.name,
    number: body.number,
  } 

  persons = persons.concat(person)
  response.json(person)
})


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)