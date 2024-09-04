# Modern.js App

## Get Started

Start the dev server:

```bash
pnpm dev
```

Enable optional features or add a new entry:

```bash
pnpm new
```

Build the app for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm serve
```

For more information, see the [Modern.js documentation](https://modernjs.dev/en).

# Code Scratchpad

If React HMR is cauing hook state issues, add in `/* @refresh reset */` at the top of the file

```
useEffect(() => {
  const interval = setInterval(() => {
    console.log('This will run every second!');
  }, 1000);
  return () => clearInterval(interval);
}, []);
```

```
const convertWorldToScreenPosition = (
    position: Point<WorldCoordinate>,
  ): Point<ScreenCoordinate> => {
    const {
      mapWindow: {
        setting: { offset },
        runtime: {
          zoom,
          canvasTransform: { e, f },
        },
      },
    } = viewportState;

    const vpX = position.x * zoom + e + offset.x;
    const vpY = position.y * zoom + f;

    return { x: vpX, y: vpY };
  };
```
```
import {
  MdOutlineSave,
  MdClose,
  MdEdit,
  MdOutlineUndo,
  MdOutlineUnfoldLess,
  MdOutlineUnfoldMore,
} from 'react-icons/md';
```

'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAATlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADEoqZZAAAAGXRSTlMABCrxFAzmHLh2YN3NxGvWrZc8o4ZXNk1Egv8YRwAAAoBJREFUWMO1VtuSqyAQzHBRUNR4z/z/j549ERkEdCmt7ZdYRWybnp6B1x8DnhKUlXyoYHyXzxhabNgjghXRLE8IBo7YPWFgHBE79pAADXtIgKp84MEX4908fNBC3wzljBZ8vkeg0eJuKXp0eN+xARQS9J1u7JBQLPeq+GgTLR5QZb0kP0DjAA8wWYFkSjgLajxC58muKEYBul0CE+eVe6OS7hHTEmAazndQ7GZRDQhm+7LozjdTObMkCagNWqx20r3hMnuj+HnSnnLH1duE12cFWTbZ788y0QaaUjkbhQ3o54Rgcv3rB4h6gg92m+3v4ScBApSfRtnYvcSAFhOo/K7UmwBUMinAJAX4iZherLNmOAgIBlDcQj0pEBtZweiz/U7G6qQA31tsR+vmQsbXJTVfjNnGy8J9Y6Ds7s9JB98ynWoKQru3yFpgjGKw4U8QUMvV7Od3LjCBKR7PlKiN2yCiaauRe4uumm64rJE0Fk8dWvw0iMdjWSo8oi4vCIxk6ltBb5CvPKjunkSyhzDCS2ildOmnXB8ZeqetwfTgAgj6ZOibuuDxiA/SQyGLIUumAw9T8UmNK/Iy/s/CQ3+Xq5lPAY9M4FXVK2PG8/dBGL/DWLvJ0F57gJTwyhMAc90Jv4lpzGU5wHruwjRRaa/Bdrv0PBY0lWCX0InMK9fOoyCYZGvWdYGgaZa6CF9iDRuStHHq8QsIdWwHoAL3ebcgNvKDAELZ5N2CYGhN+royFFuMWebNL75/V5xm2AWgdyd2uKKtMzIrCg2LuW0gp6taLjZzKng/l2EwVqY4Odz5xnCyC9kWm/wZTqPWFP+RZIBl/C6q6spnwb6AFEG5rQXkT/EP0/V9K3gS1GEAAAAASUVORK5CYII='

Implement an Image Download Manager which reports download progress
https://www.prowaretech.com/articles/current/javascript/download-images-with-progress-indicator#!
https://openjavascript.info/2022/12/21/download-progress-with-javascripts-fetch-function/
https://stackoverflow.com/questions/14218607/javascript-loading-progress-of-an-image
https://stackoverflow.com/questions/57577596/preloading-images-and-audio-with-a-progress-bar-in-react
