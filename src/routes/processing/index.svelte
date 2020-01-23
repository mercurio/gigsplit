<script>
	import ProcessRunner from '../../components/ProcessRunner.svelte'
</script>

<svelte:head>
	<title>Processes</title>
</svelte:head>

<div class="wrapper"> 
	<ProcessRunner title="Create Directories" endpoint="createDirs.json" />
	<ProcessRunner title="Split mp3 File" endpoint="splitMp3File.json" />
	<ProcessRunner title="Split wav Files" endpoint="splitWavs.json" />
</div>

<style>
	.wrapper {
		text-align: center;
		margin: 0 auto;
	}
</style>
