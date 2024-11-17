import { Avatar, Paper } from '@mantine/core'
import Link from 'next/link'

const githubs = [
  {
    name: 'Julian Jones',
    github: 'https://github.com/nexinfinite',
    avatar: 'https://avatars.githubusercontent.com/u/37962677?v=4',
  },
  {
    name: 'Kush Makkapati',
    github: 'https://github.com/1blademaster',
    avatar: 'https://avatars.githubusercontent.com/u/39247152?v=4',
  },
  {
    name: 'Joe Paton',
    github: 'https://github.com/jopat2409',
    avatar: 'https://avatars.githubusercontent.com/u/75854642?v=4',
  },
  {
    name: 'Dan Pickford',
    github: 'https://github.com/dp1ckford',
    avatar: 'https://avatars.githubusercontent.com/u/50546830?v=4',
  },
]

export default function About() {
  return (
    <div className='container mx-auto space-y-8'>
      <h1 className='pt-8 text-2xl text-center'>About Us</h1>
      <p className='text-center w-1/2 mx-auto'>
        We are a group of drone engineers from Avis Drone labs, a student-led
        UAV team at the University of Sheffield. In 22 hours we developed a
        trading platform that uses historical Bitcoin data to create a game in
        which players can compete for a spot on a global leaderboard based on
        how much profit they make on trades, with the end goal of growing our
        shared money tree as high as possible.
      </p>
      <div className='mx-auto w-full flex flex-row space-x-8 justify-center'>
        {githubs.map((github) => (
          <Paper
            key={github.github}
            shadow='xs'
            p='sm'
            className='bg-slate-800 w-40 flex flex-col items-center justify-center space-y-8 hover:text-lime-400 transition-colors duration-300'
            component={Link}
            href={github.github}
            target='_blank'
          >
            <Avatar src={github.avatar} size={130} />
            <p className='text-lg'>{github.name}</p>
          </Paper>
        ))}
      </div>
    </div>
  )
}
