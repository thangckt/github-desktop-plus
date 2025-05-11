import Store from 'electron-store'

interface IStoreSchema {
  hideWindowOnQuit: boolean
}

let store: Store<IStoreSchema> | null = null

export function getStore(): Store<IStoreSchema> {
  if (store === null) {
    store = new Store()
  }
  return store
}
