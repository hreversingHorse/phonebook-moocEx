require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.use(express.static('build'))
const requestLogger = (request, response, next) => {
    console.log("Method:",request.method)
    console.log("Path:  ",request.path)
    console.log("Body:  ",request.body)
    console.log('---')
    next()
}
const Contact = require('./models/contact')

// const errorHandler = (error,request,response,next) => {
    
//     if (error.name === 'CastError' && error.kind === 'ObjectId'){
//         return response.status(400).send({error: 'malformatted id'})
//     } else if (error.name === 'ValidationError'){
//         return response.status(422).json({error: "i got here "})
//     }
//     next(error)
// }

app.use(requestLogger)
// app.use(errorHandler)

app.get('/api/persons', (request, response) => {
    Contact.find({}).then(contacts => {
        response.json(contacts)
    })
})

app.get('/info', (request, response) => {
    const time = new Date()
    response.send("<h2>Phonebook has info for "
        + Contact.length 
        +" people</h2>"
        + time)
})

app.get('/api/persons/:id', (request,response) => {
    Contact.findById(request.params.id)
        .then(contact => {
            if (contact){
                response.json(contact.toJSON())
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            if (error.name === 'CastError' && error.kind === 'ObjectId'){
                return response.status(400).send({error: 'malformatted id'})
            }
        })
})

app.delete('/api/persons/:id', (request,response,next) => { 
    Contact.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            if (error.name === 'CastError' && error.kind === 'ObjectId'){
                return response.status(400).send({error: 'malformatted id'})
            }
        })
})

app.post('/api/persons', (request,response,next) => {
    const body = request.body

    const newContact = new Contact({
        name: body.name,
        number: body.number,
    })

    newContact.save()
        .then(savedContact => {
            response.json(savedContact.toJSON())
    }).catch(error => {
        if (error.name === 'ValidationError'){
            response.status(422).json({error: error.message})
        }
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("Server running on port ", PORT)
})

