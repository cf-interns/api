import { DateTime }  from 'luxon';

export class LocalDateTime {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    seconds: number;


    constructor(dateTime: DateTime){
        this.year = dateTime.year;
        this.month = dateTime.month;
        this.day = dateTime.day;
        this.hour = dateTime.hour;
        this.minute = dateTime.minute;
        this.seconds = dateTime.second;
    }

    toDateTime(): DateTime {
        return DateTime.fromObject({
            year: this.year,
            month: this.month,
            day: this.day,
            hour: this.hour,
            minute: this.minute,
            second: this.seconds,
            
        })
    }
}