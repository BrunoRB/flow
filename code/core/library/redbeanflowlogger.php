<?php

class RedBeanFlowLogger implements RedBean_Logger {

    public function log() {
        if ( func_num_args() < 1 ) {
            return;
        }

        foreach (func_get_args() as $arg) {
            if (core\Config::$SERVER_TYPE === core\Vars::SERVER_DEVELOPMENT) {
                $script = '<script>console.log(' . json_encode($arg) . ');</script>';
                //echo $script;
            }
        }

    }

}