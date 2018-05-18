const TEXT_COLOR = 'black';
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
    padding: 10px;
}

.interval-time {
    display: inline-block;
    text-align: center;
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
    border-top: 1px solid #130f40;
    width: 100%;
}

.interval {
    display: inline-block;
    height: 30px;
    border: solid 1px #130f40;
    border-width: 0 0 0 1px;
}
.interval:last-child {
    border-rigth: solid 1px #130f40;
    border-width: 0 1px 0 1px;
}

.start-time-container {
    text-align: left;
    display: inline-block;
}
.start-time {
}

.now-time {
    float:right;
}
`;