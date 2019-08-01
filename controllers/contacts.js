const contactsRouter = require('express').Router()
const Contact = require('../models/contact')

contactsRouter.get('/', (request, response) => {
    Contact.find({}).then(contacts => {
      response.json(contacts)
    })
  })
  
//   app.get('/info', (request, response) => {
//     const time = new Date()
//     response.send('<h2>Phonebook has info for '
//       + Contact.length
//       + ' people</h2>'
//       + time)
//   })
  
  contactsRouter.get('/:id', (request, response) => {
    Contact.findById(request.params.id)
      .then(contact => {
        if (contact) {
          response.json(contact.toJSON())
        } else {
          response.status(404).end()
        }
      })
      .catch(error => {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
          return response.status(400).send({ error: 'malformatted id' })
        }
      })
  })
  
  contactsRouter.delete('/:id', (request, response) => {
    Contact.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
          return response.status(400).send({ error: 'malformatted id' })
        }
      })
  })
  
  contactsRouter.post('/', (request, response) => {
    const body = request.body
  
    const newContact = new Contact({
      name: body.name,
      number: body.number,
    })
  
    newContact.save()
      .then(savedContact => {
        response.json(savedContact.toJSON())
      }).catch(error => {
        if (error.name === 'ValidationError') {
          response.status(422).json({ error: error.message })
        }
      })
  })

module.exports = contactsRouter

