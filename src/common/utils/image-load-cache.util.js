const MAX_CONCURRENT_IMAGE_LOADS = 10;

const loadedImageUrls = new Set();
let activeLoads = 0;
const waitQueue = [];

function pumpImageLoadQueue() {
  while (activeLoads < MAX_CONCURRENT_IMAGE_LOADS && waitQueue.length > 0) {
    const next = waitQueue.shift();
    if (!next || next.cancelled) continue;
    activeLoads += 1;
    next.grant();
  }
}

export function isImageUrlCached(url) {
  return Boolean(url && loadedImageUrls.has(url));
}

export function markImageUrlCached(url) {
  if (url) {
    loadedImageUrls.add(url);
  }
}

export function requestImageLoadSlot(url, { priority = false } = {}) {
  if (!url || loadedImageUrls.has(url)) {
    return {
      promise: Promise.resolve(() => {}),
      cancel: () => {},
    };
  }

  let settle;
  const promise = new Promise((resolve) => {
    settle = resolve;
  });

  const entry = {
    cancelled: false,
    grant: () => {
      let released = false;
      settle(() => {
        if (released) return;
        released = true;
        activeLoads = Math.max(0, activeLoads - 1);
        pumpImageLoadQueue();
      });
    },
  };

  if (priority) {
    waitQueue.unshift(entry);
  } else {
    waitQueue.push(entry);
  }

  pumpImageLoadQueue();

  return {
    promise,
    cancel: () => {
      entry.cancelled = true;
      const index = waitQueue.indexOf(entry);
      if (index >= 0) {
        waitQueue.splice(index, 1);
      }
    },
  };
}
