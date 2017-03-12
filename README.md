# PyGame.sk

> an implementation of the event part of pygame for skulpt

[![Build Status](https://travis-ci.org/trinketapp/pygame.sk.svg?branch=master)](https://travis-ci.org/trinketapp/pygame.sk)

[![Sauce Status](https://saucelabs.com/browser-matrix/albertjan.svg?auth=0646f2e680b03678d709cc0cf7b84f8d)](https://saucelabs.com/browser-matrix/albertjan.svg)

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
  - [x] `init` - initialises the eventmodule and return a tuple. (6, 0) initialisation succeeded.
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
  - [x] `init` - initialized the event module
  - [x] `quit` — dud -> None
  - [x] `update` — dud -> None
  - [x] `get_init` — Returns True if the display module has been initialized
  - [x] `set_mode` — Initialize a window or screen for display, and returns initialized Surface, and initializes the event module
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
- [x] `pygame.Surface` - pygame object for representing images
  - [x] `Surface((width, height), flags=0, depth=0, masks=None)` -> Surface (both constuctors do the same thing)
  - [x] `Surface((width, height), flags=0, Surface)` -> Surface
  - [x] `pygame.Surface.get_flags` — get the additional flags used for the Surface
  - [x] `pygame.Surface.get_size` — get the dimensions of the Surface
  - [x] `pygame.Surface.get_width` — get the width of the Surface
  - [x] `pygame.Surface.get_height` — get the height of the Surface
  - [ ] `pygame.Surface.blit` — draw one image onto another
  - [ ] `pygame.Surface.convert` — change the pixel format of an image
  - [ ] `pygame.Surface.convert_alpha` — change the pixel format of an image including per pixel alphas
  - [ ] `pygame.Surface.copy` — create a new copy of a Surface
  - [ ] `pygame.Surface.fill` — fill Surface with a solid color
  - [ ] `pygame.Surface.scroll` — Shift the surface image in place
  - [ ] `pygame.Surface.set_colorkey` — Set the transparent colorkey
  - [ ] `pygame.Surface.get_colorkey` — Get the current transparent colorkey
  - [ ] `pygame.Surface.set_alpha` — set the alpha value for the full Surface image
  - [ ] `pygame.Surface.get_alpha` — get the current Surface transparency value
  - [ ] `pygame.Surface.lock` — lock the Surface memory for pixel access
  - [ ] `pygame.Surface.unlock` — unlock the Surface memory from pixel access
  - [ ] `pygame.Surface.mustlock` — test if the Surface requires locking
  - [ ] `pygame.Surface.get_locked` — test if the Surface is current locked
  - [ ] `pygame.Surface.get_locks` — Gets the locks for the Surface
  - [ ] `pygame.Surface.get_at` — get the color value at a single pixel
  - [ ] `pygame.Surface.set_at` — set the color value for a single pixel
  - [ ] `pygame.Surface.get_at_mapped` — get the mapped color value at a single pixel
  - [ ] `pygame.Surface.get_palette` — get the color index palette for an 8bit Surface
  - [ ] `pygame.Surface.get_palette_at` — get the color for a single entry in a palette
  - [ ] `pygame.Surface.set_palette` — set the color palette for an 8bit Surface
  - [ ] `pygame.Surface.set_palette_at` — set the color for a single index in an 8bit Surface palette
  - [ ] `pygame.Surface.map_rgb` — convert a color into a mapped color value
  - [ ] `pygame.Surface.unmap_rgb` — convert a mapped integer color value into a Color
  - [ ] `pygame.Surface.set_clip` — set the current clipping area of the Surface
  - [ ] `pygame.Surface.get_clip` — get the current clipping area of the Surface
  - [ ] `pygame.Surface.subsurface` — create a new surface that references its parent
  - [ ] `pygame.Surface.get_parent` — find the parent of a subsurface
  - [ ] `pygame.Surface.get_abs_parent` — find the top level parent of a subsurface
  - [ ] `pygame.Surface.get_offset` — find the position of a child subsurface inside a parent
  - [ ] `pygame.Surface.get_abs_offset` — find the absolute position of a child subsurface inside its top level parent
  - [ ] `pygame.Surface.get_rect` — get the rectangular area of the Surface
  - [ ] `pygame.Surface.get_bitsize` — get the bit depth of the Surface pixel format
  - [ ] `pygame.Surface.get_bytesize` — get the bytes used per Surface pixel
  - [ ] `pygame.Surface.get_pitch` — get the number of bytes used per Surface row
  - [ ] `pygame.Surface.get_masks` — the bitmasks needed to convert between a color and a mapped integer
  - [ ] `pygame.Surface.set_masks` — set the bitmasks needed to convert between a color and a mapped integer
  - [ ] `pygame.Surface.get_shifts` — the bit shifts needed to convert between a color and a mapped integer
  - [ ] `pygame.Surface.set_shifts` — sets the bit shifts needed to convert between a color and a mapped integer
  - [ ] `pygame.Surface.get_losses` — the significant bits used to convert between a color and a mapped integer
  - [ ] `pygame.Surface.get_bounding_rect` — find the smallest rect containing data
  - [ ] `pygame.Surface.get_view` — return a buffer view of the Surface’s pixels.
  - [ ] `pygame.Surface.get_buffer` — acquires a buffer object for the pixels of the Surface.
  - [ ] `pygame.Surface._pixels_address` — pixel buffer address