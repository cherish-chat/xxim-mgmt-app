import { defineStore } from 'pinia'
import cache from '@/utils/cache'
import type { RouteRecordRaw } from 'vue-router'
import { getUserInfo, login, logout, getMenu } from '@/api/user'
import router, { filterAsyncRoutes } from '@/router'
import {TOKEN_KEY, USERID_KEY} from '@/enums/cacheEnums'
import { PageEnum } from '@/enums/pageEnum'
import { clearAuthInfo, getToken } from '@/utils/auth'
export interface UserState {
    token: string
    userInfo: Record<string, any>
    routes: RouteRecordRaw[]
    menu: any[]
    perms: string[]
}

const useUserStore = defineStore({
    id: 'user',
    state: (): UserState => ({
        token: getToken() || '',
        // 用户信息
        userInfo: {},
        // 路由
        routes: [],
        menu: [],
        // 权限
        perms: []
    }),
    getters: {},
    actions: {
        resetState() {
            this.token = ''
            this.userInfo = {}
            this.perms = []
        },
        login(playload: any) {
            const { account, password } = playload
            return new Promise((resolve, reject) => {
                login({
                    id: account,
                    password: password
                })
                    .then((data) => {
                        this.token = data.token
                        cache.set(TOKEN_KEY, data.token)
                        cache.set(USERID_KEY, data.id)
                        resolve(data)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        async logout() {
            this.token = ''
            await router.push(PageEnum.LOGIN)
            clearAuthInfo()
        },
        getUserInfo() {
            return new Promise((resolve, reject) => {
                getUserInfo()
                    .then((data) => {
                        this.userInfo = data.user
                        this.perms = data.permissions
                        resolve(data)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        getMenu() {
            return new Promise((resolve, reject) => {
                getMenu()
                    .then((data) => {
                        this.menu = data.menus
                        this.routes = filterAsyncRoutes(data.menus)
                        resolve(data.menus)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        }
    }
})

export default useUserStore
