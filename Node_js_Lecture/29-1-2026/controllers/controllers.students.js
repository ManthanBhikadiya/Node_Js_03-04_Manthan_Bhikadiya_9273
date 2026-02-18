import student from "../models/models.students.js";

// Create Student

export const createStudent = async (req, res) => {
    try {
        const student = await student(req.body)
        await student.save()
        res.status(201).json(student)
    } catch (err) {
        res.status(400).json({ error: err.massage })
    }
};

// Read Student

export const getStudents = async (req, res) => {
    try {
        const students = await student.find()
        res.status(200).json(students)
    } catch (err) {
        res.status(400).json({ error: err.massage })
    }
}

// getsingle student

export const getStudentById = async (req, res) => {
    try {
        const students = await student.findById(req.params.id)
        res.status(200).json(students)
    } catch (err) {
        res.status(400).json({ error: err.massage })
    }
}

// update student

export const updateStudent = async (req, res) => {
    try {
        const updatedStudent = await student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.status(200).json(student)
    } catch (err) {
        res.status(400).json({ error: err.massage })
    }
}

// delete student

export const deleteStudent = async (req, res) => {
    try {
        await student.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "student deleted successfully" })
    } catch (err) {
        res.status(400).json({ error: err.massage })
    }
}