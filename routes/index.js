var express = require('express')
var router = express.Router()
var highland = require('highland')

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
  var points = [
    {
      x: 1,
      y: 2,
      color: 'orange'
    },
    {
      x: 2,
      y: 2,
      color: 'orange'
    }
  ]
  var pointsStream = highland(points)
    .map(function (p) {
      return JSON.stringify(p)
    })
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
