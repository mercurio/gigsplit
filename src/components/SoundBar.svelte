<script>	
	/*
	 * The audio waveform display, using peaks.js
	 */
	import {onMount} from 'svelte'
	import {dateStr, waveform} from '../stores.js'
	import {dataUriDir} from '../utility/server_globals.js'

	let overviewWaveform
	let mp3audio

	/*
	 * Called when the peaks display is ready
	 */
	function peaksReady(err, peaks) {
		$waveform = peaks
		peaks.views.getView('overview').setAmplitudeScale(1.5)
	}

	/*
	 * Create the peaks display on mount
	 */
	onMount(() => {
		const options = {
			containers: {
				overview: overviewWaveform
			},
			mediaElement: mp3audio,
			dataUri: {
				arraybuffer: `${dataUriDir}/${$dateStr}.dat`,
			},
			pointMarkerColor: '#cc0000',
			overviewWaveformColor: '#00cccc',
			showPlayheadTime: true
		}

		Peaks.init(options, peaksReady)
	})


</script>

<div id="waveform-container">
	<div id="overview-container" bind:this={overviewWaveform} />
</div>

<div id="audio-container">
	<audio id="audio" bind:this={mp3audio}>
		<source src="{dataUriDir}/{$dateStr}.mp3" type="audio/mpeg">
	</audio>
</div>

<style>

#waveform-container {
	margin: 24px auto;
	width: 1000px;
}

#overview-container {
	box-shadow: 3px 3px 20px #919191;
	margin: 0 0 24px 0;
	line-height: 0;
	height: 200px;
}
</style>
