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
      // 创建一个数组，包含从 0 到 key-1 的所有数字
      const indexArray = [...Array(key).keys()]
      // Map每个索引到数据库查询的Promise，并且使用Promise.all来等待所有的Promise完成
      return await Promise.all(indexArray.map((i) => this.searchDB.getItem(i.toString())))
    },
    /**
     * 以key和value的形式来存储数据
     * @param array 数组
     */
    async setSearchDB(array: any[]) {
      await Promise.all(array.map((item, index) => this.searchDB.setItem(index.toString(), item)))
    },
    async getAboutUsDB(key: string) {
      return await this.aboutUsDB.getItem(key)
    },
    async setAboutUsDB(key: string, value: any) {
      await this.aboutUsDB.setItem(key, value)
    }
  }
})
