import RealtimeGraph from '@/components/realtimeGraph'
import { Modal, Overlay } from '@mantine/core'
import { useDisclosure, useInterval } from '@mantine/hooks'
import { useEffect, useRef, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function Home() {
  const ref = useRef(null)
  const [t, setT] = useState(0)

  const {user, error, isLoading } = useUser();
  const [opened, {open, close}] = useDisclosure();

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
    interval.start()
    return interval.stop
  }, [])

  return (
    <div className='h-full'>
      <RealtimeGraph ref={ref} datasetLabel={'BTC'} lineColor={'#ff0000'} />
      <Modal 
        opened={!user} 
        title="Authentication" 
        overlayProps={{
            backgroundOpacity: 0.3,
            blur: 3
        }}
        bg={"blue"}
        centered
        onClose={user ? close : () => {}}
        withCloseButton={false}
      >
        {/* Modal content */}
      </Modal>
    </div>
  )
}
