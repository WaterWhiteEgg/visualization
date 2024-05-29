let timer: number | undefined;
export function debounce<T>(
  fun: (...args: any) => T,
  delay: number = 300
) {
  return function (this: unknown, ...args: any[]): Promise<T> {
    if (timer) {
      clearTimeout(timer);
    }

    return new Promise((resolve, reject) => {
      timer = setTimeout(async () => {
        try {
          const result = await fun.apply(this, args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}
