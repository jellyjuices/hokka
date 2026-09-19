export type CategorySignals = {
  categoryId: string;
  vendors: string[];
  terms: string[];
};

function keywords(list: string) {
  return list
    .split(/[,\n]/)
    .map((word) => word.trim().toLowerCase())
    .filter((word) => word !== "");
}

export const CATEGORY_SIGNALS: CategorySignals[] = [
  {
    categoryId: "meals",
    vendors: keywords(`
      restaurant, cafe, café, coffee, espresso, bakery, pizza, pizzeria, sushi, burger, grill,
      kitchen, bistro, diner, pub, tavern, brewery, taqueria, noodle, ramen, shawarma, deli,
      catering, eatery, steakhouse, juice bar, tim hortons, starbucks, mcdonald, second cup, a&w,
      wendy, chipotle, doordash, ubereats, uber eats, skipthedishes, skip the dishes, foodora
    `),
    terms: keywords(`
      dine in, dine-in, take out, take-out, server, table, gratuity, beverage, appetizer, entree,
      dessert, lunch, dinner, breakfast, latte, americano
    `),
  },
  {
    categoryId: "travel",
    vendors: keywords(`
      uber, lyft, taxi, cab co, via rail, viarail, air canada, westjet, porter airlines,
      flair airlines, airbnb, hotel, motel, marriott, hilton, esso, petro-canada, petro canada,
      shell, ultramar, chevron, husky, circle k, mobil, parking, green p, impark, presto, ttc,
      go transit, hertz, enterprise rent, budget car, avis
    `),
    terms: keywords(`
      fuel, gasoline, unleaded, diesel, litres, flight, boarding, baggage, fare, mileage, toll,
      room night, check-in, check out
    `),
  },
  {
    categoryId: "software",
    vendors: keywords(`
      adobe, figma, github, gitlab, google workspace, google cloud, openai, anthropic, notion,
      slack, zoom, dropbox, aws, amazon web services, vercel, netlify, cloudflare, namecheap,
      godaddy, squarespace, wix, linear, atlassian, jetbrains, microsoft 365, office 365,
      apple.com/bill, itunes, app store, framer, sketch, webflow, quickbooks, freshbooks
    `),
    terms: keywords(`
      subscription, monthly plan, annual plan, renewal, licence, license, seat, domain, hosting,
      api usage, saas, plan upgrade
    `),
  },
  {
    categoryId: "hardware",
    vendors: keywords(`
      apple store, best buy, canada computers, memory express, memoryexpress, newegg,
      micro center, the source, logitech, dell, lenovo, anker
    `),
    terms: keywords(`
      monitor, laptop, macbook, keyboard, mouse, ssd, nvme, hard drive, webcam, headphones,
      printer, usb-c, adapter, docking, graphics card, display, ipad, iphone, charger
    `),
  },
  {
    categoryId: "home_office",
    vendors: keywords(`
      staples, office depot, grand & toy, grand and toy, ikea, wayfair, structube, bell canada,
      rogers, telus, hydro one, toronto hydro, enbridge
    `),
    terms: keywords(`
      desk, office chair, shelving, stationery, notebook, binder, envelopes, printer paper,
      internet, utilities, storage bin, filing
    `),
  },
  {
    categoryId: "professional",
    vendors: keywords(`
      law office, barrister, solicitor, notary, accounting, accountant, bookkeeping, bookkeeper,
      chartered professional, consulting, advisory, insurance, broker
    `),
    terms: keywords(`
      legal fee, professional fee, retainer, audit, membership dues, association fee, licence fee,
      payroll service, incorporation, registration fee
    `),
  },
];
