import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/firestore'

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
  state: {
    forks:[],
    pagination:{
      page:1,
      count:1,
    },
    links:{}
  },
  mutations: {
    setStateData(state, stateData){
      state.forks = stateData.forks
      state.pagination.count = stateData.count
      state.links = stateData.links
    }
  },
  actions: {
    setState({commit},state){
      commit('setStateData',state)
    },
    frdEventListner (){
      
      favorites.on('value',(snapshot)=>{
      
        snapshot.forEach((i)=>{
          console.log('key',i.key)
          console.log(i.val())
        })
      })
    },
    frdSaveFork({commit},state){
      console.log(commit)
      console.log(state)
      
      favorites.push().set(state)    
    }

  },
  modules: {
    
  },
  getters:{
    getAllForks(){
      return this.state.forks
    },
    getLinks(){
      return this.state.links
    },
    getPagination(){
      return this.state.pagination
    }
  }
})
