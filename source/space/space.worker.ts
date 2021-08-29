import { Space } from './space';

let space: Space;

const onCanvas = (ev: {canvas: OffscreenCanvas}): void => {
  if ('requestAnimationFrame' in self) {
    space = new Space({
      canvas: ev.canvas,
    });

    (self as any).postMessage({
      success: true,
    });

    space
      .run()
      .catch((e) => console.error(e));
  } else {
    (self as any).postMessage({
      error: 'requestAnimationFrame is not supported on workers',
    });
  }
};

onmessage = (event): void => {
  const {topic, ...otherParams} = event.data;
  if (topic === 'canvas') {
    onCanvas(event.data);
  } else if (space) {
    space.dispatchEvent({
      type: topic,
      ...otherParams
    });
  }
};
