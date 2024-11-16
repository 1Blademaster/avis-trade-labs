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
    }
    fetchPosts()
  }, 100)

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
  }, [])

  return (
    <div className='h-full'>
      <RealtimeGraph ref={ref} datasetLabel={'BTC'} lineColor={'#ff0000'} />
    </div>
  )
}
