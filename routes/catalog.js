const express = require("express");
const router = express.Router();

// Require controller modules
const vehicle_controller = require("../controllers/vehicleController");
const manufacture_controller = require("../controllers/manufactureController");
const type_controller = require("../controllers/typeController");

// VEHICLE ROUTES //

// GET catalog home page.
router.get("/", vehicle_controller.index);

// GET request for creating a Vehicle. NOTE This must come before routes that display Vehicle (uses id).
router.get("/vehicle/create", vehicle_controller.vehicle_create_get);

// POST request for creating Vehicle.
router.post("/vehicle/create", vehicle_controller.vehicle_create_post);

// GET request to delete Vehicle.
router.get("/vehicle/:id/delete", vehicle_controller.vehicle_delete_get);

// POST request to delete Vehicle.
router.post("/vehicle/:id/delete", vehicle_controller.vehicle_delete_post);

// GET request to update Vehicle.
router.get("/vehicle/:id/update", vehicle_controller.vehicle_update_get);

// POST request to update Vehicle.
router.post("/vehicle/:id/update", vehicle_controller.vehicle_update_post);

// GET request for one Vehicle.
router.get("/vehicle/:id", vehicle_controller.vehicle_detail);

// GET request for list of all Vehicle items.
router.get("/vehicles", vehicle_controller.vehicle_list);

// MANUFACTURE ROUTES //

// GET request for creating manufacture. NOTE This must come before route for id (i.e. display manufacture).
router.get(
  "/manufacture/create",
  manufacture_controller.manufacture_create_get
);

// POST request for creating manufacture.
router.post(
  "/manufacture/create",
  manufacture_controller.manufacture_create_post
);

// GET request to delete manufacture.
router.get(
  "/manufacture/:id/delete",
  manufacture_controller.manufacture_delete_get
);

// POST request to delete manufacture.
router.post(
  "/manufacture/:id/delete",
  manufacture_controller.manufacture_delete_post
);

// GET request to update manufacture.
router.get(
  "/manufacture/:id/update",
  manufacture_controller.manufacture_update_get
);

// POST request to update manufacture.
router.post(
  "/manufacture/:id/update",
  manufacture_controller.manufacture_update_post
);

// GET request for one manufacture.
router.get("/manufacture/:id", manufacture_controller.manufacture_detail);

// GET request for list of all manufactures.
router.get("/manufactures", manufacture_controller.manufacture_list);

// TYPE ROUTES //

// GET request for creating a type. NOTE This must come before route that displays type (uses id).
router.get("/type/create", type_controller.type_create_get);

//POST request for creating type.
router.post("/type/create", type_controller.type_create_post);

// GET request to delete type.
router.get("/type/:id/delete", type_controller.type_delete_get);

// POST request to delete type.
router.post("/type/:id/delete", type_controller.type_delete_post);

// GET request to update type.
router.get("/type/:id/update", type_controller.type_update_get);

// POST request to update type.
router.post("/type/:id/update", type_controller.type_update_post);

// GET request for one type.
router.get("/type/:id", type_controller.type_detail);

// GET request for list of all type.
router.get("/types", type_controller.type_list);

module.exports = router;
