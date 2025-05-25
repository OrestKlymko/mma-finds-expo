/* Utility functions for unit conversions between metric and imperial systems */

/**
 * Converts centimeters to feet and inches.
 * @param cm - value in centimeters
 * @returns object with feet and inches (inches rounded to 2 decimal places)
 */
export function cmToFeetInches(cm: number): { feet: number; inches: number } {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = parseFloat((totalInches - feet * 12).toFixed(2));
    return { feet, inches };
}

/**
 * Converts feet and inches to centimeters.
 * @param feet - whole feet component
 * @param inches - inches component
 * @returns value in centimeters (rounded to 2 decimal places)
 */
export function feetInchesToCm(feet: number, inches: number): number {
    const cm = (feet * 12 + inches) * 2.54;
    return parseFloat(cm.toFixed(2));
}

/**
 * Converts kilograms to pounds.
 * @param kg - value in kilograms
 * @returns value in pounds (rounded to 2 decimal places)
 */
export function kgToLbs(kg: number): number {
    const lbs = kg * 2.2046226218;
    return parseFloat(lbs.toFixed(2));
}

/**
 * Converts pounds to kilograms.
 * @param lbs - value in pounds
 * @returns value in kilograms (rounded to 2 decimal places)
 */
export function lbsToKg(lbs: number): number {
    const kg = lbs / 2.2046226218;
    return parseFloat(kg.toFixed(2));
}

/**
 * Example usage before sending data to backend:
 *
 * import { cmToFeetInches, feetInchesToCm } from '@/utils/unitConversion';
 *
 * if (heightUnit === 'cm') {
 *   const { feet, inches } = cmToFeetInches(Number(heightValue));
 *   // use feet, inches in payload
 * } else {
 *   const cm = feetInchesToCm(Number(heightFeet), Number(heightInches));
 *   // use cm in payload
 * }
 */
