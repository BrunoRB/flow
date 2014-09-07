<?php

namespace core;

abstract class BaseController {

    public $baseFrom = 1;
    public $baseLimit = 20;

    protected $currentUser;

    public function __construct() {
        $this->currentUser = (new \src\extension\Login())->getLoggedUser();
    }

    /**
     * Get attribute passed via URL, determines where a database search starts
     *
     * @return integer
     */
    protected function getFrom() {
        if ((isset($_GET['from']) && intval($_GET['from']) == $_GET['from'])) {
            $from = $_GET['from'];
        }
        else {
            $from = $this->baseFrom;
        }

        return $from;
    }

    /**
     * Get attribute passed via URL, determines where a database search ends
     *
     * @return integer
     */
    protected function getLimit() {
        return (int)$this->baseLimit;
    }

    /**
     * ! Remeber to override getTableCount when you search use any filter (besides offset and limit)
     *
     * @param string $table
     * @return string
     */
    public function getPaginationBarContent($table) {
        $total = $this->getTableCount($table);
        $offset = $this->getFrom();
        $limit = $this->getLimit();

        $leftFrom = $offset - $limit;
        $leftFrom = ($leftFrom >= 1) ? $leftFrom : 0;
        $leftArrowDisabled = ($leftFrom < 1) ? 'disabled' : '';
        $urlLeft = '?from=' . $leftFrom;
        $paginationBar = <<<TEMPLATE
    <a class="icon item $leftArrowDisabled pagination-arrow" href="$urlLeft">
        <i class="icon left arrow"></i>
    </a>
TEMPLATE;

        $paginationBar .= "<span class='icon item'></span>";

        $rightFrom = $offset + $limit;
        $rightFrom = ($rightFrom > 0) ? $rightFrom : 1;
        $rightArrowDisabled = ($rightFrom > $total) ? 'disabled' : '';
        $urlRight = '?from=' . $rightFrom;
        $paginationBar .= <<<TEMPLATE
    <a class="icon item $rightArrowDisabled pagination-arrow" href="$urlRight">
        <i class="icon right arrow"></i>
    </a>
TEMPLATE;

        return $paginationBar;
    }

    /**
     * Override this if your pagination content use some extra filters
     *
     * @param string $table
     * @return integer
     */
    protected function getTableCount($table) {
        $total = \RedBean_Facade::count($table, 'fk_flow_user=?', array($this->currentUser->id));
        \RedBean_Facade::close();

        return $total;
    }

}
