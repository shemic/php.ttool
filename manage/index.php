<?php
/**
 * tt管理工具
 * 作者：于斌
 */
#管理接口
define('TT_HTTP'           ,  'http://' . $_SERVER['HTTP_HOST'] . substr($_SERVER['PHP_SELF'], 0, strpos($_SERVER['PHP_SELF'], 'index.php')));
include(str_replace('manage', '', dirname(__FILE__)) . '/core.php');

$config['name']         = 'ttserver manage v1.0';
$config['request']      = $_REQUEST;

if(isset($config['request']['service']))
{
    include(TT_SERVICE_PATH . $config['request']['service'] . '.php');

    $project = $config['request']['project'];

    tt_echo("正在" . $config['lang'] . "ttserver服务...");

    if($project)
    {
        tt_load($project.'.php', $config['oper']);
    }
    else
    {
        $data = tt_config();
        foreach($data as $k => $v)
        {
            tt_load($v, $config['oper']);
        }
    }

    echo tt_echo('程序执行完毕');
}
elseif(isset($config['request']['view']) && $config['request']['view'] != 'index')
{
    is_file($config['request']['view'] . '.php') && include($config['request']['view'] . '.php');
    $data = $$config['request']['view'];
    $config['request']['type'] && $config['request']['view'] .= '.'.$config['request']['type'];
    tt_view($config['request']['view'], $data);
}
else
{
    tt_view('index', $config);
}
/**
 * tt_view()
 */
function tt_view($html, $data)
{
    include(TT_MANAGE_PATH . 'view/'.$html.'.htm');
}