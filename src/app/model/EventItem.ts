import { EventDetails } from "./EventDetails";
import { EventHeader } from "./EventHeader";

export interface EventItem{
    Header:EventHeader;
    Details: EventDetails | null;
}