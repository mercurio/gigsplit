/*
 * Global constants available to all server code
 */

// Assumes the data directory is ./static/data, which should be a symlink to 
// the real location
export const dataDir = 'static/data'
export const dataUriDir = 'data'    // when used in a URI

/*
 * Clean up an artist name for use in a filename
 */
function clean(s) {
    s = s.replace(/ /g, '_')
    s = s.replace(/&/g, 'and')
    
    return s
}

/*
 * Given a copy of the store, compute a bunch of file names
 */
export function filenames(store) {
	const mp3file = `${dataDir}/${store.dateStr}.mp3`
	const mp3dir = `${dataDir}/${store.dateStr}-${clean(store.artist)}`
	const wavsdir = `${dataDir}/${store.dateStr}.wavs`
	const mtdir = `${dataDir}/multitrack`

	return {mp3file, mp3dir, wavsdir, mtdir}
}

/*
 * Remove the dataDir from a filename
 */
export function trimDD(x) {
	return x.slice(dataDir.length+1)
}
