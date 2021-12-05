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
import {
  connectDB as connectTempTransactionDB,
  SQTempTransaction,
} from '../models/temp-transaction-table.js';
import transactionByID from '../helpers/form.helper.js';

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
    await connectTempTransactionDB();
    const infoObj = {
      transactionId: req.body.id, // FIXME : Placeholder ID; Shouldn't pass id in final version
      teacherId: req.body.teacher_id,
      schoolId: req.body.school_id,
      items: req.body.items,
    };

    const transaction = await SQTempTransaction.create(infoObj);

    if (!transaction) {
      console.log('Transaction Info not added.');
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.status(200).json(infoObj);
  } catch (err) {
    return res.status(400).json({ error: 'Submit Transaction - cant submit' });
  }
};

/**
 * Transfers transaction from temporary transaction table (tempTransactionTable) to the final
 * transaction table, deleting the entry in the former table in the process.
 *
 * @param {Object} req - Request Object with structure { id: INT }
 * @param {Object} res - Response Object
 */
const approveTransaction = async (req, res) => {
  try {
    // Get transaction from temp table
    const transaction = await transactionByID(req.body.id);

    if (!transaction) {
      console.log('Row not found in temp table');
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    await connectTransactionDB();
    const finalTransaction = await SQTransaction.create(transaction.toJSON());

    if (!finalTransaction) {
      console.log('Transaction approval failed');
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Delete transaction from temp table
    await connectTempTransactionDB();
    transaction.destroy();

    return res.status(200).json(finalTransaction);
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default {
  getTeacher,
  teacherByID,
  addTeacher,
  addSupply,
  fetchShopForm,
  submitTransaction,
  approveTransaction,
};
