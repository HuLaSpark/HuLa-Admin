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
    async getSearchDB(key: string) {
      return await this.searchDB.getItem(key)
    },
    async setSearchDB(key: string, value: any) {
      await this.searchDB.setItem(key, value)
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
