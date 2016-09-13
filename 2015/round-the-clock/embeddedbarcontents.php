<script type="text/javascript"> document.write(document.title); </script> - <?php echo $_GET["goto"] ?>

<script>            
    function goToFullVersion() {
        var win = window.open("https://labs.majestic.com/Majestic-RoundTheClock/index.php?goto=" + <?php echo json_encode($_GET["goto"]) ?>, '_blank');
        win.focus(); 
    }
</script>