<template>
  <div class="file-uploader">
    <input class="file-uploader-input" ref="fileUploader" type="file" :multiple="multiple" @change="onInputChange">
    <button
      class="uploader-button"
      :disabled="disabled"
      @click="fileUploader?.click()"
      @dragenter.prevent="dragenter"
      @dragleave.prevent="dragleave"
      @dragover.prevent="dragover"
      @drop.prevent="drop"
    >
      <m-icon icon="add_photo_alternate" font-size="24" class="upload-icon" />
      <span class="uploader-button-text">{{ text }}</span>
      <div class="button-percentage" v-if="percentage && showButtonPercentage">
        <div class="value" :style="{ width: percentage }" />
      </div>
    </button>
    <div class="percentage" v-if="percentage && showPercentage">
      <div class="value" :style="{ width: percentage }" />
    </div>
    <ul class="files-list" v-if="files.length && showNames">
      <li class="file-name" v-for="(file, index) in files" :key="index">
        {{ file.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import MIcon from '@/components/UI/MIcon.vue'

export default defineComponent({
  name: 'FileUploader',
  components: { MIcon },
  emits: ['update:files', 'upload'],
  props: {
    files: {
      type: Array,
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    showNames: {
      type: Boolean,
      default: false
    },
    percentage: {
      type: String,
      default: ''
    },
    showPercentage: {
      type: Boolean,
      default: false
    },
    showButtonPercentage: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: 'Перетащите или нажмите здесь'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const fileUploader = ref<null | HTMLInputElement>(null)

    function onInputChange() {
      const fileList: Array<File> = [...(fileUploader.value?.files ? fileUploader.value?.files : [])]
      emit('update:files', fileList)
      emit('upload', fileList)
    }

    function dragenter() {
      console.log('dragenter')
    }

    function dragleave() {
      console.log('dragleave')
    }

    function dragover() {
      console.log('dragover')
    }

    function drop(e: DragEvent) {
      const fileList: Array<File> = [...(e.dataTransfer?.files ? e.dataTransfer?.files : [])]
      emit('update:files', props.multiple ? [fileList[0]] : fileList)
      emit('upload', fileList)
    }

    watch(() => props.files, (v) => {
      if (!v.length && fileUploader.value) {
        fileUploader.value.value = ''
      }
    })

    return {
      onInputChange,
      fileUploader,
      dragenter,
      dragleave,
      dragover,
      drop
    }
  }
})
</script>

<style lang="scss" scoped>
.file-uploader-input {
  display: none;
}
.uploader-button {
  padding: 15px 10px;
  width: 100%;
  position: relative;
}

.button-percentage {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  height: 5px;
  width: 80%;
  background-color: lighten($cs-primary, 40%);
  border-radius: 5px;
  overflow: hidden;
  .value {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: $cs-primary;
    width: 30%;
  }
}

.percentage, {
  position: relative;
  height: 20px;
  background-color: $cs-primary-light;
  margin-top: 7px;
  border-radius: 3px;
  overflow: hidden;
  .value {
    top: 0;
    left: 0;
    bottom: 0;
    position: absolute;
    background-color: $cs-primary;
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-image: linear-gradient(
        -45deg,
        rgba(255, 255, 255, .2) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, .2) 50%,
        rgba(255, 255, 255, .2) 75%,
        transparent 75%,
        transparent
      );
      z-index: 1;
      background-size: 50px 50px;
      animation: move 1.5s linear infinite;
      overflow: hidden;
    }
  }
}
@keyframes move {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 50px 50px;
  }
}
.files-list {
  margin-top: 7px;
  .file-name {
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 14px;
    margin-bottom: 4px;
    font-weight: 500;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.uploader-button {
  //height: 80px;
  width: 100%;
  height: 100%;
  user-select: none;
  background-color: $cs-primary-light;
  border: 2px dashed $cs-primary;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  &:focus {
    outline: none;
    border-style: solid;
  }
  .upload-icon {
    margin-bottom: 2px;
    color: $cs-primary;
  }
  .uploader-button-text {
    font-size: 14px;
    font-weight: 600;
    color: $cs-primary;
  }
}
</style>
