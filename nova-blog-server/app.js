import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

// 先加载 .env，避免后面的业务模块在顶层读取 process.env 时为 undefined
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '.env');
const dotenvResult = dotenv.config({ path: envPath });
if (dotenvResult.error) {
  console.warn(`[dotenv] failed to load ${envPath}: ${dotenvResult.error.message}`);
}

// dotenv 加载完成后再动态 import 业务模块，确保 JWT_SECRET 等环境变量可用
const express = (await import('express')).default;
const { authenticateToken } = await import('./middleware/auth.js');
const authRouter = (await import('./router/auth.js')).default;
const blogRouter = (await import('./router/blog.js')).default;
const commonRouter = (await import('./router/common.js')).default;

const app = express();
app.use(express.json());
app.use(authenticateToken);
app.use('/v1', authRouter);
app.use('/v1/blog', blogRouter);
app.use('/v1/common', commonRouter);

app.listen(process.env.EXPRESS_APP_PROT, () => {
    console.log(`Server is running on port ${process.env.EXPRESS_APP_PROT}`);
});
