import { Table } from '@mantine/core'
import { useInterval } from '@mantine/hooks'
import { useEffect, useState } from 'react'

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([])

  const getLeaderboardData = async () => {
    let res = await fetch('/api/leaderboard/get')
    let tempLeaderboard = await res.json()
    setLeaderboardData(tempLeaderboard)
  }

  useEffect(() => {
    getLeaderboardData()
  }, [])

  useInterval(() => {
    getLeaderboardData();
  }, 100, {autoInvoke: true})

  function formatProfit(profit) {
    return profit
      ? profit < 0
        ? '-$' + Math.abs(profit).toFixed(2)
        : '$' + profit.toFixed(2)
      : ''
  }

  const rowsDisplayed = 20

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Place</Table.Th>
          <Table.Th>Username</Table.Th>
          <Table.Th>Total Profit</Table.Th>
          <Table.Th>Last Trade</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {[
          ...leaderboardData,
          ...Array(rowsDisplayed - leaderboardData.length).fill({
            username: '',
            _id: '',
            profit: '',
          }),
        ].map((user, idx) => {
          var podiumClassName = ''

          if (idx === 0) {
            podiumClassName = 'bg-amber-300/50'
          } else if (idx === 1) {
            podiumClassName = 'bg-green-300/50'
          } else if (idx === 2) {
            podiumClassName = 'bg-blue-300/50'
          }

          return (
            <Table.Tr key={`tr${idx}`} className={podiumClassName}>
              <Table.Td>{idx + 1}</Table.Td>
              <Table.Td>{user.username}</Table.Td>
              <Table.Td>{formatProfit(user.profit)}</Table.Td>
              <Table.Td>{user.last_trade ? formatProfit(user.last_trade.profit) : '-'}</Table.Td>
            </Table.Tr>
          )
        })}
      </Table.Tbody>
    </Table>
  )
}
