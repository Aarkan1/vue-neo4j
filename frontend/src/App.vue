<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
    <button class="btn">Click me</button>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$M.AutoInit() 

    console.log(this.$M)
  }
}
</script>

<style lang="scss" src="./globalStyles.scss">
</style>
