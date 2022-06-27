export interface StatusItem{
    Id: string;
    StatusName: string;
    AlarmType: StatusAlarmType;
    TimeStamp: Date;
}
export enum StatusAlarmType{
    NonAlarm = 0,
    Alarm = 1,
    TechnicianAlarm = 2
}
