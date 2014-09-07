<?php

namespace src\controller;

use core\Utilities;

use \src\enum\Table;

use core\install\Examples;

use RedBean_Facade as R;

class FlowchartController extends \core\BaseController {

    public function create() {
        $postData = Utilities::escapeRequestData($_POST);

        $newFlochartBean = R::dispense(Table::FLOWCHART);
        $newFlochartBean->id = null;
        $newFlochartBean->name = $postData['name'];
        $newFlochartBean->fkFlowUser = $this->currentUser->id;
        $retval = R::store($newFlochartBean);

        R::close();

        return $retval;
    }

    public function delete($idFlowchart) {
        if (!isset($idFlowchart) || !$this->isOwnFlowchart($idFlowchart)) {
            return false;
        }

        $flowchartBean = R::load(Table::FLOWCHART, $idFlowchart);

        R::trash($flowchartBean);

        R::close();

        return true;
    }

    public function saveShape() {
        $post = Utilities::escapeRequestData($_POST['shapesData']);
		
        $idFlowchart = $post['idFlowchart'];
        if (!$this->isOwnFlowchart($idFlowchart)) {
            return false;
        }

        $id = isset($post['id']) ? $post['id'] : 0;
        $shape = R::load(Table::SHAPE, $id);
        $shape->value = $post['value'];
        $shape->positionLeft = $post['left'];
        $shape->positionTop = $post['top'];
        $shape->fkFlowchart = $post['idFlowchart'];
        $shape->fkShapeDefinition = $post['shapeDefinitionName'];

        $retval = R::store($shape);

        if (!is_int($retval) || $retval === 0) {
            return false;
        }

        R::close();

        return $retval;
    }

    public function update($idFlowchart) {
        if (!isset($_POST['flowchartNewData']) || !$this->isOwnFlowchart($idFlowchart)) {
            return false;
        }

        $postData = Utilities::escapeRequestData($_POST['flowchartNewData']);

        $flowchart = R::load(Table::FLOWCHART, $idFlowchart);

        if (isset($postData['name'])) {
            $flowchart->name = $postData['name'];
        }

        $flowchart->lastAlteration = date('Y-m-d H:i:s');

        $flowchart->isPublic = isset($postData['isPublic']) ? $postData['isPublic'] : false;

        $retval = R::store($flowchart);

        R::close();

        return $retval;
    }

    public function deleteConnection() {
        $post = Utilities::escapeRequestData($_POST);

        if (!isset($post['sourceId']) || !isset($post['targetId'])) {
            return false;
        }
        $sourceId = $post['sourceId'];
        $targetId = $post['targetId'];

		if (!$this->isShapeFromOwnFlowchart($sourceId) || !$this->isShapeFromOwnFlowchart($targetId)) {
			return false;
		}

        $connection = R::findAndExport(
            Table::SHAPE_CONNECTION, 'WHERE fk_source_shape=? AND fk_target_shape=?', array($sourceId, $targetId)
        );

        $connectionBean = R::convertToBeans(Table::SHAPE_CONNECTION, $connection);

        R::trash(reset($connectionBean));

        R::close();

        return true;
    }

    public function deleteShape($idShape) {
        if (!isset($idShape) || !$this->isShapeFromOwnFlowchart($idShape)) {
            return false;
        }

        $shape = R::findOne(Table::SHAPE, 'id=?', array($idShape));
        if (!isset($shape)) {
            return false;
        }

        R::trash($shape);

        R::close();

        return true;
    }

    /**
     * Return a flowchart given it's ID
     *
     * @param integer $idFlowchart
     * @return array
     */
    public function getFlowchart($idFlowchart) {
        if (!isset($idFlowchart) || !$this->canOpenFlowchart($idFlowchart)) {
            return false;
        }

		$flowcharts = R::findAndExport(Table::FLOWCHART, 'id=?', [$idFlowchart]);
        $flowchart = reset($flowcharts);
		$flowchart['isOwnFlowchart'] = $this->isOwnFlowchart($idFlowchart);

        R::close();

        return $flowchart;
    }

    /**
     * Get the menu-shapes from the database
     *
     * @return array \src\entity\ShapeDefinition
     */
    public function getMenuShapes() {
        $shapes = array();
        foreach (R::findAndExport(Table::SHAPE_DEFINITION) as $shape) {
            $newShape = new \src\entity\ShapeDefinition();
            $newShape->name = $shape['name'];
            $newShape->defaultValue = $shape['default_value'];
            $newShape->maxInputs = $shape['max_inputs'];
            $newShape->maxOutputs = $shape['max_outputs'];
            $newShape->maxCopies = $shape['max_copies'];
            $newShape->hasUserText = ($shape['has_user_text']) ? 'true' : 'false';
            $newShape->connLabelType = $shape['conn_label_type'];
            $shapes[] = $newShape;
        }

        R::close();

        return $shapes;
    }

    public function getShapesDefinitionDataParsedForExhibition() {
        $shapes = [];
        foreach (R::findAndExport(Table::SHAPE_DEFINITION) as $shapeData) {
            $name = $shapeData['name'];
            $shapes[$name] = $shapeData;

            $this->parseShapeDataForExhibition($shapes[$name]);

            $shapes[$name]['examples'] = $this->getExamplesIds($name);
        }
        return $shapes;
    }

    /**
     * Given a flowchart id get all shapes (and shapes connections) from this specific flowchart
     *
     * @param integer $idFlowchart
     * @return array()
     */
    public function getShapesData($idFlowchart) {
        $data = [];
        if (isset($idFlowchart) && $this->canOpenFlowchart($idFlowchart)) {
            $data['shapes'] = R::getAll(
                'SELECT * FROM ' . Table::SHAPE . ' WHERE fk_flowchart=?', array($idFlowchart)
            );

            $data['shapeconnections'] = R::getAll(
                'SELECT fk_source_shape, fk_target_shape, shapeconnection.value FROM shapeconnection INNER JOIN shape ON '
                . 'fk_source_shape = shape.id WHERE shape.fk_flowchart=' . $idFlowchart
            );

			$data['isOwnFlowchart'] = $this->isOwnFlowchart($idFlowchart);

            R::close();
        }

        return $data;
    }

    public function getNameFilter() {
        $get = Utilities::escapeRequestData($_GET);
        return isset($get['name']) ? filter_var($get['name'], FILTER_SANITIZE_STRIPPED) . '%': '%';
    }

    public function getOwnFlowchartsForPagination() {
        $flowcharts = array();
        $rbSelect = R::findAndExport(
            Table::FLOWCHART,
            'fk_flow_user=? AND name ILIKE ? OFFSET ? LIMIT ?',
            array($this->currentUser->id, $this->getNameFilter(), $this->getFrom() - 1, $this->getLimit())
        );
        foreach ($rbSelect as $flowchart) {
            $loadedFlowchart = new \src\entity\Flowchart();
            $loadedFlowchart->id = $flowchart['id'];
            $loadedFlowchart->name = $flowchart['name'];
            $loadedFlowchart->lastAlteration = $flowchart['last_alteration'];
            $loadedFlowchart->isPublic = $flowchart['is_public'];
            $loadedFlowchart->fkFlowUser = $flowchart['fk_flow_user'];
            $flowcharts[] = $loadedFlowchart;
        }

        R::close();

        return $flowcharts;
    }

    protected function getTableCount($table) {
        $total = R::count(
            $table, 'fk_flow_user=? AND name ILIKE ?',
            array($this->currentUser->id, $this->getNameFilter())
        );
        R::close();

        return $total;
    }

    public function setConnection() {
        $post = Utilities::escapeRequestData($_POST);

        if (!isset($post['sourceId']) || !isset($post['targetId'])) {
            return false;
        }

        $sourceId = $post['sourceId'];
        $targetId = $post['targetId'];

		if (!$this->isShapeFromOwnFlowchart($sourceId) || !$this->isShapeFromOwnFlowchart($targetId)) {
			return false;
		}

        $connection = $this->getConnectionBean($sourceId, $targetId);
        $connection->value = (isset($post['value'])) ? $post['value'] : null;

        $result = R::store($connection);

        if (!is_int($result) || $result === 0) {
            return false;
        }

        R::close();

        return true;
    }

    private function getConnectionBean($sourceId, $targetId) {
        $connection = R::findOne(
            Table::SHAPE_CONNECTION, 'fk_source_shape=? AND fk_target_shape=?',
            array($sourceId, $targetId)
        );

        if (!isset($connection)) {
            $connection = R::dispense('shapeconnection');
            $connection->fkSourceShape = $sourceId;
            $connection->fkTargetShape = $targetId;
        }

        return $connection;
    }

    public function recreateShape() {
        $post = Utilities::escapeRequestData($_POST['shapesData']);

        $idFlowchart = $post['idFlowchart'];
        if (!$this->isOwnFlowchart($idFlowchart)) {
            return fase;
        }

        $retval = R::exec(
            'INSERT INTO shape VALUES (?, ?, ?, ?, ?, ?)',
            array(
                $post['id'], $post['value'], $post['left'], $post['top'],
                $idFlowchart, $post['shapeDefinitionName']
            )
        );

        if (!is_int($retval) || $retval === 0) {
            return false;
        }

        R::close();

        return $retval;
    }

    public function logout() {
        (new \src\extension\Login())->logOut();
        Utilities::redirect('/home');
    }

    private function isShapeFromOwnFlowchart($idShape) {
        $query = 'SELECT fk_flowchart FROM ' . Table::SHAPE . ' WHERE id=?';
        $idFlowchart = R::getCell($query, [$idShape]);
        return ($idFlowchart !== null) ? $this->isOwnFlowchart($idFlowchart) : false;
    }

    private function getFlowchartCountForCurrentUser($idFlowchart) {
         return R::count(Table::FLOWCHART, 'id=? AND fk_flow_user=?', array($idFlowchart, $this->currentUser->id));
    }

    private function isOwnFlowchart($idFlowchart) {
        return ($this->getFlowchartCountForCurrentUser($idFlowchart) < 1) ? false : true;
    }

    private function isPublicFlowchart($idFlowchart) {
        $retval = R::getCell('SELECT is_public FROM flowchart WHERE id=?', [$idFlowchart]);
        return $retval;
    }

    private function canOpenFlowchart($idFlowchart) {
        return $this->isOwnFlowchart($idFlowchart) || $this->isPublicFlowchart($idFlowchart);
    }

    private function parseShapeDataForExhibition(&$shapeData) {
        foreach (['max_inputs', 'max_outputs', 'max_copies'] as $field) {
            if ($shapeData[$field] === '-1') {
                $shapeData[$field] = '&#8734';
            }
            else if ($shapeData[$field] === '0') {
                $shapeData[$field] = '&#216;';
            }
        }
    }

    private function getExamplesIds($shapeDefinitionName) {
        $ids = [];
        $examplesNames = Examples::$flowchartsNames[$shapeDefinitionName];
        foreach ($examplesNames as $exampleName) {
            $example = R::findAndExport(Table::FLOWCHART, 'name=?', [$exampleName]);

            $keys = array_keys($example);
            if (!empty($keys)) {
                $ids[] = ['id' => reset($keys), 'name' => $exampleName];
            }
        }
        return $ids;
    }
}


