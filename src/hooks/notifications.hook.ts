import { actions } from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { ApiResponse } from '../interfaces/notifications.interface';
import { LogState } from '../interfaces/LogState.interface';

export const fetchAllNotificationsObject = async (dispatch: any) => {
    try {
        const result = await dispatch(
            actions.get({
                mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
                service: 'customObjects',
                options: {
                    id: 'notifications',
                },
            })
        ) as ApiResponse;

        return result.results;
    } catch (error) {
        console.error('Error fetching custom objects:', error);
        throw error;
    }
};
export const fetchNotificationsObject = async (dispatch: any, id: string) => {
    try {
        const result = await dispatch(
            actions.get({
                mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
                service: 'customObjects',
                options: {
                    id: id,
                },
            })
        ) as LogState;
        return result;
    } catch (error) {
        console.error('Error fetching custom objects:', error);
        throw error;
    }
};