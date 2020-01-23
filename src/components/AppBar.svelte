<script>
	import TopAppBar, {Row, Section, Title} from '@smui/top-app-bar'
	import IconButton from '@smui/icon-button'
	import Button, {Label} from '@smui/button'

	import {onMount} from 'svelte'
	import {readStore} from '../stores.js'

	/*
	 * Read the store from the server on mount
	 */
	onMount(readStore)
</script>


<TopAppBar variant="static">
	<Row>
		<Section>
			<IconButton class="material-icons">menu</IconButton>
			<Title>GigSplit</Title>
		</Section>
		<Section align="end" toolbar>
			<Button href='.' variant="raised"><Label>Settings</Label></Button>
			<Button href='split' variant="raised"><Label>Split</Label></Button>
			<Button href='processing' variant="raised"><Label>Processing</Label></Button>
		</Section>
	</Row>
</TopAppBar>

<style>
</style>
