<?php
/*
Plugin Name: X-Twitter-Plugin
Description: A plugin to create and delete tweets.
Version: 1.0
Author: Alexis Ambriz
*/
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
// Enqueue the JavaScript file
function enqueue_x_twitter_scripts() {
    wp_enqueue_script('x-twitter-forms', plugins_url('/x-twitter-forms.js', __FILE__), array('jquery'), '1.0', true);
}
add_action('wp_enqueue_scripts', 'enqueue_x_twitter_scripts');

// Create the x_twitter_proxy_endpoint_function
function x_twitter_proxy_endpoint_function() {
    error_log("x_twitter_proxy_endpoint_function called");
    $url = "http://x-twitter-flask-app:5000"; // Replace with actual Flask app URL

    // Get the raw JSON input
    $json_input = file_get_contents('php://input');
    error_log("Received data: " . $json_input);
    // Decode the JSON input to get the parameters
    $params = json_decode($json_input, true);
    // Get the method and tweet content from the decoded parameters
    $method = $params['method'] ?? null;

    // Validate the json
    if (json_last_error() !== JSON_ERROR_NONE) {
        wp_send_json_error('Invalid JSON payload received');
        return;
    }


    error_log("Received method: $method");
    $flask_app_url = 'http://x-twitter-flask-app:5000' . ($method === 'create' ? 'create_tweet' : 'delete_tweet');
    error_log("Flask app URL: $flask_app_url");

    if ($method == 'create') {
        $tweet_content = $params['tweet_content'];
        $response = wp_remote_post($url . "/create_tweet", array(
            'headers' => array(
                'Content-Type' => 'application/json'
            ),
            'body' => json_encode(array('tweet_content' => $tweet_content))
        ));

        if (is_wp_error($response)) {
            error_log("WP error: " . $response->get_error_message());
            wp_send_json_error($response->get_error_message());
        } else {
            error_log("Received response from Flask app: " . wp_remote_retrieve_body($response));
            wp_send_json_success(wp_remote_retrieve_body($response));
        }

    } else if ($method == 'delete') {
        $tweet_id = $params['tweet_id'];
        $response = wp_remote_request($url . "/delete_tweet", array(
            'method' => 'DELETE',
            'headers' => array(
                'Content-Type' => 'application/json'
            ),
            'body' => json_encode(array('tweet_id' => $tweet_id))
        ));

        if (is_wp_error($response)) {
            error_log("WP error: " . $response->get_error_message());
            wp_send_json_error($response->get_error_message());
        } else {
            error_log("Received response from Flask app: " . wp_remote_retrieve_body($response));
            wp_send_json_success(wp_remote_retrieve_body($response));
        }

    }
}
add_action('wp_ajax_x_twitter_proxy_endpoint', 'x_twitter_proxy_endpoint_function');
add_action('wp_ajax_nopriv_x_twitter_proxy_endpoint', 'x_twitter_proxy_endpoint_function');

// Create the short-code for the front-end GUI
function x_twitter_shortcode_function() {
    ob_start();
    ?>
    <div id="create_tweet_div">
        <form id="create_tweet_form">
            <textarea id="tweet_content" name="tweet_content" rows="4" cols="50"></textarea>
            <input type="submit" value="Create Tweet">
        </form>
    </div>
    <div id="delete_tweet_div">
        <form id="delete_tweet_form">
            <textarea id="tweet_id" name="tweet_id" rows="4" cols="50"></textarea>
            <input type="submit" value="Delete Tweet">
        </form>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('x_twitter', 'x_twitter_shortcode_function');
?>
