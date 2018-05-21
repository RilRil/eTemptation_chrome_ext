const DEBUG = false;

setTimeout(etempExt_load, 500);

function etempExt_load() {
	if (!document.querySelectorAll('.bargridwba').length)
		return;

	console.log('### eTemptation Chrome Extension loaded ###');

	etempExt_injectStuff();
	let arrTally = etempExt_findData();
	// console.table(arrTally);
	let lastTally = arrTally[arrTally.length - 1];

	let timeHome = new Time(0, 0);
	let totalWorkTime = new Interval(0, 'work');
	let totalBreakTime = new Interval(0, 'break');
	let remainingMandatoryBreakTime = MINIMUM_TIME_BREAK;
	let biggestBreak = new Interval(0);
	let rest = MINIMUM_TIME_TO_WORK_WITH_PAUSE;

	let breaks = [];
	let allIntervals = [];
	let lunchBreakOK = false;

	if (arrTally.length === 1) {
		arrTally[0].print('tally');
		totalWorkTime = arrTally[0].gap(TIME_NOW);
	} else if (arrTally.length > 1) {
		arrTally.forEach((tally, key) => {
			tally.print('tally');
			if (key !== 0) {
				let newInterval = new Interval(arrTally[key - 1], tally, (key % 2 !== 0 ? 'work' : 'break'));
				newInterval.print('newInterval');
				allIntervals.push(newInterval); // store new interval

				if (newInterval.type === 'work') {
					totalWorkTime = totalWorkTime.add(newInterval);
				} else if (newInterval.type === 'break') {
					totalBreakTime = totalBreakTime.add(newInterval);
					breaks.push(newInterval);

					if (newInterval.toMin() > biggestBreak.toMin()) {
						biggestBreak = newInterval;
						// calculate remaining mandatory break
						remainingMandatoryBreakTime = MINIMUM_TIME_BREAK.sub(biggestBreak);
						if (remainingMandatoryBreakTime.sign === -1) {
							remainingMandatoryBreakTime.set(0);
						}
						lunchBreakOK = remainingMandatoryBreakTime.toMin() === 0;
					}
				}

				if (tally.in && key === arrTally.length - 1) {
					totalWorkTime = totalWorkTime.add(TIME_NOW.gap(tally));
				}
			}
		});
	}

	rest = totalWorkTime.sub(MINIMUM_TIME_TO_WORK).sub(remainingMandatoryBreakTime);
	rest.type = rest.sign === -1 ? 'remaining' : 'overtime';
	rest.print('REST')

	if (arrTally.length % 2 === 0) {
		// console.log('OUT');
		if (rest.sign === -1) {
			// console.log('REMAINING')
			timeHome = TIME_NOW.add(rest.abs());
			let lastInterval = new Interval(TIME_NOW, timeHome, 'remaining'); 
			lastInterval.setIcons('far fa-clock', 'fas fa-home');

			allIntervals.push(new Interval(lastTally, TIME_NOW, 'break'));
			allIntervals.push(lastInterval);
		} else {
			// console.log('OVERTIME');
			timeHome = TIME_NOW;
			let lastInterval = new Interval(lastTally, TIME_NOW, 'break')
			lastInterval.setIcons('fas fa-home', 'far fa-clock');

			allIntervals.push(lastInterval);
		}
	} else {
		// console.log('IN');
		if (rest.sign === -1) {
			// console.log('REMAINING');
			timeHome = TIME_NOW.add(rest.abs());
			let lastInterval = new Interval(TIME_NOW, timeHome, 'remaining'); 
			lastInterval.setIcons('far fa-clock', 'fas fa-home');

			allIntervals.push(new Interval(lastTally, TIME_NOW, 'work'));
			allIntervals.push(lastInterval);
		} else {
			// console.log('OVERTIME');
			timeHome = TIME_NOW;
			let overtimeSince = TIME_NOW.sub(rest);
			let lastInterval = new Interval(overtimeSince, TIME_NOW, 'overtime'); 
			lastInterval.setIcons('fas fa-home', 'far fa-clock');

			allIntervals.push(new Interval(lastTally, overtimeSince, 'work'));
			allIntervals.push(lastInterval);
		}
	}

	timeHome.print('TIME HOME');

	// draw
	let container = document.createElement('div');
	container.classList = ['etemp-chrome-ext'];

	let html = '';
	html += etempExt_getWorkBar(totalWorkTime, totalBreakTime, remainingMandatoryBreakTime, rest, biggestBreak);
	html += `<hr>`;
	html += etempExt_getTimeLine(allIntervals, (TIME_NOW.toMin() < timeHome.toMin() ? timeHome : TIME_NOW));
	html += `
		<hr>
		<div class="info">
			<span>Total Work : <span class='time'>${totalWorkTime.toString()}</span></span>
			<i class="fas fa-circle"></i>
			<span>Total Break : <span class='time'>${totalBreakTime.toString()}</span></span>
			<i class="fas fa-circle"></i>
			<span>Lunchbreak?? <span class='time'>${lunchBreakOK ? 'YAY' : 'NOPE'}</span></span>
			<i class="fas fa-circle"></i>
			<span>Longest break : <span class='time'>${biggestBreak.toString()}</span></span>
		</div>
		`;
	container.innerHTML = html;
	document.body.appendChild(container)
}

function etempExt_getWorkBar(lTotalWorkTime, lTotalBreakTime, lRemainingMandatoryBreakTime, remainingTime, biggestBreak) {
	// console.log('### DISPLAYING WORK BAR ### ');

	let maxBreak = biggestBreak.toMin() > MINIMUM_TIME_BREAK.toMin() ? MINIMUM_TIME_BREAK : biggestBreak;
	let totalTime = MINIMUM_TIME_TO_WORK_WITH_PAUSE;
	
	lTotalWorkTime.print('worked');
	lTotalBreakTime.print('break');
	lRemainingMandatoryBreakTime.print('remaining break time');
	remainingTime.print('remains');
	maxBreak.print('max break');
	totalTime.print('totaltime');

	let maxWidth = TIMELINE_WIDTH;
	let workWidth = Math.abs(lTotalWorkTime.toMin()) / totalTime.toMin() * maxWidth;
	let breakWidth = Math.abs(maxBreak.toMin()) / totalTime.toMin() * maxWidth;
	let remainsWidth = Math.abs(remainingTime.toMin()) / totalTime.toMin() * maxWidth;

	let barWork = `<div class="bar work-bar-work" style="width: ${workWidth}px">${lTotalWorkTime.toString()}</div>`;
	let barBreak = `<div class="bar work-bar-break" style="width: ${breakWidth}px">${maxBreak.toString()}</div>`;;
	let barRest = `<div class="bar work-bar-${remainingTime.type}" style="width: ${remainsWidth}px">${remainingTime.toString()}</div>`;

	return `
	<div class="work-bar-container" style="width: ${TIMELINE_WIDTH}px">
	  	<div class="work-bar">
			${barBreak}
	  		${barWork}
			${barRest}
	  	</div>
	  	<div class=""><span>out of ${MINIMUM_TIME_TO_WORK_WITH_PAUSE.toString()} (= with the 1h lunch break)</span></div>
	</div>
	`;
}

function etempExt_getTimeLine(intervals, endOfDay) {
	// console.log('### DISPLAYING TIMELINE ### ');
	endOfDay.print('end of day');

	let intervalFromStartToEndOfDay = intervals[0].start.gap(endOfDay);
	intervalFromStartToEndOfDay.print('intervalFromStartToEndOfDay')

	let html = `<div class="time-line" style="width: ${TIMELINE_WIDTH}px">`;

	html += '<div class="intervals">';
	intervals.forEach((interval) => {
		html += `<div class="interval" 
		style="
			width:${findWidthInterval(interval, intervalFromStartToEndOfDay)}px;
			background-color: ${interval.getColor()}
		">
		${interval.toString()}
		</div>`;
	});
	html += '</div>';


	html += '<div class="start-times">';
	intervals.forEach((interval, key) => {
		let more = '';
		if (key === intervals.length - 1) {
			more = `<span class='now-time'>
				${interval.end.toString()}
				${(interval.icons.end ? '<br>' + '<i class="' + interval.icons.end + '"></i>' : '')}
				<span>`;
		}
		html += `
		<div style="width:${findWidthInterval(interval, intervalFromStartToEndOfDay)}px" 
		class="start-time-container">
			<span class="start-time">
				${interval.start.toString()}
				${(interval.icons.start ? '<br>' + '<i class="' + interval.icons.start + '"></i>' : '')}
			</span>
		  ${more}
		</div>`;
	});
	html += '</div>';

	html += '</div>';

	return html;
}


