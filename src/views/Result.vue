<template lang="pug">
  v-form
    v-img(:src="logo")
    v-container()
      v-row(align='center', justify='center')
        v-col(cols='6')
          v-row(align-content="end").mt-8
            v-text-field(v-model="repo" solo )
        v-col(cols='2')
            v-btn(@click="search(repo)" large color="primary") Поиск
    v-container
      v-data-table.elevation-1(:headers='headers', :items='forks', :items-per-page='30'
        hide-default-footer
        disable-sort
        :loading="loading"
        loading-text="Загрузка"

        )
          template(v-slot:item.stars='{ item }')
            v-btn(disabled text) {{item.stars}}
              v-icon(small ) mdi-star-outline  
          template(v-slot:item.forkUrl='{item}')
            v-btn(@click="newTab(item.searchUrl)" small text) {{item.forkUrl}}
          template(v-slot:item.favoriteButton='{item}')
            v-icon(small text color="yellow" @click="setFavorite(item)")(v-if="!item.isFavorite") mdi-star-outline
            v-icon(small  text color="yellow" @click="delFavorite(item)")(v-else) mdi-star
      v-pagination(v-model="pagination.page" :length="pagination.count"  circle)
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
      pageLoading:true,
      pagination:{
        page:1,
        count:1,
      },
      lastPage:1,
      links:{},
      forks:[],
      star: {
      },
      loading:false,
      logo: logo,
      repo: this.$route.params.owner + '/' + this.$route.params.repository

    }
  },
  computed:{
    getRepos(){
      let owner = this.$route.params.owner
      let repos = this.$route.params.repository
      return owner + '/'+repos
    },
  },
  created(){
    this.search(this.getRepos)
    this.$store.dispatch('frdEventListner')
  },
  methods:{
    async search(repo){
      this.forks=[]
      const response = await axios.post(`/github`, {
        repo:repo
      })
      this.pageLoading = false
      // this.$store.dispatch('setState',response.data)
      this.lastPage = 1
      this.pagination.page = 1
      this.forks = response.data.forks
      this.pagination.count = response.data.count
      this.links = response.data.links
    },
    newTab(url){
      window.open(url, '_blank');
    },
    async getDataFromApi(page){
        console.log(page)
      if(page != this.lastPage){
        this.loading = true
        this.forks = []
        let url;
        if(page > this.lastPage){
          url = this.links.next
        } else {
          url =  this.links.prev
        }
        url = url.substring(0,url.indexOf('page='))
        url +="page="+ page
        const response = await axios.post(`/url`, {
          url:url,
          page:page
        })

        this.forks = response.data.forks
        this.links = response.data.links
        this.lastPage = this.pagination.page
        this.loading = false
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
        handler () {
          console.log(this.pagination.page)
          console.log(this.lastPage)
            this.getDataFromApi(this.pagination.page)
             
            
          },
          deep: true,
      },
  },
}
</script>
