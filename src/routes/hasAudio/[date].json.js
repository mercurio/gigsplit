/*
 * Check if audio files are present
 */
import {promises as fs, constants as constants} from 'fs'
import {dataDir} from '../../utility/server_globals.js'
import {result} from '../../utility/utils.js'

export async function get(req, res, next) {
	const {date} = req.params

	const mp3file = `${dataDir}/${date}.mp3`
	try {
		await fs.access(mp3file, constants.R_OK)
	} catch(e) {
		return result(res, {missing: 'mp3', file: mp3file, error:e})
	}

	const datfile = `${dataDir}/${date}.dat`
	try {
		await fs.access(datfile, constants.R_OK)
	} catch(e) {
		return result(res, {missing: 'dat', file: datfile, error:e})
	}

	return result(res, {missing: false, error: null})
}