import Spacings from "@commercetools-uikit/spacings";
import Text from "@commercetools-uikit/text";
import { Link as RouterLink } from "react-router-dom";
import FlatButton from "@commercetools-uikit/flat-button";
import { BackIcon } from "@commercetools-uikit/icons";
import MultilineTextField from '@commercetools-uikit/multiline-text-field';
import messages from "./messages";
import { useEffect, useState } from "react";
import styles from './editMessages.module.css';
import Card from '@commercetools-uikit/card';
import whatsappSvg from './whatsapp.svg';
import { useAsyncDispatch, actions } from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from "@commercetools-frontend/constants";

type TEditMessagesProps = {
    linkToNotifications: string;
};

interface MessageBodyValue {
    channel: string;
    message: string;
}

interface MessageBodyResult {
    id: string;
    version: number;
    versionModifiedAt: string;
    createdAt: string;
    lastModifiedAt: string;
    lastModifiedBy: {
        clientId: string;
        isPlatformClient: boolean;
    };
    createdBy: {
        clientId: string;
        isPlatformClient: boolean;
    };
    container: string;
    key: string;
    value: MessageBodyValue;
}

interface ApiResponse {
    limit: number;
    offset: number;
    count: number;
    total: number;
    results: MessageBodyResult[];
}

const EditMessages = (props: TEditMessagesProps) => {
    const [messageContent, setMessageContent] = useState<MessageBodyResult[]>([]);
    const [selectedMethod, setSelectedMethod] = useState("whatsapp");
    const [editedMessage, setEditedMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useAsyncDispatch();

    const fetchCustomObjects = async () => {
        try {
            const result = await dispatch(
                actions.get({
                    mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
                    service: 'customObjects',
                    options: {
                        id: 'messageBody',
                    },
                })
            ) as ApiResponse;

            setMessageContent(result.results);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching custom objects:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomObjects();
    }, [dispatch]);

    // Find the message that matches the selected channel
    const selectedMessage = messageContent.find(
        msg => msg.value.channel.toLowerCase() === selectedMethod.toLowerCase()
    );

    const handleSave = async () => {
        if (!selectedMessage) return;
        try {
            await dispatch(
                actions.post({
                    mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
                    service: 'customObjects',
                    options: {},
                    payload: {
                        container: selectedMessage.container,
                        key: selectedMessage.key,
                        value: {
                            channel: selectedMethod,
                            message: editedMessage || selectedMessage.value.message,
                        },
                    },
                })
            );

            // Reset edited message and refresh data
            setEditedMessage("");
            fetchCustomObjects();
        } catch (error) {
            console.error('Error saving message:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Spacings.Stack scale="xl">
            <Spacings.Stack scale="xs">
                <FlatButton
                    as={RouterLink}
                    to={props.linkToNotifications}
                    label="Go to notifications"
                    icon={<BackIcon />}
                />
                <Text.Headline as="h1" intlMessage={messages.title} />
                <Text.Subheadline as="h5" intlMessage={messages.subtitle} />
            </Spacings.Stack>

            <Spacings.Stack scale="s">
                <Card theme="light" type="raised">
                    <Text.Headline as="h3" intlMessage={messages.messageBoxTitle} />
                    <div className={styles.actionButtons}>
                        <button
                            onClick={() => setSelectedMethod("whatsapp")}
                            className={selectedMethod === "whatsapp" ? styles.active : ""}
                        >
                            <img alt="web developer" src={whatsappSvg} />
                            <span>WhatsApp</span>
                        </button>
                    </div>

                    <div className={styles.messageArea}>
                        <div>
                            <MultilineTextField
                                title="Message body"
                                placeholder="What's your message body"
                                value={editedMessage || selectedMessage?.value.message || ""}
                                onChange={(event: any) => setEditedMessage(event.target.value)}
                                id="messageBodyTextarea"
                            />
                        </div>
                    </div>
                    <div className={styles.cardFooter}>
                        <button onClick={handleSave}>Save</button>
                    </div>
                </Card>
            </Spacings.Stack>
        </Spacings.Stack>
    );
};

export default EditMessages;