import Leaderboard from '@/components/leaderboard'
import RealtimeGraph from '@/components/realtimeGraph'
import {
  Button,
  ButtonGroup,
  Divider,
  NumberInput,
  ScrollArea,
  Table,
} from '@mantine/core'
import { useInterval, useListState } from '@mantine/hooks'
import { useEffect, useRef, useState } from 'react'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../tailwind.config.js'

const tailwindColors = resolveConfig(tailwindConfig).theme.colors

export default function Home() {
  const ref = useRef(null)
  const scrollareaViewportRef = useRef(null)

  const [currentBtcData, setCurrentBtcData] = useState(null)

  const [buyPrice, setBuyPrice] = useState(100)
  const [currentBal, setCurrentBal] = useState(1000)
  const [boughtIn, setBoughtIn] = useState(false)
  const [stopLoss, setStopLoss] = useState(20)
  const [takeProfit, setTakeProfit] = useState(20)

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

  useEffect(() => {
    scrollareaViewportRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [transactionHistory])

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
      borderColor: tailwindColors.lime[500],
      borderWidth: 2,
      label: {
        backgroundColor: tailwindColors.lime[500],
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
      borderColor: tailwindColors.red[500],
      borderWidth: 2,
      label: {
        backgroundColor: tailwindColors.red[500],
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
                  color={tailwindColors.lime[500]}
                  className='w-full'
                  onClick={buyIn}
                  disabled={currentBal < buyPrice || boughtIn}
                >
                  BUY
                </Button>
                <Button
                  variant='filled'
                  color={tailwindColors.red[500]}
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
            <ScrollArea
              h={200}
              viewportRef={scrollareaViewportRef}
              className='!ml-auto w-2/5'
            >
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Time</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Buy price</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Profit</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {transactionHistory.map((transaction) => {
                    if (transaction.type === 'buy') {
                      return (
                        <Table.Tr
                          key={transaction.id}
                          className='bg-green-300/50'
                        >
                          <Table.Td>
                            {new Date(transaction.time).toLocaleTimeString()}
                          </Table.Td>
                          <Table.Td>BUY</Table.Td>
                          <Table.Td>
                            ${transaction.btcPrice.toFixed(2)}
                          </Table.Td>
                          <Table.Td>
                            ${transaction.buyPrice.toFixed(2)}
                          </Table.Td>
                          <Table.Td></Table.Td>
                        </Table.Tr>
                      )
                    } else {
                      return (
                        <Table.Tr
                          key={transaction.id}
                          className='bg-red-300/50'
                        >
                          <Table.Td>
                            {new Date(transaction.time).toLocaleTimeString()}
                          </Table.Td>
                          <Table.Td>SELL</Table.Td>
                          <Table.Td>
                            ${transaction.btcPrice.toFixed(2)}
                          </Table.Td>
                          <Table.Td>
                            ${transaction.buyPrice.toFixed(2)}
                          </Table.Td>
                          <Table.Td>${transaction.profit.toFixed(2)}</Table.Td>
                        </Table.Tr>
                      )
                    }
                  })}
                </Table.Tbody>
              </Table>
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
