var highland = require('highland')
var oboe = require('oboe')
var fs = require('fs')
var path = require('path')
var request = require('request')

function getPointsStream (sourceStream) {
  return highland(function (push, next) {
    sourceStream.on('error', function (err) {
      push(null, highland.nil)
    })

    oboe(sourceStream)
      .node('{x y color}', function (p) {
        push(null, p)
      })
      .done(function () {
        push(null, highland.nil)
      })
  })
}

function getFullStream () {
  var catPath = path.resolve(__dirname, '..', 'data/cat-points.json')
  var catSource = fs.createReadStream(catPath)
  var catStream = getPointsStream(catSource)

  var sunUrl = 'https://raw.githubusercontent.com/JuanCaicedo/better-json-through-streams/master/data/sun-points.json'
  var sunSource = request(sunUrl)
  var sunStream = getPointsStream(sunSource)

  return highland([
    catStream,
    sunStream
  ]).merge()
}

function getStreamWithCat () {
  var catPath = path.resolve(__dirname, '..', 'data/cat-points.json')
  var catSource = fs.createReadStream(catPath)
  var catStream = getPointsStream(catSource)

  return catStream
}

function getStreamWithSun () {
  var sunPath = path.resolve(__dirname, '..', 'data/sun-points.json')
  var sunSource = fs.createReadStream(sunPath)
  var sunStream = getPointsStream(sunSource)

  return sunStream
}

module.exports = {
  getFullStream: getFullStream,
  getPointsStream: getPointsStream,
  getStreamWithCat: getStreamWithCat,
  getStreamWithSun: getStreamWithSun
}