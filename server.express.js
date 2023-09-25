const express = require("express"),
  { MongoClient, ObjectId } = require("mongodb"),
  hbs = require("express-handlebars").engine,
  cookie = require("cookie-session"),
  app = express(),
  port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("views"));

app.engine("handlebars", hbs());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(
  cookie({
    name: "session",
    keys: ["username", "password"],
  })
);

const url = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.ufd3g9y.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(url);

// connect to plant data set
let collection = null;
let userCollection = null;

async function run() {
  await client.connect();
  collection = await client.db("dataset").collection("test");
  userCollection = await client.db("dataset").collection("users");
}

run();

// middleware to check connection so you don't have to check inside of every route handler
app.use((req, res, next) => {
  if (collection !== null && userCollection != null) {
    next();
  } else {
    res
      .status(503)
      .send("Service Unavailable: Database connection not established.");
  }
});

// user login
app.post("/create", async (req, res) => {
  const result = await userCollection.insertOne(req.body);
  req.session.username = req.body.username;
  res.redirect("tracker.html");
});

app.post("/login", async (req, res, next) => {
  const accounts = await client
    .db("dataset")
    .collection("users")
    .find()
    .toArray();

  req.session.login = false;

  accounts.forEach((e) => {
    if (req.body.password === e.password && req.body.username === e.username) {
      req.session.login = true;
      req.session.username = req.body.username;
    }
  });

  if (req.session.login) {
    res.redirect("tracker.html");
  } else {
    res.render("index", {
      msg: "login failed: incorrect password",
      layout: false,
    });
  }
});

app.get("/", (req, res, next) => {
  res.render("index", { msg: "", layout: false });
});

// add some middleware that always sends unauthenicaetd users to the login page
app.use(function (req, res, next) {
  if (req.session.login === true) {
    next();
  } else
    res.render("index", {
      msg: "login failed: please try again",
      layout: false,
    });
});

app.get("/main.html", (req, res) => {
  res.render("main", { msg: "success you have logged in", layout: false });
});

// get plant data
app.get("/getPlantData", async (req, res) => {
  const plantData = await collection.find({}).toArray();
  res.json(plantData);
});

// calculate next watering date
const calculateNextWateringDate = function (plant) {
  // formats date correctly: YYYY-MM-DD
  function formatDate(originalDateString) {
    const dateComponents = originalDateString.split("/");
    const dateObject = new Date(
      dateComponents[2],
      dateComponents[0] - 1,
      dateComponents[1]
    );
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Add 1 to the month since it's 0-based
    const day = String(dateObject.getDate()).padStart(2, "0");
    const formattedDateString = `${year}-${month}-${day}`;
    return formattedDateString;
  }

  const lastWateredDate = new Date(plant.lastWatered);
  let nextWateringDate;
  let nextWateringDateString;

  switch (plant.plantType) {
    case "Succulent or Cactus":
    case "Air Plant":
      nextWateringDate = new Date(
        lastWateredDate.getTime() + 14 * 24 * 60 * 60 * 1000
      ).toLocaleDateString();
      nextWateringDateString = formatDate(nextWateringDate);
      break;
    case "Tropical":
    case "Aquatic":
      nextWateringDate = new Date(
        lastWateredDate.getTime() + 3 * 24 * 60 * 60 * 1000
      ).toLocaleDateString();
      nextWateringDateString = formatDate(nextWateringDate);
      break;
    default:
      nextWateringDate = new Date(
        lastWateredDate.getTime() + 7 * 24 * 60 * 60 * 1000
      ).toLocaleDateString();
      nextWateringDateString = formatDate(nextWateringDate);
      break;
  }
  return nextWateringDateString;
};

// add a plant
app.post("/addPlant", async (req, res) => {
  const nextWateringDate = calculateNextWateringDate(req.body);

  const plantData = {
    plantName: req.body.plantName,
    plantType: req.body.plantType,
    lastWatered: req.body.lastWatered,
    nextWater: nextWateringDate,
    user: req.session.username, // Associate the plant data with the logged-in user
  };

  try {
    const result = await collection.insertOne(plantData);

    // Retrieve and send back the updated plant data for the logged-in user
    const updatedPlantData = await collection
      .find({ user: req.session.username })
      .toArray();

    res.status(200).json(updatedPlantData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to add plant data." });
  }
});

// delete a plant
app.post("/deletePlant", async (req, res) => {
  const { plantId } = req.body;
  console.log(plantId);
  let current_user = req.session.username;

  const collection = client.db("dataset").collection("test");

  try {
    const result = await collection.deleteOne({
      _id: new ObjectId(plantId),
      user: current_user,
    });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Plant deleted successfully." });
    } else {
      // Plant not found or not deleted, send an error response
      res.status(404).json({ error: "Plant not found or not deleted." });
    }
  } catch (error) {
    console.error("Error deleting plant:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// update a plant
app.post("/editPlant", async (req, res) => {
  const nextWateringDate = calculateNextWateringDate(req.body);
  const result = await collection.updateOne(
    { _id: new ObjectId(req.body._id) },
    {
      $set: {
        plantName: req.body.plantName,
        plantType: req.body.plantType,
        lastWatered: req.body.lastWatered,
        nextWater: nextWateringDate,
      },
    }
  );

  res.json(result);
});

// //GET ME THE DAMN PLANTS
// app.get('/getPlants', async (req, res) => {
//   try {
//     const client = new MongoClient(url, { useNewUrlParser: true });
//     await client.connect();

//     const db = client.db("dataset");
//     const collection = db.collection("test");
    
//     let current_user = req.session.username;
//     req.body.user = current_user;

//     const allUserPlants = [{}];
    
//     for (let i = 0; i < collection.length; i++) {
//       if (collection[i].user === current_user) {
//         allUserPlants.push(collection[i]);
//       }
//     }
    
//     // Retrieve all plant entries from the collection
//     //const plants = await collection.find().toArray();

//     // Send the list of plants as JSON response
//     res.json(allUserPlants);
//     console.log(res.json(allUserPlants))
//   } catch (error) {
//     // Handle any errors, e.g., database connection or query errors
//     console.error('Error fetching plants:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   } finally {
//     // Close the database connection
//     client.close();
//   }
// });
//GET ME THE DAMN PLANTS
app.get('/getPlants', async (req, res) => {
  try {
    const client = new MongoClient(url, { useNewUrlParser: true });
    await client.connect();

    const db = client.db("dataset");
    const collection = db.collection("test");
    
    const loggedInUser = req.session.username;

    // Retrieve all plant entries from the collection
    const plants = await collection.find({user: loggedInUser}).toArray();

    // Send the list of plants as JSON response
    res.json(plants);
    console.log(res.json(plants))
  } catch (error) {
    // Handle any errors, e.g., database connection or query errors
    console.error('Error fetching plants:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Close the database connection
    client.close();
  }
});


// Start the server
app.listen(process.env.PORT || port);
