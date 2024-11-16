import { Table } from '@mantine/core'

const users = [
  { id: 1, username: 'Kush', totalProfit: 143663 },
  { id: 1, username: 'Julian', totalProfit: 32165 },
  { id: 1, username: 'Dan', totalProfit: 96 },
  { id: 1, username: 'Joe', totalProfit: -4132 },
]

export default function Leaderboard() {
  const rows = users.map((user, idx) => {
    var podiumClassName = ''

    if (idx === 0) {
      podiumClassName = 'bg-yellow-300/50'
    } else if (idx === 1) {
      podiumClassName = 'bg-green-300/50'
    } else if (idx === 2) {
      podiumClassName = 'bg-blue-300/50'
    }

    return (
      <Table.Tr key={user.id} className={podiumClassName}>
        <Table.Td>{idx + 1}</Table.Td>
        <Table.Td>{user.username}</Table.Td>
        <Table.Td>${user.totalProfit}</Table.Td>
      </Table.Tr>
    )
  })

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Place</Table.Th>
          <Table.Th>Username</Table.Th>
          <Table.Th>Total Profit</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  )
}
