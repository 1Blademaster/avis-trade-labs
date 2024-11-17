import { btcData } from '@/instrumentation'

export default function handler(req, res) {
  res.status(200).json(btcData)
}
