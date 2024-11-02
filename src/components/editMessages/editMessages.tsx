import Spacings from "@commercetools-uikit/spacings";
import Text from "@commercetools-uikit/text";
import { Link as RouterLink } from "react-router-dom";
import Link from '@commercetools-uikit/link';

import FlatButton from "@commercetools-uikit/flat-button";
import { BackIcon } from "@commercetools-uikit/icons";
import MultilineTextField from '@commercetools-uikit/multiline-text-field';
import messages from "./messages";
import { useCallback, useEffect, useState } from "react";
import styles from './editMessages.module.css';
import Card from '@commercetools-uikit/card';
import whatsappSvg from './whatsapp.svg';
import { useAsyncDispatch } from '@commercetools-frontend/sdk';
import { fetchMessageBodyObject, updateMessageBodyObject } from "../../hooks/messages.hook";
import Loader from "../loader";
import { validateTemplate } from "../../utils/messageBody.utils";
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { useIntl } from 'react-intl';

type TEditMessagesProps = {
    linkToNotifications: string;
};


const EditMessages = ({ linkToNotifications }: TEditMessagesProps) => {
    const [selectedMethod, setSelectedMethod] = useState("whatsapp");
    const [editedMessage, setEditedMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [hasLoaded, setHasLoaded] = useState(false);

    const dispatch = useAsyncDispatch();
    const intl = useIntl();
    const showNotification = useShowNotification(); // Hook for showing notifications

    const loadMessages = useCallback(async () => {
        try {
            const results = await fetchMessageBodyObject(dispatch);
            if (!hasLoaded) {
                const selectedMsg = results.find(
                    msg => msg.value.channel.toLowerCase() === selectedMethod.toLowerCase()
                );
                setEditedMessage(selectedMsg?.value.message || "");
                setHasLoaded(true);
            }
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setIsLoading(false);
        }
    }, [dispatch, selectedMethod, hasLoaded]);

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    const handleTemplateChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newMessage = event.target.value;
        setEditedMessage(newMessage);
        const errors = validateTemplate(newMessage);
        setValidationErrors(errors);
    };

    const handleSave = async () => {
        setIsSaving(true);
        const key = selectedMethod === "whatsapp" ? "msg-body-key-constant-whatsapp" : "msg-body-key-constant-other-channel";
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

            // Show success notification
            showNotification({
                kind: 'success',
                domain: 'side',
                text: intl.formatMessage({ id: 'message.save.success', defaultMessage: "Message saved successfully!" }),
            });
        } catch (error) {
            showNotification({
                kind: 'error',
                domain: 'side',
                text: intl.formatMessage({ id: 'message.save.error', defaultMessage: "Something went wrong!" }),
            });
            console.error('Error saving message:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Spacings.Stack scale="xl">
            {isLoading ? (
                <div className={styles.loadingContainer}><Loader /></div>
            ) : (
                <>
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
                            <div className={styles.actionButtons}>
                                <button
                                    onClick={() => setSelectedMethod("whatsapp")}
                                    className={selectedMethod === "whatsapp" ? styles.active : ""}
                                >
                                    <img alt="web developer" src={whatsappSvg} />
                                    <span>WhatsApp</span>
                                </button>
                            </div>
                            <Card theme="light" type="raised" className={styles.noteContainer}>
                                <h4>Note :</h4>
                                <ul style={{ lineHeight: '1.5' }}>
                                    <li><b>Mandatory Fields</b>: Ensure all placeholders are populated with valid data from the <Link isExternal={true} to={"https://docs.commercetools.com/api/projects/orders#order"}>order</Link> response to avoid incomplete messages. </li>
                                    <li><b>Character Limits</b>: Consider WhatsApp's character limits (4096 characters for messages) to prevent truncation.</li>
                                    <li><b>Dynamic Data</b>: Ensure the order object has necessary attributes (e.g., shippingAddress, id, totalPrice) populated before generating the message.</li>
                                </ul>
                            </Card>
                            <div className={styles.messageArea}>
                                <MultilineTextField
                                    title="Message body"
                                    placeholder="What's your message body"
                                    value={editedMessage}
                                    onChange={handleTemplateChange}
                                    id="messageBodyTextarea"
                                />
                                {validationErrors.length > 0 && (
                                    <div className={styles.validationErrors}>
                                        <ul>
                                            {validationErrors.map((error, index) => (
                                                <li key={index}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className={styles.cardFooter}>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || validationErrors.length > 0}
                                >
                                    {isSaving ? <div className={styles.loader}></div> : 'Save changes'}
                                </button>
                            </div>
                        </Card>
                    </Spacings.Stack>
                </>
            )}
        </Spacings.Stack>
    );
};

export default EditMessages;

