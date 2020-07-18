const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Plant = require("../models/Plant.model");
const Action = require("../models/Action.model");
const Collection = require("../models/Collection.model");
const uploadCloud = require("../configs/cloudinary-setup");

const routeGuard = require("../configs/route-guard.config");

// GET Open goal details
router.get("/all-collections", routeGuard, (req, res, next) => {
  Collection.find()
    .populate("collectionPlants")
    .populate("collectionOwner")
    .then((allCollections) => {
      res.status(200).json(allCollections);
    })
    .catch((err) => res.status(500).json(err));
});

// POST Create a goal
router.post("/create-plant", routeGuard, (req, res, next) => {
  const { plantName, plantPicture, plantDate, plantOwner } = req.body;
  Goal.create({
    plantName,
    plantPicture,
    plantDate,
    plantOwner,
  })
    .then((newGoal) => {
      User.findByIdAndUpdate(
        newGoal.goalOwner,
        { $push: { goals: newGoal._id } },
        { new: true }
      )
        .populate({
          path: "goals",
          model: "Goal",
          populate: {
            path: "goalActions",
            model: "Action",
          },
        })
        .then((updatedUser) => {
          res.status(200).json({ currentUser: updatedUser });
        });
    })
    .catch((errorMessage) => console.log(errorMessage));
});

// POST Create a collection
router.post("/create-collection", routeGuard, (req, res, next) => {
  const { collectionName, collectionDescription, collectionOwner } = req.body;
  Collection.create({
    collectionName,
    collectionDescription,
    collectionOwner,
  })
    .then((newCollection) => {
      User.findByIdAndUpdate(
        newCollection.collectionOwner,
        { $push: { collections: newCollection._id } },
        { new: true }
      )
        .populate({
          path: "collections",
          model: "Collection",
          populate: {
            path: "collectionPlants",
            model: "Plant",
          },
        })
        .then((updatedUser) => {
          res.status(200).json({ currentUser: updatedUser });
        });
    })
    .catch((errorMessage) => console.log(errorMessage));
});

// POST Upload plant image
router.post(
  "/plant-image-upload",
  uploadCloud.single("plantImage"),
  (req, res) => {
    if (!req.file) {
      res.status(500).json({ errorMessage: "There's no file to be uploaded!" });
    } else {
      res.status(200).json({ secure_url: req.file.secure_url });
    }
  }
);

// POST Update goal details
router.post("/:goalId/update", routeGuard, (req, res, next) => {
  const { goalName, goalDueDate, goalTarget } = req.body;
  Goal.findByIdAndUpdate(
    req.params.goalId,
    {
      goalName,
      goalDueDate,
      goalTarget,
    },
    { new: true }
  )
    .populate("goalActions")
    .then((updatedGoal) => {
      User.findById(updatedGoal.goalOwner)
        .populate({
          path: "goals",
          model: "Goal",
          populate: {
            path: "goalActions",
            model: "Action",
          },
        })
        .then((userFound) => {
          res.status(200).json(userFound);
        })
        .catch((err) => res.status(500).json(err));
    })
    .catch((err) => res.status(500).json(err));
});

// POST Delete goal
router.post("/:goalId/delete", routeGuard, (req, res, next) => {
  Goal.findByIdAndDelete(req.params.goalId)
    .then(() => {
      User.findByIdAndUpdate(
        req.user._id,
        { $pull: { goals: req.params.goalId } },
        { new: true }
      )
        .then((updatedUser) => {
          res.status(200).json({ currentUser: updatedUser });
        })
        .catch((err) => res.status(500).json(err));
    })
    .catch((err) => res.status(500).json(err));
});

// POST Create an action
router.post("/:goalId/new-action", routeGuard, (req, res, next) => {
  const { actionName, actionDescription, actionOwner } = req.body.actionData;
  Action.create({
    actionName,
    actionOwner,
    actionDescription,
  })
    .then((actionCreated) => {
      Goal.findByIdAndUpdate(
        req.params.goalId,
        { $push: { goalActions: actionCreated._id } },
        { new: true }
      )
        .populate("goalActions")
        .then((updatedGoal) => {
          User.findById(updatedGoal.goalOwner)
            .populate({
              path: "goals",
              model: "Goal",
              populate: {
                path: "goalActions",
                model: "Action",
              },
            })
            .then((updatedUser) => {
              res.status(200).json({ updatedUser });
            });
        })
        .catch((err) => console.log("Error 1: ", err));
    })
    .catch((err) => console.log("Error 2: ", err));
});

// POST Update an action
router.post("/:goalId/:actionId/update", routeGuard, (req, res, next) => {
  const { actionName, actionDescription, actionOwner, actionId } = req.body;
  Action.findByIdAndUpdate(
    actionId,
    {
      actionName,
      actionDescription,
      actionOwner,
    },
    { new: true }
  )
    .then(() => {
      Goal.findByIdAndUpdate(req.params.goalId, { new: true })
        .populate("goalActions")
        .then((updatedGoal) => {
          User.findById(updatedGoal.goalOwner)
            .populate({
              path: "goals",
              model: "Goal",
              populate: {
                path: "goalActions",
                model: "Action",
              },
            })
            .then((updatedUser) => {
              res.status(200).json({ updatedUser });
            });
        })
        .catch((err) => console.log("Error 1: ", err));
    })
    .catch((err) => console.log("Error 2: ", err));
});

router.post("/:goalId/:actionId/is-done", routeGuard, (req, res, next) => {
  Action.findByIdAndUpdate(
    req.params.actionId,
    { isDone: "true" },
    { new: true }
  )
    .then((actionDone) => {
      User.findById(actionDone.actionOwner)
        .populate({
          path: "goals",
          model: "Goal",
          populate: {
            path: "goalActions",
            model: "Action",
          },
        })
        .then((updatedUser) => {
          res.status(200).json({ updatedUser });
        });
    })
    .catch((err) => console.log("Error 1: ", err));
});

router.post("/:goalId/:actionId/not-done", routeGuard, (req, res, next) => {
  Action.findByIdAndUpdate(
    req.params.actionId,
    { isDone: "false" },
    { new: true }
  )
    .then((actionDone) => {
      User.findById(actionDone.actionOwner)
        .populate({
          path: "goals",
          model: "Goal",
          populate: {
            path: "goalActions",
            model: "Action",
          },
        })
        .then((updatedUser) => {
          res.status(200).json({ updatedUser });
        });
    })
    .catch((err) => console.log("Error 1: ", err));
});

// POST Delete an action
router.post("/:goalId/:actionId/delete", routeGuard, (req, res, next) => {
  Action.findByIdAndDelete(req.params.actionId).then((actionDeleted) => {
    Goal.findByIdAndUpdate(
      req.params.goalId,
      { $pull: { goalActions: actionDeleted._id } },
      { new: true }
    )
      .then((updatedGoal) => {
        User.findById(updatedGoal.goalOwner)
          .populate({
            path: "goals",
            model: "Goal",
            populate: {
              path: "goalActions",
              model: "Action",
            },
          })
          .then((updatedUser) => {
            res.status(200).json(updatedUser);
          });
      })
      .catch((err) => res.status(500).json(err));
  });
});

module.exports = router;
