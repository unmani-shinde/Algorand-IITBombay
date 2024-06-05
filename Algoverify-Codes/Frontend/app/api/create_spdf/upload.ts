import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const formData = new FormData();
    formData.append('file', req.body.file);

    try {
      const response = await fetch('http://localhost:5000/issuer-page', {
        method: 'POST',
        body: formData,
        mode:'no-cors'
      });

      if (!response.ok) {
        throw new Error('Failed to process file');
      }

      console.log("Meow");
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
