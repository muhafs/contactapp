const express = require('express')
const router = express.Router()

/* GET users listing. */
router.get('/', async (req, res) => {
	res.render('about', { title: 'About' })
})

module.exports = router
