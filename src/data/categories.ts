import {
  AppWindowIcon,
  BankIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CalendarCheckIcon,
  CarIcon,
  DesktopIcon,
  DeviceMobileIcon,
  DotsThreeCircleIcon,
  ForkKnifeIcon,
  HouseLineIcon,
  IdentificationCardIcon,
  MegaphoneIcon,
  PackageIcon,
  ReceiptXIcon,
  ScalesIcon,
  ShieldCheckIcon,
  TrainIcon,
  WrenchIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { IconName } from "@/src/components/Icon";
import type { CategoryColor } from "@/src/lib/theme";
import type { CategoryClaimablePct, TransactionDirection } from "./domain.types";

export type Category = {
  id: string;
  label: string;
  description: string;
  formLine: string | null;
  direction: TransactionDirection;
  defaultClaimablePct: number;
  color: CategoryColor;
  icon: IconName;
};

// Expense categories are the lines of the CRA's T2125, and formLine names the line a
// category's total is copied to. Prepaid has none: a prepaid cost lands on its own line
// in the year it is used.
export const CATEGORIES: Category[] = [
  {
    id: "client_work",
    label: "Client work",
    description:
      "An invoice a client paid you for design, development, consulting or a monthly retainer.",
    formLine: null,
    direction: "income",
    defaultClaimablePct: 100,
    color: "moss",
    icon: BriefcaseIcon,
  },
  {
    id: "business_use_of_home",
    label: "Home office",
    description:
      "The work share of running your home: rent or mortgage interest, heat, hydro, water, home or tenant insurance, property tax and small home repairs. Base the share on the size of your office compared to your whole home. Mortgage principal never counts.",
    formLine: "9945 Business-use-of-home expenses",
    direction: "expense",
    defaultClaimablePct: 20,
    color: "amber",
    icon: HouseLineIcon,
  },
  {
    id: "telephone_utilities",
    label: "Phone & internet",
    description:
      "The work share of your cell phone plan and home internet. A phone line used only for work counts in full. A home landline's basic monthly fee does not count, but long-distance work calls on it do.",
    formLine: "9220 Telephone and utilities",
    direction: "expense",
    defaultClaimablePct: 50,
    color: "moss",
    icon: DeviceMobileIcon,
  },
  {
    id: "vehicle",
    label: "Vehicle",
    description:
      "Running a car for work: gas or charging, insurance, repairs, oil changes, tires, licence and registration, lease payments, loan interest and 407 tolls. Claim only the work share, backed by a trip log of dates, places and kilometres. Parking at a client site counts in full.",
    formLine: "9281 Motor vehicle expenses",
    direction: "expense",
    defaultClaimablePct: 50,
    color: "rose",
    icon: CarIcon,
  },
  {
    id: "travel",
    label: "Travel",
    description:
      "Getting to clients and overnight work trips: GO train, UP Express, TTC and Presto fares, taxis and rideshares, intercity trains and buses, flights and hotels. Meals on a trip go under Meals.",
    formLine: "9200 Travel expenses",
    direction: "expense",
    defaultClaimablePct: 100,
    color: "sky",
    icon: TrainIcon,
  },
  {
    id: "meals",
    label: "Meals",
    description:
      "Food, drinks and entertainment with clients, or while you work away from home: restaurants, cafés, coffee meetings and food delivery. The CRA lets you claim only 50%.",
    formLine: "8523 Meals and entertainment",
    direction: "expense",
    defaultClaimablePct: 50,
    color: "plum",
    icon: ForkKnifeIcon,
  },
  {
    id: "capital_cost_allowance",
    label: "Equipment",
    description:
      "Gear that lasts more than a year: a computer, monitor, camera, lens, desk, chair or other equipment. You claim the cost a bit each year as capital cost allowance, not all at once.",
    formLine: "9936 Capital cost allowance",
    direction: "expense",
    defaultClaimablePct: 100,
    color: "teal",
    icon: DesktopIcon,
  },
  {
    id: "office_expenses",
    label: "Software",
    description:
      "Software and online services you pay for as you use them: Figma, Adobe, GitHub, hosting, cloud servers, domains, password managers and AI tools. Also small office items that get used up, like pens, paper, ink and stamps.",
    formLine: "8810 Office expenses",
    direction: "expense",
    defaultClaimablePct: 100,
    color: "indigo",
    icon: AppWindowIcon,
  },
  {
    id: "interest_bank_charges",
    label: "Bank fees",
    description:
      "What banks and payment services charge you: business account fees, e-Transfer fees, Stripe, PayPal, Square and Wise fees, currency exchange fees, and interest or annual fees on a credit card you use for business.",
    formLine: "8710 Interest and bank charges",
    direction: "expense",
    defaultClaimablePct: 100,
    color: "slate",
    icon: BankIcon,
  },
  {
    id: "professional_fees",
    label: "Professional fees",
    description:
      "Paying an expert for advice or paperwork: your accountant or bookkeeper, a lawyer who reviews a contract, a trademark filing, and tax software such as Wealthsimple Tax or TurboTax.",
    formLine: "8860 Professional fees",
    direction: "expense",
    defaultClaimablePct: 100,
    color: "slate",
    icon: ScalesIcon,
  },
  {
    id: "business_taxes_fees",
    label: "Licences & dues",
    description:
      "Fees to run the business and belong to your field: business name registration, a municipal business licence, professional association dues, board of trade membership and trade magazine subscriptions. Golf, fitness and dining club dues do not count.",
    formLine: "8760 Business taxes, licences and memberships",
    direction: "expense",
    defaultClaimablePct: 100,
    color: "moss",
    icon: IdentificationCardIcon,
  },
  {
    id: "insurance",
    label: "Insurance",
    description:
      "Insurance for the business itself: professional liability, errors and omissions, general liability, or cover for your work gear. Car insurance goes under Vehicle, and home or tenant insurance under Home office.",
    formLine: "8690 Insurance",
    direction: "expense",
    defaultClaimablePct: 100,
    color: "sky",
    icon: ShieldCheckIcon,
  },
  {
    id: "advertising",
    label: "Advertising",
    description:
      "Paying to get your name out: Google, Meta, LinkedIn and other online ads, promoted posts, newsletter or podcast sponsorships, award submissions, and printed business cards or flyers.",
    formLine: "8521 Advertising",
    direction: "expense",
    defaultClaimablePct: 100,
    color: "rose",
    icon: MegaphoneIcon,
  },
  {
    id: "other",
    label: "Other",
    description:
      "Courses and workshops that sharpen skills you already use, books, and tickets to conferences or meetups. Also anything that fits nowhere else. The CRA allows two conventions a year.",
    formLine: "9270 Other expenses",
    direction: "expense",
    defaultClaimablePct: 100,
    color: "slate",
    icon: DotsThreeCircleIcon,
  },
  {
    id: "rent",
    label: "Office rent",
    description:
      "Rent for a workspace outside your home: a coworking desk, a day pass, or a rented office or studio. Rent for the home you live in goes under Home office.",
    formLine: "8910 Rent",
    direction: "expense",
    defaultClaimablePct: 100,
    color: "amber",
    icon: BuildingOfficeIcon,
  },
  {
    id: "maintenance",
    label: "Repairs",
    description:
      "Fixing work gear so it works like before: a screen or battery repair, servicing a camera, or fixing a printer. An upgrade that makes gear better than new goes under Equipment.",
    formLine: "8960 Repairs and maintenance",
    direction: "expense",
    defaultClaimablePct: 100,
    color: "teal",
    icon: WrenchIcon,
  },
  {
    id: "bad_debts",
    label: "Bad debts",
    description:
      "An invoice you already logged as income that the client will never pay. Claim it in the year you decide it cannot be collected.",
    formLine: "8590 Bad debts",
    direction: "expense",
    defaultClaimablePct: 100,
    color: "rose",
    icon: ReceiptXIcon,
  },
  {
    id: "prepaid_expenses",
    label: "Prepaid",
    description:
      "A plan or service paid up front that runs past the end of this tax year, such as a two-year subscription. Only this year's share counts now; the rest counts in the years it covers.",
    formLine: null,
    direction: "expense",
    defaultClaimablePct: 100,
    color: "indigo",
    icon: CalendarCheckIcon,
  },
  {
    id: "supplies",
    label: "Supplies",
    description:
      "Materials used up while doing client work, like print stock, props for a shoot or art supplies. Small office items like pens, paper and stamps go under Software instead.",
    formLine: "8811 Office stationery and supplies",
    direction: "expense",
    defaultClaimablePct: 100,
    color: "plum",
    icon: PackageIcon,
  },
];

// Rows saved before the move to the T2125 lines still carry the old ids until the migration reaches them.
const LEGACY_CATEGORY_IDS: Record<string, string> = {
  software: "office_expenses",
  hardware: "capital_cost_allowance",
  home_office: "business_use_of_home",
  professional: "professional_fees",
};

export function canonicalCategoryId(categoryId: string) {
  return LEGACY_CATEGORY_IDS[categoryId] ?? categoryId;
}

export function findCategory(categoryId: string) {
  const id = canonicalCategoryId(categoryId);
  return CATEGORIES.find((category) => category.id === id) ?? null;
}

export function categoriesFor(direction: TransactionDirection) {
  return CATEGORIES.filter((category) => category.direction === direction);
}

export function clampClaimablePct(value: number) {
  return Math.min(100, Math.max(0, value));
}

export function claimablePctFor(categoryId: string, overrides: CategoryClaimablePct) {
  const override = overrides[canonicalCategoryId(categoryId)];
  if (typeof override === "number" && Number.isFinite(override)) return clampClaimablePct(override);
  return findCategory(categoryId)?.defaultClaimablePct ?? 100;
}
