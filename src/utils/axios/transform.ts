import type { AxiosTransform } from './src/types'

import {
  easyFilterEmptyValue,
  easyTransformObjectStringBoolean,
} from 'easy-fns-ts'
import { merge } from 'lodash-es'

import { checkReponseErrorStatus } from './checkStatus'
import { AppResponseEncryption, AppRequestEncryption } from '../crypto'
import { RefreshTokenLogic, setTokenInRequest } from './refreshToken'

const userAuth = useAppStoreUserAuth()
const appLocale = useAppStoreLocale()

// custom transform for req and res interceptors
export const transform: AxiosTransform = {
  // Here handler request logic
  requestInterceptors: (config) => {
    const userProfile = useAppStoreUserProfile()

    const mergedCustomOptions = config.customConfig!

    // custom headers
    config.headers!['x-language'] = appLocale.locale
    config.headers!['x-fingerprint'] = fpId.value

    if (userProfile.cityName) {
      config.headers!['x-location'] = wbtoa(userProfile.cityName)
    }

    // carry token
    if (mergedCustomOptions.needAuth) {
      userAuth.accessToken && setTokenInRequest(config, userAuth.accessToken)
    }

    // add timestamp
    if (mergedCustomOptions.timestamp) {
      config.url += `?_t=${Date.now()}`
    }

    // filter null value in config.data
    if (mergedCustomOptions.filterNull && config.data) {
      config.data = easyFilterEmptyValue(config.data)
    }

    // transform "true"/"false" to true/false
    if (mergedCustomOptions.transformStringBoolean && config.data) {
      config.data = easyTransformObjectStringBoolean(config.data)
    }

    // auto encrypt body data(post)
    if (mergedCustomOptions.autoEncryptRequestData) {
      const cryptedObj = Object.fromEntries(
        mergedCustomOptions.encryptFields!.map((key) => [
          key,
          AppRequestEncryption.encrypt(config.data[key]),
        ])
      )

      config.data = merge(config.data, cryptedObj)
    }

    // extra custom header for per request
    if (mergedCustomOptions.extraHeader) {
      config.headers!['x-scoped-permission'] =
        mergedCustomOptions.extraHeader['scoped-permission']
    }

    return config
  },

  requestInterceptorsCatch: (err) => {
    return Promise.reject(err)
  },

  // Here handle response data
  responseInterceptors: (res) => {
    // code below is custom code in `axios.response.data`
    const { code, data, msg } = res.data

    // normal success
    if (code === BussinessCodeConst.SUCCESS) {
      // @ts-ignore
      if (res.config.customConfig.autoDecryptResponseData) {
        return Promise.resolve(AppResponseEncryption.decrypt(data))
      }

      return Promise.resolve(data)
    }

    // when access token is expired, call refresh token api to get new token
    if (code === BussinessCodeConst.ACCESS_TOKEN_EXPIRED) {
      const config = res.config

      // TODO bug
      // router push too fast, which means last page going on requesting, then go to another page, will cause fake death of page
      return RefreshTokenLogic(config)
    }

    // refresh token is expired, so this user need to signout and re-signin
    if (code === BussinessCodeConst.REFRESH_TOKEN_EXPIRED) {
      userAuth.Signout(false)
      return Promise.resolve()
    }

    const badRequestCodeList: number[] = [
      BussinessCodeConst.SIGNIN_USER_NOT_FOUND,
      BussinessCodeConst.SIGNIN_PASS_NOT_VALID,
      BussinessCodeConst.SIGNIN_USER_BANNED,
      BussinessCodeConst.USER_EXIST,
      BussinessCodeConst.DATA_EXISTED,
      BussinessCodeConst.DATA_NOT_FOUND,
      BussinessCodeConst.DATA_DELETE_ERROR,
      BussinessCodeConst.DATA_ERROR,
      BussinessCodeConst.DATA_BAD_ID,
      BussinessCodeConst.VERIFY_CODE_ERROR,
      BussinessCodeConst.NOT_FOUND,
      BussinessCodeConst.DATABASE_ERROR,
      BussinessCodeConst.CUSTOM_ERROR,
      BussinessCodeConst.PERMISSION_DENIED,
    ]

    if (badRequestCodeList.includes(code)) {
      useAppNotiError(msg)

      // since we have the error message, just resolve so handle logic behind
      return Promise.reject()
    }

    return Promise.reject()
  },

  // Here handle response error
  responseInterceptorsCatch: (err) => {
    if (err.message === 'Network Error') {
      useAppRouterPush({ name: '500' })
      return
    }

    console.log(err)

    const statusCode = (err.response?.data as any).statusCode
    const msg = (err.response?.data as any).detail?.message
    checkReponseErrorStatus(statusCode, msg)

    return Promise.reject(err)
  },
}
