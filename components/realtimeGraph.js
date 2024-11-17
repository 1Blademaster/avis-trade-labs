import ChartStreaming from '@robloche/chartjs-plugin-streaming'
import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Title,
} from 'chart.js'
import 'chartjs-adapter-moment'
import Annotation from 'chartjs-plugin-annotation'
import { forwardRef, useEffect, useState } from 'react'
import { Scatter } from 'react-chartjs-2'
ChartJS.register(
  Title,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartStreaming,
  Annotation
)

ChartJS.defaults.color = '#fafafa'

const options = {
  responsive: true,
  maintainAspectRatio: false,
  showLine: true,
  animation: false,
  interaction: {
    intersect: false,
  },
  plugins: {
    streaming: {
      duration: 20000,
      frameRate: 30,
    },
    annotation: {
      annotations: {},
    },
  },
  scales: {
    x: {
      type: 'realtime',
      duration: 20000,
      display: false,
    },
    y: {
      title: {
        display: true,
        text: 'Price ($)',
      },
    },
  },
  elements: {
    line: {
      borderWidth: 1,
    },
    point: {
      radius: 0,
      hitRadius: 0,
    },
  },
}

const RealtimeGraph = forwardRef(function RealtimeGraph({ datasetLabel }, ref) {
  const [chartData] = useState({
    datasets: [
      {
        label: datasetLabel,
        borderColor: '#fafafa',
        backgroundColor: '#fafafa',
        data: [],
      },
    ],
  })

  useEffect(() => {
    if (ref.current) {
      ref.current.data.datasets[0].label = datasetLabel
      ref.current.update('quiet')
    }
  }, [datasetLabel])

  return (
    <div className='rounded-lg w-full h-full'>
      <Scatter ref={ref} options={options} data={chartData} />
    </div>
  )
})

export default RealtimeGraph
