// @ts-nocheck
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not configured');
}
const secret = process.env.JWT_SECRET;

// 设置 token 过期时间
const option = {
  expiresIn: '1d', // 过期时间可以是数字（单位为秒），或者字符串（eg: '2hours'、'10s'等）
  algorithm: 'HS256',
};

export function generateToken(username) {
  const payload = { username };
  return jwt.sign(payload, secret, option);
}

export function authenticateToken(req, res, next) {
  if ([
    "/v1/login",
    "/v1/getPubKey",
    "/v1/common/download",
  ].includes(req.url.split('?')[0])) {
    // 登录及获取密钥的时候不校验token
    return next();
  }

  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // 获取Bearer后面的token值
    try {
      // 显式声明算法为 HS256，避免算法混淆攻击
      const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
      res.user = decoded;
      next();
    } catch (e) {
      return res
        .status(401)
        .json({ message: "Unauthorization: Invalid Token" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "Unauthrization: No Token Provide" });
  }
}
