import { IEvent } from "@/interfaces";
import dayjs from "dayjs";
import { BadgeDollarSign, Calendar, MapPin, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface IEventHeaderProps {
  event: IEvent;
}

export default function EventHeader(props: IEventHeaderProps) {
  const { event } = props;

  const date = (
    <Badge variant="outline" className="text-neutral-400">
      {event.date ? dayjs(event.date).format("MMMM D, YYYY") : "Unplanned"}
      <Calendar />
    </Badge>
  );

  const budget = (
    <Badge variant="outline" className="text-neutral-400">
      {event.budget ? event.budget.toLocaleString() : "Free"}
      <BadgeDollarSign />
    </Badge>
  );

  const attendees = (
    <Badge variant="outline" className="text-neutral-400">
      {event.maxAttendees
        ? `${event.attendees?.length || 0} / ${event.maxAttendees}`
        : "Unlimited"}
      <User />
    </Badge>
  );

  const location = (
    <Badge variant="outline" className="text-neutral-400">
      {event.location} <MapPin />
    </Badge>
  );

  return (
    <div className="w-full flex flex-col space-x-4 border-none gap-4">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex gap-2 items-baseline">
          <h1 className="font-bold text-sm">Tu Phan</h1>
          <p className="text-xs opacity-50">2 days ago</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          {date}
          {budget}
          {attendees}
          {location}
        </div>
      </div>
    </div>
  );
}
