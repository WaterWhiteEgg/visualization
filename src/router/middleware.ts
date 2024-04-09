import router from "./index";
import { useToken } from "@/stores/token";
import loading from "@/components/loading.vue";
import { createVNode, render } from "vue";
// loading在ts文件里无法使用，可以使用vue提供的createVNode 进行函数式编程
const loadingNode = createVNode(loading)
const appElement = document.getElementById('app');
// console.log(loadingNode);
// render用于渲染放到dom上
render(loadingNode,document.body)


// 路由前
router.beforeEach((to, from, next) => {
  loadingNode.component?.exposed?.startLoading()
  if (useToken().token) {
    // console.log(useToken().token);

  } else {

  }
  next();
});
// 路由后
router.afterEach((to, from, failure) => {
  //   console.log(failure);
    loadingNode.component?.exposed?.endLoading()


});
