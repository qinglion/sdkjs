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
	 * accepts visio shadow arguments and common arguments, return OnlyOffice api objects of different types.
	 * So for foreground color it return Unifill and for stroke too. May cause problems
	 * https://learn.microsoft.com/ru-ru/office/client-developer/visio/themeval-function.
	 * For font color return CUniColor
	 * @param {CTheme} theme
	 * @param {Shape_Type} shape
	 * @param {Cell_Type} cell
	 * @param {string?} themeValue
	 * @param {string?} defaultValue
	 * @return {CUniFill | CUniColor}
	 */
	function themeval(theme, shape, cell, themeValue, defaultValue) {
		// https://visualsignals.typepad.co.uk/vislog/2013/05/visio-2013-themes-in-the-shapesheet-part-2.html

		// if cell value is not 'Themed' waiting number representing color otherwise
		// if QuickStyle cell is from 100 to 106 or from 200 to 206 using VariationColorIndex cell value and
		// 	QuickStyle cell value % 100 get color from theme
		// if QuickStyle cell value is not in that range it is smt like from 0 to 7 representing theme colors like:
		//  dk1, lt1, accent1, ...

		// TODO handle multiple themes by schemeEnum tags from theme xml and theme properties cells
		// https://disk.yandex.ru/d/YZEevC0lUeUBfQ

		let uniFill;

		let cellValue = cell && cell.v; // formula?
		let cellName = cell && cell.n;

		let quickStyleCellName;
		let quickStyleModifiersCellName;
		let getModifiersMethod;
		let variationStyleIndexVariable;


		if (themeValue === "LineColor") {
			cellName = "LineColor";
			cellValue = "Themed";
		} else if (themeValue === "FillColor") {
			// cellName = "FillForegnd";
			cellValue = "Themed";
		}

		if (cellName === "LineColor") {
			quickStyleCellName = "QuickStyleLineColor";
			quickStyleModifiersCellName = "QuickStyleLineMatrix";
			getModifiersMethod = theme.getLnStyle;
			variationStyleIndexVariable = "lineIdx";

			if (theme.name === "") {
				// no theme file ---> return document.xml StyleSheet ID=0 value
				return AscFormat.CreateUnfilFromRGB(0,0,0);
			}
		} else if (cellName === "Color") {
			// Text color
			quickStyleCellName = "QuickStyleFontColor";
			quickStyleModifiersCellName = "QuickStyleFontMatrix";
			getModifiersMethod = theme.getFontStyle;
			variationStyleIndexVariable = "fontIdx";

			if (theme.name === "") {
				// no theme file ---> return document.xml StyleSheet ID=0 value
				return AscFormat.CreateUnfilFromRGB(0,0,0).fill.color;
			}
		} else {
			quickStyleCellName = "QuickStyleFillColor";
			quickStyleModifiersCellName = "QuickStyleFillMatrix";
			getModifiersMethod = theme.getFillStyle;
			variationStyleIndexVariable = "fillIdx";

			if (theme.name === "") {
				// no theme file ---> return document.xml StyleSheet ID=0 value
				if (cellName === "FillForegnd") {
					return AscFormat.CreateUnfilFromRGB(255,255,255);
				} else if (cellName === "FillBkgnd") {
					return AscFormat.CreateUnfilFromRGB(0,0,0);
				}
			}
		}

		let quickStyleColorElem = shape.getCell(quickStyleCellName);
		let quickStyleMatrixElem = shape.getCell(quickStyleModifiersCellName);
		let quickStyleColor = parseInt(quickStyleColorElem && quickStyleColorElem.v);
		let quickStyleMatrix = parseInt(quickStyleMatrixElem && quickStyleMatrixElem.v);
		// get color using "VariationColorIndex" cell and quickStyleColor cell
		if (!isNaN(quickStyleColor)) {
			if (100 <= quickStyleColor && quickStyleColor <= 106 ||
				(200 <= quickStyleColor && quickStyleColor <= 206)) {
				//todo 200-206?
				let variationColorIndexCell = shape.getCell("VariationColorIndex");
				let variationColorIndex = 0;
				if (variationColorIndexCell) {
					variationColorIndex = parseInt(variationColorIndexCell.v);
				}
				if (!isNaN(variationColorIndex)) {
					if (65534 === variationColorIndex) {
						variationColorIndex = 0;
					}
					let color = theme.getVariationClrSchemeColor(variationColorIndex,
						quickStyleColor % 100);
					if (color) {
						uniFill = AscFormat.CreateUniFillByUniColor(color);
					}
				}
			} else {
				let uniColor;
				switch(quickStyleColor) {
					case 0:
						uniColor = AscFormat.builder_CreateSchemeColor("dk1");
						break;
					case 1:
						uniColor = AscFormat.builder_CreateSchemeColor("lt1");
						break;
					case 2:
						uniColor = AscFormat.builder_CreateSchemeColor("accent1");
						break;
					case 3:
						uniColor = AscFormat.builder_CreateSchemeColor("accent2");
						break;
					case 4:
						uniColor = AscFormat.builder_CreateSchemeColor("accent3");
						break;
					case 5:
						uniColor = AscFormat.builder_CreateSchemeColor("accent4");
						break;
					case 6:
						uniColor = AscFormat.builder_CreateSchemeColor("accent5");
						break;
					case 7:
						uniColor = AscFormat.builder_CreateSchemeColor("accent6");
						break;
					case 8:
						//todo
						break;
					default:
						break;
				}
				if (uniColor) {
					uniFill = AscFormat.CreateUniFillByUniColor(uniColor);
				}
			}
		}
		// add matrix modifiers consider color and cells: "VariationStyleIndex" and quickStyleModifiersCellName
		// add matrix modifiers consider color and cells: "VariationStyleIndex" and quickStyleModifiersCellName
		if (!isNaN(quickStyleMatrix)) {
			if (0 === quickStyleMatrix) {
				//todo
			} else if (1 <= quickStyleMatrix && quickStyleMatrix <= 6) {
				uniFill = getModifiersMethod.call(theme, quickStyleMatrix, uniFill && uniFill.fill.color);
				// HOTFIXES: getModifiersMethod return not only
				// uniFill, so we narrow down the range of returns
				if (quickStyleCellName === "QuickStyleLineColor") {
					uniFill = uniFill.Fill;
				} else if (quickStyleCellName === "QuickStyleFontColor") {
					// and it is color
					uniFill = uniFill.fontPropsObject.color;
				}
			} else if (100 <= quickStyleMatrix && quickStyleMatrix <= 103) {
				let variationStyleIndexCell = shape.getCell("VariationStyleIndex");
				let variationStyleIndex = 0;
				if (variationStyleIndexCell) {
					variationStyleIndex = parseInt(variationStyleIndexCell.v);
				}
				if (!isNaN(variationStyleIndex)) {
					if (65534 === variationStyleIndex) {
						variationStyleIndex = 0;
					}
					let varStyle = theme.getVariationStyleScheme(variationStyleIndex,
						quickStyleMatrix % 100);
					if (varStyle && null !== varStyle[variationStyleIndexVariable]) {
						let styleId = varStyle[variationStyleIndexVariable];
						uniFill = getModifiersMethod.call(theme, styleId, uniFill && uniFill.fill.color);
						// HOTFIX: getModifiersMethod return not only
						// uniFill, so we narrow down the range of returns
						if (quickStyleCellName === "QuickStyleLineColor") {
							uniFill = uniFill.Fill;
						} else if (quickStyleCellName === "QuickStyleFontColor") {
							// and it is color
							uniFill = uniFill.fontPropsObject.color;
						}
					}
				}
			}
		}

		if(!uniFill) {
			console.log("no color found. so painting lt1.");
			uniFill = AscFormat.CreateUniFillByUniColor(AscFormat.builder_CreateSchemeColor("lt1"));
		}
		// if unifill is istead of unicolor
		if (quickStyleCellName === "QuickStyleFontColor" && uniFill.fill && uniFill.fill.color) {
			return uniFill.fill.color;
		}
		return uniFill;
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

	window['AscCommonDraw'].themeval = themeval;

})(window, window.document);
