/*
 * Split the mp3 file into mp3dir
 */
import {promises as fs, constants as constants, writeFileSync} from 'fs'
import {spawn, execSync} from 'child_process'
import {filenames, dataDir} from '../../utility/server_globals.js'
import {resultOK, resultDone, resultError, sec2ms, sec2hms, hms2sec, pad2} from '../../utility/utils.js'

let song = 1
let cutting = true
let contents = []
let setlist = []

export async function post(req, res) {
	const store = req.body

	const {mp3file, mp3dir, wavsdir, mtdir} = filenames(store)

	if(store.state === 0) {
		song = 1
		cutting = true
		contents = []
		contents.push(`Setlist for ${store.album}:`)
		contents.push('')
		setlist = []
	}

	//console.log(`${store.state}  ${song} ${cutting} ${store.songTable.length}`)

	if(cutting) {
		let row, n
		for(n = song; n <= store.songTable.length; n++) {		// search for next filled-in row
			row = parseRow(store, n)
			if(row.title !== null) break
		}

		// If done, write Contents and Setllist files (note: DOS format)
		if(n > store.songTable.length) {
			writeFileSync(`${dataDir}/Contents.txt`, contents.join('\r\n'), {encoding: 'utf8'})
			writeFileSync(`${mp3dir}/Setlist.m3u`, setlist.join('\r\n'), {encoding: 'utf8'})
			return resultDone(res, 'Finished')
		}


		const mp3 = safeMp3File(mp3dir, song, row.title)

		contents.push(`${pad2(song)}) [${sec2hms(row.start)}...${sec2hms(row.end)}] ${row.title}`)
		setlist.push(mp3.slice(mp3dir.length+1))

		try {
			const cmd = `cutmp3 -i ${mp3file} -O ${mp3} -a ${sec2ms(row.start)} -b ${sec2ms(row.end)}`
			console.log(cmd)
			const output = execSync(cmd, {encoding: 'utf8'})
			cutting = false
			return resultOK(res, output)
		} catch(e) {
			return resultError(res, `Error when cutting ${mp3}: ${e}`)
		}
	} else {	// tagging
		const row = parseRow(store, song)
		const mp3 = safeMp3File(mp3dir,  song, row.title)

		try {
			const cmd = `id3tool -t "${row.title}" -a "${store.album}" -r "${store.artist}" -y "${store.dateStr.slice(0,4)}" -G "${store.genre}" -c ${song} ${mp3}`
			console.log(cmd)
			const output = execSync(cmd, {encoding: 'utf8'})
			cutting = true
			song++
			return resultOK(res, `  tagged ${mp3}`)
		} catch(e) {
			return resultError(res, `Error when tagging ${mp3}: ${e}`)
		}
	}
}

/*
 * Parse the given row from the store, returning the components or nulls.
 * The first row is row 1.
 */
function parseRow(store, n) {
	const table = store.songTable
	const row = table[n-1]

	let parse = {start: null, end: null, title: null}

	if(!row[1] || !row[2] || !row[3])
		return parse

  parse.start = hms2sec(row[1])
  parse.end = hms2sec(row[2])
  parse.title = row[3]
	return parse
}

/*
 * Given the directory, song number, and song title, return a safe file
 * name, removing spaces, apostrophes, and slashes, with a .mp3 suffix.
 */
function safeMp3File(mp3dir, n, title) {
	let t = title.replace(/ /g, '_')
	t = t.replace(/'/g, '')
	t = t.replace(/\\/g, '--')

	return `${mp3dir}/${pad2(n)}-${t}.mp3`
}