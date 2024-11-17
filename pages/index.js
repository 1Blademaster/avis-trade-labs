import Bonsai from '@/components/bonsai.js'
import Leaderboard from '@/components/leaderboard'
import RealtimeGraph from '@/components/realtimeGraph'

import { useUser } from '@auth0/nextjs-auth0/client'
import {
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  Modal,
  NumberInput,
  Paper,
  ScrollArea,
  Stack,
  Table,
  Tooltip,
} from '@mantine/core'
import { useDisclosure, useInterval, useListState } from '@mantine/hooks'
import Link from 'next/link.js'
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
  const [stopLossEnabled, setStopLossEnabled] = useState(false)
  const [takeProfitEnabled, setTakeProfitEnabled] = useState(false)
  const [stopLoss, setStopLoss] = useState(20)
  const [takeProfit, setTakeProfit] = useState(20)

  const REQUIRE_LOGIN = false
  const { user, error, isLoading } = useUser()
  const [opened, { open, close }] = useDisclosure(REQUIRE_LOGIN && !user)

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

  useEffect(() => {
    const balanceLabel = {
      drawTime: 'afterDatasetsDraw',
      type: 'label',
      yValue: (context) => context.chart.scales.y.max,
      xValue: 'center',
      position: {
        y: 'start',
      },
      padding: '10',
      content: [`Balance: $${currentBal.toFixed(2)}`],
      color: tailwindColors.slate[100],
      font: {
        size: 28,
        weight: 'bold',
      },
      borderRadius: 5,
    }

    ref.current.config.options.plugins.annotation.annotations['balanceLabel'] =
      balanceLabel
    ref?.current.update('quiet')
  }, [currentBal])

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

    delete ref.current.config.options.plugins.annotation.annotations['sellLine']
    ref.current.config.options.plugins.annotation.annotations['buyLine'] = line
    ref?.current.update('quiet')

    setCurrentBal(currentBal - buyPrice)
    setBuyPrice(100)
  }

  function sellOut() {
    if (!boughtIn) return

    setBoughtIn(false)

    const lastTransaction = transactionHistory[0]

    const currentBtcClose = currentBtcData.close

    const newBal =
      currentBal +
      currentBtcClose * (lastTransaction.buyPrice / lastTransaction.btcPrice)

    const profit =
      currentBtcClose * (lastTransaction.buyPrice / lastTransaction.btcPrice) -
      lastTransaction.buyPrice

    const transaction = {
      id: crypto.randomUUID(),
      type: 'sell',
      btcPrice: currentBtcClose,
      buyPrice: lastTransaction.buyPrice,
      profit: profit,
      time: new Date(),
    }

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

    delete ref.current.config.options.plugins.annotation.annotations['buyLine']
    ref.current.config.options.plugins.annotation.annotations['sellLine'] = line
    ref?.current.update('quiet')

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
              blur: 3,
            }}
            styles={{
              header: { backgroundColor: '#2d2d2d' },
              content: { backgroundColor: '#2d2d2d' },
            }}
            centered
            onClose={user ? close : () => {}}
            withCloseButton={false}
          >
            <Stack align='center'>
              You must be logged to play.
              <Button component={Link} href='/api/auth/login' w={'33%'}>
                Login
              </Button>
            </Stack>
          </Modal>
          <div className='h-3/4'>
            <RealtimeGraph ref={ref} datasetLabel={'BTC'} />
          </div>
          <div className='flex flex-row space-x-8'>
            <div className='flex flex-col space-y-4 w-52'>
              <Paper shadow='xs' p='sm' className='bg-slate-800'>
                <p className='mb-2'>Buy Amount</p>
                <NumberInput
                  prefix='$'
                  value={buyPrice}
                  onChange={setBuyPrice}
                  allowNegative={false}
                  min={1}
                  hideControls
                  className='mb-2'
                />
                <ButtonGroup className='w-full'>
                  <Button
                    variant='filled'
                    color='#a3e635'
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
              </Paper>

              <Paper shadow='xs' p='sm' className='bg-slate-800'>
                <p className='mb-2'>Take Profit</p>
                <div className='flex flex-row items-center space-x-2'>
                  <Tooltip label='Take Profit'>
                    <Checkbox
                      color='lime'
                      checked={takeProfitEnabled}
                      onChange={(e) =>
                        setTakeProfitEnabled(e.currentTarget.checked)
                      }
                    />
                  </Tooltip>
                  <NumberInput
                    suffix='%'
                    value={takeProfit}
                    onChange={setTakeProfit}
                    allowNegative={false}
                    disabled={!takeProfitEnabled}
                    hideControls
                  />
                </div>
              </Paper>

              <Paper shadow='xs' p='sm' className='bg-slate-800'>
                <p className='mb-2'>Stop Loss</p>
                <div className='flex flex-row items-center space-x-2'>
                  <Tooltip label='Stop Loss'>
                    <Checkbox
                      color='#a3e635'
                      checked={stopLossEnabled}
                      onChange={(e) =>
                        setStopLossEnabled(e.currentTarget.checked)
                      }
                    />
                  </Tooltip>
                  <NumberInput
                    suffix='%'
                    value={stopLoss}
                    onChange={setStopLoss}
                    disabled={!stopLossEnabled}
                    allowNegative={false}
                    hideControls
                  />
                </div>
              </Paper>
            </div>

            <div>
              <Bonsai></Bonsai>
            </div>

            <div className='flex flex-col gap-y-4 !ml-auto w-11/12'>
              <ScrollArea h={200} viewportRef={scrollareaViewportRef}>
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
                            <Table.Td>
                              ${transaction.profit.toFixed(2)}
                            </Table.Td>
                          </Table.Tr>
                        )
                      }
                    })}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            </div>
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
