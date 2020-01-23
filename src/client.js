import * as sapper from '@sapper/app'

// Required by peaks.js
import XMLHttpRequest from 'xhr2'
window.XMLHttpRequest = XMLHttpRequest
import Peaks from 'peaks.js'
window.Peaks = Peaks

sapper.start({
	target: document.querySelector('#sapper')
})