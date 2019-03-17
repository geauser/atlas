const { EARTH_RADIUS, PI, RADIAN } = require('../config/const.config');
const { mapHelper } = require('../helpers');

/**
* Class representing the virtual google map entity.
*
* @class
*/
class GoogleMap {

  /**
  * Create a google map.
  *
  * @param {Element[]} wrappers                    List of the faces.
  * @param {{ lat: number, lng: number }} center   Center of the virtual map.
  * @param {Object} opts                           Virtual map option object.
  */
  constructor (wrappers, center, opts) {

    this.wrappers = wrappers;
    this._center  = center;
    this.opts     = opts;
    this.maps     = [];

    /**
    * Given that we handle the drag and the scroll event by ourselve,
    * we can (and have to) disable the drag and scroll event for each
    * google map instances.
    */
    this.opts.draggable   = false;
    this.opts.scrollwheel = false;

  }

  /**
  * Resolution of the virtual google map in meters per pixel.
  *
  * @return {number}
  */
  get resolution () {

    const lat  = this.center.lat;
    const zoom = this.opts.zoom;

    return (Math.cos(lat * RADIAN) * 2 * PI * EARTH_RADIUS) / (256 * Math.pow(2, zoom));
  }

  /**
  * The center coordinates for each face of the map.
  *
  * @return {number[]}
  */
  get centers () {

    const centers = [];

    // @todo : make sure we don't have to extract any value fron a string.
    const width = Number(this.wrappers[0].style.width.replace('px', ''));
    const stop  = Math.floor(this.wrappers.length / 2);

    for (let i = 0; i < this.wrappers.length; i++) {

      // @todo : simplify this expression
      const offset_on_x = i < stop ? -(width / 2 + width * (stop - 1 - i)) : (width / 2 + width * (i - stop));

      centers[i] = mapHelper.translateGPSCoord(offset_on_x, 0, this.resolution, this.center);

    }

    return centers;
  }

  /**
  * The center coordinates of the virtual map.
  *
  * @return {{ lat: number, lng: number }}
  */
  get center () {
    return this._center;
  }

  /**
  * The current zoom level of the virtual map.
  *
  * @return {number}
  */
  get zoom () {
    return this.opts.zoom;
  }

  /**
  * Mutator that sets the center of the virtual map
  * and re-calculate the center for each face of the map.
  *
  * @param {{ lat: number, lng: number }} center   New center.
  */
  set center (center) {

    this._center = center;

    for (let i = 0, l = this.maps.length; i < l; i++) {
      this.maps[i].setCenter(this.centers[i]);
    }

  }

  /**
  * Mutator that sets the zoom level of the virtual map
  * and re-calculate the zoom level of each face of the map.
  *
  * @param {number} level   New level of zoom.
  */
  set zoom (level) {

    const maps = this.maps;

    /**
    * We make sure the zoom level doesn't go below
    * 3 to avoid weird display.
    */
    level = Math.max(3, level);

    /**
    * We make sure we update the virtual map zoom level,
    * so it is taken into account for future calculations.
    */
    this.opts.zoom = level;

    for (let i = 0, l = maps.length; i < l; i++) {
      maps[i].setZoom(level);
    }

    /**
    * By giving this.center his own value we are triggering the
    * center mutator {@link GoogleMap.center} that will re-center
    * all the virtual map faces according to the new zoom level.
    */
    this.center = this.center;
  }

  /**
  * Move the center of the virtual map and trigger
  * the re-calculation of each face of the map.
  *
  * @param {{ x: number, y: number }} center   Destination center.
  */
  move (center) {
    this.center = mapHelper.translateGPSCoord(center.x, center.y, this.resolution, this.center);
  }

  /**
  * Create the google map instances for each face.
  */
  create () {

    for (let i = 0; i < this.centers.length; i++) {

      this.opts.center = this.centers[i];
      this.maps[i] = new google.maps.Map(this.wrappers[i], this.opts);

    }

  }

}

module.exports = GoogleMap;
