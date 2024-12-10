// -------------------------------------------------------------------------- //
// authors:
// - Tancredi-Paul Grozav <paul@grozav.info>
// -------------------------------------------------------------------------- //
declare module 'quagga' {
  interface QuaggaJSConfig {
    inputStream: {
      type: 'LiveStream' | 'ImageStream';
      // constraints: {
      //   width: number;
      //   height: number;
      //   facingMode: string;
      // };
      name: string;
      target: Element;
    };
    decoder: {
      readers: string[];
      // multiple: boolean;
      // debug: {
      //   drawBoundingBox: boolean;
      //   showFrequency: boolean;
      //   drawScanline: boolean;
      //   showPattern: boolean;  
      // };
    };
    locate: boolean;
  }

  export function init(config: QuaggaJSConfig, callback: (err: any) => void): void;
  export function start(): void;
  export function stop(): void;
  export function onProcessed(callback: (result: any) => void): void;
  export function onDetected(callback: (result: any) => void): void;
}
// -------------------------------------------------------------------------- //
