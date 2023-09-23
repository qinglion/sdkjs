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

	/**
	 * Gets points from commands, finds min and max Y points, then mirrors all y values,
	 * consider yMiddle = (maxY - minY) / 2 is Y axis
	 * @param commands
	 * @returns {*} commandsNewPoints
	 */
	function mirrorVertically(commands) {
		let minY = Number.MAX_VALUE;
		let maxY = Number.MIN_VALUE;
		commands.forEach(function (command) {
			minY = Math.min(minY, command.y);
			maxY = Math.max(maxY, command.y);
		});

		let commandsNewPoints = commands.map(function (command) {
			let yMiddle = (maxY - minY) / 2;
			let newY = yMiddle - (command.y - yMiddle);
			return {x: command.x, y: newY};
		});

		return commandsNewPoints;
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

			geometry.AddPathCommand(i === 0 ? 1 : 2, command.x, command.y);
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
	function fromMMtoNewUnits(points, additionalUnitCoef) {
		let pointsNewUnits = points.map(function (point) {
			let newX = convertUnits(point.x, additionalUnitCoef);
			let newY = convertUnits(point.y, additionalUnitCoef);
			return {x: newX, y: newY};
		});
		return pointsNewUnits;
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
		// TODO flip all page contents but not each shape
		shapeCommands = mirrorVertically(shapeCommands);

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
