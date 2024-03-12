let timer: any;
export function debounce(fun: Function, delay: number) {
  return function (this:any) {
      var args = arguments;
      if (timer) {
          clearTimeout(timer);
      }
      
      timer = setTimeout(() => {
          fun.apply(this, args);
      }, delay);
  }
}