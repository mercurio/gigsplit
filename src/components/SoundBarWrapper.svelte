<script>	
	/*
	 * Wrapper around the SoundBar that handles finding the 
	 * audio files.
	 */
	import SoundBar from './SoundBar.svelte'
	import Button, {Label} from '@smui/button'
	import {onMount} from 'svelte'
	import {date, dateStr} from '../stores.js'
	import {goto} from '@sapper/app'

	let status = 'pending'
	let missingFile = ''
	let percent = 0

	/*
	 * Check that the files are there
	 */
	async function checkForFiles() {
		const res = await fetch(`hasAudio/${$dateStr}.json`)
		const ans = await res.json()

		if(!ans.missing) 
			status = 'ok'
		else
			status = ans.missing
	}

	/*
	 * Create the .dat file, reporting status until finished
	 */
	async function createDat() {
		status = 'datPending'

		let ans = {}

		while(true) {
			const res = await fetch(`makeDat/${$dateStr}.json`)
			ans = await res.json()

			if(ans.hasOwnProperty('error')) {
				status = 'ok'
				return
			}

			if(ans.percent) 
				percent = ans.percent
		}
	}

	/*
	 * Check that the files are there after mount
	 */
	onMount(checkForFiles)

</script>

<div>
	{#if !$date}
		<p>The date must be set on the Settings page. This determines the name of the .mp3 we'll read (yyyymmdd.mp3).</p>
	{:else if status === 'pending'}
		<p>Looking for audio files...</p>
    {:else if status === 'mp3'}
		<p>The mp3 file {missingFile} can't be opened. Please copy it to the data directory.</p>
    {:else if status === 'dat'}
		<p>The mp3 file is present but the dat file is missing.&nbsp;&nbsp;&nbsp;
			<Button on:click={createDat} variant="raised"><Label>Create it</Label></Button>
		</p>
    {:else if status === 'datPending'}
		<p>Please wait while the dat file is being generated ({percent})...</p>
    {:else if status === 'ok'}
		<SoundBar />
	{:else}
		<p style="color: red">{status}</p>
  {/if}
</div>

<style>
</style>
