<template lang="pug">
  v-form
    v-img(:src="logo")
    v-container()
      v-row(align='center', justify='center')
        v-col(cols='6')
          v-row(align-content="end").mt-8
            v-text-field(v-model="repository" solo )
        v-col(cols='2')
            v-btn(@click="search(repo)" large color="primary") Поиск
    v-container
      v-data-table.elevation-1(
        :headers="headers"
        :options.sync="pagination"
        :server-items-length="pagination.totalItems"
        :loading="loading"
        :items="items"

        )
          template(v-slot:item.stars='{ item }')
            v-btn(disabled text) {{item.stars}}
              v-icon(small ) mdi-star-outline  
          template(v-slot:item.forkUrl='{item}')
            v-btn(@click="newTab(item.searchUrl)" small text) {{item.forkUrl}}
          template(v-slot:item.favoriteButton='{item}')
            v-icon(small text color="yellow" @click="setFavorite(item)")(v-if="!item.isFavorite") mdi-star-outline
            v-icon(small  text color="yellow" @click="delFavorite(item)")(v-else) mdi-star

</template>>

<script>
import axios from 'axios'
import logo from '@/assets/main.svg'

export default {
  
  data(){
    return{
      headers:[
        {
            text: 'Login',
            align: 'start',
            value: 'forkOwnerLogin',
          },
          { text: 'Stars', value: 'stars' },
          { text: 'Fork Name', value: 'forkName' },
          { text: 'Url', value: 'forkUrl' },
          { text: 'Favorite', value: 'favoriteButton'}
      ],
      loading:false,
      logo: logo,
    }
  },
  computed:{
    pagination: {
      get: function () {
        return this.$store.getters.pagination
      },
      set: function (value) {
        this.$store.commit('setPagination', value)
      }
    },
    items () {
      return this.$store.getters.items
    },
    repository: {
      get: function () {
        return this.$store.getters.repository
      },
      set: function (value) {
        this.$store.commit('setPagination', value)
      }
    },
    count() {
      return this.$store.getters.count
    }
  },
  created(){
    // this.search(this.getRepos)
    // this.$store.dispatch('frdEventListner')
  },
  methods:{
    async search(repo){
      this.forks=[]
      const response = await axios.post(`/github`, {
        repo:repo
      })
      this.pageLoading = false
      this.lastPage = 1
      this.pagination.page = 1
      this.forks = response.data.forks
      this.pagination.count = response.data.count
      this.links = response.data.links
    },
    newTab(url){
      window.open(url, '_blank');
    },
    test(){
      console.log(this.page)
      console.log(this.pageCount)
    },
    async getDataFromApi(page,links){
        console.log(page)
      if(page > this.lastPage){
        
        this.lastPage = this.page
        this.page = page
        this.loading = true
        this.forks = []
        let url = links.next;
        
        url = url.substring(0,url.indexOf('page='))
        url +="page="+ page
        
        this.$store.dispatch('fetchNext', {url, page})
        this.loading = false
      } else if (page < this.lastPage){
        this.page = page
      }
    },

    async getDataFromApi2(page,links){
        console.log(page)
      if(page > this.lastPage){
        
        this.lastPage = this.page
        this.page = page
        this.loading = true
        this.forks = []
        let url = links.next;
        
        url = url.substring(0,url.indexOf('page='))
        url +="page="+ page
        
        this.$store.dispatch('fetchNext', {url, page})
        this.loading = false
      } else if (page < this.lastPage){
        this.page = page
      }
    },
    setFavorite(item){
        item.isFavorite = true
        this.$store.dispatch('frdSaveFork', item)
    },
    delFavorite(item){
        console.log('deleting',item)
    },
    
  },
  watch: {
    pagination: {
      handler ($event) {
        console.log($event)
        this.loading = true
        this.$store.dispatch('queryItems')  
        this.loading = false
      },
      deep: true
    }
  }
}
</script>
