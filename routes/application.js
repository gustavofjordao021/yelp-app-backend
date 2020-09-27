const User = require("../models/User.model");
const axios = require("axios");
const Plant = require("../models/Plant.model");
const Action = require("../models/Action.model");
const express = require("express");
const Collection = require("../models/Collection.model");
const routeGuard = require("../configs/route-guard.config");
const uploadCloud = require("../configs/cloudinary-setup");
const { response } = require("express");

const router = express.Router();

// GET Retrieves all collections and populate them
router.get("/collections/:collectionId", routeGuard, (req, res) => {
  const { collectionId } = req.params;
  Collection.findById(collectionId)
    .populate("collectionPlants")
    .populate("collectionOwner")
    .then((allCollections) => {
      res.status(200).json(allCollections);
    })
    .catch((err) => res.status(500).json(err));
});

// POST Creates a plant
router.post("/create-plant", routeGuard, (req, res) => {
  const {
    plantDate,
    plantName,
    plantOwner,
    collectionId,
    plantPicture,
  } = req.body;
  Plant.create({
    plantDate,
    plantName,
    plantOwner,
    plantPicture,
  })
    .then((newPlant) => {
      Collection.findByIdAndUpdate(
        collectionId,
        { $push: { collectionPlants: newPlant._id } },
        { new: true }
      ).then(() => {
        User.findById(plantOwner)
          .populate({
            path: "collections",
            model: "Collection",
          })
          .then((updatedUser) => {
            res.status(200).json({ currentUser: updatedUser });
          });
      });
    })
    .catch((errorMessage) => console.log(errorMessage));
});

// POST Creates a collection
router.post("/create-collection", routeGuard, (req, res) => {
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
        })
        .then((updatedUser) => {
          res.status(200).json({ currentUser: updatedUser });
        });
    })
    .catch((errorMessage) => console.log(errorMessage));
});

// POST Delete a collection
router.post("/:collectionId/delete", routeGuard, (req, res) => {
  Collection.findByIdAndDelete(req.params.collectionId)
    .then(() => {
      User.findByIdAndUpdate(
        req.user._id,
        { $pull: { collections: req.params.collectionId } },
        { new: true }
      )
        .then((updatedUser) => {
          res.status(200).json({ currentUser: updatedUser });
        })
        .catch((err) => res.status(500).json(err));
    })
    .catch((err) => res.status(500).json(err));
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

// POST Fetches user's weather by location
router.post("/return-weather", (req, res) => {
  const { lat, lon } = req.body.locationInfo;
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=imperial`,
      (req, res)
    )
    .then((weatherInfo) => {
      res.status(200).json(weatherInfo.data);
    })
    .catch((err) => res.status(500).json(err));
});

// GET Fetches user's city by latitude/longitude
router.post("/return-location", (req, res) => {
  axios
    .get(`https://ipinfo.io?token=${process.env.IPINFO_API_KEY}`, (req, res))
    .then((locationInfo) => {
      res.status(200).json({ location: locationInfo.data.city });
    })
    .catch((err) => res.status(500).json(err));
});

// POST Update goal details
router.post("/:goalId/update", routeGuard, (req, res) => {
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
router.post("/:goalId/delete", routeGuard, (req, res) => {
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
router.post("/:goalId/new-action", routeGuard, (req, res) => {
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
router.post("/:goalId/:actionId/update", routeGuard, (req, res) => {
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

// POST Check actions as done
router.post("/:goalId/:actionId/is-done", routeGuard, (req, res) => {
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

// POST Check actions as not done
router.post("/:goalId/:actionId/not-done", routeGuard, (req, res) => {
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
router.post("/:goalId/:actionId/delete", routeGuard, (req, res) => {
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
