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
</template>

<script>
// @ is an alias to /src
import logo from '@/assets/main.svg'
export default {
  name: 'Home',
  components: {

  },
  data(){
    return {
      logo: logo
    }
  },
  methods: {
    search(){      
      this.$store.dispatch('search')
      this.$router.push(`/search/results`)
    },
  },
  computed:{
    repository: {
      get: function () {
        return this.$store.getters.repository
      },
      set: function (value) {
        this.$store.commit('setPagination', value)
      }
    },
  }
}
</script>
