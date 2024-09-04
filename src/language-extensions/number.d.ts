type ScreenCoordinate = number;
type CanvasCoordinate = number;
type ViewportCoordinate = number; // Viewport refers to https://developer.mozilla.org/en-US/docs/Web/CSS/CSSOM_view/Coordinate_systems#viewport
type World = number;
type Scalar = number;
type Pixel = number;
type Point<
  T =
    | number
    | ScreenCoordinate
    | CanvasCoordinate
    | ViewportCoordinate
    | World
    | Pixel,
> = { x: T; y: T };

type Size<
  T =
    | number
    | Scalar
    | ScreenCoordinate
    | CanvasCoordinate
    | ViewportCoordinate
    | World
    | Pixel,
> = { width: T; height: T };

type Bounds<T = number> = {
  top: T;
  bottom: T;
  left: T;
  right: T;
};

type MilliSeconds = number;
type AnimationFrameId = number;
