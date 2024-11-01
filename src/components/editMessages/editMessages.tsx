
import Spacings from "@commercetools-uikit/spacings";
import Text from "@commercetools-uikit/text";
import { Link as RouterLink } from "react-router-dom";
import FlatButton from "@commercetools-uikit/flat-button";
import { BackIcon } from "@commercetools-uikit/icons";
import MultilineTextField from '@commercetools-uikit/multiline-text-field';
import messages from "./messages";
import { useCallback, useEffect, useState } from "react";
import styles from './editMessages.module.css';
import Card from '@commercetools-uikit/card';
import whatsappSvg from './whatsapp.svg';
import { useAsyncDispatch } from '@commercetools-frontend/sdk';
import { MessageBodyResult } from "../../interfaces/messages.interface";
import { fetchMessageBodyObject, updateMessageBodyObject } from "../../hooks/messages.hook";

type TEditMessagesProps = {
    linkToNotifications: string;
};

const EditMessages = ({ linkToNotifications }: TEditMessagesProps) => {
    const [messageContent, setMessageContent] = useState<MessageBodyResult[]>([]);
    const [selectedMethod, setSelectedMethod] = useState("whatsapp");
    const [editedMessage, setEditedMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const dispatch = useAsyncDispatch();

    const loadMessages = useCallback(async () => {
        try {
            const results = await fetchMessageBodyObject(dispatch);
            setMessageContent(results);
            // Only set initial message if editedMessage is empty
            if (!editedMessage) {
                const selectedMsg = results.find(
                    msg => msg.value.channel.toLowerCase() === selectedMethod.toLowerCase()
                );
                setEditedMessage(selectedMsg?.value.message || "");
            }
        } catch (error) {
            console.error('Failed to load messages:', error);
            setMessageContent([]);
        } finally {
            setIsLoading(false);
        }
    }, [dispatch, selectedMethod, editedMessage]);

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    // const selectedMessage = messageContent.find(
    //     msg => msg.value.channel.toLowerCase() === selectedMethod.toLowerCase()
    // );

    const handleSave = async () => {
        setIsSaving(true);
        const key: string = selectedMethod === "whatsapp" ? "msg-body-key-constant-whatsapp"  : "msg-body-key-constant-other-channel"
        try {
            await updateMessageBodyObject(dispatch, {
                container: "messageBody",
                key: key,
                value: {
                    channel: selectedMethod,
                    message: editedMessage,
                },
            });
            loadMessages();
        } catch (error) {
            console.error('Error saving message:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <Spacings.Stack scale="xl">
            <Spacings.Stack scale="xs">
                <FlatButton
                    as={RouterLink}
                    to={linkToNotifications}
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
                                value={editedMessage}
                                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    setEditedMessage(event.target.value)}
                                id="messageBodyTextarea"
                            />
                        </div>
                    </div>
                    <div className={styles.cardFooter}>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </Card>
            </Spacings.Stack>
        </Spacings.Stack>
    );
};

export default EditMessages;