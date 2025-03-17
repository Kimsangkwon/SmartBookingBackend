export class HomeEvent {
    constructor(
        public id: string,
        public date: string,
        public name: string,
        public images: string[],
        public info: string
    ) {}
    static fromApiResponse(event: any): HomeEvent {
        return new HomeEvent(
            event.id,
            event.dates?.start?.localDate || "No Date Available",
            event.name,
            event.images ? event.images.map((img: any) => img.url) : [],
            event.info || "No Additional Information"
        );
    }
}
