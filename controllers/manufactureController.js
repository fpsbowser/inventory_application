const Manufacture = require("../models/manufacture");
const Vehicle = require("../models/vehicle");
const async = require("async");
const { body, validationResult } = require("express-validator");

// Display list of all Manufactures.
exports.manufacture_list = function (req, res, next) {
  Manufacture.find({}, "name headquarters")
    .sort({ name: 1 })
    // .populate("make")
    .exec(function (err, list_manufactures) {
      if (err) {
        return next(err);
      }
      res.render("manufacture_list", {
        title: "Manufacture List",
        manufacture_list: list_manufactures,
      });
    });
};

// Display detail page for a specific Manufacture.
exports.manufacture_detail = (req, res, next) => {
  async.parallel(
    {
      manufacture(callback) {
        Manufacture.findById(req.params.id).exec(callback);
      },
      manufacture_vehicles(callback) {
        Vehicle.find({ make: req.params.id }, "model price color miles")
          .sort({ model: 1 })
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.manufacture == null) {
        // No results.
        const err = new Error("Manufacture not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("manufacture_detail", {
        title: results.manufacture.model,
        manufacture: results.manufacture,
        manufacture_vehicles: results.manufacture_vehicles,
      });
    }
  );
};

// Display Manufacture create form on GET.
exports.manufacture_create_get = (req, res) => {
  res.render("manufacture_form", { title: "Create Manufacture" });
};

// Handle Manufacture create on POST.
exports.manufacture_create_post = [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Company name must be specified."),
  body("founded", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("founder")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Founder must be specified."),
  body("headquarters")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Headquarters must be specified."),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage(
      "Description must be specified and at least 10 characters long."
    ),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("manufacture_form", {
        title: "Create Manufacture",
        manufacture: req.body,
        errors: errors.array(),
      });
      return;
    }
    // Data from form is valid.

    // Create an Manufacture object with escaped and trimmed data.
    const manufacture = new Manufacture({
      name: req.body.name,
      founded: req.body.founded,
      founder: req.body.founder,
      headquarters: req.body.headquarters,
      description: req.body.description,
    });
    manufacture.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful - redirect to new Manufacture record.
      res.redirect(manufacture.url);
    });
  },
];

// Display Manufacture delete form on GET.
exports.manufacture_delete_get = (req, res, next) => {
  async.parallel(
    {
      manufacture(callback) {
        Manufacture.findById(req.params.id).exec(callback);
      },
      manufactures_vehicles(callback) {
        Vehicle.find({ make: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.manufacture == null) {
        // No results.
        res.redirect("/inventory/manufactures");
      }
      // Successful, so render.
      res.render("manufacture_delete", {
        title: "Delete Manufacture",
        manufacture: results.manufacture,
        manufactures_vehicles: results.manufactures_vehicles,
      });
    }
  );
};

// Handle Manufacture delete on POST.
exports.manufacture_delete_post = (req, res, next) => {
  async.parallel(
    {
      manufacture(callback) {
        Manufacture.findById(req.body.manufactureid).exec(callback);
      },
      manufactures_vehicles(callback) {
        Vehicle.find({ make: req.body.manufactureid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      if (results.manufactures_vehicles.length > 0) {
        // Manufacture has vehicles. Render in same way as for GET route.
        res.render("manufacture_delete", {
          title: "Delete Manufacture",
          manufacture: results.manufacture,
          manufacture_vehicles: results.manufactures_vehicles,
        });
        return;
      }
      // Manufacture has no vehicles. Delete object and redirect to the list of manufactures.
      Manufacture.findByIdAndRemove(req.body.manufactureid, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to author list
        res.redirect("/inventory/manufactures");
      });
    }
  );
};

// Display Manufacture update form on GET.
exports.manufacture_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Manufacture update GET");
};

// Handle Manufacture update on POST.
exports.manufacture_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Manufacture update POST");
};
