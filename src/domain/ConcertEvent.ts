export class ConcertEvent {
    constructor(
        public id: string,
        public date: string,
        public dayOfWeek: string,
        public time: string,
        public name: string,
        public city: string,
        public state: string,
        public venue: string,
        public image: string
    ) {}

    static fromApiResponse(event: any): ConcertEvent {
        const date = event.dates?.start?.localDate || "No Date Available";
        const dayOfWeek = new Date(date).toLocaleDateString("en-US", { weekday: "long" }); 
        return new ConcertEvent(
            event.id,
            date,
            dayOfWeek,
            event.dates?.start?.localTime || "No Time Available",
            event.name,
            event._embedded?.venues?.[0]?.city?.name || "No City Available",
            event._embedded?.venues?.[0]?.state?.name || "No State Available",
            event._embedded?.venues?.[0]?.name || "No Venue Available",
            event.images?.[0]?.url || "No Image Available"
        );
    }
}
