import {CurrencyCode} from 'react-native-country-picker-modal';
import {Benefit, BenefitsSelection} from "@/service/response";


export const countDaysForAcceptance = (
    date: string | number[] | null | undefined,
): number => {
  if (!date) return 0;

  let eventDate: Date;

  if (Array.isArray(date)) {
    const [year, month, day] = date;
    eventDate = new Date(year, month - 1, day);
  } else {
    eventDate = new Date(date);

    if (isNaN(eventDate.getTime())) {
      eventDate = new Date(`${date}T00:00:00`);
    }
  }

  const today = new Date();

  eventDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffMs = eventDate.getTime() - today.getTime();
  return Math.ceil(diffMs / 86_400_000);
};


export const formatDate = (date: Date | null) => {
  if (!date) return '';
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export const getCurrencySymbol = (currencyCode: CurrencyCode | undefined) => {
  if (!currencyCode) currencyCode = 'EUR';
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currencyCode,
  })
    .format(0)
    .replace(/\d/g, '')
    .trim()
    .replace(/\s/g, '')
    .replace('.', '');
};

export const formatDateFromLocalDate = (date: string | number[] | undefined) => {
  if (!date) return '';

  let parsedDate: Date;

  if (Array.isArray(date)) {
    const [year, month, day] = date;
    parsedDate = new Date(year, month - 1, day);
  } else {
    parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      parsedDate = new Date(`${date}T00:00:00`);
    }
  }

  return parsedDate.toLocaleDateString('en-GB').replace(/\//g, '.'); // e.g., 25.05.2026
};


export const formatDateForBackend = (date: string): string => {
  const [day, month, year] = date.split(/[.\-/]/);
  const dd = day.padStart(2, '0');
  const mm = month.padStart(2, '0');
  return `${year}-${mm}-${dd}`;
};


export const formatTime = (
  startTime: string,
  endTime: string,
  date: string,
) => {
  const day = new Date(date).toLocaleDateString('en-US', {weekday: 'long'});
  return `${day}, ${startTime} - ${endTime} CET`;
};

export const renderBenefitList = (b: Benefit) => {
  const items: string[] = [];
  if (b.foodBreakfast) items.push('Breakfast Included');
  if (b.foodFullBoard) items.push('Full board Included');
  if (b.foodHalfBoard) items.push('Half board Included');
  if (b.foodNone) items.push('No Food Coverage');
  if (b.foodDailyAllowance && Number(b.foodDailyAllowance) > 0) {
    items.push(`Daily Allowance: ${b.foodDailyAllowance}`);
  }
  if (b.peopleCovered) items.push(`People Covered: ${b.peopleCovered}`);

  if (b.hotelAccommodationIsOn) {
    items.push('Hotel Accommodation Provided');
    if (b.hotelAccommodationNumberOfNights) {
      items.push(`${b.hotelAccommodationNumberOfNights} Night(s) Included`);
    }
    if (b.hotelAccommodationRoomsOne) {
      items.push(`Single Rooms: ${b.hotelAccommodationRoomsOne}`);
    }
    if (b.hotelAccommodationRoomsTwo) {
      items.push(`Double Rooms: ${b.hotelAccommodationRoomsTwo}`);
    }
    if (b.hotelAccommodationRoomsThree) {
      items.push(`Triple Rooms: ${b.hotelAccommodationRoomsThree}`);
    }
  }
  if (b.gymAccess) items.push('Gym Access');
  if (b.saunaAccess) items.push('Sauna Access');
  if (b.hotTubAccess) items.push('Hot Tub Access');

  if (b.travelSupportIsOn) {
    items.push('Travel Support Provided');
    if (b.travelSupportFlightTickets) items.push('Flight Tickets Covered');
    if (b.travelSupportExpensesPerKm) {
      items.push(`Expenses Per Km: ${b.travelSupportExpensesPerKm}`);
    }
    if (b.transportFromAirport) items.push('Transport from airport included');
  }
  if (b.additionalTeamMembers && b.additionalTeamMembers > 0) {
    items.push(`Additional Team Members: ${b.additionalTeamMembers}`);
  }
  if (b.customOption) items.push(`Custom Benefits: ${b.customOption}`);

  return items;
};

export const mapBenefitsToCreateBenefit = (
  benefits: BenefitsSelection | undefined,
): (Benefit | undefined) => {
  if (benefits) {
    return {
      additionalTeamMembers: benefits?.additionalTeamMembers,
      customOption: benefits?.customOption,
      foodBreakfast: benefits?.food?.breakfast || false,
      foodDailyAllowance: benefits?.food?.dailyAllowance || '',
      foodFullBoard: benefits?.food?.fullBoard || false,
      foodHalfBoard: benefits?.food?.halfBoard || false,
      foodNone: benefits?.food?.none || false,
      gymAccess: benefits?.gymAccess,
      hotTubAccess: benefits?.hotTubAccess,
      hotelAccommodationIsOn: benefits?.hotelAccommodation?.isOn || false,
      hotelAccommodationNumberOfNights:
        benefits?.hotelAccommodation?.numberOfNights || '',
      hotelAccommodationRoomsOne:
        benefits?.hotelAccommodation?.rooms?.[0] || '',
      hotelAccommodationRoomsTwo:
        benefits?.hotelAccommodation?.rooms?.[1] || '',
      hotelAccommodationRoomsThree:
        benefits?.hotelAccommodation?.rooms?.[2] || '',
      peopleCovered: benefits?.peopleCovered,
      saunaAccess: benefits?.saunaAccess,
      transportFromAirport: benefits?.transportFromAirport,
      travelSupportExpensesPerKm: benefits?.travelSupport?.expensesPerKm || '',
      travelSupportFlightTickets:
        benefits?.travelSupport?.flightTickets || false,
      travelSupportIsOn: benefits?.travelSupport?.isOn || false,
      benefitName: '',
      currency: benefits?.currency || 'EUR',
      maxKmCovered: benefits?.travelSupport?.maxKmCovered?.trim()
        ? parseInt(benefits.travelSupport.maxKmCovered.trim(), 10)
        : 0,
    };
  }
};


// utils/url.ts
export function buildQueryString(params: Record<string, string | null | undefined>): string {
  const entries = Object.entries(params)
      .filter(([, v]) => v != null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v!)}`);
  return entries.length ? `?${entries.join('&')}` : '';
}
