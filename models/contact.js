const mongoose = require('mongoose')
const connectionString = process.env.MONGODB_URI_WITH_PASS
const uniqueValidator = require('mongoose-unique-validator')
console.log(`connecting to ${connectionString}`)

mongoose.connect(connectionString, {useNewUrlParser: true})
    .then(result => {
        console.log('Connected To MongoDB successfully')
    }).catch(error => {
        console.log(`error connecting to mongoDB ${error.message}`)
    })

const contactSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 4,
      required: true,
      unique: true
    },
    number: {
        type: String,
        minlength: 8,
        required: true
    }
})

contactSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

contactSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Contact', contactSchema)