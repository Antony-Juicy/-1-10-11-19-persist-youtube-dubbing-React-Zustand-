import { StateCreator, create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createSelectors } from '../utils/createSelectors'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'

type TCatStoreState = {
  cats: {
    bigCats: number
    smallCats: number
  }
  increaseBigCats: () => void
  increaseSmallCats: () => void
  summary: () => void
}

/************************  React Zustand 状态管理基础用法************************/

// export const useCatStore = create<TCatStoreState>((set, get) => ({
//   cats: {
//     bigCats: 0,
//     smallCats: 0,
//   },
//   increaseBigCats: () =>
//     set((state) => ({
//       cats: {
//         ...state.cats /* 更新深度嵌套的 数据 */,
//         bigCats: state.cats.bigCats + 1,
//       },
//     })),
//   increaseSmallCats: () =>
//     set((state) => ({
//       cats: {
//         ...state.cats /* 更新深度嵌套的 数据 */,
//         smallCats: state.cats.smallCats + 1,
//       },
//     })),
//   summary: () => {
//     const total = get().cats.bigCats + get().cats.smallCats
//     return `There are ${total} cats in total. `
//   },
// }))

/************************ 如何get, set状态和使用 immer 中间件************************/

// export const useCatStore = create<TCatStoreState>()(
//   immer((set, get) => ({
//     cats: {
//       bigCats: 0,
//       smallCats: 0,
//     },
//     increaseBigCats: () =>
//       set((state) => {
//         state.cats
//           .bigCats++ /* 用immer包裹 直接更新数据，不需要拷贝 使用immer middleware 来更新状态*/
//       }),

//     increaseSmallCats: () =>
//       set((state) => {
//         state.cats
//           .smallCats++ /* 用immer包裹 直接更新数据，不需要拷贝 使用immer middleware 来更新状态*/
//       }),
//     summary: () => {
//       const total = get().cats.bigCats + get().cats.smallCats
//       return `There are ${total} cats in total. `
//     },
//   }))
// )

const createCatSlice: StateCreator<
  TCatStoreState,
  [
    ['zustand/immer', never],
    ['zustand/devtools', unknown],
    ['zustand/subscribeWithSelector', never],
    ['zustand/persist', unknown]
  ]
> = (set, get) => ({
  cats: {
    bigCats: 0,
    smallCats: 0,
  },
  increaseBigCats: () =>
    set((state) => {
      state.cats.bigCats++
    }),
  increaseSmallCats: () =>
    set((state) => {
      state.cats.smallCats++
    }),
  summary: () => {
    const total = get().cats.bigCats + get().cats.smallCats
    return `There are ${total} cats in total. `
  },
})

export const useCatStore = createSelectors(
  create<TCatStoreState>()(
    immer(
      devtools(
        subscribeWithSelector(
          persist(createCatSlice, {
            name: 'cat store',
          })
        ),
        {
          enabled: true,
          name: 'cat store',
        }
      )
    )
  )
)
