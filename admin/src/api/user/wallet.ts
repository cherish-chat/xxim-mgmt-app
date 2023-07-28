import request from '@/utils/request'

export function walletDetail(userId: string) {
    return request.post({url: '/usermgmt/get/wallet/detail', params: {userId}})
}

export function rechargeWallet(userId: string, amount: number) {
    return request.post({
        url: '/usermgmt/recharge/wallet', params: {
            userId,
            amount
        }
    })
}
