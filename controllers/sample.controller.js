import {
  connectDB as connectTeachersDB,
  SQTeacher,
} from '../models/teacher-table';

const get = async (req, res) => {
  try {
    await connectTeachersDB();
    const result = await SQTeacher.findAll();

    res.json(result);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

export default {
  get,
};
