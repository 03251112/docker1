# 使用 Puppeteer 官方镜像作为基础镜像
FROM ghcr.io/puppeteer/puppeteer:24.4.0

# 确保 /app 目录存在并具有正确的权限
RUN mkdir -p /app && chmod -R 777 /app

# 设置工作目录
WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm install


COPY . .

EXPOSE 8080

CMD [ "node", "index.js" ]