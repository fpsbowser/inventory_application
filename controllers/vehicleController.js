const Vehicle = require("../models/vehicle");
const Manufacture = require("../models/manufacture");
const Type = require("../models/type");
const async = require("async");
const { body, validationResult } = require("express-validator");

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
exports.vehicle_create_get = (req, res, next) => {
  // Get all manufactures and types, which we can use for adding to our book.
  async.parallel(
    {
      manufactures(callback) {
        Manufacture.find(callback).sort({ name: 1 });
      },
      types(callback) {
        Type.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("vehicle_form", {
        title: "Create Vehicle",
        manufactures: results.manufactures,
        types: results.types,
      });
    }
  );
};

// Handle Vehicle create on POST.
exports.vehicle_create_post = [
  // Convert the type to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.type)) {
      req.body.type =
        typeof req.body.type === "undefined" ? [] : [req.body.type];
    }
    next();
  },

  // Validate and sanitize fields.
  body("model", "Model must be specified!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("make.*", "Must select a manufacture.").escape(),
  body("price", "Must set a price, numeric characters only")
    .trim()
    .isNumeric({ no_symbols: true })
    .escape(),
  body("color", "Must specify color!").trim().isLength({ min: 1 }).escape(),
  body("miles", "Must set miles, numeric characters only")
    .trim()
    .isNumeric({ no_symbols: true })
    .escape(),
  body("description", "Must add notes about the vehicle")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("type.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Vehicle object with escaped and trimmed data.
    const vehicle = new Vehicle({
      model: req.body.model,
      make: req.body.make,
      price: req.body.price,
      color: req.body.color,
      miles: req.body.miles,
      description: req.body.description,
      type: req.body.type,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all manufactures and types for form.
      async.parallel(
        {
          manufactures(callback) {
            Manufacture.find(callback);
          },
          types(callback) {
            Type.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          // Mark our selected genres as checked.
          for (const type of results.types) {
            if (vehicle.type.includes(type._id)) {
              type.checked = "true";
            }
          }
          res.render("vehicle_form", {
            title: "Create Vehicle",
            manufactures: results.manufactures,
            types: results.types,
            vehicle,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Save vehicle.
    vehicle.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful: redirect to new vehicle record.
      res.redirect(vehicle.url);
    });
  },
];

// Display Vehicle delete form on GET.
exports.vehicle_delete_get = (req, res, next) => {
  async.parallel(
    {
      vehicle(callback) {
        Vehicle.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.vehicle == null) {
        // No results.
        res.redirect("/inventory/vehicles");
      }
      // Successful, so render.
      res.render("vehicle_delete", {
        title: "Delete Vehicle",
        vehicle: results.vehicle,
      });
    }
  );
};

// Handle Vehicle delete on POST.
exports.vehicle_delete_post = (req, res, next) => {
  async.parallel(
    {
      vehicle(callback) {
        Vehicle.find({ make: req.body.vehicleid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      Vehicle.findByIdAndRemove(req.body.vehicleid, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to vehicle list
        res.redirect("/inventory/vehicles");
      });
    }
  );
};

// Display Vehicle update form on GET.
exports.vehicle_update_get = (req, res, next) => {
  // get Vehicle, Manufacture, and Type to populate form values
  async.parallel(
    {
      vehicle(callback) {
        Vehicle.findById(req.params.id)
          .populate("make")
          .populate("type")
          .exec(callback);
      },
      manufactures(callback) {
        Manufacture.find(callback);
      },
      types(callback) {
        Type.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.vehicle == null) {
        // no results
        const err = new Error("Vehicle not found");
        err.status = 404;
        return next(err);
      }
      // Success
      // Mark selected types
      for (const type of results.types) {
        for (const vehicleType of results.vehicle.type) {
          if (type._id.toString() === vehicleType._id.toString()) {
            type.checked = "true";
          }
        }
      }
      res.render("vehicle_form", {
        title: "Update Vehicle",
        manufactures: results.manufactures,
        types: results.types,
        vehicle: results.vehicle,
      });
    }
  );
};

// Handle Vehicle update on POST.
exports.vehicle_update_post = [
  // Convert the type to an array
  (req, res, next) => {
    if (!Array.isArray(req.body.type)) {
      req.body.type =
        typeof req.body.type === "undefined" ? [] : [req.body.type];
    }
    next();
  },

  // Validate and sanitize fields.
  body("model", "Model must be specified!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("make.*", "Must select a manufacture.").escape(),
  body("price", "Must set a price, numeric characters only")
    .trim()
    .isNumeric({ no_symbols: true })
    .escape(),
  body("color", "Must specify color!").trim().isLength({ min: 1 }).escape(),
  body("miles", "Must set miles, numeric characters only")
    .trim()
    .isNumeric({ no_symbols: true })
    .escape(),
  body("description", "Must add notes about the vehicle")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("type.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped/trimmed data and old id.
    const vehicle = new Vehicle({
      model: req.body.model,
      make: req.body.make,
      price: req.body.price,
      color: req.body.color,
      miles: req.body.miles,
      description: req.body.description,
      type: typeof req.body.type === "undefined" ? [] : req.body.type,
      _id: req.params.id, //This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all manufactures and types for form.
      async.parallel(
        {
          manufactures(callback) {
            Manufacture.find(callback);
          },
          types(callback) {
            Type.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          // Mark our selected genres as checked.
          for (const type of results.types) {
            if (vehicle.type.includes(type._id)) {
              type.checked = "true";
            }
          }
          res.render("vehicle_form", {
            title: "Create Vehicle",
            manufactures: results.manufactures,
            types: results.types,
            vehicle,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Update the record.
    Vehicle.findByIdAndUpdate(req.params.id, vehicle, {}, (err, thevehicle) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to vehicle detail page.
      res.redirect(thevehicle.url);
    });
  },
];
