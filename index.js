const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())

const requestLogger = (request, response, next) => {
    console.log("Method:",request.method)
    console.log("Path:  ",request.path)
    console.log("Body:  ",request.body)
    console.log('---')
    next()
}

app.use(requestLogger)

let numbers = [
    {
        name: "Arto Hellas",
        number: "032-992",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "0321-22",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12340-9832",
        id: 3
    },
    {
        name: "Arto Hellas",
        number: "032-9927213",
        id: 4
    },
]

app.get('/api/persons', (request, response) => {
    response.json(numbers)
})

app.get('/info', (request, response) => {
    const time = new Date()
    response.send("<h2>Phonebook has info for "
        + numbers.length 
        +" people</h2>"
        + time)
})

app.get('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    const person = numbers.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    numbers = numbers.filter(number => number.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request,response) => {
    const body = request.body
    const doesExist = numbers.find(number => number.name === body.name)
    if (!body.name || !body.number){
        return response.status(400).json({
            error: "content missing"
        })
    }
    if (doesExist){
        return response.status(400).json({
            error: "number already exists"
        })
    }
    
    const newEntry = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random()*(23847612) + 1)
    }

    numbers = numbers.concat(newEntry)

    response.json(newEntry)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("Server running on port ", PORT)
})

