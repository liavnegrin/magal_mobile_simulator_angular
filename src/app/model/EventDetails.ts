export interface EventDetails{
    Id:string;
    EventNotes:EventNote[];
    EventActions:EventAction[];
    Attachments:string[];
    Commands:Command[];
}
export interface EventNote{
    EventId:string;
    Id:string;
    Note:string;
    CreationTime:Date;
    UserName:string;
    AttachmentId:string;
}
export interface EventAction{
    EventId:string;
    Id:string;
    Note:string;
    UpdateTime:Date;
    UserName:string;
    ActionOption:ActionOption;
}
export enum ActionOption{
    Accepted = 0,
    Arrived = 1,
    Rejected = 2,
    Done = 3
}
export interface Command{
    CommandEnumType:string;
    CommandEnumIndex:number;
    EntityType:string;
    EntityId:string;
    Order:number;
    Command:string;
    CanExecuteCommand:CanExecuteCommand;
    ExecuteLink:Link;
}
export interface CanExecuteCommand{
    CanExecute:boolean; 
    Reason:string 
    ReasonEnumIndex :number;
    ReasonEnumType:string; 
}

export interface Link{
    Href:string;
    ModelType:string;
    Method:number;
    Rel:number;
    PostType:string;
}