
const minimumTimeWithPause = { hour: 8, min: 20, sign: '' };
const minimumTimeWork = { hour: 7, min: 20, sign: '' };

setTimeout(loadExt, 500);

function loadExt() {
	console.log('!! eTemptation Chrome Extension loaded !!');

	let timeHome = { hour: '--', min: '--' };
	let workingTime = { hour: 0, min: 0 };
	let chillinTime = { hour: 1, min: 0 };
	let breakTime = { hour: 0, min: 0 };
	let breaks = [];
	let lunchBreakOK = false;
	let biggestBreakInMin = 0;
	let biggestBreak = { hour: 0, min: 0 };
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
				let timeGap = subTime(datum, data[key - 1]);

				if (key % 2 != 0) {
					workingTime = addTime(workingTime, timeGap);
				} else {
					if (!data[key + 1]) {
						//
						workingTime = addTime(workingTime, subTime(timeNow, datum));
					}
					chillinTime = subTime(chillinTime, timeGap);
					chillinTime = chillinTime.sign === '-' ? { hour: 0, min: 0 } : chillinTime;
					breakTime = addTime(breakTime, timeGap);
					breaks.push(timeGap);
					biggestBreakInMin = translateTimeToMin(timeGap) > biggestBreakInMin ? translateTimeToMin(timeGap) : biggestBreakInMin;
					if (!lunchBreakOK) {
						let lessThan1hour = subTime({ hour: 1, min: 0 }, timeGap);
						lunchBreakOK = lessThan1hour.sign === '-';
					}
				}
			}
		});

		console.table(breaks);
		
		biggestBreak = translateMinToTime(biggestBreakInMin);
		rest = subTime(minimumTimeWork, workingTime);
		if (rest.sign === '-') {
			timeHome = addTime(data[data.length - 1], chillinTime);
		} else {
			timeHome = addTime(timeNow, addTime(rest, chillinTime));
		}
	}

	// display
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
	<p>Worked : ${workingTime.hour}h ${workingTime.min}min | Remaining : ${rest.sign} ${rest.hour}h ${rest.min}min </p>
	<hr />
	<p>1h hour break for lunch ?? ${lunchBreakOK ? 'YAY' : 'NOPE'}</p>
	<p>Biggest break : ${biggestBreak.hour}h ${biggestBreak.min}min</p>
	<p>Total break time : ${breakTime.hour}h ${breakTime.min}min</p>
	<hr />
	<p>I can go home at : ${timeHomeStr} </p>
	`;
		document.body.appendChild(container)
	}
}


