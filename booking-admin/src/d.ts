/* eslint-disable */

declare module 'jsvectormap' {
  interface JsVectorMapOptions {
    selector: string;
    map: string;
    zoomButtons?: boolean;
    regionStyle?: {
      initial?: Record<string, any>;
      hover?: Record<string, any>;
    };
    regionLabelStyle?: {
      initial?: Record<string, any>;
      hover?: Record<string, any>;
    };
    labels?: {
      regions?: {
        render(code: string): string;
      };
    };
  }

  export default class JsVectorMap {
    constructor(options: JsVectorMapOptions);
  }
}