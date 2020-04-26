<template lang="pug">
  v-form
    v-img(:src="logo")
    v-container()
      v-row(align='center', justify='center')
        v-col(cols='6')
          v-row(align-content="end").mt-8
            v-text-field(v-model="repository" solo )
        v-col(cols='2')
            v-btn(@click="search" large color="primary") Поиск
    v-container
      v-data-table.elevation-1(
        :headers="headers"
        :options.sync="pagination"
        :server-items-length="pagination.totalItems"
        :loading="loading"
        :items="items"
        :footer-props="footerProps"

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
      footerProps: {
        'disable-items-per-page': true
      }
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
    
  },
  methods:{
    newTab(url){
      window.open(url, '_blank');
    },
    setFavorite(item){
        item.isFavorite = true
        this.$store.dispatch('saveFavorite', item)
    },
    delFavorite(item){
        console.log('deleting',item)
    },
    search(){      
      this.$store.dispatch('search')
    },
  },
  watch: {
    pagination: {
      handler () {
        this.$store.dispatch('queryItems')  
      },
      deep: true
    },
    items: {
      handler() {
        if(this.items.length>0) {
          this.loading = false
        } else {
          this.loading = true
        }
      },
      deep: true
    }
  }
    
}
</script>
