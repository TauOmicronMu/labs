<!-- CORE IMPORTS START -->

<?php
    $serv_dir = "/2015";
    $comp_dir = dirname($_SERVER['SCRIPT_FILENAME']) . "/..";
?>

<script> var serv_dir = "<?php print $serv_dir; ?>"; </script>

<!-- Icons -->
<link href="<?php echo $serv_dir; ?>/projects/res/icons/favicon.png" rel="icon" type="image/png">

<!-- CSS -->
<link rel="stylesheet" type="text/css" href="<?php echo $serv_dir; ?>/projects/css/main.css"></link>
<link rel="stylesheet" type="text/css" href="<?php echo $serv_dir; ?>/projects/css/tooltip.css"></link>
<link rel="stylesheet" type="text/css" href="<?php echo $serv_dir; ?>/projects/css/inputbar.css"></link>
<link rel="stylesheet" type="text/css" href="<?php echo $serv_dir; ?>/projects/css/graph.css"></link>

<!-- APIs -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js" charset="utf-8"></script>   
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>

<!-- Our JS -->
<script src="<?php echo $serv_dir; ?>/projects/js/tooltip.js"></script>
<script src="<?php echo $serv_dir; ?>/projects/js/helperfunctions.js"></script>
<script src="<?php echo $serv_dir; ?>/projects/js/addLogoToPage.js"></script>
<script src="<?php echo $serv_dir; ?>/projects/js/loading.js"></script>
<script src="<?php echo $serv_dir; ?>/projects/js/tutorial.js"></script>
<script src="<?php echo $serv_dir; ?>/projects/js/minmax.js"></script>
<script src="<?php echo $serv_dir; ?>/projects/js/topiccolors.js"></script>
<script src="<?php echo $serv_dir; ?>/projects/js/DomainTools.js"></script>
<script src="<?php echo $serv_dir; ?>/projects/js/Record.js"></script>
<script src="<?php echo $serv_dir; ?>/projects/js/CommonWords.js"></script>

<!-- Our PHP -->
<?php include isset($dir) ? $dir : $comp_dir . '/projects/phpIncludes/helperfunctions.php'; ?>

<!-- CORE IMPORTS END -->
