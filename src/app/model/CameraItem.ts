import { CameraPreset } from "./CameraPreset";
import { StatusItem } from "./StatusItem";

export interface CameraItem {
    Id:string;
    Name:string;
    X:number;
    Y:number;
    Z:number;
    CameraCategoryId:string;
    PictureLinkedItem:string;
    IsPTZ: boolean;
    Presets: CameraPreset[];
    Status: CameraStatus;
}

export interface CameraStatus extends StatusItem{
    CameraId:string
}