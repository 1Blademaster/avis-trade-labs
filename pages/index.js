import RealtimeGraph from '@/components/realtimeGraph'
import { useInterval } from '@mantine/hooks'
import { useEffect, useRef } from 'react'

export default function Home() {
  const ref = useRef(null)

  const interval = useInterval(() => {
    async function fetchPosts() {
      let res = await fetch('/api/hello')
      let btcData = await res.json()
      if (btcData.time === null) return

      const data = { x: Date.now(), y: btcData.close }
      ref?.current.data.datasets[0].data.push(data)
      console.log(data)
      ref?.current.update('quiet')
    }
    fetchPosts()
  }, 100)

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
