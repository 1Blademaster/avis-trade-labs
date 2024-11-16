import { btcClose } from '@/engine/engine'

export default function handler(req, res) {
  res.status(200).json({ close: btcClose })
}
