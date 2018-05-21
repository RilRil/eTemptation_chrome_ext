
class Time {
    constructor(hours, minutes, signOn) {
        if (minutes === undefined || typeof (minutes) === 'boolean') {
            let inMinutes = hours;
            let obj = this.translateMinToTime(inMinutes);
            this.hours = obj.hours;
            this.minutes = obj.minutes
            this.in = minutes || false;
        } else {
            this.hours = hours;
            this.minutes = minutes;
            this.in = signOn;
        }
    }

    gap(param1) {
        return new Interval(this, param1);
    }

    sub(time) {
        return new Time(this.toMin() - time.toMin());
    }

    add(time) {
        return new Time(this.toMin() + time.toMin());
    }

    toMin() {
        return this.hours * 60 + this.minutes;
    }

    translateMinToTime(mins) {
        if (mins < 0) mins *= -1;
        return {
            hours: Math.floor(mins / 60),
            minutes: mins % 60
        };
    }

    print(msg) {
        if (DEBUG && DEBUG === true)
            console.log(this.toString(), ` <- '${msg || ''}' (Time::[${this.in ? 'in' : 'out'}])`);
    }

    toString() {
        // interval -> 3h30min || 30min || 5min
        // time -> 3:30 || 15:30 || 15:05
        let hours = this.hours;
        hours = this.hours > 23 ? Math.floor(this.hours % 24) : this.hours;
        return hours + ':' + ((this.minutes <= 9 ? '0' : '') + this.minutes);
    }
}


