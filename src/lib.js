
const MINIMUM_TIME_TO_WORK = new Interval(440);
const MINIMUM_TIME_TO_WORK_WITH_PAUSE = new Interval(485);
const MINIMUM_TIME_BREAK = new Interval(45);
const TIMELINE_WIDTH = window.innerWidth - 50;
const TIME_NOW = etempExt_getRealTime();
//const TIME_NOW = new Time(13, 10);
//console.log('### ATTENTION IL EST ', TIME_NOW.toString(), ' ###');

let isOpen = true;


function etempExt_injectStuff() {
	var faTag = document.createElement('link');
	faTag.rel = 'stylesheet';
	faTag.href = 'https://use.fontawesome.com/releases/v5.0.13/css/all.css';
	document.getElementsByTagName('head')[0].appendChild(faTag);



	// var css = document.createElement("style");
	// css.innerHTML = OVERRIDE_CSS; // from override-styles.js
	// document.body.appendChild(css);
	
	var css = document.createElement("style");
	css.innerHTML = CSS_CODE; // from style.js
	document.body.appendChild(css);


}

function etempExt_removeSpan(str) {
	const regex = /(<span(.*)<\/span>)/gm;
	let m;
	let found = '';
	while ((m = regex.exec(str)) !== null) {
		if (m.index === regex.lastIndex) {
			regex.lastIndex++;
		}
		found = m[1];
	}
	if (!found) {
		return str;
	}
	return str.replace(found, '');
}

function etempExt_findData() {
	let data = [];
	let rows = document.querySelectorAll('.bargridwba tr');
	rows.forEach((row, key) => {
		let type = 'in';
		if (row.id % 2 === 0) {
			type = 'out';
		}
		let tds = row.getElementsByTagName('td');
		let tdData;
		if (type === 'in') {
			tdData = tds[0].innerHTML;
		} else {
			tdData = tds[4].innerHTML;
		}
		let exploded = etempExt_removeSpan(tdData).split('.');

		let newTime = new Time(parseInt(exploded[0]), parseInt(exploded[1]), key % 2 === 0);
		data.push(newTime);
	});
	return data;
}

function etempExt_getRealTime() {
	let date = new Date();
	let hours = date.getHours();
	let minutes = date.getMinutes();
	return new Time(date.getHours(), date.getMinutes());
}

function findWidthInterval(interval, startToEndInterval) {
	let w = interval.toMin() / startToEndInterval.toMin() * TIMELINE_WIDTH;
	return round(w);
}

function round(number) {
	return Math.floor(number * 100) / 100;
}

function etempExt_toggle() {
	let els = document.getElementsByClassName('etemp-chrome-ext');
	let icon = document.querySelectorAll('.etemp-chrome-ext-open i');
	if (isOpen) {
		icon[0].classList = ['fas fa-chevron-right'];
		els[0].style.display = 'none';
		isOpen = false;
	} else {
		icon[0].classList.value = ['fas fa-chevron-left'];
		els[0].style.display = 'block';
		isOpen = true;
	}
}
