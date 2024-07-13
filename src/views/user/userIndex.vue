<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, type Ref } from "vue";
import { usePopup } from "@/stores/popup";
import { useRegister } from "@/stores/register";
import {
  getUserData,
  userVerifyToken,
  getEasyUserData,
  type Tokendata,
} from "@/network/user";
import { useRoute, useRouter } from "vue-router";
// 挂载route实例
const route = useRoute();
// 挂载router实例
const router = useRouter();
// userdata数据类型
export interface UserData {
  username: string;
  status?: number;
  descs: string;
  gender: number;
  user_id: string;
  is_guest?: number;
  email?: string;
  phone_number?: string;
  registration_time: string;
  last_time: string;
  login_count?: number;
  is_active: number;
  is_admin?: number;
}
// 渲染的对象
const userData: Ref<UserData | {}> = ref({});
// 判断是否显示token本体才能执行的flag
const isShowMainUserFlag = ref(false);
// 挂载中
onMounted(() => {
  // 取消显示mainviewIndex
  // usePopup().changeisOpenMainviewIndex(false);

  // 由于在解析token时已经获取到数据了，但为了安全起见，进入这个界面需要再一次验证token
  // console.log(userinfo);
  // console.log(route.params.user_id);

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

  getEasyUserData(user_id).then((res) => {
    // console.log(JSON.parse(res.data.data));
    userData.value = JSON.parse(res.data.data);
  });
};
// 进入个人面板,这是直接解析token的
const doUserdata = () => {
  isShowMainUserFlag.value = true;
  // 请求基本数据,使用动态路由提供的值去寻找

  getUserData().then((res) => {
    console.log(res);
    userData.value = JSON.parse(res.data.data);
  });
};
// 销毁前
onBeforeUnmount(() => {
  // 重新显示mainviewIndex
  // usePopup().changeisOpenMainviewIndex(true);
});

const props = withDefaults(defineProps<{}>(), {});
const emits = defineEmits<{
  (e: "emit", i: void): void;
}>();
</script>
<template>
  <div class="user">
    <div class="user_title">img</div>
    <div class="user_message">
      {{ userData }}
      <div class="user_message_useradmin"></div>
    </div>
    <div class="user_item">item</div>
  </div>
</template>
<style scoped>
.user {
  display: flex;
  flex-direction: column;
}
.user_title {
  width: 100vw;
  height: 20vh;
  background-color: red;
}
.user_message {
  width: 100vw;
}
</style>
