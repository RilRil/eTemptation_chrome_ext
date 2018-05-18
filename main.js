
setTimeout(loadExt, 500);

function loadExt() {
	console.log('!! eTemptation Chrome Extension loaded !!');

	var css = document.createElement("style");
	css.innerHTML = CSS_CODE; // from style.js
	document.body.appendChild(css);

	let timeHome = { hour: '--', min: '--' };
	let workingTime = { hour: 0, min: 0 };
	let breakTime = { hour: 0, min: 0 };
	let chillinTime = { hour: 1, min: 0 };
	let breaks = [];
	let works = [];
	let allIntervals = [];

	let lunchBreakOK = false;
	let biggestBreakInMin = 0;
	let biggestBreak = { hour: 0, min: 0 };
	let rest = MINIMUM_TIME_TO_WORK;

	let data = findData();
	console.table(data);

	if (data.length === 1) {
		workingTime = subTime(TIME_NOW, data[0]);
		rest = subTime(MINIMUM_TIME_TO_WORK, workingTime);
		timeHome = addTime(TIME_NOW, addTime(rest, chillinTime));
	} else if (data.length > 1) {

		data.forEach((datum, key) => {
			if (key !== 0) {
				let thisIsWork = true;
				let timeGap = subTime(datum, data[key - 1]);

				if (key % 2 != 0) {
					// interval of work
					workingTime = addTime(workingTime, timeGap);
					works.push(timeGap);
				} else {
					// interval of break
					thisIsWork = false;
					if (!data[key + 1]) {
						workingTime = addTime(workingTime, subTime(TIME_NOW, datum));
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

				allIntervals.push({
					start: data[key - 1],
					end: datum,
					interval: timeGap,
					thisIsWork
				});
			}
		});

		// console.table(works);
		// console.table(breaks);
		// console.log('all intervals : ', allIntervals);

		biggestBreak = translateMinToTime(biggestBreakInMin);
		rest = subTime(MINIMUM_TIME_TO_WORK, workingTime);
		if (rest.sign === '-') {
			timeHome = addTime(data[data.length - 1], chillinTime);
		} else {
			timeHome = addTime(TIME_NOW, addTime(rest, chillinTime));
		}

		allIntervals.push({
			start: data[data.length - 1],
			end: TIME_NOW,
			interval: subTime(TIME_NOW, data[data.length - 1]),
			thisIsWork: (data.length % 2 !== 0)
		});
	}

	// display
	if (document.querySelectorAll('.bargridwba').length) {
		let timeHomeStr = rest.sign === '-' ? 'NOW !' : `${timeHome.hour}:${timeHome.min}`;

		let container = document.createElement('div');
		container.classList = ['etemp-chrome-ext'];

		let HTMLPart1 = drawTimeline(allIntervals);
		let HTMLPart2 = `
		<div>
			<p>Worked : ${workingTime.hour}h ${workingTime.min}min | Remaining : ${rest.sign} ${rest.hour}h ${rest.min}min </p>
			<hr />
			<p>1h hour break for lunch ?? ${lunchBreakOK ? 'YAY' : 'NOPE'}</p>
			<p>Biggest break : ${biggestBreak.hour}h ${biggestBreak.min}min</p>
			<p>Total break time : ${breakTime.hour}h ${breakTime.min}min</p>
			<hr />
			<p>I can go home at : ${timeHomeStr} </p>
		</div>
		`;

		container.innerHTML = HTMLPart1 + HTMLPart2;
		document.body.appendChild(container)
	}
}


function drawTimeline(intervals) {
	let html = '<div class="time-line">';

	html += '<div class="interval-times">';
	intervals.forEach((interval, i) => {
		html += `<div style="width:${findWidthInterval(interval.interval, intervals[0].start)}px" class="interval-time">${displayTime(interval.interval, true)}</div>`;
	});
	html += '</div>';

	html += '<div class="intervals">';
	intervals.forEach((interval) => {
		html += `<div class="interval" 
		style="
			width:${findWidthInterval(interval.interval, intervals[0].start)}px;
			background-color: ${(interval.thisIsWork ? '#6ab04c' : '#f9ca24')}
		">
		</div>`;
	});
	html += '</div>';

	html += '<div class="start-times">';
	intervals.forEach((interval, key) => {
		let more = '';
		if (key === intervals.length - 1) {
			more = `<span class='now-time'>${displayTime(interval.end)}<span>`;
		}
		html += `<div style="width:${findWidthInterval(interval.interval, intervals[0].start)}px" class="start-time-container">
		<span class="start-time">${displayTime(interval.start)}</span>
		${more}
		</div>`;
	});
	html += '</div>';

	html += '</div>';

	return html;
}


