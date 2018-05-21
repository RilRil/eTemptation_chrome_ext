
class Interval {

    constructor(param1, param2, param3) {
        let interval;
        this.icons = {};
        this.type = 'work';

        if (param1 instanceof Time && param2 instanceof Time) {
            interval = this.gap(param1, param2);
            this.inMinutes = interval.inMinutes;
            this.start = param1;
            this.end = param2;
            this.type = param3 || this.type;
        } else {
            this.inMinutes = param1;
            this.type = param2 || this.type;
            interval = Interval.translateMinToInterval(this.inMinutes);
        }

        this.hours = interval.hours;
        this.minutes = interval.minutes;
        this.sign = interval.sign;
    }

    set(minutes) {
        this.inMinutes = minutes;
        let obj = Interval.translateMinToInterval(minutes);
        this.hours = obj.hours;
        this.minutes = obj.minutes;
        this.sign = obj.sign;
        return this;
    }

    gap(param1, param2) {
        if (param2 !== undefined) {
            let inMin = param1.toMin() - param2.toMin();
            if (inMin < 0) {
                this.sign = -1;
                inMin *= -1;
            }
            return new Interval(inMin);
        } else {
            return new Interval(this.toMin() - param1.toMin());
        }
    }

    add(interval) {
        return new Interval(this.toMin() + interval.toMin());
    }

    sub(interval) {
        return new Interval(this.toMin() - interval.toMin());
    }

    abs() {
        return new Interval(Math.abs(this.toMin()));
    }

    toMin() {
        return this.inMinutes;
    }

    setIcons(start, end) {
        this.icons = { start, end };
    }

    getColor() {
        switch (this.type) {
            case 'work':
                return WORK_COLOR;
            case 'break':
                return BREAK_COLOR;
            case 'remaining':
                return REMAINING_COLOR;
            case 'overtime':
                return OVERTIME_COLOR;
        }
    }

    toString() {
        let str = (this.hours > 0 ? this.hours + 'h' : '') + (this.minutes > 0 ? this.minutes + 'min' : '');
        return str || '0min';
    }

    print(msg) {
        if (DEBUG && DEBUG === true)
            console.log(this.toString(), `<- '${msg || ''}' (Interval::[${this.type}])`);
    }

    static translateMinToInterval(mins) {
        let sign = 1;
        if (mins < 0) {
            mins *= -1;
            sign = -1;
        }
        return {
            hours: Math.floor(mins / 60),
            minutes: mins % 60,
            sign
        };
    }
}