// -------------------------------------------------------------------------- //
// authors:
// - Tancredi-Paul Grozav <paul@grozav.info>
// -------------------------------------------------------------------------- //
// src/components/BarcodeScanner.tsx

import React, { useEffect, useRef } from "react";
import Quagga from "quagga";
// import { stringify } from "querystring";
// import { start } from "repl";

interface BarcodeScannerProps {
  onBarcodeDetected: (data: any) => void
};

interface ScannedValue {
  code: string;
  format: string;
};

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onBarcodeDetected }) =>
{
  const scannerRef = useRef<HTMLDivElement>(null);
  const inputCodeRef = useRef<HTMLInputElement>(null);
  const inputFormatRef = useRef<HTMLInputElement>(null);
  var isScannerInitialized:boolean = false;
  var currentStream:MediaStream|null = null;

  const quagga_config:Quagga.Config = {
    inputStream:
    {
      name: "Live",
      type: "LiveStream" as "LiveStream" | "ImageStream",
      target: null,
      constraints: {
        width: 640,
        height: 480,
        facingMode: "environment", // Use the rear camera
      },
    },
    decoder:
    {
      // Choose barcode formats
      // readers: ["code_128_reader", "ean_reader", "ean_8_reader",
      //   "upc_reader"], 
      readers: ["ean_reader", "ean_8_reader"],
      // Disable multiple value detection to focus on one barcode
      // multiple: false,
      // debug: {
      //   drawBoundingBox: true,
      //   showFrequency: true,
      //   drawScanline: true,
      //   showPattern: true,
      // },
    },
    // Locating the barcode in the image
    locate: true,
  };

  var previously_scanned_value: ScannedValue = { code: "", format: "" };
  var current_scanned_value_certainty: number = 0;
  // How many consecutive times, the value has to be read to declare it good
  var scanned_certainty_threshold: number = 10;

  const initScanner = () =>
  {
    if(isScannerInitialized)
    {
      return;
    }
    // console.log("Initializing QuaggaJS scanner ...");
    Quagga.onDetected(quagga_detected_handler);
    // Quagga.onProcessed((result) => {
    //   console.log("Barcode processed:", result);
    // });

    var cfg:Quagga.Config = quagga_config;
    cfg.inputStream.target = scannerRef.current as HTMLDivElement;
    Quagga.init(cfg, quaggaInitHandler);
  };
  
  const quaggaInitHandler = (err: any) =>
  {
    if (err) {
      console.error("Error initializing Quagga:", err);
      return;
    }
    // console.log("Quagga initialized successfully");
    if(!isScannerInitialized)
    {
      // console.log("Quagga initialized successfully for the 1st time");
      isScannerInitialized = true;
      startScanner();
    }
  };

  const startScanner = () =>
  {
    initScanner();
    Quagga.start();
    // var track = Quagga.CameraAccess.getActiveTrack();
    // track.applyConstraints({advanced: [{torch: true}]});

    // Save the media stream
    const video = scannerRef.current?.firstElementChild as HTMLVideoElement;
    currentStream = video.srcObject as MediaStream;
  };

  const stopScanner = () =>
  {
    if (currentStream !== null) {
      // console.log(currentStream);
      // Stop all media tracks
      const tracks = currentStream.getTracks();
      tracks.forEach(track => track.stop());
    }
    Quagga.stop();
    // console.log("Scanner turned off");
  };
      
  const manual_input_submit = () =>
  {
    onBarcodeDetected({
      code: inputCodeRef.current?.value,
      format: inputFormatRef.current?.value,
    });
  };

  const quagga_detected_handler = (data: any) =>
  {
    // console.log("Barcode detected:", data.codeResult.code);
    var code = data.codeResult.code;
    var format = data.codeResult.format;
    if (previously_scanned_value.code == code &&
      previously_scanned_value.format == format)
    {
      current_scanned_value_certainty += 1;
    }else{
      current_scanned_value_certainty = 0;
    }
    // console.log(current_scanned_value_certainty)
    previously_scanned_value.code = code;
    previously_scanned_value.format = format;

    var id = code + " " + format;
    if (current_scanned_value_certainty >= scanned_certainty_threshold)
    {
      onBarcodeDetected(previously_scanned_value);
      previously_scanned_value = { code: "", format: "" };
    }
    
    
    // In this, we attempt to render all values, and their frequency
    //log(id);
    // var found = false;
    // for (const [key, value] of Object.entries(scanner_values))
    // {
    //   if(key == id)
    //   {
    //     found = true;
    //     //value++;
    //     scanner_values[key]++;
    //     break;
    //   }
    // }
    // if(!found)
    // {
    //   scanner_values[id] = 1;
    // }
    // render_sorted_scanner_values();        

  };    

  useEffect(() => {
    // if (scannerRef.current) {
    initScanner();
    // return () => {
    //   stopScanner();
    // };
    // }
  }, []);

  return (
    <div>
      <button onClick={startScanner}>ON</button>
      <button onClick={stopScanner}>OFF</button>
      <label>Manual input -- </label>
      <label>code:</label>
      <input type="text" ref={inputCodeRef} />
      <label>format:</label>
      <input type="text" ref={inputFormatRef} />
      <input type="button" value="submit" onClick={manual_input_submit} />
      <div ref={scannerRef} style={{ width: "100%", height: "auto" }} />
    </div>
  );
};

export default BarcodeScanner;
// -------------------------------------------------------------------------- //
