export default (spath: string): string => (spath.at(-1) === "/" ? spath : `${spath}/`);
