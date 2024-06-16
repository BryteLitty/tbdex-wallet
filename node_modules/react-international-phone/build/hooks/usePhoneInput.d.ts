/// <reference types="react" />
import { CountryData, CountryIso2 } from '../types';
export declare const MASK_CHAR = ".";
export interface UsePhoneInputConfig {
    /**
     * @description Default country value (iso2).
     * @default "us"
     */
    defaultCountry?: CountryIso2;
    /**
     * @description phone value
     * @default ""
     */
    value?: string;
    /**
     * @description Array of available countries for guessing
     * @default defaultCountries // full country list
     */
    countries?: CountryData[];
    /**
     * @description Prefix for phone value.
     * @default "+"
     */
    prefix?: string;
    /**
     * @description This mask will apply on countries that does not have specified mask.
     * @default "............" // 12 chars
     */
    defaultMask?: string;
    /**
     * @description Char that renders after country dial code.
     * @default " "
     */
    charAfterDialCode?: string;
    /**
     * @description
     * Save value to history if there were not any changes in provided milliseconds timeslot.
     * Undo/redo (ctrl+z/ctrl+shift+z) works only with values that are saved in history.
     * @default 200
     */
    historySaveDebounceMS?: number;
    /**
     * @description Disable country guess on value change.
     * @default false
     */
    disableCountryGuess?: boolean;
    /**
     * @description
     * Disable dial code prefill on initialization.
     * Dial code prefill works only when "empty" phone value have been provided.
     * @default false
     */
    disableDialCodePrefill?: boolean;
    /**
     * @description
     * Always display the dial code.
     * Dial code can't be removed/changed by keyboard events, but it can be changed by pasting another country phone value.
     * @default false
     */
    forceDialCode?: boolean;
    /**
     * @description Phone value will not include passed *dialCode* and *prefix* if set to *true*.
     * @ignore
     * - *disableCountryGuess* value will be ignored and set to *true*.
     * - *forceDialCode* value will be ignored and set to *false*.
     * @default false
     */
    disableDialCodeAndPrefix?: boolean;
    /**
     * @description Callback that calls on phone change
     * @params new phone input state
     * - *data.phone* - new phone value
     * - *data.country* - new country value
     * @default undefined
     */
    onChange?: (data: {
        phone: string;
        country: CountryIso2;
    }) => void;
}
export declare const defaultConfig: Required<Omit<UsePhoneInputConfig, 'onChange'>>;
export declare const usePhoneInput: ({ defaultCountry, value, countries, prefix, defaultMask, charAfterDialCode, historySaveDebounceMS, disableCountryGuess, disableDialCodePrefill, forceDialCode, disableDialCodeAndPrefix, onChange, }: UsePhoneInputConfig) => {
    phone: string;
    country: CountryIso2;
    setCountry: (countryIso2: CountryIso2) => void;
    handlePhoneValueChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => string;
    inputRef: import("react").MutableRefObject<HTMLInputElement | null>;
};
