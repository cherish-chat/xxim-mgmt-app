const config = {
    terminal: 1, //终端
    title: '后台管理系统', //网站默认标题
    version: '1.3.3', //版本号
    baseUrl: `${import.meta.env.VITE_APP_BASE_URL || ''}/`, //请求接口域名
    urlPrefix: 'api', //请求默认前缀
    timeout: 60 * 1000 //请求超时时长
}
console.log(config)
export default config
