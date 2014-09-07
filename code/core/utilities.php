<?php

namespace core;

/**
 * General useful methods
 */
class Utilities {

    /**
     *
     * @param string $page
     */
    public static function redirect($page) {
        header('Location: ' . $page);
    }

    /**
     *
     * @param type $request
     * @return type
     */
    public static function escapeRequestData($request) {
        $requestData = array();
        foreach ($request as $key => $value) {
            $requestData[$key] = $value;
        }
        return $requestData;
    }

    public static function isAjaxRequest() {
        return isset($_REQUEST['request_type']) && $_REQUEST['request_type'] === \core\Vars::REQUEST_AJAX;
    }
}
