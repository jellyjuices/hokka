// Comma-separated, matched as whole words. A name that also prints on other receipts, such
// as a card network, a payment processor or an insurer that sells car cover too, stays out:
// it is a vote for the wrong category every time it appears. So is a store that sells both
// pens and monitors. The prototypes cover the rest.
import type { CategorySignals } from "./classify.types";

export const CATEGORY_SIGNALS: CategorySignals[] = [
  {
    categoryId: "meals",
    vendors: `
      restaurant, cafe, coffee, espresso, bakery, pizza, pizzeria, sushi, burger, grill, kitchen,
      bistro, diner, pub, tavern, brewery, taqueria, noodle, ramen, pho, shawarma, deli, catering,
      eatery, steakhouse, trattoria, osteria, izakaya, tim hortons, starbucks, second cup, balzac,
      aroma espresso, mcdonald, harvey, wendy, taco bell, chipotle, popeyes, kfc, pizza pizza,
      doordash, uber eats, ubereats, skipthedishes, skip the dishes, ritual, fantuan
    `,
    terms: `
      dine in, take out, takeout, server, table, guests, gratuity, appetizer, entree, main course,
      prix fixe, dessert, lunch, dinner, breakfast, brunch, latte, americano, cappuccino, beer,
      wine, cocktail
    `,
  },
  {
    categoryId: "travel",
    vendors: `
      uber, lyft, beck taxi, co op cabs, taxi, via rail, viarail, air canada, westjet,
      porter airlines, flyporter, flair airlines, air transat, sunwing, airbnb, expedia,
      booking com, hotels com, hotel, motel, marriott, hilton, hyatt, sheraton, westin, fairmont,
      holiday inn, best western, presto, ttc, go transit, metrolinx, up express, oc transpo,
      megabus, flixbus, ontario northland
    `,
    terms: `
      flight, boarding pass, baggage, fare, one way, departure, arrival, itinerary, e ticket,
      room night, check in, check out, folio, accommodation tax, nights
    `,
  },
  {
    categoryId: "vehicle",
    vendors: `
      esso, petro canada, shell, pioneer, ultramar, mobil, circle k, sunoco, husky, chevron,
      macewen, olco, costco gas, canadian tire gas, gas bar, mr lube, jiffy lube, midas,
      speedy auto, kal tire, ok tire, active green ross, auto repair, car repair, 407 etr, green p,
      impark, indigo park, precise parklink, honkmobile, paybyphone, flo, chargepoint,
      electrify canada, ivy charging
    `,
    terms: `
      fuel, gasoline, unleaded, diesel, litres, litre, pump, parking, toll charge, toll road,
      camera charge, oil change, tire, alignment, brake, windshield repair, windshield, auto glass,
      car wash, auto insurance, car insurance,
      opcf, licence plate, plate sticker, ev charging, charging session
    `,
  },
  {
    categoryId: "telephone_utilities",
    vendors: `
      rogers, bell, telus, fido, koodo, virgin plus, freedom mobile, chatr, lucky mobile,
      public mobile, fizz, teksavvy, start ca, distributel, cogeco, beanfield, oxio, carrytel,
      videotron, eastlink
    `,
    terms: `
      wireless, mobile plan, cell phone, cellphone, talk and text, data plan, long distance,
      roaming, internet, fibre, fiber, modem, mbps, gbps, landline, home phone
    `,
  },
  {
    categoryId: "business_use_of_home",
    vendors: `
      hydro one, toronto hydro, alectra, hydro ottawa, london hydro, elexicon, enova power,
      oakville hydro, burlington hydro, entegrus, enbridge, reliance home comfort, enercare
    `,
    terms: `
      electricity, kwh, kilowatt, natural gas, heating, furnace, water heater, wastewater, sewer,
      water bill, property tax, tax bill, roll number, mortgage, home insurance, tenant insurance,
      condo insurance, landlord, rent receipt, condo fees
    `,
  },
  {
    categoryId: "office_expenses",
    vendors: `
      adobe, figma, github, gitlab, bitbucket, atlassian, jira, linear, notion, slack, zoom, loom,
      miro, canva, framer, webflow, sketch, spline, google workspace, google cloud, microsoft 365,
      office 365, dropbox, 1password, bitwarden, lastpass, aws, amazon web services, vercel,
      netlify, cloudflare, digitalocean, heroku, render com, fly io, supabase, firebase, openai,
      anthropic, midjourney, cursor, jetbrains, raycast, setapp, namecheap, godaddy, porkbun,
      hover, squarespace, wix, wordpress, shopify, mailchimp, calendly, apple com bill, itunes,
      app store, google one, quickbooks, freshbooks, canada post
    `,
    terms: `
      subscription, monthly plan, annual plan, per seat, per user, editor seat, billing period,
      auto renew, domain, dns, whois, hosting, cloud server, virtual server, dedicated server,
      compute, egress, bandwidth, vcpu, api usage, saas, licence key, license key, pen,
      printer paper, copy paper, envelope, postage, stamp, ink cartridge, toner, stationery,
      notebook
    `,
  },
  {
    categoryId: "capital_cost_allowance",
    vendors: `
      canada computers, memory express, memoryexpress, newegg, best buy, visions electronics,
      the source, henry s, vistek, b h photo, adorama, dell, lenovo, logitech, herman miller,
      steelcase, haworth, humanscale, autonomous, eq3, structube, ikea, wayfair
    `,
    terms: `
      laptop, macbook, imac, mac mini, desktop computer, notebook computer, monitor, display,
      keyboard, mouse, webcam, headphones, microphone, camera, lens, tripod, gimbal, light stand,
      softbox, printer, scanner, hard drive, ssd, nas, docking station, tablet, ipad,
      standing desk, desk, office chair, chair, bookshelf, filing cabinet, applecare
    `,
  },
  {
    categoryId: "interest_bank_charges",
    vendors: "",
    terms: `
      bank fee, account fee, e transfer fee, nsf, overdraft, interest charge, annual fee,
      cash advance fee, processing fee, transaction fee, transfer fee, wire fee, exchange fee,
      foreign exchange fee, payout fee, merchant fee
    `,
  },
  {
    categoryId: "professional_fees",
    vendors: `
      cpa, chartered professional accountant, accounting, accountant, bookkeeping, bookkeeper, llp,
      barristers, solicitors, law office, law firm, notary, paralegal, wealthsimple tax, turbotax,
      h r block, ufile, studiotax, taxtron, genutax
    `,
    terms: `
      tax return, tax preparation, t1, t2125, hst return, reconciliation, legal fee, legal advice,
      legal services, contract review, trademark, disbursements, notarization,
      professional services
    `,
  },
  {
    categoryId: "business_taxes_fees",
    vendors: `
      ontario business registry, serviceontario, board of trade, chamber of commerce, rgd, aiga,
      ixda, uxpa, freelancers union, canadian freelance union
    `,
    terms: `
      business name registration, business licence, business license, master business licence,
      membership dues, annual dues, association fee, professional membership, magazine, journal,
      periodical, trade publication
    `,
  },
  {
    categoryId: "insurance",
    vendors: "zensurance, apollo insurance, apollocover, trisura, northbridge",
    terms: `
      professional liability, errors and omissions, e o insurance, commercial general liability,
      general liability, cgl, cyber liability, business insurance, commercial insurance,
      certificate of insurance
    `,
  },
  {
    categoryId: "advertising",
    vendors: `
      google ads, meta ads, facebook ads, instagram ads, linkedin ads, x ads, tiktok ads,
      reddit ads, microsoft advertising, vistaprint, moo, awwwards, css design awards, the fwa,
      carbon ads, buysellads
    `,
    terms: `
      advertising, ad campaign, campaign, impressions, clicks, cost per click, cpc, cpm,
      boosted post, sponsored, sponsorship, promoted, business cards, flyers, postcards, banner,
      signage, display ad, award submission
    `,
  },
  {
    categoryId: "other",
    vendors: `
      udemy, coursera, skillshare, domestika, frontend masters, egghead, pluralsight,
      linkedin learning, masterclass, interaction design foundation, designlab, o reilly, manning,
      a book apart, indigo, chapters, coles, kobo, audible, eventbrite, luma, tito, fitc
    `,
    terms: `
      course, workshop, bootcamp, webinar, conference, summit, meetup, conference ticket,
      event ticket, admission, book, ebook, paperback, hardcover, isbn, tuition
    `,
  },
  {
    categoryId: "rent",
    vendors: `
      wework, regus, iwg, centre for social innovation, staples studio, industrious, workhaus
    `,
    terms: `
      coworking, co working, hot desk, dedicated desk, flex desk, private office, day pass,
      meeting room, office rent, office lease, studio rent
    `,
  },
  {
    categoryId: "maintenance",
    vendors: "ubreakifix, geek squad, easytech, repair",
    terms: `
      screen replacement, battery replacement, battery service, diagnostic, refurbish,
      logic board, water damage
    `,
  },
];
