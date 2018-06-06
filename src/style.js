const TEXT_COLOR = 'black';
const WORK_COLOR = '#6ab04c';
const BREAK_COLOR = '#f9ca24';
const REMAINING_COLOR = '#eb4d4b';
const OVERTIME_COLOR = '#22a6b3';
const BORDER_COLOR = '#130f40';
const CSS_CODE = `
.btnbad {
    margin-top: -40px;
}

.etemp-chrome-ext-open {
	font-family: Arial;
    font-size: 13px;
    position: absolute;
    z-index: 100;
    bottom: 0;
    left: 0;
    width: 11px;
    height: 150px;
    background-color: #f1f1f1;
    display: flex;
    justify-content: start;
    flex-direction: column;
    padding: 10px;
}

.etemp-chrome-ext {
   position: absolute;
   z-index: 100;
   bottom: 0;
   left: 0;
   width: 100%;
   height: 135px;
   background-color: #f1f1f1;
   text-align: center;
   font-family: Arial;
   font-size: 13px;
   color: #0f163e;
}

.etemp-chrome-ext .close-ext {
	position: absolute;
}

.etemp-chrome-ext p {
    margin: 0;
    padding: 1px 0;
}

.etemp-chrome-ext .info {
	position: relative;
    text-align: center;
    padding: 0 0 0 10px;
}
.etemp-chrome-ext .info .fa-circle {
    font-size: 6px;
    vertical-align: middle;
}
.etemp-chrome-ext .info .time {
    color: ${BORDER_COLOR};
    font-weight: bold;
}

.time-line {
    text-align: left;
    margin-bottom: 10px;
    margin: 5px 0 5px 5px;
}

.intervals {
    position: relative;
    height: 20px;
}

.intervals:before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid ${BORDER_COLOR};
    width: 100%;
}
.intervals:after {
    content: '>';
    position: absolute;
    bottom: -12px;
    right: -4px;
    font-size: 20px;
}

.interval {
    display: inline-block;
    text-align: center;
    padding: 2px 0;
}


.start-times {
    display: flex;
    font-size: 11px;
    margin-top: 4px;
}

.start-time-container {
    display: flex;
    justify-content: space-between;
}


.start-time-container:first-child .start-time {
    margin-left: 0;
}
.start-time-container:last-child .now-time{
    margin-right: -12px;
}
.start-time {
    text-align: center;
    margin-left: -12px;
}

.now-time {
    float:right;
    text-align: center;
}

.work-bar-container {
    margin: 5px 0 5px 5px;
}
.work-bar {
    text-align: left;
    display: flex;
    position: relative;
}
.bar {
    text-align: center;
    display: inline-block;
    padding: 2px 0;
}
.work-bar-work {
    background-color: ${WORK_COLOR};
}
.work-bar-break {
    background-color: ${BREAK_COLOR};
}
.work-bar-remaining {
    background-color: ${REMAINING_COLOR};
}
.work-bar-overtime {
    position: absolute;
    right: 0;
    top: -3px;
    background-color: ${OVERTIME_COLOR};
}

`;