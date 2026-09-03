declare global {
  interface Window {
    $message: any;
    $router: any;
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $message: any;
    $router: any;
  }
}

export {};