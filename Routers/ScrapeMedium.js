const express = require('express')
const scrapeController = require('../Controllers/scrapeMedium')

const router = express.Router()

router.post('/getInput' , scrapeController.GetData)

module.exports = router