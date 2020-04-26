import Vue from 'vue'
import Vuex from 'vuex'
// import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/firestore'
import axios from 'axios'

Vue.use(Vuex)

// const config = {
//   apiKey: "AIzaSyAQqhpFskKtKlQ7CoUwQ0CQ5rDOSEbD5zg",
//   authDomain: "baurzhan-test.firebaseapp.com",
//   databaseURL: "https://baurzhan-test.firebaseio.com",
//   projectId: "baurzhan-test",
//   storageBucket: "baurzhan-test.appspot.com",
//   messagingSenderId: "26860057867",
//   appId: "1:26860057867:web:d7c3bec5fcfb9732845e0e"
// };

// firebase.initializeApp(config)
// const db = firebase.database()
// const favorites = db.ref('favorites')

export default new Vuex.Store({
  strict:true,
  state: {
    pagination: {
      itemsPerPage:5,
      totalItems: 0,
      page:1,
    },
    items: [],
    repository: 'ktr0731/evans',
    links: {},
    forks:[],
    count: 1,
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
    setCount(state, payload) {
      state.count = payload
    },
    setTotalItems(state,payload) {
      Vue.set(state.pagination, 'totalItems', payload)
    }
  },
  actions: {
    async queryItems (context) {
      console.log(context)
        const { page, itemsPerPage } = context.state.pagination


        let items = context.state.forks.slice()
        const totalItems = items.length

          if (itemsPerPage > 0) {
            items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
          }

          context.commit('_setItems', { items, totalItems })
    },
    async search (context){
      const { page, itemsPerPage } = context.state.pagination

      const response = await axios.post(`/github`, {
        repo:this.state.repository
      })

      let items = response.data.forks.slice()
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

      let page = context.state.pagination.page
      while(Object.prototype.hasOwnProperty.call(links, 'next')) {
        const response = await axios.post(`/url`, {
          url:nextUrl,
          page:page
        })
        links = response.data.links
        context.commit('setForks', response.data.forks)
      }
      context.commit('setTotalItems', context.state.forks.length)
    },
    async setState({commit},state){
        const response = await axios.post(`/github`, {
          repo:state
        })
        let items = response.data.forks.slice()
        let totalItems = response.data.forks.length

        commit('_setItems', { items, totalItems })
    },

    async fetchNext(context){
      const { page, itemsPerPage } = context.state.pagination
      let links = context.state.links
      let nextUrl = links.next

      let items = context.state.forks.slice()
      let totalItems = context.state.pagination.totalItems
      
      console.log(page, itemsPerPage)
      if(Object.prototype.hasOwnProperty.call(links, 'next')){
        const response = await axios.post(`/url`, {
      
          url:nextUrl,
          page:page
        })

        items = response.data.forks.slice()
        totalItems = response.data.forks.length
        links = response.data.links
        
        context.commit('setForks', response.data.forks)
      }

      if (itemsPerPage > 0) {
        items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
      }

      context.commit('_setItems', { items, totalItems })
      context.commit('setLinks', links)

    },
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
