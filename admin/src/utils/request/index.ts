import {merge} from 'lodash'
import configs from '@/config'
import {Axios} from './axios'
import {ContentTypeEnum, RequestCodeEnum, RequestMethodsEnum} from '@/enums/requestEnums'
import type {AxiosHooks} from './type'
import {clearAuthInfo, getToken, getUserId} from '../auth'
import feedback from '../feedback'
import NProgress from 'nprogress'
import {AxiosError, type AxiosRequestConfig} from 'axios'
import router from '@/router'
import {PageEnum} from '@/enums/pageEnum'
// @ts-ignore
import CryptoJS from 'crypto-js'

// 处理axios的钩子函数
const axiosHooks: AxiosHooks = {
    requestInterceptorsHook(config) {
        NProgress.start()
        const {withToken, isParamsToData} = config.requestOptions
        const params = config.params || {}
        const headers = config.headers || {}

        // 添加token
        if (withToken) {
            const token = getToken()
            const userId = getUserId()
            headers.token = token
            headers.userId = userId
        }
        // POST请求下如果无data，则将params视为data
        if (
            isParamsToData &&
            !Reflect.has(config, 'data') &&
            config.method?.toUpperCase() === RequestMethodsEnum.POST
        ) {
            config.data = params
            config.params = {}
        }

        const {aesKey, aesIv} = configs
        if (aesKey !== "" && aesIv !== "") {
            const iv = CryptoJS.MD5(aesIv).toString().substr(8, 16);
            const key = CryptoJS.MD5(aesKey).toString();
            if (config.data) {
                const body = JSON.stringify(config.data);
                const cipherText = CryptoJS.AES.encrypt(
                    body,
                    CryptoJS.enc.Utf8.parse(key),
                    {
                        iv: CryptoJS.enc.Utf8.parse(iv),
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    }).toString();
                config.data = cipherText;
            }
        }
        config.headers = headers
        return config
    },
    requestInterceptorsCatchHook(err) {
        NProgress.done()
        return err
    },
    async responseInterceptorsHook(response) {
        NProgress.done()
        const {isTransformResponse, isReturnDefaultResponse} = response.config.requestOptions

        //返回默认响应，当需要获取响应头及其他数据时可使用
        if (isReturnDefaultResponse) {
            return response
        }
        // 是否需要对数据进行处理
        if (!isTransformResponse) {
            return response.data
        }

        // @ts-ignore
        const b64Data = response.data as string

        // 解密
        const {aesKey, aesIv} = configs
        let {code, data, show, msg} = response.data
        if (aesKey !== "" && aesIv !== "") {
            const iv = CryptoJS.MD5(aesIv).toString().substr(8, 16);
            const key = CryptoJS.MD5(aesKey).toString();
            const bytes = CryptoJS.AES.decrypt(b64Data, CryptoJS.enc.Utf8.parse(key), {
                iv: CryptoJS.enc.Utf8.parse(iv),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            const text = bytes.toString(CryptoJS.enc.Utf8);
            const decryptedData = JSON.parse(text);
            code = decryptedData.code
            data = decryptedData.data
            show = decryptedData.show
            msg = decryptedData.msg
        }
        switch (code) {
            case RequestCodeEnum.SUCCESS:
                if (show) {
                    msg && feedback.msgSuccess(msg)
                }
                return data

            case RequestCodeEnum.PARAMS_TYPE_ERROR:
            case RequestCodeEnum.PARAMS_VALID_ERROR:
            case RequestCodeEnum.REQUEST_METHOD_ERROR:
            case RequestCodeEnum.ASSERT_ARGUMENT_ERROR:
            case RequestCodeEnum.ASSERT_MYBATIS_ERROR:
            case RequestCodeEnum.LOGIN_ACCOUNT_ERROR:
            case RequestCodeEnum.LOGIN_DISABLE_ERROR:
            case RequestCodeEnum.NO_PERMISSTION:
            case RequestCodeEnum.FAILED:
            case RequestCodeEnum.SYSTEM_ERROR:
                msg && feedback.msgError(msg)
                return Promise.reject(data)

            case RequestCodeEnum.TOKEN_INVALID:
            case RequestCodeEnum.TOKEN_EMPTY:
                clearAuthInfo()
                router.push(PageEnum.LOGIN)
                return Promise.reject()

            default:
                return data
        }
    },
    responseInterceptorsCatchHook(error) {
        NProgress.done()
        if (error.code !== AxiosError.ERR_CANCELED) {
            error.message && feedback.msgError(error.message)
        }
        return Promise.reject(error)
    }
}

const defaultOptions: AxiosRequestConfig = {
    timeout: configs.timeout,
    // 基础接口地址
    baseURL: configs.baseUrl,
    headers: {'Content-Type': ContentTypeEnum.JSON, version: configs.version},

    // 处理 axios的钩子函数
    axiosHooks: axiosHooks,
    // 每个接口可以单独配置
    requestOptions: {
        // 是否将params视为data参数，仅限post请求
        isParamsToData: true,
        //是否返回默认的响应
        isReturnDefaultResponse: false,
        // 需要对返回数据进行处理
        isTransformResponse: true,
        // 接口拼接地址
        urlPrefix: configs.urlPrefix,
        // 忽略重复请求
        ignoreCancelToken: false,
        // 是否携带token
        withToken: true,
        // 开启请求超时重新发起请求请求机制
        isOpenRetry: true,
        // 重新请求次数
        retryCount: 2
    }
}

function createAxios(opt?: Partial<AxiosRequestConfig>) {
    return new Axios(
        // 深度合并
        merge(defaultOptions, opt || {})
    )
}

const request = createAxios()
export default request
