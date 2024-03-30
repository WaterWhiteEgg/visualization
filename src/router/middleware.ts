import router from "./index";
import { useToken } from "@/stores/token";

// 路由前
router.beforeEach((to, from, next) => {
    if(useToken().token){
        console.log(useToken().token);
        
    }else{

    }
  next();
});
// 路由后
router.afterEach((to, from, failure) => {
//   console.log(failure);
});
