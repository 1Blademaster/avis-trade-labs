import RealtimeGraph from '@/components/realtimeGraph'
import { Button, ButtonGroup, NumberInput, ScrollArea } from '@mantine/core'
import { useInterval, useListState } from '@mantine/hooks'
import { Fragment, useEffect, useRef, useState } from 'react'

function BuyTransactionRow({ transaction }) {
  return (
    <div className='flex space-x-2 bg-green-300/50'>
      <p>{new Date(transaction.time).toLocaleString()}</p>
      <p>BUY</p>
      <p>BTC price: ${transaction.btcPrice.toFixed(2)}</p>
      <p>Amount: ${transaction.buyPrice.toFixed(2)}</p>
    </div>
  )
}

function SellTransactionRow({ transaction }) {
  return (
    <div className='flex space-x-2 bg-red-300/50'>
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

    const currentBtcClose = currentBtcData.close

    const transaction = {
      id: crypto.randomUUID(),
      type: 'buy',
      btcPrice: currentBtcClose,
      buyPrice: buyPrice,
      time: new Date(),
    }

    // console.log(transaction)

    transactionHistoryHandler.prepend(transaction)

    const line = {
      drawTime: 'afterDatasetsDraw',
      type: 'line',
      scaleID: 'y',
      value: currentBtcClose,
      borderColor: '#a3e635',
      borderWidth: 2,
    }

    ref?.current.config.options.plugins.annotation.annotations.pop()
    ref?.current.config.options.plugins.annotation.annotations.push(line)
    ref?.current.update('quiet')

    setBoughtIn(true)
    setCurrentBal(currentBal - buyPrice)
    setBuyPrice(100)
  }

  function sellOut() {
    if (currentBal === 0 || !boughtIn) return

    const lastTransaction = transactionHistory[0]

    const currentBtcClose = currentBtcData.close

    // 550+(((432.61-433.82)*450)+450)

    // current_bal + ( ( (current_btc_close - last_btc_close) * amount ) + amount )

    const newBal =
      currentBal + (currentBtcClose * (lastTransaction.buyPrice/lastTransaction.btcPrice))

    const profit = 
      ((currentBtcClose) * (lastTransaction.buyPrice/lastTransaction.btcPrice)) - lastTransaction.buyPrice

    // (currentBtcClose - lastTransaction.btcPrice) * lastTransaction.buyPrice

    const transaction = {
      id: crypto.randomUUID(),
      type: 'sell',
      btcPrice: currentBtcClose,
      buyPrice: lastTransaction.buyPrice,
      profit: profit,
      time: new Date(),
    }

    // console.log(transaction)

    const line = {
      drawTime: 'afterDatasetsDraw',
      type: 'line',
      scaleID: 'y',
      value: currentBtcClose,
      borderColor: '#f87171',
      borderWidth: 2,
    }

    transactionHistoryHandler.prepend(transaction)

    ref?.current.config.options.plugins.annotation.annotations.pop()
    ref?.current.config.options.plugins.annotation.annotations.push(line)
    ref?.current.update('quiet')

    // console.log(ref?.current.config.options.plugins.annotation.annotations)

    setBoughtIn(false)
    setCurrentBal(newBal)
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
                    <Fragment key={transaction.id}>
                      <BuyTransactionRow transaction={transaction} />
                    </Fragment>
                  )
                } else {
                  return (
                    <Fragment key={transaction.id}>
                      <SellTransactionRow transaction={transaction} />
                    </Fragment>
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
