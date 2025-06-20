/*
 * (c) Copyright Ascensio System SIA 2010-2024
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

(/**
 * @param {Window} window
 * @param {undefined} undefined
 */
function (window, undefined) {
	var cErrorType = AscCommonExcel.cErrorType;
	var cNumber = AscCommonExcel.cNumber;
	var cString = AscCommonExcel.cString;
	var cBool = AscCommonExcel.cBool;
	var cEmpty = AscCommonExcel.cEmpty;
	var cError = AscCommonExcel.cError;
	var cArea = AscCommonExcel.cArea;
	var cArea3D = AscCommonExcel.cArea3D;
	var cRef = AscCommonExcel.cRef;
	var cRef3D = AscCommonExcel.cRef3D;
	var cArray = AscCommonExcel.cArray;
	var cBaseFunction = AscCommonExcel.cBaseFunction;
	var cFormulaFunctionGroup = AscCommonExcel.cFormulaFunctionGroup;
	var cElementType = AscCommonExcel.cElementType;
	var argType = Asc.c_oAscFormulaArgumentType;

	function getCellFormat(ws, row, col) {
		let res = new cString("G");
		let formatInfo, sFormat, numFormat;
		ws.getCell3(row, col)._foreachNoEmpty(function (cell) {
			numFormat = cell ? cell.getNumFormat() : null;
			formatInfo = numFormat ? numFormat.getTypeInfo() : null;
			sFormat = numFormat ? numFormat.sFormat : null;
		});
		//такие форматы как дата не поддерживаются
		//TODO функция нуждается в доработке
		if (formatInfo) {
			let postfix = "";
			if (numFormat && (numFormat.oNegativeFormat && numFormat.oNegativeFormat.Color !== -1)) {
				postfix += "-";
			}
			if (numFormat && numFormat.oPositiveFormat && numFormat.oPositiveFormat.formatString.indexOf('(') != -1) {
				postfix += "()";
			}

			let formatPart;
			if (formatInfo.type === Asc.c_oAscNumFormatType.Number) {
				formatPart = "F";
			} else if (formatInfo.type === Asc.c_oAscNumFormatType.Currency || formatInfo.type === Asc.c_oAscNumFormatType.Accounting) {
				formatPart = "С";
			} else if (formatInfo.type === Asc.c_oAscNumFormatType.Percent) {
				formatPart = "P";
			} else if (formatInfo.type === Asc.c_oAscNumFormatType.Scientific) {
				formatPart = "S";
			} else if (formatInfo.type === Asc.c_oAscNumFormatType.Date || formatInfo.type === Asc.c_oAscNumFormatType.Time) {
				formatPart = "D";
			}

			// ,0 and ,2 types
			if (sFormat) {
				if (sFormat === "#,##0") {
					formatPart = ",0";
					formatInfo.decimalPlaces = "";
				} else if (sFormat === "#,##0.00") {
					formatPart = ",2";
					formatInfo.decimalPlaces = "";
				}
			}

			if (formatPart) {
				if (formatPart === "D") {
					let regularD1 = /d+[\s\/-]m+[\s\/-]y+/gi, // d-mmm-yy || dd-mmm-yy
						regularD2 = /d+(\s|-|\/)m+;/gi, // d-mmm || dd-mmm
						regularD3 = /]m+(\s|-|\/)y+;/gi, // mmm-yy  
						regularD4 = /m+(\s|-|\/)d+(\s|-|\/)y+/gi, // m/d/yy || m/d/yy h:mm || mm/dd/yy
						regularD5 = /^m+(\s|-|\/)d+;/gi, // mm/dd
						regularD6 = /h+:m+:s+\sAM\/PM/gi, // h:mm:ss AM/PM
						regularD7 = /h+:m+\sAM\/PM/gi, // h:mm AM/PM
						regularD8 = /(((h|\[h\]):m+:ss;)|(\[\$-F400\]h:mm:ss))/gi, // h:mm:ss
						regularD9 = /h+:m+;/gi; // h:mm

					if (regularD1.test(sFormat)) {
						formatInfo.decimalPlaces = 1;
					} else if (regularD2.test(sFormat)) {
						formatInfo.decimalPlaces = 2;
					} else if (regularD3.test(sFormat)) {
						formatInfo.decimalPlaces = 3;
					} else if (regularD4.test(sFormat)) {
						formatInfo.decimalPlaces = 4;
					} else if (regularD5.test(sFormat)) {
						formatInfo.decimalPlaces = 5;
					} else if (regularD6.test(sFormat)) {
						formatInfo.decimalPlaces = 6;
					} else if (regularD7.test(sFormat)) {
						formatInfo.decimalPlaces = 7;
					} else if (regularD8.test(sFormat)) {
						formatInfo.decimalPlaces = 8;
					} else if (regularD9.test(sFormat)) {
						formatInfo.decimalPlaces = 9;
					} else {
						formatPart = "G";
						formatInfo.decimalPlaces = "";
					}
				}
				res = new cString(formatPart + formatInfo.decimalPlaces + postfix);
			}
		}

		return res;
	}

	function getNumFormat(ws, row, col) {
		var numFormat = null;

		ws.getCell3(row, col)._foreachNoEmpty(function (cell) {
			numFormat = cell ? cell.getNumFormat() : null;
		});

		return numFormat;
	}

	cFormulaFunctionGroup['Information'] = cFormulaFunctionGroup['Information'] || [];
	cFormulaFunctionGroup['Information'].push(cCell, cERROR_TYPE, cISBLANK, cISERR, cISERROR, cISEVEN, cISFORMULA, cISLOGICAL,
		cISNA, cISNONTEXT, cISNUMBER, cISODD, cISREF, cISTEXT, cN, cNA, cSHEET, cSHEETS, cTYPE);


	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCell() {
	}

	//***array-formula***
	cCell.prototype = Object.create(cBaseFunction.prototype);
	cCell.prototype.constructor = cCell;
	cCell.prototype.name = 'CELL';
	cCell.prototype.argumentsMin = 2;
	cCell.prototype.argumentsMax = 2;
	cCell.prototype.ca = true;
	cCell.prototype.returnValueType = AscCommonExcel.cReturnFormulaType.area_to_ref;
	cCell.prototype.argumentsType = [argType.text, argType.reference];
	cCell.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cCell.prototype.Calculate = function (arg, opt_bbox, opt_defName, ws) {
		//специально ввожу ограничения - минимум 2 аргумента
		//в случае одного аргумента необходимо следить всегда за последней измененной ячейкой
		//так же при сборке необходимо записывать данные об последней измененной ячейке
		//нужно дли это ?
		let arg0 = arg[0];
		let arg1 = arg[1];
		arg0 = arg0.tocString();

		if (cElementType.error === arg0.type) {
			return arg0;
		} else {
			let str = arg0.toString().toLowerCase();

			//если первый аргумент из набора тех, которые не требуют значения второго аргумента, то обрабатываем его частично
			let needCheckVal2Arg = {"contents": 1, "type": 1};

			let cell, bbox;
			if (arg1) {
				//TODO добавил заглушку, на случай если приходит массив.
				// необходимо пересмотреть - сейчас мы рассматриваем как функции массива все дочерние элементы аргумента с типом .reference
				if (cElementType.array === arg1.type) {
					arg1 = arg1.getElementRowCol(0, 0);
				}
				if (str === "contents") {
					// Save ref for recursion check
					AscCommonExcel.g_cCalcRecursion.saveFunctionResult(this.name, arg1);
				}

				let isRangeArg1 = cElementType.cellsRange === arg1.type || cElementType.cellsRange3D === arg1.type;
				if (isRangeArg1 || cElementType.cell === arg1.type || cElementType.cell3D === arg1.type) {
					if (needCheckVal2Arg[str]) {
						let _tempValue = isRangeArg1 ? arg1.getValueByRowCol(0, 0) : arg1.getValue();
						if (_tempValue instanceof cError) {
							return _tempValue;
						}
					}
					bbox = arg1.getRange();
					bbox = bbox && bbox.bbox;
				} else {
					return new cError(cErrorType.wrong_name);
				}
			}

			let _cCellFunctionLocal = window["AscCommon"].cCellFunctionLocal;
			let res, numFormat;
			switch (str) {
				case "col":
				case _cCellFunctionLocal["col"]: {
					res = new cNumber(bbox.c1 + 1);
					break;
				}
				case "row":
				case _cCellFunctionLocal["row"]: {
					res = new cNumber(bbox.r1 + 1);
					break;
				}
				case "sheet":
				case _cCellFunctionLocal["sheet"]: {
					//нет в офф. документации
					//ms excel returns 1?
					res = new cNumber(1);
					break;
				}
				case "address":
				case _cCellFunctionLocal["address"]: {
					res = new Asc.Range(bbox.c1, bbox.r1, bbox.c1, bbox.r1);
					res = new cString(res.getAbsName());
					break;
				}
				case "filename":
				case _cCellFunctionLocal["filename"]: {
					//TODO без пути
					let api = window["Asc"]["editor"];
					let printOptionsJson = api && api.wb && api.wb.getPrintOptionsJson && api.wb.getPrintOptionsJson();
					let spreadsheetLayout = printOptionsJson && printOptionsJson["spreadsheetLayout"];
					let fileName;
					if (spreadsheetLayout && spreadsheetLayout["formulaProps"] && spreadsheetLayout["formulaProps"]["docTitle"]) {
						fileName = spreadsheetLayout["formulaProps"]["docTitle"];
					} else {
						let docInfo = api.DocInfo;
						fileName = docInfo ? docInfo.get_Title() : "";
					}

					let _ws = arg1.getWS();
					let sheetName = _ws ? _ws.getName() : null;
					if (sheetName) {
						res = new cString("[" + fileName + "]" + sheetName);
					} else {
						res = new cEmpty();
					}
					break;
				}
				case "coord":
				case _cCellFunctionLocal["coord"]: {
					//нет в офф. документации
					break;
				}
				case "contents":
				case _cCellFunctionLocal["contents"]: {
					if (cElementType.cell === arg1.type || cElementType.cell3D === arg1.type) {
						res = arg1.getValue();
					} else {
						res = arg1.getValue()[0];
						if (!res) {
							res = new cNumber(0);
						}
					}
					break;
				}
				case "type":
				case _cCellFunctionLocal["type"]: {
					// b = blank; l = string (label); v = otherwise (value)
					res = arg1.getValue();
					if (res.type === cElementType.empty) {
						res = new cString("b");
					} else if (res.type === cElementType.string) {
						res = new cString("l");
					} else {
						res = new cString("v");
					}
					break;
				}
				case "width":
				case _cCellFunctionLocal["width"]: {
					//return array
					//{width 1 column; is default}
					let col = ws._getCol(bbox.c1);
					let props = col ? col.getWidthProp() : null;
					let isDefault = !props.CustomWidth;
					let width, colWidthPx;
					if (isDefault) {
						let defaultColWidthChars = ws.charCountToModelColWidth(ws.getBaseColWidth());
						colWidthPx = ws.modelColWidthToColWidth(defaultColWidthChars);
						colWidthPx = Asc.ceil(colWidthPx / 8) * 8;
						width = ws.colWidthToCharCount(colWidthPx);
					} else {
						colWidthPx = ws.modelColWidthToColWidth(props.width);
						width = ws.colWidthToCharCount(colWidthPx);
					}

					if (props) {
						res = new cArray();
						res.addElement(new cNumber(Math.round(width)));
						res.addElement(new cBool(isDefault));
					}

					break;
				}
				case "prefix":
				case _cCellFunctionLocal["prefix"]: {
					// ' = left; " = right; ^ = centered; \ =
					cell = ws.getCell3(bbox.r1, bbox.c1);
					let align = cell.getAlign();
					let alignHorizontal = align.getAlignHorizontal();
					if (cell.isNullTextString()) {
						res = new cString('');
					} else if (alignHorizontal === null || alignHorizontal === AscCommon.align_Left) {
						res = new cString("'");
					} else if (alignHorizontal === AscCommon.align_Right) {
						res = new cString('"');
					} else if (alignHorizontal === AscCommon.align_Center) {
						res = new cString('^');
					} /*else if(alignHorizontal === AscCommon.align_Fill) {
						res = new cString("\/");
					}*/ else {
						res = new cString('');
					}

					break;
				}
				case "protect":
				case _cCellFunctionLocal["protect"]: {
					//default - protect, do not support on open
					let isLocked = true;
					cell = ws.getCell3(bbox.r1, bbox.c1);
					cell._foreachNoEmpty(function (cell) {
						if (cell) {
							let xfs = cell.xfs ? cell.xfs : cell.getCompiledStyle();
							if (xfs) {
								isLocked = xfs.getLocked();
							}
						}
					});
					if (isLocked) {
						res = new cNumber(1);
					} else {
						res = new cNumber(0);
					}
					break;
				}
				case "format":
				case _cCellFunctionLocal["format"]: {
					res = getCellFormat(ws, bbox.r1, bbox.c1);
					break
				}
				case "color":
				case _cCellFunctionLocal["color"]: {
					numFormat = getNumFormat(ws, bbox.r1, bbox.c1);
					if (numFormat && (numFormat.oNegativeFormat && numFormat.oNegativeFormat.Color !== -1)) {
						res = new cNumber(1);
					} else {
						res = new cNumber(0);
					}
					break
				}
				case "parentheses":
				case _cCellFunctionLocal["parentheses"]: {
					numFormat = getNumFormat(ws, bbox.r1, bbox.c1);
					if (numFormat && numFormat.oPositiveFormat && numFormat.oPositiveFormat.formatString.indexOf('(') != -1) {
						res = new cNumber(1);
					} else {
						res = new cNumber(0);
					}
					break
				}
				default: {
					return new cError(cErrorType.wrong_value_type);
				}
			}

			return res ? res : new cError(cErrorType.wrong_value_type);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cERROR_TYPE() {
	}

	//***array-formula***
	cERROR_TYPE.prototype = Object.create(cBaseFunction.prototype);
	cERROR_TYPE.prototype.constructor = cERROR_TYPE;
	cERROR_TYPE.prototype.name = 'ERROR.TYPE';
	cERROR_TYPE.prototype.argumentsMin = 1;
	cERROR_TYPE.prototype.argumentsMax = 1;
	cERROR_TYPE.prototype.argumentsType = [argType.any];
	cERROR_TYPE.prototype.Calculate = function (arg) {
		function typeError(elem) {
			if (elem instanceof cError) {
				switch (elem.errorType) {
					case cErrorType.null_value:
						return new cNumber(1);
					case cErrorType.division_by_zero:
						return new cNumber(2);
					case cErrorType.wrong_value_type:
						return new cNumber(3);
					case cErrorType.bad_reference :
						return new cNumber(4);
					case cErrorType.wrong_name :
						return new cNumber(5);
					case cErrorType.not_numeric :
						return new cNumber(6);
					case cErrorType.not_available :
						return new cNumber(7);
					case cErrorType.getting_data :
						return new cNumber(8);
					default:
						return new cError(cErrorType.not_available);
				}
			} else {
				return new cError(cErrorType.not_available);
			}
		}

		var arg0 = arg[0];
		if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			arg0 = arg0.getValue();
		} else if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			var ret = new cArray();
			arg0.foreach(function (elem, r, c) {
				if (!ret.array[r]) {
					ret.addRow();
				}
				ret.addElement(typeError(elem));
			});
			return ret;
		}
		return typeError(arg0);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cISBLANK() {
	}

	//***array-formula***
	cISBLANK.prototype = Object.create(cBaseFunction.prototype);
	cISBLANK.prototype.constructor = cISBLANK;
	cISBLANK.prototype.name = 'ISBLANK';
	cISBLANK.prototype.argumentsMin = 1;
	cISBLANK.prototype.argumentsMax = 1;
	cISBLANK.prototype.argumentsType = [argType.any];
	cISBLANK.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			arg0 = arg0.getValue();
		}
		if (arg0 instanceof AscCommonExcel.cEmpty) {
			return new cBool(true);
		} else {
			return new cBool(false);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cISERR() {
	}

	//***array-formula***
	cISERR.prototype = Object.create(cBaseFunction.prototype);
	cISERR.prototype.constructor = cISERR;
	cISERR.prototype.name = 'ISERR';
	cISERR.prototype.argumentsMin = 1;
	cISERR.prototype.argumentsMax = 1;
	cISERR.prototype.argumentsType = [argType.any];
	cISERR.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		} else if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			arg0 = arg0.getValue();
		}

		if (arg0 instanceof cError && arg0.errorType != cErrorType.not_available) {
			return new cBool(true);
		} else {
			return new cBool(false);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */

	function cISERROR() {
	}

	//***array-formula***
	cISERROR.prototype = Object.create(cBaseFunction.prototype);
	cISERROR.prototype.constructor = cISERROR;
	cISERROR.prototype.name = 'ISERROR';
	cISERROR.prototype.argumentsMin = 1;
	cISERROR.prototype.argumentsMax = 1;
	cISERROR.prototype.argumentsType = [argType.any];
	cISERROR.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		} else if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			arg0 = arg0.getValue();
		}

		if (arg0 instanceof cError) {
			return new cBool(true);
		} else {
			return new cBool(false);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cISEVEN() {
	}

	//***array-formula***
	cISEVEN.prototype = Object.create(cBaseFunction.prototype);
	cISEVEN.prototype.constructor = cISEVEN;
	cISEVEN.prototype.name = 'ISEVEN';
	cISEVEN.prototype.argumentsMin = 1;
	cISEVEN.prototype.argumentsMax = 1;
	cISEVEN.prototype.returnValueType = AscCommonExcel.cReturnFormulaType.value_replace_area;
	cISEVEN.prototype.argumentsType = [argType.any];
	cISEVEN.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		} else if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			arg0 = arg0.getValue();
		}

		if (arg0 instanceof cError) {
			return arg0;
		}

		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		} else {
			return new cBool((arg0.getValue() & 1) == 0);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cISFORMULA() {
	}

	//***array-formula***
	cISFORMULA.prototype = Object.create(cBaseFunction.prototype);
	cISFORMULA.prototype.constructor = cISFORMULA;
	cISFORMULA.prototype.name = 'ISFORMULA';
	cISFORMULA.prototype.argumentsMin = 1;
	cISFORMULA.prototype.argumentsMax = 1;
	cISFORMULA.prototype.isXLFN = true;
	cISFORMULA.prototype.returnValueType = AscCommonExcel.cReturnFormulaType.area_to_ref;
	cISFORMULA.prototype.argumentsType = [argType.reference];
	cISFORMULA.prototype.Calculate = function (arg) {
		//есть различия в поведении этой формулы для ms и lo(для нескольких ячеек с данными)
		var arg0 = arg[0];
		var res = false;
		if ((arg0 instanceof cArea || arg0 instanceof cArea3D) && arg0.range) {
			let range = arg0.getRange && arg0.getRange();
			if (range) {
				res = range.isFormula()
			}
		} else if ((arg0 instanceof cRef || arg0 instanceof cRef3D) && arg0.range) {
			res = arg0.range.isFormula();
		}

		if (arg0 instanceof cError) {
			return arg0;
		}

		return new cBool(res);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cISLOGICAL() {
	}

	//***array-formula***
	cISLOGICAL.prototype = Object.create(cBaseFunction.prototype);
	cISLOGICAL.prototype.constructor = cISLOGICAL;
	cISLOGICAL.prototype.name = 'ISLOGICAL';
	cISLOGICAL.prototype.argumentsMin = 1;
	cISLOGICAL.prototype.argumentsMax = 1;
	cISLOGICAL.prototype.argumentsType = [argType.any];
	cISLOGICAL.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		} else if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			arg0 = arg0.getValue();
		}

		if (arg0 instanceof cBool) {
			return new cBool(true);
		} else {
			return new cBool(false);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cISNA() {
	}

	//***array-formula***
	cISNA.prototype = Object.create(cBaseFunction.prototype);
	cISNA.prototype.constructor = cISNA;
	cISNA.prototype.name = 'ISNA';
	cISNA.prototype.argumentsMin = 1;
	cISNA.prototype.argumentsMax = 1;
	cISNA.prototype.argumentsType = [argType.any];
	cISNA.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		} else if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			arg0 = arg0.getValue();
		}

		if (arg0 instanceof cError && arg0.errorType == cErrorType.not_available) {
			return new cBool(true);
		} else {
			return new cBool(false);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cISNONTEXT() {
	}

	//***array-formula***
	cISNONTEXT.prototype = Object.create(cBaseFunction.prototype);
	cISNONTEXT.prototype.constructor = cISNONTEXT;
	cISNONTEXT.prototype.name = 'ISNONTEXT';
	cISNONTEXT.prototype.argumentsMin = 1;
	cISNONTEXT.prototype.argumentsMax = 1;
	cISNONTEXT.prototype.argumentsType = [argType.any];
	cISNONTEXT.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		} else if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			arg0 = arg0.getValue();
		}
		if (!(arg0 instanceof cString)) {
			return new cBool(true);
		} else {
			return new cBool(false);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cISNUMBER() {
	}

	//***array-formula***
	cISNUMBER.prototype = Object.create(cBaseFunction.prototype);
	cISNUMBER.prototype.constructor = cISNUMBER;
	cISNUMBER.prototype.name = 'ISNUMBER';
	cISNUMBER.prototype.argumentsMin = 1;
	cISNUMBER.prototype.argumentsMax = 1;
	cISNUMBER.prototype.argumentsType = [argType.any];
	cISNUMBER.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		} else if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			arg0 = arg0.getValue();
		}

		if (arg0 instanceof cNumber) {
			return new cBool(true);
		} else {
			return new cBool(false);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cISODD() {
	}

	//***array-formula***
	cISODD.prototype = Object.create(cBaseFunction.prototype);
	cISODD.prototype.constructor = cISODD;
	cISODD.prototype.name = 'ISODD';
	cISODD.prototype.argumentsMin = 1;
	cISODD.prototype.argumentsMax = 1;
	cISODD.prototype.returnValueType = AscCommonExcel.cReturnFormulaType.value_replace_area;
	cISODD.prototype.argumentsType = [argType.any];
	cISODD.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		} else if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			arg0 = arg0.getValue();
		}

		if (arg0 instanceof cError) {
			return arg0;
		}

		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		} else {
			return new cBool((arg0.getValue() & 1) == 1);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cISREF() {
	}

	//***array-formula***
	cISREF.prototype = Object.create(cBaseFunction.prototype);
	cISREF.prototype.constructor = cISREF;
	cISREF.prototype.name = 'ISREF';
	cISREF.prototype.argumentsMin = 1;
	cISREF.prototype.argumentsMax = 1;
	cISREF.prototype.arrayIndexes = {0: 1};
	cISREF.prototype.argumentsType = [argType.any];
	cISREF.prototype.Calculate = function (arg) {
		if ((arg[0] instanceof cRef || arg[0] instanceof cArea || arg[0] instanceof cArea3D ||
			arg[0] instanceof cRef3D) && arg[0].isValid && arg[0].isValid()) {
			return new cBool(true);
		} else {
			return new cBool(false);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cISTEXT() {
	}

	//***array-formula***
	cISTEXT.prototype = Object.create(cBaseFunction.prototype);
	cISTEXT.prototype.constructor = cISTEXT;
	cISTEXT.prototype.name = 'ISTEXT';
	cISTEXT.prototype.argumentsMin = 1;
	cISTEXT.prototype.argumentsMax = 1;
	cISTEXT.prototype.argumentsType = [argType.any];
	cISTEXT.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		} else if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			arg0 = arg0.getValue();
		}

		if (arg0 instanceof cString) {
			return new cBool(true);
		} else {
			return new cBool(false);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cN() {
	}

	//***array-formula***
	cN.prototype = Object.create(cBaseFunction.prototype);
	cN.prototype.constructor = cN;
	cN.prototype.name = 'N';
	cN.prototype.argumentsMin = 1;
	cN.prototype.argumentsMax = 1;
	cN.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cN.prototype.arrayIndexes = {0: 1};
	cN.prototype.argumentsType = [argType.any];
	cN.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber || elem instanceof cError) {
					this.array[r][c] = elem;
				} else if (elem instanceof cBool) {
					this.array[r][c] = elem.tocNumber();
				} else {
					this.array[r][c] = new cNumber(0);
				}
			});
			return arg0;
		} else if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			arg0 = arg0.getValue();
		}

		if (arg0 instanceof cNumber || arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cBool) {
			return arg0.tocNumber();
		} else {
			return new cNumber(0);
		}

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cNA() {
	}

	//***array-formula***
	cNA.prototype = Object.create(cBaseFunction.prototype);
	cNA.prototype.constructor = cNA;
	cNA.prototype.name = 'NA';
	cNA.prototype.argumentsMax = 0;
	cNA.prototype.argumentsType = null;
	cNA.prototype.Calculate = function () {
		return new cError(cErrorType.not_available);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSHEET() {
	}

	//***array-formula***
	cSHEET.prototype = Object.create(cBaseFunction.prototype);
	cSHEET.prototype.constructor = cSHEET;
	cSHEET.prototype.name = 'SHEET';
	cSHEET.prototype.argumentsMin = 0;
	cSHEET.prototype.argumentsMax = 1;
	cSHEET.prototype.ca = true;
	cSHEET.prototype.isXLFN = true;
	cSHEET.prototype.returnValueType = AscCommonExcel.cReturnFormulaType.array;
	cSHEET.prototype.argumentsType = [argType.text];
	cSHEET.prototype.Calculate = function (arg, opt_bbox, opt_defName, ws) {

		var res = null;
		if (0 === arg.length) {
			res = new cNumber(ws.index + 1);
		} else {
			var arg0 = arg[0];
			if (cElementType.error === arg0.type) {
				res = arg0;
			} else {
				if (arg0.ws) {
					res = new cNumber(arg0.ws.index + 1);
				} else if (arg0.wsFrom) {
					var sheet1 = arg0.wsFrom.index + 1;
					var sheet2 = arg0.wsTo.index + 1;
					res = new cNumber(Math.min(sheet1, sheet2));
				} else if (cElementType.string === arg0.type) {
					var arg0Val = arg0.getValue();
					var curWorksheet = ws.workbook.getWorksheetByName(arg0Val);
					if (curWorksheet && undefined !== curWorksheet.index) {
						res = new cNumber(curWorksheet.index + 1);
					}
				}
			}
		}

		if (null === res) {
			res = new cError(cErrorType.wrong_value_type);
		}

		return res;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSHEETS() {
	}

	//***array-formula***
	cSHEETS.prototype = Object.create(cBaseFunction.prototype);
	cSHEETS.prototype.constructor = cSHEETS;
	cSHEETS.prototype.name = 'SHEETS';
	cSHEETS.prototype.argumentsMin = 0;
	cSHEETS.prototype.argumentsMax = 1;
	cSHEETS.prototype.isXLFN = true;
	cSHEETS.prototype.returnValueType = AscCommonExcel.cReturnFormulaType.array;
	cSHEETS.prototype.argumentsType = [argType.reference];
	cSHEETS.prototype.Calculate = function (arg, opt_bbox, opt_defName, ws) {

		var res;
		if (0 === arg.length) {
			res = new cNumber(ws.workbook.aWorksheets.length);
		} else {
			var arg0 = arg[0];
			if (cElementType.error === arg0.type) {
				res = arg0;
			} else if (cElementType.cellsRange === arg0.type || cElementType.cell === arg0.type ||
				cElementType.cell3D === arg0.type) {
				res = new cNumber(1);
			} else if (cElementType.cellsRange3D === arg0.type) {
				var sheet1 = arg0.wsFrom.index;
				var sheet2 = arg0.wsTo.index;
				if (sheet1 === sheet2) {
					res = new cNumber(1);
				} else {
					res = new cNumber(Math.abs(sheet2 - sheet1) + 1);
				}

			} else {
				res = new cError(cErrorType.not_available);
			}
		}
		return res;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cTYPE() {
	}

	//***array-formula***
	cTYPE.prototype = Object.create(cBaseFunction.prototype);
	cTYPE.prototype.constructor = cTYPE;
	cTYPE.prototype.name = 'TYPE';
	cTYPE.prototype.argumentsMin = 1;
	cTYPE.prototype.argumentsMax = 1;
	cTYPE.prototype.returnValueType = AscCommonExcel.cReturnFormulaType.value_replace_area;
	cTYPE.prototype.arrayIndexes = {0: 1};
	cTYPE.prototype.argumentsType = [argType.any];
	cTYPE.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			//todo пересмотреть!
			//заглушка для формулы массива
			//ms воспринимает данный аргумент как массив
			if (this.bArrayFormula) {
				arg0 = arg[0].getValue()
			} else {
				arg0 = arg0.cross(arguments[1]);
			}
		} else if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			arg0 = arg0.getValue();
		}

		if (arg0 instanceof cNumber) {
			return new cNumber(1);
		} else if (arg0 instanceof cString) {
			return new cNumber(2);
		} else if (arg0 instanceof cBool) {
			return new cNumber(4);
		} else if (arg0 instanceof cError) {
			return new cNumber(16);
		} else {
			return new cNumber(64);
		}
	};
})(window);
