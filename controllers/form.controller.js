import {
	connectDB as connectTeachersDB,
	SQTeacher,
} from "../models/teacher-table.js";
import {
<<<<<<< HEAD
	connectDB as connectSupplyFormDB,
	SQShoppingForm,
} from "../models/shopping-form-table.js";
=======
    connectDB as connectSupplyFormDB,
    SQShoppingForm
} from '../models/shopping-form-table.js';
>>>>>>> arthur-backend
import {
	connectDB as connectTransactionDB,
	SQTransaction,
} from "../models/transaction-table.js";

/**
 * Gets a teacher's profile.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * */
const getTeacher = async (req, res) => {
	try {
		res.json(req.profile);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
};

/**
 * Populates profile field with teacher information.
 *
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
			return res.status("400").json({
				error: "Teacher not found",
			});
		}

		req.profile = teacher;

		return next();
	} catch (err) {
		return res.status("400").json({
			error: "Could not retrieve teacher",
		});
	}
};

/**
 * Adds a teacher to the database.
 *
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
			return res.status("400").json({
				error: "Teach not found",
			});
		}
		res.json(teacher);
	} catch (err) {
		console.log(err);
		return res.status("400").json({
			error: "Could not create teacher",
		});
	}
};

/**
 * Adds a supply to the form database.
 *
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

		if (!sup) return res.status(400).json({ error: "Sup empty." });
		res.json(sup);
	} catch (err) {
		if (err)
			return res
				.status(400)
				.json({ error: "addSupply - can't connect." });
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

		if (!supplies)
			return res
				.status(400)
				.json({ error: "fetchForm - supplies not found.." });

		return res.status(200).json(supplies);
	} catch {
		return res.status(400).json({ error: "fetchForm - can't connect" });
	}
};

const submitTransaction = async (req, res) => {
	try {
		// await connectTransactionSupplyDB();
		await connectTransactionDB();
		var datetime = new Date();
		var time = {
			year: datetime.getFullYear(),
			month: datetime.getMonth() + 1,
			day: datetime.getDate(),
			hour: datetime.getHours(),
			minute: datetime.getMinutes(),
			second: datetime.getSeconds(),
		};
		const infoObj = {
			transactionID: "rand",
			teacher_id: req.teacher_id,
			school_id: req.school_id,
			time: time,
		};

		const info = await SQTransaction.create(infoObj);
		if (!info)
			return res
				.status(400)
				.json({ error: "Transaction Info not added." });

		const supplyObj = {
			transactionID: "rand",
			supply_taken: req.itemsObj,
		};

		const supply = await SQTransactionSupply.create(supplyObj);
		if (!supply)
			return res
				.status(400)
				.json({ error: "Transaction Supply not added." });

		return res.status(200);
	} catch {
		return res
			.status(400)
			.json({ error: "Submit Transaction - cant submit" });
	}
};

export default {
	getTeacher,
	teacherByID,
	addTeacher,
	addSupply,
	fetchShopForm,
	submitTransaction,
};
