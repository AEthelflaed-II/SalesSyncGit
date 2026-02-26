export const dynamicImport = async (module: string): Promise<any> => {
  const _import = new Function('module', 'return import(module)');
  return new Promise((resolve, reject) => {
    return _import(module).then(resolve).catch(reject);
  });
};
