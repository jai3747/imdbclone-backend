const Actor = require("../models/actorSchema");

const router= require("express").Router();

router.get("/",async (req,res) => {
    try {
        const actors = await Actor.find();
        res.json(actors);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})

router.post("/add-actor",async(req,res) => {
    try {
        const { name, gender,bio, DOB,image } = req.body;
        const actor = new Actor({
            name,
            gender,
            bio,
            DOB,
            image
        });
        await actor.save();
        res.json(actor);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})



module.exports = router