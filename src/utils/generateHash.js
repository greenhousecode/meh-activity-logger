export default (...args) => {
  const string = JSON.stringify(args);
  let hash = 0;
  let chr;

  for (let i = 0; i < string.length; i += 1) {
    chr = string.charCodeAt(i);
    hash = (hash << 5) - hash + chr; // eslint-disable-line no-bitwise
    hash |= 0; // eslint-disable-line no-bitwise
  }

  return hash.toString();
};
