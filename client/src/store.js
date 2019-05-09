import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
  		status: '',
  		token: localStorage.getItem('token') || '',
  		users : localStorage.getItem('users') || '',
			requestCount : 0
	},
	mutations: {
		auth_request(state){
	    	state.status = 'loading'
	  	},
	  	auth_success(state, token){
		    state.status = 'success'
		    state.token = token
		    // state.users = users
	  	},
      user_data(state, users){
        state.users = users
      },
	  	auth_error(state){
	    	state.status = 'error'
	  	},
			set_count (state, requestCount){
        state.requestCount = requestCount
      },
	  	logout(state){
	    	state.status = ''
	    	state.token = ''
	  	},
	},
	actions: {
	  	login({commit}, user){
	        return new Promise((resolve, reject) => {
	            commit('auth_request')
              axios
              .post("http://localhost:3000/api/logins/login", user)
              .then(resp => {
                // console.log(resp.data);
	                const token = resp.data.id
	                let users = resp.data.userId
                  // console.log(users);
	                localStorage.setItem('token', token)
                  localStorage.setItem('users', users)
                   // console.log(localStorage.getItem('users'));
	                // Add the following line:
	                axios.defaults.headers.common['Authorization'] = token
	                commit('auth_success', token)
                  commit('user_data', users)
	                resolve(resp)
	            })
	            .catch(err => {
	                commit('auth_error')
	                localStorage.clear();
	                reject(err)
	            })
	        })
	    },
			deleteRequest({commit},id){
        return new Promise((resolve,reject) => {
          axios.delete("http://localhost:3000/api/requests/"+id)
          .then(delres => {
            axios.get("http://localhost:3000/api/requests")
            .then(data => {
              let requestCount = data.data.length
              commit('set_count', requestCount)
              resolve(delres)
            })
            .catch(err => {
              console.log(err);
              reject(err)
            })
            // console.log(delres);
          }).catch(delerr => console.log(delerr))
        })
      },
      getRequest({commit}){
        return new Promise((resolve,reject) => {
          axios.get("http://localhost:3000/api/requests/")
          .then(getres => {
            let requestCount = getres.data.length
            commit('set_count', requestCount)
            // console.log(delres);
          }).catch(delerr => console.log(delerr))
        })
      },
	    // register({commit}, user){
	    // 	return new Promise((resolve, reject) => {
	    //         commit('auth_request')
	    //         axios({url: 'http://localhost:3000/register', data: user, method: 'POST' })
	    //         .then(resp => {
	    //             const token = resp.data.token
	    //             const user = resp.data.user
	    //             localStorage.setItem('token', token)
	    //             // Add the following line:
	    //             axios.defaults.headers.common['Authorization'] = token
	    //             commit('auth_success', token, user)
	    //             resolve(resp)
	    //         })
	    //         .catch(err => {
	    //             commit('auth_error', err)
	    //             localStorage.removeItem('token')
	    //             reject(err)
	    //         })
	    //     })
	    // },
	  	logout({commit}){
		    return new Promise((resolve, reject) => {
		      	commit('logout')
		      	localStorage.clear();
		      	delete axios.defaults.headers.common['Authorization']
		      	resolve()
		    })
	  	}
	},
	getters : {
	  isLoggedIn: state => !!state.token,
	  authStatus: state => state.status,
	}
})
