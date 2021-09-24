/**
 * @file user urls
 */

export default {
    getUser: {
        url: '/user'
    },
    getUserSetting: {
        url: '/user/settings'
    },
    setUserSetting: {
        url: '/user/settings',
        method: 'post'
    }
} as Record<string, NetTypes.Api>;
