import type { AppContext } from '/@/App'

import {
  STORAGE_APP,
  STORAGE_MENU,
  STORAGE_TAB,
  STORAGE_TOKEN,
} from '../utils/persistent'

/**
 * @description Here is where we initial app context.
 * If you find context grow to a large mount, feel free to expand the module.
 * Try to write your own Vuex through `provide`/`inject` api!
 */
export const AppGlobalContext = reactive<AppContext>({
  app: STORAGE_APP.value,

  menu: {
    menus: [],
    indexMenuName: STORAGE_MENU.value.indexMenuName,
    keepAliveRouteNames: [],
  },

  user: {
    token: STORAGE_TOKEN.value,
    userInfo: {},
  },

  tab: {
    tabs: STORAGE_TAB.value.tabs,
    cachedTabs: new Map(),
    targetTabName: STORAGE_TAB.value.targetTabName,
  },
})
