<div class="playerdetails" id="<?php echo "player" . $index; ?>">
    <table class="playerEntry">
        <tr>
            <td class="pTitle" colspan="2">Player <?php echo ($index + 1); ?></td>
        </tr>
        <tr>
            <td class="pname">Name:</td>
            <td>
                <input class="nameinput" value="<?php echo $defname; ?>">
            </td>
        </tr>
        <tr>
            <td class="pname">Website:</td>
            <td class="webInput">
            </td>
        </tr>
        <tr>
            <td class="pTitle" colspan="2">Controls:</td>
        </tr>
        <tr>
            <td class="controlsdescription" colspan="2"><?php echo $ctrlstring; ?></td>
        </tr>
    </table>
    <table class="playerstats">
        <tr>
			<td class="label">
				Speed <br/> (trust flow)
			</td>
            <td>
                <canvas id="<?php echo "speed" . $index; ?>">
                </canvas>
            </td>
        </tr>
        <tr>
			<td class="label">
				Acceleration <br/> (citation flow)
			</td>
            <td>
                <canvas id="<?php echo "acceleration" . $index; ?>">
                </canvas>
            </td>
        </tr>
        <tr>
			<td class="label">
				Handling <br/> (top topic trust flow)
			</td>
			<td>
                <canvas id="<?php echo "handling" . $index; ?>">
                </canvas>
            </td>
        </tr>
    </table>
</div>