
require('./bootstrap');

window.Vue = require('vue');

//Snotify
import Snotify, { SnotifyPosition } from 'vue-snotify'

const SnotifyOptions = {
    toast: {
        position: SnotifyPosition.rightTop
    }
}

Vue.use(Snotify, SnotifyOptions)

//v-form
import { Form, HasError, AlertError } from 'vform'

window.Form = Form


//progressbar
import VueProgressBar from 'vue-progressbar'

const VueProgressBarOptions = {
    color: '#24fa35',
    failedColor: '#874b4b',
    thickness: '5px',
    transition: {
        speed: '0.2s',
        opacity: '0.6s',
        termination: 300
    },
    autoRevert: true,
    location: 'top',
    inverse: false
}

Vue.use(VueProgressBar, VueProgressBarOptions)

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('customer-component', require('./components/CustomersComponent.vue').default);
Vue.component('pagination', require('./components/PaginateComponent').default);

Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)



const app = new Vue({
    el: '#app',
});
