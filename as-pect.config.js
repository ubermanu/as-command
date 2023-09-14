export default {
  entries: ["tests/**/*.test.ts"],
  disclude: [/node_modules/],

  async instantiate(memory, createImports, instantiate, binary) {
    let instance; // Imports can reference this
    const myImports = {
      env: { memory }
      // put your web assembly imports here, and return the module promise
    };
    instance = instantiate(binary, createImports(myImports));
    return instance;
  },

  outputBinary: false,
};
