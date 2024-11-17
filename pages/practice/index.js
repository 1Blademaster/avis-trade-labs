import { Card, Text, Button, Group, Badge } from "@mantine/core"

export default function Practice() {
  let cardDescriptions = [
    {
      "title": "Free Practice 1",
      "color": "green",
      "badge": "Beginner",
      "description": "A beginner practice mode based of ETH from 2017-2024. Time moves at 5 seconds per day and a starting balance of $1000.",
      "link": "https://google.com"
    },
    {
      "title": "Free Practice 2",
      "color": "orange",
      "badge": "Intermediate",
      "description": "A beginner practice mode based of BTC from 2014-2024. Time moves at 5 seconds per day and a starting balance of $500.",
      "link": "https://google.com"
    }
  ]

  const cards = cardDescriptions.map((card) => {
    return (
      <Card shadow="sm" padding="lg" radius="md" withborder key={card.title} className="bg-slate-800 w-80">
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500} className="text-white">{card.title}</Text>
          <Badge color={card.color} variant="light">
            {card.badge}
          </Badge>
        </Group>

        <Text size="sm" color="dimmed">
          {card.description}
        </Text>

        <Button variant="light" color="blue" fullWidth mt="md" radius="md">
          <a href={card.link}>
            Practice Now
          </a>
        </Button>
      </Card>
    )
  })

  return (
    <div className="overflow-x-hidden h-screen">
      <div className="flex w-screen h-[80%] items-center justify-center gap-x-8 w-3/4 m-4">
        {cards}
      </div>
    </div>
  )
}