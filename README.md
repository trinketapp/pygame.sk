# PyGame.sk

> an implementation of the event part of pygame for skulpt

## Building

Requirements: yarn, rollup

`rollup -c rollup.config.js`

> add `-w` if you want to watch, so it builds on every changed file.

Copy the pygame.js file and the contents of `skulpt_module` to a directory somewhere reachable.

## Usage

Load `pygame.js` after skulpt, and call `Pygame.init({path})` where path is the path to the files in `skulpt_module`.

After this you can `import pygame` in skulpt.