var express = require('express')
var router = express.Router()
var highland = require('highland')
var utils = require('../utils/points')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' })
})

router.get('/data', function (req, res, next) {
  var response = {
    exif: {
      software: 'http://make8bitart.com',
      dateTime: '2015-11-07T15:35:13.415Z',
      dateTimeOriginal: '2015-11-07T00:24:05.776Z'
    },
    pixif: {
      pixels: ["#{pixels}"]
    },
    end: 'test'
  }
  var json = JSON.stringify(response)
  var parts = json.split('"#{pixels}"')
  var pointsStream = utils.getFullStream()
        .map(JSON.stringify)
        .intersperse(',')

  highland([
    parts[0],
    pointsStream,
    parts[1]
  ])
  .invoke('split', [''])
  .sequence()
  .pipe(res)
})

module.exports = router;
