export interface Place {
  name: string;
  id: string;
  types: string[];
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  formattedAddress: string;
  addressComponents: AddressComponent[];
  plusCode?: PlusCode;
  location: Location;
  viewport: Viewport;
  rating: number;
  googleMapsUri: string;
  websiteUri?: string;
  regularOpeningHours?: OpeningHours;
  utcOffsetMinutes: number;
  adrFormatAddress: string;
  businessStatus: string;
  userRatingCount: number;
  iconMaskBaseUri: string;
  iconBackgroundColor: string;
  displayName: DisplayName;
  primaryTypeDisplayName: DisplayName;
  currentOpeningHours?: OpeningHours;
  primaryType: string;
  shortFormattedAddress: string;
  editorialSummary?: EditorialSummary;
  reviews: Review[];
  photos: Photo[];
  goodForChildren?: boolean;
  accessibilityOptions?: AccessibilityOptions;
  paymentOptions?: PaymentOptions;
  restroom?: boolean;
}

// Sub-interfaces for the details
interface AddressComponent {
  longText: string;
  shortText: string;
  types: string[];
  languageCode: string;
}

interface PlusCode {
  globalCode: string;
  compoundCode: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface Viewport {
  low: Location;
  high: Location;
}

interface OpeningHours {
  openNow: boolean;
  periods: Period[];
  weekdayDescriptions: string[];
}

interface Period {
  open: DayTime;
  close?: DayTime;
}

interface DayTime {
  day: number;
  hour: number;
  minute: number;
  date?: DateDetail;
}

interface DateDetail {
  year: number;
  month: number;
  day: number;
}

interface DisplayName {
  text: string;
  languageCode: string;
}

interface EditorialSummary {
  text: string;
  languageCode: string;
}

interface Review {
  name: string;
  rating: number;
  text: TextDetail;
  originalText: TextDetail;
  authorAttribution: AuthorAttribution;
  publishTime: string;
}

interface TextDetail {
  text: string;
  languageCode: string;
}

interface AuthorAttribution {
  displayName: string;
  uri: string;
  photoUri: string;
}

interface Photo {
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions: AuthorAttribution[];
}

interface AccessibilityOptions {
  wheelchairAccessibleParking: boolean;
  wheelchairAccessibleEntrance: boolean;
  wheelchairAccessibleRestroom?: boolean;
  wheelchairAccessibleSeating?: boolean;
}

interface PaymentOptions {
  acceptsCreditCards: boolean;
  acceptsDebitCards: boolean;
  acceptsCashOnly: boolean;
  acceptsNfc: boolean;
}
