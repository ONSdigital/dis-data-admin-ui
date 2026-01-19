
import { Panel } from "@/components/design-system/DesignSystem";

export default function SuccessPanel({query, contentType = "Item"}) {
    if (!query || Object.keys(query).length === 0) {
        return null;
    }

    const showSuccessPanel = 
        query?.display_success === "true" || 
        query?.display_publish_success === "true" ||
        query?.display_delete_success === "true";

    if (!showSuccessPanel) {
        return null;
    }

    const getSuccessMessage = () => {
        if (query?.display_success === "true") {
            return `${contentType} saved.`;
        }
        if (query?.display_publish_success === "true") {
            return `${contentType} published.`;
        }
        if (query?.display_delete_success === "true") {
            return `${contentType} deleted.`;
        }
        return null;
    };

    return (
        <div className="ons-u-mb-l">
            <Panel variant="success" dataTestId="success-panel">{getSuccessMessage()}</Panel>
        </div>
    );
}
