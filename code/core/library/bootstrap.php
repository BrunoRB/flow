<?php

// composer libraries
require_once \core\Vars::VENDOR_ROOT . '/autoload.php';

// readbean
class RedBeanModelFormatter {
     public function formatModel($model) {
        return '\src\entity\\' . $model;
     }
}

RedBean_Facade::setup('pgsql:host=localhost;dbname=flow', 'admin','admin', true); //postgresql
RedBean_Facade::debug(true, new RedBeanFlowLogger());
RedBean_Facade::freeze(true);

$formatter = new RedBeanModelFormatter();
RedBean_ModelHelper::setModelFormatter($formatter);

//\\