const deepMerge = (target, source) => {
  if (typeof target !== 'object' || target === null) {
    target = {};
  }
  for (const key in source) {
    if (source[key] instanceof Object && target[key] instanceof Object) {
      target[key] = deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
};

export {
  deepMerge,
};
