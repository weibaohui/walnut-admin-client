import type { DataTableColumn, DataTableInst } from 'naive-ui'
import type { useEventParams } from '/@/hooks/component/useEvent'

import { props } from './props'

export declare namespace WTable {
  type ColumnActionType = 'create' | 'read' | 'delete'

  type HeaderActionType = 'create' | 'update' | 'delete' | 'export' | 'import'

  type SetProps = (p: Partial<Props>) => void

  interface RowData {
    [key: string]: unknown
  }

  type RenderFn<T, R = void> = (rowData: T, rowIndex?: number) => R

  namespace Inst {
    type NDataTableInst = DataTableInst

    type ExtendInst = {
      setProps: SetProps
      onInit: (extraParams?: Recordable<any>) => Promise<void>
      onDeleteMany: Fn
    }

    interface WTableInst extends NDataTableInst, ExtendInst {}
  }

  namespace Hook {
    type useTableReturnType = [
      (instance: Inst.WTableInst) => void,
      Inst.WTableInst
    ]
  }

  namespace ExtendType {
    interface BaseExtend<E> {
      extendType?: E
    }

    interface Action<T = RowData> extends BaseExtend<'action'> {
      extendActionType?: ColumnActionType[]
      onCreate?: RenderFn<T>
      onRead?: RenderFn<T>
      onDelete?: RenderFn<T>
    }

    interface Icon<T = RowData> extends BaseExtend<'icon'> {
      extendIconName: string | RenderFn<T, string>
    }

    interface Formatter<T = RowData> extends BaseExtend<'formatter'> {
      formatter: RenderFn<T, string>
    }
  }

  type Column<T = RowData> =
    | DataTableColumn<T> &
        (ExtendType.Action<T> | ExtendType.Icon<T> | ExtendType.Formatter<T>)

  interface Props<T = RowData>
    extends Partial<Omit<ExtractPropTypes<typeof props>, 'columns'>> {
    /**
     * @description rRewrite NDataTable columns type, add our own custom column type
     */
    columns?: Column<T>[]
  }

  namespace Params {
    type Entry =
      | useEventParams<'hook', Inst.ExtendInst>
      | useEventParams<'action', { type: HeaderActionType }>
  }

  interface Context {
    tableRef: Ref<Inst.NDataTableInst | undefined>
    onEvent: (params: Params.Entry) => void
    tableProps: ComputedRef<Props>
    onInit: (extraParams?: Recordable<any> | undefined) => Promise<void>
    initParams: Ref<BaseListParams>
    onQuery: PromiseFn
    onReset: PromiseFn
    checkedRowKeys: Ref<StringOrNumber[]>
  }
}
