<script>
	import SoundBarWrapper from '../../components/SoundBarWrapper.svelte'
	import WhenBar from '../../components/WhenBar.svelte'
	import SongTable from '../../components/SongTable.svelte'
</script>

<svelte:head>
	<title>Split</title>
</svelte:head>

<div class="wrapper"> 
	<SoundBarWrapper />
	<WhenBar />
	<SongTable />
</div>

<style>
	.wrapper {
		text-align: center;
		margin: 0 auto;
	}
</style>
