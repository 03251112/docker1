import express from "express"
import puppeteer from "puppeteer"
import { Storage } from "@google-cloud/storage"
import fs from "fs/promises"
import path from "path"

const app = express()

app.use("/screenshots", express.static(path.join(process.cwd(), "screenshots")))

app.get("/", (req, res) => {
  const name = process.env.NAME || "W112orld"
  res.send(`Hello ${name}!`)
})

app.get("/screenshot", async (req, res) => {
  try {
    const targetUrl = req.query.url || "https://example.com"
    console.log(req.query)
    const browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-web-security",
        "--disable-features=IsolateOrigins,site-per-process",
        "--ignore-certificate-errors",
        "--ignore-certificate-errors-spki-list",
        "--allow-insecure-localhost",
        "--disable-notifications",
        `--unsafely-treat-insecure-origin-as-secure=${targetUrl}`,
      ],
      headless: false, // 使用新的 Headless 模式
      ignoreHTTPSErrors: true, // 忽略 HTTPS 错误
    })
    const page = await browser.newPage()
    // 设置用户代理
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )

    // 设置额外的请求头
    await page.setExtraHTTPHeaders({
      "Accept-Language": "zh-CN,zh;q=0.9",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    })

    // 禁用内容安全策略
    await page.setBypassCSP(true)
    // 处理所有安全警告对话框
    page.on("dialog", async (dialog) => {
      await dialog.accept()
    })
    // 设置视窗大小为 1920x1080
    await page.setViewport({
      width: 1920,
      height: 1080,
      // deviceScaleFactor: 2,
    })
    await page.goto(targetUrl) // 访问目标页面
    await page.waitForSelector('textarea[name="q"]')
    await page.type('textarea[name="q"]', "新闻")
    await page.keyboard.press("Enter")
    await page.waitForSelector("#search")

    const screenshot = await page.screenshot()
    // 截取全屏截图
    await page.screenshot({
      type: "jpeg",
      fullPage: true,
    })

    // await browser.close()

    // 保存到本地文件系统
    const localDir = path.join(process.cwd(), "screenshots")
    await fs.mkdir(localDir, { recursive: true })
    const localFilename = `screenshot-${Date.now()}.jpg`
    const localPath = path.join(localDir, localFilename)
    await fs.writeFile(localPath, screenshot)

    const publicUrl = `${req.protocol}://${req.get(
      "host"
    )}/screenshots/${localFilename}`

    res.json({ url: publicUrl })
  } catch (error) {
    console.error("Screenshot error:", error)
    res.status(500).json({ error: error.message })
  }
})

const port = parseInt(process.env.PORT) || 8080
app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`)
})
