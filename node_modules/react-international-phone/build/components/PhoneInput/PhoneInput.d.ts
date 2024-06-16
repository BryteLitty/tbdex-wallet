import './PhoneInput.style.scss';
import React from 'react';
import { UsePhoneInputConfig } from '../../hooks/usePhoneInput';
import { CountryIso2 } from '../../types';
import { CountrySelectorProps, CountrySelectorStyleProps } from '../CountrySelector/CountrySelector';
import { DialCodePreviewStyleProps } from '../DialCodePreview/DialCodePreview';
export interface PhoneInputStyleProps {
    style?: React.CSSProperties;
    className?: string;
    inputStyle?: React.CSSProperties;
    inputClassName?: string;
    countrySelectorStyleProps?: CountrySelectorStyleProps;
    dialCodePreviewStyleProps?: DialCodePreviewStyleProps;
}
export interface PhoneInputProps extends Omit<UsePhoneInputConfig, 'onChange'>, PhoneInputStyleProps {
    /**
     * @description Hide the dropdown icon. Make country selection not accessible.
     * @default false
     */
    hideDropdown?: CountrySelectorProps['hideDropdown'];
    /**
     * @description Input's placeholder
     * @default undefined
     */
    placeholder?: React.InputHTMLAttributes<HTMLInputElement>['placeholder'];
    /**
     * @description Disable phone input and country selector.
     * @default false
     */
    disabled?: boolean;
    /**
     * @description
     * Show prefix and dial code between country selector and phone input.
     * Works only when *disableDialCodeAndPrefix* is *true*
     * @default false
     */
    showDisabledDialCodeAndPrefix?: boolean;
    /**
     * @description Default input component props
     * @default undefined
     */
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    /**
     * @description Custom flag URLs array
     * @default undefined
     */
    flags?: CountrySelectorProps['flags'];
    /**
     * @description Callback that calls on phone change
     * @params `phone` - new phone value, `country` - country iso2 value
     * @default undefined
     */
    onChange?: (phone: string, country: CountryIso2) => void;
}
export declare const PhoneInput: React.FC<PhoneInputProps>;
