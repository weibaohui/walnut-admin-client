export default defineComponent({
  name: 'WTransitionSelect',

  props: ['value'],

  emits: ['update:value'],

  setup(props, { emit }) {
    const getChilren = (group: string) =>
      Object.entries(TransitionNameConst)
        .map(([key, value]) => ({
          value: value,
          label: key,
        }))
        .filter((i) => i.value.startsWith(group))

    const options = ref<BaseOptionDataItem[]>(
      ['fade', 'zoom', 'bounce', 'rotate', 'slide', 'back', 'flip'].map(
        (group) => ({
          type: 'group',
          label: group,
          key: 'group-' + group,
          children: getChilren(group),
        })
      )
    )

    return () => (
      <n-select
        value={props.value}
        options={options.value}
        filterable
        onUpdateValue={(v: string) => emit('update:value', v)}
      ></n-select>
    )
  },
})
