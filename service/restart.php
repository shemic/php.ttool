<?php
/**
 * tt管理工具
 * 作者：于斌
 */
#重启restart
$config['lang'] = '重启';
$config['oper'] = 'restart';
if(!$config['name']) include('service.php');