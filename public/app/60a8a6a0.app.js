"use strict";angular.module("chemartApp",["ngCookies","ngResource","ngSanitize","ui.router","cfp.hotkeys","lr.upload","cgNotify","ngFileUpload"]).config(["$stateProvider","$urlRouterProvider","$locationProvider",function(a,b,c){b.otherwise("/"),c.html5Mode(!0)}]).run(["notify",function(a){a.config({duration:3e3})}]),angular.module("chemartApp").controller("MainCtrl",["$scope","energy","conversion","canvas","storage","builder","notify",function(a,b,c,d,e,f,g){if(null!==d){a.canvas=d,a.energy=b,a.storage=e,a.builder=f,a.conversion=c,a.modes=Mol3D.Mode,a.displays=Mol3D.Display,e["new"](),a.mode=function(a){d.setMode(a)},d.show();var h=document.getElementById("canvas-container");angular.element(h).append(d.renderer.domElement),g({message:"Application started, Do the art !"})}}]),angular.module("chemartApp").config(["$stateProvider",function(a){a.state("main",{url:"/",templateUrl:"app/main/main.html",controller:"MainCtrl"})}]),angular.module("chemartApp").factory("builder",["$http","moleculeDrawer","canvas","notify",function(a,b,c,d){return{build3d:function(){var e=c.getMolecule().toJSON();a.post("/api/build/3d",e).success(function(a){var c=Chem.Molecule.readJSON(a);b.animate(c),d({message:"3D coordinates are created",classes:["success"]})})},addHydrogens:function(){var e=c.getMolecule().toJSON();a.post("/api/build/addhydrogens",e).success(function(a){var c=Chem.Molecule.readJSON(a);b.animate(c),d({message:"Hydrogens are added and 3D coordinates are also created",classes:["success"]})})}}}]),angular.module("chemartApp").factory("conversion",["$http","moleculeDrawer","canvas","$download","storage","notify",function(a,b,c,d,e,f){return{formats:{mol2:"Sybyl Mol2",cml:"CML",mol:"MDL SDFile",pdb:"PDB",smiles:"SMILES Notation",hin:"Hyperchem File"},"export":function(b){var f=c.getMolecule().toJSON();a.post("/api/conversion/export/"+b,f).success(function(a){d(a,e.current+"."+b)})},"import":function(c){function d(a){return a.substr(a.lastIndexOf(".")+1)}var e=d(c.name);if(-1===["cml","hin","mol","mol2","smiles","pdb"].indexOf(e))return f({message:"The file selected is not supported.",classes:["error"]});var g=new FileReader;g.readAsBinaryString(c),g.onload=function(d){var g=d.target.result;a.post("/api/conversion/import/"+e,{data:g}).success(function(a){var d=Chem.Molecule.readJSON(a);b.draw(d),f({message:'The file "'+c.name+'" has been imported',classes:["success"]})})}}}}]),angular.module("chemartApp").factory("energy",["$http","canvas","notify","moleculeDrawer","status",function(a,b,c,d,e){return{getEnergy:function(d){var f=b.getMolecule().toJSON();a.post("/api/energy/"+d,f).success(function(a){c({message:"The energy is "+a.energy,classes:["success"]}),e("E = "+a.energy+" kcal")})},addHydrogens:function(){var e=b.getMolecule().toJSON();a.post("/api/build/addhydrogens",e).success(function(a){var b=Chem.Molecule.readJSON(a);d.animate(b),c({message:"Hydrogens are added and 3D coordinates are also created",classes:["success"]})})}}}]),angular.module("chemartApp").factory("canvas",function(){if(window.WebGLRenderingContext){var a=new Mol3D.Canvas;return a.setDisplay(Mol3D.Display.BallAndStick),a.setMode(Mol3D.Mode.Editor),angular.element(window).on("resize",function(){a.camera.aspect=window.innerWidth/window.innerHeight,a.camera.updateProjectionMatrix(),a.renderer.setSize(this.innerWidth,this.innerHeight)}),a}return null}),angular.module("chemartApp").factory("centerAtoms",function(){return function(a){var b,c,d=new THREE.Vector3,e=a.atoms.length;for(b=a.atoms.length;b--;)c=a.atoms[b].position,d.add(c);for(d.divideScalar(e),b=a.atoms.length;b--;)c=a.atoms[b].position,c.x-=d.x,c.y-=d.y,c.z-=d.z}}),angular.module("chemartApp").factory("$download",function(){return function(a,b,c){function d(a){var b=a.split(/[:;,]/),c=b[1],d="base64"==b[2]?atob:decodeURIComponent,e=d(b.pop()),f=e.length,g=0,h=new Uint8Array(f);for(g;f>g;++g)h[g]=e.charCodeAt(g);return new k([h],{type:c})}function e(a,b){if("download"in i)return i.href=a,i.setAttribute("download",n),i.innerHTML="downloading...",h.body.appendChild(i),setTimeout(function(){i.click(),h.body.removeChild(i),b===!0&&setTimeout(function(){window.URL.revokeObjectURL(i.href)},250)},66),!0;if("undefined"!=typeof safari)return a="data:"+a.replace(/^data:([\w\/\-\+]+)/,f),window.open(a)||confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")&&(location.href=a),!0;var c=h.createElement("iframe");h.body.appendChild(c),b||(a="data:"+a.replace(/^data:([\w\/\-\+]+)/,f)),c.src=a,setTimeout(function(){h.body.removeChild(c)},333)}var f="application/octet-stream",g=c||f,h=document,i=h.createElement("a"),j=function(a){return String(a)},k=window.Blob||window.MozBlob||window.WebKitBlob||j;k=k.call?k.bind(window):Blob;var l,m,n=b||"download";if(String(a).match(/^data\:[\w+\-]+\/[\w+\-]+[,;]/))return navigator.msSaveBlob?navigator.msSaveBlob(d(a),n):e(a);if(l=a instanceof k?a:new k([a],{type:g}),navigator.msSaveBlob)return navigator.msSaveBlob(l,n);if(window.URL)e(window.URL.createObjectURL(l),!0);else{if("string"==typeof l||l.constructor===j)try{return e("data:"+g+";base64,"+window.btoa(l))}catch(o){return e("data:"+g+","+encodeURIComponent(l))}m=new FileReader,m.onload=function(){e(this.result)},m.readAsDataURL(l)}return!0}}),angular.module("chemartApp").factory("moleculeDrawer",["centerAtoms","canvas",function(a,b){var c={};return c.animate=function(d){function e(){Date.now()<i&&requestAnimationFrame(e),TWEEN.update(),b.update()}var f=b.getMolecule(),g=400;a(d);for(var h in d.atoms)"undefined"!=typeof f.atoms[h]&&new TWEEN.Tween(f.atoms[h].position).to(d.atoms[h].position,g).easing(TWEEN.Easing.Circular.Out).start();var i=Date.now()+g;requestAnimationFrame(e),setTimeout(function(){c.draw(d)},g)},c.draw=function(a){b.clear(),b.attach(a)},c}]),angular.module("chemartApp").factory("status",["$rootScope",function(a){return function(b){a.status=b}}]),angular.module("chemartApp").factory("storage",["moleculeDrawer","canvas","notify","status",function(a,b,c,d){var e={data:angular.fromJson(localStorage.molecules||"{}"),current:null};return e["new"]=function(){var a=new Date,c="Untitled-"+a.getFullYear()+a.getMonth()+a.getDate()+"-"+a.getHours()+a.getMinutes()+a.getSeconds();b.clear(),this.data[c]=b.getMolecule().toJSON(),d("New document has been created."),this.setCurrent(c)},e.save=function(a){if("undefined"==typeof a&&this.current){var e;this.data[this.current]=b.getMolecule().toJSON(),e=0===b.atoms.length?{message:"The molecule should have atoms to be saved.",classes:["error"]}:{message:'"'+this.current+'" has been saved !',classes:["success"]},c(e),d(e.message)}localStorage.molecules=angular.toJson(this.data)},e.has=function(a){return"undefined"!=typeof this.data[a]},e.get=function(a){return Chem.Molecule.readJSON(this.data[a])},e.rename=function(a,b){this.data[b]=this.data[a],delete this.data[a],this.current===a&&(this.current=b),this.save(!0)},e.list=function(){return _.keys(this.data)},e["delete"]=function(a){delete this.data[a],c({message:'"'+a+'" has been deleted !',classes:["success"]}),a===this.current?this["new"]():this.save(!0)},e.setCurrent=function(a){this.current&&0===this.data[this.current].atoms.length&&(delete this.data[this.current],this.save(!0)),this.current=a},e.load=function(b){if(this.has(b)){var e=this.get(b);return this.setCurrent(b),c({message:'"'+b+'" has been loaded !',classes:["success"]}),d(b+" has been loaded."),a.draw(e),!0}return!1},e}]),angular.module("chemartApp").directive("about",function(){return{restrict:"E",link:function(a,b){a.about=function(){b.addClass("show")},b.on("click",function(){b.removeClass("show").addClass("hide"),setTimeout(function(){b.removeClass("hide")},1e3)})},templateUrl:"components/about/about.html"}}),angular.module("chemartApp").directive("browseHappy",function(){return{restrict:"E",link:function(a){a.support=window.WebGLRenderingContext?!0:!1},templateUrl:"components/browsehappy/browsehappy.html"}}),angular.module("chemartApp").directive("chooseElement",["canvas",function(a){return{restrict:"E",scope:{},link:function(b,c){b.canvas=a,b.close=function(){c.removeClass("show").addClass("hide"),setTimeout(function(){c.removeClass("hide")},1e3)},b.setElement=function(c){a.data.element=c,b.close()},b.quick=[Chem.Element.findByAtomicNumber(1),Chem.Element.findByAtomicNumber(6),Chem.Element.findByAtomicNumber(7),Chem.Element.findByAtomicNumber(8),Chem.Element.findByAtomicNumber(16)],b.showTable=function(){b.close(),angular.element(document.querySelector("periodic-table")).addClass("show")}},templateUrl:"components/element/element.html"}}]),angular.module("chemartApp").factory("element",function(){var a=Chem.Element.findByAtomicNumber,b=[[a(1),16,a(2)],[a(3),a(4),10,a(5),a(6),a(7),a(8),a(9),a(10)],[a(11),a(12),10,a(13),a(14),a(15),a(16),a(17),a(18)],[a(19),a(20),a(21),a(22),a(23),a(24),a(25),a(26),a(27),a(28),a(29),a(30),a(31),a(32),a(33),a(34),a(35),a(36)],[a(37),a(38),a(39),a(40),a(41),a(42),a(43),a(44),a(45),a(46),a(47),a(48),a(49),a(50),a(51),a(52),a(53),a(54)],[a(55),a(56),a(57),a(72),a(73),a(74),a(75),a(76),a(77),a(78),a(79),a(80),a(81),a(82),a(83),a(84),a(85),a(86)]];return{periodicTable:b}}),angular.module("chemartApp").directive("periodicTable",["element","canvas",function(a,b){return{restrict:"E",scope:{},link:function(c,d){c.canvas=b,c.close=function(){d.removeClass("show").addClass("hide"),setTimeout(function(){d.removeClass("hide")},1e3)},c.setElement=function(a){b.data.element=a,c.close()},c.periodicTable=a.periodicTable},templateUrl:"components/element/periodic-table.html"}}]),angular.module("chemartApp").directive("help",["hotkeys",function(a){return{restrict:"E",link:function(b,c){a.add({combo:"f1",description:"Help",callback:function(a){a.preventDefault(),b.help()}}),b.help=function(){c.addClass("show")},c.on("click",function(){c.removeClass("show").addClass("hide"),setTimeout(function(){c.removeClass("hide")},1e3)})},templateUrl:"components/help/help.html"}}]),angular.module("chemartApp").controller("MenubarCtrl",["$scope","hotkeys","storage","canvas","conversion",function(a,b,c,d,e){a.print=function(){window.print()},a["import"]=function(a){console.log(a),a[0]&&e["import"](a[0])},b.add({combo:"ctrl+s",description:"Save the document",callback:function(a){a.preventDefault(),c.save()}}),b.add({combo:"ctrl+del",description:"Delete the document",callback:function(a){a.preventDefault(),c["delete"](c.current)}}),b.add({combo:"ctrl+k",description:"Clear the canvas",callback:function(a){a.preventDefault(),d.clear()}}),b.add({combo:"ctrl+b",description:"New document",callback:function(a){a.preventDefault(),c["new"]()}})}]),angular.module("chemartApp").directive("statusbar",["hotkeys","canvas",function(a,b){return{restrict:"E",link:function(a){a.canvas=b,a.atoms=b.atoms},templateUrl:"components/statusbar/statusbar.html"}}]),angular.module("chemartApp").controller("ToolbarCtrl",["$scope","hotkeys","canvas",function(a,b,c){b.add({combo:"v",description:"Positioning the camera",callback:function(a){a.preventDefault(),c.setMode(Mol3D.Mode.Orbit)}}),b.add({combo:"e",description:"Editing the molecule",callback:function(a){a.preventDefault(),c.setMode(Mol3D.Mode.Editor)}}),a.selectElement=function(){angular.element(document.querySelector("choose-element")).addClass("show")}}]),angular.module("chemartApp").run(["$templateCache",function(a){a.put("app/main/main.html","<div ng-include=&quot;components/menubar/menubar.html&quot;></div><div ng-include=&quot;components/toolbar/toolbar.html&quot;></div><div id=canvas-container></div><choose-element></choose-element><periodic-table></periodic-table><help></help><about></about><browse-happy></browse-happy><statusbar></statusbar>"),a.put("components/about/about.html",'<div class=about><a class=close><i class="icon icon-close"></i></a><h1>Chemozart</h1><div><small>version 1.0.0-alpha</small></div><hr><p>Chemozart is an open-source online web-based chemical visualization tool with RESTful cloud-based optimization API. This project is built on top of these packages :</p><ul><li><a href=https://github.com/mohebifar/openbabel-node>openbabel-node</a> - A port of <a href=http://openbabel.org target=_blank>Open Babel</a> in node.js</li><li><a href=https://github.com/mohebifar/mol3d>mol3d</a> - A 3D molecular visualization tool on top of WebGL</li><li><a href=https://github.com/mohebifar/chem.js>chem.js</a> - A molecular modeling library written in javascript</li></ul><p>This software is published under<a href=http://www.apache.org/licenses/LICENSE-2.0 target=_blank>Apache License v2.0</a></p></div>'),a.put("components/browsehappy/browsehappy.html",'<div id=browsehappy ng-if="! support"><div class=content><h2>You are using an <strong>outdated</strong> browser.</h2><p>Please <a href="http://browsehappy.com/">upgrade your browser</a> to be able to use this software.<small>This application uses WebGL for 3D rendering.</small></p></div></div>'),a.put("components/element/element.html",'<div class=major-elements><a ng-click=close() class=close><i class="icon icon-close"></i></a><h1>Choose Elements</h1><hr><div class=quick><div ng-repeat="element in quick" ng-class="{&quot;active&quot;: element.atomicNumber===canvas.data.element}" ng-click=setElement(element.atomicNumber) class=element><span ng-bind=element.atomicNumber class=atomic-number></span><span ng-bind=element.symbol class=symbol></span><span ng-bind=element.name class=name></span></div></div><hr><a ng-click=showTable()>Choose from periodic table</a></div>'),a.put("components/element/periodic-table.html",'<div class=major-elements><a class=close><i class="icon icon-close"></i></a><h1>Choose element from periodic table</h1><hr><table><tbody><tr ng-repeat="row in periodicTable"><td ng-repeat="element in row" colspan="{{element.atomicNumber ? 1 : element}}"><div ng-if=element.atomicNumber><div ng-class="{&quot;active&quot;: element.atomicNumber===canvas.data.element}" ng-click=setElement(element.atomicNumber) class=element><span ng-bind=element.atomicNumber class=atomic-number></span><span ng-bind=element.symbol class=symbol></span><span ng-bind=element.name class=name></span></div></div></td></tr></tbody></table></div>'),a.put("components/footer/footer.html","<footer>Made by <a target=_blank href=https://mohebifar.com>Mohamad Mohebifar</a> at <a target=_blank href=http://sbu.ac.ir>Shahid Beheshti University</a></footer>"),a.put("components/help/help.html",'<div class=help><a class=close><i class="icon icon-close"></i></a><h2>Modes</h2><h3>Camera Mode</h3><div class=control-help><p><strong>Rotate</strong><span>Mouse move holding left button</span></p><p><strong>Pan</strong><span>Mouse move holding right button</span></p><p><strong>Zoom</strong><span>Scroll | Mouse move holing middle button</span></p></div><h3>Editing Mode</h3><div class=control-help><p><strong>Add Atom</strong><span>Click on empty space</span></p><p><strong>Remove Atom</strong><span>Right click on an atom</span></p><p><strong>Add bond</strong><span>Drag from one atom to another</span></p><p><strong>Remove bond</strong><span>Right click on bond</span></p><p><strong>Increase bond order</strong><span>Click on bond</span></p></div></div>'),a.put("components/menubar/menubar.html",'<div ng-controller=MenubarCtrl class=menubar><ul><li><a>File</a><ul><li><a ng-click=canvas.clear()>New<span class=shortcut>CTRL + B</span></a></li><li><a>Open ...</a><ul class=large><li ng-repeat="(item, val) in storage.data" ng-if="item !== storage.current"><a ng-click=storage.load(item)>{{ item }}</a></li><li ng-if="storage.list().length === 1" class=disabled><span>No other files exist</span></li></ul></li><li><a ng-click=storage.save()>Save<span class=shortcut>CTRL + S</span></a></li><li><a ng-click=storage.delete(storage.current)>Delete<span class=shortcut>CTRL + DEL</span></a></li><li class=separator></li><li><a ngf-select=ngf-select ngf-change=import($files)>Import</a></li><li><a>Export ...</a><ul><li ng-repeat="(key, format) in conversion.formats"><a ng-click=conversion.export(key)>{{ format }}</a></li></ul></li><li class=separator></li><li><a ng-click=print()>Print<span class=shortcut>CTRL + P</span></a></li></ul></li><li><a>Edit</a><ul><li><a ng-click=canvas.clear()>Clear<span class=shortcut>CTRL + K</span></a></li></ul></li><li><a>Build</a><ul><li><a ng-click=builder.build3d()>Build 3D</a></li><li><a ng-click=builder.addHydrogens()>Add Hydrogens</a></li></ul></li><li><a>Energy</a><ul><li><a ng-click=energy.getEnergy(&quot;mmff94&quot;)>MMFF94</a></li><li><a ng-click=energy.getEnergy(&quot;uff&quot;)>UFF</a></li><li><a ng-click=energy.getEnergy(&quot;ghemical&quot;)>Ghemical</a></li></ul></li><li><a>Help</a><ul><li><a ng-click=help()>Help Topics<span class=shortcut>F1</span></a></li><li><a href=https://github.com/mohebifar/chemozart/issues target=_blank>Report issues</a></li><li class=separator></li><li><a ng-click=about()>About</a></li></ul></li></ul><div class="right hidden-tablet"><div class=name>{{ storage.current }}</div>-<div class=logo>CHEMOZART v1.0</div></div></div>'),a.put("components/statusbar/statusbar.html","<div class=statusbar><div class=left>{{ status }}</div><div class=right>{{ atoms.length }} Atoms</div></div>"),a.put("components/toolbar/toolbar.html",'<div ng-controller=ToolbarCtrl class=toolbar><ul><li><a ng-click=mode(modes.Orbit) ng-class="{&quot;active&quot;: canvas.currentMode === modes.Orbit}" title="Positioning the camera (V)"><i class="icon icon-move"></i></a></li><li><a ng-click=mode(modes.Editor) ng-class="{&quot;active&quot;: canvas.currentMode === modes.Editor}" title="Editing the molecule (E)"><i class="icon icon-edit"></i></a></li><li><a ng-click=selectElement() title="Choose the element from periodic table"><i class="icon icon-atom"></i></a></li><li><a ng-click="" title="Reposition the atoms"><i class="icon icon-pointer"></i></a></li><li class=separator></li><li><a ng-click=help() title="Help (F1)"><i class="icon icon-help"></i></a></li><li><a href=https://github.com/mohebifar/chemozart target=_blank title="Source on Github"><i class="icon icon-github"></i></a></li></ul></div>')}]);