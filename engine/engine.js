const fs = require('fs')
const path = require('path')
const csv = require('fast-csv')

const data = []

const fileNames = [
  'data/btcusd_2016-min_data.csv', 
  'data/btcusd_2018-min_data.csv', 
  'data/btcusd_2020-min_data.csv', 
  'data/btcusd_2022-min_data.csv'
]

function loopThroughFiles(currentFileIndex){
  fs.createReadStream(fileNames[currentFileIndex])
    .pipe(csv.parse({ headers: true }))
    .on('error', (error) => console.error(error))
    .on('data', (row) => {
      data.push(row)
    })
    .on('end', (rowCount) => {
      console.log(`Parsed ${rowCount} rows`)
      loopThroughFiles((currentFileIndex+1)%fileNames.length)
    })
}

loopThroughFiles(0)

var current = 0
export var btcClose = 0

setInterval(() => {
  current = current + 1
  btcClose = data[current]?.Close
  console.log(data.length, current, data[current], btcClose)
}, 1000)
