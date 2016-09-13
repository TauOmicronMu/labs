<?php
	function getLocalDataSet(){
		$rows = array_map('str_getcsv', file('res/majestic_million_shortened.csv'));
		$header = array_shift($rows);
		$csv = array();
		foreach ($rows as $row) {
			$csv[] = array_combine($header, $row);
		}
		return $csv;
	}
?>;

