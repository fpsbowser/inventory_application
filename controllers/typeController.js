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

    // Create a type object with escaped and trimmed data.
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
        // Success - go to type list
        res.redirect("/inventory/types");
      });
    }
  );
};

// Display Type update form on GET.
exports.type_update_get = (req, res, next) => {
  // get Type to populate form values
  async.parallel(
    {
      type(callback) {
        Type.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.type == null) {
        // no results
        const err = new Error("Type not found");
        err.status = 404;
        return next(err);
      }
      // Success
      res.render("type_form", {
        title: "Update Type",
        type: results.type,
      });
    }
  );
};

// Handle Type update on POST.
exports.type_update_post = [
  // Validate and sanitize fields.
  body("name", "Type name must be specified!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a Type object with escaped/trimmed data and old id.
    const type = new Type({
      name: req.body.name,
      _id: req.params.id, //This is required, or a new ID will be assigned!
    });
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all manufactures and types for form.
      async.parallel(
        {
          type(callback) {
            Type.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          res.render("type_form", {
            title: "Update Type",
            type: results.type,
            errors: errors.array(),
          });
        }
      );
      return;
    }
    // Data from form is valid. Update the record.
    Type.findByIdAndUpdate(req.params.id, type, {}, (err, thetype) => {
      if (err) {
        return next(err);
      }
      // Successful: redirect to type detail page.
      res.redirect(thetype.url);
    });
  },
];
