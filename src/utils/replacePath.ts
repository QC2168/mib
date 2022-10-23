export default (str: string): string => {
  const reg = [
    { reg: /[(]/g, val: "\\(" },
    { reg: /[)]/g, val: "\\)" },
  ];
  let res: string = str;
  for (let i = 0; i < reg.length; i += 1) {
    res = res.replace(reg[i].reg, reg[i].val);
  }
  return res;
};
