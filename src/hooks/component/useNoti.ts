import type { NotificationOptions } from 'naive-ui'
import { formatTime } from 'easy-fns-ts'

export const useAppNotification = () => {
  return window.$notification
}

interface AppNotiOptions extends NotificationOptions {
  placement?: NotificationPlacement
}

/**
 * @description notification usage
 */
export const AppNoti = (msg: string, options: AppNotiOptions) => {
  const appNaive = useAppStoreNaive()
  const { title } = useAppEnv('title')

  appNaive.setNotiPlacement(options?.placement ?? 'top-right')

  const inst = useAppNotification().create({
    ...options,
    title: options.title ?? title,
    content: options.content ?? msg,
    duration: options?.duration ?? 5000,
    closable: options?.closable ?? true,
    meta: options.meta ?? formatTime(new Date()),
  })

  appNaive.setCurrentNotiInst(inst)
}

export const useAppNotiSuccess = (
  msg: string,
  options?: Omit<AppNotiOptions, 'type'>
) => AppNoti(msg, { ...options, type: 'success' })

export const useAppNotiInfo = (
  msg: string,
  options?: Omit<AppNotiOptions, 'type'>
) => AppNoti(msg, { ...options, type: 'info' })

export const useAppNotiWarning = (
  msg: string,
  options?: Omit<AppNotiOptions, 'type'>
) => AppNoti(msg, { ...options, type: 'warning' })

export const useAppNotiError = (
  msg: string,
  options?: Omit<AppNotiOptions, 'type'>
) => AppNoti(msg, { ...options, type: 'error' })
