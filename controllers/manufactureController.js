const Manufacture = require("../models/manufacture");
const Vehicle = require("../models/vehicle");
const async = require("async");

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
  res.send("NOT IMPLEMENTED: Manufacture create GET");
};

// Handle Manufacture create on POST.
exports.manufacture_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Manufacture create POST");
};

// Display Manufacture delete form on GET.
exports.manufacture_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Manufacture delete GET");
};

// Handle Manufacture delete on POST.
exports.manufacture_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Manufacture delete POST");
};

// Display Manufacture update form on GET.
exports.manufacture_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Manufacture update GET");
};

// Handle Manufacture update on POST.
exports.manufacture_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Manufacture update POST");
};
