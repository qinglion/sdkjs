/*
 * (c) Copyright Ascensio System SIA 2010-2023
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-6 Ernesta Birznieka-Upish
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */


(function geometryFromClassApi(window, document) {
	// works with visio class
	// NOT FINISHED

	var FORMULA_TYPE_MULT_DIV = 0,
		FORMULA_TYPE_PLUS_MINUS = 1,
		FORMULA_TYPE_PLUS_DIV = 2,
		FORMULA_TYPE_IF_ELSE =3,
		FORMULA_TYPE_ABS = 4,
		FORMULA_TYPE_AT2 = 5,
		FORMULA_TYPE_CAT2 = 6,
		FORMULA_TYPE_COS = 7,
		FORMULA_TYPE_MAX = 8,
		FORMULA_TYPE_MOD = 9,
		FORMULA_TYPE_PIN = 10,
		FORMULA_TYPE_SAT2 = 11,
		FORMULA_TYPE_SIN = 12,
		FORMULA_TYPE_SQRT = 13,
		FORMULA_TYPE_TAN = 14,
		FORMULA_TYPE_VALUE = 15,
		FORMULA_TYPE_MIN = 16;

	var MAP_FMLA_TO_TYPE = {};
	MAP_FMLA_TO_TYPE["*/"] = FORMULA_TYPE_MULT_DIV;
	MAP_FMLA_TO_TYPE["+-"] = FORMULA_TYPE_PLUS_MINUS;
	MAP_FMLA_TO_TYPE["+/"] = FORMULA_TYPE_PLUS_DIV;
	MAP_FMLA_TO_TYPE["?:"] = FORMULA_TYPE_IF_ELSE;
	MAP_FMLA_TO_TYPE["abs"] = FORMULA_TYPE_ABS;
	MAP_FMLA_TO_TYPE["at2"] = FORMULA_TYPE_AT2;
	MAP_FMLA_TO_TYPE["cat2"] = FORMULA_TYPE_CAT2;
	MAP_FMLA_TO_TYPE["cos"] = FORMULA_TYPE_COS;
	MAP_FMLA_TO_TYPE["max"] = FORMULA_TYPE_MAX;
	MAP_FMLA_TO_TYPE["min"] = FORMULA_TYPE_MIN;
	MAP_FMLA_TO_TYPE["mod"] = FORMULA_TYPE_MOD;
	MAP_FMLA_TO_TYPE["pin"] = FORMULA_TYPE_PIN;
	MAP_FMLA_TO_TYPE["sat2"] = FORMULA_TYPE_SAT2;
	MAP_FMLA_TO_TYPE["sin"] = FORMULA_TYPE_SIN;
	MAP_FMLA_TO_TYPE["sqrt"] = FORMULA_TYPE_SQRT;
	MAP_FMLA_TO_TYPE["tan"] = FORMULA_TYPE_TAN;
	MAP_FMLA_TO_TYPE["val"] = FORMULA_TYPE_VALUE;

	function getRandomPrst() {
		let types = AscCommon.g_oAutoShapesTypes[Math.floor(Math.random()*AscCommon.g_oAutoShapesTypes.length)];
		return types[Math.floor(Math.random()*types.length)].Type;
	}

	function findObject(obj, constructorName, attributeName, attributeValue) {
		// Base case: if the object is null or undefined, or if it's not an object
		if (!obj || typeof obj !== 'object') {
			return null;
		}
		// Check if the current object has the desired attribute, value, and constructor name
		if (obj.constructor.name === constructorName && obj[attributeName] === attributeValue) {
			return obj;
		}
		// Iterate over object properties and recursively search for the attribute and constructor name
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				const result = findObject(obj[key], constructorName, attributeName, attributeValue);
				if (result) {
					return result;
				}
			}
		}
		// If the attribute was not found, return null
		return null;
	}

	function findObjects(obj, constructorName, attributeName, attributeValue, results) {
		if (typeof results === "undefined") {
			results = [];
		}
		// Base case: if the object is null or undefined, or if it's not an object
		if (!obj || typeof obj !== 'object') {
			return [];
		}
		// Check if the current object has the desired attribute, value, and constructor name
		if (obj.constructor.name === constructorName && obj[attributeName] === attributeValue) {
			return [obj];
		}
		// Iterate over object properties and recursively search for the attribute and constructor name
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				const result = findObjects(obj[key], constructorName, attributeName, attributeValue, results);
				results = results.concat(result);
			}
		}
		return results;
	}

	/**
	 *
	 * @param obj
	 * @param attributeName
	 * @param attributeValue
	 * @returns {Section_Type}
	 */
	function findSection(obj, attributeName, attributeValue) {
		return findObject(obj, "Section_Type", attributeName, attributeValue);
	}

	/**
	 *
	 * @param obj
	 * @param attributeName
	 * @param attributeValue
	 * @returns {Row_Type}
	 */
	function findRow(obj, attributeName, attributeValue) {
		return findObject(obj, "Row_Type", attributeName, attributeValue);
	}

	/**
	 *
	 * @param obj
	 * @param attributeName
	 * @param attributeValue
	 * @returns {Cell_Type}
	 */
	function findCell(obj, attributeName, attributeValue) {
		return findObject(obj, "Cell_Type", attributeName, attributeValue);
	}

	/**
	 *
	 * @param obj
	 * @param attributeName
	 * @param attributeValue
	 * @returns {Section_Type[]}
	 */
	function findSections(obj, attributeName, attributeValue) {
		return findObjects(obj, "Section_Type", attributeName, attributeValue);
	}

	/**
	 *
	 * @param obj
	 * @param attributeName
	 * @param attributeValue
	 * @returns {Row_Type[]}
	 */
	function findRows(obj, attributeName, attributeValue) {
		return findObjects(obj, "Row_Type", attributeName, attributeValue);
	}

	/**
	 *
	 * @param obj
	 * @param attributeName
	 * @param attributeValue
	 * @returns {Cell_Type[]}
	 */
	function findCells(obj, attributeName, attributeValue) {
		return findObjects(obj, "Cell_Type", attributeName, attributeValue);
	}

	/**
	 *
	 * @param {number} mm
	 * @returns {number} emus
	 */
	function mmToEmu(mm) {
		// Conversion factor: 1 cm = 360000 EMUs, 1 cm = 10 mm
		const emusPerCm = 360000;
		const mmPerCm = 10;

		// Calculate EMUs from millimeters using the new conversion factor
		const emus = mm * (emusPerCm / mmPerCm);
		return emus;
	}

	/**
	 * Calls mmToEmu on textValue:
	 * Parse textValue * additionalUnitKoef then convert to Emus then to string
	 * @param {string} textValue - mmUnits value saved in string
	 * @param {number} additionalUnitKoef
	 * @returns {string} textValueCorrectUnits
	 */
	function convertUnits(textValue, additionalUnitKoef) {
		let textValueCorrectUnits = String(mmToEmu(+textValue * additionalUnitKoef));
		return textValueCorrectUnits;
	}

	function computeSweep(startAngle, endAngle, ctrlAngle) {
		let sweep;

		startAngle = (360.0 + startAngle) % 360.0;
		endAngle = (360.0 + endAngle) % 360.0;
		ctrlAngle = (360.0 + ctrlAngle) % 360.0;

		// different sweeps depending on where the control point is

		if (startAngle < endAngle) {
			if (startAngle < ctrlAngle && ctrlAngle < endAngle) {
				sweep = startAngle - endAngle;
			} else {
				sweep = 360 + (startAngle - endAngle);
			}
		} else {
			if (endAngle < ctrlAngle && ctrlAngle < startAngle) {
				sweep = startAngle - endAngle;
			} else {
				sweep = - (360 - (startAngle - endAngle));
			}
		}

		return sweep;
	}

	function transformEllipticalArcParams(x0, y0, x, y, a, b, c, d) {
		// CONSIDER C == 0 otherwise not possible to convert to ECMA 376 arcTo arguments.
		if (parseInt(c) !== 0) {
			console.log('c is not 0\n in sdkjs/tests/draw/api/get-geometry-from-class-api.js');
			return;
		}
		x0 = parseInt(x0);
		y0 = parseInt(y0);
		x = parseInt(x);
		y = parseInt(y);
		a = parseInt(a);
		b = parseInt(b);
		c = parseInt(c);
		d = parseInt(d);

		// http://visguy.com/vgforum/index.php?topic=2464.0
		let d2 = d*d;
		let cx = ((x0-x)*(x0+x)*(y-b)-(x-a)*(x+a)*(y0-y)+d2*(y0-y)*(y-b)*(y0-b))/(2.0*((x0-x)*(y-b)-(x-a)*(y0-y)));
		let cy = ((x0-x)*(x-a)*(x0-a)/d2+(x-a)*(y0-y)*(y0+y)-(x0-x)*(y-b)*(y+b))/(2.0*((x-a)*(y0-y)-(x0-x)*(y-b)));
		// can also be helpful https://stackoverflow.com/questions/6729056/mapping-svg-arcto-to-html-canvas-arcto

		// TODO make no imprecise calculations
		// https://javascript.info/number#imprecise-calculations
		let rx = Math.sqrt(Math.pow(x0-cx, 2) + Math.pow(y0-cy,2) * d2);
		let ry = rx / d;

		let wR = rx;
		let hR = ry;

		let degToC = 60000;

		let radToDeg = 180 / Math.PI;

		let ctrlAngle = Math.atan2((b-cy)/ry, (a-cx)/rx) * radToDeg;
		let startAngle = Math.atan2((y0-cy)/ry, (x0-cx)/rx) * radToDeg;
		let endAngle = Math.atan2((y-cy)/ry, (x-cx)/rx) * radToDeg;

		let sweep = computeSweep(startAngle, endAngle, ctrlAngle);

		let stAng = startAngle * degToC;
		let swAng = sweep * degToC;

		return {wR : String(wR), hR : String(hR), stAng : String(stAng), swAng : String(swAng)};
	}

	/**
	 *
	 * @param {Geometry} geometry
	 * @param commands
	 * @param fillValue
	 */
	function initGeometryFromShapeCommands(geometry, commands, fillValue) {
		/* extrusionOk, fill, stroke, w, h*/
		geometry.AddPathCommand(0, undefined, fillValue, undefined, undefined, undefined);

		let lastPoint = { x: 0, y : 0};

		commands.forEach(function (command, i) {
			// let xName = 'x' + i;
			// let yName = 'y' + i;
			//
			// geometry.AddGuide(xName, FORMULA_TYPE_VALUE, point.x);
			// geometry.AddGuide(yName, FORMULA_TYPE_VALUE, point.y);
			//
			// if (i === 0) {
			// 	geometry.AddPathCommand(1, xName, yName);
			// } else {
			// 	geometry.AddPathCommand(2, xName, yName);
			// }
			switch (command.name) {
				case "MoveTo":
					geometry.AddPathCommand( 1, command.x, command.y);
					lastPoint.x = command.x;
					lastPoint.y = command.y;
					break;
				case "LineTo":
					geometry.AddPathCommand( 2, command.x, command.y);
					lastPoint.x = command.x;
					lastPoint.y = command.y;
					break;
				case "EllipticalArcTo":
					let newParams = transformEllipticalArcParams(lastPoint.x, lastPoint.y, command.x, command.y, command.a, command.b, command.c, command.d);
					geometry.AddPathCommand( 3, newParams.wR, newParams.hR, newParams.stAng, newParams.swAng);
					lastPoint.x = command.x;
					lastPoint.y = command.y;
					break;
			}
		})

		geometry.AddPathCommand(6);
		geometry.setPreset("master1shape1");
	}

	/**
	 * calls convertUnits(value, additionalUnitCoef)  on points
	 * @param points
	 * @param additionalUnitCoef
	 * @returns {*} pointsNewUnits
	 */
	function fromMMtoNewUnits(commands, additionalUnitCoef) {
		let commandsNewUnits = commands.map(function (command) {
			if (command.name === 'LineTo' || command.name === 'MoveTo') {
				let newX = convertUnits(command.x, additionalUnitCoef);
				let newY = convertUnits(command.y, additionalUnitCoef);
				return {name: command.name, x: newX, y: newY};
			} else if (command.name === 'EllipticalArcTo') {
				let newX = convertUnits(command.x, additionalUnitCoef);
				let newY = convertUnits(command.y, additionalUnitCoef);
				let newA = convertUnits(command.a, additionalUnitCoef);
				let newB = convertUnits(command.b, additionalUnitCoef);
				return {name: command.name, x: newX, y: newY, a: newA, b: newB, c : command.c, d : command.d};
			}
		});
		return commandsNewUnits;
	}

	/**
	 *
	 * @param geometrySection
	 * @returns {{name: String, x: String, y: String}[]} commands
	 */
	function getShapeCommandsFromGeometrySection(geometrySection) {
		let commands = [];

		for (let i = 0; true; i++) {
			let rowNum = i + 1;
			let commandRow = findRow(geometrySection, "iX", rowNum);
			if (!commandRow) {
				break;
			}
			let commandName = commandRow.t;
			switch (commandName) {
				case "MoveTo":
					let moveToXTextValue = findCell(commandRow, "n", "X").v;
					let moveToYTextValue = findCell(commandRow, "n", "Y").v;
					commands.push({name: commandName, x: moveToXTextValue, y: moveToYTextValue});
					break;
				case "LineTo":
					let xTextValue = findCell(commandRow, "n", "X").v;
					let yTextValue = findCell(commandRow, "n", "Y").v;
					commands.push({name: commandName, x: xTextValue, y: yTextValue});
					break;
				case "EllipticalArcTo":
					let x = findCell(commandRow, "n", "X").v;
					let y = findCell(commandRow, "n", "Y").v;
					let a = findCell(commandRow, "n", "A").v;
					let b = findCell(commandRow, "n", "B").v;
					let c = findCell(commandRow, "n", "C").v;
					let d = findCell(commandRow, "n", "D").v;
					commands.push({name: commandName, x: x, y: y, a : a, b : b, c : c, d : d});
					break;
			}
		}

		return commands;
	}

	function getGeometryFromShape(master1shape1) {
		let geometrySection = findSection(master1shape1.elements, "n", "Geometry");
		let noFillCell = findCell(geometrySection, "n", "NoFill");
		let fillValue = Number(noFillCell.v) ? undefined : "norm";

		// TODO parse formula and units
		// TODO parse line style fill style text style

		const additionalUnitCoefficient = g_dKoef_in_to_mm;

		let shapeCommands = getShapeCommandsFromGeometrySection(geometrySection);

		// seems like visio y coordinate goes up while
		// ECMA-376-11_5th_edition and Geometry.js y coordinate goes down
		// so without mirror we get shapes up side down
		// TODO flip all page contents

		// imply that units were in mm until units parse realized
		let shapeCommandsNewPointUnits = fromMMtoNewUnits(shapeCommands, additionalUnitCoefficient);

		let geometry = new AscFormat.Geometry();
		initGeometryFromShapeCommands(geometry, shapeCommandsNewPointUnits, fillValue);
		// TODO add connections
		// f.AddCnx('_3cd4', 'hc', 't');
		// f.AddCnx('cd2', 'l', 'vc');
		// f.AddCnx('cd4', 'hc', 'b');
		// f.AddCnx('0', 'r', 'vc');
		return geometry;
	}

	function getGeometryFromClass(shape) {
		// see ECMA-376-1_5th_edition and Geometry.js

		//TODO maybe get Zip so that we can find parts by relationships
		let master1shape1Geometry = getGeometryFromShape(shape)
		return master1shape1Geometry;
	}

	window['AscCommonDraw'].getGeometryFromClass = getGeometryFromClass;
})(window, window.document);
