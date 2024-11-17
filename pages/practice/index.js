import { useUser } from '@auth0/nextjs-auth0/client'
import { Badge, Button, Card, Group, Overlay, Text } from '@mantine/core'
import { useState } from 'react'

export default function Practice() {
  const [showOverlay, setOverlay] = useState(false)
  const { user, error, isLoading } = useUser()

  let cardDescriptions = [
    {
      title: 'Free Practice 1',
      color: 'green',
      badge: 'Beginner',
      description:
        'A beginner practice mode based of ETH from 2017-2024. Time moves at 5 seconds per day and a starting balance of $10000.',
      link: '/practice/beginner',
      target: 500,
    },
    {
      title: 'Free Practice 2',
      color: 'orange',
      badge: 'Intermediate',
      description:
        'An intermediate practice mode based of BTC from 2014-2024. Time moves at 5 seconds per day and a starting balance of $1000.',
      link: '/practice/intermediate',
      target: 1000,
    },
    {
      title: 'Free Practice 3',
      color: 'red',
      badge: 'hard',
      description:
        'A difficult practice mode based of BTC from 2014-2024. Time moves at 5 seconds per day and a starting balance of $100. Go big or go home...',
      link: '/practice/hard',
      target: 1000,
    },
  ]

  function checkRedirect(link) {
    if (user) {
      window.location.href = link
    } else {
      setOverlay(true)
    }
  }

  const cards = cardDescriptions.map((card) => {
    return (
      <Card
        shadow='sm'
        padding='lg'
        radius='md'
        withborder={true}
        className='bg-slate-800 w-96'
        key={card.title}
      >
        <Group position='apart' mt='md' mb='xs'>
          <Text weight={500} className='text-white'>
            {card.title}
          </Text>
          <Badge color={card.color} variant='light'>
            {card.badge}
          </Badge>
          <Badge color='pink' variant='outline'>
            Target: ${card.target}
          </Badge>
        </Group>

        <Text size='sm' color='dimmed'>
          {card.description}
        </Text>

        <Button
          variant='light'
          color='blue'
          fullWidth
          mt='md'
          radius='md'
          onClick={() => {
            checkRedirect(card.link)
          }}
        >
          Practice Now
        </Button>
      </Card>
    )
  })

  return (
    <>
      <Overlay
        color='#000'
        backgroundOpacity={0.35}
        blur={15}
        hidden={!showOverlay}
      >
        <div className='flex flex-col items-center justify-center w-1/3 h-full mx-auto space-y-4 text-center'>
          <p>You need to be logged in to access practice modes.</p>
          <div className='flex flex-row items-center gap-x-4'>
            <Button
              onClick={() => {
                setOverlay(false)
              }}
              className='w-32 text-xl'
              variant='light'
            >
              Close
            </Button>
            or
            <Button
              onClick={() => {
                window.location.href = '/api/auth/login'
              }}
              className='w-32 text-xl'
            >
              Login
            </Button>
          </div>
        </div>
      </Overlay>

      <div className='h-screen overflow-x-hidden'>
        <div className='flex h-[90%] items-center justify-center gap-x-8 w-screen'>
          {cards}
        </div>
      </div>
    </>
  )
}
