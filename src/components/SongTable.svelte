<script>	
	/*
	 * Table containing the song titles and start/end times and the buttons to operate on it
	 */
	import Button, {Label} from '@smui/button'
	import {onMount} from 'svelte'
	import {goto} from '@sapper/app'
	import {now, nowHMS, splitError, selectedRow, songTableData, songTableDataIncoming, saveStore, waveform} from '../stores.js'
	import {hms2sec, sec2hms} from '../utility/utils.js'

	let songTableDiv
	let songTable

	const startRows = 50
	const arrow = 'data:image/gif;base64,R0lGODlhEAAQAIQAAAAAABAIABAAAAAIAAAIEBAIEAD4AAAAEBAAEAC4AADgHxCIAACIEACIAADoEBCAAACAEAB4AP///////////////////////////////////////////////////////yH5BAEKAB8ALAAAAAAQABAAAAU64CeOZGmOxqkmqVomrEvCsfzRtWjsvIHnP5oC1woaFyJGQ7lswBwJx0OGg9hoDdtNgdQmIlpRN6wKAQA7'
	const empty = new Array(startRows).fill('')

	let disabled = false

	$: { disabled = !!$splitError}

	/* Copy times */
	function start2now() {
		$now = getTime($selectedRow, 'start')

  	if($waveform) $waveform.player.seek($now) 
	}

	function end2now() {
		$now = getTime($selectedRow, 'end')

  	if($waveform) $waveform.player.seek($now) 
	}

	function now2start() {
		setTime($selectedRow, 'start', $now)
	}

	function now2end() {
		setTime($selectedRow, 'end', $now)
	}

	/*
	 * Called when a selection is made
	 */
	function selectionMade(instance, x1, y1, x2, y2, origin) {
		if(y1 === y2) {
			$splitError = ''
			$selectedRow = y1
			songTable.setColumnData(0,empty)
			songTable.setValueFromCoords(0, y1, arrow, true)
		} else {
			$splitError = 'Select one row from the table to enable buttons'
			$selectedRow = -1
		}
	}

	/*
	 * Called when the table changes. We ignore changes to column 0,
	 * which is just the selection, which also ignores the burst of 
	 * 50 updates that occurs at start.
	 */
	function tableChanged(instance, cell, x, y, value) {
		if(x === 0) return

		const contents = songTable.getData()
		$songTableData = contents.map(x => [x[0] ? 'arrow' : '', x[1], x[2], x[3]])

		saveStore()
	}

	/*
	 * Import jExcel and create the table on mount
	 */
	onMount(async () => {
		// not helping:  if(!songTableDiv) return goto('/')

		const module = await import('jexcel')
		const jexcel = module.default

		let startData = []
		for(let r=0; r < startRows; r++)
			startData.push(['','','',''])

		const options = {
			data: startData,
			onchange: tableChanged,
			columnDrag: false,
			columnResize: false,
			rowResize: false,
			rowDrag: true,
			editable: true,
			allowInsertRow: true,
			allowManualInsertRow: true,
			allowInsertColumn: false,
			allowManualInsertColumn: false,
			allowDeleteRow: true,
			allowDeleteColumn: false,
			allowRenameColumn: false,
			tableOverflow: true,
			tableHeight: '340px',
			minDimensions: [4,startRows],
			onselection: selectionMade,
			columns: [
				{
					type: 'image',
					title: ' ',
					width: 40
				},
				{
					type: 'text',
					title: 'Start',
					width: 90
				},
				{
					type: 'text',
					title: 'End',
					width: 90
				},
				{
					type: 'text',
					title: 'Title',
					width: 500
				}
			]
		}

		songTable = jexcel(songTableDiv, options)
	})

	/*
	 * When we receive the initial songTableData, update
	 * the table
	 */
	$: {
		if(songTable) {
			songTable.setData($songTableDataIncoming.map(x => [x[0] === 'arrow' ? arrow : '', x[1], x[2], x[3]]))
		}
	}

	/*
	 * Set a start or end value given a number of seconds
	 */
	function setTime(row, which, seconds) {
		if(row === -1) return

		const col = which === 'start' ? 1 : 2
		songTable.setValueFromCoords(col, row, sec2hms(seconds), true)
	}

	/*
	 * Reads a start or end value and returns it as seconds
	 */
	function getTime(row, which) {
		if(row === -1) return 0

		const col = which === 'start' ? 1 : 2
		return hms2sec(songTable.getValueFromCoords(col, row))
	}
</script>


<div class="btns_wrapper">
	<Button on:click={start2now} variant="raised" color="secondary" class="actionBtn" {disabled}><Label>Start&#x2192;Now</Label></Button>
	<Button on:click={end2now} variant="raised" color="secondary" class="actionBtn" {disabled}><Label>End&#x2192;Now</Label></Button>
	<span class="spacer">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
	<Button on:click={now2start} variant="raised" class="actionBtn" {disabled}><Label>Now&#x2192;Start</Label></Button>
	<Button on:click={now2end} variant="raised" class="actionBtn" {disabled}><Label>Now&#x2192;End</Label></Button>
</div>
<div>
	<div class="mdc-typography--subtitle1 alert">{$splitError}</div>
</div>
<div class="table_wrapper">
	<div id="songtable" bind:this={songTableDiv}></div>
</div>

<style>
	.table_wrapper {
		text-align: center;
		margin: 24px auto;
	}

	* :global(.actionBtn) {
		text-transform: lowercase
	}

	.btns_wrapper {
		margin-top: 20px;
	}

	.spacer {
		width: 100px;
	}

	.alert {
		color: crimson; 
		height: 1em;
	}
</style>

<svelte:head>
	<link rel="stylesheet" href="css/jexcel.css" />
	<link rel="stylesheet" href="css/jsuites.css" />
</svelte:head>