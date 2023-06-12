<script lang="ts" setup name="config">
import {getAddressBook, editAddressBook} from "@/api/app/addressbook";

const configData = ref({
  addressBook: "",
})
const reload = () => {
  getAddressBook().then(res => {
    configData.value.addressBook = res.addressBook
  })
}
reload()
const handleCancel = () => {
  reload()
}
const handleUpdate = () => {
  editAddressBook({
    addressBook: configData.value.addressBook
  }).then(() => {
    reload()
  }).catch(() => {
  })
}
</script>
<template>
  <el-card class="!border-none" shadow="never">
    <div class="mt-4">
      <el-divider content-position="left"><span class="text-2xl font-bold">通讯录配置</span>
      </el-divider>
      <el-form :model="configData" label-width="120px" class="mt-4">
        <el-form-item label="使用逗号隔开">
          <el-input type="textarea" v-model="configData.addressBook" autosize/>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-button v-perms="['app:addressbook:edit']" type="success" @click="handleUpdate">
        提交修改
      </el-button>
      <el-button type="info" @click="handleCancel">
        取消修改
      </el-button>
    </div>
  </el-card>

</template>

<style lang="scss" scoped>
.menu {
  &.theme-dark {
    .el-menu {
      :deep(.el-menu-item) {
        &.is-active {
          @apply bg-primary border-primary;
        }
      }
    }

    :deep(.el-menu--collapse) {
      .el-sub-menu.is-active .el-sub-menu__title {
        @apply bg-primary #{!important};
      }
    }
  }

  &.theme-light {
    :deep(.el-menu) {
      .el-menu-item {
        border-color: transparent;

        &.is-active {
          @apply bg-primary-light-9 border-r-2 border-primary;
        }
      }

      .el-menu-item:hover,
      .el-sub-menu__title:hover {
        color: var(--el-color-primary);
      }
    }
  }

  .el-menu {
    border-right: none;

    &:not(.el-menu--collapse) {
      width: var(--aside-width);
    }
  }
}
</style>
