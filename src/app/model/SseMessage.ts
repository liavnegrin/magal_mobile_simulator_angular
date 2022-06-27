export interface SseMessage{
    Entities:IFortisIdEntity[];
    EntityType:string;
    OperationType:SseMessageOperation;
}
export interface IFortisIdEntity{
    Id:string;
}
export enum SseMessageOperation{
    Update = 0,
    Remove = 1,
}