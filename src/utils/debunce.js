const debounce = (func, delay = 1000) => {
  let timeout;
  return (...param) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func && func(...param);
    }, delay);
  };
};

const log = debounce(() => console.log('~~call~~'), 3000);

log();
log();
log();
log();

/**
 * 0s -----------> 1s -----------> 2s -----------> ...
 * 一定要理解：这三个函数都是同步操作，所以他们都是在 0s ~ 1s 这个时间内瞬间完成的；
 * log()#1  // timeout#1 赋值
 * log()#2  // 发现 timeout#1 有值那就取消，然后设置 timeout#2
 * log()#3  // 发现 timeout#2 有值那就取消，然后设置 timeout#3
 * log()#4  // 发现 timeout#3 有值那就取消，然后设置 timeout#4
 * 　       // 所以，log()#4 结束后，就只剩下 timeout4 在那里独自等待了...
 */
