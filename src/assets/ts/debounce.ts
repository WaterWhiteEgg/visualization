let timer: number | undefined;
export function debounce(fun: () => void, delay: number = 300) {
  return function(this: unknown, ...args: []) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fun.apply(this, args);
    }, delay);
  };
}
