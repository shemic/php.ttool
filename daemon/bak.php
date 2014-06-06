<?php
/**
 * tt管理工具
 * 作者：于斌
 */
#数据备份
$config['lang'] = '数据备份';
$config['no'] = 'yes';
$config['oper'] = 'bak';
include(str_replace('daemon', '', dirname(__FILE__)) . '/service/service.php');