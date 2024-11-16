import RealtimeGraph from '@/components/realtimeGraph'
import { Button, ButtonGroup, NumberInput, ScrollArea } from '@mantine/core'
import { useInterval, useListState } from '@mantine/hooks'
import { useEffect, useRef, useState } from 'react'

function BuyTransactionRow({ key, transaction }) {
  return (
    <div key={key} className='flex space-x-2 bg-green-300/50'>
      <p>{new Date(transaction.time).toLocaleString()}</p>
      <p>BUY</p>
      <p>BTC price: ${transaction.btcPrice.toFixed(2)}</p>
      <p>Amount: ${transaction.buyPrice.toFixed(2)}</p>
    </div>
  )
}

function SellTransactionRow({ key, transaction }) {
  return (
    <div key={key} className='flex space-x-2 bg-red-300/50'>
      <p>{new Date(transaction.time).toLocaleString()}</p>
      <p>SELL</p>
      <p>BTC price: ${transaction.btcPrice.toFixed(2)}</p>
      <p>Amount: ${transaction.buyPrice.toFixed(2)}</p>
      <p>Profit: ${transaction.profit.toFixed(2)}</p>
    </div>
  )
}

export default function Home() {
  const ref = useRef(null)

  const [currentBtcData, setCurrentBtcData] = useState(null)

  const [buyPrice, setBuyPrice] = useState(100)
  const [currentBal, setCurrentBal] = useState(1000)
  const [boughtIn, setBoughtIn] = useState(false)

  const [transactionHistory, transactionHistoryHandler] = useListState([])

  const interval = useInterval(() => {
    async function fetchPosts() {
      let res = await fetch('/api/hello')
      let btcData = await res.json()
      if (btcData.time === null) return

      setCurrentBtcData(btcData)

      const data = { x: Date.now(), y: btcData.close }
      ref?.current.data.datasets[0].data.push(data)
      ref?.current.update('quiet')
    }
    fetchPosts()
  }, 100)

  useEffect(() => {
    interval.start()
    return interval.stop
  }, [])

  function buyIn() {
    if (currentBtcData === null) return

    const transaction = {
      type: 'buy',
      btcPrice: currentBtcData.close,
      buyPrice: buyPrice,
      time: new Date(),
    }

    console.log(transaction)

    transactionHistoryHandler.prepend(transaction)

    const annotation = {
      type: 'line',
      mode: 'horizontal',
      scaleID: 'y',
      value: buyPrice,
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 2,
    }

    // ref?.current.options.plugins.annotation.annotations = {buyLine: annotation}

    setBoughtIn(true)
    setCurrentBal(currentBal - buyPrice)
    setBuyPrice(100)
  }

  function sellOut() {
    if (currentBal === 0 || !boughtIn) return

    const lastTransaction = transactionHistory[0]

    const currentBtcClose = currentBtcData.close
    const profit =
      (currentBtcClose - lastTransaction.btcPrice) * lastTransaction.buyPrice

    if (currentBtcClose === lastTransaction.btcPrice) {
      profit = lastTransaction.buyPrice
    }

    const transaction = {
      type: 'sell',
      btcPrice: currentBtcClose,
      buyPrice: lastTransaction.buyPrice,
      profit: profit,
      time: new Date(),
    }

    console.log(transaction)

    transactionHistoryHandler.prepend(transaction)

    // ref?.current.options.plugins.annotation.annotations = {}

    setBoughtIn(false)
    setCurrentBal(currentBal + profit)
  }

  return (
    <div className='h-full flex p-4'>
      <div className='flex flex-row w-full'>
        <div className='flex flex-col w-2/3'>
          <div className='h-3/4'>
            <RealtimeGraph ref={ref} datasetLabel={'BTC'} />
          </div>
          <div className='flex flex-row space-x-8'>
            <div className='flex flex-col space-y-4 w-52'>
              <NumberInput
                prefix='$'
                value={buyPrice}
                onChange={setBuyPrice}
                allowNegative={false}
                min={1}
                hideControls
              />
              <ButtonGroup className='w-full'>
                <Button
                  variant='filled'
                  color='green'
                  className='w-full'
                  onClick={buyIn}
                  disabled={currentBal < buyPrice || boughtIn}
                >
                  BUY
                </Button>
                <Button
                  variant='filled'
                  color='red'
                  className='w-full'
                  onClick={sellOut}
                  disabled={currentBal === 0 || !boughtIn}
                >
                  SELL
                </Button>
              </ButtonGroup>
            </div>
            <p className='font-bold text-3xl'>
              Balance: ${currentBal.toFixed(2)}
            </p>
            <ScrollArea h={250}>
              {transactionHistory.map((transaction) => {
                if (transaction.type === 'buy') {
                  return (
                    <BuyTransactionRow
                      key={transaction.time}
                      transaction={transaction}
                    />
                  )
                } else {
                  return (
                    <SellTransactionRow
                      key={transaction.time}
                      transaction={transaction}
                    />
                  )
                }
              })}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
