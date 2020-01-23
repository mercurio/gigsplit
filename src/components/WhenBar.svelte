<script>
	/*
	 * Controls the current time in the audio file
	 */
	import Button, {Label} from '@smui/button'
	import {waveform, now, nowHMS, playing} from '../stores.js'
	import {onMount} from 'svelte'

	const backBtns = [
		{label: '\u219020m', seconds: -20 * 60},
		{label: '\u21905m', seconds: -5 * 60},
		{label: '\u21901m', seconds: -1 * 60},
		{label: '\u219020s', seconds: -20},
		{label: '\u21905s', seconds: -5},
		{label: '\u21901s', seconds: -1},
	]

	const fwdBtns = [
		{label: '1s\u2192', seconds: 1},
		{label: '5s\u2192', seconds: 5},
		{label: '20s\u2192', seconds: 20},
		{label: '1m\u2192', seconds: 1 * 60},
		{label: '5m\u2192', seconds: 5 * 60},
		{label: '20m\u2192', seconds: 20 * 60},
	]


	/*
	 * Update the time from the player
	 */
	function _updateNow() {
			if($waveform && $waveform.hasOwnProperty('player'))
				$now = $waveform.player.getCurrentTime()
	}

	/* 
	 * Update the time every half second
	 */
	onMount(() => {
			const updateTimer = setInterval(_updateNow, 500)
			return () => {clearInterval(updateTimer)}
	})

	/*
	 * Seek forward/backward s seconds
	 */
	function seek(s) {
		$now += s

		if($now < 0) $now = 0

		if($waveform) {
			const duration = $waveform.player.getDuration()

			if($now > duration) $now = duration

			$waveform.player.seek($now)
		}
	}
	/*
	 * Pause or resume
	 */
	function togglePlay() {
		if($playing) {
			$waveform.player.pause()
			$playing = false
		} else {
			$waveform.player.play()
			$playing = true
		}
	}

	let playButtonColor = 'secondary'

	$: {
		playButtonColor = $playing ? 'primary' : 'secondary'
	}
</script>

<div>
	{#each backBtns as b}
		<Button on:click={() => seek(b.seconds)} dense class="seekBtn"><Label>{b.label}</Label></Button>
	{/each}
		<Button on:click={togglePlay} color={playButtonColor} variant="raised"><Label>{$nowHMS}</Label></Button>
	{#each fwdBtns as b}
		<Button on:click={() => seek(b.seconds)} dense class="seekBtn"><Label>{b.label}</Label></Button>
	{/each}
</div>

<style>
	* :global(.seekBtn) {
		text-transform: lowercase
	}
</style>
