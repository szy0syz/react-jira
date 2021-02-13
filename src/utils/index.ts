export const isFalsy = (value: unknown) => (value === 0 ? false : !value);

export const isVoid = (value: unknown) =>
  value === undefined || value === null || value === '';

export const cleanObject = (obj: { [key: string]: unknown }) => {
  // 最好别去改变传入的对象
  const result = { ...obj };

  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isVoid(value)) delete result[key];
  });

  return result;
};
