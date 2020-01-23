/*
 * Generate .dat file from .mp3 file
 */
import {spawn} from 'child_process'
import {dataDir} from '../../utility/server_globals.js'
import {result} from '../../utility/utils.js'

let proc = null
let code = null
let output = ''

/*
 * Each time this is called, we return the current status,
 * until it's finished.
 */
export async function get(req, res, next) {
	const {date} = req.params

	if(!proc) {
		const mp3file = `${dataDir}/${date}.mp3`
		const datfile = `${dataDir}/${date}.dat`

		proc = spawn('audiowaveform', ['-i', mp3file, '-o', datfile, '-b', '8'])

		proc.stderr.on('data', data => output += data)
		proc.on('close', c => code = c)
		result(res, {percent:'0%'})
	} else if(code !== null) {
		result(res, {error:code})
	} else {
		const pcs = output.match(/(\d*)%/g)
		const pc = pcs[pcs.length-1]

		result(res, {percent: pc})
	}
}