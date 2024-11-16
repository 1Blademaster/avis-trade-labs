import ChartStreaming from '@robloche/chartjs-plugin-streaming'
import {
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from 'chart.js'
import 'chartjs-adapter-moment'
import { forwardRef, useEffect, useState } from 'react'
import { Scatter } from 'react-chartjs-2'
ChartJS.register(
  Title,
  Legend,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  ChartStreaming
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
    legend: {
      position: 'top',
    },
    streaming: {
      duration: 20000,
      frameRate: 30,
    },
    annotation: {
      annotations: {
        line: {
          drawTime: 'afterDatasetsDraw',
          type: 'line',
          scaleID: 'y',
          value: 430,
          borderColor: 'black',
          borderWidth: 5,
          label: {
            backgroundColor: 'red',
            content: 'Test Label',
            enabled: true,
          },
        },
      },
    },
  },
  scales: {
    x: {
      type: 'realtime',
      duration: 20000,
    },
  },
  elements: {
    line: {
      borderWidth: 1,
    },
    point: {
      radius: 0,
      hitRadius: 10,
    },
  },
}

const RealtimeGraph = forwardRef(function RealtimeGraph(
  { datasetLabel, lineColor },
  ref
) {
  const [chartData] = useState({
    datasets: [
      {
        label: datasetLabel,
        borderColor: 'white',
        backgroundColor: 'white',
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
    <div className='p-8 rounded-lg w-full h-full'>
      <Scatter ref={ref} options={options} data={chartData} />
    </div>
  )
})

export default RealtimeGraph
