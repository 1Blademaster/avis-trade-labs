import { useUser } from '@auth0/nextjs-auth0/client';
import { Group, Menu, UnstyledButton } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import Link from 'next/link'
import { useEffect, useState } from 'react';

export default function Navbar() {

  const {user, isLoading, err} = useUser();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (!user)
      return;
    // Get user data like username etc.
    const getUserData = async () => {
      // Google auth are not stored in our database so their username is just the email address
      if (user.sub.startsWith('google-oauth2')){
        user.username = user.email.split('@')[0]
      }else{
        let res = await fetch('/api/user/' + user.sub.split('|')[1]);
        let tempUserData = await res.json()
        user.username = tempUserData.username;
        user._id = tempUserData._id;
      }
      setUserData(user);
    }
    getUserData();
    close();
  }, [user])

  return (
    <div className="flex flex-row items-center justify-between px-8 py-4 bg-slate-800">
      <Link href="/">
        <h1 className="text-3xl font-bold hover:cursor-pointer text-[#2ae841]">
          Avis Trade Labs
        </h1>
      </Link>
      <div className="flex flex-row gap-x-8">
        <Link href='/'>Play</Link>
        <Link href='/practice'>Practice</Link>
        <Link href='/about'>About</Link>
        { !isLoading && !user ? <Link href="/api/auth/login">Log In</Link> :
          <Menu>
            <Menu.Target>
              <UnstyledButton>
                <Group justify='space-around'>
                  { isLoading ? "Loading" : (userData ? userData.username : "Log In")}
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
        }
      </div>
    </div>
  );
}
