export class OtherEvent {
    constructor(
        public id: string,
        public date: string,
        public dayOfWeek: string,
        public time: string,
        public name: string,
        public city: string,
        public state: string,
        public venue: string,
        public image: string,
        public classificationName: string
    ) {}

    static fromApiResponse(event: any): OtherEvent {
        const date = event.dates?.start?.localDate || "No Date Available";
        const dayOfWeek = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
        return new OtherEvent(
            event.id,
            date,
            dayOfWeek,
            event.dates?.start?.localTime || "No Time Available",
            event.name,
            event._embedded?.venues?.[0]?.city?.name || "No City Available",
            event._embedded?.venues?.[0]?.state?.name || "No State Available",
            event._embedded?.venues?.[0]?.name || "No Venue Available",
            event.images?.[0]?.url || "No Image Available",
            event.classificationName = event.classifications?.[0].segment.name
        );
    }
}
