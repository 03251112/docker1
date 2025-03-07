# 使用 Puppeteer 官方镜像作为基础镜像
FROM ghcr.io/puppeteer/puppeteer:24.4.0
# 设置工作目录
WORKDIR /app


# 安装依赖
COPY package*.json ./
RUN npm install --production


COPY . .

EXPOSE 8080

CMD [ "node", "index.js" ]