// ─── DATENMODELL ─────────────────────────────────────
// Buchung → Reisen (Trips) → Segmente (Flights) → Passagiere
// Ein Passagier kann pro Segment unterschiedliche Status haben

export const scenarios = {
  // ══════════════════════════════════════════════════════
  // SZENARIO 1: Standard-Familie (Hin+Rück, Check-in offen)
  // ══════════════════════════════════════════════════════
  family: {
    id: "family",
    label: "Familie — Hin+Rück (Standard)",
    booking: {
      airtuerkRef: "991356",
      createdAt: "2025-03-15",
      contactEmail: "alexander@mustermann.de",
      contactPhone: "+49 170 1234567",

      passengers: [
        {
          id: "pax-1",
          title: "Herr",
          firstName: "Alexander",
          lastName: "Mustermann",
          type: "adult",
          dateOfBirth: "1985-06-15",
          nationality: "DE",
          documentNumber: null,
          specialNeeds: ["wheelchair_assistance"],
        },
        {
          id: "pax-2",
          title: "Frau",
          firstName: "Sandra",
          lastName: "Mustermann",
          type: "adult",
          dateOfBirth: "1987-09-22",
          nationality: "DE",
          documentNumber: null,
          specialNeeds: [],
        },
        {
          id: "pax-3",
          title: "Herr",
          firstName: "Peter",
          lastName: "Mustermann",
          type: "adult",
          dateOfBirth: "1960-03-10",
          nationality: "DE",
          documentNumber: null,
          specialNeeds: [],
        },
        {
          id: "pax-4",
          title: "Frau",
          firstName: "Heike",
          lastName: "Mustermann",
          type: "adult",
          dateOfBirth: "1962-11-05",
          nationality: "DE",
          documentNumber: null,
          specialNeeds: [],
        },
        {
          id: "pax-5",
          title: "",
          firstName: "Henrik",
          lastName: "Mustermann",
          type: "child",
          dateOfBirth: "2015-07-20",
          nationality: "DE",
          documentNumber: null,
          specialNeeds: [],
          linkedAdult: "pax-1",
        },
      ],

      trips: [
        {
          id: "trip-outbound",
          direction: "outbound",
          origin: { code: "FRA", city: "Frankfurt", country: "DE" },
          destination: { code: "HER", city: "Heraklion", country: "GR" },
          segments: [
            {
              id: "seg-1",
              airline: {
                name: "SunExpress",
                code: "XQ",
                logo: "https://logo.clearbit.com/sunexpress.com",
                colors: ["#F97316", "#DC2626"],
              },
              flightNumber: "XQ1315",
              aircraft: "Boeing 737-800",
              cabinClass: "Economy",
              duration: "3h 30min",
              departure: {
                airport: "Frankfurt",
                code: "FRA",
                terminal: "1",
                gate: null,
                date: "2025-04-30",
                time: "21:35",
                timezone: "Europe/Berlin",
              },
              arrival: {
                airport: "Heraklion",
                code: "HER",
                terminal: null,
                date: "2025-05-01",
                time: "00:25",
                timezone: "Europe/Athens",
              },
              airlinePNR: "C2W5VR",
              status: "checkin-open",
              checkinOpens: "2025-04-29T21:35:00+02:00",
              checkinCloses: "2025-04-30T18:35:00+02:00",
              passengerDetails: [
                { passengerId: "pax-1", ticketNumber: "6642930343441", seat: "1A", luggage: "23 kg", checkedIn: false, boardingPass: null },
                { passengerId: "pax-2", ticketNumber: "6642930343442", seat: "3A", luggage: "23 kg", checkedIn: false, boardingPass: null },
                { passengerId: "pax-3", ticketNumber: "6642930343443", seat: null, luggage: "23 kg", checkedIn: false, boardingPass: null },
                { passengerId: "pax-4", ticketNumber: "6642930343444", seat: "4B", luggage: "23 kg", checkedIn: false, boardingPass: null },
                { passengerId: "pax-5", ticketNumber: "6642930343445", seat: null, luggage: "23 kg", checkedIn: false, boardingPass: null },
              ],
            },
          ],
        },
        {
          id: "trip-return",
          direction: "return",
          origin: { code: "HER", city: "Heraklion", country: "GR" },
          destination: { code: "FRA", city: "Frankfurt", country: "DE" },
          segments: [
            {
              id: "seg-2",
              airline: {
                name: "Lufthansa",
                code: "LH",
                logo: "https://logo.clearbit.com/lufthansa.com",
                colors: ["#05164D", "#05164D"],
              },
              flightNumber: "LH1315",
              aircraft: "Airbus A320",
              cabinClass: "Economy",
              duration: "3h 30min",
              departure: {
                airport: "Heraklion",
                code: "HER",
                terminal: null,
                gate: null,
                date: "2025-05-14",
                time: "21:35",
                timezone: "Europe/Athens",
              },
              arrival: {
                airport: "Frankfurt",
                code: "FRA",
                terminal: "1",
                date: "2025-05-15",
                time: "00:25",
                timezone: "Europe/Berlin",
              },
              airlinePNR: "C2W5VR",
              status: "checkin-upcoming",
              checkinOpens: "2025-05-13T21:35:00+03:00",
              checkinCloses: "2025-05-14T18:35:00+03:00",
              passengerDetails: [
                { passengerId: "pax-1", ticketNumber: "6642930343441", seat: null, luggage: "23 kg", checkedIn: false, boardingPass: null },
                { passengerId: "pax-2", ticketNumber: "6642930343442", seat: null, luggage: "23 kg", checkedIn: false, boardingPass: null },
                { passengerId: "pax-3", ticketNumber: "6642930343443", seat: null, luggage: "23 kg", checkedIn: false, boardingPass: null },
                { passengerId: "pax-4", ticketNumber: "6642930343444", seat: null, luggage: "23 kg", checkedIn: false, boardingPass: null },
                { passengerId: "pax-5", ticketNumber: "6642930343445", seat: null, luggage: "23 kg", checkedIn: false, boardingPass: null },
              ],
            },
          ],
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════
  // SZENARIO 2: Solo-Reisender (nur Hinflug, Check-in offen)
  // ══════════════════════════════════════════════════════
  solo: {
    id: "solo",
    label: "Solo — Nur Hinflug",
    booking: {
      airtuerkRef: "445210",
      createdAt: "2025-04-01",
      contactEmail: "max@business.de",
      contactPhone: "+49 171 9876543",
      passengers: [
        {
          id: "pax-solo",
          title: "Herr",
          firstName: "Max",
          lastName: "Weber",
          type: "adult",
          dateOfBirth: "1990-01-15",
          nationality: "DE",
          documentNumber: null,
          specialNeeds: [],
        },
      ],
      trips: [
        {
          id: "trip-solo",
          direction: "outbound",
          origin: { code: "FRA", city: "Frankfurt", country: "DE" },
          destination: { code: "IST", city: "Istanbul", country: "TR" },
          segments: [
            {
              id: "seg-solo",
              airline: {
                name: "Turkish Airlines",
                code: "TK",
                logo: "https://logo.clearbit.com/turkishairlines.com",
                colors: ["#C70A0C", "#C70A0C"],
              },
              flightNumber: "TK1590",
              aircraft: "Boeing 787-9",
              cabinClass: "Economy",
              duration: "3h 10min",
              departure: { airport: "Frankfurt", code: "FRA", terminal: "1", gate: "B46", date: "2025-04-30", time: "14:20", timezone: "Europe/Berlin" },
              arrival: { airport: "Istanbul", code: "IST", terminal: "I", date: "2025-04-30", time: "19:30", timezone: "Europe/Istanbul" },
              airlinePNR: "TK8R2M",
              status: "checkin-open",
              checkinOpens: "2025-04-29T14:20:00+02:00",
              checkinCloses: "2025-04-30T11:20:00+02:00",
              passengerDetails: [
                { passengerId: "pax-solo", ticketNumber: "2352930998871", seat: "14A", luggage: "30 kg", checkedIn: false, boardingPass: null },
              ],
            },
          ],
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════
  // SZENARIO 3: Multi-Segment (Umstieg auf dem Hinflug)
  // ══════════════════════════════════════════════════════
  multiSegment: {
    id: "multiSegment",
    label: "Paar — Hinflug mit Umstieg",
    booking: {
      airtuerkRef: "773891",
      createdAt: "2025-02-20",
      contactEmail: "julia@email.de",
      contactPhone: "+49 172 5551234",
      passengers: [
        { id: "pax-ms-1", title: "Frau", firstName: "Julia", lastName: "Schmidt", type: "adult", dateOfBirth: "1992-04-12", nationality: "DE", documentNumber: null, specialNeeds: [] },
        { id: "pax-ms-2", title: "Herr", firstName: "Thomas", lastName: "Schmidt", type: "adult", dateOfBirth: "1990-08-30", nationality: "DE", documentNumber: null, specialNeeds: [] },
      ],
      trips: [
        {
          id: "trip-ms-out",
          direction: "outbound",
          origin: { code: "FRA", city: "Frankfurt", country: "DE" },
          destination: { code: "HER", city: "Heraklion", country: "GR" },
          segments: [
            {
              id: "seg-ms-1",
              airline: { name: "Aegean Airlines", code: "A3", logo: "https://logo.clearbit.com/aegeanair.com", colors: ["#00205B", "#00205B"] },
              flightNumber: "A3 1501",
              aircraft: "Airbus A320neo",
              cabinClass: "Economy",
              duration: "2h 40min",
              departure: { airport: "Frankfurt", code: "FRA", terminal: "2", gate: null, date: "2025-04-30", time: "06:15", timezone: "Europe/Berlin" },
              arrival: { airport: "Athen", code: "ATH", terminal: null, date: "2025-04-30", time: "10:55", timezone: "Europe/Athens" },
              airlinePNR: "AEGFR1",
              status: "checkin-open",
              checkinOpens: "2025-04-29T06:15:00+02:00",
              checkinCloses: "2025-04-30T03:15:00+02:00",
              passengerDetails: [
                { passengerId: "pax-ms-1", ticketNumber: "3901234567890", seat: "8A", luggage: "23 kg", checkedIn: false, boardingPass: null },
                { passengerId: "pax-ms-2", ticketNumber: "3901234567891", seat: "8B", luggage: "23 kg", checkedIn: false, boardingPass: null },
              ],
            },
            {
              id: "seg-ms-2",
              airline: { name: "Aegean Airlines", code: "A3", logo: "https://logo.clearbit.com/aegeanair.com", colors: ["#00205B", "#00205B"] },
              flightNumber: "A3 502",
              aircraft: "Airbus A320neo",
              cabinClass: "Economy",
              duration: "0h 55min",
              departure: { airport: "Athen", code: "ATH", terminal: null, gate: null, date: "2025-04-30", time: "12:30", timezone: "Europe/Athens" },
              arrival: { airport: "Heraklion", code: "HER", terminal: null, date: "2025-04-30", time: "13:25", timezone: "Europe/Athens" },
              airlinePNR: "AEGFR1",
              status: "checkin-open",
              checkinOpens: "2025-04-29T06:15:00+02:00",
              checkinCloses: "2025-04-30T09:30:00+03:00",
              passengerDetails: [
                { passengerId: "pax-ms-1", ticketNumber: "3901234567890", seat: null, luggage: "23 kg", checkedIn: false, boardingPass: null },
                { passengerId: "pax-ms-2", ticketNumber: "3901234567891", seat: null, luggage: "23 kg", checkedIn: false, boardingPass: null },
              ],
            },
          ],
        },
        {
          id: "trip-ms-ret",
          direction: "return",
          origin: { code: "HER", city: "Heraklion", country: "GR" },
          destination: { code: "FRA", city: "Frankfurt", country: "DE" },
          segments: [
            {
              id: "seg-ms-3",
              airline: { name: "SunExpress", code: "XQ", logo: "https://logo.clearbit.com/sunexpress.com", colors: ["#F97316", "#DC2626"] },
              flightNumber: "XQ517",
              aircraft: "Boeing 737-800",
              cabinClass: "Economy",
              duration: "3h 35min",
              departure: { airport: "Heraklion", code: "HER", terminal: null, gate: null, date: "2025-05-10", time: "16:00", timezone: "Europe/Athens" },
              arrival: { airport: "Frankfurt", code: "FRA", terminal: "1", date: "2025-05-10", time: "18:35", timezone: "Europe/Berlin" },
              airlinePNR: "XQRET2",
              status: "checkin-upcoming",
              checkinOpens: "2025-05-09T16:00:00+03:00",
              checkinCloses: "2025-05-10T13:00:00+03:00",
              passengerDetails: [
                { passengerId: "pax-ms-1", ticketNumber: "3901234567890", seat: null, luggage: "23 kg", checkedIn: false, boardingPass: null },
                { passengerId: "pax-ms-2", ticketNumber: "3901234567891", seat: null, luggage: "23 kg", checkedIn: false, boardingPass: null },
              ],
            },
          ],
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════
  // SZENARIO 4: Teilweise eingecheckt
  // ══════════════════════════════════════════════════════
  partialCheckin: {
    id: "partialCheckin",
    label: "Teilweise eingecheckt (2 von 4)",
    booking: {
      airtuerkRef: "662410",
      createdAt: "2025-03-25",
      contactEmail: "familie@meyer.de",
      contactPhone: "+49 173 4445556",
      passengers: [
        { id: "pax-pc-1", title: "Herr", firstName: "Markus", lastName: "Meyer", type: "adult", dateOfBirth: "1980-02-14", nationality: "DE", documentNumber: "C01X00T47", specialNeeds: [] },
        { id: "pax-pc-2", title: "Frau", firstName: "Nina", lastName: "Meyer", type: "adult", dateOfBirth: "1983-07-19", nationality: "DE", documentNumber: "C02X00T48", specialNeeds: [] },
        { id: "pax-pc-3", title: "", firstName: "Lukas", lastName: "Meyer", type: "child", dateOfBirth: "2013-12-01", nationality: "DE", documentNumber: null, specialNeeds: [], linkedAdult: "pax-pc-1" },
        { id: "pax-pc-4", title: "", firstName: "Emma", lastName: "Meyer", type: "infant", dateOfBirth: "2024-01-10", nationality: "DE", documentNumber: null, specialNeeds: [], linkedAdult: "pax-pc-2" },
      ],
      trips: [
        {
          id: "trip-pc",
          direction: "outbound",
          origin: { code: "DUS", city: "Düsseldorf", country: "DE" },
          destination: { code: "AYT", city: "Antalya", country: "TR" },
          segments: [
            {
              id: "seg-pc",
              airline: { name: "SunExpress", code: "XQ", logo: "https://logo.clearbit.com/sunexpress.com", colors: ["#F97316", "#DC2626"] },
              flightNumber: "XQ958",
              aircraft: "Boeing 737-800",
              cabinClass: "Economy",
              duration: "3h 45min",
              departure: { airport: "Düsseldorf", code: "DUS", terminal: null, gate: "A54", date: "2025-04-30", time: "10:00", timezone: "Europe/Berlin" },
              arrival: { airport: "Antalya", code: "AYT", terminal: "1", date: "2025-04-30", time: "15:45", timezone: "Europe/Istanbul" },
              airlinePNR: "SXD7K2",
              status: "partially-checked-in",
              checkinOpens: "2025-04-29T10:00:00+02:00",
              checkinCloses: "2025-04-30T07:00:00+02:00",
              passengerDetails: [
                { passengerId: "pax-pc-1", ticketNumber: "6641230000001", seat: "12A", luggage: "23 kg", checkedIn: true, boardingPass: { qrCode: "BP-MARKUS-XQ958-12A", gate: "A54" } },
                { passengerId: "pax-pc-2", ticketNumber: "6641230000002", seat: "12B", luggage: "23 kg", checkedIn: true, boardingPass: { qrCode: "BP-NINA-XQ958-12B", gate: "A54" } },
                { passengerId: "pax-pc-3", ticketNumber: "6641230000003", seat: null, luggage: "23 kg", checkedIn: false, boardingPass: null },
                { passengerId: "pax-pc-4", ticketNumber: "6641230000004", seat: null, luggage: "0 kg", checkedIn: false, boardingPass: null },
              ],
            },
          ],
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════
  // SZENARIO 5: Probleme (Storniert + Geschlossen)
  // ══════════════════════════════════════════════════════
  problems: {
    id: "problems",
    label: "Probleme — Storniert & Geschlossen",
    booking: {
      airtuerkRef: "881204",
      createdAt: "2025-01-10",
      contactEmail: "domagoj@email.de",
      contactPhone: "+49 174 8889990",
      passengers: [
        { id: "pax-pr-1", title: "Herr", firstName: "Domagoj", lastName: "Budimlic", type: "adult", dateOfBirth: "1988-05-20", nationality: "HR", documentNumber: null, specialNeeds: [] },
        { id: "pax-pr-2", title: "Frau", firstName: "Karanamliu", lastName: "Budimlic", type: "adult", dateOfBirth: "1991-03-08", nationality: "HR", documentNumber: null, specialNeeds: [] },
      ],
      trips: [
        {
          id: "trip-pr-1",
          direction: "outbound",
          origin: { code: "FRA", city: "Frankfurt", country: "DE" },
          destination: { code: "HER", city: "Heraklion", country: "GR" },
          segments: [
            {
              id: "seg-pr-1",
              airline: { name: "Turkish Airlines", code: "TK", logo: "https://logo.clearbit.com/turkishairlines.com", colors: ["#C70A0C", "#C70A0C"] },
              flightNumber: "TK715",
              aircraft: "Airbus A321",
              cabinClass: "Economy",
              duration: "2h 30min",
              departure: { airport: "Frankfurt", code: "FRA", terminal: "1", gate: null, date: "2025-04-28", time: "21:35", timezone: "Europe/Berlin" },
              arrival: { airport: "Heraklion", code: "HER", terminal: null, date: "2025-04-29", time: "00:25", timezone: "Europe/Athens" },
              airlinePNR: "C2W5VR",
              status: "checkin-closed",
              checkinOpens: "2025-04-27T21:35:00+02:00",
              checkinCloses: "2025-04-28T18:35:00+02:00",
              passengerDetails: [
                { passengerId: "pax-pr-1", ticketNumber: "9643930343441", seat: "2A", luggage: "23 kg", checkedIn: false, boardingPass: null },
                { passengerId: "pax-pr-2", ticketNumber: "9643930343442", seat: null, luggage: "23 kg", checkedIn: false, boardingPass: null },
              ],
            },
          ],
        },
        {
          id: "trip-pr-2",
          direction: "return",
          origin: { code: "HER", city: "Heraklion", country: "GR" },
          destination: { code: "FRA", city: "Frankfurt", country: "DE" },
          segments: [
            {
              id: "seg-pr-2",
              airline: { name: "Lufthansa", code: "LH", logo: "https://logo.clearbit.com/lufthansa.com", colors: ["#05164D", "#05164D"] },
              flightNumber: "LH903",
              aircraft: "Airbus A320",
              cabinClass: "Economy",
              duration: "3h 30min",
              departure: { airport: "Heraklion", code: "HER", terminal: null, gate: null, date: "2025-05-05", time: "21:35", timezone: "Europe/Athens" },
              arrival: { airport: "Frankfurt", code: "FRA", terminal: "1", date: "2025-05-06", time: "00:25", timezone: "Europe/Berlin" },
              airlinePNR: "C2W5VR",
              status: "cancelled",
              cancellationReason: "Airline hat den Flug gestrichen",
              alternativeFlights: ["LH905 am 06.05.2025 08:15"],
              checkinOpens: null,
              checkinCloses: null,
              passengerDetails: [
                { passengerId: "pax-pr-1", ticketNumber: "9643930343441", seat: null, luggage: "23 kg", checkedIn: false, boardingPass: null },
                { passengerId: "pax-pr-2", ticketNumber: "9643930343442", seat: null, luggage: "23 kg", checkedIn: false, boardingPass: null },
              ],
            },
          ],
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════
  // SZENARIO 6: Alles erledigt (alle eingecheckt)
  // ══════════════════════════════════════════════════════
  allDone: {
    id: "allDone",
    label: "Alles erledigt — Bordkarten bereit",
    booking: {
      airtuerkRef: "554780",
      createdAt: "2025-04-01",
      contactEmail: "lisa@email.de",
      contactPhone: "+49 175 1112233",
      passengers: [
        { id: "pax-ad-1", title: "Frau", firstName: "Lisa", lastName: "Braun", type: "adult", dateOfBirth: "1995-11-28", nationality: "DE", documentNumber: "C05X88P12", specialNeeds: [] },
        { id: "pax-ad-2", title: "Herr", firstName: "Tom", lastName: "Braun", type: "adult", dateOfBirth: "1993-06-03", nationality: "DE", documentNumber: "C06X88P13", specialNeeds: [] },
      ],
      trips: [
        {
          id: "trip-ad",
          direction: "outbound",
          origin: { code: "MUC", city: "München", country: "DE" },
          destination: { code: "BCN", city: "Barcelona", country: "ES" },
          segments: [
            {
              id: "seg-ad",
              airline: { name: "Pegasus", code: "PC", logo: "https://logo.clearbit.com/flypgs.com", colors: ["#003580", "#FFB800"] },
              flightNumber: "PC1220",
              aircraft: "Airbus A320neo",
              cabinClass: "Economy",
              duration: "2h 15min",
              departure: { airport: "München", code: "MUC", terminal: "1", gate: "G28", date: "2025-05-01", time: "08:45", timezone: "Europe/Berlin" },
              arrival: { airport: "Barcelona", code: "BCN", terminal: "1", date: "2025-05-01", time: "11:00", timezone: "Europe/Madrid" },
              airlinePNR: "PGSBCN",
              status: "checked-in",
              checkinOpens: "2025-04-30T08:45:00+02:00",
              checkinCloses: "2025-05-01T05:45:00+02:00",
              passengerDetails: [
                { passengerId: "pax-ad-1", ticketNumber: "8801234567001", seat: "6A", luggage: "23 kg", checkedIn: true, boardingPass: { qrCode: "BP-LISA-PC1220-6A", gate: "G28" } },
                { passengerId: "pax-ad-2", ticketNumber: "8801234567002", seat: "6B", luggage: "23 kg", checkedIn: true, boardingPass: { qrCode: "BP-TOM-PC1220-6B", gate: "G28" } },
              ],
            },
          ],
        },
      ],
    },
  },
};

// ─── EXTRAS KATALOG ─────────────────────────────────
export const extrasCatalog = {
  luggage: [
    { id: "lug-15", name: "+15 kg", description: "Aufgabegepäck, pro Person/Strecke", price: 29.90 },
    { id: "lug-23", name: "+23 kg", description: "Aufgabegepäck, pro Person/Strecke", price: 39.90 },
    { id: "lug-32", name: "+32 kg", description: "Aufgabegepäck, pro Person/Strecke", price: 59.90 },
    { id: "lug-sport", name: "Sportgepäck", description: "Surfboard, Ski, Golfbag etc.", price: 49.90 },
  ],
  meals: [
    { id: "meal-1", name: "Chicken with Rice", description: "Gegrilltes Hähnchen mit Basmatireis", price: 14.00, emoji: "\u{1F357}", popular: true },
    { id: "meal-2", name: "Pasta Marinara", description: "Penne mit Tomaten-Basilikum-Sauce", price: 12.00, emoji: "\u{1F35D}" },
    { id: "meal-3", name: "Vegetarian Wrap", description: "Gemüse mit Hummus im Tortilla-Wrap", price: 10.00, emoji: "\u{1F32F}" },
    { id: "meal-4", name: "Caesar Salad", description: "Römersalat, Parmesan, Croutons", price: 11.00, emoji: "\u{1F957}" },
    { id: "meal-5", name: "Kids Menü", description: "Mini-Burger mit Pommes und Saft", price: 8.00, emoji: "\u{1F354}" },
    { id: "meal-6", name: "Snack Box", description: "Sandwich, Muffin und Getränk", price: 6.00, emoji: "☕" },
  ],
  seatPricing: { standard: 0, front: 5, exit: 15 },
};

// ─── CROSS-SELL OFFERS ──────────────────────────────
export const crossSellOffers = [
  { id: "offer-1", title: "SunPriority", subtitle: "Weniger Warteschlangen und schneller Service.", cta: "Jetzt Hinzufügen", provider: "SunExpress", color: "#F97316" },
  { id: "offer-2", title: "Mietwagen ab 23 € in HER", subtitle: "Hol dir deinen Mietwagen in Heraklion für eine entspannte Reise.", cta: "mietwagen.de", provider: "mietwagen.de", color: "#111827" },
  { id: "offer-3", title: "Premium Upgrade", subtitle: "Weniger Warteschlangen und schneller Service.", cta: "Jetzt Hinzufügen", provider: "Singapore Airlines", color: "#1E3A5F" },
];

// ─── DEFAULT-SZENARIO ───────────────────────────────
export const defaultScenario = "family";

// ─── HELPER: Passagier aus Booking finden ───────────
export const getPassenger = (booking, passengerId) =>
  booking.passengers.find((p) => p.id === passengerId);

// ─── HELPER: Check-in Status berechnen ──────────────
export const getSegmentCheckinSummary = (segment) => {
  const total = segment.passengerDetails.length;
  const checkedIn = segment.passengerDetails.filter((p) => p.checkedIn).length;
  if (checkedIn === 0) return { checkedIn: 0, total, label: "none" };
  if (checkedIn === total) return { checkedIn, total, label: "all" };
  return { checkedIn, total, label: "partial" };
};

// ─── HELPER: Segment-Passagiere mit Booking-Daten mergen ─
export const mergePassengers = (booking, segment) =>
  segment.passengerDetails.map((pd) => {
    const pax = getPassenger(booking, pd.passengerId);
    return {
      id: pd.passengerId,
      title: pax?.title ?? "",
      firstName: pax?.firstName ?? "",
      lastName: pax?.lastName ?? "",
      type: pax?.type ?? "adult",
      ticketNumber: pd.ticketNumber,
      seat: pd.seat,
      luggage: pd.luggage,
      checkedIn: pd.checkedIn,
      hasWheelchair: pax?.specialNeeds?.includes("wheelchair_assistance") ?? false,
    };
  });

// ─── HELPER: Alle Segmente aus einem Booking flach ──
export const flattenSegments = (booking) =>
  booking.trips.flatMap((trip) =>
    trip.segments.map((seg) => ({ ...seg, tripDirection: trip.direction }))
  );

// ─── HELPER: Datum aus ISO formatieren ──────────────
export const formatCheckinDate = (isoString) => {
  if (!isoString) return null;
  const d = new Date(isoString);
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
};
