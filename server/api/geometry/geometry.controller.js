'use strict';

var ob = require('openbabel');
var _ = require('lodash');

function readJSON(object) {
  var molecule = ob.Molecule.fromJSON(object);

  var conversion = new ob.Conversion();
  conversion.setOutFormat('mol2').setInFormat('mol2');
  return conversion.read(conversion.write(molecule));
}

// Build 3D Coordinates for this molecule
exports.build = function (req, res) {
  var molecule = readJSON(req.body);
  var builder = new ob.Builder();

  builder.build(molecule);

  res.json(molecule);
};

// Add hydrogens to the molecule
exports.addHydrogens = function (req, res) {
  var molecule = readJSON(req.body);
  var builder = new ob.Builder();

  molecule.addHydrogens();
  builder.build(molecule);

  res.json(molecule);
};
