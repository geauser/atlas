const GoogleMap = require('./googlemap.class');
const {
  domHelper,
  commonHelper,
  mapHelper
} = require('../helpers');


class Atlas {

  /**
  * Create an Atlas instance.
  *
  * @param {string} containerCSSSelector
  * @param {Object} options
  */
  constructor (containerCSSSelector, options) {

    this.options    = options;
    this.geometries = this.createAllGeometries();
    this.container  = domHelper.getElement(containerCSSSelector);

    this.initialize();
  }

  /**
  * Create all the needed geometries.
  *
  * @returns {Object}
  */
  createAllGeometries() {

    const mapNodeElement = domHelper.createElement('div', 'map');
    const pairsFiller    = () => this.createGeometry(domHelper.createElement('div', 'pair'));

    const faces   = [];
    const map     = this.createGeometry(mapNodeElement);
    const pairs   = commonHelper.fillArray(new Array(this.options.panels || 3), pairsFiller);

    return {
      map,
      pairs,
      faces,
    };
  }

  /**
  * Create a Geometry instance that will represent
  * an object in the geometrical realm of the application.
  *
  * Basically it's an abstraction to easily manipulate objects
  * in 3D.
  *
  * @param {Node} linkedNodeElement
  */
  createGeometry(linkedNodeElement) {

    return new function() {

      function updateCssTransformProp() {
        geometry.node.style.transform = domHelper.getCSSTransformProperty(geometry.transform);
      }

      /**
      * We create a system of getters and setters that will trigger the
      * updateCssTransformProp function each time on axis value is changed.
      */
      function createAxis() {

        function Axis() {}

        const privateStorageBlueprint = {
          enumerable: false,
          value: { x: 0, y: 0, z: 0 },
        };

        Object.defineProperties(Axis.prototype, {
          x: {
            enumerable: true,
            get: function () { return this._.x; },
            set: function (newValue) {
              this._.x = newValue;
              updateCssTransformProp();
            },
          },

          y: {
            enumerable: true,
            get: function () { return this._.y; },
            set: function (newValue) {
              this._.y = newValue;
              updateCssTransformProp();
            },
          },

          z: {
            enumerable: true,
            get: function () { return this._.z; },
            set: function (newValue) {
              this._.z = newValue;
              updateCssTransformProp();
            },
          }
        });

        return Object.defineProperty(new Axis(), '_', privateStorageBlueprint);
      }

      const geometry = {
        node: linkedNodeElement,
        transform: {
          rotate:    createAxis(),
          translate: createAxis(),
        }
      };

      return geometry;
    };

  }

  handleZoomEvents() {

    this.geometries.faces.forEach((face) => {

      face.node.addEventListener('wheel', (event) => {

        /**
        * If the wheelDelta is negative we assume that we are de-zooming therefore
        * we decrease this.map.zoom by 1 if the wheelDelta is positive we increase
        * the map zoom by 1 too.
        *
        * @todo : calibrate the wheelDelta threshold for the map zoom.
        */
        this.googleMap.zoom = Math.max(4, (event.wheelDelta < 0) ? this.googleMap.zoom - 1 : this.googleMap.zoom + 1);

      });

    });
  }

  handleDragEvents() {

    const mapGeometry = this.geometries.map;
    const body        = domHelper.getElement('body');

    let isShiftKeyPressed   = false;
    let isControlKeyPressed = false;

    let isDragging        = false;
    let initialPixelCoord = null;


    body.addEventListener('keydown', (event) => {

      const keyCode = event.keyCode;

      switch (keyCode) {

      case 16:
        isShiftKeyPressed = true;
        break;
      case 91:
        isControlKeyPressed = true;
        break;

      }

    });

    body.addEventListener('keyup', (event) => {

      const keyCode = event.keyCode;

      switch (keyCode) {

      case 16:
        isShiftKeyPressed = false;
        break;
      case 91:
        isControlKeyPressed = false;
        break;

      }

    });


    mapGeometry.node.addEventListener('mousedown', (event) => {

      initialPixelCoord = {
        x: event.clientX,
        y: event.clientY,
      };

      isDragging = true;

    }, false);


    body.addEventListener('mousemove', (event) => {

      if (isDragging) {

        if (!isShiftKeyPressed && !isControlKeyPressed) {

          this.googleMap.move({
            x: initialPixelCoord.x - event.clientX,
            y: event.clientY       - initialPixelCoord.y,
          });

        }

        initialPixelCoord = {
          x: event.clientX,
          y: event.clientY,
        };

      }

    }, false);

    body.addEventListener('mouseup', () => {
      isDragging = false;
    }, false);

  }

  initialize() {

    const geometries = this.geometries;
    const options    = this.options;


    geometries.pairs.forEach((pair) => {

      domHelper.applyStyle(pair.node, {
        display:        'inline-block',
        transformStyle: 'preserve-3d',
      });

      const faces = commonHelper.fillArray(new Array(2), () => {
        return this.createGeometry(domHelper.createElement('div', 'face'));
      });

      faces.forEach((face, index) => {

        domHelper.applyStyle(face.node, {
          display: 'inline-block',
          width:   `${options.width}px`,
          height:  `${options.width * options.ratio}px`,
          transformOrigin: index % 2 === 0 ? 'right' : 'left'
        });

        pair.node.appendChild(face.node);

      });

      geometries.faces = geometries.faces.concat(faces);
      geometries.map.node.appendChild(pair.node);

    });

  }

  rotate(angles) {

    const map = this.geometries.map;

    /**
    * As an angle can have a value of 0, we cannot use boolean expression like
    * !angles.x ? map.transform.rotate.x : angles.x because it will result in 0
    * not being interpreted as an angle value.
    */
    map.transform.rotate.x = (typeof angles.x === 'undefined' ? map.transform.rotate.x : angles.x) % 360;
    map.transform.rotate.y = (typeof angles.y === 'undefined' ? map.transform.rotate.y : angles.y) % 360;
    map.transform.rotate.z = (typeof angles.z === 'undefined' ? map.transform.rotate.z : angles.z) % 360;

  }

  fold(angle) {

    const faces = this.geometries.faces;
    const pairs = this.geometries.pairs;

    const gap = mapHelper.getFoldingGap(this.options.width, angle);

    for (let i = 0; i < faces.length; i++) { faces[i].transform.rotate.y = (angle *= -1); }

    // @todo : explain the math here
    for (let i = 0, j = 1; i < pairs.length; i++, j++) {
      pairs[i].transform.translate.x = gap * ((pairs.length - (i + j)) / 2);
    }

  }

  insert() {

    this.handleDragEvents();
    this.handleZoomEvents();

    const facesNodes = this.geometries.faces.map((face) => face.node);

    this.googleMap = new GoogleMap(facesNodes, { lat: 40.7808, lng: -73.9772 }, {
      zoom: 10,
      disableDefaultUI: true,
      mapTypeId: 'roadmap'
    });

    this.googleMap.create();
    this.container.appendChild(this.geometries.map.node);

  }


}

module.exports = Atlas;
