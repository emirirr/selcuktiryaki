import { getKurlar } from '../dökümanlar/lib/tcmb-kurlar.mjs';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const data = await getKurlar();
    res.status(200).json(data);
  } catch (e) {
    res.status(502).json({ error: e.message || 'TCMB alinamadi' });
  }
}
