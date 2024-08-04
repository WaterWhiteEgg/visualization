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
import { ElMessageBox } from "element-plus";
import { commitAvater } from "@/network/updateFile";
import { AxiosError } from "axios";

// 加载flag
const isStartUpdateLoading = ref(false);

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
    usePopup().openPopup("请求成功,刷新页面查看", "success");
    // 修改按钮
    isUpdateAvatarFile.value = false;
    // 直接结束加载动画
    isStartUpdateLoading.value = false;
  } catch (error) {
    // 错误处理
    // 报错有内容优先显示
    usePopup().openPopup(
      ((error as AxiosError).response?.data as { error: string; status: 0 | 1 })
        .error || "网络错误",
      "error"
    );
    // 直接结束加载动画
    isStartUpdateLoading.value = false;
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
  // 加载中动画
  isStartUpdateLoading.value = true;
  //   弹窗选择
  ElMessageBox.confirm("确定上传文件吗？", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    // 确定选择
    .then(() => {
      // 除非更新了文件，否则只用请求一次就够了
      if (isUpdateAvatarFile.value && avatarFile.value.length !== 0) {
        // 请求上传
        updateRef.value.submit();
      } else {
        usePopup().openPopup("错误的请求", "error");
        // 直接结束加载动画
        isStartUpdateLoading.value = false;
      }
    })
    // 取消选择
    .catch((err) => {
      // 直接结束加载动画
      isStartUpdateLoading.value = false;
    });
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
  // 加载中动画
  isStartUpdateLoading.value = true;

  // 清空之前预备上传的文件
  updateRef.value.clearFiles();
  // 上传最新的文件
  updateRef.value.handleStart(files[0]);
  // 显示图片
  imageUrl.value = URL.createObjectURL(files[0]);
  // 更新文件后可以再次请求(其实element-plus的el-upload他的提交方法你没有更新数据也不会请求，我加布尔值只是为了更好的判断)
  isUpdateAvatarFile.value = true;

  // 直接结束加载动画
  isStartUpdateLoading.value = false;
};
</script>
<template>
  <el-upload
    class="user_item_uploader"
    v-loading="isStartUpdateLoading"
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
    <span class="user_item_uploader_title" v-show="!imageUrl"
      >拖拽文件或或点击以上传jpg/png格式的图片，建议使用300x300不超过1M的图片。</span
    >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
  </el-upload>
  <el-button
    class="ml-3"
    type="success"
    @click="commitAvatar"
    v-show="isUpdateAvatarFile && avatarFile.length !== 0"
    >提交</el-button
  >
</template>
<style scoped>
.user_item_uploader_title {
  color: #a9a9a9;
}
.avatar {
  height: 15vh;
  width: 15vh;
  border-radius: 50%;
  overflow: hidden;
}
</style>
