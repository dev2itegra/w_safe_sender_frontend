import React from 'react';
import { matchIsValidTel, MuiTelInput } from 'mui-tel-input';

import { useThemeDetector } from '../../../../../../../services/themes/themeDetector';


function PhoneNumberInput({ phone, setPhone, setIsPhoneValid }) {
    const theme = useThemeDetector();
    
    const isInvalid = !!phone && !matchIsValidTel(phone);
    

    return (
        <MuiTelInput
            value={phone}
            onChange={(v) => {setIsPhoneValid(matchIsValidTel(v)); setPhone(v)}}
            defaultCountry="RU"
            preferredCountries={["RU"]}
            size="small"
            variant="outlined"
            label="Номер телефона"
            error={isInvalid}
            sx={{
                backgroundColor: theme === "dark" ? "#153043" : "rgba(255, 255, 255)",
                "& .MuiOutlinedInput-root": {
                    color: theme === "dark" ? "rgba(255, 255, 255)" : "rgba(0, 0, 0, 0.87)",
                    "& fieldset": { borderColor: "var(--palette-border-default)" },
                    "&:hover fieldset": { borderColor: theme === "dark" ? "#ffffff" : "#212121" },
                    "&.Mui-focused fieldset": { borderColor: theme === "dark" ? "#90caf9" : "#1976d2" },
                },
                "& .MuiInputLabel-root": {
                    color: theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
                    "&.Mui-focused": { color: theme === "dark" ? "#90caf9" : "#1976d2" },
                },
                "& .MuiOutlinedInput-input::placeholder": { color: "var(--palette-border-default)", opacity: 1 },
                "& .MuiSvgIcon-root": { fill: theme === "dark" ? "rgb(255, 255, 255)" : "rgba(0, 0, 0, 0.54)" },
            }}
        />
    )
}

export default PhoneNumberInput;