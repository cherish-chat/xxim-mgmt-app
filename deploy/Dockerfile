FROM nginx
ADD ./dist.tar.gz /usr/share/nginx/html
EXPOSE 80
WORKDIR /usr/share/nginx/html
RUN rm -rf /etc/nginx/conf.d/default.conf
# 修改nginx配置文件 让其支持vue单页应用
COPY admin.nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]