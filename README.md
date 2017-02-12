# PyGame.sk

> an implementation of the event part of pygame for skulpt

[![Build Status](https://travis-ci.org/trinketapp/pygame.sk.svg?branch=master)](https://travis-ci.org/trinketapp/pygame.sk)

[![Sauce Status](https://saucelabs.com/browser-matrix/albertjan.svg)](https://saucelabs.com/browser-matrix/albertjan.svg)

## Building

Requirements: yarn, rollup

Build: `yarn build`

Run tests: `yarn test`

Watch: `yarn watch`

Copy the pygame.js file and the contents of `skulpt_module` to a directory somewhere reachable.

## Usage

Load `pygame.js` after skulpt, and call `Pygame.init({path})` where path is the path to the files in `skulpt_module`.

After this you can `import pygame` in skulpt.

## API completeness

- [x] `pygame` - module importable
  - [x] `init` - dud -> None
  - [x] `quit` - dud -> None
  - [ ] `error` — standard pygame exception
  - [ ] `get_error` — get the current error message
  - [ ] `set_error` — set the current error message
  - [ ] `get_sdl_version` — get the version number of SDL
  - [ ] `get_sdl_byteorder` — get the byte order of SDL
  - [ ] `register_quit` — register a function to be called when pygame quits
  - [ ] `encode_string` — Encode a unicode or bytes object
  - [ ] `encode_file_path` — Encode a unicode or bytes object as a file system path
- [x] `pygame.event` - module importable
  - [x] `pump` - dud -> None
  - [x] `get_grab` - dud -> True
  - [x] `set_grab` - dud -> None
  - [x] `get` - functional
  - [x] `wait` - functional
  - [x] `peek` - functional
  - [x] `clear` - functional
  - [x] `event_name` - functional
  - [x] `set_blocked` - functional
  - [x] `get_blocked` - functional
  - [x] `set_allowed` - functional
  - [x] `post` - functional
  - [x] `Event` - complete
  - [x] `EventType` - replaced with an integer
- [x] `pygame.locals` - module importable and complete
- [x] `pygame.display` - module importable
  - [x] `init` - dud -> None
  - [x] `quit` — dud -> None
  - [x] `update` — dud -> None
  - [ ] `get_init` — Returns True if the display module has been initialized
  - [ ] `set_mode` — Initialize a window or screen for display
  - [ ] `get_surface` — Get a reference to the currently set display surface
  - [ ] `flip` — Update the full display Surface to the screen
  - [ ] `get_driver` — Get the name of the pygame display backend
  - [ ] `Info` — Create a video display information object
  - [ ] `get_wm_info` — Get information about the current windowing system
  - [ ] `list_modes` — Get list of available fullscreen modes
  - [ ] `mode_ok` — Pick the best color depth for a display mode
  - [ ] `gl_get_attribute` — Get the value for an OpenGL flag for the current display
  - [ ] `gl_set_attribute` — Request an OpenGL display attribute for the display mode
  - [ ] `get_active` — Returns True when the display is active on the display
  - [ ] `iconify` — Iconify the display surface
  - [ ] `toggle_fullscreen` — Switch between fullscreen and windowed displays
  - [ ] `set_gamma` — Change the hardware gamma ramps
  - [ ] `set_gamma_ramp` — Change the hardware gamma ramps with a custom lookup
  - [ ] `set_icon` — Change the system image for the display window
  - [ ] `set_caption` — Set the current window caption
  - [ ] `get_caption` — Get the current window caption
  - [ ] `set_palette` — Set the display color palette for indexed displays