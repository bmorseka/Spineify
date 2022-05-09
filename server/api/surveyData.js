const router = require("express").Router();
const SurveyData = require("../db/models/SurveyData");
module.exports = router;

// GET request

router.get("/", async (req, res, next) => {
  try {
    const data = await SurveyData.findAll();
    res.send(data);
  } catch (err) {
    next(err);
  }
});

// POST request

router.post("/", async (req, res, next) => {
  try {
    const newData = await SurveyData.create(req.body);
    console.log("REQ", req.body);
    //   {
    //   where: {
    //     discomfort_level: req.body.discomfort_level,
    //     pain_area: req.body.pain_area,
    //   },
    // });
    res.send(newData).status(201);
  } catch (err) {
    next(err);
  }
});