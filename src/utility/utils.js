export function post(endpoint, data) {
	return fetch(endpoint, {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(r => r.json());
}

/*
 * Construct a JSON result
 */
export function result(res, r) {
	res.writeHead(200, {'Content-Type': 'application/json'})
	res.end(JSON.stringify(r))
}

/*
 * Construct a JSON normal result
 */
export function resultOK(res, msg) {
	result(res, {error: false, done: false, msg: msg})
}

/*
 * Construct a JSON done result
 */
export function resultDone(res, msg) {
	result(res, {error: false, done: true, msg: msg})
}

/*
 * Construct a JSON error result
 */
export function resultError(res, msg) {
	result(res, {error: true, done: false, msg: msg})
}

/*
 * Given a number of seconds, return the HH:MM:SS string
 */
export function sec2hms(s) {
		const d = new Date(null)
		d.setSeconds(s)
		return d.toISOString().substr(11,8)
}

/*
 * Given a number, pad it to two characters (add a leading zero if needed)
 */
export function pad2(n) {
	return n < 10 ? `0${n}` : `${n}`
}

/*
 * Given a number of seconds, return the MM:SS string
 */
export function sec2ms(s) {
	const ss = s % 60
	const mm = (s-ss) / 60

	return `${mm}:${pad2(ss)}`
}

/*
 * Given an HH:MM:SS string, return the number of seconds
 */
export function hms2sec(hms) {
	const parts = hms.split(':')
	return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
}