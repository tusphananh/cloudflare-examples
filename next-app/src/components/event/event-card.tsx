import { IEvent } from '@/interfaces';
import { getKey } from '@/utils';
import { BellRing } from 'lucide-react';
import { HoldToConfirmButton } from '../button/hold-button';
import PreviewImage from '../image/preview-image';
import { Button } from '../ui/button';
import EventHeader from './event-header';

interface IEventCardProps {
  event: IEvent;
}

export default function EventCard(props: IEventCardProps) {
  const { event } = props;

  const shouldRenderJoinBtn =
    !event.maxAttendees || (event.attendees?.length || 0) < event.maxAttendees;

  return (
    <div className="w-full rounded-md pr-4">
      <EventHeader event={event} />

      <h1 className="font-bold mt-8 text-lg">{event.title}</h1>
      <p className="text-xs mt-2 text-neutral-200">{event.description}</p>

      {event.images && (
        <div className="flex flex-wrap gap-4 mt-4">
          {event.images.map((image, index) => {
            return (
              <PreviewImage
                key={getKey('event-card-image', index)}
                src={image.src}
                alt={image.alt}
                width={1920}
                height={1080}
                previewOptions={{
                  width: 100,
                  height: 100,
                }}
              />
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 mt-4">
        <Button size="lg" variant="outline">
          <BellRing />
        </Button>
        <HoldToConfirmButton
          disabled={!shouldRenderJoinBtn}
          text={shouldRenderJoinBtn ? 'Hold to join' : 'Full slot'}
          className="flex-1"
        />
      </div>
    </div>
  );
}
