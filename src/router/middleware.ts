import router from "./index";
import { useToken } from "@/stores/token";
import loading from "@/components/loading/loadingIndex.vue";
import { createVNode, render } from "vue";
import { type RouteLocationNormalized } from "vue-router";
// loading在ts文件里无法使用，可以使用vue提供的createVNode 进行函数式编程
const loadingNode = createVNode(loading);
// console.log(loadingNode);
// render用于渲染放到dom上
render(loadingNode, document.body);
// 上一个路由的from
export let previousFormRoute: RouteLocationNormalized | null = null;
// 路由前to的路径，对于from错误的路由无法查找，要使用to来获取上一个错误的路径
// 对于能找到路由的，to在这里会直接触发next()，不会记录上一个的路径，所以要查看上一个路径的话需要去
// previousFormRoute找上一个执行成功记录的路径

// / => /不存在的路径 => to.fullPath =>next(/error)这里的from记录的是2,2没有路径所以from是空的
// to.fullPath记录的是2访问的路由，所以能获取上一个地址

// / =>user/w1 =>寻找 w1 发现不存在 puth(/error)=>进入/error
// 这里每一步的路由都是合法的，并没有触发!to.matched.length 所以to

export let previousErrorTofullPath: string = "/";
// export let previousToRoute: RouteLocationNormalized | null = null;

// 路由前
router.beforeEach((to, from, next) => {
  loadingNode.component?.exposed?.startLoading();
  // 记录上一个值
  previousFormRoute = from;

  // 检查token
  if (useToken().token) {
    // console.log(useToken().token);
  } else {
    console.log("没有token");
  }

  // 检查路径存在
  // 由于from无法记录未注册的路由，所以要通过to.matched.length判断to是否是一个没有内容的组件
  // 没有内容的话将上一个路由的路径用to记录
  if (!to.matched.length) {
    // console.log(to);

    previousErrorTofullPath = to.fullPath;
    next("/error");
  }
  // 正常跳转
  // 正常跳转说明to.matched.length有内容，那么上一个路径from是有记录的
  else {
    console.log(from);
    
    next();
  }
});
// 路由后
router.afterEach((_to, _from, failure) => {
  // console.log(failure?"路由错误":"没有问题");
  loadingNode.component?.exposed?.endLoading();
});
