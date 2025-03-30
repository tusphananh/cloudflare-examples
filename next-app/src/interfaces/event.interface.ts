import { IImage } from "./image.interface";
export interface IEvent {
  id: string;
  title: string;
  date?: string;
  location: string;
  description: string;
  images?: { src: string; alt: string }[];
  budget?: number;
  maxAttendees?: number;
  attendees?: { id: string; name: string }[];
}

export interface ICreateEventInput {
  title: string;
  date?: string;
  address: string;
  location: number[];
  description: string;
  images?: IImage[];
  budget?: number;
  maxAttendees?: number;
}
