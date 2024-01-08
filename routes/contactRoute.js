const express = require('express')
const router = express.Router()
const Contact = require('../models/contactModel')
const { body, validationResult } = require('express-validator')

//* GET contacts listing.
router.get('/', async (req, res) => {
	const contacts = await Contact.find()

	res.render('contacts', { title: 'Contacts', contacts, message: req.flash('message') })
})

//* GET contact create page.
router.get('/add', async (req, res) => {
	res.render('contact-add', { title: 'Create Contact' })
})

//* Get contact edit page.
router.get('/edit/:id', async (req, res) => {
	const id = req.params.id
	const contact = await Contact.findById(id)

	res.render('contact-edit', { title: 'Edit Contact', contact })
})

//* GET contact detail.
router.get('/:id', async (req, res) => {
	const id = req.params.id
	const contact = await Contact.findById(id)

	res.render('contact-details', { title: 'Contact Details', contact })
})

//* CREATE contact.
router.post(
	'/',
	[
		body('name').trim().notEmpty().withMessage('Name cannot be empty'),
		body('phone')
			.isMobilePhone('id-ID')
			.withMessage('Phone number has invalid format')
			.custom(async (val) => {
				const duplicate = await Contact.find({ phone: val })
				if (duplicate.length != 0) {
					throw new Error('Phone number already taken')
				}

				return true
			}),
		body('email').isEmail().withMessage('Email is invalid'),
	],
	async (req, res) => {
		const err = validationResult(req)
		if (!err.isEmpty()) {
			res.render('contact-add', { title: 'Create Contact', errors: err.array() })
		} else {
			await Contact.insertMany(req.body)

			req.flash('message', 'Contact Created Successfuly')
			res.redirect('/contacts')
		}
	}
)

//* UPDATE Cotact.
router.put(
	'/:id',
	[
		body('name').trim().notEmpty().withMessage('Name cannot be empty'),
		body('phone')
			.isMobilePhone('id-ID')
			.withMessage('Phone number has invalid format')
			.custom(async (val, { req }) => {
				const duplicate = await Contact.findOne({ phone: val })
				if (val != req.body.oldPhone && duplicate) {
					throw new Error('Phone number already taken')
				}

				return true
			}),
		body('email').isEmail().withMessage('Email is invalid'),
	],
	async (req, res) => {
		const err = validationResult(req)
		if (!err.isEmpty()) {
			res.render('contact-edit', { title: 'Edit Contact', contact: req.body, errors: err.array() })
		} else {
			const id = req.params.id
			await Contact.findByIdAndUpdate(id, {
				name: req.body.name,
				phone: req.body.phone,
				email: req.body.email,
			})

			req.flash('message', 'Contact updated successfuly')
			res.redirect('/contacts')
		}
	}
)

//* DELETE Cotact.
router.delete('/:id', async (req, res) => {
	const id = req.params.id
	await Contact.findByIdAndDelete(id)

	req.flash('message', 'Contact deleted successfuly')
	res.redirect('/contacts')
})

module.exports = router
