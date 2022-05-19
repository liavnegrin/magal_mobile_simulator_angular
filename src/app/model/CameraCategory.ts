import { CameraItem } from "./CameraItem";

export interface CameraCategory{
    Id:string;
    Name:string;
    Cameras:CameraItem[];
    IsExpanded:boolean;
} 