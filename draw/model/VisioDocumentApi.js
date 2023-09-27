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

"use strict";

(function(window, document)
{
	//-------------------------------------------------------------api---------------------------------------------------
	//TODO move api to another folder maybe

	AscCommonDraw.CVisioDocument.prototype.getMasterByID = function(ID) {
		// join Master_Type and MasterContents_Type
		let masterFromMastersArray = this.masters.master;
		let master = null;

		let thisContext = this;
		for (let i = 0; i < masterFromMastersArray.length; i++) {
			const masterFromMasters = masterFromMastersArray[i];
			if (masterFromMasters.iD === ID) {
				let masterFromMastersArrayRelId = masterFromMasters.rel.id;
				// TODO find file by relationships
				let masterContentNum = +masterFromMastersArrayRelId.match(/\d+/)[0];
				let masterContent = thisContext.masterContents[masterContentNum - 1];
				master = masterFromMasters;
				master.content = masterContent;
				break;
			}
		}
		return master;
	}

	AscCommonDraw.Master_Type.prototype.getShape = function() {
		// return this.content.
	}


	AscCommonDraw.Shape_Type.prototype.getMasterID = function() {
		return this.master;
	}

	AscCommonDraw.Shape_Type.prototype.realizeMasterToShapeInheritance = function(master) {
		// If a master has one top-level shape, a shape that inherits from that master inherits the descendant
		// elements of that master shape. If a master has more than one master shape, a shape that inherits from that
		// master inherits those master shapes as subshapes.

		//TODO dont change this maybe but return new shape

		if (master.content.shapes.length === 1) {
			let masterShape = master.content.shapes[0];
			this.shapes = masterShape.shapes; // get inner shapes

			let masterElements = masterShape.elements;
			let shapeElements = this.elements;
			masterElements.forEach(function(element) {
				let elementExistsAlready = -1 !== shapeElements.findIndex(function (shapeElement) {
					let nAttributeExists = shapeElement.n !== null && typeof shapeElement.n !== 'undefined';
					if (nAttributeExists) {
						return shapeElement.n === element.n;
					}
					let iXAttributeExists = shapeElement.iX !== null && typeof shapeElement.iX !== 'undefined';
					if (iXAttributeExists) {
						return shapeElement.iX === element.iX;
					}
					return false;
				});

				if (!elementExistsAlready) {
					shapeElements.push(element);
				}
			});
		} else {
			// TODO realize subshapes init
		}
	}

})(window, window.document);
