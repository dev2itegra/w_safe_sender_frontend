import React from 'react';
import { Link } from '@mui/material';


function PhoneNumberEntity({ phoneNumber, link }) {
    return ( 
        <Link
            href={link}
            target="_blank"
            underline="hover"
            sx={{
                color: "var(--button_blue)",
            }}
        >
            {phoneNumber}
        </Link>
    );
}

export default PhoneNumberEntity;