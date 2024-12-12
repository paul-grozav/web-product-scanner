// -------------------------------------------------------------------------- //
// authors:
// - Tancredi-Paul Grozav <paul@grozav.info>
// -------------------------------------------------------------------------- //
declare module 'quagga' {
// -------------------------------------------------------------------------- //
  namespace Quagga {
    interface Config {
      inputStream: {
        type: 'LiveStream' | 'ImageStream';
        // constraints: {
        //   width: number;
        //   height: number;
        //   facingMode: string;
        // };
        name: string;
        target: HTMLElement | null;
        constraints: {
          width:number;
          height: number;
          facingMode: "environment" | "user-facing"
        };
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

    interface InputStream {
      // Declare the method getStream returning MediaStream
      getStream(): MediaStream;
    }

    // Type for the Quagga static object
    interface QuaggaStatic {
      init(config: QuaggaJSConfig, callback: (err: any) => void): void;
      start(): void;
      stop(): void;
      onProcessed(callback: (result: any) => void): void;
      onDetected(callback: (result: any) => void): void;
      // Add inputStream with the extended definition
      inputStream: InputStream;
    }
  } // end of namespace
  // Export Quagga as the static object type
  const Quagga: Quagga.QuaggaStatic;
  export = Quagga;
// -------------------------------------------------------------------------- //
}
// -------------------------------------------------------------------------- //
