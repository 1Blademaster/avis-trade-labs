const fs = require('fs')
const path = require('path')
const csv = require('fast-csv')

const data = []

fs.createReadStream('data/btcusd_1-min_data.csv')
  .pipe(csv.parse({ headers: true }))
  .on('error', (error) => console.error(error))
  .on('data', (row) => {
    data.push(row)
  })
  .on('end', (rowCount) => console.log(`Parsed ${rowCount} rows`))

var current = 0
export var btcClose = 0

setInterval(() => {
  current = current + 1
  btcClose = data[current].Close
  console.log(data.length, current, data[current], btcClose)
}, 1000)
