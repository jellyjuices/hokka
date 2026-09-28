// Short receipt-shaped sentences, one per kind of document a category receives. A receipt is
// scored against the nearest one, so a gas bill never has to read like a property tax bill to
// land in Home office. A category missing here is never guessed: a bad debt, a prepaid plan or
// a box of supplies cannot be told from the receipt alone.
export const CATEGORY_EXAMPLES: Record<string, string[]> = {
  client_work: [
    "Invoice to a client for design and development work: hours, hourly rate, subtotal, HST, amount due, payment terms.",
    "Monthly retainer invoice billed to a client company for consulting or UX design services.",
    "Invoice for a project milestone delivered to a client, payable by e-Transfer or cheque.",
  ],
  business_use_of_home: [
    "Electricity bill from the local hydro company: kilowatt hours, on-peak and off-peak charges, delivery charge, regulatory charge.",
    "Natural gas or heating oil bill for the home: gas supply, delivery and customer charges.",
    "Water, sewer and wastewater utility bill for the home.",
    "Property tax bill for the home from the city or municipality.",
    "Home, condo or tenant insurance policy for the place you live, with contents and personal liability coverage.",
    "Monthly rent paid to a landlord for the apartment or house you live in.",
    "Mortgage statement showing the interest paid on the house.",
  ],
  telephone_utilities: [
    "Cell phone bill from a wireless carrier: monthly plan, talk and text, data in GB, device financing, roaming.",
    "Home internet bill: fibre or cable internet plan, speed in Mbps or Gbps, modem rental, monthly service.",
  ],
  vehicle: [
    "Gas station receipt: regular or premium unleaded, litres, price per litre, pump number.",
    "Car maintenance and repair: oil change, filters, tires, brakes, windshield, alignment, car wash, labour.",
    "Auto insurance policy for a car, with the vehicle year, make, model and VIN.",
    "Parking receipt with entry and exit time, or a highway toll bill for trips taken.",
    "Electric vehicle charging session at a public charger, energy delivered in kilowatt hours.",
    "Car lease or car loan payment, or a vehicle licence and registration renewal.",
  ],
  travel: [
    "Public transit fare: subway, streetcar, bus, commuter train or airport rail link, one-way or return.",
    "Intercity train or coach bus ticket with departure time and seat.",
    "Flight booking: airline, fare, taxes and fees, baggage, boarding.",
    "Hotel stay for a work trip: nights, room rate, accommodation tax, check-in, check-out.",
    "Taxi or rideshare trip: distance, fare, tip.",
  ],
  meals: [
    "Restaurant bill: table, server, entrees, drinks, gratuity.",
    "Café receipt: coffee, espresso, latte, tea, muffin, pastry.",
    "Food delivery or takeout order with a delivery fee and service fee.",
    "Bar tab: wine, beer, cocktails, snacks.",
    "Order of dishes: dumplings, noodles, soup, rice bowl, sandwich, salad, tacos, curry.",
  ],
  capital_cost_allowance: [
    "Computer purchase: laptop, desktop computer, tablet, extended warranty.",
    "Computer monitor, keyboard, mouse, docking station, external drive or network storage.",
    "Camera gear: camera body, lens, lighting, tripod, microphone.",
    "Office furniture: desk, standing desk, office chair, shelving, filing cabinet.",
  ],
  office_expenses: [
    "Software subscription receipt: plan, seats, billing period, monthly or annual, renews automatically.",
    "Cloud hosting and compute invoice: servers, storage, bandwidth, usage charges.",
    "Developer platform usage bill: plan, compute hours, memory, network egress, API calls.",
    "Domain name registration or renewal, DNS, email hosting.",
    "Office stationery: pens, paper, notebooks, printer ink, postage stamps, envelopes.",
  ],
  interest_bank_charges: [
    "Bank account service charges: monthly account fee, e-Transfer fees, NSF fee, overdraft interest.",
    "Payment processor fees taken from card payments you received: processing fee, net amount.",
    "Money transfer or currency exchange fee on an international transfer.",
    "Credit card statement: interest charges, annual fee.",
  ],
  professional_fees: [
    "Accountant's invoice: tax return preparation, bookkeeping, HST return filing, financial statements.",
    "Bookkeeper's monthly invoice: bookkeeping, bank reconciliation, payroll.",
    "Law firm invoice from barristers and solicitors: contract review, legal advice, hours, disbursements.",
    "Tax filing software purchase for a personal and business tax return.",
  ],
  business_taxes_fees: [
    "Business name registration or municipal business licence fee.",
    "Annual membership dues for a professional association, trade association or board of trade.",
    "Subscription to a trade magazine or industry publication.",
  ],
  insurance: [
    "Business insurance policy: professional liability, errors and omissions, commercial general liability, certificate of insurance, premium.",
  ],
  advertising: [
    "Online advertising invoice: ad campaign, clicks, impressions, cost per click, boosted or sponsored posts.",
    "Printed marketing: business cards, flyers, postcards, banners.",
    "Newsletter or podcast sponsorship, directory listing or award submission to promote the business.",
  ],
  other: [
    "Online course or workshop enrolment to learn a skill.",
    "Online learning platform: video courses, lessons, lifetime access, certificate.",
    "Conference or meetup ticket, full pass, general admission.",
    "Bookstore purchase: book titles, paperback, hardcover, ebook.",
  ],
  rent: [
    "Coworking space membership: hot desk, dedicated desk, private office, day pass, meeting room booking.",
    "Lease payment for a commercial office or studio space.",
  ],
  maintenance: [
    "Repair shop receipt for a laptop, phone, tablet or camera: parts and labour, screen or battery replacement, diagnostic fee.",
    "Service or cleaning of work equipment, or a refurbishment.",
  ],
};
