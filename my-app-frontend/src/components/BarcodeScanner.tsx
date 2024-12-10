// -------------------------------------------------------------------------- //
// authors:
// - Tancredi-Paul Grozav <paul@grozav.info>
// -------------------------------------------------------------------------- //
// src/components/BarcodeScanner.tsx

import React, { useEffect, useRef } from "react";
import Quagga, { onDetected } from "quagga";
import { stringify } from "querystring";

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

  var previously_scanned_value: ScannedValue = { code: "", format: "" };
  var current_scanned_value_certainty: number = 0;
  // How many consecutive times, the value has to be read to declare it good
  var scanned_certainty_threshold: number = 10;

  const manual_input_submit = () =>
  {
    onBarcodeDetected({
      code: inputCodeRef.current?.value,
      format: inputFormatRef.current?.value,
    });
  };

  useEffect(() => {
    if (scannerRef.current) {
      const quagga_config = {
        inputStream:
        {
          name: "Live",
          type: "LiveStream" as "LiveStream" | "ImageStream",
          //target: document.querySelector("#camera") as Element
          target: scannerRef.current,
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

      const quagga_init_handler = (err: any) =>
      {
        if (err) {
          console.error("Error initializing Quagga:", err);
          return;
        }
        console.log("Quagga initialized successfully");
        Quagga.start();
        // var track = Quagga.CameraAccess.getActiveTrack();
        // track.applyConstraints({advanced: [{torch: true}]});
        // Quagga.onDetected(quagga_detected_handler);
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
      Quagga.init(quagga_config, quagga_init_handler);
  
      Quagga.onDetected(quagga_detected_handler);

      // Quagga.onProcessed((result) => {
      //   console.log("Barcode processed:", result);
      // });

      return () => {
        Quagga.stop();
      };
    }
  }, []);

  return (
    <div>
      <h2>Barcode Scanner</h2>
      <div ref={scannerRef} style={{ width: "100%", height: "auto" }} />
      <label>Manual input -- </label>
      <label>code:</label>
      <input type="text" ref={inputCodeRef} />
      <label>format:</label>
      <input type="text" ref={inputFormatRef} />
      <input type="button" value="submit" onClick={manual_input_submit} />
    </div>
  );
};

export default BarcodeScanner;
// -------------------------------------------------------------------------- //
