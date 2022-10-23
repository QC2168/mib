import util from "node:util";

export default <T = any>(object: T, depth: null | number = null) => {
  // eslint-disable-next-line no-console
  console.log(util.inspect(object, { showHidden: false, depth, colors: true }));
};
