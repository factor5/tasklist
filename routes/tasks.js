const express = require("express");
const router = express.Router();
const mongojs = require("mongojs");
const db = mongojs(
  "mongodb://svelikov:alexandyr1@ds123513.mlab.com:23513/tasklist",
  ["tasks"]
);

router.get("/tasks", (req, res, next) => {
  db.tasks.find((err, tasks) => {
    if (err) {
      res.send(err);
    }
    res.json(tasks);
  });
});

router.get("/task/:id", (req, res, next) => {
  db.tasks.findOne({ _id: mongojs.ObjectId(req.params.id) }, (err, task) => {
    if (err) {
      res.send(err);
    }
    res.json(task);
  });
});

router.post("/task", (req, res, next) => {
  const task = req.body;
  if (!task.title || !(task.isDone + "")) {
    res.status(400);
    res.json({
      error: "Bad Data"
    });
  } else {
    db.tasks.save(task, (err, task) => {
      if (err) {
        res.send(err);
      }
      res.json(task);
    });
  }
});

router.delete("/task/:id", (req, res, next) => {
  db.tasks.remove({ _id: mongojs.ObjectId(req.params.id) }, (err, task) => {
    if (err) {
      res.send(err);
    }
    res.json(task);
  });
});

router.put("/task/:id", (req, res, next) => {
  const task = req.body;
  const updatedTask = {};

  updatedTask.isDone = task.isDone;

  if (task.title) {
    updatedTask.title = task.title;
  }

  console.log("server update:", updatedTask, task);
  if (!updatedTask) {
    res.status(400);
    res.json({ error: "Bad Data" });
  } else {
    db.tasks.update(
      { _id: mongojs.ObjectId(req.params.id) },
      updatedTask,
      {},
      (err, task) => {
        if (err) {
          res.send(err);
        }
        res.json(task);
      }
    );
  }
});

module.exports = router;
