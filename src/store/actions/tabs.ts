import { notFoundName, redirectName } from '/@/router/constant'

const nameBlackList: string[] = [notFoundName, redirectName]
const tabKey = Symbol(SymbolKeyConst.TABS_KEY)

/**
 * @description Action - Tab - Close multiple tabs
 */
const closeMultipleTabs = (lists: string[]) => {
  const { tab } = useAppContext<false>()

  tab.tabs.map((item, index) => {
    if (lists.includes(item.name)) {
      tab.tabs.splice(index, tab.tabs.length - 1)
    }
  })
}

/**
 * @description Action - Tab - Create tab
 */
export const tabActionCreate = (
  newTab: AppTab,
  method: keyof typeof Array.prototype = 'push'
) => {
  const { tab } = useAppContext<false>()

  // redirect/404 etc pages do not need to add into tab
  if (nameBlackList.includes(newTab.name)) return

  // set the current tab name
  tab.targetTabName = newTab.name

  const index = tab.tabs.findIndex((item) => item.name === newTab.name)

  // not found
  if (index === -1) {
    const cached = tab.cachedTabs.get(tabKey)

    if (!cached || (cached && !cached.includes(newTab.name))) {
      tab.tabs[method as string](newTab)
    }
  }

  // set cached tabs
  tab.cachedTabs.set(
    tabKey,
    tab.tabs.map((item) => item.name)
  )
}

/**
 * @description Action - Tab - Delete tab
 */
export const tabActionDelete = (name: string, type: ValueOfDeleteTabConst) => {
  const { tab, menu } = useAppContext<false>()

  const index = tab.tabs.findIndex((item) => item.name === name)

  switch (type) {
    case DeleteTabConst.TAB_SELF:
      {
        // find and splice
        index !== -1 && tab.tabs.splice(index, 1)

        // close current tab
        if (tab.targetTabName === name) {
          const next = tab.tabs[index]
          const previous = tab.tabs[index - 1]

          // Got next tab, push to next. Else push to previous one
          useRouterPush({ name: next ? next.name : previous.name })
        }
      }
      break

    case DeleteTabConst.TAB_LEFT:
      {
        const nameList: string[] = []

        tab.tabs.map((item, i) => {
          // find left tabs and not affix ones
          if (i < index && !item.meta.affix) {
            nameList.push(item.name)
          }
        })

        // If left include current page, we need to push to target route
        if (nameList.includes(tab.targetTabName)) {
          useRouterPush({ name })
        }

        // close left tabs
        closeMultipleTabs(nameList)
      }
      break

    case DeleteTabConst.TAB_RIGHT:
      {
        const nameList: string[] = []

        tab.tabs.map((item, i) => {
          // find right tabs and not affix ones
          if (i > index && !item.meta.affix) {
            nameList.push(item.name)
          }
        })

        // If right include current page, we need to push to target route
        if (nameList.includes(tab.targetTabName)) {
          useRouterPush({ name })
        }

        // close right tabs
        closeMultipleTabs(nameList)
      }
      break

    case DeleteTabConst.TAB_OTHER:
      {
        const nameList: string[] = []

        tab.tabs.map((item) => {
          // find no affixed tabs except self
          if (item.name !== name && !item.meta.affix) {
            nameList.push(item.name)
          }
        })

        // If the closed one is not current route, we need to push to target route
        if (tab.targetTabName !== name) {
          useRouterPush({ name })
        }

        // close right tabs
        closeMultipleTabs(nameList)
      }
      break

    case DeleteTabConst.TAB_ALL:
      {
        const nameList: string[] = []

        tab.tabs.map((item) => {
          // find all no affixed tabs
          if (!item.meta.affix) {
            nameList.push(item.name)
          }
        })

        // Just back to index page
        useRouterPush({ name: menu.indexMenuName })

        // close right tabs
        closeMultipleTabs(nameList)
      }
      break

    default:
      break
  }
}

/**
 * @description Action - Tab - Clear tab
 */
export const tabActionClear = () => {
  const { tab } = useAppContext<false>()
  tab.tabs.length = 0
  tab.cachedTabs.clear()
}

/**
 * @description Action - Tab - Sort tab
 */
export const tabActionSort = (oldIndex: number, newIndex: number) => {
  const { tab } = useAppContext<false>()

  const currentTab = tab.tabs[oldIndex]
  tab.tabs.splice(oldIndex, 1)
  tab.tabs.splice(newIndex, 0, currentTab)
}
