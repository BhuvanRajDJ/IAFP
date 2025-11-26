// import.meta.env;
const backEnd_url = import.meta.env.VITE_BACKEND_URL;


export const student_Signup = async (studentObj) => {
    try {
        const response = await fetch(`${backEnd_url}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentObj)
        });

        const data = await response.json();
        //    console.log(data)

        // if(!response.ok){
        //     throw new Error(`HTTP error! Status: ${response.status} message:${data.message} `);
        // }

        // console.log(data);
        return { data };

    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};


export const student_Signin = async (studentObj) => {
    try {
        const response = await fetch(`${backEnd_url}/student_login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentObj)
        });

        const data = await response.json();
        //    console.log(data)

        // if(!response.ok){
        //     throw new Error(`HTTP error! Status: ${response.status} message:${data.message} `);
        // }

        // console.log(data);
        return { data };

    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const Teacher_SignUp = async (teacherObj) => {
    try {
        const response = await fetch(`${backEnd_url}/teachersignup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(teacherObj)
        });
        const data = await response.json();
        return { data };

    } catch (error) {
        console.error("Error creating a user:", error);
        throw error;
    }
}

// for teachers
export const Teacher_LogIn = async (teacherObj) => {
    try {
        const response = await fetch(`${backEnd_url}/teacher_login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(teacherObj)
        })
        const data = await response.json();

        return { data };
    } catch (error) {
        console.error("Error creating user: ", error);
        throw error;
    }
}

// for teachers
export const students_by_department = async () => {
    try {
        const token = await localStorage.getItem("TeacherToken");
        const response = await fetch(`${backEnd_url}/students-by-department`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': "aplication/json"
            },
        });
        const data = await response.json();
        return { data }
    } catch (error) {
        console.log("Failed to fetch student data.", error.message);
        throw error;
    }
}

// for teachers
export const submittedAssignments = async () => {
    try {
        const token = await localStorage.getItem("TeacherToken");
        const response = await fetch(`${backEnd_url}/submittedAssignments`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': "aplication/json"
            },
        });
        const data = await response.json();
        return { data }
    } catch (error) {
        console.log("Failed to fetch submitted Assignments.", error.message);
        throw error;
    }
}

// for teachers
export const createAssignment = async (assignmentobj) => {
    try {
        const token = localStorage.getItem("TeacherToken");
        if (!token) {
            throw new Error("Authentication token not found");
        }

        const response = await fetch(`${backEnd_url}/teacher/assignment`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(assignmentobj)
        });

        const data = await response.json();

        // Return data even if response is not ok
        if (!response.ok) {
            console.warn("Assignment creation had issues:", data);
        }

        return { data };
    } catch (error) {
        console.error("Error Creating assignment: ", error);
        throw error;
    }
}


// for teachers
export const fetchAssignment = async () => {
    try {
        const token = localStorage.getItem("TeacherToken");
        const response = await fetch(`${backEnd_url}/teacher/assignment`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        return { data };
    } catch (error) {
        console.log("Error Fetching the message: ", error);
        throw error;
    }
}

// for teachers
export const deleteAssignment = async (id) => {
    try {
        const token = localStorage.getItem("TeacherToken")
        const response = await fetch(`${backEnd_url}/teacher/assignment/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return { data };
    } catch (error) {
        console.log("Error Deleting the assignment: ", error);
        throw error;
    }
}

// for teachers
export const updateAssignement = async (id, obj) => {
    try {
        const token = localStorage.getItem("TeacherToken");
        const response = await fetch(`${backEnd_url}/teacher/assignment/${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Failed to update the assignment: ", error);
        throw error;
    }
}


// for students
export const fetchAssignments = async () => {
    try {
        const token = localStorage.getItem("StudentToken")
        const response = await fetch(`${backEnd_url}/fetchAssignment_Student`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },

        });
        const data = response.json();
        return data;
    } catch (error) {
        console.log("Could not fetch the assignments ", error);
    }
}

// for student
export const uploadFiles = async (formData) => {
    try {
        const token = localStorage.getItem("StudentToken");
        const response = await fetch(`${backEnd_url}/submitAssignment`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`
                // Note: Don't set Content-Type when sending FormData
            },
            body: formData,
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Could not upload the file:", error);
        return { success: false, message: "Upload failed: " + error.message };
    }
}
// for students
export const fetchFeedback = async () => {
    try {
        const token = localStorage.getItem("StudentToken");
        const response = await fetch(`${backEnd_url}/student-evaluations`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = response.json();
        return data;
    } catch (error) {
        console.log("Could not fetch the assignment ", error)
    }
}

export const fetchSubmittedAssignment = async () => {
    try {
        const token = localStorage.getItem("TeacherToken");
        const response = await fetch(`${backEnd_url}/fetchAllstudent-evaluations`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = response.json();
        return data;
    } catch (error) {
        console.log("Could not fetch the assignment ", error)
    }
}

// for students
export const submitAssignment = async (assignObj) => {
    try {
        const token = await localStorage.getItem("StudentToken");
        const response = await fetch(`${backEnd_url}/assignmentSubmitionStatus`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(assignObj),  // Convert JS object to JSON string
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error updating the assignment status: ", error);
        throw error;
    }
};

// Evaluation Management APIs

// Update evaluation (manual override)
export const updateEvaluation = async (evaluationId, updates) => {
    try {
        const teacherToken = localStorage.getItem("TeacherToken");
        const response = await fetch(`${backEnd_url}/teacher/evaluation/${evaluationId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${teacherToken}`
            },
            body: JSON.stringify(updates)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating evaluation:", error);
        throw error;
    }
};

// Toggle publish status for an evaluation
export const togglePublishEvaluation = async (evaluationId, publishData) => {
    try {
        const teacherToken = localStorage.getItem("TeacherToken");
        const response = await fetch(`${backEnd_url}/teacher/evaluation/${evaluationId}/publish`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${teacherToken}`
            },
            body: JSON.stringify(publishData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error toggling publish status:", error);
        throw error;
    }
};

// Bulk publish evaluations
export const bulkPublishEvaluations = async (publishData) => {
    try {
        const teacherToken = localStorage.getItem("TeacherToken");
        const response = await fetch(`${backEnd_url}/teacher/evaluations/bulk-publish`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${teacherToken}`
            },
            body: JSON.stringify(publishData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error bulk publishing:", error);
        throw error;
    }
};


































