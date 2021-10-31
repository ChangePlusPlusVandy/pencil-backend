import db from '../db/index.js'

const get = async (req, res, next) => {
    try {
        let result = await db.all()

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