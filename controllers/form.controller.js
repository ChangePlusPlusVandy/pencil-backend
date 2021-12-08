import {
  connectDB as connectTeachersDB,
  SQTeacher,
} from '../models/teacher-table.js';
import {
  connectDB as connectSupplyFormDB,
  SQShoppingForm,
} from '../models/shopping-form-table.js';
import {
  connectDB as connectTransactionDB,
  SQTransaction,
} from '../models/transaction-table.js';

/**
 * Gets a teacher's profile.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * */
const getTeacher = async (req, res) => {
  try {
    return res.json(req.profile);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Populates profile field with teacher information.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {function} next - Next middleware.
 * @param {id} id - Teacher id.
 * @returns {function} - Call to next controller.
 * */
const teacherByID = async (req, res, next, id) => {
  try {
    await connectTeachersDB();
    const teacher = await SQTeacher.findOne({ where: { teacherkey: id } });

    if (!teacher) {
      return res.status(400).json({
        error: 'Teacher not found',
      });
    }

    req.profile = teacher;

    return next();
  } catch (err) {
    return res.status(400).json({
      error: 'Could not retrieve teacher',
    });
  }
};

/**
 * Adds a teacher to the database.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * */
const addTeacher = async (req, res) => {
  try {
    console.log(req.body);
    await connectTeachersDB();
    const teacher = await SQTeacher.create({
      teacherkey: req.body.teacherkey,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      schoolId: req.body.schoolId,
    });

    if (!teacher) {
      return res.status(400).json({
        error: 'Teacher not found',
      });
    }
    return res.status(200).json(teacher);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: 'Could not create teacher',
    });
  }
};

/**
 * Adds a supply to the form database.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * */
const addSupply = async (req, res) => {
  try {
    await connectSupplyFormDB();
    const sup = await SQShoppingForm.create({
      itemId: req.body.itemId,
      itemName: req.body.itemName,
      maxLimit: req.body.maxLimit,
      itemOrder: req.body.itemOrder,
    });

    if (!sup) {
      console.log('addSupply : Sup empty.');
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(200).json(sup);
  } catch (err) {
    console.log("addSupply : can't connect");
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Adds a supply to the form database.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * */
const updateSupply = async (req, res) => {
  try {
    await connectSupplyFormDB();
    console.log(req.body, 'body');
    // const sup = await SQShoppingForm.create({
    //   itemId: req.body.itemId,
    //   itemName: req.body.itemName,
    //   maxLimit: req.body.maxLimit,
    //   itemOrder: req.body.itemOrder,
    // });

    const wipe = await SQShoppingForm.destroy({
      where: {},
      truncate: true,
    });

    const sup = await SQShoppingForm.bulkCreate(req.body).catch((err) => {
      console.log(err);
    });

    if (!sup) {
      console.log(sup);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(200).json(sup);
  } catch (err) {
    console.log("addSupply : can't connect");
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Fetches the Supply Form from supply form table.
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object
 */
const fetchShopForm = async (req, res) => {
  try {
    await connectSupplyFormDB();
    const supplies = await SQShoppingForm.findAll();

    if (!supplies) {
      console.log('fetchForm - supplies not found..');
      return res.status(400).json({ error: 'Internal Server Error' });
    }
    return res.status(200).json(supplies);
  } catch (err) {
    console.log('fetchForm - can not connect');
    return res.status(400).json({ error: 'Internal Server Error' });
  }
};

/**
 * Submits a User Transaction and adds data to the Transaction Table.
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object
 */
const submitTransaction = async (req, res) => {
  try {
    await connectTransactionDB();
    const infoObj = {
      transactionId: 'rand',
      teacherId: req.body.teacher_id,
      schoolId: req.body.school_id,
      items: req.body.items,
    };

    const transaction = await SQTransaction.create(infoObj);

    if (!transaction) {
      console.log('Transaction Info not added.');
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.status(200).json(infoObj);
  } catch (err) {
    return res.status(400).json({ error: 'Submit Transaction - cant submit' });
  }
};

export default {
  getTeacher,
  teacherByID,
  addTeacher,
  addSupply,
  fetchShopForm,
  submitTransaction,
  updateSupply,
};
