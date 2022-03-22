<template>
  <div class="auth">
    <box class="auth-block" border-radius="8px" padding="20px">
      <div class="logo">
        <m-icon icon="view_in_ar" class="icon" />
        <h4 class="title">CSTORE ADMIN</h4>
      </div>
      <div class="content" v-if="content === 'email'">
        <text-field :disabled="loading" id="auth-email" class="field" v-model:text="email" placeholder="Email" />
        <text-field :disabled="loading" id="auth-password" class="field" v-model:text="password" placeholder="Пароль" />
      </div>
      <div class="content" v-if="content === 'phone'">
        <info-text>
          Для входа мы совершим звонок на Ваш номер телефона. Это бесплатно.
        </info-text>
        <text-field :disabled="loading" id="auth-phone" class="field" v-model:text="phone" placeholder="Номер телефона" />
      </div>
      <div class="content" v-if="content === 'code'">
        <info-text>
          На номер <b>{{ internationalFormat }}</b> в течение нескольких секунд поступит звонок.
          Вам нужно ввести <b>последние 4 цифры</b> этого номера.
        </info-text>
        <info-text>
          Не получили звонок?
          <template v-if="recall > 0">Позвонить еще раз через <b>{{ recallValue }}</b></template>
          <b v-else class="recall-action" @click="loginRequestPhone">
            Позвонить еще раз
          </b>
        </info-text>
        <text-field :disabled="loading" id="auth-code" class="field" v-model:text="code" placeholder="Последние 4 цифры" />
      </div>
      <div class="actions">
        <span class="action-link" @click="changeContent">{{ actionLinkText }}</span>
        <main-button :disabled="disabledButton" fill @click="sendRequest">
          {{ content === 'phone' ? 'Позвонить' : 'Войти в аккаунт' }}
        </main-button>
      </div>
    </box>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import Box from '@/components/UI/Box.vue'
import TextField from '@/components/UI/TextField.vue'
import MainButton from '@/components/UI/MainButton.vue'
import InfoText from '@/components/UI/InfoText.vue'
import MIcon from '@/components/UI/MIcon.vue'
import { useUserStore } from '@/stores/user.store'
import { useToastsStore } from '@/stores/toasts.store'
import { useRouter } from 'vue-router'
import { usePhone, wordTypes } from '@/utils'
import { useEmail } from '@/validators'
import { useLoaderStore } from '@/stores/loader.store'
import { storeToRefs } from 'pinia'

type Content = 'email' | 'phone' | 'code'

export default defineComponent({
  name: 'Auth',
  components: { InfoText, MIcon, MainButton, TextField, Box },
  async setup() {
    const loaderStore = useLoaderStore()
    const userStore = useUserStore()
    const toastsStore = useToastsStore()
    const content = ref<Content>('email')
    const router = useRouter()

    const {
      value: email,
      isValid: isValidEmail
    } = useEmail('')
    const password = ref('')
    const code = ref('')
    const { phone, internationalFormat, isPhoneValid } = usePhone('')

    const { loading } = storeToRefs(loaderStore)

    const recallInterval = ref<null | number>(null)
    const recall = ref(0)
    
    const recallValue = computed(() => {
      return `${recall.value} ${ wordTypes(recall.value, ['секунду', 'секунды', 'секунд']) }`
    })

    const disabledButton = computed(() => {
      let condition = false
      if (content.value === 'phone') {
        condition = !isPhoneValid.value
      } else if (content.value === 'email') {
        condition = !isValidEmail.value || !password.value.trim()
      } else if (content.value === 'code') {
        condition = code.value.length < 4
      }
      return condition || loaderStore.loading
    })

    const redirect = () => {
      if (recallInterval.value) {
        clearInterval(recallInterval.value)
      }
      const returnUrl = router.currentRoute.value.query['returnUrl']
      if (typeof returnUrl === 'string') {
        router.push({ path: returnUrl })
      } else {
        router.push({ name: 'Main' })
      }
    }

    const loginEmail = async () => {
      try {
        await userStore.loginEmail({ email: email.value, password: password.value })
        redirect()
      } catch (e) {
        toastsStore.$show({
          type: 'danger',
          text: `⛔ ${e.message}`
        })
      }
    }

    const loginRequestPhone = async () => {
      try {
        await userStore.loginRequestPhone({
          phone: internationalFormat.value
        })
        content.value = 'code'
        startRecallInterval()
      } catch (e) {
        toastsStore.$show({
          type: 'danger',
          text: `⛔ ${e.message}`
        })
      }
    }

    const loginPhone = async () => {
      try {
        await userStore.loginPhone({
          code: code.value,
          phone: internationalFormat.value
        })
        redirect()
      } catch (e) {
        toastsStore.$show({
          type: 'danger',
          text: `⛔ ${e.message}`
        })
      }
    }

    const startRecallInterval = () => {
      recall.value = 60
      recallInterval.value = setInterval(() => {
        recall.value -= 1
        if (recallInterval.value && recall.value === 0) {
          clearInterval(recallInterval.value)
        }
      }, 1000)
    }

    const sendRequest = () => {
      if (content.value === 'email') {
        loginEmail()
      } else if (content.value === 'phone') {
        loginRequestPhone()
      } else if (content.value === 'code') {
        loginPhone()
      }
    }

    const changeNumber = () => {
      content.value = 'phone'
      if (recallInterval.value) {
        clearInterval(recallInterval.value)
      }
    }

    const changeContent = () => {
      if (content.value === 'email') {
        content.value = 'phone'
      } else if (content.value === 'phone') {
        content.value = 'email'
      } else if (content.value === 'code') {
        changeNumber()
      }
    }

    const actionLinkText = computed(() => {
      switch (content.value) {
        case 'email':
          return 'Войти по телефону'
        case 'phone':
          return 'Войти по почте'
        default:
          return 'Сменить номер'
      }
    })

    return {
      code,
      email,
      password,
      content,
      sendRequest,
      phone,
      actionLinkText,
      changeContent,
      disabledButton,
      internationalFormat,
      loginRequestPhone,
      recall,
      recallValue,
      loading
    }
  }
})
</script>

<style lang="scss" scoped>
.auth {
  display: flex;
  justify-content: center;
  padding-top: 80px;
  .auth-block {
    padding: 20px;
    width: 380px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .content {
      width: 100%;
    }
    .field {
      margin-bottom: 10px;
    }
    .actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      .action-link {
        font-size: 14px;
        color: $cs-secondary;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
}
.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  margin-bottom: 20px;
  .icon {
    padding-right: 7px;
    color: $cs-primary;
  }
  .title {
    font-size: 18px;
    color: $cs-black;
  }
}
.recall-action {
  text-decoration: underline;
  cursor: pointer;
}
</style>
