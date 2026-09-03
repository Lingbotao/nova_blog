import express from 'express';
import { generateToken } from '../middleware/auth.js';
import { decrypt, getPublicKeyPem } from '../utils/auth.js';

const router = express.Router();

router.get('/getPubKey', (req, res) => {
  res.set('Content-Type', 'application/x-pem-file');
  const pub_key = getPublicKeyPem();
  return res.send({
    data: { pub_key },
    err: null,
    message: 'success',
    code: 200
  })
})

router.post('/login', (req, res) => {
  try {
    const { username, password } = decrypt(req.body)
    res.set('Content-Type', 'application/json');
    if(username === 'admin' && password === 'admin') {
      const token = generateToken(username)
      res.cookie('x-auth-token', token, { sameSite: 'lax', path: '/'})
      return res.json({
        data: token,
        err: null,
        message: 'success',
        code: 200
      })
    }

    return res.send({
      data: '',
      err: '没有找到用户',
      message: null,
      code: 10034
    })
  } catch (error) {
    return res.send({
      data: '',
      err: error.message,
      message: null,
      code: 10035
    })
  }
})

export default router;