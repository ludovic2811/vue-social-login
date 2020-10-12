import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import vuefire 			from "@/firebase/vuefire"



import Config from '@/views/config/index.vue'

import Client from '@/views/client/index.vue'

import Planning from '@/views/planning/index.vue'

import Impaye from '@/views/impaye/index.vue'

import confirmDeleteAgence from '@/views/config/confirmDeleteAgence.vue'

import Reporting from '@/views/reporting/index.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/register.vue'
import Index from '@/views/Index.vue'
import Verify from '@/views/auth/verify.vue'
import ResetPwd from '@/views/auth/ResetPwd.vue'
import InstagramAuth from '@/views/InstagramAuth.vue'

import contact from '@/views/contact/contact.vue'

import term from '@/views/terms/term.vue'
import privacy from '@/views/terms/privacy.vue'
import notverified from '@/views/auth/notverified.vue'
Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      redirect: '/index'
    },
    {
      path: '/notverified',
      name: 'notverified',
      component: notverified
    },
    {
      path: "/term",
      name: "term",
      component: term
    },
    {   
      path: "/privacy",
      name: "privacy",
      component: privacy
    },
    {
      path: '/',
      redirect: '/index'
    },  
    {
      path: '/index',
      name: 'index',
      component: Index
    },
    
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/verify',
      name: 'verify',
      component: Verify
    },
    {
      path: '/ResetPwd',
      name: 'ResetPwd',
      component: ResetPwd
    },
    {
      path: '/instagramauth',
      name: 'instagramauth',
      component: InstagramAuth
    },
    {
      path:'/contact',
      name:'contact',
      component: contact,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/client',
      name: 'Client',
      component: Client,
      meta: {
        requiresAuth: true,
        requireAgence: true
      }
    },
    {
      path: '/impaye',
      name: 'Impaye',
      component: Impaye,
      meta: {
        requiresAuth: true,
        requireAgence: true
      }
    },
    
    {
      path: '/config',
      name: 'Config',
      component: Config,
      meta: {
        requiresAuth: true
      }
    },   
    {
        path: '/config/:idAgence',
        name: 'DeleteAgence',
        component: confirmDeleteAgence,
        meta: {
          requiresAuth: true
        }
    },
    {
      path: '/planning',
      name: 'Planning',
      component: Planning,
      meta: {
        requiresAuth: true,
        requireAgence: true
      }
    },   
    {
      path: '/reporting',
      name: 'reporting',
      component: Reporting,
      meta: {
        requiresAuth: true,
        requireAgence: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
 
  const currentUser = firebase.auth().currentUser;
  
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requireAgence = to.matched.some((record) => record.meta.requireAgence);
  
  if (to.name == "index" && to.query.mode == "verifyEmail")
    next({name: "verify", query: to.query});
  else if (to.name == "index" && to.query.mode == "resetPassword")
    next({name: "ResetPwd", query: to.query});
  else
  if (requiresAuth && !currentUser) {
    next('login');
  }
   else {

     if (requiresAuth) {
      
        if (!currentUser.emailVerified) {
         
            if (to.name =="notverified" || to.name == "login")
                next();
            else
              next('notverified');
        }
        else
        if (requireAgence) {
         
          if (typeof(vuefire.store.getters.getAgence.id) == "undefined") {
             
              next('config');
          }
          else {
            
            if (vuefire.store.getters.getSubscription == null) {
              next();
            }
            else if (vuefire.store.getters.getSubscription.subscription.status != "active") {
            
                next('config');
            }
            else 
              next();
          }
        }
        else {
        
          next();
        }
          
        
    }
    else {
    
      next();
    }
  }
});

export default router;