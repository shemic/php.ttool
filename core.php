<?php
/**
 * tt管理工具
 * 作者：于斌
 */

#tt守护进程核心
define('TT_IN'                  ,  true);
define('TT'                     ,  'tt');
define('TT_PATH'                ,  dirname(__FILE__)    . DIRECTORY_SEPARATOR);
define('TT_SERVICE_PATH'        ,  TT_PATH . 'service' . DIRECTORY_SEPARATOR);
define('TT_DB_PATH'             ,  TT_PATH . 'db' . DIRECTORY_SEPARATOR);
define('TT_BAK_PATH'            ,  TT_PATH . 'bak' . DIRECTORY_SEPARATOR);
define('TT_MANAGE_PATH'         ,  TT_PATH . 'manage' . DIRECTORY_SEPARATOR);
define('TT_CONFIG_PATH'         ,  TT_PATH . 'config' . DIRECTORY_SEPARATOR);
define('TT_LOG_PATH'            ,  TT_PATH . 'log' . DIRECTORY_SEPARATOR);

/**
 * tt_config()
 */
function tt_config()
{
    return scandir(TT_CONFIG_PATH);
}

/**
 * tt_echo()
 */
function tt_echo($string)
{
    static $str;
    $str .= tt_log($string . "\n");
    return $str;
}

/**
 * tt_log()
 */
function tt_log($str)
{
    $time = time();
    $file = tt_mkdir(TT_LOG_PATH . date('Y-m-d', $time) . '/') . date('Y-m-d_H', $time) . '.log';
    $content = '';
    if(is_file($file))
    {
        $content = file_get_contents($file);
    }

    $content .= date('Y-m-d_H:i:s', $time) . ':' . $str;
    file_put_contents($file, $content);
    return $str;
}

/**
 * tt_system()
 */
function tt_system($command)
{
    system($command);
}

/**
 * tt_create()
 */
function tt_create($config)
{
    if(isset($config['host']))
    {
        $command = $config['server'] . 'ttserver -host ' . $config['host'] . ' -port ' . $config['port'] .' -thnum ' . $config['thnum'] .' -dmn -pid ' . $config['path'] . $config['name'] . '.pid -log ' . $config['path'] . $config['name'] . '.log -le -ulog ' . $config['ulog'] . ' -ulim ' . $config['ulim'] . ' -rts ' . $config['path'] . $config['name'] . '.rts ';

        if(isset($config['mhost']))
        {
            $command .= '-sid ' . $config['sid'] . ' -mhost ' . $config['mhost'] . ' -mport ' . $config['mport'] . ' ';
        }

        if($config['type'] == '*')
        {
            $command .= '*';
        }
        else
        {
            $command .= $config['path'] . $config['name'] . '.' . $config['type'] . $config['ext'];
        }
        $command = 'ulimit -SHn 51200;' . escapeshellcmd($command);
        tt_system($command);
    }
}

/**
 * tt_mkdir()
 */
function tt_mkdir($dir)
{
    if(!is_dir($dir))
    {
        mkdir($dir, 0775);
    }
    return $dir;
}

/**
 * tt_runtime()
 */
function tt_runtime()
{
    static $time;
    if(!$time)
    {
        $time = microtime();
    }
    else
    {
        $new = microtime() - $time;
        return $new;
    }
}

/**
 * tt_load()
 */
function tt_load($php, $func = 'start')
{
    if(strstr($php, '.php') && is_file(TT_CONFIG_PATH . $php))
    {
        include(TT_CONFIG_PATH . $php);
        if($config['global']['state'] == 1)
        {
            $path = tt_mkdir(TT_DB_PATH . $config['global']['name'] . '/');

            if(!is_file($path . 'create'))
            {
                tt_echo($config['global']['name'] . '：正在对相关服务进行指定操作');
                if(isset($config['db']))
                {
                    foreach($config['db'] as $i => $j)
                    {
                        call_user_func('tt_' . $func, $config, $j);
                    }
                    tt_echo($config['global']['name'] . '：完成指定操作');
                }
                else
                {
                    tt_echo($config['global']['name'] . '：没有数据库需要启动');
                }
                file_put_contents($path . 'create', time());
            }
            else
            {
                if(is_string($func))
                {
                    unlink($path . 'create');
                    tt_echo($config['global']['name'] . '：清理权限文件成功');
                    tt_load($php, $func);
                }
                else
                {
                    tt_echo($config['global']['name'] . '：没有操作权限');
                }
            }
        }
        else
        {
            tt_echo($config['global']['name'] . '：服务已关闭');
        }
    }
    elseif(!strstr($php, '.'))
    {
        tt_echo($php . '：文件不存在，创建失败');
    }
}

/**
 * tt_start()
 */
function tt_start($data, $name)
{
    $path = tt_mkdir(TT_DB_PATH . $data['global']['name'] . '/' . $name . '/');
    if(isset($data[$name]) && !is_file($path . $name . '.pid'))
    {
        $data[$name]['name'] = $name;
        $data[$name]['path'] = $path;
        $data[$name]['ulog'] = tt_mkdir($path . 'ulog/');
        $data[$name]['server'] = $data['global']['server'];
        tt_create($data[$name]);

        $file = $path . $name . '.' . $data[$name]['type'];
        if(is_file($file) && !is_file($file . '.create'))
        {
            $command = 'cp ' . $file . ' ' . $file . '.create';
            tt_system($command);
        }
        tt_echo($data['global']['name'] . '：' . $name . '数据库启动成功');
    }
    else
    {
        tt_echo($data['global']['name'] . '：' . $name . '数据库已启动。');
    }
}

/**
 * tt_del()
 */
function tt_del($data, $name)
{
    $file = tt_mkdir(TT_DB_PATH . $data['global']['name'] . '/' . $name . '/') . $name . '.' . $data[$name]['type'];
    if(is_file($file) && is_file($file . '.create'))
    {
        $command = 'rm -rf ' . $file . ';cp ' . $file . '.create ' . $file;
        tt_system($command);
        tt_echo($data['global']['name'] . '：' . $name . '数据库清理成功');
    }
    elseif(is_file($file . '.create'))
    {
        $command = 'cp ' . $file . '.create ' . $file;
        tt_system($command);
        tt_echo($data['global']['name'] . '：' . $name . '数据库清理成功');
    }
    else
    {
        tt_echo($data['global']['name'] . '：' . $name . '数据库清理失败。');
    }
}

/**
 * tt_bak()
 */
function tt_bak($data, $name)
{
    $dir = tt_mkdir(TT_DB_PATH . $data['global']['name'] . '/' . $name . '/');
    if(is_dir($dir))
    {
        //tt_bakdel($data, $name);
        $bak = tt_mkdir(tt_mkdir(TT_BAK_PATH . $data['global']['name']) . '/' . $name . '/') . date('Y-m-d_H:i:s', time()) . '.tar.gz';
        $pid = $dir . $name . '.pid';
        $command = "tar --exclude $pid -zcvPf $bak $dir";
        tt_system($command);
        tt_echo($data['global']['name'] . '：' . $name . '数据库备份成功。');
    }
    else
    {
        tt_echo($data['global']['name'] . '：' . $name . '数据库目录不存在，无法备份。');
    }
}

/**
 * tt_bakdel()
 */
function tt_bakdel($data, $name)
{
    $dir = TT_BAK_PATH . $data['global']['name'] . '/' . $name . '/';
    if(is_dir($dir))
    {
        $command = "rm -rf {$dir}*.tar.gz";
        tt_system($command);
        tt_echo($data['global']['name'] . '：' . $name . '备份删除成功。');
    }
    else
    {
        tt_echo($data['global']['name'] . '：' . $name . '备份目录不存在，无法删除。');
    }
}

/**
 * tt_bakroll()
 */
function tt_bakroll($data, $name)
{
    $dir = TT_BAK_PATH . $data['global']['name'] . '/' . $name . '/';
    if(is_dir($dir))
    {
        $file = scandir($dir);
        $num = count($file) - 1;
        $bak = $dir . $file[$num];
        $command = "tar -zxvf $bak";
        tt_system($command);
        tt_echo($data['global']['name'] . '：' . $name . '备份回滚成功。');
    }
    else
    {
        tt_echo($data['global']['name'] . '：' . $name . '备份目录不存在，无法回滚。');
    }
}

/**
 * tt_ulog()
 */
function tt_ulog($data, $name)
{
    $dir = TT_DB_PATH . $data['global']['name'] . '/' . $name . '/' . 'ulog/';
    if(is_dir($dir))
    {
        $ulog = scandir($dir);

        foreach($ulog as $i => $j)
        {
            $num[$i] = intval(str_replace('.ulog', '', $j));
            $file[$i] = $dir . $j;
            $next[$i] = $dir . str_pad(($num[$i]+1), 8, '0', STR_PAD_LEFT) . '.ulog';
            if(is_file($next[$i]))
            {
                unlink($file[$i]);
            }
        }
        tt_echo($data['global']['name'] . '：' . $name . 'ulog清理成功，只留下最新的日志。');
    }
    else
    {
        //tt_echo($data['global']['name'] . '：' . $name . 'ulog清理失败。');
    }
}


/**
 * tt_stop()
 */
function tt_stop($data, $name)
{
    $file = tt_mkdir(TT_DB_PATH . $data['global']['name'] . '/' . $name . '/') . $name . '.pid';
    if(is_file($file))
    {
        $pid = file_get_contents($file);
        @unlink($file);
        $command = 'kill -15 ' . $pid;
        tt_system($command);
        tt_echo($data['global']['name'] . '：' . $name . '数据库关闭成功。');
    }
    else
    {
        tt_echo($data['global']['name'] . '：' . $name . '数据库已关闭。');
    }
}

/**
 * tt_restart()
 */
function tt_restart($data, $name)
{
    tt_stop($data, $name);
    tt_start($data, $name);
}
