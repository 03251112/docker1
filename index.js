import express from 'express';
import puppeteer from 'puppeteer';
import { Storage } from '@google-cloud/storage';
import fs from 'fs/promises';
import path from 'path';
const app = express();
const storage = new Storage();

const bucketName = 'test_lucky'; // 替换为你的 Google Cloud Storage bucket 名称
app.use('/screenshots', express.static(path.join(process.cwd(), 'screenshots')));


app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello ${name}!`);
});

app.post('/p', (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`p ${name}!`);
});

app.post('/screenshot', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium-browser", // 指定 Chromium 路径
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true  // 忽略 HTTPS 错误

    });
    const page = await browser.newPage();

    // 设置视窗大小为 1920x1080
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });
    await page.goto("https://example.com"); // 访问目标页面
    

    const screenshot = await page.screenshot();

    await browser.close();

      // 保存到本地文件系统
    const localDir = path.join(process.cwd(), 'screenshots');
    await fs.mkdir(localDir, { recursive: true });
    const localFilename = `screenshot-${Date.now()}.png`;
    const localPath = path.join(localDir, localFilename);
    await fs.writeFile(localPath, screenshot);

    const publicUrl = `${req.protocol}://${req.get('host')}/screenshots/${localFilename}`;
    res.json({ url: publicUrl });
    
    // const bucket = storage.bucket(bucketName);
    // const filename = `screenshot-${Date.now()}.png`;
    // const file = bucket.file(filename);

    // await file.save(screenshot, {
    //   metadata: {
    //     contentType: 'image/png',
    //   },
    // });

    // const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
    // res.json({ url: 'publicUrl' });
  } catch (error) {
    console.error('Screenshot error:', error);
    res.status(500).json({ error: error.message });
  }
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});