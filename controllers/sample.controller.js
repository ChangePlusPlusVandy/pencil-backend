import {
    connectDB as connectTeachersDB,
    SQTeacher
} from '../models/teacher-table.js';

const get = async (req, res, next) => {
    try {
        await connectTeachersDB();
        const result = await SQTeacher.findAll();

        res.json(result);


    }
    catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
    }

export default {
    get
}