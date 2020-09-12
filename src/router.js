import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import Home from '@/views/Home.vue'

import Config from '@/views/config/index.vue'

import Client from '@/views/client/index.vue'

import Planning from '@/views/planning/index.vue'

import Impaye from '@/views/impaye/index.vue'


import Login from '@/views/Login.vue'
import Index from '@/views/Index.vue'
import test from '@/views/test.vue'
import InstagramAuth from '@/views/InstagramAuth.vue'


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
      path: '/test',
      name: '/test',
      component: test
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
      path: '/instagramauth',
      name: 'instagramauth',
      component: InstagramAuth
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/client',
      name: 'Client',
      component: Client,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/impaye',
      name: 'Impaye',
      component: Impaye,
      meta: {
        requiresAuth: true
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
      path: '/planning',
      name: 'Planning',
      component: Planning,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/clients',
      name: 'clients',
      component: Home,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth && !currentUser) {
    next('index');
  } /*else if (!requiresAuth && currentUser) {
    next('home');
  }*/ else {
    next();
  }
});

export default router;