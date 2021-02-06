export const isFalsy = (value) => (value === 0 ? false : !value);

export const cleanObject = (obj) => {
  // 最好别去改变传入的对象
  const result = { ...obj };

  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isFalsy(value)) delete result[key];
  });

  return result;
};
