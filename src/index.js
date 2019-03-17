const Atlas = require('./class/atlas.class');

document.addEventListener('DOMContentLoaded', () => {

  const atlas = new Atlas('.root', {
    width: 100,
    ratio: 4,
    panel: 3
  });

  window.insert = atlas.insert.bind(atlas);
  window.atlas  = atlas;

  atlas.fold(20);
  atlas.rotate({ x: 20 });

});
