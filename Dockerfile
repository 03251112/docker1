# 使用 Puppeteer 官方镜像作为基础镜像
FROM ghcr.io/puppeteer/puppeteer:latest

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY . .

# 安装依赖
RUN npm install --production

# 暴露端口（Cloud Run 会自动分配端口）
EXPOSE 8080

# 启动命令
CMD ["node", "index.js"]