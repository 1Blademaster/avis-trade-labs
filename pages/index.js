import RealtimeGraph from '@/components/realtimeGraph'
import { useInterval } from '@mantine/hooks'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const ref = useRef(null)
  const [t, setT] = useState(0)

  const interval = useInterval(() => {
    async function fetchPosts() {
      let res = await fetch('/api/hello')
      let returnedData = await res.json()
      const data = { x: Date.now(), y: t }
      ref?.current.data.datasets[0].data.push(data)
      console.log(data)
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
    </div>
  )
}
