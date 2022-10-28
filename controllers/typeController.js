const Type = require("../models/type");
const Vehicle = require("../models/vehicle");
const { body, validationResult } = require("express-validator");

const async = require("async");

// Display list of all Type.
exports.type_list = function (req, res, next) {
  Type.find()
    .sort({ name: 1 })
    .exec(function (err, list_types) {
      if (err) {
        return next(err);
      }
      res.render("type_list", {
        title: "Type List",
        type_list: list_types,
      });
    });
};

// Display detail page for a specific Type.
exports.type_detail = (req, res, next) => {
  async.parallel(
    {
      type(callback) {
        Type.findById(req.params.id).exec(callback);
      },

      type_vehicles(callback) {
        Vehicle.find({ type: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.type == null) {
        // No results.
        const err = new Error("Type not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("type_detail", {
        title: "Type Detail",
        type: results.type,
        type_vehicles: results.type_vehicles,
      });
    }
  );
};

// Display Type create form on GET.
exports.type_create_get = (req, res) => {
  res.render("type_form", { title: "Create Type" });
};

// Handle Type create on POST.
exports.type_create_post = [
  // Validate and sanitize the name field.
  body("name", "Name of type required").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const type = new Type({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("type_form", {
        title: "Create Type",
        type,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if type with same name already exists.
      Type.findOne({ name: req.body.name }).exec((err, found_type) => {
        if (err) {
          return next(err);
        }

        if (found_type) {
          // type exists, redirect to its detail page.
          res.redirect(found_type.url);
        } else {
          type.save((err) => {
            if (err) {
              return next(err);
            }
            // type saved. Redirect to type detail page.
            res.redirect(type.url);
          });
        }
      });
    }
  },
];

// Display Type delete form on GET.
exports.type_delete_get = (req, res, next) => {
  async.parallel(
    {
      type(callback) {
        Type.findById(req.params.id).exec(callback);
      },
      type_vehicles(callback) {
        Vehicle.find({ type: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.type_vehicles == null) {
        // No results.
        res.redirect("/inventory/types");
      }
      // Successful, so render.
      res.render("type_delete", {
        title: "Delete Type",
        type: results.type,
        type_vehicles: results.type_vehicles,
      });
    }
  );
};

// Handle Type delete on POST.
exports.type_delete_post = (req, res, next) => {
  async.parallel(
    {
      type(callback) {
        Type.findById(req.body.typeid).exec(callback);
      },
      type_vehicles(callback) {
        Vehicle.find({ make: req.body.typeid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      if (results.type_vehicles.length > 0) {
        // Type has vehicles. Render in same way as for GET route.
        res.render("type_delete", {
          title: "Delete Type",
          type: results.type,
          type_vehicles: results.type_vehicles,
        });
        return;
      }
      // Type has no vehicles. Delete object and redirect to the list of types.
      Type.findByIdAndRemove(req.body.typeid, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to author list
        res.redirect("/inventory/types");
      });
    }
  );
};

// Display Type update form on GET.
exports.type_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Type update GET");
};

// Handle Type update on POST.
exports.type_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Type update POST");
};
