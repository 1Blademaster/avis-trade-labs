import { Table } from '@mantine/core'
import { useEffect, useState } from 'react';

const users = [
  { id: 1, username: 'Kush', totalProfit: 143663 },
  { id: 2, username: 'Julian', totalProfit: 32165 },
  { id: 3, username: 'Dan', totalProfit: 96 },
  { id: 4, username: 'Joe', totalProfit: -4132 },
  { id: 5, username: 'Mike', totalProfit: 123456 },
  { id: 6, username: 'John', totalProfit: 0 },
  { id: 7, username: 'Jane', totalProfit: 1234 },
  { id: 8, username: 'Emma', totalProfit: -2345 },
  { id: 9, username: 'Sarah', totalProfit: 654321 },
  { id: 10, username: 'David', totalProfit: 123 },
  { id: 11, username: 'Amy', totalProfit: 456789 },
  { id: 12, username: 'Olivia', totalProfit: -7890 },
  { id: 13, username: 'Sophia', totalProfit: 109876 },
  { id: 14, username: 'Ava', totalProfit: 23456 },
  { id: 15, username: 'Isabella', totalProfit: 987654 },
  { id: 16, username: 'Emily', totalProfit: -321 },
  { id: 17, username: 'Abigail', totalProfit: 654321 },
  { id: 18, username: 'Sofia', totalProfit: 987654 },
  { id: 19, username: 'Ethan', totalProfit: 1234567 },
  { id: 20, username: 'Emma', totalProfit: 876543 },
  { id: 21, username: 'Michael', totalProfit: 987654321 },
  { id: 22, username: 'Daniel', totalProfit: 123456789 },
  { id: 23, username: 'Olivia', totalProfit: -987654321 },
  { id: 24, username: 'Sophia', totalProfit: 123456789 },
].sort((a, b) => b.totalProfit - a.totalProfit)

export default function Leaderboard() {

  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const getLeaderboardData = async () => {

      let res = await fetch('/api/leaderboard/get');
      let tempLeaderboard = await res.json();
      setLeaderboardData(tempLeaderboard);
    }
    getLeaderboardData();
  }, [])

  function formatProfit(profit){
    return profit ? (profit < 0 ? "-£" + Math.abs(profit) : "£" + profit) : "";
  }

  const rowsDisplayed = 20;

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Place</Table.Th>
          <Table.Th>Username</Table.Th>
          <Table.Th>Total Profit</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {[...leaderboardData, ...(Array(rowsDisplayed - leaderboardData.length).fill({username: '', _id: '', profit: ''}))].map((user, idx) => {
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
              <Table.Td key={`idx${idx}`}>{idx + 1}</Table.Td>
              <Table.Td key={`username${idx}`}>{user.username}</Table.Td>
              <Table.Td key={`profit${idx}`}>{formatProfit(user.profit)}</Table.Td>
            </Table.Tr>
          )
        })}

      </Table.Tbody>
    </Table>
  )
}
