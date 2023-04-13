# shellcheck disable=SC2164
cd ../admin
cat > .env.production << EOF
NODE_ENV = 'production' # 生产环境

# 请求域名
VITE_APP_BASE_URL=''
VITE_APP_AES_IV=''
VITE_APP_AES_KEY=''
EOF
yarn run build
cd dist
tar -zcvf ../../deploy/dist.tar.gz ./*
cd ../../deploy
docker build --platform linux/x86_64 -t "registry.cn-shanghai.aliyuncs.com/xxim-dev/xxim-mgmtapp:latest" .
docker push "registry.cn-shanghai.aliyuncs.com/xxim-dev/xxim-mgmtapp:latest"
