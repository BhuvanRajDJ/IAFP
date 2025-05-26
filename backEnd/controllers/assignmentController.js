const { response } = require("express");
const {
  assignmentcreations,
  assignmentsubmissions,
  evaluations,
  reportcards,
} = require("../models/assignmentModel");
const { studentModel, teacherModel } = require("../models/usersModel");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const { uploadFile } = require("../config/googleDrive");
const { evaluateAssignment } = require("../config/googleAI");
const fs = require("fs");
const { deleteFile } = require("../config/googleDrive");

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Teachers section
const fetchAssignment = async (req, res) => {
  try {
    const id = req.user.id;
    const assignments = await assignmentcreations.find({ teacherId: id });
    if (!assignments) {
      return res.status(400).json({
        message: "No assignments found for this teacher",
        success: false,
      });
    }

    res.status(200).json({
      message: "assignments retrieved successfully",
      success: true,
      assignments,
    });
  } catch (error) {
    res.status(500).json({ message: "Assignment question could't fetch" });
  }
};

const createAssignment = async (req, res) => {
  try {
    const { title, subject, year, description, questions, deadline } = req.body;
    const teacherId = req.user.id;

    if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({
        message: "Invalid teacher ID",
        success: false,
      });
    }

    const teacher = await teacherModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
        success: false,
      });
    }

    const students = await studentModel.find(
      { department: teacher.department, year: year },
      "email name"
    );

    if (students.length === 0) {
      return res.status(404).json({
        message: "No students found in this department and year",
        success: false,
      });
    }

    const newAssignment = new assignmentcreations({
      title,
      subject,
      year,
      description,
      department: teacher.department,
      questions,
      deadline,
      teacherId,
    });

    await newAssignment.save();

    // Get student emails
    const studentEmails = students.map((student) => student.email);

    // Email template
    const emailTemplate = {
      from: {
        name: "IAFP",
        email: "iafpvviet@gmail.com",
      },
      subject: `New Assignment: ${title}`,
      text: `Dear Student,\n\nA new assignment titled "${title}" has been posted for ${subject}. Please check the details and submit before ${deadline}.\n\nBest Regards,\n${teacher.name}`,
      html: `<p>Dear Student,</p>
             <p>A new assignment titled <strong>${title}</strong> has been posted for <strong>${subject}</strong>.</p>
             <p>Please check the details and submit before <strong>${deadline}</strong>.</p>
             <p>Best Regards,<br>${teacher.name}</p>`,
    };

    // Verify API key is set
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.error("SendGrid API key is not set");
      return res.status(201).json({
        message: "Assignment created but emails not sent (missing API key)",
        success: true,
        assignment: newAssignment,
        emailStatus: "FAILED_MISSING_API_KEY",
      });
    }

    // Check if API key starts with "SG." (basic validation)
    if (!apiKey.startsWith("SG.")) {
      console.error(
        "SendGrid API key appears invalid (doesn't start with 'SG.')"
      );
    }

    // First try a test API call to validate the SendGrid setup
    try {
      // This will throw an error if the API key is invalid
      await sgMail.send({
        to: emailTemplate.from.email, // Send to yourself as a test
        from: emailTemplate.from,
        subject: "SendGrid Test",
        text: "This is a test email to verify SendGrid configuration",
      });
      console.log("SendGrid test email sent successfully");
    } catch (testError) {
      console.error("SendGrid configuration issue:", testError.toString());
      // Full error details for debugging
      if (testError.response) {
        console.error("SendGrid API response:", {
          body: testError.response.body,
          statusCode: testError.response.statusCode,
        });
      }

      return res.status(201).json({
        message:
          "Assignment created but emails not sent (SendGrid configuration issue)",
        success: true,
        assignment: newAssignment,
        emailStatus: "FAILED_API_CONFIGURATION",
        error: testError.toString(),
      });
    }

    // Send emails individually with failure handling
    const emailResults = {
      successful: [],
      failed: [],
    };

    // Process emails sequentially
    for (const email of studentEmails) {
      // Validate email format (basic check)
      const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!validEmailRegex.test(email)) {
        console.error(`Invalid email format: ${email}`);
        emailResults.failed.push({
          email,
          error: "Invalid email format",
        });
        continue; // Skip this email
      }

      try {
        const message = {
          ...emailTemplate,
          to: email,
        };

        await sgMail.send(message);
        console.log(`Email sent successfully to ${email}`);
        emailResults.successful.push(email);
      } catch (emailError) {
        const errorDetails = emailError.toString();
        console.error(`Failed to send email to ${email}:`, errorDetails);

        // Detailed error logging
        if (emailError.response) {
          console.error(`SendGrid error details for ${email}:`, {
            statusCode: emailError.response.statusCode,
            body: emailError.response.body,
          });
        }

        emailResults.failed.push({
          email,
          error: errorDetails,
        });
      }
    }

    // Return results based on email sending outcomes
    if (emailResults.successful.length > 0) {
      if (emailResults.failed.length === 0) {
        return res.status(201).json({
          message: "Assignment created and all emails sent successfully",
          success: true,
          assignment: newAssignment,
          emailStats: {
            total: studentEmails.length,
            sent: emailResults.successful.length,
            failed: 0,
          },
        });
      } else {
        return res.status(201).json({
          message: "Assignment created, but some emails failed to send",
          success: true,
          assignment: newAssignment,
          emailStats: {
            total: studentEmails.length,
            sent: emailResults.successful.length,
            failed: emailResults.failed.length,
          },
          failedEmails: emailResults.failed,
        });
      }
    } else {
      return res.status(201).json({
        message: "Assignment created, but all emails failed to send",
        success: true,
        assignment: newAssignment,
        emailStats: {
          total: studentEmails.length,
          sent: 0,
          failed: emailResults.failed.length,
        },
        failedEmails: emailResults.failed,
      });
    }
  } catch (error) {
    console.error("Assignment creation failed:", error.message);
    return res.status(500).json({
      message: "Failed to create assignment",
      success: false,
      error: error.message,
    });
  }
};

// update Assignment
const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;
    const {
      title,
      subject,
      year,
      description,
      department,
      questions,
      deadline,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid assignment ID",
        success: false,
      });
    }

    if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({
        message: "Invalid teacher ID",
        success: false,
      });
    }

    const teacher = await teacherModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
        success: false,
      });
    }

    const students = await studentModel.find(
      { department: teacher.department, year: year },
      "email name"
    );

    if (students.length === 0) {
      return res.status(404).json({
        message: "No students found in this department and year",
        success: false,
      });
    }

    const assignment = await assignmentcreations.findById(id);
    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
        success: false,
      });
    }

    if (assignment.teacherId.toString() !== teacherId) {
      return res.status(403).json({
        message: "Unauthorized: You can only update your own assignments",
        success: false,
      });
    }

    const updatedAssignment = await assignmentcreations.findByIdAndUpdate(
      id,
      {
        title,
        subject,
        year,
        description,
        department,
        questions,
        deadline,
        teacherId,
      },
      { new: true }
    );

    // Get student emails
    const studentEmails = students.map((student) => student.email);

    // Email template
    const emailTemplate = {
      from: {
        name: "IAFP",
        email: "iafpvviet@gmail.com",
      },
      subject: `Assignment Updated: ${title}`,
      text: `Dear Student,\n\nThe assignment "${title}" has been updated. Please check the updated details and submit before ${deadline}.\n\nBest Regards,\n${teacher.name}`,
      html: `<p>Dear Student,</p>\n<p>The assignment <strong>${title}</strong> has been updated.</p>\n<p>Please check the updated details and submit before <strong>${deadline}</strong>.</p>\n<p>Best Regards,<br>${teacher.name}</p>`,
    };

    // Verify API key is set
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.error("SendGrid API key is not set");
      return res.status(200).json({
        message: "Assignment updated but emails not sent (missing API key)",
        success: true,
        assignment: updatedAssignment,
        emailStatus: "FAILED_MISSING_API_KEY",
      });
    }

    // Check if API key starts with "SG." (basic validation)
    if (!apiKey.startsWith("SG.")) {
      console.error(
        "SendGrid API key appears invalid (doesn't start with 'SG.')"
      );
    }

    try {
      // This will throw an error if the API key is invalid
      await sgMail.send({
        to: emailTemplate.from.email, // Send to yourself as a test
        from: emailTemplate.from,
        subject: "SendGrid Test",
        text: "This is a test email to verify SendGrid configuration",
      });
      console.log("SendGrid test email sent successfully");
    } catch (testError) {
      console.error("SendGrid configuration issue:", testError.toString());
      // Full error details for debugging
      if (testError.response) {
        console.error("SendGrid API response:", {
          body: testError.response.body,
          statusCode: testError.response.statusCode,
        });
      }

      return res.status(200).json({
        message:
          "Assignment updated but emails not sent (SendGrid configuration issue)",
        success: true,
        assignment: updatedAssignment,
        emailStatus: "FAILED_API_CONFIGURATION",
        error: testError.toString(),
      });
    }

    // Send emails individually with failure handling
    const emailResults = {
      successful: [],
      failed: [],
    };

    // Process emails sequentially
    for (const email of studentEmails) {
      // Validate email format (basic check)
      const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!validEmailRegex.test(email)) {
        console.error(`Invalid email format: ${email}`);
        emailResults.failed.push({
          email,
          error: "Invalid email format",
        });
        continue; // Skip this email
      }

      try {
        const message = {
          ...emailTemplate,
          to: email,
        };

        await sgMail.send(message);
        console.log(`Email sent successfully to ${email}`);
        emailResults.successful.push(email);
      } catch (emailError) {
        const errorDetails = emailError.toString();
        console.error(`Failed to send email to ${email}:`, errorDetails);

        // Detailed error logging
        if (emailError.response) {
          console.error(`SendGrid error details for ${email}:`, {
            statusCode: emailError.response.statusCode,
            body: emailError.response.body,
          });
        }

        emailResults.failed.push({
          email,
          error: errorDetails,
        });
      }
    }

    // Return results based on email sending outcomes
    if (emailResults.successful.length > 0) {
      if (emailResults.failed.length === 0) {
        return res.status(200).json({
          message: "Assignment updated and all emails sent successfully",
          success: true,
          assignment: updatedAssignment,
          emailStats: {
            total: studentEmails.length,
            sent: emailResults.successful.length,
            failed: 0,
          },
        });
      } else {
        return res.status(200).json({
          message: "Assignment updated, but some emails failed to send",
          success: true,
          assignment: updatedAssignment,
          emailStats: {
            total: studentEmails.length,
            sent: emailResults.successful.length,
            failed: emailResults.failed.length,
          },
          failedEmails: emailResults.failed,
        });
      }
    } else {
      return res.status(200).json({
        message: "Assignment updated, but all emails failed to send",
        success: true,
        assignment: updatedAssignment,
        emailStats: {
          total: studentEmails.length,
          sent: 0,
          failed: emailResults.failed.length,
        },
        failedEmails: emailResults.failed,
      });
    }
  } catch (error) {
    console.error("Error updating assignment:", error);
    res.status(500).json({
      message: "Failed to update assignment",
      success: false,
      error: error.message,
    });
  }
};

// DELETE ASSIGNMENT
const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid assignment ID",
        success: false,
      });
    }

    const assignment = await assignmentcreations.findById(id);
    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
        success: false,
      });
    }

    if (assignment.teacherId.toString() !== teacherId) {
      return res.status(403).json({
        message: "Unauthorized: You can only delete your own assignments",
        success: false,
      });
    }

    await assignmentcreations.findByIdAndDelete(id);
    res.status(200).json({
      message: "Assignment deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete assignment",
      success: false,
      error: error.message,
    });
  }
};

// Students section
// Assignment submission for Students
const fetchAssignment_Student = async (req, res) => {
  try {
    const id = req.user.id;
    const userDeatails = await studentModel.find({ _id: id });
    // const assignments = await assignmentcreations.find();

    if (!userDeatails) {
      return res.status(400).json({
        message: "No students found",
        success: false,
      });
    }

    const batch = userDeatails[0].year;
    const department = userDeatails[0].department;

    const assignments = await assignmentcreations.find({
      year: batch,
      department: department,
    });

    res.status(200).json({
      message: "assignments retrieved successfully",
      success: true,
      assignments,
    });
  } catch (error) {
    res.status(500).json({ message: "Assignment question could't fetch" });
  }
};

const submitAssignment = async (req, res) => {
  const studentId = req.user.id;
  const { assignmentId, questionId, isCompleted } = req.body;

  if (!req.file) {
    return res.status(400).json({
      message: "No files Uploaded",
      success: false,
    });
  }
  try {
    if (!assignmentId || !questionId) {
      return res.status(400).json({
        message: "Assignment ID and Question ID is required",
        success: false,
      });
    }
    // Upload new file to Google Drive
    const uploadedFile = await uploadFile(
      req.file.path,
      req.file.originalname,
      req.file.mimetype
    );

    // Fetch the assignment and get the specific question text
    const assignment = await assignmentcreations.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
        success: false,
      });
    }

    const question = assignment.questions.find(
      (q) => q._id.toString() === questionId
    );
    if (!question) {
      return res.status(404).json({
        message: "Question not found in assignment",
        success: false,
      });
    }

    // Find if submission for this question already exists
    let submission = await assignmentsubmissions.findOne({
      studentId,
      assignmentId,
    });

    if (!submission) {
      submission = new assignmentsubmissions({
        studentId,
        assignmentId,
        isCompleted,
        answers: [],
      });
    }

    const existingAnswerIndex = submission.answers.findIndex(
      (ans) => ans.questionId.toString() === questionId
    );

    if (existingAnswerIndex !== -1) {
      // Delete old file from Google Drive
      const oldFileUrl = submission.answers[existingAnswerIndex].uploadedFile;
      const oldFileId = extractGoogleDriveFileId(oldFileUrl);

      if (oldFileId) {
        await deleteFile(oldFileId);
      }

      // Update existing answer
      submission.answers[existingAnswerIndex] = {
        questionId,
        uploadedFile: uploadedFile.webViewLink,
        submissionTimestamp: new Date(),
      };
    } else {
      // New submission for this question
      submission.answers.push({
        questionId,
        uploadedFile: uploadedFile.webViewLink,
        submissionTimestamp: new Date(),
      });
    }

    let evaluationFeedback = await evaluateAssignment(
      req.file.path,
      req.file.mimetype,
      question.questionText
    );
    fs.unlinkSync(req.file.path);

    if (!evaluationFeedback) {
      return res.status(500).json({
        message: "Evaluation failed. AI did not return a response.",
        success: false,
      });
    }
    await submission.save();

    if (evaluationFeedback) {
      try {
        const cleanFeedback = evaluationFeedback
          .replace(/```json|```/g, "")
          .trim();
        const parsedFeedback = JSON.parse(cleanFeedback);
        console.log("parsedFeedback.feedBack :", parsedFeedback.feedback[0]);
        // console.log("totalMarks :", parsedFeedback.totalMarks);
        // console.log(" plagiarismScore :",  parsedFeedback.plagiarismScore);
        // console.log(" marksAwarded :",  parsedFeedback.marksPerQuestion[0].marksAwarded);
        // console.log(" comments:", parsedFeedback.marksPerQuestion[0].comments);
        // console.log(" ");
        // console.log(" ");
        // console.log(" ");

        // console.log("Cleaned AI Response:", cleanFeedback);

        // console.log("Received questionId:", questionId);
        // console.log("Parsed AI response:", parsedFeedback);

        let evaluationRecord = await evaluations.findOne({
          assignmentSubmissionId: submission._id,
        });

        if (!evaluationRecord) {
          evaluationRecord = new evaluations({
            studentId,
            assignmentSubmissionId: submission._id,
            marksPerQuestion: [],
            totalMarks: parsedFeedback.totalMarks,
            plagiarismScore: parsedFeedback.plagiarismScore,
            isAIGenerated: parsedFeedback.isAIGenerated,
            aiGeneratedFeedback: parsedFeedback.aiGeneratedFeedback,
          });
        }

        // Update marksPerQuestion
        const questionIndex = evaluationRecord.marksPerQuestion.findIndex(
          (item) => item.questionId.toString() === questionId
        );

        if (questionIndex !== -1) {
          evaluationRecord.marksPerQuestion[questionIndex] = {
            questionId,
            isRelevant: parsedFeedback.isRelevant,
            marksAwarded: parsedFeedback.marksPerQuestion[0].marksAwarded,
            feedback: parsedFeedback.feedback[0],
            comments: parsedFeedback.marksPerQuestion[0].comments || "",
          };
        } else {
          evaluationRecord.marksPerQuestion.push({
            questionId,
            isRelevant: parsedFeedback.isRelevant,
            marksAwarded: parsedFeedback.marksPerQuestion[0].marksAwarded,
            feedback: parsedFeedback.feedback[0],
            comments: parsedFeedback.marksPerQuestion[0].comments || "",
          });
        }

        // **Recalculate total marks**
        evaluationRecord.totalMarks = evaluationRecord.marksPerQuestion.reduce(
          (sum, q) => sum + q.marksAwarded,
          0
        );

        // **Save evaluations**
        await evaluationRecord.save();
      } catch (error) {
        console.error("Error parsing AI feedback:", error);
      }
    }
    res.status(201).json({
      message: "Assignment submitted and evaluated successfully",
      success: true,
      submission,
    });
  } catch (error) {
    res.status(500).json({
      message: "Couldn't create the assignment",
      success: false,
      error: `${error}`,
    });
  }
};

const assignmentSubmitionStatus = async (req, res) => {
  const studentId = req.user.id;
  const { isCompleted, assignmentId } = req.body;
  try {
    const questions = await assignmentcreations.findById(assignmentId);
    if (!questions) {
      return res.status(404).json({
        message: "Assignment not found",
        success: false,
      });
    }
    const totalNumberOfQuestions = questions.questions.length;
    // console.log("totalNumberOfQuestions: ",totalNumberOfQuestions);
    // console.log("Student Id: ", studentId);

    const submission = await assignmentsubmissions.findOne({
      assignmentId: assignmentId,
      studentId: studentId,
    });

    if (!submission) {
      return res.status(400).json({
        message: "Student answers not found",
        success: false,
      });
    }
    const totalNumberOfAnswers = submission.answers.length;

    // console.log("totalNumberOfAnswers: ",totalNumberOfAnswers)

    if (totalNumberOfQuestions == totalNumberOfAnswers) {
      submission.isCompleted = true;
      await submission.save();
    }

    res.status(200).json({
      message: "Data Stored successfully",
      totalNumberOfQuestions: `${totalNumberOfQuestions}`,
      totalNumberOfAnswers: `${totalNumberOfAnswers}`,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server error",
      error: error.message,
      success: false,
    });
  }
};

// for teachers
const fetchSubmittedAssignment = async (req, res) => {
  try {
    const teacherId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({
        message: "Invalid teacher ID",
        success: false,
      });
    }

    const teacherAssignments = await assignmentcreations.find({ teacherId });

    if (!teacherAssignments.length) {
      return res.status(404).json({
        message: "No assignments found for this teacher",
        success: false,
      });
    }

    const assignmentIds = teacherAssignments.map(
      (assignment) => assignment._id
    );
    console.log("Assignment IDs:", assignmentIds);

    const submittedAssignments = await assignmentsubmissions
      .find({ assignmentId: { $in: assignmentIds } })
      .populate("studentId", "name email")
      .populate("assignmentId", "title subject deadline");

    console.log("Submitted Assignments:", submittedAssignments);

    if (!submittedAssignments.length) {
      return res.status(404).json({
        message: "No submitted assignments found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Submitted assignments fetched successfully",
      success: true,
      submissions: submittedAssignments,
    });
  } catch (error) {
    console.error("Error fetching submitted assignments:", error);
    res.status(500).json({
      message: "Failed to fetch submitted assignments",
      success: false,
      error: error.message,
    });
  }
};

// for students
const fetchstudentsubmission = async (req, res) => {
  const studentId = req.user.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        message: "Invalid student ID",
        success: false,
      });
    }

    const submitAssignment = await assignmentsubmissions
      .find({ studentId })
      .populate("assignmentId", "title subject deadline")
      .populate("answers.questionId", "questionText");

    if (!submitAssignment.length) {
      return res.status(404).json({
        message: "No submitted assignments found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Submitted assignments fetched successfully",
      success: true,
      submissions: submitAssignment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch submitted assignments",
      success: false,
      error: error.message,
    });
  }
};

// delete assignment
const deleteSubmittedAssignment = async (req, res) => {
  try {
    const { submissionId, questionId } = req.params;
    const studentId = req.user.id;

    const submission = await assignmentsubmissions.findOne({
      _id: submissionId,
      studentId,
    });

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found or unauthorized",
        success: false,
      });
    }

    const answerIndex = submission.answers.findIndex(
      (ans) => ans.questionId.toString() === questionId
    );

    if (answerIndex === -1) {
      return res.status(404).json({
        message: "No answer found for the given question",
        success: false,
      });
    }

    const fileId = extractGoogleDriveFileId(
      submission.answers[answerIndex].uploadedFile
    );

    if (!fileId) {
      return res
        .status(400)
        .json({ message: "Invalid file URL", success: false });
    }

    // Delete file from Google Drive
    const deleteResponse = await deleteFile(fileId);
    if (!deleteResponse.success) {
      return res.status(500).json({
        message: deleteResponse.message,
        success: false,
      });
    }

    submission.answers.splice(answerIndex, 1);

    if (submission.answers.splice(answerIndex, 1));
    if (submission.answers.length === 0) {
      await assignmentsubmissions.findByIdAndDelete(submissionId);
    } else {
      await submission.save();
    }

    res.status(200).json({
      message: "Submitted assignment deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete the assignment",
      success: false,
      error: error.message,
    });
  }
};

//Fetch Feedback for students
const getStudentevaluations = async (req, res) => {
  try {
    const studentId = req.user.id;
    const submission = await evaluations.find({ studentId });

    if (!submission.length) {
      return res.status(404).json({
        message: "No submissions found for this student",
        success: false,
      });
    }
    // const submissionIds = submission.map((sub) => sub._id);
    const submissionIds = submission.map((sub) => sub.assignmentSubmissionId);

    const studentevaluations = await evaluations
      .find({
        assignmentSubmissionId: { $in: submissionIds },
      })
      .populate("assignmentSubmissionId");

    if (!studentevaluations.length) {
      return res.status(404).json({
        message: "No evaluation found for this student's submissions",
        success: false,
      });
    }
    res.status(200).json({
      message: "Evaluations fetched successfully",
      success: true,
      evaluations: studentevaluations,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

//Fetch Feedback for Teachers
const getEvaluationsForTeacher = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const teacher = await teacherModel.findById(teacherId);
    if (!teacher) {
      return res
        .status(404)
        .json({ message: "Teacher not found", success: false });
    }
    const teacherDepartment = teacher.department;

    // 2. Find students from the same department
    const studentsInDepartment = await studentModel.find(
      { department: teacherDepartment },
      "_id"
    );
    const studentIds = studentsInDepartment.map((student) => student._id);

    if (studentIds.length === 0) {
      return res.status(404).json({
        message: "No students found in this department",
        success: false,
      });
    }

    const submissions = await assignmentsubmissions.find(
      { studentId: { $in: studentIds } },
      "_id"
    );
    const submissionIds = submissions.map((sub) => sub._id);

    if (submissionIds.length === 0) {
      return res.status(404).json({
        message: "No submissions found for students in this department",
        success: false,
      });
    }

    const studentevaluations = await evaluations
      .find({
        assignmentSubmissionId: { $in: submissionIds },
      })
      .populate({
        path: "assignmentSubmissionId",
        populate: { path: "studentId", select: "name email department" },
      });

    if (!studentevaluations || studentevaluations.length === 0) {
      return res
        .status(404)
        .json({ message: "No evaluations found", success: false });
    }

    res.status(200).json({
      message: "Evaluations fetched successfully",
      success: true,
      evaluations: studentevaluations,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

//helper function to extract Google Drive file ID from url
const extractGoogleDriveFileId = (fileUrl) => {
  const match = fileUrl.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

module.exports = {
  createAssignment,
  fetchAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  fetchSubmittedAssignment,
  fetchstudentsubmission,
  deleteSubmittedAssignment,
  getStudentevaluations,
  getEvaluationsForTeacher,
  assignmentSubmitionStatus,
  fetchAssignment_Student,
};
