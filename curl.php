<?php
// header('Content-Type: text/html;charset=utf-8');

$sid   = htmlspecialchars($_GET['sid']);
$sname = htmlspecialchars($_GET['sname']);

$curl = curl_init();
//设置抓取的url
curl_setopt($curl, CURLOPT_URL, 'http://www.chsi.com.cn/cet/query?zkzh='.$sid.'&xm='.$sname);
curl_setopt($curl, CURLOPT_REFERER, "http://www.chsi.com.cn/cet");
//设置头文件的信息作为数据流输出
curl_setopt($curl, CURLOPT_HEADER, 0);
//设置获取的信息以文件流的形式返回，而不是直接输出。
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
//执行命令
$data = curl_exec($curl);
//关闭URL请求
curl_close($curl);

include './phpQuery/phpQuery.php';
phpQuery::newDocumentHTML($data);
$title = pq('#leftH>h2')->text();
$name = pq('#leftH .cetTable tr:eq(0)>td:eq(0)')->text();
$school = pq('#leftH .cetTable tr:eq(1)>td:eq(0)')->text();
$level = pq('#leftH .cetTable tr:eq(2)>td:eq(0)')->text();
$id = pq('#leftH .cetTable tr:eq(4)>td:eq(0)')->text();
$score = pq('#leftH .cetTable tr:eq(5)>td:eq(0)')->text();
$tingli_score = pq('#leftH .cetTable tr:eq(6)>td:eq(1)')->text();
$yuedu_score = pq('#leftH .cetTable tr:eq(7)>td:eq(1)')->text();
$xiezuo_score = pq('#leftH .cetTable tr:eq(8)>td:eq(1)')->text();
$space_id = pq('#leftH .cetTable tr:eq(11)>td:eq(0)')->text(); //准考证号
$space = pq('#leftH .cetTable tr:eq(11)>td:eq(0)')->text(); //口语等级

$arr = array(
	'title' => preg_replace("/\s/",'',$title),
	'name' => preg_replace("/\s/",'',$name),
	'school' => preg_replace("/\s/",'',$school),
	'id' => preg_replace("/\s/",'',$id),
	'level' => preg_replace("/\s/",'',$level),
	'score' => preg_replace("/\s/",'',$score),
	'tingli_score' => preg_replace("/\s/",'',$tingli_score),
	'yuedu_score' => preg_replace("/\s/",'',$yuedu_score),
	'xiezuo_score' => preg_replace("/\s/",'',$xiezuo_score),
	'space_id' => preg_replace("/\s/",'',$space_id),
	'space' => preg_replace("/\s/",'',$space),
	);

exit(json_encode($arr));



