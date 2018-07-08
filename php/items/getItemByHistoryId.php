<?php
header( "Access-Control-Allow-Origin: legendhub.org" );
header( "Content-Type: application/json; charset=UTF-8" );

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once("$root/php/common/config.php");
$pdo = getPDO();

$postdata = json_decode(file_get_contents("php://input"));
$id = $postdata->id;

$query = $pdo->prepare('SELECT I.*, M.Name AS MobName
						FROM Items_AuditTrail AS I
							LEFT JOIN Mobs AS M ON M.Id = I.MobId
						WHERE I.Id = ?');
$query->execute([$id]);
$result = $query->fetchAll(PDO::FETCH_OBJ);

echo(json_encode($result[0]))
?>
