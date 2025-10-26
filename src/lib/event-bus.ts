type EventCallback = (data?: any) => void;

const eventBus = {
  on(event: string, callback: EventCallback) {
    document.addEventListener(event, (e: any) => callback(e.detail));
  },
  dispatch(event: string, data?: any) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  remove(event: string, callback: EventCallback) {
    document.removeEventListener(event, callback);
  },
};

export default eventBus;
