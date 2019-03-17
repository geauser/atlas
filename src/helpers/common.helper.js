/**
 * Fill an array with the result returned by the
 * filler function.
 *
 * @param {any[]} array
 * @param {Function} filler
 * @returns {any[]}
 */
function fillArray(array, filler) {

  for (let i = 0; i < array.length; i++) {
    array[i] = filler(i);
  }

  return array;
}


module.exports = {
  fillArray,
};
