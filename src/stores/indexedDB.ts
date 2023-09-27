import { defineStore } from 'pinia'
import localforage from 'localforage'

export const indexedDB = defineStore('indexedDB', {
  state: () => ({
    aboutUsDB: localforage.createInstance({
      name: 'aboutUsDB'
    }),
    userInfoDB: localforage.createInstance({
      name: 'userInfoDB'
    }),
    responseDB: localforage.createInstance({
      name: 'responseDB'
    })
  }),
  actions: {
    async getAboutUsDB(key: string) {
      return await this.aboutUsDB.getItem(key)
    },
    async setAboutUsDB(key: string, value: any) {
      await this.aboutUsDB.setItem(key, value)
    }
  },
  persist: true
})
