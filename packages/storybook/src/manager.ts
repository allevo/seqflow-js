// @ts-ignore
import { addons } from '@storybook/manager-api';
import { Addon_TypesEnum } from '@storybook/types';
import { global } from '@storybook/global';

// @ts-ignore
import { IconButton } from '@storybook/components';
import { LightningIcon } from '@storybook/icons';


const ADDON_ID = 'seqflow-js-addon'
const TOOL_ID = 'seqflow-js-addon-darkmode-button'

function getNextTheme(theme: string) {
    return theme === 'light' ? 'dark' : 'light';
}

// @ts-ignore
import('react')
    .then((React) => {
        const Tool = function MyAddonSelector() {
            const [state, setState] = React.useState({ theme: 'light' });

            const toggleMyTool = () => {
                const nextTheme = getNextTheme(state.theme);
                setState({ theme: nextTheme });
            };

            const iframePreview = global.document.getElementById('storybook-preview-iframe') as HTMLIFrameElement | null
            const innerContentDocument = iframePreview?.contentDocument as Document | null
            React.useEffect(() => {
                if (innerContentDocument?.body?.parentElement) {
                    innerContentDocument.body.parentElement.setAttribute('data-theme', state.theme)
                }
            }, [innerContentDocument, state.theme, innerContentDocument && innerContentDocument.body && innerContentDocument.body.parentElement])

            return React.createElement(IconButton, {
                key: TOOL_ID,
                active: state.theme === 'dark',
                title: `Active ${getNextTheme(state.theme)} theme`,
                onClick: toggleMyTool
            }, React.createElement(LightningIcon, null));
        }

        // Register the addon
        addons.register(ADDON_ID, () => {
            // Register the tool
            addons.add(TOOL_ID, {
                type: Addon_TypesEnum.TOOLEXTRA,
                title: 'Dark mode',
                match: () => true,
                render: Tool,
            });
        });
    })

export { render } from './render';