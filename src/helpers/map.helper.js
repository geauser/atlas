const { EARTH_RADIUS, PI, RADIAN } = require('../config/const.config');

/**
 * Translate GPS coordinates for a distance expressed
 * in pixels on the X and Y axis and return the new
 * GPS coordinates.
 *
 * @param {number} x
 * @param {number} y
 * @param {number} pixelGroundResolution
 * @param {number} oldGPSCoord
 */
function translateGPSCoord(x, y, pixelGroundResolution, oldGPSCoord) {

  // pixelGroundResolution in expressed in meters per pixel.

  const xInMeters = x * pixelGroundResolution;
  const yInMeters = y * pixelGroundResolution;

  // @todo Explain the Maths
  const newGPSCoordLat = oldGPSCoord.lat + (yInMeters / EARTH_RADIUS) * (180 / PI);
  const newGPSCoordLng = oldGPSCoord.lng + (xInMeters / EARTH_RADIUS) * (180 / PI) / Math.cos(oldGPSCoord.lat * RADIAN);

  return {
    lat: newGPSCoordLat,
    lng: newGPSCoordLng,
  };
}


/**
 * Return the pixel offset created by the folding of
 * the map.
 *
 * @param {number} mapFacesWidth
 * @param {number} foldAngle
 */
function getFoldingGap(mapFacesWidth, foldAngle) {

  const cssWidthOfRotatedFace = mapFacesWidth * Math.cos(foldAngle * (PI / 180));

  return 2.0 * mapFacesWidth - 2 * cssWidthOfRotatedFace;
}


module.exports = {
  translateGPSCoord,
  getFoldingGap,
};
