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
	// Import
	let Shape_Type = window['AscCommonDraw'].Shape_Type;

	/**
	 * calculateShapeParamsAndConvertToCShape
	 * @memberof Shape_Type
	 * @param {CVisioDocument} visioDocument
	 * @return {CShape | Error}
	 */
	Shape_Type.prototype.convertToCShape = function (visioDocument) {
		/**
		 * Can parse themeval
		 * @param {CTheme} theme
		 * @param {Shape_Type} shape
		 * @param {Cell_Type} cell
		 * @return {(CUniFill | CUniColor | *)}
		 */
		function calculateCellValue(theme, shape, cell) {
			let cellValue = cell && cell.v;
			let cellName = cell && cell.n;

			let returnValue;

			if (/#\w{6}/.test(cellValue)) {
				// check if hex
				let rgba = AscCommon.RgbaHexToRGBA(cellValue);
				if (cellName === "LineColor" || cellName === "FillForegnd" || cellName === "FillBkgnd") {
					returnValue = AscFormat.CreateUnfilFromRGB(rgba.R, rgba.G, rgba.B);
				} else if (cellName === "Color") {
					// for text color
					returnValue = AscFormat.CreateUnfilFromRGB(rgba.R, rgba.G, rgba.B).fill.color;
				} else {
					console.log("wrong calculateCellValue argument cell. Cell unsupported. return null");
					return null;
				}
			} else if (cellValue === 'Themed') {
				// equal to THEMEVAL() call
				returnValue = AscCommonDraw.themeval(theme, shape, cell);
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
						if (cellName === "LineColor" || cellName === "FillForegnd" || cellName === "FillBkgnd") {
							returnValue = AscFormat.CreateUnfilFromRGB(rgba.R, rgba.G, rgba.B);
						} else if (cellName === "Color") {
							returnValue = AscFormat.CreateUnfilFromRGB(rgba.R, rgba.G, rgba.B).fill.color;
						} else {
							console.log("wrong calculateCellValue argument cell. Cell unsupported. return null");
							return null;
						}
					}
				}
			}
			if (!returnValue) {
				if (cellName === "LineColor" || cellName === "FillForegnd" || cellName === "FillBkgnd") {
					console.log("no color found. so painting lt1.");
					returnValue = AscFormat.CreateUniFillByUniColor(AscFormat.builder_CreateSchemeColor("lt1"));
				} else if (cellName === "Color") {
					// for text color
					console.log("no text color found. so painting dk1.");
					returnValue = AscFormat.builder_CreateSchemeColor("dk1");
				}
			}
			return returnValue;
		}

		/**
		 * cant be separated for unifill and stroke
		 * @param {CUniFill} oStrokeUniFill
		 * @param {CUniFill} uniFill
		 * @param {Shape_Type} shape
		 */
		function handleQuickStyleVariation(oStrokeUniFill, uniFill, shape) {
			// https://learn.microsoft.com/en-us/openspecs/sharepoint_protocols/ms-vsdx/68bb0221-d8a1-476e-a132-8c60a49cea63?redirectedfrom=MSDN
			// consider "QuickStyleVariation" cell
			// https://visualsignals.typepad.co.uk/vislog/2013/05/visio-2013-themes-in-the-shapesheet-part-2.html
			let backgroundColorHSL = {H: undefined, S: undefined, L: undefined};
			let lineColorHSL = {H: undefined, S: undefined, L: undefined};
			let fillColorHSL = {H: undefined, S: undefined, L: undefined};
			let lineColor = oStrokeUniFill.fill && oStrokeUniFill.fill.color && oStrokeUniFill.fill.color.color.RGBA;
			let fillColor = uniFill.fill && uniFill.fill.color && uniFill.fill.color.color.RGBA;

			if (lineColor !== undefined && fillColor !== undefined) {
				AscFormat.CColorModifiers.prototype.RGB2HSL(255, 255, 255, backgroundColorHSL);
				AscFormat.CColorModifiers.prototype.RGB2HSL(lineColor.R, lineColor.G, lineColor.B, lineColorHSL);
				AscFormat.CColorModifiers.prototype.RGB2HSL(fillColor.R, fillColor.G, fillColor.B, fillColorHSL);

				// covert L to percents
				backgroundColorHSL.L = backgroundColorHSL.L / 255 * 100;
				lineColorHSL.L = lineColorHSL.L / 255 * 100;
				fillColorHSL.L = fillColorHSL.L / 255 * 100;

				let quickStyleVariationCell = shape.getCell("QuickStyleVariation");
				if (quickStyleVariationCell) {
					let quickStyleVariationCellValue = Number(quickStyleVariationCell.v);
					if ((quickStyleVariationCellValue & 4) === 4) {
						// line color variation enabled (bit mask used)
						if (Math.abs(backgroundColorHSL.L - lineColorHSL.L) < 16.66) {
							if (backgroundColorHSL.L <= 72.92) {
								// if background is dark set stroke to white
								lineColor.R = 255;
								lineColor.G = 255;
								lineColor.B = 255;
							} else {
								if (Math.abs(backgroundColorHSL.L - fillColorHSL.L) >
									Math.abs(backgroundColorHSL.L - lineColorHSL.L)) {
									// evaluation = THEMEVAL("FillColor")
									// get theme shape fill color despite cell
									// line below will give unifill with pattern maybe or gradient
									// lineUniFill = AscCommonDraw.themeval(this.theme, shape, null, "FillColor");
									lineColor.R = fillColor.R;
									lineColor.G = fillColor.G;
									lineColor.B = fillColor.B;
								} else {
									// evaluation = THEMEVAL("LineColor") or not affected I guess
									// get theme line color despite cell
									// lineUniFill = AscCommonDraw.themeval(this.theme, shape, null, "LineColor");
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
								if (Math.abs(backgroundColorHSL.L - lineColorHSL.L) >
									Math.abs(backgroundColorHSL.L - fillColorHSL.L)) {
									// evaluation = THEMEVAL("FillColor")
									// get theme shape fill color despite cell
									// line below will give unifill with pattern maybe or gradient
									// lineUniFill = AscCommonDraw.themeval(this.theme, shape, null, "FillColor");
									fillColor.R = lineColor.R;
									fillColor.G = lineColor.G;
									fillColor.B = lineColor.B;
								}
							}
						}
					}

					// if ((quickStyleVariationCellValue & 2) === 2) {
					// 	// text color variation enabled (bit mask used)
					// 	// Text color variation is realized in handleText function handleTextQuickStyleVariation
					// }
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

		/**
		 * @param {CTheme} theme
		 * @param {Shape_Type} shape
		 * @param {CShape} cShape
		 * @param {CUniFill} lineUniFill
		 * @param {CUniFill} fillUniFill
		 */
		function handleText(theme, shape, cShape, lineUniFill, fillUniFill) {
			// see 2.2.8	Text [MS-VSDX]-220215

			function handleTextQuickStyleVariation(textUniColor, lineUniFill, fillUniFill) {
				// https://learn.microsoft.com/en-us/openspecs/sharepoint_protocols/ms-vsdx/68bb0221-d8a1-476e-a132-8c60a49cea63?redirectedfrom=MSDN
				// consider "QuickStyleVariation" cell
				// https://visualsignals.typepad.co.uk/vislog/2013/05/visio-2013-themes-in-the-shapesheet-part-2.html

				// line and fill QuickStyleVariation are handled in handleQuickStyleVariation
				let backgroundColorHSL = {H: undefined, S: undefined, L: undefined};
				let textColorHSL = {H: undefined, S: undefined, L: undefined};
				let lineColorHSL = {H: undefined, S: undefined, L: undefined};
				let fillColorHSL = {H: undefined, S: undefined, L: undefined};

				let textColorRGBA = textUniColor.color && textUniColor.color.RGBA;
				let lineColorRGBA = lineUniFill.fill && lineUniFill.fill.color && lineUniFill.fill.color.color.RGBA;
				let fillColorRGBA = fillUniFill.fill && fillUniFill.fill.color && fillUniFill.fill.color.color.RGBA;

				if (lineColorRGBA !== undefined && fillColorRGBA !== undefined && textColorRGBA !== undefined) {
					AscFormat.CColorModifiers.prototype.RGB2HSL(255, 255, 255, backgroundColorHSL);
					AscFormat.CColorModifiers.prototype.RGB2HSL(lineColorRGBA.R, lineColorRGBA.G, lineColorRGBA.B, lineColorHSL);
					AscFormat.CColorModifiers.prototype.RGB2HSL(fillColorRGBA.R, fillColorRGBA.G, fillColorRGBA.B, fillColorHSL);
					AscFormat.CColorModifiers.prototype.RGB2HSL(textColorRGBA.R, textColorRGBA.G, textColorRGBA.B, textColorHSL);

					// covert L to percents
					backgroundColorHSL.L = backgroundColorHSL.L / 255 * 100;
					lineColorHSL.L = lineColorHSL.L / 255 * 100;
					fillColorHSL.L = fillColorHSL.L / 255 * 100;
					textColorHSL.L = textColorHSL.L / 255 * 100;


					let quickStyleVariationCell = shape.getCell("QuickStyleVariation");
					if (quickStyleVariationCell) {
						let quickStyleVariationCellValue = Number(quickStyleVariationCell.v);

						if ((quickStyleVariationCellValue & 2) === 2) {
							// text color variation enabled (bit mask used)
							if (Math.abs(backgroundColorHSL.L - textColorHSL.L) < 16.66) {
								if (backgroundColorHSL.L <= 72.92) {
									// if background is dark set stroke to white
									textColorRGBA.R = 255;
									textColorRGBA.G = 255;
									textColorRGBA.B = 255;
								} else {
									// return the color with the largest absolute difference in luminance from the
									// formula evaluation of the "TextColor", "FillColor", and "LineColor"
									let fillDifferenceIsTheLargest =
										Math.abs(backgroundColorHSL.L - fillColorHSL.L) >
										Math.abs(backgroundColorHSL.L - lineColorHSL.L) &&
										Math.abs(backgroundColorHSL.L - fillColorHSL.L) >
											Math.abs(backgroundColorHSL.L - textColorHSL.L);
									if (fillDifferenceIsTheLargest) {
										textColorRGBA.R = fillColorRGBA.R;
										textColorRGBA.G = fillColorRGBA.G;
										textColorRGBA.B = fillColorRGBA.B;
									} else {
										if (Math.abs(backgroundColorHSL.L - lineColorHSL.L) >
											Math.abs(backgroundColorHSL.L - textColorHSL.L)) {
											textColorRGBA.R = lineColorRGBA.R;
											textColorRGBA.G = lineColorRGBA.G;
											textColorRGBA.B = lineColorRGBA.B;
										} // else leave text color
									}
								}
							}
						}
					}
				}
			}

			let textElement = shape.getTextElement();
			if (!textElement) {
				return;
			}

			// set default settings
			// see sdkjs/common/Drawings/CommonController.js createTextArt: function (nStyle, bWord, wsModel, sStartString)
			// for examples
			// https://api.onlyoffice.com/docbuilder/textdocumentapi just some related info
			let nFontSize = 10;
			let bWord = false;
			cShape.setWordShape(bWord);
			cShape.setBDeleted(false);
			if (bWord) {
				cShape.createTextBoxContent();
			} else {
				cShape.createTextBody();
			}
			cShape.setVerticalAlign(1); // sets text vert align center equal to anchor set to txBody bodyPr
			cShape.bSelectedText = false;

			// instead of AscFormat.AddToContentFromString(oContent, sText);
			// use https://api.onlyoffice.com/docbuilder/presentationapi/apishape api implementation code
			// to work with text separated into ParaRuns to split properties use
			// now create paragraph
			let oContent = cShape.getDocContent();
			let paragraph = new Paragraph(cShape.getDrawingDocument(), null, true);
			// Set paragraph justify/align text - center
			paragraph.Pr.SetJc(AscCommon.align_Center);
			// oDocContent.Push(oParagraph); - ApiDocumentContent.prototype.Push
			cShape.txBody.content.Content = [paragraph];
			paragraph.SetParent(oContent);

			// read propsCommonObjects
			let characherPropsCommon = shape.getSection("Character");

			// to store last entries of cp/pp/tp like
			//					<cp IX='0'/> or
			//         <pp IX='0'/> or
			//         <tp IX='0'/>
			// character properties are used until another element specifies new character properties.
			// TODO tp_Type is not parsed?
			let propsRunsObjects = {
				"cp_Type": null,
				"pp_Type": null,
				"tp_Type": null
			};

			// read text
			textElement.elements.forEach(function(textElementPart, i) {
				if (typeof textElementPart === "string") {
					// TODO The characters in a text run can be a reference to a text field.

					// create paraRun using propsObjects
					// equal to ApiParagraph.prototype.AddText method
					let oRun = new ParaRun(paragraph, false);
					oRun.AddText(textElementPart);

					// setup Run
					// check character properties: get cp_Type object and in characherPropsCommon get needed Row
					let characterRowNum = propsRunsObjects["cp_Type"] && propsRunsObjects["cp_Type"].iX;
					let characterPropsFinal = characterRowNum !== null && characherPropsCommon.getRow(characterRowNum);
					let characterColorCell = characterPropsFinal && characterPropsFinal.getCell("Color");
					if (characterColorCell && characterColorCell.constructor.name === "Cell_Type") {
						let fontColor = calculateCellValue(theme, shape, characterColorCell);
						// no RGBA.A alpha channel considered
						fontColor.Calculate(theme);

						handleTextQuickStyleVariation(fontColor, lineUniFill, fillUniFill);

						var textColor1 = new CDocumentColor(fontColor.color.RGBA.R, fontColor.color.RGBA.G,
							fontColor.color.RGBA.B, false);
						oRun.Set_Color(textColor1);
					} else {
						console.log("text color cell not found! set text color as black");
						var blackColor = new CDocumentColor(0, 0, 0, false);
						oRun.Set_Color(blackColor);
					}

					// add run to paragraph
					paragraph.Add_ToContent(paragraph.Content.length - 1, oRun);
				} else {
					// push props object
					let textElementName = textElementPart.constructor.name;
					if (textElementName === "cp_Type" || textElementName === "tp_Type" || textElementName === "pp_Type") {
						propsRunsObjects[textElementName] = textElementPart;
					} else if (textElementName === "fld_Type") {
						console.log("fld_Type is unhandled for now");
					} else {
						console.log("undkown type in text tag");
					}
				}
			});

			// setup text properties
			var oTextPr;
			oTextPr = new CTextPr();
			oTextPr.FontSize = nFontSize;
			oTextPr.RFonts.Ascii = {Name: "Arial", Index: -1};
			oTextPr.RFonts.HAnsi = {Name: "Arial", Index: -1};
			oTextPr.RFonts.CS = {Name: "Arial", Index: -1};
			oTextPr.RFonts.EastAsia = {Name: "Arial", Index: -1};

			// apply text propterties
			oContent.SetApplyToAll(true);
			oContent.AddToParagraph(new ParaTextPr(oTextPr));
			// oContent.SetParagraphAlign(AscCommon.align_Center);
			oContent.SetApplyToAll(false);

			var oBodyPr = cShape.getBodyPr().createDuplicate();
			// oBodyPr.rot = 0;
			// oBodyPr.spcFirstLastPara = false;
			// oBodyPr.vertOverflow = AscFormat.nVOTOverflow;
			// oBodyPr.horzOverflow = AscFormat.nHOTOverflow;
			// oBodyPr.vert = AscFormat.nVertTThorz; // default //( ( Horizontal ))
			// oBodyPr.wrap = AscFormat.nTWTSquare; // default
			// oBodyPr.setDefaultInsets();
			// oBodyPr.numCol = 1;
			// oBodyPr.spcCol = 0;
			// oBodyPr.rtlCol = 0;
			// oBodyPr.fromWordArt = false;
			// oBodyPr.anchor = 1; // 4 - bottom, 1,2,3 - center
			// oBodyPr.anchorCtr = false;
			// oBodyPr.forceAA = false;
			// oBodyPr.compatLnSpc = true;
			// // oBodyPr.prstTxWarp = AscFormat.CreatePrstTxWarpGeometry("textNoShape");

			// cShape.bCheckAutoFitFlag = true;
			// oBodyPr.textFit = new AscFormat.CTextFit();
			// oBodyPr.textFit.type = AscFormat.text_fit_Auto;

			// oBodyPr.upright = false; // default
			if (bWord) {
				cShape.setBodyPr(oBodyPr);
			} else {
				cShape.txBody.setBodyPr(oBodyPr);
			}
			//
			//
			// let oUniNvPr = new AscFormat.UniNvPr();
			// oUniNvPr.nvPr.ph = Asc.asc_docs_api.prototype.CreatePlaceholder("object");
			//
			// // cShape.txBody.content2 = cShape.txBody.content;
			//
			// cShape.setNvSpPr(oUniNvPr);

			// copy settings from presentations debug
			// cShape.txBody.content.CurPos.TableMove = 1;
			// cShape.txBody.content.ReindexStartPos = 0;
			// cShape.txBody.content.Content[0].Content[1].CollPrChangeMine = false;
			// cShape.txBody.content.Content[0].Content[1].State.ContentPos = 10;
			// cShape.txBody.content.Content[0].Index = -1;
			// cShape.txBody.compiledBodyPr = null;

			// Set Paragraph (the only one paragraph exist) justify/align text - center
			// cShape.txBody.content.Content[0].Pr.SetJc(AscCommon.align_Center);

			// cShape.recalculateTextStyles();
			// cShape.recalculateTransformText(); // recalculates text position (i. e. transformText objects);
			// cShape.recalculateContent();
			// cShape.recalculateContent2();
			// cShape.recalculateContentWitCompiledPr();

			// use ParaRun.prototype.Set_Color
			// cShape.txBody.content.Content[0].Content[1].Pr.Color = TextColor1;
			// cShape.txBody.content.Content[0].Content[0].Pr.Color = TextColor1;
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
			console.log('pinX_inch or pinY_inch is NaN for Shape. Its ok sometimes. ' +
				'Empty CShape is returned. See original shape: ', this);
			// let's use empty shape
			var spPr = new AscFormat.CSpPr();
			let emptyCShape = new AscFormat.CShape();
			emptyCShape.setSpPr(spPr);
			spPr.setParent(emptyCShape)
			return emptyCShape;
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

		/** @type CUniFill */
		let uniFillForegndWithPattern = null;
		/**
		 * Fill without pattern applied.We need fill without pattern applied bcs pattern applied can set
		 * NoSolidFill object without color, so we will not be able to calculate handleVariationColor function result.
		 * @type CUniFill */
		let uniFillForegnd = null;

		/** @type CUniFill */
		let	uniFillBkgnd = null;

		let	nPatternType = null;

		/** @type CUniFill */
		let lineUniFillWithPattern = null;
		/**
		 * We need fill without pattern applied bcs pattern applied can set NoSolidFill object without color,
		 * so we will not be able to calculate handleVariationColor function result
		 * @type CUniFill */
		let lineUniFill = null;


		let fillForegndCell = this.getCell("FillForegnd");
		if (fillForegndCell) {
			// console.log("FillForegnd was found:", fillForegndCell);
			uniFillForegnd = calculateCellValue(visioDocument.theme, this, fillForegndCell);

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
		let fillBkgndCell = this.getCell("FillBkgnd");
		if (fillBkgndCell) {
			// console.log("FillBkgnd was found:", fillBkgndCell);
			uniFillBkgnd = calculateCellValue(visioDocument.theme, this, fillBkgndCell);

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

		let lineColorCell = this.getCell("LineColor");
		if (lineColorCell) {
			// console.log("LineColor was found for shape", lineColorCell);
			lineUniFill = calculateCellValue(visioDocument.theme, this, lineColorCell);
		} else {
			console.log("LineColor cell for line stroke (border) was not found painting red");
			lineUniFill = AscFormat.CreateUnfilFromRGB(255,0,0);
		}

		// calculate variation before pattern bcs it can make NoFillUniFill object without color
		handleQuickStyleVariation(lineUniFill, uniFillForegnd, this);

		// add read matrix modifier width?
		// + handle line pattens?
		let linePattern = this.getCell("LinePattern");
		if (linePattern) {
			if (linePattern.v === "0") {
				lineUniFillWithPattern = AscFormat.CreateNoFillUniFill();
			} else {
				//todo types
				lineUniFillWithPattern = lineUniFill;
			}
		}

		let fillPattern = this.getCell("FillPattern");
		/** @type ?number */
		let fillPatternType = null;
		if (fillPattern) {
			// console.log("fillPattern was found:", fillPattern);
			let fillPatternTypeTryParse = parseInt(fillPattern.v);
			if (!isNaN(fillPatternTypeTryParse)) {
				fillPatternType = fillPatternTypeTryParse;
			}
		}

		if (null !== fillPatternType && uniFillBkgnd && uniFillForegnd) {
			// https://learn.microsoft.com/ru-ru/office/client-developer/visio/fillpattern-cell-fill-format-section
			if (fillPatternType === 0) {
				uniFillForegndWithPattern = AscFormat.CreateNoFillUniFill();
			} else if (fillPatternType === 1) {
				uniFillForegndWithPattern = uniFillForegnd;
			} else if (fillPatternType > 1) {
				//todo types
				nPatternType = 0;//"cross";
				uniFillForegndWithPattern = AscFormat.CreatePatternFillUniFill(nPatternType,
					uniFillBkgnd.fill.color, uniFillForegnd.fill.color);
				// uniFill = AscFormat.builder_CreatePatternFill(nPatternType, uniFillBkgnd.fill.color, uniFillForegnd.fill.color);
			}
		} else if (uniFillForegnd) {
			uniFillForegndWithPattern = uniFillForegnd;
		} else {
			console.log("FillForegnd not found for shape", this);
			uniFillForegndWithPattern = AscFormat.CreateNoFillUniFill();
		}

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

		// console.log("Calculated lineUniFill unifill", lineUniFill, "for shape", this);
		// console.log("Calculated fill UniFill", uniFillForegndWithPattern, "for shape", this);

		var oStroke = AscFormat.builder_CreateLine(lineWidthEmu, {UniFill: lineUniFillWithPattern});
		// var oStroke = AscFormat.builder_CreateLine(12700, {UniFill: AscFormat.CreateUnfilFromRGB(255,0,0)});

		if (this.type === "Foreign") {
			console.log("Shape has type Foreign and may not be displayed. " +
				"Check shape.elements --> ForeignData_Type obj. See shape:", this);
		}

		let flipXCell = this.getCell("FlipX");
		let flipHorizontally = flipXCell ? flipXCell.v === "1" : false;

		let flipYCell = this.getCell("FlipY");
		let flipVertically = flipYCell ?  flipYCell.v === "1" : false;

		let cShape = this.convertToCShapeUsingParamsObj({
			x_mm: x_mm, y_mm: y_mm,
			w_mm: shapeWidth_mm, h_mm: shapeHeight_mm,
			rot: shapeAngle,
			oFill: uniFillForegndWithPattern, oStroke: oStroke,
			flipHorizontally: flipHorizontally, flipVertically: flipVertically,
			cVisioDocument: visioDocument
		});

		cShape.Id = String(this.iD); // it was string in cShape

		handleText(visioDocument.themes[0], this, cShape, lineUniFill, uniFillForegnd);

		cShape.recalculate();
		cShape.recalculateLocalTransform(cShape.transform);

		return cShape;
	}

	/**
	 * converts !Shape TypeGroup! To CGroupShape Recursively.
	 * let's say shape can only have subshapes if its Type='Group'.
	 * @memberOf Shape_Type
	 * @param {CVisioDocument} visioDocument
	 * @param {CGroupShape?} currentGroupHandling
	 * @return {CGroupShape | Error}
	 */
	Shape_Type.prototype.convertToCGroupShapeRecursively = function (visioDocument, currentGroupHandling) {
		// if we need to create CGroupShape create CShape first then copy its properties to CGroupShape object
		// so anyway create CShape
		let cShape = this.convertToCShape(visioDocument);

		if (this.type === "Group") {
			// CGroupShape cant support text. So cShape will represent everything related to Shape Type="Group".
			// Let's push cShape into CGroupShape object.

			let groupShape = new AscFormat.CGroupShape();
			// this.graphicObjectsController = new AscFormat.DrawingObjectsController();
			// let groupShape = AscFormat.builder_CreateGroup();

			groupShape.setLocks(0);

			groupShape.setBDeleted(false);

			// Create CGroupShape with SpPr from cShape but with no fill and line
			let noLineFillSpPr = cShape.spPr.createDuplicate();
			noLineFillSpPr.setFill(AscFormat.CreateNoFillUniFill());
			noLineFillSpPr.setLn(AscFormat.CreateNoFillLine());

			groupShape.setSpPr(noLineFillSpPr);
			groupShape.spPr.setParent(groupShape);
			groupShape.rot = cShape.rot;
			groupShape.brush = cShape.brush;
			groupShape.bounds = cShape.bounds;
			groupShape.flipH = cShape.flipH;
			groupShape.flipV = cShape.flipV;
			groupShape.localTransform = cShape.localTransform;
			groupShape.pen = cShape.pen;
			groupShape.Id = cShape.Id + "Group";

			groupShape.addToSpTree(groupShape.spTree.length, cShape);
			groupShape.spTree[groupShape.spTree.length-1].setGroup(groupShape);

			cShape.spPr.xfrm.setOffX(0);
			cShape.spPr.xfrm.setOffY(0);

			// cShape.setLocks(1)?;

			groupShape.setParent2(visioDocument);

			if (!currentGroupHandling) {

				currentGroupHandling = groupShape;
				let subShapes = this.getSubshapes();
				for (let i = 0; i < subShapes.length; i++) {
					const subShape = subShapes[i];
					subShape.convertToCGroupShapeRecursively(visioDocument, currentGroupHandling);
				}
			} else {

				currentGroupHandling.addToSpTree(currentGroupHandling.spTree.length, groupShape);
				currentGroupHandling.spTree[currentGroupHandling.spTree.length-1].setGroup(currentGroupHandling);
				groupShape.recalculateLocalTransform(groupShape.transform);

				currentGroupHandling = groupShape;
				let subShapes = this.getSubshapes();
				for (let i = 0; i < subShapes.length; i++) {
					const subShape = subShapes[i];
					subShape.convertToCGroupShapeRecursively(visioDocument, currentGroupHandling);
				}
			}
			// recalculate text other positions to local (group) coordinates
			cShape.recalculateLocalTransform(cShape.transform);
			cShape.recalculateTransformText();
			cShape.recalculateContent();
			// cShape.recalculate(); // doesnt work here

		} else {
			// if read cShape not CGroupShape
			if (!currentGroupHandling) {
				throw new Error("Group handler was called on simple shape");
			} else {
				currentGroupHandling.addToSpTree(currentGroupHandling.spTree.length, cShape);
				currentGroupHandling.spTree[currentGroupHandling.spTree.length-1].setGroup(currentGroupHandling);
				cShape.recalculateLocalTransform(cShape.transform);

				// recalculate text other positions to local (group) coordinates
				cShape.recalculateLocalTransform(cShape.transform);
				cShape.recalculateTransformText();
				cShape.recalculateContent();
				// cShape.recalculate(); // doesnt work here
			}
		}

		if (currentGroupHandling) {
			currentGroupHandling.recalculate();
		}

		return currentGroupHandling;
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
		// shape.recalculate();
		return shape;
	};


	//-------------------------------------------------------------export-------------------------------------------------
	window['Asc']            = window['Asc'] || {};
	window['AscCommon']      = window['AscCommon'] || {};
	window['AscCommonWord']  = window['AscCommonWord'] || {};
	window['AscCommonSlide'] = window['AscCommonSlide'] || {};
	window['AscCommonExcel'] = window['AscCommonExcel'] || {};
	window['AscCommonDraw']  = window['AscCommonDraw'] || {};
	window['AscFormat']  = window['AscFormat'] || {};
	window['AscWord'] = window['AscWord'] || {};

})(window, window.document);
