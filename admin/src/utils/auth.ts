import { TOKEN_KEY, USERID_KEY } from '@/enums/cacheEnums'
import { resetRouter } from '@/router'
import useTabsStore from '@/stores/modules/multipleTabs'
import useUserStore from '@/stores/modules/user'
import cache from './cache'

export function getToken() {
    return cache.get(TOKEN_KEY)
}

export function getUserId() {
    return cache.get(USERID_KEY)
}

export function clearAuthInfo() {
    const userStore = useUserStore()
    const tabsStore = useTabsStore()
    userStore.resetState()
    tabsStore.$reset()
    cache.remove(TOKEN_KEY)
    cache.remove(USERID_KEY)
    resetRouter()
}
