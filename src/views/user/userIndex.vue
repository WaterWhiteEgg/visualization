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

// 在上传图片之前触发，图片验证规则
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  // 传入格式
  if (rawFile.type !== "image/jpeg") {
    usePopup().openPopup("请传入jpg/jpeg格式的图片！", "warning");
    return false;
  }
  // 文件大小，这个是2M
  else if (rawFile.size / 1024 / 1024 > 2) {
    usePopup().openPopup("文件大小限制在2MB", "warning");
    return false;
  }
  // 成功返回
  return true;
};

// 预览图像，应该是ref
const imageUrl = ref("");
// 头像文件列表
const avatarFile = ref([]);
// 头像input的dom
const updateRef = ref();
// 判断是否需要更新页面
const isUpdateAvatarFile = ref(true);

// 上传头像
const updateAvater: (
  options: UploadRequestOptions
) => XMLHttpRequest | Promise<unknown> = async (options) => {
  // 获取文件
  let fd = new FormData();
  fd.append("avatar", options.file);
  // 请求上传接口
  try {
    let res = await commitAvater(fd);
    usePopup().openPopup("请求成功", "success");

    // 重复请求
  } catch (error) {
    // 错误处理
    usePopup().openPopup("网络错误", "error");
  }
};

// 头像input切换时钩子
const onAvatarFileChange: (
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => void = (file, fileListVal) => {
  // 验证图片
  if (!beforeAvatarUpload(file.raw!)) {
    // 处理错误
    return false;
  }

  console.log(fileListVal);

  // 显示图片
  imageUrl.value = URL.createObjectURL(fileListVal[0].raw!);
};

// 执行里面的提交方法
const commitAvatar = () => {
  // 除非更新了文件，否则只用请求一次就够了
  
  if (isUpdateAvatarFile.value) {
    updateRef.value.submit();
    isUpdateAvatarFile.value = false;
    // console.log(res);
  } else {
    usePopup().openPopup("重复的请求", "warning");
  }
};

// 图片成功处理
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  console.log(response, uploadFile);
  // imageUrl.value = URL.createObjectURL(uploadFile.raw!);
};
// 超出一个样式后，清除之前的放入现在传入的文件
const exceed: (files: File[], uploadFiles: UploadUserFile[]) => void = (
  files,
  uploadFiles
) => {
  console.log(files, uploadFiles);

  if (!beforeAvatarUpload(files[0] as UploadRawFile)) {
    // 处理错误
    return false;
  }

  // 清空之前预备上传的文件
  updateRef.value.clearFiles();
  // 上传最新的文件
  updateRef.value.handleStart(files[0]);
  // 显示图片
  imageUrl.value = URL.createObjectURL(files[0]);
  // 更新文件后可以再次请求(其实element-plus的el-upload他的提交方法你没有更新数据也不会请求，我加布尔值只是为了更好的判断)
  isUpdateAvatarFile.value = true;
};

// 销毁前
onBeforeUnmount(() => {
  // 重新显示mainviewIndex
  // usePopup().changeisOpenMainviewIndex(true);
});
</script>
<template>
  <div class="user">
    <div class="user_title">
      <div><img :src="userData.avatar_url" :title="userData.avatar_url" /></div>
      <div class="user_title_name">用户名{{ avatarFile }}</div>
    </div>
    <div class="user_message">
      {{ userData }}
      <div class="user_message_useradmin"></div>
    </div>
    <div class="user_item">
      <el-upload
        class="avatar-uploader"
        :limit="1"
        v-model:file-list="avatarFile"
        :show-file-list="false"
        :on-change="onAvatarFileChange"
        :http-request="updateAvater"
        :drag="true"
        :on-success="handleAvatarSuccess"
        :on-exceed="exceed"
        ref="updateRef"
        :before-upload="beforeAvatarUpload"
        :auto-upload="false"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      </el-upload>
      <el-button class="ml-3" type="success" @click="commitAvatar"
        >提交</el-button
      >
    </div>
  </div>
</template>
<style scoped>
.user {
  display: flex;

  flex-direction: column;
  background-color: #f7f7f7;
}
.user_title {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 20vh;
  background-image: linear-gradient(-90deg, #29bdd9 0%, #276ace 100%);
}
.user_title_name {
  font-size: 2rem;
}
.user_message {
  width: 80vw;
  margin: 0 auto;
  background-color: #fff;
}
.user_item {
  width: 80vw;
  margin: 0 auto;
  background-color: #fff;
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
