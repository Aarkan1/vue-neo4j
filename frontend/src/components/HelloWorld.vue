<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>{{ thisIsAcomputed }}</h2>

    <input type="text" v-model="name">

    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    
  </div>
</template>

<script>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component()
export default class HelloWorld extends Vue {
  // data()
  name = 'HelloWorld'

  // props: ['msg']
  @Prop() msg

  // @Emit('onEmit')
  // emittingData() {
  //   return 'hej hej'
  // }

  // methods
  someMethod() {
    this.$emit('onEmit', {data: 'hej'})

    // this.emittingData()
  }

  // computed
  get thisIsAcomputed() {
    return 'Hej hej'
  }

  @Watch('name')
  onNameChange(val) {
    console.log('new name', val);
  }

  async created() {
    let articles = await fetch('/rest/articles')
    articles = await articles.json()
    console.log(articles)
  }

  mounted() {

  }

  beforeDestroy() {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hello {
  h1 {

  }

  ul {

    li {
      
    }

  }
}

.hello > h1 {

}

.hello > ul {

}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
