<template>
  <div class="table-wrap">
    <table class="table" :class="classes">
      <tr v-if="header.length">
        <th
          v-for="(item, index) in header"
          :key="item.id || index"
          :style="{ textAlign: item.position || 'left', width: `${item.width}%` ?? 'auto' }"
        >
          <slot name="header" :item="item">{{ item.name }}</slot>
        </th>
      </tr>
      <tr v-for="(item, index) in rows" :key="item.id || index" @click="$emit('row-click', { item, index })">
        <td
          v-for="(cell, cellIndex) in item.cells"
          :key="cell.id || cellIndex"
          :style="{ textAlign: header[cellIndex]?.position || 'left' }"
        >
          <slot name="cell" :cell="cell">{{ cell.title }}</slot>
        </td>
      </tr>
    </table>
    <div class="loading" v-if="loading">
      <img src="../../../assets/loader.svg" alt="loader">
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { TableRow, TableHeader } from '@/components/UI/Table/table.types'

export default defineComponent({
  name: 'MainTable',
  props: {
    header: {
      type: Array as PropType<TableHeader[]>,
      default: () => []
    },
    rows: {
      type: Array as PropType<TableRow[]>,
      required: true
    },
    noTop: {
      type: Boolean,
      default: false
    },
    noLeft: {
      type: Boolean,
      default: false
    },
    noRight: {
      type: Boolean,
      default: false
    },
    noBottom: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['row-click'],
  setup(props) {
    const classes = computed(() => ({
      'no-top': props.noTop,
      'no-left': props.noLeft,
      'no-right': props.noRight,
      'no-bottom': props.noBottom,
      'no-header': !props.header?.length || true
    }))

    return { classes }
  }
})
</script>

<style lang="scss" scoped>
$border: 1px solid $cs-border;

.table-wrap {
  width: 100%;
  .table {
    width: 100%;
    border-collapse: collapse;
    &.no-header {
      tr:first-child {
        td {
          border-top: $border;
        }
      }
    }
    &.no-left {
      tr {
        th, td {
          &:first-child {
            border-left: none;
          }
        }
      }
    }
    &.no-right {
      tr {
        th, td {
          &:last-child {
            border-right: none;
          }
        }
      }
    }
    &.no-bottom {
      tr {
        &:last-child {
          td {
            border-bottom: none;
          }
        }
      }
    }
    &.no-top {
      tr {
        th {
          border-top: none;
        }
      }
    }
    tr {
      height: 44px;
      &:hover {
        cursor: pointer;
        td {
          background-color: $cs-light-grey;
        }
      }
      th {
        border-top: $border;
        border-bottom: $border;
        padding: 5px 18px;
        line-height: 150%;
        font-size: 14px;
        color: $cs-secondary;
        font-weight: 600;
        &:first-child {
          border-left: $border;
        }
        &:last-child {
          border-right: $border;
        }
      }
      td {
        font-size: 14px;
        font-weight: 500;
        border-bottom: $border;
        line-height: 150%;
        padding: 5px 18px;
        &:first-child {
          border-left: $border;
        }
        &:last-child {
          border-right: $border;
        }
      }
    }
  }
  .loading {
    display: flex;
    justify-content: center;
    padding: 20px;
  }
}
</style>
