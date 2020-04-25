<template lang="pug">
  v-form
    v-img(:src="logo")
    v-container()
      v-row(align='center', justify='center')
        v-col(cols='6')
          v-row(align-content="end").mt-8
            v-text-field(v-model="repo" solo )
        v-col(cols='2')
            v-btn(@click="search" large color="primary") Поиск

</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import logo from '@/assets/main.svg'
export default {
  name: 'Home',
  components: {
    
  },
  data(){
    return {
      repo: 'ktr0731/evans',
      desserts:[],
      headers:[
        {
            text: 'Login',
            align: 'start',
            value: 'forkOwnerLogin',
          },
          { text: 'Stars', value: 'stars' },
          { text: 'Fork Name', value: 'forkName' },
          { text: 'Url', value: 'forkUrl' },
      ],
      pagination:{
        page:1,
        count:1,
      },
      lastPage:1,
      links:{},
      options:{},
      item:null,
      items:[],
      loading:false,
      logo: logo
    }
  },
  methods: {
    search(){
      let a = this.repo.split('/')
      let owner = a[0]
      let repos = a[1]
      this.$router.push(`/search/${owner}/${repos}`)
    },
    async test(){
      this.loading = true
      const response = await axios.post(`/github`, {
        repo:this.repo
      })
      this.loading = false
      this.$router.push('/result')
      this.$store.dispatch('setState',response.data)

      // this.allForks = response.data.forks
      // this.getPagination.pagination.count = response.data.count
      // this.getLinks.links = response.data.links
    },
    async getDataFromApi(page){

      if(page != this.lastPage){
        this.loading = true
        this.desserts = []
        let url;
        if(page > this.lastPage){
          url = this.links.next
        } else {
          url =  this.links.prev
        }
        // url[url.length-1] = this.pagination.page
        const response = await axios.post(`/url`, {
          url:url
        })
        this.$store.dispatch('setStateData',response.data)

        // this.desserts = response.data.forks
        // this.links = response.data.links
        // this.lastPage = this.pagination.page
        this.loading = false
      }
    }
  },
  watch: {
    pagination: {
        handler () {
          console.log(this.pagination.page)
          console.log(this.lastPage)
          this.getDataFromApi(this.pagination.page)
            .then(data => {
              this.desserts = data.items
              this.totalDesserts = data.total
            })
        },
        deep: true,
      },
  },
  computed:{
    allForks() {
      return this.$store.getters.getAllForks
    },
    allLinks(){
      return this.$storre.getters.getLinks
    },
    getPagination(){
      return this.$store.getters.getPagination
    }
  }
}
</script>
