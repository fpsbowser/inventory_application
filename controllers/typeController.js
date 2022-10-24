const Type = require("../models/type");
const Vehicle = require("../models/vehicle");

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
  res.send("NOT IMPLEMENTED: Type create GET");
};

// Handle Type create on POST.
exports.type_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Type create POST");
};

// Display Type delete form on GET.
exports.type_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Type delete GET");
};

// Handle Type delete on POST.
exports.type_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Type delete POST");
};

// Display Type update form on GET.
exports.type_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Type update GET");
};

// Handle Type update on POST.
exports.type_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Type update POST");
};
