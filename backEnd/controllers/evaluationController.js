// Create a separate file for new evaluation management functions
const { evaluations } = require("../models/assignmentModel");
const mongoose = require("mongoose");

// Manual Override: Teacher can manually update AI evaluation
const updateEvaluation = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const { evaluationId } = req.params;
        const { marksPerQuestion, totalMarks, comments } = req.body;

        if (!mongoose.Types.ObjectId.isValid(evaluationId)) {
            return res.status(400).json({
                message: "Invalid evaluation ID",
                success: false,
            });
        }

        const evaluation = await evaluations.findById(evaluationId);

        if (!evaluation) {
            return res.status(404).json({
                message: "Evaluation not found",
                success: false,
            });
        }

        // Update the evaluation with manual changes
        if (marksPerQuestion && Array.isArray(marksPerQuestion)) {
            evaluation.marksPerQuestion = marksPerQuestion;
        }

        if (totalMarks !== undefined) {
            evaluation.totalMarks = totalMarks;
        }

        // Mark as manually overridden
        evaluation.isManuallyOverridden = true;

        await evaluation.save();

        res.status(200).json({
            message: "Evaluation updated successfully",
            success: true,
            evaluation,
        });
    } catch (error) {
        console.error("Error updating evaluation:", error);
        res.status(500).json({
            message: "Failed to update evaluation",
            success: false,
            error: error.message,
        });
    }
};

// Publish Results: Toggle publish status for an evaluation
const togglePublishEvaluation = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const { evaluationId } = req.params;
        const { isPublished } = req.body;

        if (!mongoose.Types.ObjectId.isValid(evaluationId)) {
            return res.status(400).json({
                message: "Invalid evaluation ID",
                success: false,
            });
        }

        const evaluation = await evaluations.findById(evaluationId);

        if (!evaluation) {
            return res.status(404).json({
                message: "Evaluation not found",
                success: false,
            });
        }

        evaluation.isPublished = isPublished;

        if (isPublished) {
            evaluation.publishedAt = new Date();
            evaluation.publishedBy = teacherId;
        }

        await evaluation.save();

        res.status(200).json({
            message: `Evaluation ${isPublished ? 'published' : 'unpublished'} successfully`,
            success: true,
            evaluation,
        });
    } catch (error) {
        console.error("Error publishing evaluation:", error);
        res.status(500).json({
            message: "Failed to publish evaluation",
            success: false,
            error: error.message,
        });
    }
};

// Bulk Publish: Publish multiple evaluations at once
const bulkPublishEvaluations = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const { evaluationIds, isPublished } = req.body;

        if (!Array.isArray(evaluationIds) || evaluationIds.length === 0) {
            return res.status(400).json({
                message: "Please provide an array of evaluation IDs",
                success: false,
            });
        }

        const updateData = {
            isPublished,
            publishedBy: teacherId,
        };

        if (isPublished) {
            updateData.publishedAt = new Date();
        }

        const result = await evaluations.updateMany(
            { _id: { $in: evaluationIds } },
            updateData
        );

        res.status(200).json({
            message: `${result.modifiedCount} evaluation(s) ${isPublished ? 'published' : 'unpublished'} successfully`,
            success: true,
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        console.error("Error bulk publishing evaluations:", error);
        res.status(500).json({
            message: "Failed to bulk publish evaluations",
            success: false,
            error: error.message,
        });
    }
};

module.exports = {
    updateEvaluation,
    togglePublishEvaluation,
    bulkPublishEvaluations,
};
