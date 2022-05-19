import { StatusItem } from "./StatusItem";

export interface EventHeader{
    Id:string;
    Name:string;
    X:number;
    Y:number;
    Z:number;
    CreationTime:Date;
    PictureLinkedItem:string;
    CreatingSensorName:string,
    CreatingSensorId:string;
    EventPriority:EventPriority;
    RelatedCamerasLink:RelatedCameraLinkDTO[];
    EventType:EventType;
    AlarmUserType:AlarmUserType;
    Status: EventStatus;
    IsExpanded: boolean;
}
export interface EventStatus extends StatusItem{
    EventId:string;
}
export interface RelatedCameraLinkDTO{
    Id:string;
    CameraId:string;
    Order:number;
    Preset:number;
    IsMainCamera:boolean;
}
export enum EventPriority{
    Low = 4, 
    Medium = 3,
    High = 2,
    Critical = 1
}
export enum EventType{
    Sensor = 1,
    User = 2,
    Scheduled = 3,
    Camera = 4,
}
export enum AlarmUserType{
    Operator = 1,
    Technician = 2,
}