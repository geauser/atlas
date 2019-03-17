

/**
 * Return a DOM element found with the given
 * selector.
 *
 * @param {string} selector
 * @returns {NodeList|Node}
 */
function getElement(selector) {
  const found = document.querySelectorAll(selector);
  return found.length > 1 ? found : found[0];
}


/**
 * Create a new DOM element.
 *
 * @param {string} tag
 * @param {string} className
 * @param {string} id
 * @returns {Node}
 */
function createElement(tag, className = '', id = '') {
  const newElement     = document.createElement(tag);
  newElement.className = className;
  newElement.id        = id;

  return newElement;
}


/**
 * Apply styles to a DOM element.
 *
 * @param {Node} element
 * @param {Object} stylesheet
 */
function applyStyle(element, stylesheet) {

  for (let property in stylesheet) {
    element.style[property] = stylesheet[property];
  }

  return element;
}


/**
 * Generate a CSS transform string based on information
 * formatted into the transformDescriptor.
 *
 * @param {{rotate: {Object}, translate: {Object}}} transformDescriptor
 * @returns {string}
 */
function getCSSTransformProperty(transformDescriptor) {

  let transformProperty = '';

  const rotations    = transformDescriptor.rotate;
  const translations = transformDescriptor.translate;

  for (let axis in rotations) {
    transformProperty += `rotate${axis.toUpperCase()}(${rotations[axis]}deg) `;
  }

  for (let axis in translations) {
    transformProperty += `translate${axis.toUpperCase()}(${translations[axis]}px) `;
  }

  return transformProperty;
}


module.exports = {
  getElement,
  createElement,
  applyStyle,
  getCSSTransformProperty,
};
