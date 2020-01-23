/*
 * Endpoint to read and write the store from gigsplit.json
 */
import {promises as fs} from 'fs'
import {dataDir} from '../../utility/server_globals.js'

export async function get(req, res) {
	try {
		const contents = await fs.readFile(`${dataDir}/gigsplit.json`, 'utf8')
		res.writeHead(200, {'Content-Type': 'application/json'})
		res.end(contents)
	} catch(e) { // Not actually an error, the file just doesn't exist yet
		console.log(`Unable to read ${dataDir}/gigsplit.json: ${e}`)
		res.writeHead(200, {'Content-Type': 'application/json'})
		res.end('')
	}
}

export async function post(req, res) {
	const _status = await fs.writeFile(`${dataDir}/gigsplit.json`, JSON.stringify(req.body,null,4), 'utf8')

	res.writeHead(200, {
		'Content-Type': 'application/json'
	})

	res.end(JSON.stringify({error:''}))
}