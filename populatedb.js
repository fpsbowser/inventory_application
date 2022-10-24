#! /usr/bin/env node

console.log(
  "This script populates some test maufactures, vehicles, and types to the database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Vehicle = require("./models/vehicle");
var Manufacture = require("./models/manufacture");
var Type = require("./models/type");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var manufactures = [];
var types = [];
var vehicles = [];

function manufactureCreate(
  name,
  founded,
  founder,
  headquarters,
  description,
  cb
) {
  manufacturedetail = {
    name: name,
    founded: founded,
    founder: founder,
    headquarters: headquarters,
    description: description,
  };

  var manufacture = new Manufacture(manufacturedetail);

  manufacture.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Manufacture: " + manufacture);
    manufactures.push(manufacture);
    cb(null, manufacture);
  });
}

function typeCreate(name, cb) {
  var type = new Type({ name: name });

  type.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Type: " + type);
    types.push(type);
    cb(null, type);
  });
}

function vehicleCreate(
  model,
  make,
  price,
  color,
  miles,
  description,
  type,
  cb
) {
  vehicledetail = {
    model: model,
    make: make,
    price: price,
    color: color,
    miles: miles,
    description: description,
    type: type,
  };

  var vehicle = new Vehicle(vehicledetail);
  // console.log(vehicle);

  vehicle.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New vehicle: " + vehicle);
    vehicles.push(vehicle);
    cb(null, vehicle);
  });
}

function createManufactures(cb) {
  async.series(
    [
      function (callback) {
        manufactureCreate(
          "Toyota",
          "1937-08-28",
          "Kiichiro Toyoda",
          "Toyota City, Aichi, Japan",
          "Toyota Motor Corporation is a Japanese multinational automotive manufacturer headquartered in Toyota City, Aichi, Japan.",
          callback
        );
      },
      function (callback) {
        manufactureCreate(
          "Ford",
          "1903-06-16",
          "Henry Ford",
          "Dearborn, Michigan",
          "Ford Motor Company is an American multinational automobile manufacturer headquartered in Dearborn, Michigan, United States.",
          callback
        );
      },
      function (callback) {
        manufactureCreate(
          "Honda",
          "1948-09-24",
          "Soichiro Honda",
          "Minato City, Tokyo, Japan",
          "Honda Motor Co., Ltd. is a Japanese public multinational conglomerate manufacturer of automobiles, motorcycles, and power equipment, headquartered in Minato, Tokyo, Japan.",
          callback
        );
      },
      function (callback) {
        manufactureCreate(
          "Ferrari",
          "1939-09-14",
          "Enzo Ferrari",
          "Maranello, Emilia-Romagna, Italy",
          "Ferrari is an Italian luxury sports car manufacturer based in Maranello, Italy.",
          callback
        );
      },
      function (callback) {
        manufactureCreate(
          "Tesla",
          "2003-07-01",
          "Elon Musk",
          "Austin, Texas, United States",
          "Tesla, Inc. is an American multinational automotive and clean energy company headquartered in Austin, Texas. Tesla designs and manufactures electric vehicles, battery energy storage from home to grid-scale, solar panels and solar roof tiles, and related products and services.",
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createTypes(cb) {
  async.series(
    [
      //0
      function (callback) {
        typeCreate("Pickup truck", callback);
      },
      //1
      function (callback) {
        typeCreate("Sedan", callback);
      },
      //2
      function (callback) {
        typeCreate("Coupe", callback);
      },
      //3
      function (callback) {
        typeCreate("Sports Car", callback);
      },
      //4
      function (callback) {
        typeCreate("Luxury", callback);
      },
    ],
    // optional callback
    cb
  );
}

// https://www.autotrader.com/cars-for-sale/vehicledetails.xhtml?listingId=661011048&makeCodeList=TOYOTA&modelCodeList=TACOMA&zip=04072&state=ME&city=Saco&dma=&searchRadius=50&listingTypes=USED&isNewSearch=false&referrer=%2Fcars-for-sale%2Ftoyota%2Ftacoma%3F&clickType=listing

function createVehicles(cb) {
  async.parallel(
    [
      function (callback) {
        vehicleCreate(
          "2019 Toyota Tacoma TRD Off-Road",
          manufactures[0],
          "43,000",
          "Quicksand",
          14420,
          "2019 Toyota Tacoma TRD Off-Road V6 4WD 6-Speed 3.5L V6 PDI DOHC 24V LEV3-ULEV70 278hp 4WD, ABS brakes, Alloy wheels, Electronic Stability Control, Heated door mirrors, Illuminated entry, Low tire pressure warning, Remote keyless entry, Traction control. Make sure to come take a look ASAP because these trucks sell like hotcakes!",
          types[0],
          callback
        );
      },
      function (callback) {
        vehicleCreate(
          "2022 Toyota Tundra Limited",
          manufactures[0],
          "59,995",
          "White",
          2004,
          "This vehicle has been through our full 70 point check and reconditioning process. It comes Key Certified which includes FREE NH inspection stickers for life, first oil change FREE and a 3 day exchange program.",
          types[0],
          callback
        );
      },
      function (callback) {
        vehicleCreate(
          "1998 Toyota Supra Turbo",
          manufactures[0],
          "225,000",
          "Red",
          78566,
          "ONCE IN A LIFETIME OPPORTUNITY TO OWN THIS UNICORN ** ORIGINAL PAINT JOB AND RIGHT NOW IT IS TUNED FOR 850 HP AND IT CAN HANDLE UP TO 1,200 HP WITHOUT ADDING ANYTHING** ALL MODS WERE DONE IN THE LAST 5K MILES, AND TOOK OVER 2 YEARS .Local trade-in, traded-in by a Marine veteran, never raced or tracked / we have a binder full of service history from the first day it was bought.",
          [types[3]],
          callback
        );
      },
      function (callback) {
        vehicleCreate(
          "2014 Ford Mustang Coupe",
          manufactures[1],
          "19,590",
          "Green",
          87000,
          "Green 2014 Ford Mustang V6 RWD 6-Speed Automatic 3.7L V6 Ti-VCT 24V COMPLETE DETAIL, Local Trade, Non-Smoker. Odometer is 17211 miles below market average!",
          [types[2]],
          callback
        );
      },
      function (callback) {
        vehicleCreate(
          "2020 Ford Fusion SE",
          manufactures[1],
          "27,390",
          "Red",
          42999,
          "Clean CARFAX. CARFAX One-Owner. Red 2020 Ford Fusion Hybrid SE FWD eCVT I4 Hybrid COMPLETE DETAIL, ONE OWNER, CLEAN CAR FAX, Non-Smoker, I4 Hybrid.",
          [types[1]],
          callback
        );
      },
      function (callback) {
        vehicleCreate(
          "2022 Honda Accord Sport",
          manufactures[2],
          "33,500",
          "Sonic Gray Pearl",
          1202,
          "This 2022 Honda Accord Hybrid Sport is proudly offered by Ira Honda - Saco When you purchase a vehicle with the CARFAX Buyback Guarantee, you're getting what you paid for. This wonderfully fuel-efficient vehicle offers a supple ride, quick acceleration and superior styling without sacrificing MPGs.",
          [types[1]],
          callback
        );
      },
      function (callback) {
        vehicleCreate(
          "2018 Ferrari 488 Spider",
          manufactures[3],
          "319,000",
          "Giallo Modena",
          24430,
          "2018 Ferrari 488 Spider RWD 3.9L V8 7-Speed Automatic in Giallo Modena over Nero Interior.",
          [types[3]],
          callback
        );
      },
      function (callback) {
        vehicleCreate(
          "2012 Ferrari California",
          manufactures[3],
          "121,987",
          "Red",
          75544,
          "Clean CARFAX. Red 2012 Ferrari California RWD Manual 4.3L V8 DI DOHC ABS brakes, Alloy wheels, AM/FM CD/MP3/DVD/USB/HDD w/Navigation, DVD-Audio, Electronic Stability Control, Front dual zone A/C, Heated door mirrors, Illuminated entry, Leather Seat Trim, Navigation System, Remote keyless entry.",
          [types[3]],
          callback
        );
      },
      function (callback) {
        vehicleCreate(
          "2015 Ferrari F12 Berlinetta",
          manufactures[3],
          "256,942",
          "Gray",
          20180,
          "Clean CARFAX. Full factory scheduled maintenance completed by Boardwalk Ferrari in Plano, TX as of July 2022. Gray 2015 Ferrari F12 Berlinetta RWD 7-Speed Manual Dual Clutch 6.3L V12 DI 4-Wheel Disc Brakes. Recent Arrival!",
          [types[3]],
          callback
        );
      },
      function (callback) {
        vehicleCreate(
          "2019 Tesla Model S Long Range",
          manufactures[4],
          "65,950",
          "Midnight Silver Metallic",
          27776,
          "2019 Tesla Model S Long Range Midnight Silver Metallic ABS brakes, Active Cruise Control, Alloy wheels, Compass, Electronic Stability Control, Front dual zone A/C, Heated door mirrors, Heated front seats, Heated rear seats, Illuminated entry, Low tire pressure warning, Navigation System, Power Liftgate, Remote keyless entry, Traction control.",
          [types[1]],
          callback
        );
      },
      function (callback) {
        vehicleCreate(
          "2022 Tesla Model 3 Long Range",
          manufactures[4],
          "59,900",
          "Deep Blue Metallic",
          9430,
          "Deep Blue Metallic 2022 Tesla Model 3 Long Range Dual Electric Motor AWD. Clean CARFAX. CARFAX One-Owner. 134/126 City/Highway MPG.",
          [types[1]],
          callback
        );
      },
      function (callback) {
        vehicleCreate(
          "2015 Tesla Model S 85D",
          manufactures[4],
          "36,999",
          "Titanium Metallic",
          93394,
          "2015 Tesla Model S 85D Titanium Metallic ABS brakes, Alloy wheels, Compass, Electronic Stability Control, Front dual zone A/C, Heated door mirrors, Heated front seats, Illuminated entry, Low tire pressure warning, Remote keyless entry, Traction control.",
          [types[1]],
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createManufactures, createTypes, createVehicles],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
