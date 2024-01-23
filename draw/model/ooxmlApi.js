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

	/**
	 *    // Docs old:
	 *    // Useless see ShapeSheet_Type - old
	 *    // Inherites(extends) ShapeSheet_Type in new schema
	 * @return {Shape_Type}
	 * @constructor
	 */
	function Shape_Type() {
		this.iD = null;
		this.originalID = null;
		this.del = null;
		this.masterShape = null;
		this.uniqueID = null;
		this.name = null;
		this.nameU = null;
		this.isCustomName = null;
		this.isCustomNameU = null;
		this.master = null;
		this.type = null;
		/**
		 * use get subshapes method
		 * Always use it see Shape_Type.prototype.realizeMasterToShapeInheritanceRecursive js docs for explanation.
		 * @type {Shape_Type[]}
		 */
		this.shapes = [];

		setShapeSheetClassMembers.call(this);
		return this;
	}

	// Docs old:
	// Section_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/section_type-complextypevisio-xml
	function Section_Type() {
		this.n = null;
		this.del = null;
		this.iX = null;

		// always use getter setter methods
		// Always use it see Shape_Type.prototype.realizeMasterToShapeInheritanceRecursive js docs for explanation.
		this.cells = [];
		this.triggers = [];
		this.rows = [];
		return this;
	}

	// Docs old:
	// Элемент RefBy (Cell_Type complexType): https://learn.microsoft.com/ru-ru/office/client-developer/visio/refby-element-cell_type-complextypevisio-xml
	// Cell_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/cell_type-complextypevisio-xml
	function Cell_Type() {
		// read all as strings
		/**
		 * read as string
		 * @type {string}
		 */
		this.n = null;
		/**
		 * read as string
		 * @type {string}
		 */
		this.u = null;
		/**
		 * read as string
		 * @type {string}
		 */
		this.e = null;
		/**
		 * read as string
		 * @type {string}
		 */
		this.f = null;
		/**
		 * read as string
		 * @type {string}
		 */
		this.v = null;
		this.refBy = [];
		this.textContent = null;

		// not same case like in Text_Type
		// I suppose text cant go along with inner text
		// There is either textContent or refBy
		// I dont make it like it Text_Type to
		// left separate attributes refBy  and textContent and dont replace both by elements
		return this;
	}

	// Docs old:
	// Row_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/row_type-complextypevisio-xml
	function Row_Type() {
		this.n = null;
		this.localName = null;
		this.iX = null;
		this.t = null;
		this.del = null;

		this.cells = [];
		this.triggers = [];
		return this;
	}


	Shape_Type.prototype.getMasterID = function() {
		return this.master;
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
			results.push(obj);
		}
		// Iterate over object properties and recursively search for the attribute and constructor name
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				findObjects(obj[key], constructorName, attributeName, attributeValue, results);
			}
		}
		return results;
	}

	// 2.3.4.2.5	Cell_Type
	// N attribute MUST be unique amongst all of the Cell_Type elements of the containing Row_Type element

	// 2.3.4.2.81	Row_Type
	// If a Row_Type element specifies an N attribute, then it MUST NOT specify an IX attribute.
	// This attribute MUST be unique amongst all of the Row_Type elements of the containing Section_Type
	// element.

	// If a Row_Type element specifies an IX attribute, then it MUST NOT specify an N attribute.
	// The IX attribute of a Row_Type element MUST be unique amongst all of the Row_Type elements
	// of the containing Section_Type element.

	// 2.3.4.2.85	Section_Type
	// N attribute MUST be unique amongst all of the Section_Type elements of the containing Sheet_Type element
	// unless it is equal to "Geometry"!

	// IX attribute MUST be unique amongst all of the Section_Type elements with the same N attribute
	// of the containing Sheet_Type.

	// When the IX attribute is not present, the index of the element is calculated implicitly
	// by counting the number of  preceding Section_Type elements with the same N attribute in the containing
	// Sheet_Type.

	/**
	 * Always use it see Shape_Type.prototype.realizeMasterToShapeInheritanceRecursive js docs for explanation.
	 * Finds shape cell by formula - if it is /d+ search goes by IX attribute or
	 * search by N attribute otherwise. But if it is Geometry search by both N and IX and
	 * use formula like Geometry0, Geometry1, Geometry2, ... So if it is N use name of Section
	 * if search is by IX use number only
	 * @param {String} formula
	 * @memberof Shape_Type
	 * @returns {Section_Type | null}
	 */
	Shape_Type.prototype.getSection = function findSection(formula) {
		throw new Error("Shape_Type.prototype.findSection not realized");
	}

	/**
	 * Always use it see Shape_Type.prototype.realizeMasterToShapeInheritanceRecursive js docs for explanation.
	 * @param {String} formula
	 * @memberof Shape_Type
	 * @returns {Row_Type | null}
	 */
	Shape_Type.prototype.getRow = function findRow(formula) {
		throw new Error("not realized");
	}

	/**
	 * Always use it see Shape_Type.prototype.realizeMasterToShapeInheritanceRecursive js docs for explanation.
	 * Finds shape cell by fromula.
	 *
	 * Shape can have cells directly in them or inside sections. Lets just search for cells
	 * directly inside shapes for now.
	 *
	 * Returns object of shape not copy!
	 *
	 * visio can use formulas like Geometry1.X2 - first geometrySection, second Row, X column
	 * but Row for example can be found by IX N
	 * @param {String} formula
	 * @memberof Shape_Type
	 * @returns {Cell_Type | null}
	 */
	Shape_Type.prototype.getCell = function findCell(formula) {
		// Cells can have N only no IX
		return findObject(this.elements, "Cell_Type", "n", formula);
	}

	/**
	 * Always use it see Shape_Type.prototype.realizeMasterToShapeInheritanceRecursive js docs for explanation.
	 * if in formula we have both ix and n we should use findSection instead.
	 * or if we use it with number in formula
	 * @param {String} formula
	 * @memberof Shape_Type
	 * @returns {Section_Type[] | null}
	 */
	Shape_Type.prototype.getSections = function(formula) {
		if (/^\d+$/.test(formula)) {
			// if number
			console.log('strange findSections use (with number)');
			return findObjects(this.elements, "Section_Type", "iX", formula);
		}
		return findObjects(this.elements, "Section_Type", "n", formula);
	}

	/**
	 * Always use it see Shape_Type.prototype.realizeMasterToShapeInheritanceRecursive js docs for explanation.
	 * @memberof Shape_Type
	 * @return {Shape_Type[]}
	 */
	Shape_Type.prototype.getSubshapes = function () {
		return this.shapes;
	}

	/**
	 * Always use it see Shape_Type.prototype.realizeMasterToShapeInheritanceRecursive js docs for explanation.
	 * get elements inherited from shape sheet type
	 * @return {*}
	 */
	Shape_Type.prototype.getElements = function () {
		return this.elements;
	}

	/**
	 * Always use it see Shape_Type.prototype.realizeMasterToShapeInheritanceRecursive js docs for explanation.
	 *
	 * Cells in Section (section is like table in visio) can exist by itself, directy in section like here
	 * https://disk.yandex.ru/d/Ud6-wmVjNnOyUA
	 * with their names like Width, Height, Angle (for Shape Thansform section)
	 * or they can be in Rows like here
	 * https://disk.yandex.ru/i/4ASd_5KHYIlXKw
	 * with names X, Y, A, B (for Geometry SplineStart Row).
	 *
	 * Lets search cells only directly in Section for now.
	 *
	 * @param {String} formula
	 * @memberof Section_Type
	 * @returns {Cell_Type | null}
	 */
	Section_Type.prototype.getCell = function (formula) {
		// Cells can have N only no IX
		return findObject(this.cells, "Cell_Type", "n", formula);
	}

	/**
	 * Always use it see Shape_Type.prototype.realizeMasterToShapeInheritanceRecursive js docs for explanation.
	 * Finds row in sections. Returns link to object not copy.
	 * @param {String | Number} formula
	 * @memberof Section_Type
	 * @returns {null | Row_Type}
	 */
	Section_Type.prototype.getRow = function (formula) {
		if (typeof formula === "number" || /^\d+$/.test(formula)) {
			return findObject(this.rows, "Row_Type", "iX", Number(formula));
		}
		return findObject(this.rows, "Row_Type", "n", formula);
	}


	/**
	 * returns this shape and subshapes array without cloning so objects are linked.
	 * @param {boolean} [recalculatePinCords] if true changes subshapes cords from parent shape relative to absolute
	 * @param [resultArray = []]
	 * @memberof Shape_Type
	 * @return {Shape_Type[]}
	 */
	Shape_Type.prototype.collectSubshapesRecursive = function(recalculatePinCords, resultArray) {
		if (resultArray === undefined) {
			resultArray = [];
		}

		if (recalculatePinCords === undefined || recalculatePinCords === null) {
			recalculatePinCords = false;
		}

		resultArray.push(this);

		let subShapes = this.getSubshapes();
		for (let j = 0; j < subShapes.length; j++) {
			const subShape = subShapes[j];

			if (recalculatePinCords) {
				let parentShapePinX = Number(this.getCell("PinX").v);
				let parentShapePinY = Number(this.getCell("PinY").v);
				let parentShapeLocPinX = Number(this.getCell("LocPinX").v);
				let parentShapeLocPinY = Number(this.getCell("LocPinY").v);

				let subShapePinX = subShape.getCell("PinX");
				let subShapePinY = subShape.getCell("PinY");

				// there was case with shape type group with no PinX and PinY
				if (subShapePinX !== null) {
					let sub_shape_pinX_inch = Number(subShapePinX.v);
					subShapePinX.v = parentShapePinX - parentShapeLocPinX + sub_shape_pinX_inch;
				}

				if (subShapePinY !== null) {
					let sub_shape_pinY_inch = Number(subShapePinY.v);
					subShapePinY.v = parentShapePinY - parentShapeLocPinY + sub_shape_pinY_inch;
				}
			}

			subShape.collectSubshapesRecursive(recalculatePinCords, resultArray);
		}

		return resultArray;
	}

	/**
	 * Realizes Master-To-Shape inheritance.
	 * Comes through the shape recursively through all subshapes
	 * and copies properties from their masters if master exist.
	 * Uses clone function so copied objects are unlinked from master.
	 *
	 * This function erases original shape object and after function call we cant find what props are
	 * inherited.
	 *
	 * Also a memory problem. Master attributes copy to each shape.
	 * but on the most heavy file shapeClasses after inheritance is only 217 megabytes
	 *
	 * TODO:
	 * 	maybe like this
	 * 	rewrite: just set simple links to masters for shape and subshapes in this function BUT
	 * 	!!! always use function getCell/getRow/getSection/getSubshape/getElements which will search for element
	 * 	in this shape first and then in master. Also use getElements or getSubshapes functions to get all
	 * 	cells/rows/sections or subshapes, theese function will first merge master and shape elements/subshapes
	 * 	and then return elements/subshapes.
	 *  Also use setter functions.
	 *
	 * @param masters
	 * @param {Shape_Type[]?} ancestorMasterShapes
	 * @return {Shape_Type} shape with all its props
	 */
	Shape_Type.prototype.realizeMasterToShapeInheritanceRecursive = function(masters, ancestorMasterShapes) {
		// 2.2.5.4.1	Master-to-Shape Inheritance
		// If shape has master or masterShape that have 1 top level shape
		//  - inherit elements (sections, rows, cells) and subshapes
		// If shape has master or masterShape that have several top level shapes
		// - inherit only subshapes as shape subshapes
		//
		// subshapes inheritance:
		// 2.2.5.4.1	Master-to-Shape Inheritance
		// "if an instance contains a subshape whose ShapeSheet_Type (now it is Shape_Type)
		// element has a MasterShape attribute that matches the ID attribute of a subshape of the master,
		// the local properties specified in this subshape will override those of the corresponding subshape
		// in the master."
		// "subshapes not specified in the instance are inherited from the master." (from its master)
		//
		// So in main function come across all shapes and subshapes and call realizeMasterToShapeInheritanceRecursive
		//
		// realizeMasterToShapeInheritanceRecursive:
		// shape can have master or masterShape id and be it master or masterShape if master (master or masterShape) have
		// 1 top level shape it inherits its elements, then handle subshapes.
		//
		// handle subshapes:
		// come along master and check MasterShape attributes if we have no shape with this MasterShape copy it to
		// out shape.
		// What if we inherit with MasterShape id not with Master id do we check MasterShape attributes from our Shape?
		// - I think yes we compare subshape ids from masterShape with MasterShape ids of subshapes of shape that
		// is beiing inherited (check sub MasterShape ids)
		// We dont need to merge subshapes elements in currents step because we will make it in recursion iterations?
		// Its just a detail of realization but yes. For subshapes we merge elements on next steps on recursive calls.
		//
		// handle several top level subshapes:
		// just handle shape subshapes like above
		//
		// - can shape just consist of multiple shapes like master?
		// maybe dont memorize MasterShape shape. but when we inherit one level below its masterIds

		// - should we search for Master shape with the specified MasterShape recursively?
		// previously i set MasterShape as ancestorMasterShapes and didnt use collectSubshapesRecursive
		// to search for master but now code is code is more flexible but picture didnt change anyway
		// code is more readable

		// - should we compare nested shapes of shape and master recursively?
		// no bcs - realizeMasterToShapeInheritanceRecursive will call itself on subshapes so it will call
		// compare nested shapes recursively (mergeSubshapes)
		// but what if need to call merge subshapes recursively on subshapes relative to this master?
		// - no because if subshape at any deep have no Master/MasterShape in need no
		// call mergeSubshapes otherwise realizeMasterToShapeInheritanceRecursive will call mergeSubshapes because
		// shape have Master/MasterShape attribute.

		// - what about both master and masterShape inheritance?

		// - dont forget to inherit links to styles from master

		// Consider examples
		// <PageContents>
		//   <Shapes>
		//    	<Shape ID='22' NameU='Process' Name='Process' Type='Group' Master='4'>
		// 	  		<Cell N='PinX' V='2.75'/>
		//      	<Cell N='PinY' V='6.375'/>
		// 	  		...
		//       	<Shapes>
		//         		<Shape ID='98' NameU='Flags' Name='Flags' Type='Group' Master='26'>
		// 		  				<Cell N='PinX' V='0.875' U='IN'/>
		//          		<Cell N='PinY' V='0.9375' U='IN'/>
		// 		  				...
		//
		// <PageContents>
		//   <Shapes>
		//     <Shape ID='31' NameU='Headquarters' Name='Headquarters' Type='Group' Master='2'>
		//       <Cell N='PinX' V='5.5'/>
		//       <Cell N='PinY' V='7.097826086956522'/>
		// 	  		...
		// 	  		<Shapes>
		//         		<Shape ID='32' Type='Shape' MasterShape='6'>
		//           		<Cell N='PinX' V='1.113900526692464' F='Inh'/>
		//           		<Cell N='PinY' V='1.16976435446399' F='Inh'/>
		// 		  				...


		let masterShapesToInheritFrom = [];

		// lets create copy of this shape work with it then return it
		// let thisShapeCopy = clone(this);

		// check Master attribute and set shapes/shape
		// to inherit from: masterShapesToInheritFrom and ancestorMasterShapes
		let topShapeMasterId = this.getMasterID();
		if (topShapeMasterId !== null && topShapeMasterId !== undefined) {
			let topShapeMasterIndex = masters.findIndex(function(masterObject) {
				return masterObject.iD === topShapeMasterId;
			});
			let topShapeMaster = masters[topShapeMasterIndex];

			let masterShapes = topShapeMaster.content.shapes;
			masterShapesToInheritFrom = masterShapes;

			// all descendant shapes will inherit from that master
			ancestorMasterShapes = masterShapesToInheritFrom;
		}

		// check MasterShape attribute and set shapes/shape
		// to inherit from: masterShapesToInheritFrom and ancestorMasterShapes
		let masterShapeId = this.masterShape;
		if (masterShapeId !== null && masterShapeId !== undefined) {
			if (ancestorMasterShapes === null || ancestorMasterShapes === undefined) {
				console.log("MasterShape attribute is set but Master is not set for ", this);
			} else {
				let masterIndex = -1;
				if (ancestorMasterShapes.length === 1) {
					// if master has one top level shape
					let masterSubshapes = ancestorMasterShapes[0].collectSubshapesRecursive(false);
					masterIndex = masterSubshapes.findIndex(function (masterSubshape) {
						return masterShapeId === masterSubshape.iD;
					});
					let masterShape = masterSubshapes[masterIndex];
					masterShapesToInheritFrom = [masterShape];
				} else {
					let masterSubshapes = [];
					ancestorMasterShapes.forEach(function(ancestorMasterShape) {
						let masterSubshapesNth = ancestorMasterShape.collectSubshapesRecursive(false);
						masterSubshapes = masterSubshapes.concat(masterSubshapesNth);
					})
					masterIndex = masterSubshapes.findIndex(function (masterSubshape) {
						return masterShapeId === masterSubshape.iD;
					});
					let masterShape = masterSubshapes[masterIndex];
					masterShapesToInheritFrom = [masterShape];
				}

				if (masterIndex === -1) {
					console.log('For MasterShape = ', masterShapeId, 'shape not found in master. Check shape: ', this);
				}
			}
		}

		// inherit: mergeElements and clone shapes to which elements will be merged on recursive calls
		if (masterShapesToInheritFrom.length === 1) {
			let masterShapeToInheritFrom = masterShapesToInheritFrom[0];

			// inherit link to styles
			if (!this.lineStyle) {
				this.lineStyle = masterShapeToInheritFrom.lineStyle;
			}
			if (!this.fillStyle) {
				this.fillStyle = masterShapeToInheritFrom.fillStyle;
			}
			if (!this.textStyle) {
				this.textStyle = masterShapeToInheritFrom.textStyle;
			}

			let shapeElements = this.elements;
			let masterElements = masterShapeToInheritFrom.elements;
			mergeElementArrays(shapeElements, masterElements);

			let shapeSubshapes = this.shapes;
			let masterSubshapes = masterShapeToInheritFrom.shapes;
			cloneSubshapes(shapeSubshapes, masterSubshapes, masters);
		} else if (masterShapesToInheritFrom.length > 1) {
			// does it ever happens?
			// what about style inheritance?
			cloneSubshapes(this.shapes, masterShapesToInheritFrom, masters);
		}

		// call recursive on all subshapes
		let subshapes = this.shapes;
		subshapes.forEach(function(shape) {
			shape.realizeMasterToShapeInheritanceRecursive(masters, ancestorMasterShapes);
		});

		// return thisShapeCopy;
		// end of method

		/**
		 * clones masters shapes to given shape.
		 * Uses MasterShapeAttributes to find shapes to insert.
		 * @param {Shape_Type[]} shapeSubshapes
		 * @param {Shape_Type[]} masterSubshapes
		 * @param masters - result from joinMastersInfoAndContents()
		 */
		function cloneSubshapes(shapeSubshapes, masterSubshapes, masters) {
			// If subshape has Master attribute with id of any master: call realizeMasterToShapeInheritance
			// If subshape has MasterShape attribute with id of any parents shape masters subshapes:
			// 	call mergeElementArrays NO RECURSION HERE
			// If there is a shape in master but there is no such local subshape then it should be inherited (copied)
			// lets check if it exists locally only by MasterShape attribute
			// examples it the bottom of the function

			// handle subshapes MasterShape attribute
			masterSubshapes.forEach(function(masterSubshape) {
				let mergeElementIndex = findIndexComparingByMasterShapeAttribute(shapeSubshapes, masterSubshape);
				let elementExistsAlready = mergeElementIndex !== -1;

				// 2.2.5.4.1	Master-to-Shape Inheritance
				// "subshapes not specified in the instance are inherited from the master." (from its master)
				if (!elementExistsAlready) {
					// maybe add masterShape attribute to new shape - lets dont do it because:
					// of recursive iterations of inheritance we will try to inherit because we will se masterShape but
					// there is no need because it is copy pasted element no need in inheritance
					// maybe consider id to insert in ascending order
					shapeSubshapes.push(clone(masterSubshape));
				} else {
					// 2.2.5.4.1	Master-to-Shape Inheritance
					// "if an instance contains a subshape whose ShapeSheet_Type element has a MasterShape attribute that matches
					// the ID attribute of a subshape of the master, the local properties specified in this subshape will
					// override those of the corresponding subshape in the master."

					// let masterElements = masterSubshape.elements;
					// let shapeElements = shapeSubshapes[mergeElementIndex].elements;
					// mergeElementArrays(shapeElements, masterElements);

					// it is done in realizeMasterToShapeInheritanceRecursive with subshapes handle
				}
			});

			// handle subshapes Master attributes
			// shapeSubshapes.forEach(function(subShape) {
			// 	subShape.realizeMasterToShapeInheritanceRecursive(masters);
			// });
			// UPD: in realizeMasterToShapeInheritanceRecursive
		}

		function findIndexComparingByMasterShapeAttribute(shapeSubshapes, masterSubshape) {
			return shapeSubshapes.findIndex(function (element) {
				return element.masterShape === masterSubshape.iD;
			});
		}
	}

	/**
	 * Inherits all style elements (sections, rows, cells).
	 * inherites style to master/shape or style to style. Process is the same.
	 * @param {Shape_Type | StyleSheet_Type} thisArgument
	 * @param {StyleSheet_Type[]} styles
	 */
	function realizeStyleToSheetObjInheritanceRecursive(thisArgument, styles) {
		// if (thisArgument.lineStyle === null || thisArgument.fillStyle === null || thisArgument.textStyle === null) {
		// 	console.log('Unhandled realizeStyleToShapeInheritanceRecursive case. lineStyle or fillStlye or textStyle is ' +
		// 		'null.\nShape:', thisArgument);
		// 	return;
		// }
		if (!(thisArgument.lineStyle === thisArgument.fillStyle && thisArgument.lineStyle === thisArgument.textStyle)) {
			// Attribute	Cell_Type elements

			// LineStyle	Specifies Cell_Type elements related to line properties except for Cell_Type child elements
			// of a FillGradient Section_Type.
			// Line property information in shapes, masters, and styles is specified by the LineColor, LinePattern, LineWeight,
			// LineCap, BeginArrow, EndArrow, LineColorTrans, CompoundType, BeginArrowSize, EndArrowSize, Rounding,
			// LineGradientDir, LineGradientAngle, and LineGradientEnabled Cell_Type elements, and the Cell_Type
			// elements belonging to the LineGradient Section_Type.

			// FillStyle	Specifies Cell_Type elements related to fill properties and effect properties
			// including Cell_Type child elements of a FillGradient Section_Type.
			// Fill property information in shapes, masters, and styles is specified by the FillForegnd,
			// FillForegndTrans, FillBkgnd, FillBkgndTrans, FillPattern,
			// FillGradientDir, FillGradientAngle, FillGradientEnabled,
			// RotateGradientWithShape, and UseGroupGradientCell_Type elements,
			// and the Cell_Type elements belonging to the FillGradient Section_Type.
			// Shadow effect set information in shapes, masters, and styles is specified by the ShdwForegnd, ShdwForegndTrans,
			// ShdwPattern, ShapeShdwType, ShapeShdwOffsetX, ShapeShdwOffsetY, ShapeShdwObliqueAngle, ShapeShdwScaleFactor,
			// and ShapeShdwBlur Cell_Type elements.

			// TextStyle	Specifies Cell_Type elements related to text.

			// What about Quick style cells?

			// cells rows sections
			// TODO check cells inside section LineGradient
				let lineStyleElements = ["LineColor", "LinePattern", "LineWeight", "LineCap", "BeginArrow", "EndArrow",
					"LineColorTrans", "CompoundType", "BeginArrowSize", "EndArrowSize", "Rounding",
					"LineGradientDir", "LineGradientAngle", "LineGradientEnabled", "LineGradient",
					"QuickStyleLineColor", "QuickStyleLineMatrix"];

			// TODO check cells inside section FillGradient
				let fillStyleElements = ["FillForegnd", "FillForegndTrans", "FillBkgnd", "FillBkgndTrans", "FillPattern",
					"FillGradientDir", "FillGradientAngle", "FillGradientEnabled",
					"RotateGradientWithShape", "UseGroupGradientCell_Type", "FillGradient",
					"ShdwForegnd", "ShdwForegndTrans", "ShdwPattern", "ShapeShdwType", "ShapeShdwOffsetX", "ShapeShdwOffsetY",
					"ShapeShdwObliqueAngle", "ShapeShdwScaleFactor", "ShapeShdwBlur",
				"QuickStyleFillColor", "QuickStyleFillMatrix"];

				let textStyleElements = ["TextBkgnd", "TextDirection", "TextBkgndTrans", "LockTextEdit", "HideText",
					"TheText", "IsTextEditTarget", "KeepTextFlat", "ReplaceLockText", "TextPosAfterBullet"];

				if (thisArgument.lineStyle !== null) {
					let styleId = Number(thisArgument.lineStyle);
					let styleSheet = styles.find(function(style) {
						return style.iD === styleId;
					});
					realizeStyleToSheetObjInheritanceRecursive(styleSheet, styles);
					mergeElementArrays(thisArgument.elements, styleSheet.elements, lineStyleElements);
				}

				if (thisArgument.fillStyle !== null) {
					let styleId = Number(thisArgument.fillStyle);
					let styleSheet = styles.find(function(style) {
						return style.iD === styleId;
					});
					realizeStyleToSheetObjInheritanceRecursive(styleSheet, styles);
					mergeElementArrays(thisArgument.elements, styleSheet.elements, fillStyleElements);
				}

				if (thisArgument.textStyle !== null) {
					let styleId = Number(thisArgument.textStyle);
					let styleSheet = styles.find(function(style) {
						return style.iD === styleId;
					});
					realizeStyleToSheetObjInheritanceRecursive(styleSheet, styles);
					mergeElementArrays(thisArgument.elements, styleSheet.elements, textStyleElements);
				}

			// console.log('Unhandled realizeStyleToShapeInheritanceRecursive case. lineStyle fillStlye textStyle are not ' +
			// 	'equal. So multiple styles should be inherited with specific properties.\nShape:', thisArgument);
			return;
		}
		if (thisArgument.lineStyle === null && thisArgument.fillStyle === null && thisArgument.textStyle === null) {
			// console.log('Top parent style');
			return;
		}

		let styleId = Number(thisArgument.lineStyle);
		let styleSheet = styles.find(function(style) {
			return style.iD === styleId;
		});

		realizeStyleToSheetObjInheritanceRecursive(styleSheet, styles);

		mergeElementArrays(thisArgument.elements, styleSheet.elements);
	}

	/**
	 * Copy all style elements (sections, rows, cells) to shape.
	 * (Doesnt take much memory < 300MB with master inheritance for the most large files)
	 * @param styles
	 */
	Shape_Type.prototype.realizeStyleToShapeInheritanceRecursive = function(styles) {
		realizeStyleToSheetObjInheritanceRecursive(this, styles);

		// call recursive on all subshapes
		let subshapes = this.shapes;
		subshapes.forEach(function(shape) {
			shape.realizeStyleToShapeInheritanceRecursive(styles);
		});
	}

	/**
	 * clone master elements (sections, rows, cells) to shapeElements.
	 * For Sections and Rows merge is recursive: we compare inner cells by their names
	 * @param shapeElements - cells rows sections
	 * @param masterElements - cells rows sections
	 * @param {string[]?} elementsToMerge - cells rows sections list we can merge
	 * @param {boolean?} isParentInList
	 */
	function mergeElementArrays(shapeElements, masterElements, elementsToMerge, isParentInList) {
		/**
		 * find index of cell row or section
		 * @param elementsArray
		 * @param elementToFind
		 * @returns {*}
		 */
		function findIndexComparingByNorIX(elementsArray, elementToFind) {
			// 2.3.4.2.5	Cell_Type
			// N attribute MUST be unique amongst all of the Cell_Type elements of the containing Row_Type element

			// 2.3.4.2.81	Row_Type
			// If a Row_Type element specifies an N attribute, then it MUST NOT specify an IX attribute.
			// This attribute MUST be unique amongst all of the Row_Type elements of the containing Section_Type
			// element.

			// If a Row_Type element specifies an IX attribute, then it MUST NOT specify an N attribute.
			// The IX attribute of a Row_Type element MUST be unique amongst all of the Row_Type elements
			// of the containing Section_Type element.

			// 2.3.4.2.85	Section_Type
			// N attribute MUST be unique amongst all of the Section_Type elements of the containing Sheet_Type element
			// unless it is equal to "Geometry"!

			// IX attribute MUST be unique amongst all of the Section_Type elements with the same N attribute
			// of the containing Sheet_Type.

			// When the IX attribute is not present, the index of the element is calculated implicitly
			// by counting the number of  preceding Section_Type elements with the same N attribute in the containing
			// Sheet_Type.
			return elementsArray.findIndex(function (element) {
				let nAttributeExists = element.n !== null && typeof element.n !== 'undefined';
				let iXAttributeExists = element.iX !== null && typeof element.iX !== 'undefined';

				if (nAttributeExists && iXAttributeExists) {
					return element.iX == elementToFind.iX && element.n === elementToFind.n;
				}
				if (nAttributeExists) {
					return element.n === elementToFind.n;
				}
				if (iXAttributeExists) {
					return element.iX === elementToFind.iX;
				}
				// if smth wrong with nAttributeExists or iXAttributeExists
				return false;
			});
		}

		let mergeAll = false;

		if (elementsToMerge === undefined) {
			mergeAll = true;
		}

		masterElements.forEach(function(masterElement) {
			let mergeElementIndex = findIndexComparingByNorIX(shapeElements, masterElement);
			let elementExistsAlready = mergeElementIndex !== -1;

			let elementIsInList = elementsToMerge !== undefined && elementsToMerge.includes(masterElement.n);
			let listCheck = elementIsInList || isParentInList || mergeAll;

			if (!elementExistsAlready) {
				if (listCheck) {
					// TODO fix order
					// mb lets not add cell after section
					let elementCopy = clone(masterElement);
					shapeElements.push(elementCopy);
					// ix wrong order causes problems
					shapeElements.sort(function (a, b) {
						return a.iX - b.iX;
					});
				}
			} else {
				// merge inner elements recursive if not cell
				if (masterElement.constructor.name !== 'Cell_Type') {
					// if Section or Row
					let shapeElement = shapeElements[mergeElementIndex];
					if (masterElement.constructor.name == 'Section_Type') {
						// for future checks
						isParentInList = elementIsInList || isParentInList;
						// recursive calls
						mergeElementArrays(shapeElement.cells, masterElement.cells, elementsToMerge, isParentInList);
						mergeElementArrays(shapeElement.rows, masterElement.rows, elementsToMerge, isParentInList);
					} else if (masterElement.constructor.name == 'Row_Type') {
						// for future checks
						isParentInList = elementIsInList || isParentInList;
						// recursive calls
						mergeElementArrays(shapeElement.cells, masterElement.cells, elementsToMerge, isParentInList);
					}
				}
			}
		});
	}


	/**
	 * get deep copy of object with prototypes
	 * @param object
	 * @return {any}
	 */
	function clone(object) {
		function cloneWithPrototypesRecursive(copyObject, originalObject) {
			Object.setPrototypeOf(copyObject, Object.getPrototypeOf(originalObject));

			// Iterate over object properties and recursively
			for (const key in originalObject) {
				if (originalObject.hasOwnProperty(key)) {
					if (typeof originalObject[key] === 'object' && originalObject[key] !== null) {
						// so after line below when we set array props using copyObject[key] = originalObject[key];
						// array length will change automatically
						copyObject[key] = Array.isArray(originalObject[key]) ? [] : Object.create(null);
						cloneWithPrototypesRecursive(copyObject[key], originalObject[key]);
					} else {
						copyObject[key] = originalObject[key];
					}
				}
			}
		}

		let copy = Object.create(null);
		// let copy = JSON.parse(JSON.stringify(object));
		cloneWithPrototypesRecursive(copy, object);
		// console.log("Clone function test.\nObject before: ", object, "\nAfter: ", copy);
		return copy;
	}

	/**
	 * calculateShapeParamsAndConvertToCShape
	 * @memberof Shape_Type
	 * @param {CVisioDocument} visioDocument
	 * @return {CShape | Error}
	 */
	Shape_Type.prototype.convertToCShape = function (visioDocument) {
		function calculateCellUniFill(theme, shape, cell) {
			let cellValue = cell && cell.v;
			let cellName = cell && cell.n;

			let uniFill;

			if (/#\w{6}/.test(cellValue)) {
				// check if hex
				let rgba = AscCommon.RgbaHexToRGBA(cellValue);
				uniFill = AscFormat.CreateUnfilFromRGB(rgba.R, rgba.G, rgba.B);
			} else if (cellValue === 'Themed') {
				// equal to THEMEVAL() call
				uniFill = AscCommonDraw.themeval(theme, shape, cell);
			} else {
				let colorIndex = parseInt(cellValue);
				if (!isNaN(colorIndex)) {
					let rgba = AscCommon.RgbaHexToRGBA(cellValue);
					switch (colorIndex) {
						case 0:
							rgba = AscCommon.RgbaHexToRGBA('#000000');
							break;
						case 1:
							rgba = AscCommon.RgbaHexToRGBA('#FFFFFF');
							break;
						case 2:
							rgba = AscCommon.RgbaHexToRGBA('#FF0000');
							break;
						case 3:
							rgba = AscCommon.RgbaHexToRGBA('#00FF00');
							break;
						case 4:
							rgba = AscCommon.RgbaHexToRGBA('#0000FF');
							break;
						case 5:
							rgba = AscCommon.RgbaHexToRGBA('#FFFF00');
							break;
						case 6:
							rgba = AscCommon.RgbaHexToRGBA('#FF00FF');
							break;
						case 7:
							rgba = AscCommon.RgbaHexToRGBA('#00FFFF');
							break;
						case 8:
							rgba = AscCommon.RgbaHexToRGBA('#800000');
							break;
						case 9:
							rgba = AscCommon.RgbaHexToRGBA('#008000');
							break;
						case 10:
							rgba = AscCommon.RgbaHexToRGBA('#000080');
							break;
						case 11:
							rgba = AscCommon.RgbaHexToRGBA('#808000');
							break;
						case 12:
							rgba = AscCommon.RgbaHexToRGBA('#800080');
							break;
						case 13:
							rgba = AscCommon.RgbaHexToRGBA('#008080');
							break;
						case 14:
							rgba = AscCommon.RgbaHexToRGBA('#C0C0C0');
							break;
						case 15:
							rgba = AscCommon.RgbaHexToRGBA('#E6E6E6');
							break;
						case 16:
							rgba = AscCommon.RgbaHexToRGBA('#CDCDCD');
							break;
						case 17:
							rgba = AscCommon.RgbaHexToRGBA('#B3B3B3');
							break;
						case 18:
							rgba = AscCommon.RgbaHexToRGBA('#9A9A9A');
							break;
						case 19:
							rgba = AscCommon.RgbaHexToRGBA('#808080');
							break;
						case 20:
							rgba = AscCommon.RgbaHexToRGBA('#666666');
							break;
						case 21:
							rgba = AscCommon.RgbaHexToRGBA('#4D4D4D');
							break;
						case 22:
							rgba = AscCommon.RgbaHexToRGBA('#333333');
							break;
						case 23:
							rgba = AscCommon.RgbaHexToRGBA('#1A1A1A');
							break;
					}
					if (rgba) {
						uniFill = AscFormat.CreateUnfilFromRGB(rgba.R, rgba.G, rgba.B);
					}
				}
			}
			if (!uniFill) {
				console.log("no color found. so painting lt1.");
				uniFill = AscFormat.CreateUniFillByUniColor(AscFormat.builder_CreateSchemeColor("lt1"));
			}
			return uniFill;
		}

		function handleQuickStyleVariation(oStrokeUniFill, uniFill, shape) {
			// https://learn.microsoft.com/en-us/openspecs/sharepoint_protocols/ms-vsdx/68bb0221-d8a1-476e-a132-8c60a49cea63?redirectedfrom=MSDN
			// consider "QuickStyleVariation" cell
			// https://visualsignals.typepad.co.uk/vislog/2013/05/visio-2013-themes-in-the-shapesheet-part-2.html
			let backgroundColorHSL = {H: undefined, S: undefined, L: undefined};
			let strokeColorHSL = {H: undefined, S: undefined, L: undefined};
			let fillColorHSL = {H: undefined, S: undefined, L: undefined};
			let strokeColor = oStrokeUniFill.fill && oStrokeUniFill.fill.color && oStrokeUniFill.fill.color.color.RGBA;
			let fillColor = uniFill.fill && uniFill.fill.color && uniFill.fill.color.color.RGBA;

			if (strokeColor !== undefined && fillColor !== undefined) {
				AscFormat.CColorModifiers.prototype.RGB2HSL(255, 255, 255, backgroundColorHSL);
				AscFormat.CColorModifiers.prototype.RGB2HSL(strokeColor.R, strokeColor.G, strokeColor.B, strokeColorHSL);
				AscFormat.CColorModifiers.prototype.RGB2HSL(fillColor.R, fillColor.G, fillColor.B, fillColorHSL);

				// covert L to percents
				backgroundColorHSL.L = backgroundColorHSL.L / 255 * 100;
				strokeColorHSL.L = strokeColorHSL.L / 255 * 100;
				fillColorHSL.L = fillColorHSL.L / 255 * 100;

				let quickStyleVariationCell = shape.getCell("QuickStyleVariation");
				if (quickStyleVariationCell) {
					let quickStyleVariationCellValue = Number(quickStyleVariationCell.v);
					if ((quickStyleVariationCellValue & 4) === 4) {
						// line color variation enabled (bit mask used)
						if (Math.abs(backgroundColorHSL.L - strokeColorHSL.L) < 16.66) {
							if (backgroundColorHSL.L <= 72.92) {
								// if background is dark set stroke to white
								strokeColor.R = 255;
								strokeColor.G = 255;
								strokeColor.B = 255;
							} else {
								if (Math.abs(backgroundColorHSL.L - fillColorHSL.L) >
									Math.abs(backgroundColorHSL.L - strokeColorHSL.L)) {
									// evaluation = THEMEVAL("FillColor")
									// get theme shape fill color despite cell
									// line below will give unifill with pattern maybe or gradient
									// oStrokeUniFill = AscCommonDraw.themeval(this.theme, shape, null, "FillColor");
									strokeColor.R = fillColor.R;
									strokeColor.G = fillColor.G;
									strokeColor.B = fillColor.B;
								} else {
									// evaluation = THEMEVAL("LineColor") or not affected I guess
									// get theme line color despite cell
									// oStrokeUniFill = AscCommonDraw.themeval(this.theme, shape, null, "LineColor");
								}
							}
						}
					}

					if ((quickStyleVariationCellValue & 8) === 8) {
						// fill color variation enabled (bit mask used)
						if (Math.abs(backgroundColorHSL.L - fillColorHSL.L) < 16.66) {
							if (backgroundColorHSL.L <= 72.92) {
								// if background is dark set stroke to white
								fillColor.R = 255;
								fillColor.G = 255;
								fillColor.B = 255;
							} else {
								if (Math.abs(backgroundColorHSL.L - strokeColorHSL.L) >
									Math.abs(backgroundColorHSL.L - fillColorHSL.L)) {
									// evaluation = THEMEVAL("FillColor")
									// get theme shape fill color despite cell
									// line below will give unifill with pattern maybe or gradient
									// oStrokeUniFill = AscCommonDraw.themeval(this.theme, shape, null, "FillColor");
									fillColor.R = strokeColor.R;
									fillColor.G = strokeColor.G;
									fillColor.B = strokeColor.B;
								}
							}
						}
					}

					if ((quickStyleVariationCellValue & 2) === 2) {
						// text color variation enabled (bit mask used)
					}
				}
			}
		}

		//TODO import
		/**
		 * afin rotate clockwise
		 * @param {number} x
		 * @param {number} y
		 * @param {number} radiansRotateAngle radians Rotate AntiClockWise Angle. E.g. 30 degrees rotates does DOWN.
		 * @returns {{x: number, y: number}} point
		 */
		function rotatePointAroundCordsStartClockWise(x, y, radiansRotateAngle) {
			let newX = x * Math.cos(radiansRotateAngle) + y * Math.sin(radiansRotateAngle);
			let newY = x * (-1) * Math.sin(radiansRotateAngle) + y * Math.cos(radiansRotateAngle);
			return {x : newX, y: newY};
		}

		// there was case with shape type group with no PinX and PinY
		// https://disk.yandex.ru/d/tl877cuzcRcZYg
		let pinXCell = this.getCell("PinX");
		let pinX_inch;
		if (pinXCell !== null) {
			pinX_inch = Number(pinXCell.v);
		}
		let pinYCell = this.getCell("PinY");
		let pinY_inch;
		if (pinYCell !== null) {
			pinY_inch = Number(pinYCell.v);
		}
		// also check for {}, undefined, NaN
		if (isNaN(pinX_inch) || isNaN(pinY_inch)) {
			// console.log('pinX_inch or pinY_inch is NaN for', this);
			throw new Error("pinX_inch or pinY_inch is NaN for shape");
		}

		let shapeAngle = Number(this.getCell("Angle").v);
		let locPinX_inch = Number(this.getCell("LocPinX").v);
		let locPinY_inch = Number(this.getCell("LocPinY").v);
		let shapeWidth_inch = Number(this.getCell("Width").v);
		let shapeHeight_inch = Number(this.getCell("Height").v);

		// PinX and PinY set shape rotate point and LocPinX LocPinY add offset to initial shape center
		// to rotate around point we 1) add one more offset 2) rotate around center
		// could be refactored maybe
		// https://www.figma.com/file/jr1stjGUa3gKUBWxNAR80T/locPinHandle?type=design&node-id=0%3A1&mode=design&t=raXzFFsssqSexysi-1
		let redVector = {x: -(locPinX_inch - shapeWidth_inch/2), y: -(locPinY_inch - shapeHeight_inch/2)};
		// rotate antiClockWise by shapeAngle
		let purpleVector = rotatePointAroundCordsStartClockWise(redVector.x, redVector.y, -shapeAngle);
		let rotatedCenter = {x: pinX_inch - redVector.x + purpleVector.x, y: pinY_inch - redVector.y + purpleVector.y};
		let turquoiseVector = {x: -shapeWidth_inch/2, y: -shapeHeight_inch/2};
		let x_inch = rotatedCenter.x + turquoiseVector.x + redVector.x;
		let y_inch = rotatedCenter.y + turquoiseVector.y + redVector.y;

		let x_mm = x_inch * g_dKoef_in_to_mm;
		let y_mm = y_inch * g_dKoef_in_to_mm;
		let shapeWidth_mm = shapeWidth_inch * g_dKoef_in_to_mm;
		let shapeHeight_mm = shapeHeight_inch * g_dKoef_in_to_mm;

		// TODO check if gradient enabled
		// let gradientEnabled = shape.getCell("FillGradientEnabled");
		// console.log("Gradient enabled:", gradientEnabled);

		let uniFill = null, uniFillForegnd = null, uniFillBkgnd = null, nPatternType = null;
		let fillForegnd = this.getCell("FillForegnd");
		if (fillForegnd) {
			// console.log("FillForegnd was found:", fillForegnd);
			uniFillForegnd = calculateCellUniFill(visioDocument.theme, this, fillForegnd);

			let fillForegndTrans = this.getCell("FillForegndTrans");
			if (fillForegndTrans) {
				let fillForegndTransValue = Number(fillForegndTrans.v);
				if (!isNaN(fillForegndTransValue)) {
					let fillObj = uniFillForegnd.fill;
					if (fillObj.constructor.name === "CPattFill") {
						// pattern fill
						fillObj.fgClr.color.RGBA.A = fillObj.fgClr.color.RGBA.A * (1 - fillForegndTransValue);
					} else {
						fillObj.color.color.RGBA.A = fillObj.color.color.RGBA.A * (1 - fillForegndTransValue);
					}
				} else {
					// console.log("fillForegndTrans value is themed or something. Not calculated for", shape);
				}
			}
		}
		let fillBkgnd = this.getCell("FillBkgnd");
		if (fillBkgnd) {
			// console.log("FillBkgnd was found:", fillBkgnd);
			uniFillBkgnd = calculateCellUniFill(visioDocument.theme, this, fillBkgnd);

			let fillBkgndTrans = this.getCell("FillBkgndTrans");
			if (fillBkgndTrans) {
				let fillBkgndTransValue = Number(fillBkgndTrans.v);
				if (!isNaN(fillBkgndTransValue)) {
					let fillObj = uniFillBkgnd.fill;
					if (fillObj.constructor.name === "CPattFill") {
						// pattern fill
						fillObj.bgClr.color.RGBA.A = fillObj.fgClr.color.RGBA.A * (1 - fillBkgndTransValue);
					} else {
						fillObj.color.color.RGBA.A = fillObj.color.color.RGBA.A * (1 - fillBkgndTransValue);
					}
				} else {
					// console.log("fillBkgndTrans value is themed or something. Not calculated for", this);
				}
			}
		}

		let fillPattern = this.getCell("FillPattern");
		if (fillPattern) {
			// console.log("fillPattern was found:", fillPattern);
			let fillPatternType = parseInt(fillPattern.v);
			if (!isNaN(fillPatternType)) {
				if (0 === fillPatternType) {
					//todo
					uniFillForegnd = AscFormat.CreateNoFillUniFill();
				} else if(fillPatternType > 1) {
					//todo types
					nPatternType = 0;//"cross";
				}
			}
		}
		if (null !== nPatternType && uniFillBkgnd && uniFillForegnd) {
			uniFill = AscFormat.CreatePatternFillUniFill(nPatternType, uniFillBkgnd.fill.color, uniFillForegnd.fill.color);
			// uniFill = AscFormat.builder_CreatePatternFill(nPatternType, uniFillBkgnd.fill.color, uniFillForegnd.fill.color);
		} else if (uniFillForegnd) {
			uniFill = uniFillForegnd;
		} else {
			console.log("FillForegnd not found for shape", this);
			uniFill = AscFormat.CreateNoFillUniFill();
		}

		let oStrokeUniFill = null;
		// add read matrix modifier width?
		let linePattern = this.getCell("LinePattern");
		if (linePattern) {
			if (linePattern.v === "0") {
				oStrokeUniFill = AscFormat.CreateNoFillUniFill();
			} else {
				let lineColor = this.getCell("LineColor");
				if (lineColor) {
					// console.log("LineColor was found for shape", lineColor);
					oStrokeUniFill = calculateCellUniFill(visioDocument.theme, this, lineColor);
				} else {
					console.log("LineColor cell for line stroke (border) was not found painting red");
					oStrokeUniFill = AscFormat.CreateUnfilFromRGB(255,0,0);
				}
			}
		} else {
			console.log("LinePattern cell for line stroke (border) was not found painting red");
			oStrokeUniFill = AscFormat.CreateUnfilFromRGB(255,0,0);
		}

		handleQuickStyleVariation(oStrokeUniFill, uniFill, this);

		let lineWidthEmu = null;
		let lineWeightCell = this.getCell("LineWeight");
		if (lineWeightCell && lineWeightCell.v && lineWeightCell.v !== "Themed") {
			// to cell.v visio always saves inches
			let lineWeightInches = Number(lineWeightCell.v);
			if (!isNaN(lineWeightInches)) {
				lineWidthEmu = lineWeightInches * AscCommonWord.g_dKoef_in_to_mm * AscCommonWord.g_dKoef_mm_to_emu;
			} else {
				console.log("caught unknown error. line will be painted 9525 emus");
				// 9255 emus = 0.01041666666666667 inches is document.xml StyleSheet ID=0 LineWeight e. g. default value
				lineWidthEmu = 9525;
			}
		} else {
			console.log("LineWeight cell was not calculated. line will be painted 9525 emus");
			lineWidthEmu = 9525;
		}

		// console.log("Calculated oStrokeUniFill unifill", oStrokeUniFill, "for shape", this);
		// console.log("Calculated fill UniFill", uniFill, "for shape", this);

		var oStroke = AscFormat.builder_CreateLine(lineWidthEmu, {UniFill: oStrokeUniFill});
		// var oStroke = AscFormat.builder_CreateLine(12700, {UniFill: AscFormat.CreateUnfilFromRGB(255,0,0)});

		if (this.type === "Foreign") {
			console.log("Shape has type Foreign and may not be displayed. " +
				"Check shape.elements --> ForeignData_Type obj. See shape:", this);
		}

		let flipXCell = this.getCell("FlipX");
		let flipHorizontally = flipXCell ? flipXCell.v === "1" : false;

		let flipYCell = this.getCell("FlipY");
		let flipVertically = flipYCell ?  flipYCell.v === "1" : false;

		let cShape = this.convertToCShapeUsingParamsObj({x_mm: x_mm, y_mm: y_mm,
			w_mm: shapeWidth_mm, h_mm: shapeHeight_mm, rot: shapeAngle, oFill: uniFill, oStroke: oStroke,
			flipHorizontally: flipHorizontally, flipVertically: flipVertically, cVisioDocument: visioDocument});

		return cShape;
	}


	/**
	 * @memberOf Shape_Type
	 * @param {{x_mm, y_mm, w_mm, h_mm, rot, oFill, oStroke, flipHorizontally, flipVertically, cVisioDocument}} paramsObj
	 * @return {CShape} CShape
	 */
	Shape_Type.prototype.convertToCShapeUsingParamsObj = function(paramsObj) {
		let x = paramsObj.x_mm;
		let y = paramsObj.y_mm;
		let w_mm = paramsObj.w_mm;
		let h_mm = paramsObj.h_mm;
		let rot = paramsObj.rot;
		let oFill = paramsObj.oFill;
		let oStroke = paramsObj.oStroke;
		let cVisioDocument = paramsObj.cVisioDocument;
		let flipHorizontally = paramsObj.flipHorizontally;
		let flipVertically = paramsObj.flipVertically;

		let shapeGeom = AscCommonDraw.getGeometryFromShape(this);

		let sType   = "rect";
		let nWidth_mm  = Math.round(w_mm);
		let nHeight_mm = Math.round(h_mm);
		//let oDrawingDocument = new AscCommon.CDrawingDocument();
		let shape = AscFormat.builder_CreateShape(sType, nWidth_mm, nHeight_mm,
			oFill, oStroke, cVisioDocument, cVisioDocument.theme, null, false);
		shape.spPr.xfrm.setOffX(x);
		shape.spPr.xfrm.setOffY(y);
		shape.spPr.xfrm.setRot(rot);
		shape.spPr.xfrm.setFlipH(flipHorizontally);
		shape.spPr.xfrm.setFlipV(flipVertically);

		shape.spPr.setGeometry(shapeGeom);
		shape.recalculate();
		return shape;
	};


	/**
	 * returns link not clone
	 * @param {String} formula
	 * @memberof Row_Type
	 * @returns {null | Cell_Type}
	 */
	Row_Type.prototype.getCell = function (formula) {
		// Cells can have N only no IX
		return findObject(this.cells, "Cell_Type", "n", formula);
	}

	/**
	 * @memberOf Cell_Type
	 * @return {number}
	 */
	Cell_Type.prototype.getValueInMM = function () {
		let res;
		//todo all units
		switch (this.u) {
			case "DL":
			case "IN":
			case "IN_F":
				res = parseFloat(this.v) * g_dKoef_in_to_mm;
				break;
			case "FT":
				res = parseFloat(this.v) * 12 * g_dKoef_in_to_mm;
				break;
			case "F_I":
				res = parseFloat(this.v);
				let intPart = Math.floor(res);
				res = (intPart * 12 + (res - intPart)) * g_dKoef_in_to_mm;
				break;
			case "KM":
				res = parseFloat(this.v) * 1000000;
				break;
			case "M":
				res = parseFloat(this.v) * 1000;
				break;
			case "CM":
				res = parseFloat(this.v) * 10;
				break;
			case "MM":
				res = parseFloat(this.v);
				break;
			default:
				res = parseFloat(this.v) * g_dKoef_in_to_mm;
				break;
		}
		return res;
	};
	/**
	 * @memberOf Cell_Type
	 * @return {number}
	 */
	Cell_Type.prototype.getValueInInch = function () {
		let res = this.getValueInMM() / g_dKoef_in_to_mm;
		return res;
	}

	// for ooxml classes
	function setShapeSheetClassMembers() {
		// 3 attr below inherited from Sheet_Type using old schema
		// or from ShapeSheet_Type using new schema
		this.lineStyle = null;
		this.fillStyle = null;
		this.textStyle = null;
		/**
		 * When working with shapes use getElements/setElements methods
		 * Always use it see Shape_Type.prototype.realizeMasterToShapeInheritanceRecursive js docs for explanation.
		 * elements is used bcs text can appear here maybe
		 * @type {*[]}
		 */
		this.elements = [];
		// elements below are stored in elements to support new schema

		// // 3 arrays below inherited from Sheet_Type
		// this.cells = [];
		// this.triggers = [];
		// this.sections = [];
		//
		//
		// // new attributes inherited from ShapeSheet_Type
		// this.text = null;
		// this.data1 = null;
		// this.data2 = null;
		// this.data3 = null;
		// this.foreignData = null;
	}

	//-------------------------------------------------------------export---------------------------------------------------
	window['Asc']            = window['Asc'] || {};
	window['AscCommon']      = window['AscCommon'] || {};
	window['AscCommonWord']  = window['AscCommonWord'] || {};
	window['AscCommonSlide'] = window['AscCommonSlide'] || {};
	window['AscCommonExcel'] = window['AscCommonExcel'] || {};
	window['AscCommonDraw']  = window['AscCommonDraw'] || {};
	window['AscFormat']  = window['AscFormat'] || {};
	window['AscWord'] = window['AscWord'] || {};

	window['AscCommonDraw'].Row_Type = Row_Type;
	window['AscCommonDraw'].Cell_Type = Cell_Type;
	window['AscCommonDraw'].Shape_Type = Shape_Type;
	window['AscCommonDraw'].Section_Type = Section_Type;

	window['AscCommonDraw'].setShapeSheetClassMembers = setShapeSheetClassMembers;

})(window, window.document);
