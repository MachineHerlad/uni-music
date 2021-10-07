import App from './App'
import store from './store/index.js'

// #ifndef VUE3
import Vue from 'vue'

Vue.filter('formatCount', function(value) {
	if(value > 10000 && value <= 10000000) {
		value /= 1000
		return value.toFixed(1) +'万'
	} else if(value > 10000000) {
		value /= 10000000
		return value.toFixed(1)+'亿'
	} else {
		return value
	}
})

Vue.filter('formatTime', function(value) {
	var date = new Date(value)
	return date.getFullYear() + '年' + (date.getMonth()+1) + '月' + (date.getDay()+1) + '日'
})

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif