import React, { useCallback, useState } from 'react';
import { TextField } from '@mui/material';

function PhoneNumberInput({ phoneNumber, setPhoneNumber }) {
    const formatPhone = (digits) => {
        if (!digits) return '';
        let formatted = '+';
        for (let i = 0; i < digits.length; i++) {
            if (i === 1) formatted += ' (';
            if (i === 4) formatted += ') ';
            if (i === 7 || i === 9) formatted += '-';
            formatted += digits[i];
        }
        return formatted;
    };

    const [value, setValue] = useState(formatPhone(phoneNumber));
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState('');


    const handleChange = (e) => {
        const input = e.target.value.replace(/\D/g, '');
        setValue(input);

        if (input.length === 0) {
            setError(true);
            setHelperText('Введите номер телефона');
        } else if (input.length !== 11) {
            setError(true);
            setHelperText('Номер должен содержать 11 цифр');
        } else {
            setError(false);
            setHelperText('');
        }
    };

    const handleBlur = useCallback(() => {
        const digits = value.replace(/\D/g, '');
        if (digits.length === 11) {
            setPhoneNumber(digits);
        } else {
            setPhoneNumber('');
            setError(true);
            setHelperText('Неверный номер телефона');
        }
    }, [value, setPhoneNumber]);

    return (
        <TextField
            fullWidth
            label="Номер телефона"
            value={formatPhone(value)}
            onChange={handleChange}
            onBlur={handleBlur}
            error={error}
            helperText={helperText}
            variant="outlined"
            placeholder="+7 (___) ___-__-__"
            slotProps={{
                input: { type: 'tel', inputMode: 'tel', maxLength: 18 },
                inputLabel: { shrink: true },
            }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    color: 'var(--palette-text-primary)',
                    '& fieldset': { borderColor: 'var(--palette-border-default)' },
                    '&:hover fieldset': { borderColor: 'var(--button_blue)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--button_blue)' },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                    color: 'var(--button_blue)',
                },
                '& .MuiOutlinedInput-input': {
                    padding: '0.5rem 0.75rem',
                    fontSize: '1rem',
                },
                '& .MuiInputLabel-root': {
                    color: 'var(--palette-border-default)',
                },
            }}
        />
    );
}

export default PhoneNumberInput;
