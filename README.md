![atlas](https://i.imgur.com/8TFNGxY.png)

## Introduction

Atlas is small experiment I worked on to test the limits of CSS 3D properties. All of the 3D rendering aspect of the Atlas
are handled with CSS `transform` properties with Javascript acting as a glue to make everything work together.

## Installation
```sh
git clone git@github.com:geauser/atlas.git
cd atlas && yarn install && yarn build
```

## Usage

Open `demo/index.html` in your browser, you should see the atlas, with its view centered on New York. Being an experiment, I did not bother to
add an user friendly UI, but you can do some things still in the console.

Open the console, and you can run the following commands:

- **Fold the map**: `atlas.fold(Number)`
- **Rotate the map**: `atlas.rotate({ x: Number, y: Number, z: Number })`

## Notes

The Atlas was developed on Chrome. Being just an experiment I did not put much effort into cross-browsers compatibility
so it's entirely possible that the Atlas won't work on other browsers.
