export const bookings = [
  {
    pnr: "ABC123",
    flights: [
      {
        id: "XQ-1234",
        airline: "SunExpress",
        from: "DUS",
        fromCity: "Düsseldorf",
        to: "AYT",
        toCity: "Antalya",
        departure: "2026-05-15T06:30:00",
        arrival: "2026-05-15T11:15:00",
        status: "confirmed",
        checkinOpen: true,
      },
      {
        id: "XQ-1235",
        airline: "SunExpress",
        from: "AYT",
        fromCity: "Antalya",
        to: "DUS",
        toCity: "Düsseldorf",
        departure: "2026-05-22T12:00:00",
        arrival: "2026-05-22T15:00:00",
        status: "confirmed",
        checkinOpen: false,
      },
    ],
    passengers: [
      { id: 1, firstName: "Mehmet", lastName: "Yilmaz", type: "adult", checkedIn: false },
      { id: 2, firstName: "Ayse", lastName: "Yilmaz", type: "adult", checkedIn: false },
      { id: 3, firstName: "Emre", lastName: "Yilmaz", type: "child", checkedIn: false },
    ],
  },
  {
    pnr: "DEF456",
    flights: [
      {
        id: "XQ-5678",
        airline: "SunExpress",
        from: "BER",
        fromCity: "Berlin",
        to: "IST",
        toCity: "Istanbul",
        departure: "2026-04-20T09:00:00",
        arrival: "2026-04-20T14:30:00",
        status: "checkedin",
        checkinOpen: true,
      },
    ],
    passengers: [
      { id: 4, firstName: "Anna", lastName: "Schmidt", type: "adult", checkedIn: true },
    ],
  },
  {
    pnr: "GHI789",
    flights: [
      {
        id: "XQ-9999",
        airline: "SunExpress",
        from: "MUC",
        fromCity: "München",
        to: "ADB",
        toCity: "Izmir",
        departure: "2026-03-10T07:00:00",
        arrival: "2026-03-10T11:45:00",
        status: "cancelled",
        checkinOpen: false,
      },
    ],
    passengers: [
      { id: 5, firstName: "Thomas", lastName: "Müller", type: "adult", checkedIn: false },
      { id: 6, firstName: "Lisa", lastName: "Müller", type: "adult", checkedIn: false },
    ],
  },
];

export const meals = [
  { id: "standard", name: "Standard", price: 0 },
  { id: "chicken", name: "Hähnchen mit Reis", price: 12 },
  { id: "pasta", name: "Pasta Bolognese", price: 10 },
  { id: "vegan", name: "Veganes Menü", price: 14 },
  { id: "kids", name: "Kindermenü", price: 8 },
];

export const crossSellOffers = [
  { id: 1, title: "Hotel buchen", description: "Bis zu 30% Rabatt", icon: "hotel", cta: "Jetzt buchen" },
  { id: 2, title: "Mietwagen", description: "Ab 19€/Tag", icon: "car", cta: "Angebote ansehen" },
  { id: 3, title: "Reiseversicherung", description: "Sorglos reisen", icon: "shield", cta: "Mehr erfahren" },
  { id: 4, title: "Flughafentransfer", description: "Bequem zum Flughafen", icon: "bus", cta: "Buchen" },
];
