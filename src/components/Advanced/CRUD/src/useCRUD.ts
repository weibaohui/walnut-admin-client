import type { WCrud } from './types'

import { isInSetup } from '/@/utils/shared'

export const useCRUD = <T = RowData>(
  props: WCrud.Props<T>
): WCrud.useFormReturnType<T> => {
  isInSetup()

  const wCrudRef = ref<Nullable<WCrud.Inst.WCrudInst<T>>>(null)

  const register = (instance: WCrud.Inst.WCrudInst<T>) => {
    wCrudRef.value = instance

    watchEffect(() => {
      props && instance.setProps(props)
    })
  }

  const methods = {
    onTableCreateAndOpenDetail: () =>
      wCrudRef.value?.onTableCreateAndOpenDetail(),
    onApiTableReadAndOpenDetail: async (id: StringOrNumber) =>
      await wCrudRef.value?.onApiTableReadAndOpenDetail(id),
    onApiTableDelete: async (id: StringOrNumber) =>
      await wCrudRef.value?.onApiTableDelete(id),
    onApiTableDeleteMany: async () =>
      await wCrudRef.value?.onApiTableDeleteMany(),
    onGetFormData: () => wCrudRef.value?.onGetFormData()!,
    onGetActionType: () => wCrudRef.value?.onGetActionType()!,
  }

  return [register, methods]
}
