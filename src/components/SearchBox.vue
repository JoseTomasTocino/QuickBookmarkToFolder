<template>
  <div>
      <input type="text" v-model="searchTerm" placeholder="Enter folder name" autofocus>
  </div>
</template>

<script>
export default {
    data() {
        return {
            searchTerm: ''
        }
    },
    watch: {
        searchTerm: function(newTerm)
        {
            this.$emit('search-term-changed', newTerm);
        }
    },
}
</script>

<style scoped>

input {
    display: block;

    width: 100%;
    flex: 0 0 30px;
    line-height: 30px;
    padding: 0 5px;

    font-family: "Roboto", Helvetica, Arial, sans-serif;
    color: #4a4a4a;

    border: 0;
    border-top: 1px solid #ddd;
    outline: 0;
}
</style>