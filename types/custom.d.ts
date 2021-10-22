declare global {
  // vue
  type App = import('vue').App
  type Ref<T> = import('vue').Ref<T>
  type ComputedRef<T> = import('vue').ComputedRef<T>
  type PropType<T> = import('vue').PropType<T>
  type ExtractPropTypes<T> = import('vue').ExtractPropTypes<T>
  type InjectionKey<T> = import('vue').InjectionKey<T>
  type VNode = import('vue').VNode
  type ToRefs<T> = import('vue').ToRefs<T>

  // vue-router
  type Router = import('vue-router').Router
  type RouteRecordRaw = import('vue-router').RouteRecordRaw
  type RouteLocationRaw = import('vue-router').RouteLocationRaw
  type RouteLocationNormalized = import('vue-router').RouteLocationNormalized
  type RouteLocationNormalizedLoaded =
    import('vue-router').RouteLocationNormalizedLoaded

  // value of const
  type ValueOfDeleteTabConst = import('/@/const').ValueOfDeleteTabConst
  type ValueOfDarkModeConst = import('/@/const').ValueOfDarkModeConst
  type ValueOfLocaleConst = import('/@/const').ValueOfLocaleConst
  type ValueOfMenuTypeConst = import('/@/const').ValueOfMenuTypeConst
  type ValueOfMenuTernalConst = import('/@/const').ValueOfMenuTernalConst
  type ValueOfPersistentKeysConst =
    import('/@/const').ValueOfPersistentKeysConst
  type ValueOfStorageTypeConst = import('/@/const').ValueOfStorageTypeConst
  type ValueOfSymbolKeyConst = import('/@/const').ValueOfSymbolKeyConst
  type ValueOfTransitionNameConst =
    import('/@/const').ValueOfTransitionNameConst

  // vite
  type VitePlugin = import('vite').Plugin

  // app
  type AppTab = import('/@/layout/default/TheTab').AppTab
}

export {}
