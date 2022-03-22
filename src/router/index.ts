import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.store'
import { InitStores } from '@/stores/initStores'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Main',
    component: () => import(/* webpackChunkName: "main" */ '@/layouts/Main.vue'),
    meta: { requireAuthorized: true },
    redirect: { name: 'Editor' },
    children: [
      {
        path: 'editor',
        name: 'Editor',
        component: () => import(/* webpackChunkName: "editor" */ '@/views/editor/Editor.vue'),
        redirect: { name: 'Categories' },
        children: [
          {
            path: 'categories',
            name: 'Categories',
            component: () => import(/* webpackChunkName: "categories" */ '@/views/editor/Categories.vue')
          },
          {
            path: 'colors',
            name: 'Colors',
            component: () => import(/* webpackChunkName: "index" */ '@/views/editor/Colors.vue')
          },
          {
            path: 'sizes',
            name: 'Sizes',
            component: () => import(/* webpackChunkName: "sizes" */ '@/views/editor/Sizes.vue')
          },
          {
            path: 'create-item',
            name: 'CreateCatalogItem',
            component: () => import(/* webpackChunkName: "catalog-item" */ '@/views/editor/CatalogItem.vue')
          },
          {
            path: ':id/edit-item',
            name: 'EditCatalogItem',
            component: () => import(/* webpackChunkName: "edit-item" */ '@/views/editor/CatalogItem.vue')
          },
          {
            path: 'catalog-list',
            name: 'CatalogList',
            meta: { container: 1320 },
            component: () => import(/* webpackChunkName: "catalog-list" */ '@/views/editor/CatalogList.vue')
          },
          {
            path: ':id/sizes',
            name: 'CatalogItemSizes',
            meta: { container: 960 },
            component: () => import(/* webpackChunkName: "catalog-item-sizes" */ '@/views/editor/CatalogItemSizes.vue'),
          }
        ]
      },
      {
        path: 'create-fast-order',
        name: 'CreateFastOrder',
        meta: { container: 960 },
        component: () => import(/* webpackChunkName: "create-fast-orders" */ '@/views/CreateFastOrder.vue'),
      },
      {
        path: '/orders',
        name: 'Order',
        redirect: { name: 'OrdersList' },
        component: () => import(/* webpackChunkName: "create-fast-orders" */ '@/views/orders/Orders.vue'),
        children: [
          {
            path: 'create-order',
            name: 'CreateOrder',
            component: () => import(/* webpackChunkName: "create-orders" */ '@/views/orders/CreateOrder.vue'),
          },
          {
            path: 'list',
            name: 'OrdersList',
            component: () => import(/* webpackChunkName: "orders-list" */ '@/views/orders/views/OrdersList.vue'),
            meta: { container: 1320 }
          },
          {
            path: 'for',
            name: 'OrdersByPhone',
            component: () => import(/* webpackChunkName: "orders-by-phone" */ '@/views/orders/views/OrdersByPhone.vue')
          },
          {
            path: 'code',
            name: 'OrderByCode',
            component: () => import(/* webpackChunkName: "order-by-code" */ '@/views/orders/views/OrderByCode.vue')
          },
          {
            path: ':id',
            name: 'OrderView',
            component: () => import(/* webpackChunkName: "order-view" */ '@/views/orders/views/OrderView.vue'),
            meta: { container: 1320 }
          }
        ]
      }
    ]
  },
  {
    path: '/auth',
    name: 'Auth',
    meta: { requireAnonymous: true },
    component: () => import(/* webpackChunkName: "auth" */ '@/layouts/Auth.vue'),
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

let initStores: boolean

router.beforeEach(async (to, from, next) => {
  if (!initStores) initStores = await InitStores()

  const store = useUserStore()

  if (to.matched.some(x => x.meta.requireAnonymous) && store.isLoggedIn) {
    const returnUri = to.query['returnUrl']
    if (typeof returnUri === 'string')
      next({ path: returnUri })
    else
      next({ name: 'Main' })
  } else if (to.matched.some(x => x.meta.requireAuthorized) && !store.isLoggedIn) {
    next({ name: 'Auth', query: { returnUrl: to.fullPath } })
  } else {
    next()
  }
})

export default router
