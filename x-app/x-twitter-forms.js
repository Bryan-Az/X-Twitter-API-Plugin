// Function to make AJAX call to Flask application
function makeAjaxCall(url, method, data, callback) {
    var xhr = new XMLHttpRequest();
    
    // Set a timeout for the request
    xhr.timeout = 5000; // Set timeout to 5 seconds (5000 milliseconds)
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status === 200){
                console.log("xhr done successfully");
                var resp = xhr.responseText;
                var respJson = JSON.parse(resp);
                callback(respJson);
            } else {
                console.log("xhr failed with status code: " + xhr.status);
                console.log("Response text: " + xhr.responseText);
                // You can call the callback with an error message to handle it in your UI
                callback({ success: false, message: "HTTP error: " + xhr.status });
            }
        } else {
            console.log("xhr processing going on");
        }
    };
    
    xhr.ontimeout = function() {
        console.log("Request timed out");
        // You can call the callback with an error message to handle it in your UI
        callback({ success: false, message: "Request timed out" });
    };
    
    xhr.onerror = function() {
        console.log("xhr failed");
        // You can call the callback with an error message to handle it in your UI
        callback({ success: false, message: "XHR failed" });
    };
    
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
}


// Event listener for create tweet form
document.getElementById('create_tweet_form').addEventListener('submit', function(event) {
    event.preventDefault();
    var tweet_content = document.getElementById('tweet_content').value;
    var encoded_tweet_content = encodeURIComponent(tweet_content);
    makeAjaxCall("/wp-admin/admin-ajax.php", "POST", "method=create&tweet_content=" + encoded_tweet_content, function(respJson){
        console.log("received server response");
        console.log(respJson);
        document.getElementById('create_tweet_div').innerHTML = respJson.message;
    });
});

// Event listener for delete tweet form
document.getElementById('delete_tweet_form').addEventListener('submit', function(event) {
    event.preventDefault();
    var tweet_id = document.getElementById('tweet_id').value;
    var encoded_tweet_id = encodeURIComponent(tweet_id);
    makeAjaxCall("/wp-admin/admin-ajax.php", "POST", "method=delete&tweet_id=" + encoded_tweet_id, function(respJson){
        console.log("received server response");
        console.log(respJson);
        document.getElementById('delete_tweet_div').innerHTML = respJson.message;
    });
});
