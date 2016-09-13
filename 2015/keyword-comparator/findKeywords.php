<!DOCTYPE html>
<meta charset="utf-8">

<html>
    <head>
		<title>Find Keywords</title>

        <?php include '../projects/phpIncludes/coreImports.php'?>
        
		<link rel="stylesheet" type="text/css" href="css/layout.css"></link>
		<link rel="stylesheet" type="text/css" href="css/findKeywords.css"></link>

        <!-- OUR JS -->
        <script src="js/findKeywords.js"></script>
        
	</head>
    
    <body onload="logo.setupLogo();">
		<div class = "main">
			<div id = "anchorTextTitle">
				Anchor Text Lookup Tool
			</div>
			<div>
				<table>
					<td class="col">
						<div>
							<table>
								<tbody id = "weblist">
									<tr class = "websiteinput">
										<td>
											<input id="website0" class="websiteinputbox"></input>
										</td>
									</tr>
								</tbody>
							</table>
							<button id = "addButton" onclick = "findKeywords.addWebsite();">Add Website</button>
							<button id = "removeButton" onclick = "findKeywords.removeWebsite();">Remove Website</button>
						</div>
						<div>
							<button onclick = "createLoadingScreen(); findKeywords.submit()">Find Keywords</button>
						</div>
					</td>
					<td class="col">
						<div>
							<select id="keywordresults" size="20"></select>
						</div>
						<div>
							<button onclick = "findKeywords.gotoKeyWordComparator()">Open in keyword comparator</button>
						</div>
					</td>
				</table>
			</div>

		</div>
		<?php include '../projects/phpIncludes/piwik.php'?>
    </body>
</html>