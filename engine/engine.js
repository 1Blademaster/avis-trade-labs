const fs = require('fs')
const csv = require('fast-csv')

const varianceMultiplier = 50
const valueOffset = -(427500 / 20)

global.data = []

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
      global.data.push({ Close: row.Close, Timestamp: row.Timestamp })
    })
    .on('end', (rowCount) => {
      console.log(`Parsed ${rowCount} rows`)
      if (currentFileIndex === fileNames.length - 1) {
        console.log('All files parsed')
      } else {
        loopThroughFiles(currentFileIndex + 1)
      }
    })
}

global.current = 0
if (global.interval !== null || global.interval !== undefined) {
  clearInterval(global.interval)
}
global.interval = null

export var btcData = {
  close: 0,
  time: null,
}

if (global.current === 0) {
  loopThroughFiles(0)
  clearInterval(global.interval)
  global.interval = null
  global.data = []
  global.interval = setInterval(() => {
    current = current + 1
    btcData.close = parseFloat(
      data[current]?.Close * varianceMultiplier + valueOffset
    )
    btcData.time = parseInt(data[current]?.Timestamp)
    console.log(current, global.data.length)
  }, 100)
}
