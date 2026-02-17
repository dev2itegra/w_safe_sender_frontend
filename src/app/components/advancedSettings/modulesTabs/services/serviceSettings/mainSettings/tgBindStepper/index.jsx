import React, { useCallback, useMemo, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import TokenIcon from '@mui/icons-material/Token';

import PhoneNumberInput from './phoneNumberInput';
import CodeInput from './codeInput';
import IncludedTelegram from './included';
import { sendAmoErrorNotification } from '../../../../../../../services/amoNotification/sendNotification';
import { baseApiInstance } from '../../../../../../../services/requests/axios.instance';


function TelegramBindStepper(
    {
        linkedPyrogramPhone,
        setLinkedPyrogramPhone,
        serviceId,
    }
) {
    const [state, setState] = useState(linkedPyrogramPhone ? "done" : "phone"); // phone code done 

    const [phoneNumber, setPhoneNumber] = useState(linkedPyrogramPhone || "");
    const [isPhoneValid, setIsPhoneValid] = useState(false);

    const [code, setCode] = useState("");
    const [isCodeValid, setIsCodeValid] = useState(false);

    const [isCodeSending, setIsCodeSending] = useState(false);
    const [isCodeConfirming, setIsCodeConfirming] = useState(false);
    

    const isButtonDisabled = useMemo(() => {
        if ( state === "phone" ) {
            return !phoneNumber || !isPhoneValid ;
        } else if ( state === "code" ) {
            return !code || !isCodeValid;
        }
        return false;
    }, [state, isPhoneValid, phoneNumber, code, isCodeValid])


    const onButtonClick = useCallback(async () => {
        if (state === "phone") {
            try {
                setIsCodeSending(true);

                const response = await baseApiInstance.post(
                    "/telegram-pyrogram/send-code", 
                    { 
                        phone_number: phoneNumber,
                        service_id: serviceId,
                    }
                );
                if ( response.status === 200 ) {
                    setState("code");
                }

            } catch (error) {
                console.error(error);
                sendAmoErrorNotification("Ошибка отправки кода");
            } finally {
                setIsCodeSending(false);
            }
        } else if (state === "code") {
            try {
                setIsCodeConfirming(true);

                const response = await baseApiInstance.post(
                    "/telegram-pyrogram/confirm-code", 
                    { 
                        code: code,
                        service_id: serviceId,
                    }
                );
                if ( response.status === 200 ) {
                    setState("done");
                    setLinkedPyrogramPhone(phoneNumber);
                }

            } catch (error) {
                console.error(error);
                sendAmoErrorNotification("Ошибка подтверждения кода");
            } finally {
                setIsCodeConfirming(false);
            }
        } else if ( state === "done" ) {
            setPhoneNumber("");
            setState("")
        }


    }, [state, code, phoneNumber, setLinkedPyrogramPhone, serviceId]);


    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
            }}
        >   
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    <TokenIcon sx={{fontSize: "1.25rem", color: "var(--button_blue)"}} />
                    <Typography
                        sx={{
                            fontWeight: 500,
                            fontSize: "1.25rem",
                        }}
                    >
                        Подключение аккаунта Telegram
                    </Typography>
                </Box>
                <Typography
                    sx={{
                        fontSize: "1rem",
                        color: "var(--palette-text-secondary-dark-green)",
                        lineHeight: 1,
                    }}
                >
                    Данный аккаунт будет использоваться для рассылки сообщений в Telegram
                </Typography>   
            </Box>
            {
                state === "done" && 
                <IncludedTelegram 
                    phoneNumber={phoneNumber}
                    onUnlink={onButtonClick}
                />
            }
            {
                state !== "done" && 
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "300px auto",
                        gap: "1rem",
                    }}
                >
                    {
                        state === "phone" &&
                        <PhoneNumberInput 
                            phone={phoneNumber}
                            setPhone={setPhoneNumber}
                            setIsPhoneValid={setIsPhoneValid}
                        />
                    }
                    {
                        state === "code" &&
                        <CodeInput 
                            code={code}
                            setCode={setCode}
                            setIsCodeValid={setIsCodeValid}
                        />
                    }
                    <Button
                        sx={{
                            background: "var(--button_blue)",
                            color: "var(--palette-text-primary)",
                            width: "fit-content",
                            "&.Mui-disabled": {
                                opacity: 0.7,
                            },
                        }}
                        disabled={isButtonDisabled || isCodeSending || isCodeConfirming}
                        onClick={onButtonClick}
                    >
                        <span>
                            {state === "phone" && <>Отправить код</>}
                            {state === "code" && <>Подключить</>}
                        </span>
                        {
                            (isCodeSending || isCodeConfirming) &&
                            <CircularProgress 
                                size={"1rem"}
                                sx={{
                                    ml: "0.5rem",
                                }}
                            /> 
                        }
                    </Button>
                </Box>
            }
            
            
        </Box>
    );
}

export default TelegramBindStepper;