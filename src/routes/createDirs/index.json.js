/*
 * Create the multitrack and date-band dirs
 */
import {promises as fs, constants as constants} from 'fs'
import {filenames} from '../../utility/server_globals.js'
import {resultOK, resultDone, resultError} from '../../utility/utils.js'

export async function post(req, res) {
	const store = req.body

	const {mp3file, mp3dir, wavsdir, mtdir} = filenames(store)

	switch(store.state) {
		case 0:
			try {
				await fs.access(mp3file, constants.R_OK)
				return resultOK(res, `mp3 file ${mp3file} found`)
			} catch(e) {
				return resultError(res, `mp3 file ${mp3file} not found`)
			}

		case 1:
			try {
				await fs.mkdir(mp3dir, {recursive:true})
				return resultOK(res, `mp3 directory ${mp3dir} created`)
			} catch(e) {
				return resultError(res, `could not create dir ${mp3dir}`)
			}

		case 2:
			try {
				await fs.mkdir(mtdir, {recursive:true})
				return resultOK(res, `multitrack directory ${mtdir} created`)
			} catch(e) {
				return resultError(res, `could not create dir ${mtdir}`)
			}

   case 3:
		 return resultDone(res, 'All directories created')
	}
}