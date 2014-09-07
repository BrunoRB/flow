<?php

namespace core\install;

/**
 * Flowchart examples data
 */
class Examples {

    public static $flowchartsNames = [
        'begin' => ['Ex Início e Fim'],
        'end' => ['Ex Início e Fim'],
        'display' => ['Ex Exibição'],
        'process' => ['Ex Processamento'],
        'manual_input' => ['Ex Entrada Manual'],
        'decision' => ['Ex Decisão Simples', 'Ex: While', 'Ex Do While'],
        'connector' => ['Ex Conector']
    ];

    public static function getExampleUser() {
        return [
            'name' => 'Examples',
            'email' => 'example@example.com',
            'password' => 'example$#09EXAMPLE'
        ];
    }

    public static function getFlowcharts() {
        return array_merge(
            self::getBeginAndEndExample(), self::getDisplayExample(), self::getProcessExample(),
            self::getManualInputExample()//, self::getSimpleDecisionExample(), self::getWhileExample(),
            //self::getDoWhileExample(), self::getConnectorExample()
        );
    }

    private static function getBeginAndEndExample() {
        return [
            'begin' => [
                'name' => self::$flowchartsNames['begin'][0],
                'shapes' => [
                    'begin' => [
                        'shapeDefinition' => 'begin', 'value' => null, 'connectedTo' => 'end',
                        'left' => 50, 'top' => 50
                    ],
                    'end' => [
                        'shapeDefinition' => 'end', 'value' => null, 'connectedTo' => null,
                        'left' => 150, 'top' => 225
                    ]
                ]
            ]
        ];
    }

    private static function getDisplayExample() {
        return [
            'display' => [
                'name' => self::$flowchartsNames['display'][0],
                'shapes' => [
                    'begin' => [
                        'shapeDefinition' => 'begin', 'value' => null, 'connectedTo' => 'display',
                        'left' => 70, 'top' => 120
                     ],
                    'display' => [
                        'shapeDefinition' => 'display', 'value' => '"Olá mundo"', 'connectedTo' => 'end',
                        'left' => 230, 'top' => 25
                     ],
                    'end' => [
                        'shapeDefinition' => 'end', 'value' => null, 'connectedTo' => null,
                        'left' => 350, 'top' => 110
                     ]
                ]
            ]
        ];
    }

    private static function getProcessExample() {
        return [
            'process' => [
                'name' => self::$flowchartsNames['process'][0],
                'shapes' => [
                    'begin' => [
                        'shapeDefinition' => 'begin', 'value' => null, 'connectedTo' => 'processOne',
                        'left' => 110, 'top' => 115
                     ],
                    'processOne' => [
                        'shapeDefinition' => 'process', 'value' => 'variavel <- 10 * 10', 'connectedTo' => 'processTwo',
                        'left' => 335, 'top' => 220
                    ],
                    'processTwo' => [
                        'shapeDefinition' => 'process',
                        'value' => 'variavel <- variavel + 100',
                        'connectedTo' => 'display',
                        'left' => 440, 'top' => 400
                    ],
                    'display' => [
                        'shapeDefinition' => 'display', 'value' => '"Resultado:" + variavel', 'connectedTo' => 'end',
                        'left' => 605, 'top' => 5
                    ],
                    'end' => [
                        'shapeDefinition' => 'end', 'value' => null, 'connectedTo' => null,
                        'left' => 770, 'top' => 330
                    ]
                ]
            ]
        ];
    }

    private static function getManualInputExample() {
        return [
            'manual_input' => [
                'name' => self::$flowchartsNames['manual_input'][0],
                'shapes' => [
                    'begin' => [
                        'shapeDefinition' => 'begin', 'value' => null, 'connectedTo' => 'manual_input',
                        'left' => 110, 'top' => 115
                     ],
                    'manual_input' => [
                        'shapeDefinition' => 'manual_input', 'value' => 'variavel',
                        'connectedTo' => 'display', 'left' => 335, 'top' => 220
                    ],
                    'display' => [
                        'shapeDefinition' => 'display', 'value' => 'variavel', 'connectedTo' => 'end',
                        'left' => 605, 'top' => 5
                    ],
                    'end' => [
                        'shapeDefinition' => 'end', 'value' => null, 'connectedTo' => null,
                        'left' => 770, 'top' => 330
                    ]
                ]
            ]
        ];
    }

    private static function getSimpleDecisionExample() {
        return [];
        return [
            'simpleDecision' => [
                'name' => self::$flowchartsNames['decision'][0],
                'shapes' => [
                    'begin' => [
                        'shapeDefinition' => 'begin', 'value' => null, 'connectedTo' => 'processOne',
                        'left' => 110, 'top' => 115
                     ],
                    'processOne' => [
                        'shapeDefinition' => 'process', 'value' => 'variavel <- 10 * 10', 'connectedTo' => 'decision',
                        'left' => 335, 'top' => 220
                    ],
                    'decision' => [
                        'shapeDefinition' => 'decision',
                        'value' => 'variavel == 100',
                        'connectedTo' => 'display',
                        'left' => 440, 'top' => 400
                    ],
                    'display' => [
                        'shapeDefinition' => 'display', 'value' => '"Resultado:" + variavel', 'connectedTo' => 'end',
                        'left' => 605, 'top' => 5
                    ],
                    'end' => [
                        'shapeDefinition' => 'end', 'value' => null, 'connectedTo' => null,
                        'left' => 770, 'top' => 330
                    ]
                ]
            ]
        ];
    }

    private static function getWhileExample() {
        return [

        ];
    }

    private static function getDoWhileExample() {
        return [

        ];
    }

    private static function getConnectorExample() {
        return [

        ];
    }

}