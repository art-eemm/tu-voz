type TrackedElement = {
  id: string;
  label: string;
  tag: string;
  page: string;
};

let tracked: TrackedElement[] = [];

export function trackElement(elements: any[], pageUrl: string) {
  const important = elements.slice(0, 5);

  important.forEach((el) => {
    tracked.push({
      id: el.id,
      label: el.label || "",
      tag: el.tag,
      page: pageUrl,
    });
  });

  tracked = tracked.slice(-20);
}

export function getTrackedElements() {
  return tracked;
}

export function clearTracking() {
  tracked = [];
}
