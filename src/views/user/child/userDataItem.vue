<script setup lang="ts">
import { ref, toRefs, onMounted, onBeforeUnmount, type Ref } from "vue";
import { usePopup } from "@/stores/popup";

import type {
  UploadProps,
  UploadRequestOptions,
  UploadFile,
  UploadFiles,
  UploadRawFile,
  UploadUserFile,

} from "element-plus";
import { ElMessage, ElMessageBox } from 'element-plus'
import { commitAvater } from "@/network/updateFile";
import { useRoute, useRouter } from "vue-router";

// 挂载route实例
const route = useRoute();
// 挂载router实例
const router = useRouter();

// 在上传图片之前触发，图片验证规则
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  // 传入格式
  if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png") {
    usePopup().openPopup("请传入jpg / png格式的图片！", "warning");
    return false;
  }
  // 文件大小，这个是2M
  else if (rawFile.size / 1024 / 1024 > 1) {
    usePopup().openPopup("文件大小限制在1MB", "warning");
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
    console.log(error);

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
  ElMessageBox.confirm(
    'proxy will permanently delete the file. Continue?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
        usePopup().openPopup("")
    })
    .catch(() => {
        usePopup().openPopup("")
    })
}
  if (isUpdateAvatarFile.value && avatarFile.value.length !== 0) {
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
</script>
<template>
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
</template>
<style scoped>
.avatar {
  height: 15vh;
  width: 15vh;
  border-radius: 50%;
  overflow: hidden;
}
</style>
