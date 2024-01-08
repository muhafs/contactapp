const { model } = require('mongoose')

const Contact = model('Contact', {
	name: { type: String, required: true },
	phone: { type: String, required: true },
	email: { type: String, required: false },
})

module.exports = Contact
