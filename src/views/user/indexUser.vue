<script setup lang="ts">
import { ref, toRefs, onMounted, onBeforeUnmount, type Ref } from "vue";
import { usePopup } from "@/stores/popup";
import { useRegister } from "@/stores/register";

import type {
  UploadProps,
  UploadRequestOptions,
  UploadFile,
  UploadFiles,
  UploadRawFile,
  UploadUserFile,
} from "element-plus";

import {
  getUserData,
  userVerifyToken,
  getEasyUserData,
  type Tokendata,
  type UserData,
  type UserAxiosData,
} from "@/network/user";
import { commitAvater } from "../../network/updateFile";
import { useRoute, useRouter } from "vue-router";

import userTitle from "./child/userTitle.vue";
import userDataItem from "./child/userDataItem.vue";
import userMessage from "./child/userMessage.vue";
// 挂载route实例
const route = useRoute();
// 挂载router实例
const router = useRouter();

const props = withDefaults(defineProps<{}>(), {});
const emits = defineEmits<{
  (e: "emit", i: void): void;
}>();

// 渲染的对象
const userData: Ref<UserData | {}> = ref({});
// 判断是否显示token本体才能执行的flag
const isShowMainUserFlag = ref(false);

// 挂载中
onMounted(() => {
  // 取消显示mainviewIndex
  // usePopup().changeisOpenMainviewIndex(false);

  // 由于在解析token时已经获取到数据了，但为了安全起见，进入这个界面需要再一次验证token

  // 判断token存在再做配置
  if (!window.localStorage.getItem("token")) {
    // 3若token没有，则无论如何都进入基础面板信息
    doEasydata(route.params.user_id as string);
  }
  // 有token的情况
  else {
    // 1验证token是否正确，

    userVerifyToken()
      .then((res) => {
        // 全局储存
        useRegister().changeUserData(
          JSON.stringify((res.data as Tokendata).data.user)
        );
        // 1.2若正确，查看token解析出来的id是否是动态路由上传的值
        if (
          (res.data as Tokendata).data.user.user_id !== route.params.user_id
        ) {
          // 2.1如果不是，则进入基础面板信息
          doEasydata(route.params.user_id as string);
        }
        // 2如果是则进入个人界面提供更多操作
        else {
          doUserdata();
        }
      })
      // token错误
      .catch((err) => {
        console.log(err);
        // 1.1如不正确则让他滚去/login再搞一个
        router.push("/login");
      });
  }
});
// 进入基础面板
const doEasydata = (user_id: string) => {
  isShowMainUserFlag.value = false;
  // 请求基本数据,使用动态路由提供的值去寻找

  getEasyUserData(user_id)
    .then((res) => {
      console.log(JSON.parse(res.data.data));
      userData.value = JSON.parse(res.data.data);
    })
    // 还有一种情况是找不到任何id存在的情况
    .catch(() => {
      // 进入错误界面
      router.push("/error");
    });
};
// 进入个人面板,这是直接解析token的
const doUserdata = () => {
  isShowMainUserFlag.value = true;
  // 请求基本数据,使用动态路由提供的值去寻找

  getUserData().then((res) => {
    console.log(res);
    // 全局储存
    useRegister().changeAllUserData((res.data as UserAxiosData).data);
    // 提供数据
    userData.value = JSON.parse((res.data as UserAxiosData).data);
  });
};

// 销毁前
onBeforeUnmount(() => {
  // 重新显示mainviewIndex
  // usePopup().changeisOpenMainviewIndex(true);
});
</script>
<template>
  <div class="user">
    <userTitle :userData="userData"></userTitle>
    <userMessage
      :userData="userData"
      :isShowMainUserFlag="isShowMainUserFlag"
    ></userMessage>
    <userDataItem
      :isShowMainUserFlag="isShowMainUserFlag"
      :userData="userData"
    ></userDataItem>
  </div>
</template>
<style scoped>
.user {
  display: flex;

  flex-direction: column;
  background-color: #f7f7f7;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
@media screen and (max-width: 969px) {
  /* 手机 */
  /* 类平板 */

  .user_message {
    width: 100vw;
  }
  .user_item {
    width: 100vw;
  }
}
</style>
