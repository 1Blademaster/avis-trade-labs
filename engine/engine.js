const fs = require('fs')
const csv = require('fast-csv')

const data = []

const fileNames = [
  'data/btcusd_2016-min_data.csv',
  'data/btcusd_2018-min_data.csv',
  'data/btcusd_2020-min_data.csv',
  'data/btcusd_2022-min_data.csv',
]

function loopThroughFiles(currentFileIndex) {
  fs.createReadStream(fileNames[currentFileIndex])
    .pipe(csv.parse({ headers: true }))
    .on('error', (error) => console.error(error))
    .on('data', (row) => {
      data.push(row)
    })
    .on('end', (rowCount) => {
      console.log(`Parsed ${rowCount} rows`)
      loopThroughFiles((currentFileIndex + 1) % fileNames.length)
    })
}

global.current = 0

export var btcData = {
  open: 0,
  close: 0,
  time: null,
}

if (global.current === 0) {
  loopThroughFiles(0)
  setInterval(() => {
    current = current + 1
    btcData.open = parseFloat(data[current]?.Open)
    btcData.close = parseFloat(data[current]?.Close)
    btcData.time = parseInt(data[current]?.Timestamp)
    console.log(current)
  }, 100)
}
