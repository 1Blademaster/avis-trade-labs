import RealtimeGraph from '@/components/realtimeGraph'
import { Button, Modal, Overlay, Stack } from '@mantine/core'
import { useDisclosure, useInterval } from '@mantine/hooks'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

import { useUser } from '@auth0/nextjs-auth0/client'

export default function Home() {
  const ref = useRef(null)
  const [t, setT] = useState(0)
  const REQUIRE_LOGIN = true; // false for dev

  const {user, error, isLoading } = useUser();
  const [opened, {open, close}] = useDisclosure(REQUIRE_LOGIN && !user);
  

  const interval = useInterval(() => {
    async function fetchPosts() {
        let res = await fetch('/api/hello')
      let returnedData = await res.json()
      const data = { x: Date.now(), y: t }
      ref?.current.data.datasets[0].data.push(data)
      //console.log(data)
      ref?.current.update('quiet')
      setT((prev) => prev + 1)
    }
    fetchPosts()
  }, 1000)

  useEffect(() => {
    if (!user)
        return
    var axios = require("axios").default;

    var options = {
      method: 'GET',
      url: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users`,
      params: {q: `email:"${user.email}"`, search_engine: 'v3'},
      headers: {authorization: `Bearer ${process.env.AUTH0_MGMT_TOKEN}`}
    };
    
    axios.request(options).then(function (response) {
      console.log(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }, [user])

  /* useEffect(() => {
    interval.start()
    return interval.stop
  }, []) */

  return (
    <div className='h-full'>
      <RealtimeGraph ref={ref} datasetLabel={'BTC'} lineColor={'#ff0000'} />
      <Modal 
        opened={opened} 
        overlayProps={{
            backgroundOpacity: 0.3,
            blur: 3
        }}
        styles={{
            header: {backgroundColor: '#2d2d2d'},
            content: {backgroundColor: '#2d2d2d'}
        }}
        centered
        onClose={user ? close : () => {}}
        withCloseButton={false}
      >
        <Stack align='center'>
            You must be logged to gamble.
            <Button component={Link} href='/api/auth/login' w={"33%"}>
                Login
            </Button>
        </Stack>
      </Modal>
    </div>
  )
}
