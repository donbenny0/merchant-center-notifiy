import { useAsyncDispatch, actions } from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
const dispatch = useAsyncDispatch();

export async function fetchProducts() {
    try {
        const result = await dispatch(
            actions.get({
                mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
                service: 'custom-objects/notifications',
                // Optional parameters for pagination and filtering
                options: {
                    // page: 1,
                    // perPage: 20,
                    // sort: ['createdAt desc'],
                    // where: ['categories.id="category-id"']
                }
            })
        );
        // Update state with `result`
        alert(result)
        console.log('Products:', result);
    } catch (error) {
        // Handle error
        console.error('Error fetching products:', error);
    }
}