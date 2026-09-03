import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { Router } from 'express';
import multer from 'multer';
import dayjs from 'dayjs';
import { query, insert, remove, updata } from '../utils/SQLPool.js';


const router = Router();
const markdownStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const dirPath = process.env.UPLOAD_DESTINATION + '/markdown'
      // const fileType = await fileTypeFromBuffer(file.buffer);
      fs.existsSync(dirPath) || fs.mkdirSync(dirPath, { recursive: true });
      cb(null, dirPath)
    } catch(e) {
      console.error('获取上传目录失败:', e);
      cb(e, null);
    }
  },
  filename: async (req, file, cb) => {
    try {
      const ext = file.originalname.split('.').pop();
      const filename = `${file.originalname.split('.')[0]}-${Math.random() * 1E9}.${ext}`;
      cb(null, filename);
      const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
      const uuid = Buffer.from(crypto.randomUUID().replace(/-/g, ''), 'hex');
      await insert(
      'article',
      {
        id: 0,
        title:filename,
        content: path.resolve(process.env.UPLOAD_DESTINATION + '/markdown', filename),
        type: 4, // 0-上传 1-创建 2-AI生成 4-原创 8-转载 16-翻译
        status: 2, // 0-私密 1-公开 2-草稿 4-发布 8-下线
        article_id: uuid,
        create_at: createdAt,
        update_at: createdAt
      }
    );
    } catch(e) {
      console.error('生成文件名失败:', e);
      cb(e, null);
    }
  }
})

const imageStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const dirPath = process.env.UPLOAD_DESTINATION + '/images'
      // const fileType = await fileTypeFromBuffer(file.buffer);
      fs.existsSync(dirPath) || fs.mkdirSync(dirPath, { recursive: true });
      cb(null, dirPath)
    } catch(e) {
      console.error('获取上传目录失败:', e);
      cb(e, null);
    }
  },
  filename: async (req, file, cb) => {
    try {
      const ext = file.originalname.split('.').pop();
      const filename = `${file.originalname.split('.')[0]}-${Math.random() * 1E9}.${ext}`;
      const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
      const uuid = Buffer.from(crypto.randomUUID().replace(/-/g, ''), 'hex');
      
      // 在 filename 回调中初始化 customData
      if (!req.customData) {
        req.customData = {};
      }
      
      await insert(
        'image_source',
        {
          id: 0,
          img_url: path.resolve(process.env.UPLOAD_DESTINATION + '/images', filename),
          img_name: filename,
          img_type: ext,
          img_size: file.size || 0,
          create_at: createdAt,
          update_at: createdAt,
          img_id: uuid
        }
      );
      
      // 存储 uuid 到 customData，便于后续在响应中使用
      req.customData.imageUuid = uuid;
      req.customData.type = 'image';
      
      cb(null, filename);
    } catch(e) {
      console.error('生成文件名失败:', e);
      cb(e, null);
    }
  }
})

const upload = multer({ storage: markdownStorage })
const uploadFile = upload.single('file')

const uploadImage = multer({ storage: imageStorage })
const uploadImageFile = uploadImage.single('file')

function uploadHandler(req, res) {
  if(req.errored) {
    return res.status(500).json({
      data: null,
      message: '上传失败',
      error: req.errored.message,
      code: 10001
    })
  } else {
    let data = 'ok'
    if(req.customData?.type === 'image') {
      data = {
        resourceUrl: '/api/v1/common/download?image_id=' + req.customData.imageUuid.toString('hex')
      }
    }
    return res.json({
      data,
      message: '上传成功',
      error: null,
      code: 200
    })
  }
}

router.post('/upload', uploadFile,uploadHandler)

router.post('/uploadImage', uploadImageFile, uploadHandler)

router.post('/detail', async (req, res) => {
  try {
    const { id } = req.body
    if (!id) {
      return res.status(400).json({
        data: null,
        message: '缺少文章ID',
        code: 10004
      })
    }
    const [results] = await query(`SELECT * FROM article WHERE id = ?`, [id])
    if (!results || results.length === 0) {
      return res.status(404).json({
        data: null,
        message: '文章不存在',
        code: 10004
      })
    }
    return res.json({
      data: results[0],
      message: '查询成功',
      error: null,
      code: 200
    })
  } catch(e) {
    console.error('查询文章详情失败：', e);
    return res.status(500).json({
      data: null,
      message: '查询文章详情失败',
      error: e.message,
      code: 10004
    })
  }
})

router.post('/list', async (req, res) => {
  try {
    const pageIndex = Number(req.body?.pageIndex) || 1
    const pageSize = Number(req.body?.pageSize) || 10
    const offset = (pageIndex - 1) * pageSize
    const [results, fields] = await query(`SELECT * FROM article WHERE is_deleted != 1 LIMIT ?, ?`, [offset, pageSize])
    const [countResults] = await query('SELECT COUNT(*) as count FROM article WHERE is_deleted = 0')
    return res.json({
      data: {
        result: results,
        total: countResults[0].count,
        currentPage: pageIndex,
        pageSize: pageSize
      },
      message: '查询成功',
      error: null,
      code: 200
    })
  } catch(e) {
    console.error('查询博客列表失败：', e);
    return res.status(500).json({
      data: null,
      message: '查询博客列表失败',
      error: e.message,
      code: 10001
    })
  }
})

router.post('/create', async (req, res) => {
  try {
    const { title, content } = req.body;
    const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const uuid = Buffer.from(crypto.randomUUID().replace(/-/g, ''), 'hex');
    const [result] = await insert(
      'article',
      {
        id: 0,
        title,
        content,
        is_deleted: 0,
        type: 5, // 0-上传 1-创建 2-AI生成 4-原创 8-转载 16-翻译
        status: 2, // 0-私密 1-公开 2-草稿 4-发布 8-下线
        article_id: uuid,
        create_at: createdAt,
        update_at: createdAt
      }
    );
    return res.json({
      data: 'ok',
      message: '博客创建成功',
      error: null,
      code: 200
    })
  } catch (e) {
    console.error('新建博客失败：', e);
    return res.status(500).json({
      data: '',
      err: '博客创建失败',
      message: null,
      code: 10002
    })
  }
})

router.post('/delete', async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({
        data: null,
        message: '缺少文章ID',
        code: 10003
      })
    }
    const [result] = await remove('article', { id })
    return res.json({
      data: 'ok',
      message: '博客删除成功',
      error: null,
      code: 200
    })
  } catch(e) {
    console.error('删除博客失败：', e);
    return res.status(500).json({
      data: '',
      err: '博客删除失败',
      message: null,
      code: 10003
    })
  }
})

router.post('/update', async (req, res) => {
  const { id, title, content, status } = req.body;
  try {
    const updateData = { update_at: dayjs().format('YYYY-MM-DD HH:mm:ss') }
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (status !== undefined) updateData.status = status
    
    const [result] = await updata('article', updateData, { id })
    return res.json({
      data: 'ok',
      message: '博客更新成功',
      error: null,
      code: 200
    })
  } catch(e) {
    console.error('更新博客失败：', e);
    return res.status(500).json({
      data: '',
      err: '博客更新失败',
      message: null,
      code: 10004
    })
  }
})

export default router;