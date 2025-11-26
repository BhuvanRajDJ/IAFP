import { updateEvaluation, togglePublishEvaluation, bulkPublishEvaluations } from './Api';

// Update an evaluation (manual override)
export const handleUpdateEvaluation = async (evaluationId, updates) => {
    try {
        const response = await updateEvaluation(evaluationId, updates);
        return response;
    } catch (error) {
        console.error("Error updating evaluation:", error);
        throw error;
    }
};

// Toggle publish status for a single evaluation
export const handleTogglePublish = async (evaluationId, isPublished) => {
    try {
        const response = await togglePublishEvaluation(evaluationId, { isPublished });
        return response;
    } catch (error) {
        console.error("Error toggling publish status:", error);
        throw error;
    }
};

// Bulk publish evaluations
export const handleBulkPublish = async (evaluationIds, isPublished) => {
    try {
        const response = await bulkPublishEvaluations({ evaluationIds, isPublished });
        return response;
    } catch (error) {
        console.error("Error bulk publishing:", error);
        throw error;
    }
};
