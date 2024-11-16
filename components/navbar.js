import { useUser } from '@auth0/nextjs-auth0/client'
import { Button, Group, Menu, UnstyledButton } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import Link from 'next/link'

export default function Navbar() {

  const {user, isLoading, err} = useUser();

  return (
    <div className='flex flex-row justify-center items-center space-x-8 py-4 bg-slate-800'>
      <Link href='/'>
        <h1 className='text-3xl font-bold hover:cursor-pointer text-[#2ae841]'>
          Avis Trade Labs
        </h1>
      </Link>
      <Link href='/'>Play</Link>
      <Link href='/practice'>Practice</Link>
      <Link href='/about'>About</Link>
      <Menu>
        <Menu.Target>
          <UnstyledButton>
            <Group justify='space-around'>
              { isLoading ? "Loading" : (user ? user.email : "Log In")}
              <IconChevronDown size="1rem"/>
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item component={Link} href="/api/auth/logout">
            Sign Out
          </Menu.Item>
        </Menu.Dropdown>    
      </Menu>
    </div>
  )
}
