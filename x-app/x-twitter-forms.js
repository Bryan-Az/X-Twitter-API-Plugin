// Function to make AJAX call to Flask application
function makeAjaxCall(url, method, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/wp-admin/admin-ajax.php?action=x_twitter_proxy_endpoint", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //logs
    console.log('Receieved request with data: ', JSON.stringify(data));
    // Set a timeout for the request
    xhr.timeout = 5000; // Set timeout to 5 seconds (5000 milliseconds)
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status === 200){
                console.log("xhr done successfully");
                var resp = xhr.responseText;
                console.log("Raw response: ", resp);
                var respJson = JSON.parse(resp);
                callback(respJson.data);
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

    console.log('Sending request with data: ', JSON.stringify(data));
    xhr.send(JSON.stringify(data));

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
}


// Event listener for create tweet form
document.getElementById('create_tweet_form').addEventListener('submit', function(event) {
    event.preventDefault();
    var tweet_content_value = document.getElementById('tweet_content').value;

    var data = {
        action: "x_twitter_proxy_endpoint",
        method: "create",
        tweet_content: tweet_content_value
    };

    makeAjaxCall("/wp-admin/admin-ajax.php", "POST", data, function(respJson){
        console.log("received server response");
        console.log(respJson);
        document.getElementById('create_tweet_div').innerHTML = 'Created successfully!';
    });
});

// Event listener for delete tweet form
document.getElementById('delete_tweet_form').addEventListener('submit', function(event) {
    event.preventDefault();
    var tweet_id_value = document.getElementById('tweet_id').value;

    var data = {
        action: "x_twitter_proxy_endpoint",
        method: "delete",
        tweet_id: tweet_id_value
    };

    makeAjaxCall("/wp-admin/admin-ajax.php", "POST", data, function(respJson){
        console.log("received server response");
        console.log(respJson);
        document.getElementById('delete_tweet_div').innerHTML = 'Deleted successfully!';
    });
});
