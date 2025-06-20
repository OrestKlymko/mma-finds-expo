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


export const formatDateForBackend = (date: Date): string => {
  if(!date) return '';
  const day = date.getDay();
    const month = (date.getMonth() + 1)<10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const year = date.getFullYear();
    console.log(`${year}-${month}-${day < 10 ? `0${day}` : day}`)
  return `${year}-${month}-${day < 10 ? `0${day}` : day}`; // e.g., 2026-05-25
};


export const formatTime = (
  startTime: string,
  endTime: string,
  date: string,
) => {
  const dateObj = new Date(date[0], date[1] - 1, date[2]);
  const day = dateObj.toLocaleDateString('en-US', {weekday: 'long'});
  return `${day}, ${startTime} - ${endTime} CET`;
};

export const renderBenefitList = (b: Benefit): string[] => {
  const items: string[] = [];

  /* ---------- Food ---------- */
  if (b.foodBreakfast) items.push('Breakfast included');
  if (b.foodHalfBoard) items.push('Half board');
  if (b.foodFullBoard) items.push('Full board');
  if (b.foodNone) items.push('No food coverage');

  if (b.foodDailyAllowance && Number(b.foodDailyAllowance) > 0) {
    items.push(
        `Daily allowance: ${b.foodDailyAllowance} ${b.currency ?? 'EUR'}`
    );
  }

  /* ---------- Attendance ---------- */
  if (b.peopleCovered)
    items.push(`People covered: ${b.peopleCovered.replace('+', ' + ')}`);

  if (b.additionalTeamMembers && b.additionalTeamMembers > 0) {
    items.push(`Additional team members: ${b.additionalTeamMembers}`);
  }

  /* ---------- Hotel ---------- */
  if (b.hotelAccommodationIsOn) {
    if (b.hotelAccommodationNumberOfNights) {
      items.push(
          `Hotel: ${b.hotelAccommodationNumberOfNights} night${
              b.hotelAccommodationNumberOfNights === '1' ? '' : 's'
          }`
      );
    } else {
      items.push('Hotel accommodation provided');
    }

    const addRoom = (count: string | undefined |null, label: string) => {
      if (count && Number(count) > 0) items.push(`${label}: ${count}`);
    };
    addRoom(b.hotelAccommodationRoomsOne, 'Single rooms');
    addRoom(b.hotelAccommodationRoomsTwo, 'Double rooms');
    addRoom(b.hotelAccommodationRoomsThree, 'Triple rooms');
  }

  /* ---------- Travel support ---------- */
  if (b.travelSupportIsOn) {
    const travel: string[] = [];
    if (b.travelSupportFlightTickets) travel.push('flight tickets');
    if (b.travelSupportExpensesPerKm) {
      travel.push(
          `${b.travelSupportExpensesPerKm}${
              b.currency ? ' ' + b.currency : ''
          }/km`
      );
    }
    if (b.maxKmCovered && b.maxKmCovered > 0)
      travel.push(`up to ${b.maxKmCovered} km`);

    items.push(`Travel support: ${travel.join(', ')}`);
  }

  /* ---------- Transport (independent) ---------- */
  if (b.transportFromAirport) items.push('Transport from airport');

  /* ---------- Facilities ---------- */
  if (b.gymAccess) items.push('Gym access');
  if (b.saunaAccess) items.push('Sauna access');
  if (b.hotTubAccess) items.push('Hot-tub access');

  /* ---------- Custom ---------- */
  if (b.customOption?.trim()) items.push(b.customOption.trim());

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
