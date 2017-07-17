const Utils = {

  conditionalPrepend: (conditional, prefix, originalArray) => {
    if (!conditional) {
      return originalArray;
    } else if (prefix instanceof Array) {
      return prefix.concat(originalArray);
    } else {
      return [prefix].concat(originalArray);
    }
  },

  substractArrayFrom: (superset = [], substraction = []) => superset.filter(
    item => substraction.indexOf(item) === -1
  ),

  conditionalRender: (conditional, trueRenderer, falseRenderer) => conditional ? trueRenderer() : falseRenderer(),

};

export default Utils;
