require('dotenv').config()

let PORT = process.env.PORT || 3001
let MONGODB_URI = process.env.MONGODB_URI_WITH_PASS

module.exports = {
    PORT,
    MONGODB_URI
}