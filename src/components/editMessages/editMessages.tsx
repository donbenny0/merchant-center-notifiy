import Spacings from "@commercetools-uikit/spacings";
import Text from "@commercetools-uikit/text";
import { Link as RouterLink } from "react-router-dom";
import FlatButton from "@commercetools-uikit/flat-button";
import { BackIcon } from "@commercetools-uikit/icons";
import TextInput from '@commercetools-uikit/text-input';
import MultilineTextInput from '@commercetools-uikit/multiline-text-input';
import style from './editMessages.module.css'
import messages from "./messages";
import { useState } from "react";
import { useIntl } from 'react-intl';
import styles from './editMessages.module.css';
type TEditMessagesProps = {
    linkToNotifications: string;
};

const EditMessages = (props: TEditMessagesProps) => {
    const [messageContent, setMessageContent] = useState("");
    const [selectedMethod, setSelectedMethod] = useState("SMS");
    const intl = useIntl();
    const handleSave = () => {
        // Handle saving message
        console.log({ messageContent, selectedMethod });
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessageContent(e.target.value);
    };

    const handleMethodChange = (method: string) => {
        setSelectedMethod(method);
    };

    return (
        <Spacings.Stack scale={"xl"}> // Fix scale prop
            <Spacings.Stack scale={"xs"}>
                <FlatButton
                    as={RouterLink}
                    to={props.linkToNotifications}
                    label="Go to notifications"
                    icon={<BackIcon />}
                />
                <Text.Headline as="h1" intlMessage={messages.title} />
                <Text.Subheadline as="h5" intlMessage={messages.subtitle} />
            </Spacings.Stack>

            <Spacings.Stack scale={"m"}>

                <div className={style.bgContainer}>
                    
                </div>


            </Spacings.Stack>
        </Spacings.Stack >
    );
};

export default EditMessages;