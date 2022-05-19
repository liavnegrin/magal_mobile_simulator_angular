export interface MobileUserInfo{
    LoginName:string;
    Latitude:number;
    Longitude:number;
    State:GpsState;
}
export enum GpsState{
    NotInstalled = -1,
    OFF	= 0,		
    ON = 1,
    NoDetection	= 2,
    Unknown = 3
}