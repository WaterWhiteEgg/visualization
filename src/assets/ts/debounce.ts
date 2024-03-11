type Func = (...args: any[]) => any
export function debounce(func: Func, delay: number, immediate?: boolean, resultCallback?: Func) {
    // ReturnType 可以方便地获取函数的返回类型
    let timer: null | ReturnType<typeof setTimeout> = null;
    let isInvoke = false;
    const _debounce = function(this: unknown, ...args: any[]) {
      return new Promise((resolve, reject) => {
        
        if (timer) clearTimeout(timer);
        if (immediate && !isInvoke) {
          try {
            const result = func.apply(this, args);
            if (resultCallback) resultCallback(result);
            resolve(result);
          } catch (e) {
            reject(e);
          }
          isInvoke = true;
        } else {
          timer = setTimeout(() => {
            try {
              const result = func.apply(this, args);
              if (resultCallback) resultCallback(result);
              resolve(result);
            } catch (e) {
              reject(e);
            }
            isInvoke = false;
            timer = null;
          }, delay);
        }
      });
    };
    _debounce.cancel = function() {
      if (timer) clearTimeout(timer);
      isInvoke = false;
      timer = null;
    };
    return _debounce;
  }
  
