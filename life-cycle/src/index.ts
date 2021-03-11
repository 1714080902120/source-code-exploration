import Vue from './vue'

const vue = new Vue({
  el: '#app',
  data: () => {
    return {
      items: [
        'tom', 'jerry', 'marry'
      ],
      inputValue: '123',
      test: true
    }
  },
  methods: {
    changeColor() {
      console.log('changeColor')
    },
    goAlert() {
      console.log('goAlert')
    }
  },
  watch: {
    test (newVal: boolean, oldVal: boolean) {
      console.log(newVal, oldVal)
    },
    deep: true,
    immediate: true
  },
  computed: {},
  components: {},
  beforeCreate() { console.log('beforeCreate') },
  created() { console.log('created') },
  beforeMounted() { console.log('beforeMounted') },
  mounted() { console.log('mounted') },
  beforeUpdate() { console.log('beforeUpdate') },
  updated() { console.log('updated') },
  beforeDestroy() { console.log('beforeDestroy') },
  destoryed() { console.log('destoryed') }
})

vue._data.test = false
vue._data.items.push('jack')
console.log(vue)
