<?php

class Flowchart {

    public static $ALL_SHAPES = array(
        'begin', 'process', 'display', 'end', 'connector', 'decision', 'manual_input'
    );

    public static function createFlowchart(WebGuy\FlowSteps $I) {
        $I->amGoingTo('\nCreate a new flowchart\n');

        $I->amOnPage('/flowchart/');

        $I->click('#createNew');

        $flowchartName = 'FlowchartTest' . rand();
        $I->fillField('.alertify-text', $flowchartName);

        $I->click('button#alertify-ok');

        $I->wait(1);

        $I->seeElement('#flowchart-tab a.active');

        $I->seeElement('#flowchart-container div.flowchart');

        $I->executeJs('window.location.href = "/flowchart/load/" + $(".flowchart").attr("data-flow-id")');

        return array('id' => $I->grabIdFromCurrentUrl());
    }

    /**
     * TODO pagination click
     */
    public static function loadFlowchart(WebGuy\FlowSteps $I, $flowchartId) {
        $I->amGoingTo('\nLoad flowchart\n');

        $I->amOnPage('/flowchart/load/' . $flowchartId);

        $I->wait(1);

        $I->seeElement('div.flowchart[data-flow-id="' . $flowchartId . '"]');

        return array('id' => $I->grabIdFromCurrentUrl());
    }

    /**
     * TODO search for flowchart on the pagination
     */
    public static function deleteFlowchart(WebGuy\FlowSteps $I, $flowchartId) {
        $I->amGoingTo('\nDelete a flowchart\n');

        $I->click('#toggle-settings');

        $I->wait(1);

        $I->click('#delete');

        $I->see('Tem certeza que deseja excluir este fluxograma?');

        $I->click('button#alertify-ok');

        $I->wait(1);

        $I->cantSeeElement('#flowchart-settings *'); // hidden

        $I->cantSeeElement('div.flowchart[data-flow-id="' . $flowchartId . '"]');

        $I->cantSeeElement('div#flowchart-tab a.active');

        $I->amOnPage('/flowchart/load/' . $flowchartId);

        $I->cantSeeElement('div.flowchart[data-flow-id="' . $flowchartId . '"]');

        $I->cantSeeElement('div#flowchart-tab a.active');
    }

    public static function createShapes(WebGuy\FlowSteps $I, array $shapes) {
        foreach ($shapes as $shape) {
            $I->executeJs("Utilities.generateShape('$shape')");
        }
        $I->wait(1);
    }

    /**
     */
    public static function createAndDragShapes(WebGuy\FlowSteps $I, array $shapes) {
        self::createAndDragShapes($I, $shapes);
    }

    public static function connectShapes(WebGuy\FlowSteps $I, array $connections) {
        foreach ($connections as $conn) {
            $sourceSelector = 'div.flowchart div[data-flow-name="' . $conn['source'] . '"]';
            $targetSelector = 'div.flowchart div[data-flow-name="' . $conn['target'] . '"]';

            $I->executeJs("jsPlumb.connect({source: $('$sourceSelector'), target: $('$targetSelector')})");

            $I->moveMouseOver($sourceSelector);
            $I->dragAndDrop($sourceSelector . ' img', $targetSelector);
        }
    }

    /**
     *
     * @param WebGuy\FlowSteps $I
     * @param array $shapes format === array('shapeType' => array('editable' => true|false), ...)
     */
    public static function editShapesValues(WebGuy\FlowSteps $I, array $shapes) {
        foreach ($shapes as $shapeType => $value) {
            if (isset($value['text'])) {
                self::editShapeValue($I, $shapeType, $value['isEditable'], $value['text']);
            }
            else {
                self::editShapeValue($I, $shapeType, $value['isEditable']);
            }
        }
    }

    public static function editShapeValue(WebGuy\FlowSteps $I, $shape, $isEditable, $text = null) {
        $shapeSelector = 'div.flowchart div[data-flow-name="' . $shape . '"]';
        $I->doubleClick($shapeSelector);
        $I->wait(1);
        if ($isEditable) {
            $I->cantSeeElement($shapeSelector . ' code'); // can't se <p> tag
            $text = isset($text) ? $text : 'x <- ' . rand();
            $I->fillField(($shapeSelector . ' input'), $text); // fill shape with this $text

            $I->click('div.flowchart'); // click outside

            $I->cantSeeElement($shapeSelector . ' input'); // can not see textarea anymore
            $I->see($text, $shapeSelector . ' code'); // but now i see the typed text on a <p> tag (insde the shape)
        }
        else {
            $I->cantSeeElement($shapeSelector . ' input');
        }
    }

    public static function changeConnections(WebGuy\FlowSteps $I, array $connections) {
        foreach ($connections as $newConnection) {
            $source = $newConnection['source'];
            $target = $newConnection['target'];
            $to = $newConnection['to'];

            //$I->dragAndDrop($el1, $el2);
        }
        $I->wait(3);
    }

    public static function deleteShapes(WebGuy\FlowSteps $I, array $shapes) {
        foreach ($shapes as $shape) {
            $shapeSelector = 'div.flowchart div[data-flow-name="' . $shape . '"]';
            $I->focus($shapeSelector);
            $I->click($shapeSelector);
            $shapeFocusedSelector = $shapeSelector . '[name="shape-with-focus"]';
            $I->seeElement($shapeFocusedSelector);
            $I->pressKeyUp($shapeFocusedSelector, 46); // 46 === DEL KEY CODE
            $I->cantSeeElement($shapeSelector);

        }

        return $shapes;
    }

    public static function seeThatShapeIsHightlighted(WebGuy\FlowSteps $I, $shapeSelector) {
        $I->seeElement($shapeSelector); //TODO
    }

}
