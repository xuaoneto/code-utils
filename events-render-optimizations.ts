let listeners: any = {};

export function createEventListener(
  eventType: string,
  listener: (e: any) => any
) {
  listeners[eventType] = listener;
}

export function makeEvent(eventType: string, data: any) {
  return listeners[eventType]
    ? listeners[eventType]?.(data)
    : new Error("Listerner Not Found");
}
