export const isFalsy = (value: any) => (value === 0 ? false : !value);

export const cleanObject = (obj: object) => {
  // 最好别去改变传入的对象
  const result = { ...obj };

  Object.keys(result).forEach((key) => {
    // @ts-ignore
    const value = result[key];
    // @ts-ignore
    if (isFalsy(value)) delete result[key];
  });

  return result;
};
