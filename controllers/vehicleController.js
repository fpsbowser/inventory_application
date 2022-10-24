const Vehicle = require("../models/vehicle");
const Manufacture = require("../models/manufacture");
const Type = require("../models/type");
const async = require("async");

exports.index = (req, res) => {
  async.parallel(
    {
      vehicle_count(callback) {
        Vehicle.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      manufacture_count(callback) {
        Manufacture.countDocuments({}, callback);
      },
      type_count(callback) {
        Type.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Inventory Home",
        error: err,
        data: results,
      });
    }
  );
};

// Display list of all Vehicles.
exports.vehicle_list = function (req, res, next) {
  Vehicle.find({}, "model make price")
    .sort({ model: -1 })
    .populate("make")
    .exec(function (err, list_vehicles) {
      if (err) {
        return next(err);
      }
      res.render("vehicle_list", {
        title: "Vehicle List",
        vehicle_list: list_vehicles,
      });
    });
};

// Display detail page for a specific Vehicle.
exports.vehicle_detail = (req, res, next) => {
  async.parallel(
    {
      vehicle(callback) {
        Vehicle.findById(req.params.id)
          .populate("make")
          .populate("type")
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.vehicle == null) {
        // No results.
        const err = new Error("Vehicle not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("vehicle_detail", {
        title: results.vehicle.model,
        vehicle: results.vehicle,
      });
    }
  );
};

// Display Vehicle create form on GET.
exports.vehicle_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Vehicle create GET");
};

// Handle Vehicle create on POST.
exports.vehicle_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Vehicle create POST");
};

// Display Vehicle delete form on GET.
exports.vehicle_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Vehicle delete GET");
};

// Handle Vehicle delete on POST.
exports.vehicle_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Vehicle delete POST");
};

// Display Vehicle update form on GET.
exports.vehicle_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Vehicle update GET");
};

// Handle Vehicle update on POST.
exports.vehicle_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Vehicle update POST");
};
