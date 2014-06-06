<?php
/**
 * tt管理工具
 * 作者：于斌
 */
#备份数据库
$config['lang'] = '备份';
$config['oper'] = 'bak';
if(!$config['name']) include('service.php');