const Producer = require("../models/producerSchema");

const router= require("express").Router();

router.get("/",async (req,res) => {
    try {
        const producers = await Producer.find();
        res.json(producers);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})

router.post("/add-producer",async(req,res) => {
    try {
        const { name, gender,bio, DOB,image } = req.body;
        const producer = new Producer({
            name,
            gender,
            bio,
            DOB,
            image
        });
        await producer.save();
        res.json(producer);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})



module.exports = router