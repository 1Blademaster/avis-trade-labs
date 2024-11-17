import Leaderboard from '@/components/leaderboard'
import RealtimeGraph from '@/components/realtimeGraph'
import { Button, ButtonGroup, NumberInput, ScrollArea, Modal, Stack, Divider } from '@mantine/core'
import { useInterval, useListState, useDisclosure } from '@mantine/hooks'

import Link from 'next/link'

import { useUser } from '@auth0/nextjs-auth0/client'
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
  
  const REQUIRE_LOGIN = true; // false for dev
  const [stopLoss, setStopLoss] = useState(20)
  const [takeProfit, setTakeProfit] = useState(20)

  const {user, error, isLoading } = useUser();
  const [opened, {open, close}] = useDisclosure(REQUIRE_LOGIN && !user);
  
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

          const lastTransaction = transactionHistory[0]
          if (
            boughtIn &&
            stopLoss / 100 <=
            (lastTransaction.btcPrice - currentBtcData.close) /
                lastTransaction.btcPrice
          ) {
            sellOut()
          } else if (
            boughtIn &&
            stopLoss / 100 <=
            -(lastTransaction.btcPrice - currentBtcData.close) /
                lastTransaction.btcPrice
          ) {
            sellOut()
           }
        }
    fetchPosts()
  }, 100)

  useEffect(() => {
    interval.start()
    return interval.stop
  }, [])

  function buyIn() {
    if (currentBtcData === null) return

    setBoughtIn(true)

    const currentBtcClose = currentBtcData.close

    const transaction = {
      id: crypto.randomUUID(),
      type: 'buy',
      btcPrice: currentBtcClose,
      buyPrice: buyPrice,
      time: new Date(),
    }

    transactionHistoryHandler.prepend(transaction)

    const line = {
      drawTime: 'afterDatasetsDraw',
      type: 'line',
      scaleID: 'y',
      value: currentBtcClose,
      borderColor: '#a3e635',
      borderWidth: 2,
      label: {
        backgroundColor: '#a3e635',
        content: `BUY: $${currentBtcClose}`,
        display: true,
        position: 'start',
      },
    }

    ref?.current.config.options.plugins.annotation.annotations.pop()
    ref?.current.config.options.plugins.annotation.annotations.push(line)
    ref?.current.update('quiet')

    setCurrentBal(currentBal - buyPrice)
    setBuyPrice(100)
  }
  
  if (isLoading) return <div>Loading...</div>;

  function sellOut() {
    if (!boughtIn) return

    setBoughtIn(false)

    const lastTransaction = transactionHistory[0]

    const currentBtcClose = currentBtcData.close

    // 550+(((432.61-433.82)*450)+450)

    // current_bal + ( ( (current_btc_close - last_btc_close) * amount ) + amount )

    const newBal =
      currentBal +
      currentBtcClose * (lastTransaction.buyPrice / lastTransaction.btcPrice)

    const profit =
      currentBtcClose * (lastTransaction.buyPrice / lastTransaction.btcPrice) -
      lastTransaction.buyPrice

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
      label: {
        backgroundColor: '#f87171',
        content: `SELL: $${currentBtcClose}`,
        display: true,
        position: 'start',
      },
    }

    transactionHistoryHandler.prepend(transaction)

    ref?.current.config.options.plugins.annotation.annotations.pop()
    ref?.current.config.options.plugins.annotation.annotations.push(line)
    ref?.current.update('quiet')

    // console.log(ref?.current.config.options.plugins.annotation.annotations)

    setCurrentBal(newBal)
  }

  return (
    <div className='flex p-4'>
      <div className='flex flex-row w-full space-x-4'>
        <div className='flex flex-col w-full space-y-8'>
          <Modal 
            opened={opened} 
            overlayProps={{
                backgroundOpacity: 0.3,
                blur: 3
            }}
            styles={{
                header: {backgroundColor: '#2d2d2d'},
                content: {backgroundColor: '#2d2d2d'}
            }}
            centered
            onClose={user ? close : () => {}}
            withCloseButton={false}
          >
            <Stack align='center'>
              You must be logged to play.
              <Button component={Link} href='/api/auth/login' w={"33%"}>
                Login
              </Button>
            </Stack>
          </Modal>
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
                  disabled={!boughtIn}
                >
                  SELL
                </Button>
              </ButtonGroup>
              <NumberInput
                suffix='%'
                value={stopLoss}
                onChange={setStopLoss}
                allowNegative={false}
                hideControls
              />
              <NumberInput
                suffix='%'
                value={takeProfit}
                onChange={setTakeProfit}
                allowNegative={false}
                hideControls
              />
            </div>
            <p className='font-bold text-3xl'>
              Balance: ${currentBal.toFixed(2)}
            </p>
            <ScrollArea h={200}>
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
        <Divider orientation='vertical' color='darkgray' />
        <div className='w-1/3'>
          <Leaderboard />
        </div>
      </div>
    </div>
  )
}
