// -------------------------------------------------------------------------- //
// authors:
// - Tancredi-Paul Grozav <paul@grozav.info>
// -------------------------------------------------------------------------- //
// Published at:
// https://tancredi-paul-grozav.gitlab.io/web-product-scanner
//
// Maybe we could use something like this in the future:
// https://www.material-react-table.com/docs/examples/editing-crud
// -------------------------------------------------------------------------- //
import React, { useEffect, useState, useRef } from "react";
import "./App.css";
// Import the BarcodeScanner component
import BarcodeScanner from "./components/BarcodeScanner";
// import Table from "./components/Table";
// import GoogleSignIn from './components/GoogleSignIn';
import Supabase from './components/Supabase';

function App() {
  const [message, setMessage] = useState<string>("Loading...");
  const [deferredPrompt, setDeferredPrompt] = useState<any | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // fetch("http://localhost:5000/api/hello")
    //   .then((response) => response.json())
    //   .then((data) => setMessage(data.message))
    //   .catch((error) => {
    //     console.error(error);
    //     setMessage("Error loading message");
    //   });


    // The follwing are for the Install App button
    // Listen for the `beforeinstallprompt` event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent the default mini-infobar
      setDeferredPrompt(e); // Save the event for later use
      setIsInstallable(true); // Show the install button
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);


  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt(); // Show the install prompt

    const choiceResult = await deferredPrompt.userChoice; // Wait for the user to respond
    if (choiceResult.outcome === "accepted") {
      console.log("App installed");
    } else {
      console.log("App installation rejected");
    }

    setDeferredPrompt(null); // Clear the deferred prompt
  };

  const onBarcodeDetected = (scanned_value: any) =>
  {
    // console.log("PARENT.onBarcodeDetected(", scanned_value, ")");

    var code = scanned_value.code;
    var format = scanned_value.format;
    (codeProductEditRef.current as HTMLInputElement).value = code;
    (codeFormatProductEditRef.current as HTMLInputElement).value = format;
    var id = code + " " + format;

    // display the found product
    var scanned_product = product_for_code(scanned_value);
    if(scanned_product != null)
    {
      selected_product_id = (scanned_product as any).id;
      console.log(JSON.stringify(scanned_product));
      list_products();
      list_items();
    }

    // // In this, we attempt to render all values, and their frequency
    // //log(id);
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














  // vars
  // var previously_scanned_value = {
  //   "code": "",
  //   "format": ""
  // };
  // this certainty is 0 when value is met for the first time, and it is
  // increased each time the same value is read consecutively.
  // var current_scanned_value_certainty = 0;
  // var scanned_certainty_threshold = 10;
  // var scanner_values = {
  //   "1234567890123 ean_13": 9999
  // };

  const nameProductEditRef = useRef<HTMLInputElement | null>(null);
  const codeProductEditRef = useRef<HTMLInputElement | null>(null);
  const codeFormatProductEditRef = useRef<HTMLInputElement | null>(null);
  const productItemEditRef = useRef<HTMLInputElement | null>(null);
  const yearExpirationItemEditRef = useRef<HTMLInputElement | null>(null);
  const monthExpirationItemEditRef = useRef<HTMLInputElement | null>(null);
  const dayExpirationItemEditRef = useRef<HTMLInputElement | null>(null);
  const listOfProductsRef = useRef<HTMLParagraphElement | null>(null);
  const listOfItemsRef = useRef<HTMLParagraphElement | null>(null);

  // alert(Quagga);
  const log = (msg: string) =>
  {
    // document.getElementById("log").innerHTML += "<br/>" + msg;
  };

  // Function to download data to a file
  const download = (data: BlobPart, filename: string, type: string) =>
  {
    var file = new Blob([data], {type: type});
    // @ts-ignore: TypeScript does not know about msSaveOrOpenBlob in some
    // browsers
    if (window.navigator.msSaveOrOpenBlob)
    {
      // IE10+
      // @ts-ignore: TypeScript does not know about msSaveOrOpenBlob in some
      // browsers
      window.navigator.msSaveOrOpenBlob(file, filename);
    }
    else
    {
      // Others
      var a = document.createElement("a");
      var url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function()
      {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);  
      }, 0); 
    }
  };

  interface Product {
    id: number;
    code_value: string;
    code_format: string;
    name: string;
    // Index signature
    [key: string]: string | number;
  };
  interface Item {
    id: number;
    product_id: number;
    expiration_year: number;
    expiration_month: number;
    expiration_day: number | null;
    // Index signature
    [key: string]: number | null;
  };
  var db = {
    "products": [
      {
        "id": 1,
        "code_value": "1234567890123",
        "code_format": "ean_13",
        "name": "Iaurt Danone delicios 175g",
      },
      {
        "id": 2,
        "code_value": "3577060130017",
        "code_format": "ean_13",
        "name": "Chio popcorn sare 75g",
      },
      {
        "id": 3,
        "code_value": "0012345678912",
        "code_format": "ean_13",
        "name": "DUMMY - https://cdn-dfhjh.nitrocdn.com/BzQnABYFnLkAUVnIDRwDtF"+
          "jmHEaLtdtL/assets/images/optimized/rev-a58b9b0/www.gtin.info/wp-con"+
          "tent/uploads/2015/02/barcode-1.png",
      },
      {
        "id": 4,
        "code_value": "9780201379624",
        "code_format": "ean_13",
        "name": "DUMMY 2 - https://barcode.tec-it.com/barcode.ashx?data=978020"+
          "137962&code=EAN13&translate-esc=on",
      }
    ],
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "expiration_year": 2025,
        "expiration_month": 5,
        "expiration_day": 25
      },
      {
        "id": 2,
        "product_id": 1,
        "expiration_year": 2024,
        "expiration_month": 5,
        "expiration_day": 25
      },
      {
        "id": 3,
        "product_id": 2,
        "expiration_year": 2024,
        "expiration_month": 10,
        "expiration_day": null
      },
      {
        "id": 4,
        "product_id": 2,
        "expiration_year": 2025,
        "expiration_month": 2,
        "expiration_day": 11
      },
      {
        "id": 5,
        "product_id": 2,
        "expiration_year": 2025,
        "expiration_month": 2,
        "expiration_day": 11
      },
      {
        "id": 6,
        "product_id": 3,
        "expiration_year": 2025,
        "expiration_month": 2,
        "expiration_day": 11
      },
      {
        "id": 7,
        "product_id": 3,
        "expiration_year": 2026,
        "expiration_month": 2,
        "expiration_day": 11
      },
      {
        "id": 8,
        "product_id": 4,
        "expiration_year": 2025,
        "expiration_month": 7,
        "expiration_day": 11
      },
      {
        "id": 9,
        "product_id": 4,
        "expiration_year": 2026,
        "expiration_month": 7,
        "expiration_day": 11
      }
    ]
  };
  var selected_product_id: number = -1;
  var selected_item_id: number = -1;

  const product_for_code = (code: any) =>
  {
    var element = null;
    db.products.forEach((p) =>
    {
      if(p.code_value == code.code && p.code_format == code.format)
      {
        element = p;
        return;
      }
    });
    return element;
  };
  // log(JSON.stringify(product_for_code(
  //   {"code":"3577060130017","format":"ean_13"})));

  const product_for_id = (id: number):Product | null =>
  {
    var element = null;
    db.products.forEach((p) =>
    {
      if(p.id == id)
      {
        element = p;
        return;
      }
    });
    return element;
  };
  // log(JSON.stringify(product_for_id(2)));
// -------------------------------------------------------------------------- //
// Product CRUD
// -------------------------------------------------------------------------- //
  const create_product = () =>
  {
    var id = db.products[db.products.length - 1].id + 1;
    var code_value = codeProductEditRef.current?.value as string;
    var code_format = codeFormatProductEditRef.current?.value as string;
    var name = nameProductEditRef.current?.value as string;
    var product = {
      "id": id,
      "code_value": code_value,
      "code_format": code_format,
      "name": name
    };
    db.products.push(product);
    //log(JSON.stringify(product));
    list_products();
    log("Created product");
  };

  const list_products = () =>
  {
    var list_div = listOfProductsRef.current as HTMLParagraphElement;

    while (listOfProductsRef.current?.innerHTML !== "&nbsp;")
    {
      (listOfProductsRef.current as HTMLElement).removeChild(
        (listOfProductsRef.current as HTMLElement)
        .firstElementChild as HTMLElement)
    }
  
    var table = document.createElement("table");
    table.style.border = "1px solid black";
    list_div.appendChild(table);

    var header_row = document.createElement("tr");
    table.appendChild(header_row);

    var column_names = [
      "id",
      "name",
      "code_value",
      "code_format",
    ];
    column_names.forEach(function (col:string, i:number)
    {
      var cell = document.createElement("td");
      cell.style.border = "1px solid black";
      cell.textContent = col;
      header_row.appendChild(cell);
    });

    db.products.forEach(function callback(p:Product, index:number)
    {
      var row = document.createElement("tr");
      row.addEventListener("click", function(e)
      {
        selected_product_id = p.id;
        list_products();
        list_items();
        fill_product(p);
      });
      if(p.id === selected_product_id)
      {
        row.style.backgroundColor = "yellow";
      }
      table.appendChild(row);
      column_names.forEach(function (col:string, i:number)
      {
        var cell = document.createElement("td");
        cell.style.border = "1px solid black";
        cell.textContent = p[col] as string;
        row.appendChild(cell);
      });
    });
  };
  
  const update_product = () =>
  {
    var product_null:Product|null = product_for_id(selected_product_id);
    if(product_null !== null)
    {
      var product:Product = product_null;
      product.name = nameProductEditRef.current?.value as string;
      product.code_value = codeProductEditRef.current?.value as string;
      product.code_format = codeFormatProductEditRef.current?.value as string;
      list_products();
      log("update_product");
    }
  };

  const delete_product = () =>
  {
    db.products = db.products.filter(function(e) {
      return e.id !== selected_product_id; });
    list_products();
    log("Deleted product");
  };

  const fill_product = (p:Product) =>
  {
    (nameProductEditRef.current as any).value = p.name;
    (codeProductEditRef.current as any).value = p.code_value;
    (codeFormatProductEditRef.current as any).value = p.code_format;
    log("filled_product");
  };  
// -------------------------------------------------------------------------- //
// Item CRUD
// -------------------------------------------------------------------------- //
  const get_item = (id:number):Item =>
  {
    var ey = parseInt(yearExpirationItemEditRef.current?.value as string, 10);
    var em = parseInt(monthExpirationItemEditRef.current?.value as string, 10);
    var ed = parseInt(dayExpirationItemEditRef.current?.value as string, 10);
    var item:Item = {
      "id": id,
      "product_id": selected_product_id,
      "expiration_year": ey,
      "expiration_month": em,
      "expiration_day": ed
    };
    return item;
  };
  const create_item = () =>
  {
    var id = db.items[db.items.length - 1].id + 1;
    var item:Item = get_item(id);
    db.items.push(item);
    //log(JSON.stringify(item));
    list_items();
    log("Created item");
  };

  const list_items = () =>
  {
    var list_div = listOfItemsRef.current as Element;

    while (listOfItemsRef.current?.innerHTML !== "&nbsp;")
    {
      (listOfItemsRef.current as HTMLElement).removeChild(
        (listOfItemsRef.current as HTMLElement)
        .firstElementChild as HTMLElement)
    }
  
    var table = document.createElement("table");
    table.style.border = "1px solid black";
    list_div.appendChild(table);

    var header_row = document.createElement("tr");
    table.appendChild(header_row);

    var column_names = [
      "id",
      "expiration_year",
      "expiration_month",
      "expiration_day",
    ];
    column_names.forEach(function (col:string, i:number)
    {
      var cell = document.createElement("td");
      cell.style.border = "1px solid black";
      cell.textContent = col;
      header_row.appendChild(cell);
    });

    db.items.forEach(function callback(item:Item, index:number)
    {
      if(item.product_id !== selected_product_id)
      {
        return;
      }
      var row = document.createElement("tr");
      row.addEventListener("click", function(e)
      {
        selected_item_id = item.id;
        // list_products();
        list_items();
        fill_item(item);
      });
      if(item.id === selected_item_id)
      {
        row.style.backgroundColor = "yellow";
      }
      table.appendChild(row);
      column_names.forEach(function (col:string, i:number)
      {
        var cell = document.createElement("td");
        cell.style.border = "1px solid black";
        cell.textContent = "" + item[col];
        row.appendChild(cell);
      });
    });
  };
  
  const fill_item = (item:Item) =>
  {
    (productItemEditRef.current as any).value = item.product_id;
    (yearExpirationItemEditRef.current as any).value = item.expiration_year;
    (monthExpirationItemEditRef.current as any).value = item.expiration_month;
    (dayExpirationItemEditRef.current as any).value = item.expiration_day;
    log("filled_item");
  };

  const update_item = () =>
  {
    var item:any = db.items.filter(function(e) {
      return e.id === selected_item_id; })[0];
    var new_item:Item = get_item(selected_item_id);
    item.product_id = new_item.product_id;
    item.expiration_year = new_item.expiration_year;
    item.expiration_month = new_item.expiration_month;
    item.expiration_day = new_item.expiration_day;
    list_items();
    log("updated item");
  };
      
  const delete_item = () =>
  {
    db.items = db.items.filter(function(e) {
      return e.id !== selected_item_id; });
    list_items();
    log("Deleted item");
  };
// -------------------------------------------------------------------------- //
  const import_file = (event: any) =>
  {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function()
    {
      var text = reader.result as string;
      // log(text);
      db = JSON.parse(text);
      list_products();
      log("products loaded successfully.");
    };
    reader.readAsText(input.files[0]);
  };

  const export_file = () =>
  {
    var data = JSON.stringify(db);
    // log(data);
    download(data, "products.json", "application/json");
  };

  log("Starting...");


  // const render_sorted_scanner_values = () =>
  // {
  //   var varr = Object.entries(scanner_values);
  //   varr.sort((a,b) => (a[1] > b[1]) ? -1 : ((b[1] > a[1]) ? 1 : 0));
  //   //log(JSON.stringify(varr));
  //   while (codeProductEditRef.current?.innerHTML !== "&nbsp;")
  //   {
      // (codeProductEditRef.current as HTMLElement).removeChild(
      //   (codeProductEditRef.current as HTMLElement)
      //   .firstElementChild as HTMLElement)
  //   }
  //   varr.forEach((e) => {
  //     var id = e[1] + " - " + e[0];
  //     const newInput = document.createElement("input");
  //     newInput.type = "radio";
  //     newInput.name = "radio_code_product_edit";
  //     newInput.value = id;
  //     newInput.addEventListener("change", handleRadioChange);

  //     const newParagraph = document.createElement("label");
  //     newParagraph.innerText = id;

  //     const newLabel = document.createElement("label");
  //     newLabel.appendChild(newInput);
  //     newLabel.appendChild(newParagraph);

  //     codeProductEditRef.current?.appendChild(newLabel);
  //   });
  // };
  







////////////////////////////////////////////////////////////////////////////////
  // const [userInfo, setUserInfo] = useState<any>(null);

  // // Callback function after successful authentication
  // export const handleCredentialResponse = (response: any) => {
  //   console.log("Google authentication response:", response);
  //   const { credential } = response;
  //   // Send the ID token to your backend or verify it on the frontend
  //   // For simplicity, we'll assume the client directly uses the token for Google Drive API
  //   localStorage.setItem("google_token", credential); // Store token to local storage
  //   getUserInfo(credential); // Fetch user information
  // };

  // // Get user info using Google OAuth credentials (token)
  // const getUserInfo = async (token: string) => {
  //   const response = await fetch("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + token);
  //   const userData = await response.json();
  //   console.log("User Info:", userData);
  //   setUserInfo(userData);
  // };

  // Handle file upload to Google Drive
  const handleFileUpload = async (file: Blob) => {
    const token = localStorage.getItem("google_token");

    if (!token) {
      alert("User not authenticated");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    
    const driveResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const driveData = await driveResponse.json();
    console.log('Drive Response:', driveData);
  };
////////////////////////////////////////////////////////////////////////////////

  const save_db = () =>
  {
    localStorage.setItem("products_db", JSON.stringify(db));
  };





  useEffect(() => {
    var tmp:any = localStorage.getItem("products_db");
    if(tmp !== null)
    {
      db = JSON.parse(tmp as string);
    }
    // render_sorted_scanner_values();
    // onBarcodeDetected({"code":"0012345678912", "format": "ean_13"});
    list_products();
  });
























  return (
    <div className="App">
      <h1>{message}</h1>
      <input type="button" onClick={save_db} value="Save DB"/>
      , <button onClick={export_file}>Export</button>
      or Import: <input type="file" accept="application/json"
        onChange={import_file}/>

      <hr/>

      <a href="#products">products:</a>
      <p ref={listOfProductsRef}>&nbsp;</p>

      <a href="#items">items:</a>
      <p ref={listOfItemsRef}>&nbsp;</p>

      <a href="#product_edit">edit product:</a>
      <p>
        <br/> name: <input type="text" ref={nameProductEditRef}/>
        <br/> code: <input type="text" ref={codeProductEditRef}/>
        <br/> code_format: <input type="text" ref={codeFormatProductEditRef}/>
        <br/> <label>Product action:</label>
        <input type="button" onClick={create_product} value="Create"/>
        <input type="button" onClick={update_product} value="Update"/>
        <input type="button" onClick={delete_product} value="Delete"/>
      </p>
      <a href="#item_edit">edit item:</a>
      <p>
        <br/> product: <input type="number"
          ref={productItemEditRef}/>
        <br/> Expiration: 
        <br/> year: <input type="number" min="2000" max="3000"
          ref={yearExpirationItemEditRef}/>
        <br/> month: <input type="number" min="1" max="12"
          ref={monthExpirationItemEditRef}/>
        <br/> day: <input type="number" min="1" max="31"
          ref={dayExpirationItemEditRef}/>
        <br/> <label>Item action:</label>
        <input type="button" onClick={create_item} value="Create"/>
        <input type="button" onClick={update_item} value="Update"/>
        <input type="button" onClick={delete_item} value="Delete"/>
      </p>

      <a href="#camera">camera:</a>
      {/* Use the BarcodeScanner component */}
      <BarcodeScanner onBarcodeDetected={onBarcodeDetected} />
      <p id="camera">&nbsp;</p>

      <a href="#log">log:</a>
      <p id="log">&nbsp;</p>

      <hr/>
      {/* <h1>React Google Drive Upload Example</h1>
      {!userInfo ? (
        <div id="g_id_onload"
          data-client_id="29351427051-o8o8g4dhd68l45ifshsc69lvui69jnfi.apps.googleusercontent.com"
          data-callback={handleCredentialResponse}>
        </div>
      ) : (
        <div>
          <p>Welcome, {userInfo.name}</p>
          </div>
          )} */}
      {/* <div className="g_id_signin" data-type="standard"></div> */}
      {/* <GoogleSignIn /> */}
      {/* <button onClick={() => handleFileUpload(new Blob([JSON.stringify({ key: "value" })], { type: 'text/plain' }))}>
        Upload JSON to Google Drive
      </button>
      <hr/> */}
      {isInstallable && (
        <button onClick={handleInstallClick} style={{ padding: "10px 20px", fontSize: "16px" }}>
          Install App
        </button>
      )}
      {/* <MyComponent/><hr/> */}
      {/* <Supabase/> */}
    </div>
  );
}

export default App;
// -------------------------------------------------------------------------- //
