export class Event {
    constructor(
        public id: string,
        public name: string,
        public date: string,
        public time?: string,
        public venue?: string,
        public city?: string,
        public postalCode?: string,
        public country?: string,
        public image?: string,
        public url?: string
    ) {}

    static fromApiResponse(event: any): Event {
        return new Event(
            event.id,
            event.name,
            event.dates?.start?.localDate,
            event.dates?.start?.localTime,
            event._embedded?.venues?.[0]?.name,
            event._embedded?.venues?.[0]?.city?.name,
            event._embedded?.venues?.[0]?.postalCode,
            event._embedded?.venues?.[0]?.country?.name,
            event.images?.[0]?.url,
            event.url
        );
    }
}
