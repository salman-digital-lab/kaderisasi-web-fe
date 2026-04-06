export const cleanEmptyKeyFromObject = <T extends Record<string, unknown>>(
  object: T,
) => {
  const newObject: Record<string, unknown> = {};
  Object.keys(object).forEach((key) => {
    if (object[key]) {
      newObject[key] = object[key];
    }
  });
  return newObject as Partial<T>;
};
