// Define the global window.__env__ property for environment variables
declare global {
  interface Window {
    __env__?: Record<string, string>;
  }
}

export {};
