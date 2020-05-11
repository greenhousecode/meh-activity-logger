export default (shorthandLabel, input) =>
  typeof input === 'string' ? { [shorthandLabel]: input } : input;
