# 使用官方 Node.js 基础镜像
FROM node:16-slim

# 安装必要的系统依赖
RUN apt-get update && \
    apt-get install -y wget gnupg ca-certificates libnss3 libatk-bridge2.0-0 libgtk-3-0 libxss1 libasound2 --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 下载并安装 Chromium
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    dpkg -i google-chrome-stable_current_amd64.deb || apt-get install -yf && \
    rm google-chrome-stable_current_amd64.deb

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY . .

# 安装依赖
RUN npm install --production

# 暴露端口
EXPOSE 8080

# 启动应用
CMD ["npm", "start"]