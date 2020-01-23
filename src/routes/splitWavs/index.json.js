/*
 * Split the wav files into mtdir
 */
import {promises as fs, constants, readdirSync} from 'fs'
import {execSync} from 'child_process'
import {filenames, trimDD} from '../../utility/server_globals.js'
import {resultOK, resultDone, resultError, sec2ms, sec2hms, hms2sec, pad2} from '../../utility/utils.js'

let song = 1
let cutting = true
let madeDir = false
let wavs = []
let wav = 0
let row = null
let outdir = ''

export async function post(req, res) {
	const store = req.body

	const {mp3file, mp3dir, wavsdir, mtdir} = filenames(store)

	if(store.state === 0) {		// list files in wavsdir
		try {
			const list = readdirSync(wavsdir, {encoding: 'utf8'})
			wavs = list.filter(x => /.*wav$/.test(x)).map(x => x.slice(0,-4))
			song = 1
			cutting = true
			madeDir = false
			wav = 0
			return resultOK(res, `Found wavs: ${wavs.join(', ')}`)
		} catch(e) {
			return resultError(res, `Error listing directory ${trimDD(wavsdir)}: ${e}`)
		}
	}

	if(cutting && !madeDir) {
		let n
		for(n = song; n <= store.songTable.length; n++) {		// search for next filled-in row
			row = parseRow(store, n)
			if(row.title !== null) break
		}

		if(n > store.songTable.length) {
			return resultDone(res, 'Finished')
		}

		outdir = safeDir(mtdir, store.dateStr, song, row.title)

		try {
			await fs.mkdir(outdir, {recursive:true})
			madeDir = true
			wav = 0
			return resultOK(res, `multitrack directory ${trimDD(outdir)} created`)
		} catch(e) {
			return resultError(res, `could not create dir ${trimDD(outdir)}: ${e}`)
		}
	}

	if(cutting && madeDir) {
		if(wav >= wavs.length) {
			cutting = false
			madeDir = false
			wav = 0
			return resultOK(res, `Finished cutting ${row.title}`)
		}

		const infile = `${wavsdir}/${wavs[wav]}.wav`
		const outfile = `${outdir}/${wavs[wav]}.wav`

		try {
			const cmd = `sox ${infile} ${outfile} trim ${sec2hms(row.start)} ${sec2hms(row.end - row.start)}`
			console.log(cmd)
			const output = execSync(cmd, {encoding: 'utf8'})
			wav++
			return resultOK(res, `Cut ${trimDD(infile)} to ${trimDD(outfile)}`)
		} catch(e) {
			return resultError(res, `Error when cutting ${trimDD(infile)}: ${e}`)
		}
	}

	if(!cutting) {
		if(wav >= wavs.length) {
			cutting = true
			madeDir = false
			wav = 0
			song++
			return resultOK(res, `Finished compressing ${row.title}`)
		}

		const outfile = `${outdir}/${wavs[wav]}.wav`

		try {
			const cmd = `flac --best --delete-input-file ${outfile}`
			console.log(cmd)
			const output = execSync(cmd, {encoding: 'utf8'})
			wav++
			return resultOK(res, `Compressed ${trimDD(outfile)}`)
		} catch(e) {
			return resultError(res, `Error when compressing ${trimDD(outfile)}: ${e}`)
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
 * Given the directory, dateStr, song number, and song title, return a safe dir
 * name, removing spaces, apostrophes, and slashes
 */
function safeDir(dir, dateStr, n, title) {
	let t = title.replace(/ /g, '_')
	t = t.replace(/'/g, '')
	t = t.replace(/\\/g, '--')

	return `${dir}/${dateStr}-${pad2(n)}-${t}`
}