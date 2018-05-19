const MINIMUM_TIME_TO_WORK = { hour: 7, min: 20, sign: '', inMin: 440 };
const TIMELINE_WIDTH = window.innerWidth - 30;
const TIME_NOW = getRealTime();

function removeSpan(str) {
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

function findData() {
	let data = [];
	let rows = document.querySelectorAll('.bargridwba tr');
	rows.forEach(row => {
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
		let exploded = removeSpan(tdData).split('.');
		let time = {
			hour: parseInt(exploded[0]),
			min: parseInt(exploded[1])
		};
		data.push(time);
	});
	return data;
}

function translateTimeToMin(time) {
	return time.hour * 60 + time.min;
}

function translateMinToTime(mins) {
	let sign = '';
	if (mins < 0) {
		sign = '-';
		mins = -mins;
	}
	return {
		hour: Math.floor(mins / 60),
		min: mins % 60,
		sign,
		inMin: mins
	};
}

function addTime(time1, time2) {
	let minTemp = time1.min + time2.min;
	let hFromMin = Math.floor(minTemp / 60);
	let min = minTemp % 60;
	let hour = time1.hour + time2.hour + hFromMin;
	return { hour, min };
}
function subTime(time1, time2) {
	let time1InMin = translateTimeToMin(time1);
	let time2InMin = translateTimeToMin(time2);
	let subInMin = time1InMin - time2InMin;
	return translateMinToTime(subInMin);
}

function getRealTime() {
	let date = new Date();
	return { hour: date.getHours(), min: date.getMinutes(), sign: '' };
}


function findWidthInterval(interval, start) {
	let startToNowIntervalInMin = translateTimeToMin(subTime(TIME_NOW, start));
	let w = interval.inMin / startToNowIntervalInMin * TIMELINE_WIDTH;
	return round(w);
}

function displayTime(time, isInterval) {
	// interval -> 3h30min || 30min || 5min
	// time -> 3:30 or 15:30 || 15:05
	let str = '';
	str += time.hour > 0 ? time.hour + (isInterval ? 'h' : ':') : '';
	str += ((time.min < 9 && !isInterval) ? '0' + time.min : time.min) + (isInterval ? 'min' : '');
	return str;
}

function round(number) {
	return Math.floor(number * 100) / 100;
}
