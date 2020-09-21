const const_ocr = {
    base64(file, callback){
        var coolFile = {};
        function readerOnload(e){
          var base64 = btoa(e.target.result);
          coolFile.base64 = base64;
          callback(coolFile)
        };
      
        var reader = new FileReader();
        reader.onload = readerOnload;
      
        var file = file[0].files[0];
        coolFile.filetype = file.type;
        coolFile.size = file.size;
        coolFile.filename = file.name;
        reader.readAsBinaryString(file);
     },
    ocr (imagebase64, fct) {    
        // Open connection to api.openalpr.com
        var secret_key = "sk_fe1dde1d9da8ba41e2b1f796";
        var url = "https://api.openalpr.com/v3/recognize_bytes?recognize_vehicle=1&country=us&secret_key=" + secret_key;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);

        // Send POST data and display response
        xhr.send(imagebase64);  // Replace with base64 string of an actual image
        xhr.onreadystatechange = ()=> {
            if (xhr.readyState == 4) {
               
                var data = JSON.parse(xhr.responseText);
                if (data.results.length>0) {
                    fct (data.results[0].plate);
                }
                else
                    fct("");
            } else {
                fct("");
            }
        }
    }
}


export default {
	api: const_ocr
}