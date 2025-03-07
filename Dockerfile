# 使用 Puppeteer 官方镜像作为基础镜像
FROM ghcr.io/puppeteer/puppeteer:24.4.0

# 切换到 root 用户
USER root
# 设置工作目录
WORKDIR /app
RUN  chmod -R 777 /app

# 安装依赖
COPY package*.json ./
RUN npm install


COPY . .

EXPOSE 8080
# 切换回默认用户
USER pptruser

CMD [ "node", "index.js" ]