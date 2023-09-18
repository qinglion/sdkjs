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

	function findSection(obj, attributeName, attributeValue) {
		return findObject(obj, "Section_Type", attributeName, attributeValue);
	}
	function findRow(obj, attributeName, attributeValue) {
		return findObject(obj, "Row_Type", attributeName, attributeValue);
	}
	function findCell(obj, attributeName, attributeValue) {
		return findObject(obj, "Cell_Type", attributeName, attributeValue);
	}

	function findSections(obj, attributeName, attributeValue) {
		return findObjects(obj, "Section_Type", attributeName, attributeValue);
	}
	function findRows(obj, attributeName, attributeValue) {
		return findObjects(obj, "Row_Type", attributeName, attributeValue);
	}
	function findCells(obj, attributeName, attributeValue) {
		return findObjects(obj, "Cell_Type", attributeName, attributeValue);
	}

	function getGeometryFromClass(visioDocument) {
		// DOES NOT WORK NOW
		//TODO maybe get Zip so that we can find parts by relationships
		let master1shape1 = visioDocument.masterContents[0].shapes[0];

		// TODO add line style fill style text style

		let geometrySection = findSection(master1shape1.elements, "n", "Geometry");
		let noFillCell = findCell(geometrySection, "n", "NoFill");
		let fillValue = Number(noFillCell.v) ? undefined : "norm";

		// TODO parse formula and units

		let geometry = new AscFormat.Geometry();
		let f = geometry;

		f.AddCnx('_3cd4', 'hc', 't');
		f.AddCnx('cd2', 'l', 'vc');
		f.AddCnx('cd4', 'hc', 'b');
		f.AddCnx('0', 'r', 'vc');

		f.AddRect('l', 't', 'r', 'b');
		/* extrusionOk, fill, stroke, w, h*/
		f.AddPathCommand(0,undefined, /*fillValue*/ undefined, undefined, undefined, undefined);

		let moveToRow = findRow(geometrySection, "t", "MoveTo");
		let moveToX = findCell(moveToRow, "n", "X").v;
		let moveToY = findCell(moveToRow, "n", "Y").v;
		f.AddPathCommand(1, 'l', 't');
		// f.AddPathCommand(1, 'l', 't');

		let lineToRows = findRows(geometrySection, "t", "LineTo");
		lineToRows.forEach(function (rowObject, i) {
			let xValue = findCell(rowObject, "n", "X").v;
			let yValue = findCell(rowObject, "n", "Y").v;
			let num = i + 1;
			// f.AddAdj('x' + num, 15, xValue);
			// f.AddAdj('y' + num, 15, yValue);
			f.AddAdj('x' + num, 15, 'r');
			f.AddAdj('y' + num, 15, 'b');
			f.AddPathCommand(2, 'x' + num, 'y' + num);
		});
		// f.AddPathCommand(2, 'r', 'b');
		// f.AddPathCommand(2, 'l', 'b');

		f.AddPathCommand(6);

		geometry.setPreset("master1shape1");
		return geometry;
	}

	window['AscCommonDraw'].getGeometryFromClass = getGeometryFromClass;
})(window, window.document);
