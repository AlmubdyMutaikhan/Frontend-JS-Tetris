const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

// add template and css files
app.set('view engine', 'ejs')
app.use(express.static('public'))


/* BACKEND */

// set up server 
app.listen(PORT, () => {
    console.log("server is on " + PORT)
})

// set route
app.use('/', (req, res) => {
    res.render('index')
})

