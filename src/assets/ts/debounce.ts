let timer:  number | undefined;
export function debounce(fun: Function, delay: number = 300) {
  return function (this: any) {
    var args = arguments;
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fun.apply(this, args);
    }, delay);
  };
}
