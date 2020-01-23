<script>	
	/*
	 * Labels, buttons, and output window for one process
	 */
	import Button, {Label} from '@smui/button'
	import Paper, {Title, Content} from '@smui/paper'
	import {onMount} from 'svelte'
	import {postStore} from '../stores.js'

	/* Props */
	export let title
	export let endpoint

	let output = ''

	/*
	 * Start the process 
	 */
	async function start() {
		let state = 0
		output = ''

		while(true) {
			const result = await postStore(endpoint, state++)

			output += result.msg 
			if(!output.endsWith('\n')) output += '\n'
			if(result.error || result.done) return
		}
	}

	let scroller

	$: {
		const x = output
		if(scroller) scroller.scrollTop = scroller.scrollHeight
	}
</script>


<div class="wrapper">
	<Paper>
		<Title>{title}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			<Button on:click={start} variant="raised" class="actionBtn"><Label>Start</Label></Button>
		</Title>
		<Content><pre class="output" bind:this={scroller}>{output}</pre></Content>
	</Paper>
</div>


<style>
	.wrapper {
		text-align: center;
		margin: 24px auto;
	}

	* :global(.actionBtn) {
		text-transform: lowercase
	}

	.output {
		text-align: left;
		height: 120px;
		overflow: auto;
	}
</style>