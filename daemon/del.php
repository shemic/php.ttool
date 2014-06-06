<?php
/**
 * tt管理工具
 * 作者：于斌
 */
#数据清理
$config['lang'] = '数据清理';
$config['no'] = 'yes';
$config['oper'] = 'del';
include(str_replace('daemon', '', dirname(__FILE__)) . '/service/service.php');