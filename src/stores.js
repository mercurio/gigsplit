/*
 * Globally accessible storage
 */

import {readable, writable, derived} from 'svelte/store'
import {post} from './utility/utils.js'

/* Settings */
export const artist = writable('Leadbone')
export const album = writable('Live')
export const date = writable('')
export const genre = writable('Rock')

/* Song table contents */
export const songTableData = writable([])
export const songTableDataIncoming = writable([])

/* The current play time, in seconds */
export const now = writable(0)

/* HH:MM:SS form of now */
export const nowHMS = derived(now, 
  $now => {
		const d = new Date(null)
		d.setSeconds($now)
		return d.toISOString().substr(11,8)
  }
)

/* Whether or not we're playing */
export const playing = writable(false)

/* The waveform viewer/player */
export const waveform = writable(null)

/* Error message above song table */
export const splitError = writable('Select a row from the table to enable buttons')

/* Selected row of table */
export const selectedRow = writable(null)

/* yyyymmdd form of date */
export const dateStr = derived(date,
  $date => $date.replace(/-/g,'')
)

/*
 * Read the store from the server
 */
export async function readStore() {
  const res = await fetch('store.json')
  const data = await res.json()

  if(res.status !== 200) return error(res.status, data.message)

  artist.set(data.artist)
  album.set(data.album)
  date.set(data.date)
  genre.set(data.genre)
  songTableDataIncoming.set(data.songTable)
  songTableData.set(data.songTable)
}

/*
 * Persistent data, contents of store.json
 */
let persist = {
  artist: null,
  album: null,
  date: null,
  dateStr: null,
  genre:null,
  songTable:null
}

artist.subscribe(x => persist.artist = x)
album.subscribe(x => persist.album = x)
date.subscribe(x => persist.date = x)
dateStr.subscribe(x => persist.dateStr = x)
genre.subscribe(x => persist.genre = x)
songTableData.subscribe(x => persist.songTable = x)

/*
 * Save the store to the server
 */
export async function saveStore() {
  const data = await post('store.json', persist)

  if(data.error) 
    error(400, data.error)
}

/*
 * Post the store to the given endpoint, including the given state counter
 */
export async function postStore(endpoint, state) {
  const data = await post(endpoint, {state, ...persist})
  return data
}