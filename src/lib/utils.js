export const generateID = () => {
  let firstPart = (Math.random() * 46656) | 0;
  let secondPart = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
};

export const findDuplicates = (arr) =>
  arr.filter((item, index) => arr.indexOf(item) != index);

export const checkIfDuplicateExists = (arr) => {
  return new Set(arr).size !== arr.length;
};
