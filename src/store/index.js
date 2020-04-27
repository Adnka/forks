import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/firestore'
import axios from 'axios'

Vue.use(Vuex)

const config = {
  apiKey: "AIzaSyAQqhpFskKtKlQ7CoUwQ0CQ5rDOSEbD5zg",
  authDomain: "baurzhan-test.firebaseapp.com",
  databaseURL: "https://baurzhan-test.firebaseio.com",
  projectId: "baurzhan-test",
  storageBucket: "baurzhan-test.appspot.com",
  messagingSenderId: "26860057867",
  appId: "1:26860057867:web:d7c3bec5fcfb9732845e0e"
};



firebase.initializeApp(config)
const db = firebase.database()
const favorites = db.ref('favorites')


export default new Vuex.Store({
  strict:false,
  state: {
    pagination: {
      itemsPerPage:10,
      totalItems: 0,
      page:1,
    },
    items: [],
    repository: 'ktr0731/evans',
    links: {},
    forks:[],
    count: 1,
    favoritesArray: []
  },
  mutations: {
    setPagination (state, payload) {
      state.pagination = payload
    },
    setRepository (state, payload) {
      state.repository = payload
    },
    setLinks (state, payload) {
      state.links = payload
    },
    _setItems (state, { items, totalItems }) {
      state.items = items
      Vue.set(state.pagination, 'totalItems', totalItems)
    },
    setForks(state,payload){
      payload.forEach((i)=>{
        state.forks.push(i)
      })
    },
    updateItems(state,payload){
      Vue.set(state,'items',payload)
    },
    updateForks(state,payload){
      state.forks = payload
    },
    setCount(state, payload) {
      state.count = payload
    },
    setTotalItems(state,payload) {
      Vue.set(state.pagination, 'totalItems', payload)
    },
    updateFavoritesArray(state,payload) {
      state.favoritesArray = payload
    }
  },
  actions: {
    async queryItems (context) {
      const { page, itemsPerPage } = context.state.pagination
      let items = context.state.forks.slice()

      items.forEach(item => {
        if(context.state.favoritesArray.includes(item.forkName)){
          item.isFavorite = true
        } else {
          item.isFavorite = false
        }
      })


      const totalItems = items.length

        if (itemsPerPage > 0) {
          items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
        }

        context.commit('_setItems', { items, totalItems })

        console.log(context.state.favoritesArray)
    },
    async search (context){
      await context.dispatch('getFavorites')
      await context.dispatch('deleteFavoriteTracking')
      const { page, itemsPerPage } = context.state.pagination

      const response = await axios.post(`/github`, {
        repo:this.state.repository
      })

      let items = response.data.forks.slice()
      items.forEach(item => {
        if(context.state.favoritesArray.includes(item.forkName)){
          item.isFavorite = true
        } else {
          item.isFavorite = false
        }
      })
      
      let totalItems = response.data.forks.length
      let links = response.data.links
      let count = response.data.count

      if (itemsPerPage > 0) {
        items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
      }

      context.commit('_setItems', { items, totalItems })
      context.commit('setForks', response.data.forks)
      context.commit('setLinks', links)
      context.commit('setCount', count)
      context.dispatch('fetchAll')
    },

    async fetchAll (context) {
      let links = context.state.links
      let nextUrl = links.next


      while(Object.prototype.hasOwnProperty.call(links, 'next')) {
        const response = await axios.post(`/url`, {
          url:nextUrl,
        })
        links = response.data.links
        context.commit('setForks', response.data.forks)
      }
      context.commit('setTotalItems', context.state.forks.length)
    },

    saveFavorite(context, item) {
      console.log(context)
      favorites.child(item.forkName).set(item)
      let temp = context.state.favoritesArray
      temp.push(item.forkName)
      context.commit('updateFavoritesArray', temp)
    },

    deleteFavorite(context,item){
      let temp = context.state.favoritesArray
      let id = temp.indexOf(item.forkName)
        
        if(id > -1) {
          temp.splice(id,1)
          context.commit('updateFavoritesArray', temp)
        }
        favorites.child(item.forkName).remove()
    },

    getFavorites(context){
      favorites.once('value', snapshot =>{
        snapshot.forEach(i=>{
          let temp = context.state.favoritesArray
          let owner = i.key
          let child = i.val()
          let keys = Object.keys(child) 
          keys.forEach(item => {
            temp.push(`${owner}/${item}`)
          })
          context.commit('updateFavoritesArray', temp)
        })
      })
    },

    deleteFavoriteTracking(context) {
      favorites.on('child_removed', snapshot=>{
        let owner = snapshot.key
        let repo = Object.keys(snapshot.val())[0]
        let target = `${owner}/${repo}`
        let temp = context.state.favoritesArray
        let id = temp.indexOf(target)
        
        console.log(id)
        if(id > -1) {
          temp.splice(id,1)
          let obj = context.state.items.find(x => x.forkName === target)
          obj.isFavorite = false
          let fobj = context.state.forks.find(x => x.forkName === target)
          fobj.isFavorite = false
          console.log(context.state.items)
          context.commit('updateItems', context.state.items)
          context.commit('updateForks', context.state.forks)
          context.commit('updateFavoritesArray', temp)

        }
      })
    }


  },
  modules: {
    
  },
  getters:{
    repository (state) {
      return state.repository
    },
    items (state) {
      return state.items
    },
    pagination (state) {
      return state.pagination
    },
    count(state) {
      return state.count
    }
  }
})
