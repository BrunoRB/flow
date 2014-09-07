<?php

namespace WebGuy;

class FlowSteps extends \WebGuy {

    public function loginHasTestUser() {
        $I = $this;
        $I->amOnPage('/home/');
        $I->fillField('input[name="login-email"]', 'teste@teste.com');
        $I->fillField('input[name="login-password"]', 'teste');
        $I->click('#logar');

        $I->maximizeWindow();
    }

    public function logout() {
        $I = $this;
        $I->amOnPage('/flowchart/logout');
    }

    public function dragAndDropShape($shapeType, $anchorNumber) {
        $I = $this;
        $selector = "span.ancora$anchorNumber";
        $I->executeJs("alertify.log('Dragging $shapeType shape')");
        $I->dragAndDrop('div.flowchart div[data-flow-name="' . $shapeType . '"][tabindex="-1"]', $selector);
    }

    /**
	 * Pega uma sequencia numérica da URL,
	 * util para capturar a ID de uma thing recém criada
	 */
	public function grabIdFromCurrentUrl() {
		$I = $this;
		return $I->grabFromCurrentUrl('/\/(\d+)/');
	}
}
