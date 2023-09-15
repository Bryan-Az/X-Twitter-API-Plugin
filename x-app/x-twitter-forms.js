// Function to make AJAX call to Flask application
function makeAjaxCall(url, methodType, data, callback){
   var xhr = new XMLHttpRequest();
   xhr.open(methodType, url, true);
   xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
   xhr.send(data);
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

// Event listener for create tweet form
document.getElementById('create_tweet_form').addEventListener('submit', function(event) {
    event.preventDefault();
    var tweet_content = document.getElementById('tweet_content').value;
    makeAjaxCall("/wp-admin/admin-ajax.php", "POST", "method=create&tweet_content=" + tweet_content, function(respJson){
        console.log("received server response");
        console.log(respJson);
        document.getElementById('create_tweet_div').innerHTML = "Tweet created successfully";
    });
});

// Event listener for delete tweet form
document.getElementById('delete_tweet_form').addEventListener('submit', function(event) {
    event.preventDefault();
    var tweet_id = document.getElementById('tweet_id').value;
    makeAjaxCall("/wp-admin/admin-ajax.php", "POST", "method=delete&tweet_id=" + tweet_id, function(respJson){
        console.log("received server response");
        console.log(respJson);
        document.getElementById('delete_tweet_div').innerHTML = "Tweet deleted successfully";
    });
});
