# PyGame.sk

> an implementation of the event part of pygame for skulpt

## Building

Requirements: yarn, rollup

Build: `yarn build`

Run tests: `yarn test`

Watch: `yarn watch`

Copy the pygame.js file and the contents of `skulpt_module` to a directory somewhere reachable.

## Usage

Load `pygame.js` after skulpt, and call `Pygame.init({path})` where path is the path to the files in `skulpt_module`.

After this you can `import pygame` in skulpt.