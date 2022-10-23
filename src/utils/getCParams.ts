export default (): any => {
  const rest = process.argv.slice(2) || [];
  const paramsArray: [string, string][] = rest.reduce(
    (pre: [string, string][], item: string): [string, string][] => {
      if (item.startsWith("--")) {
        return [...pre, item.slice(2).split("=") as any as [string, string]];
      }
      return pre;
    },
    [],
  );
  return Object.fromEntries(paramsArray);
};
