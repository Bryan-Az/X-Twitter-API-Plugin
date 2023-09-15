<?php
/*
Plugin Name: X-Twitter-Plugin
Description: A plugin to create and delete tweets.
Version: 1.0
Author: 
*/

// Enqueue the JavaScript file
function enqueue_x_twitter_scripts() {
    wp_enqueue_script('x-twitter-forms', plugins_url('/x-twitter-forms.js', __FILE__), array('jquery'), '1.0', true);
}
add_action('wp_enqueue_scripts', 'enqueue_x_twitter_scripts');

// Create the x_twitter_proxy_endpoint_function
function x_twitter_proxy_endpoint_function() {
    $Bearer_Token = "AAAAAAAAAAAAAAAAAAAAAKGzpwEAAAAAuVAgSvRyNqlIAm6kyf%2BI3aOGaek%3DcULZR3mRlJF5ehTaVdczOGXYGj5rh79YC8TfkZ1LTxm8WNLGOK"; // Replace with actual Bearer Token
    $url = "http://localhost:5000"; // Replace with actual Flask app URL

    if ($_POST['method'] == 'create') {
        $tweet_content = $_POST['tweet_content'];
        $response = wp_remote_post($url . "/create_tweet", array(
            'headers' => array('Authorization' => 'Bearer ' . $Bearer_Token),
            'body' => array('tweet_content' => $tweet_content)
        ));
    } else if ($_POST['method'] == 'delete') {
        $tweet_id = $_POST['tweet_id'];
        $response = wp_remote_post($url . "/delete_tweet", array(
            'headers' => array('Authorization' => 'Bearer ' . $Bearer_Token),
            'body' => array('tweet_id' => $tweet_id)
        ));
    } else if ($_POST['method'] == 'retrieve') {
        $response = wp_remote_get($url . "/retrieve_tweet", array(
            'headers' => array('Authorization' => 'Bearer ' . $Bearer_Token)
        ));
    }

    if (is_wp_error($response)) {
        echo 'Error: ' . $response->get_error_message();
    } else {
        echo $response['body'];
    }

    die();
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
            <input type="hidden" id="tweet_id" name="tweet_id">
            <input type="submit" value="Delete Tweet">
        </form>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('x_twitter', 'x_twitter_shortcode_function');
?>
