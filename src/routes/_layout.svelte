<script>
	import AppBar from '../components/AppBar.svelte'

	export let segment
</script>


<AppBar {segment}/>
<main>
	<slot></slot>
</main>



<style>
</style>
