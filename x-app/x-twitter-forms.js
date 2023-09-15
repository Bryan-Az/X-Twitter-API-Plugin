// Function to make AJAX call to Flask application
function makeAjaxCall(url, methodType, callback){
   var xhr = new XMLHttpRequest();
   xhr.open(methodType, url, true);
   xhr.send();
   xhr.onreadystatechange = function(){
      if (xhr.readyState === 4){
         if (xhr.status === 200){
            console.log("xhr done successfully");
            var resp = xhr.responseText;
            var respJson = JSON.parse(resp);
            callback(respJson);
         } else {
            console.log("xhr failed");
         }
      } else {
         console.log("xhr processing going on");
      }
   }
   console.log("request sent to the server");
}

// The actual AJAX call to "/wp-admin/admin-ajax.php"
makeAjaxCall("/wp-admin/admin-ajax.php", "GET", function(respJson){
   console.log("received server response");
   console.log(respJson);
});
