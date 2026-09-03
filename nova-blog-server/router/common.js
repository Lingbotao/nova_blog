import e, { Router } from 'express';
import { query } from '../utils/SQLPool.js';

const router = Router();

router.get('/download', async (req, res) => {
  const imageId = req.query.image_id
  if (!imageId || typeof imageId !== 'string') {
    return res.status(400).json({ data: null, message: '缺少image_id', code: 400 })
  }

  const [results] = await query('SELECT img_url, img_name FROM image_source WHERE img_id = ?', [Buffer.from(imageId, 'hex')]);
  
  if(results.length === 0) {
    return res.status(404).json({
      data: null,
      message: '图片不存在',
      error: null,
      code: 10002
    })
  }

  const { img_url, img_name } = results[0];
  res.download(
    img_url,
    img_name,
    {
      root: '/',
      'headers': { 'content-type': 'application/octet-stream' }
    },
    (err) => {
      if (!err) return; // file sent
      res.statusCode = 404;
      res.json({
        data: null,
        message: '图片不存在',
        error: null,
        code: 10002
      })
    }
  )
})

export default router;