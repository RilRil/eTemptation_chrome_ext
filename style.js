const TEXT_COLOR = 'black';
const WORK_COLOR = '#6ab04c';
const BREAK_COLOR = '#f9ca24';
const REMAINING_COLOR = '#eb4d4b';
const OVERTIME_COLOR = '#22a6b3';
const BORDER_COLOR = '#130f40';
const CSS_CODE = `
.etemp-chrome-ext {
   position: absolute;
   bottom: 0;
   left: 0;
   width: 100%;
   height: 220px;
   background-color: #f1f1f1;
   text-align: center;
   font-family: Arial;
}

.time-line {
    text-align: left;
    margin-bottom: 10px;
    margin: 13px;
}

.intervals {
    position: relative;
    height: 30px;
}

.intervals:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    border-top: 1px solid ${BORDER_COLOR};
    width: 100%;
}

.interval {
    display: inline-block;
    text-align: center;
    height: 30px;
    border: solid 1px ${BORDER_COLOR};
    border-width: 0 0 0 1px;
}
.interval:last-child {
    border-rigth: solid 1px ${BORDER_COLOR};
    border-width: 0 1px 0 1px;
}

.start-time-container {
    text-align: left;
    display: inline-block;
}

.now-time {
    float:right;
}

.work-bar-container {
    margin: 15px;
}
.work-bar {
    border:solid 1px ${BORDER_COLOR};
    text-align: left;
    display: flex;
    min-height: 30px;
}
.bar {
    text-align:center;
    display: inline-block;
    line-height: 30px;
}
.work-bar-work {
    background-color: ${WORK_COLOR};
}
.work-bar-remaining {
    background-color: ${REMAINING_COLOR};
}
.work-bar-overtime {
    background-color: ${OVERTIME_COLOR};
}

`;