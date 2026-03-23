// src/router-history.d.ts
import "@tanstack/react-router";

declare module "@tanstack/react-router" {
  interface HistoryState {
    routerData?: any;
  }
}
