<?php
/**
 * tt管理工具
 * 作者：于斌
 */
#日志清理
$config['lang'] = '日志清理';
$config['no'] = 'yes';
$config['oper'] = 'ulog';
include(str_replace('daemon', '', dirname(__FILE__)) . '/service/service.php');