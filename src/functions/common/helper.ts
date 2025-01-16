export const cleanEmptyKeyFromObject = <T extends Record<string, unknown>>(
  object: T,
) => {
  let newObject: Record<string, unknown> = {};
  Object.keys(object).forEach((key) => {
    if (object[key]) {
      newObject[key] = object[key];
    }
  });
  return object as unknown as Partial<T>;
};
