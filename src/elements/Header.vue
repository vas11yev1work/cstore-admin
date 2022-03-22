<template>
  <header class="main-header">
    <div class="navigation-side">
      <router-link to="/" class="logo">
        <m-icon icon="view_in_ar" class="icon" />
        <h4 class="title">CSTORE ADMIN</h4>
      </router-link>
      <menu class="menu">
        <li class="menu-item">
          <router-link :to="{ name: 'Editor' }" class="menu-item-link">
            <span class="menu-item-text">Редактирование</span>
          </router-link>
        </li>
        <li class="menu-item">
          <router-link :to="{ name: 'CreateFastOrder' }" class="menu-item-link">
            <span class="menu-item-text">Создать быстрый заказ</span>
          </router-link>
        </li>
        <li class="menu-item">
          <router-link :to="{ name: 'Order' }" class="menu-item-link">
            <span class="menu-item-text">Заказы</span>
          </router-link>
        </li>
      </menu>
    </div>
    <div class="user-side">
      <button class="logout" @click="$emit('logout')">
        Выход
      </button>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MIcon from '@/components/UI/MIcon.vue'

export default defineComponent({
  name: 'Header',
  components: { MIcon },
  emits: ['logout']
})
</script>

<style lang="scss" scoped>
.main-header {
  z-index: 1;
  height: 70px;
  background-color: $cs-white;
  width: 100%;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.04);
  padding: 0 40px;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .navigation-side {
    display: flex;
    height: 100%;
    align-items: center;
    .logo {
      display: flex;
      align-items: center;
      text-decoration: none;
      margin-right: 70px;
      .icon {
        padding-right: 7px;
        color: $cs-primary;
      }
      .title {
        font-size: 18px;
        color: $cs-black;
      }
    }
    .menu {
      height: 100%;
      display: flex;
      .menu-item {
        height: 100%;
        margin-right: 50px;
        font-size: 16px;
        &:last-child {
          margin-right: 0;
        }
        .menu-item-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          height: 100%;
          color: $cs-secondary;
          font-weight: 600;
          &.router-link-active {
            color: $cs-primary;
            position: relative;
            &::after {
              content: '';
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              height: 2px;
              background-color: $cs-primary;
            }
          }
        }
      }
    }
  }
  .user-side {
    height: 100%;
    .logout {
      height: 100%;
      padding: 0 15px;
      border: none;
      background-color: transparent;
      font-size: 16px;
      font-weight: 500;
      color: $cs-primary;
    }
  }
}
</style>
