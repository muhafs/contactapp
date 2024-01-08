// extract env file
require('dotenv').config()

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')
const logger = require('morgan')

const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')

// define routers
const indexRouter = require('./routes/indexRoute')
const aboutRouter = require('./routes/aboutRoute')
const contactsRouter = require('./routes/contactRoute')

const app = express()

// define MongoDB connection
require('./utilities/db')

// method override setup
app.use(methodOverride('_method'))

// view engine setup
app.use(expressLayouts) // define ejs layouts
app.set('layout', './layouts/main') // set the default layout of page
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// http request setup
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser('secret'))
app.use(
	session({
		cookie: { maxAge: 6000 },
		secret: 'secret',
		resave: true,
		saveUninitialized: true,
	})
)
app.use(flash())
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.use('/', indexRouter)
app.use('/about', aboutRouter)
app.use('/contacts', contactsRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

module.exports = app
