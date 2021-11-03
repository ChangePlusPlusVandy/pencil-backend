import {
    connectDB as connectTeachersDB,
    SQTeacher
} from '../models/teacher-table.js';


/**
 * Form page containing form with school items for teacher.
 * 
 * @returns {Object} - Page containing form.
 * */
const getTeacher = async (req, res, next) => {
    try {
        res.json(req.profile);
    }
    catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
}

/**
 * Form page containing form with school items for teacher.
 * 
 * @returns {Object} - Page containing form.
 * */
const teacherByID = async (req, res, next, id) => {
    try {
        await connectTeachersDB();
        const teacher = await SQTeacher.findOne({where: {teacherkey: id}});

        if (!teacher){
        return res.status('400').json({
            error: "Teacher not found"
        })
        
        }
        
        req.profile = teacher

        return next()
    } catch (err) {
        return res.status('400').json({
        error: "Could not retrieve teacher"
        })
    }
}



const addTeacher = async (req, res, next) => {
    try {
        console.log(req.body);
        await connectTeachersDB();
        const teacher = await SQTeacher.create({
            teacherkey: req.body.teacherkey,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            school: req.body.school,
        });

        if (!teacher){
        return res.status('400').json({
            error: "Teacher not found"
        })
        
        }
        res.json(teacher);
        
    } catch (err) {
        console.log(err)
        return res.status('400').json({
        error: "Could not create teacher",
        })
    }
}

export default {
    getTeacher,
    teacherByID,
    addTeacher

}