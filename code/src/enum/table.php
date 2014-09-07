<?php

namespace src\enum;

class Table {
    const FLOWCHART = 'flowchart';

    const SHAPE = 'shape';

    const SHAPE_DEFINITION = 'shapedefinition';

    const USER = 'flowuser';

    const SHAPE_CONNECTION = 'shapeconnection';

    public static $ALL_TABLES = [
        self::SHAPE_CONNECTION, self::SHAPE, self::SHAPE_DEFINITION, self::FLOWCHART, self::USER
    ];
}