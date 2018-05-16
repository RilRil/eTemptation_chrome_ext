
const minimumTimeWithPause = { hour: 8, min: 20, sign: '' };
const minimumTimeWork = { hour: 7, min: 20, sign: '' };

setTimeout(loadExt, 500);



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
		sign
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

function loadExt() {
	console.log('!! eTemptation Chrome Extension loaded !!');

	let timeHome = { hour: '--', min: '--' };
	let workingTime = { hour: 0, min: 0 };
	let chillinTime = { hour: 1, min: 0 };
	let rest = minimumTimeWork;
	let data = findData();
	let timeNow = getRealTime();

	console.table(data);

	if (data.length === 1) {
		workingTime = subTime(timeNow, data[0]);
		rest = subTime(minimumTimeWork, workingTime);
		timeHome = addTime(timeNow, addTime(rest, chillinTime));
	} else if (data.length > 1) {

		data.forEach((datum, key) => {
			if (key !== 0) {
				if (key % 2 != 0) {
					workingTime = addTime(workingTime, subTime(datum, data[key - 1]));
				} else {
					if (!data[key + 1]) {
						workingTime = addTime(workingTime, subTime(timeNow, datum));
					}
					chillinTime = subTime(chillinTime, subTime(datum, data[key - 1]));
					chillinTime = chillinTime.sign === '-' ? { hour: 0, min: 0 } : chillinTime;
				}
			}
		});

		rest = subTime(minimumTimeWork, workingTime);
		if (rest.sign === '-') {
			timeHome = addTime(data[data.length - 1], chillinTime);
		} else {
			timeHome = addTime(timeNow, addTime(rest, chillinTime));
		}
	}
	if (document.querySelectorAll('.bargridwba').length) {
		let timeHomeStr = rest.sign === '-' ? 'NOW !' : `${timeHome.hour}:${timeHome.min}`;

		let container = document.createElement('div');
		container.style.position = 'absolute';
		container.style.bottom = '0';
		container.style.left = '0';
		container.style.width = '245px';
		container.style.height = '155px';
		container.style.backgroundColor = '#f1f1f1';
		container.style.textAlign = 'center';
		container.style.fontFamily = 'Arial';
		container.innerHTML = `
	<p>I worked : ${workingTime.hour}h ${workingTime.min}min</p>
	<p>Remaining work : ${rest.sign} ${rest.hour}h ${rest.min}min </p>
	<p>Remaining pause : ${chillinTime.hour}h ${chillinTime.min}min </p>
	<p>I can go home at : ${timeHomeStr} </p>
	`;
		document.body.appendChild(container)
	}
}


