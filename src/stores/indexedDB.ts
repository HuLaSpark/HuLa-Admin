import { defineStore } from 'pinia'
import localforage from 'localforage'

export const indexedDB = defineStore('indexedDB', {
  state: () => ({
    aboutUsDB: localforage.createInstance({
      name: 'aboutUsDB'
    }),
    searchDB: localforage.createInstance({
      name: 'searchDB'
    }),
    userInfoDB: localforage.createInstance({
      name: 'userInfoDB'
    }),
    responseDB: localforage.createInstance({
      name: 'responseDB'
    })
  }),
  actions: {
    async removeSearchDBAll() {
      return await this.searchDB.clear()
    },
    /**
     * 以key和value的形式来获取数据
     * @param key key
     */
    async getSearchDB(key: number) {
      const res = []
      for (let i = 0; i < key; i++) {
        res.push(await this.searchDB.getItem(i.toString()))
      }
      return res
    },
    /**
     * 以key和value的形式来存储数据
     * @param array 数组
     */
    async setSearchDB(array: any) {
      for (let i = 0; i < array.length; i++) {
        await this.searchDB.setItem(i.toString(), array[i])
      }
    },
    async getAboutUsDB(key: string) {
      return await this.aboutUsDB.getItem(key)
    },
    async setAboutUsDB(key: string, value: any) {
      await this.aboutUsDB.setItem(key, value)
    }
  },
  persist: true
})
