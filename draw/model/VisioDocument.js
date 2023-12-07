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
	// Docs:
	// VisioDocument_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/visiodocument_type-complextypevisio-xml
	function CVisioDocument(Api, isMainLogicDocument) {
		this.start = null;
		this.key = null;
		this.metric = null;
		this.buildnum = null;
		this.version = null;
		this.docLangID = null;
		this.documentProperties = null;
		this.documentSettings = null;
		this.colors = [];
		this.faceNames = [];
		this.styleSheets = [];
		this.documentSheet = null;
		this.eventList = [];
		this.headerFooter = null;
		this.dataTransferInfo = null;
		this.publishSettings = null;
		this.comments = null;
		this.any = null;
		this.anyAttr = null;

		this.xmlSpace = null;
		this.xmlns = null;
		this.r = null;

		// TODO mb consider 'this'(CVisioDocument) contains parts(.xml files) like document.xml and windows.xml
		// only but not XMLmethods and call class representing document.xml VisioDocument_Type
		// this.visioDocument_Type = null;
		this.windows = null;
		this.masters = null;
		this.masterContents = [];
		this.pages = null;
		this.pageContents = [];
		this.theme = new AscFormat.CTheme();
		this.app = null;
		this.core = null;
		this.customProperties = null;
		this.thumbnail = null;
		this.commentsPart = null;
		this.extensions = null;
		this.dataConnections = null;
		this.dataRecordSets = null;
		this.validation = null;

		// Not realized, file defines schema and data of that schema
		this.solutions = null;
		// solution contents
		this.solutionXMLs = [];

		// unfinished
		// this.EmbeddedData = null;

		//------------------------------------------------------------------------------------------------------------------
		//  Сохраняем ссылки на глобальные объекты
		//------------------------------------------------------------------------------------------------------------------
		this.history              = History;
		this.idCounter            = AscCommon.g_oIdCounter;
		this.tableId              = AscCommon.g_oTableId;
		// this.collaborativeEditing = (("undefined" !== typeof(AscCommon.CWordCollaborativeEditing) && AscCommon.CollaborativeEditing instanceof AscCommon.CWordCollaborativeEditing) ? AscCommon.CollaborativeEditing : null);
		this.api                  = Api;
		//------------------------------------------------------------------------------------------------------------------
		//  Выставляем ссылки на главный класс
		//------------------------------------------------------------------------------------------------------------------
		if (false !== isMainLogicDocument)
		{
			// if (this.history)
			// 	this.history.Set_LogicDocument(this);
		}
		this.mainDocument = false !== isMainLogicDocument;
	}

	// TODO Check thumbnail parse in fromZip and setData in toZip
	CVisioDocument.prototype.fromZip = function(zip, context, oReadResult) {
		// Maybe it should be moved to 	sdkjs-ooxml/visio/Editor/SerializeXml.js like in 'word' case?
		// 'word' case: 								sdkjs-ooxml/word/Editor/SerializeXml.js
		context.zip = zip;

		let reader;
		let doc = new AscCommon.openXml.OpenXmlPackage(zip, null);

		parseApp.call(this, doc, reader, context);
		parseCore.call(this, doc, reader, context);
		parseCustomProperties.call(this, doc, reader, context);
		parseThumbnail.call(this, doc, reader, context);

		let documentPart = doc.getPartByRelationshipType(AscCommon.openXml.Types.visioDocument.relationType);
		if (documentPart) {
			let contentDocument = documentPart.getDocumentContent();
			reader = new StaxParser(contentDocument, documentPart, context);
			this.fromXml(reader);
			// TODO mb consider 'this' contains parts(.xml files) only but not XML like document.xml and windows.xml
			// this.visioDocument_Type = new AscCommonDraw.VisioDocument_Type();
			// this.visioDocument_Type.fromXml(reader);

			parseWindows.call(this, documentPart, reader, context);
			parseMasters.call(this, documentPart, reader, context);
			parsePages.call(this, documentPart, reader, context);
			parseTheme.call(this, documentPart, reader, context);
			parseComments.call(this, documentPart, reader, context);
			parseExtensions.call(this, documentPart, reader, context);
			parseDataConnections.call(this, documentPart, reader, context);
			parseDataRecordSets.call(this, documentPart, reader, context);
			parseValidation.call(this, documentPart, reader, context);
			// Not realized, file defines schema and data of that schema
			parseSolutions.call(this, documentPart, reader, context);
		}
		// unfinished
		// saveEmbeddedData.call(this, doc);
		// handleEmbeddedDataRels.call(this, zip);
	};
	// TODO mb rewrite consider 'CVisioDocument' contains parts(.xml files) only but not XML
	CVisioDocument.prototype.toZip = function(zip, context) {
		let memory = new AscCommon.CMemory();
		memory.SetXmlAttributeQuote(0x27);
		memory.context = context;
		context.document = this;

		let filePart = new AscCommon.openXml.OpenXmlPackage(zip, memory);

		let docPart = filePart.addPart(AscCommon.openXml.Types.visioDocument);
		let appPart = filePart.addPart(AscCommon.openXml.Types.extendedFileProperties);
		let corePart = filePart.addPart(AscCommon.openXml.Types.coreFileProperties);
		let customPrPart = filePart.addPart(AscCommon.openXml.Types.customFileProperties);
		let thumbNailPart = filePart.addPart(AscCommon.openXml.Types.thumbnail);
		let windowsPart = docPart.part.addPart(AscCommon.openXml.Types.visioDocumentWindows);
		let mastersPart = docPart.part.addPart(AscCommon.openXml.Types.masters);
		let themePart = docPart.part.addPart(AscCommon.openXml.Types.theme);
		let commentsPart = docPart.part.addPart(AscCommon.openXml.Types.visioComments);
		let extensionsPart = docPart.part.addPart(AscCommon.openXml.Types.visioExtensions);
		let dataConnectionsPart = docPart.part.addPart(AscCommon.openXml.Types.visioDataConnections);
		let dataRecordSetsPart = docPart.part.addPart(AscCommon.openXml.Types.visioDataRecordSets);
		let validationPart = docPart.part.addPart(AscCommon.openXml.Types.validation);
		// Not realized, file defines schema and data of that schema
		let solutionsPart = docPart.part.addPart(AscCommon.openXml.Types.solutions);

		for (let i = 0; i < this.masterContents.length; i++) {
			let masterContent = mastersPart.part.addPart(AscCommon.openXml.Types.master);
			masterContent.part.setDataXml(this.masterContents[i], memory);
		}

		let pagesPart = docPart.part.addPart(AscCommon.openXml.Types.pages);

		for (let i = 0; i < this.pageContents.length; i++) {
			let pageContent = pagesPart.part.addPart(AscCommon.openXml.Types.page);
			pageContent.part.setDataXml(this.pageContents[i], memory);

			// I add page[N].xml.rels below
			// It has links to all masters but
			// in examplevsdx file in page[N].xml.rels rId[N] states to random master[N]
			// e.g. rId3 to ../masters/master1.xml
			// here rId1 will state to master1, rId2 to master2, etc.
			// TODO check if this is important
			// in page[N].xml there is no rId used only <Shape ... Master="[ID]">
			// e. g. <Shape ... Master="1">
			for (let i = 0; i < this.masterContents.length; i++) {
				pageContent.part.addRelationship(AscCommon.openXml.Types.masterFromPage.relationType,
					"../masters/master" + (i + 1) + ".xml");
			}
		}

		// Not realized, file defines schema and data of that schema
		for (let i = 0; i < this.solutionXMLs.length; i++) {
			let solutionContent = solutionsPart.part.addPart(AscCommon.openXml.Types.solution);
			solutionContent.part.setDataXml(this.solutionXMLs[i], memory);
		}

		docPart.part.setDataXml(this, memory);
		appPart.part.setDataXml(this.app, memory);
		corePart.part.setDataXml(this.core, memory);
		if (this.customProperties) {
			// if Custom part exists
			customPrPart.part.setDataXml(this.customProperties, memory);
		}
		if (this.thumbnail) {
			thumbNailPart.part.setData(this.thumbnail, memory);
		}
		if (this.windows) {
			// if Windows part exists
			windowsPart.part.setDataXml(this.windows, memory);
		}
		if (this.masters) {
			mastersPart.part.setDataXml(this.masters, memory);
		}
		pagesPart.part.setDataXml(this.pages, memory);
		if (this.theme) {
			// if Theme part exists (by docs it MUST exist)
			themePart.part.setDataXml(this.theme, memory);
		}
		if (this.commentsPart) {
			commentsPart.part.setDataXml(this.commentsPart, memory);
		}
		if (this.extensions) {
			extensionsPart.part.setDataXml(this.extensions, memory);
		}
		if (this.dataConnections) {
			dataConnectionsPart.part.setDataXml(this.dataConnections, memory);
		}
		if (this.dataRecordSets) {
			dataRecordSetsPart.part.setDataXml(this.dataRecordSets, memory);
		}
		if (this.validation) {
			validationPart.part.setDataXml(this.validation, memory);
		}
		// Not realized, file defines schema and data of that schema
		if (this.solutions) {
			solutionsPart.part.setDataXml(this.solutions, memory);
		}
		memory.Seek(0);
	};
	CVisioDocument.prototype.getObjectType = function() {
		//todo remove it is temporary. to be parent of shape
		return 0;
	};
	CVisioDocument.prototype.zoom_FitToPage_value = function(logic_w_mm, logic_h_mm, w_px, h_px) {
		var _value = 100;

		var w = w_px;
		var h = h_px;

		var _pageWidth  = logic_w_mm * g_dKoef_mm_to_pix;
		var _pageHeight = logic_h_mm * g_dKoef_mm_to_pix;

		var _hor_Zoom = 100;
		if (0 != _pageWidth)
			_hor_Zoom = (100 * w) / _pageWidth;
		var _ver_Zoom = 100;
		if (0 != _pageHeight)
			_ver_Zoom = (100 * h) / _pageHeight;

		// we take minimal zoom so page comes to closest canvas border
		// 42.3 --> 41 is it ok? when Math.min(_hor_Zoom, _ver_Zoom) = 42.3
		_value = (Math.min(_hor_Zoom, _ver_Zoom) - 0.5) >> 0;

		if (_value < 5)
			_value = 5;
		return _value;
	};
	CVisioDocument.prototype.draw = function(pageScale) {
		let api = this.api;
		//CSlideSize.prototype.DEFAULT_CX
		//todo units, indexes
		let logic_w_inch = this.pages.page[0].pageSheet.elements.find(function(elem) {return elem.n === "PageWidth"}).v;
		let logic_h_inch = this.pages.page[0].pageSheet.elements.find(function(elem) {return elem.n === "PageHeight"}).v;
		let logic_w_mm = logic_w_inch * g_dKoef_in_to_mm;
		let logic_h_mm = logic_h_inch * g_dKoef_in_to_mm;

		let zoom = this.zoom_FitToPage_value(logic_w_mm, logic_h_mm, api.HtmlElement.offsetWidth, api.HtmlElement.offsetHeight);
		var dKoef = zoom * g_dKoef_mm_to_pix / 100;
		dKoef *= AscCommon.AscBrowser.retinaPixelRatio;

		var w_mm = logic_w_mm;
		var h_mm = logic_h_mm;
		var w_px = (w_mm * dKoef) >> 0;
		var h_px = (h_mm * dKoef) >> 0;

		let _canvas = api.canvas;

		// use scale
		// consider previous scale maybe
		_canvas.style.width = pageScale * 100 + "%";
		_canvas.style.height = pageScale * 100 + "%";

		// set pixels count for width and height
		_canvas.width = AscCommon.AscBrowser.convertToRetinaValue(_canvas.clientWidth, true);
		_canvas.height = AscCommon.AscBrowser.convertToRetinaValue(_canvas.clientHeight, true);
		var ctx = _canvas.getContext('2d');
		ctx.fillStyle = "#FFFFFF";
		// use scale
		ctx.fillRect(0, 0, w_px * pageScale, h_px * pageScale);

		var graphics = new AscCommon.CGraphics();
		graphics.init(ctx, w_px, h_px, w_mm, h_mm);
		graphics.m_oFontManager = AscCommon.g_fontManager;

		//visio y coordinate goes up while
		//ECMA-376-11_5th_edition and Geometry.js y coordinate goes down
		//so without mirror we get page up side down
		global_MatrixTransformer.Reflect(graphics.m_oCoordTransform, false, true);
		global_MatrixTransformer.TranslateAppend(graphics.m_oCoordTransform, 0, h_px);
		// use scale
		global_MatrixTransformer.ScaleAppend(graphics.m_oCoordTransform, pageScale, pageScale);

		let shapes = this.convertToShapes(logic_w_mm, logic_h_mm);
		shapes.forEach(function(shape) {
			graphics.SaveGrState();
			graphics.SetIntegerGrid(false);

			graphics.transform3(shape.transform);
			let shape_drawer = new AscCommon.CShapeDrawer();
			shape_drawer.fromShape2(shape, graphics, shape.getGeometry());
			shape_drawer.draw(shape.getGeometry());
			shape_drawer.Clear();
			graphics.RestoreGrState();
		});
	};
	function getRandomPrst() {
		let types = AscCommon.g_oAutoShapesTypes[Math.floor(Math.random()*AscCommon.g_oAutoShapesTypes.length)];
		return types[Math.floor(Math.random()*types.length)].Type;
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
	CVisioDocument.prototype.convertToShapes = function(logic_w_mm, logic_h_mm) {
		/**
		 * @type {Shape_Type[]}
		 */
		let shapeClasses = [];
		let shapes = [];
		let masters = this.joinMastersInfoAndContents();

		for(let i = 0; i < this.pageContents[0].shapes.length; i++) {
			let shape = this.pageContents[0].shapes[i];

			shape.realizeMasterToShapeInheritanceRecursive(masters);
			shape.realizeStyleToShapeInheritanceRecursive(this.styleSheets);
			shapeClasses = shapeClasses.concat(shape.collectSubshapesRecursive(true));
		}

		for (let i = 0; i < shapeClasses.length; i++) {
			const shape = shapeClasses[i];
			// if (shape.iD === 199) {
			// 	continue;
			// }

			// there was case with shape type group with no PinX and PinY
			// https://disk.yandex.ru/d/tl877cuzcRcZYg
			let pinXCell = shape.getCell("PinX");
			let pinX_inch;
			if (pinXCell !== null) {
				pinX_inch = Number(pinXCell.v);
			}
			let pinYCell = shape.getCell("PinY");
			let pinY_inch;
			if (pinYCell !== null) {
				pinY_inch = Number(pinYCell.v);
			}
			// also check for {}, undefined, NaN
			if (isNaN(pinX_inch) || isNaN(pinY_inch)) {
				console.log('pinX_inch or pinY_inch is NaN for', shape);
				continue;
			}

			let shapeAngle = Number(shape.getCell("Angle").v);
			let locPinX_inch = Number(shape.getCell("LocPinX").v);
			let locPinY_inch = Number(shape.getCell("LocPinY").v);
			let shapeWidth_inch = Number(shape.getCell("Width").v);
			let shapeHeight_inch = Number(shape.getCell("Height").v);

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

			let shapeGeom = AscCommonDraw.getGeometryFromShape(shape);

			let fillColor = shape.getCell("FillForegnd");
			if (fillColor !== null) {
				console.log("FillForegnd was found:", fillColor);
			} else {
				console.log("FillForegnd cell not found for shape", shape);
			}

			var oFill   = AscFormat.CreateUnfilFromRGB(0,127,0);
			var oStroke = AscFormat.builder_CreateLine(12700, {UniFill: AscFormat.CreateUnfilFromRGB(255,0,0)});

			let cShape = this.convertToShape(x_mm, y_mm, shapeWidth_mm, shapeHeight_mm, shapeAngle, oFill, oStroke, shapeGeom);

			shapes.push(cShape);
		}

		// var prst = getRandomPrst();
		// var geom = new AscFormat.CreateGeometry(prst);
		// var oFill   = AscFormat.CreateUnfilFromRGB(0,0,127);
		// var oStroke = AscFormat.builder_CreateLine(12700, {UniFill: AscFormat.CreateUnfilFromRGB(255,0,0)});
		// shapes.push(this.convertToShape(logic_w_mm / 5, logic_h_mm / 5, oFill, oStroke, geom));
		return shapes;
	};
	CVisioDocument.prototype.convertToShape = function(x, y, w_mm, h_mm, rot, oFill, oStroke, geom) {
		let sType   = "rect";
		let nWidth_mm  = Math.round(w_mm);
		let nHeight_mm = Math.round(h_mm);
		//let oDrawingDocument = new AscCommon.CDrawingDocument();
		let shape = AscFormat.builder_CreateShape(sType, nWidth_mm, nHeight_mm,
			oFill, oStroke, this, this.theme, null, false);
		shape.spPr.xfrm.setOffX(x);
		shape.spPr.xfrm.setOffY(y);
		shape.spPr.xfrm.setRot(rot);

		shape.spPr.setGeometry(geom);
		shape.recalculate();
		return shape;
	};

	// Main classes for reading

	// Docs:
	// Windows_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/windows_type-complextypevisio-xml
	function CWindows() {
		this.clientWidth = null;
		this.clientHeight = null;
		this.window = [];
		this.xmlSpace = null;
		this.xmlns = null;
		this.r = null;
		return this;
	}

	// Docs:
	// Masters_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/masters_type-complextypevisio-xml
	function CMasters() {
		this.master = [];
		this.masterShortcut = [];
		this.xmlSpace = null;
		this.xmlns = null;
		this.r = null;
		return this;
	}

	// Another name in docs PageContents_Type
	function CMasterContents() {
		this.shapes = [];
		this.connects = [];
		this.xmlSpace = null;
		this.xmlns = null;
		this.r = null;
		return this;
	}

	// Docs:
	// Pages_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/pages_type-complextypevisio-xml
	function CPages() {
		this.page = [];
		this.xmlSpace = null;
		this.xmlns = null;
		this.r = null;
		return this;
	}

	// Docs:
	// Элемент Shapes (PageContents_Type complexType): https://learn.microsoft.com/ru-ru/office/client-developer/visio/shapes-element-pagecontents_type-complextypevisio-xml
	// PageContents_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/pagecontents_type-complextypevisio-xml
	function CPageContents() {
		/**
		 *
		 * @type {Shape_Type[]}
		 */
		this.shapes = [];
		this.connects = [];
		this.xmlSpace = null;
		this.xmlns = null;
		this.r = null;
		return this;
	}

	// Docs:
// Comments_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/comments_type-complextypevisio-xml
	function CComments() {
		this.showCommentTags = null;
		this.authorList = [];
		this.commentList = [];
		this.xmlSpace = null;
		this.xmlns = null;
		this.r = null;
		return this;
	}

	// Docs:
// Extensions_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/extensions_type-complextypevisio-xml
	function CExtensions() {
		this.cellDef = [];
		this.functionDef = [];
		this.sectionDef = [];
		this.xmlSpace = null;
		this.xmlns = null;
		this.r = null;
		return this;
	}

	// Docs:
// DataConnections_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/dataconnections_type-complextypevisio-xml
	function CDataConnections() {
		this.nextID = null;
		this.dataConnection = [];
		this.xmlSpace = null;
		this.xmlns = null;
		this.r = null;
		return this;
	}

	// Docs:
	// DataRecordSets_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/datarecordsets_type-complextypevisio-xml
	function CDataRecordSets() {
		this.nextID = null;
		this.activeRecordsetID = null;
		this.dataWindowOrder = null;
		this.dataRecordSet = [];
		this.xmlSpace = null;
		this.xmlns = null;
		this.r = null;
		return this;
	}

	// Docs old:
	// Validation_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/validation_type-complextypevisio-xml
	function CValidation() {
		this.validationProperties = null;
		this.ruleSets = [];
		this.issues = [];
		this.xmlSpace = null;
		this.xmlns = null;
		this.r = null;
		return this;
	}

	// Not realized, file defines schema and data of that schema
	// Docs:
	// Solutions_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/solutions_type-complextypevisio-xml
	function CSolutions() {
		this.solution = [];
		this.xmlSpace = null;
		this.xmlns = null;
		this.r = null;
		return this;
	}

	function CSolutionXML() {
		this.name = null;
		// string containing overall xml
		this.fileContents = null;
		return this;
	}

	function parseApp(doc, reader, context) {
		let appPart = doc.getPartByRelationshipType(AscCommon.openXml.Types.extendedFileProperties.relationType);
		if (appPart) {
			let appContent = appPart.getDocumentContent();
			reader = new StaxParser(appContent, appPart, context);
			this.app = new AscCommon.CApp();
			this.app.fromXml(reader, true);
		}
	}

	function parseCore(doc, reader, context) {
		let corePart = doc.getPartByRelationshipType(AscCommon.openXml.Types.coreFileProperties.relationType);
		if (corePart) {
			let coreContent = corePart.getDocumentContent();
			reader = new StaxParser(coreContent, corePart, context);
			this.core = new AscCommon.CCore();
			this.core.fromXml(reader, true);
		}
	}

	function parseCustomProperties(doc, reader, context) {
		let customPrPart = doc.getPartByRelationshipType(AscCommon.openXml.Types.customFileProperties.relationType);
		if (customPrPart) {
			let customPrPartContent = customPrPart.getDocumentContent();
			reader = new StaxParser(customPrPartContent, customPrPart, context);
			this.customProperties = new AscCommon.CCustomProperties();
			this.customProperties.fromXml(reader, true);
		}
	}

	function parseThumbnail(doc, reader, context) {
		let thumbnailPart = doc.getPartByRelationshipType(AscCommon.openXml.Types.thumbnail.relationType);
		if (thumbnailPart) {
			let thumbnailPartContent = thumbnailPart.getDocumentContent();
			this.thumbnail = thumbnailPartContent;
		}
	}

	function parseWindows(documentPart, reader, context) {
		let windowsPart = documentPart.getPartByRelationshipType(AscCommon.openXml.Types.visioDocumentWindows.relationType);
		if (windowsPart) {
			let contentWindows = windowsPart.getDocumentContent();
			reader = new StaxParser(contentWindows, windowsPart, context);
			this.windows = new CWindows();
			this.windows.fromXml(reader);
		}
	}

	function parseMasters(documentPart, reader, context) {
		let mastersPart = documentPart.getPartByRelationshipType(AscCommon.openXml.Types.masters.relationType);
		if (mastersPart) {
			let contentMasters = mastersPart.getDocumentContent();
			reader = new StaxParser(contentMasters, mastersPart, context);
			this.masters = new CMasters();
			this.masters.fromXml(reader);

			let masters = mastersPart.getPartsByRelationshipType(AscCommon.openXml.Types.master.relationType);
			if (masters) {

				// order is important so sort masters using uri
				let mastersSort = [];
				for (let i = 0; i < masters.length; i++) {
					let masterNumber = +masters[i].uri.match(/\d+/)[0]; // for master3.xml we get 3
					if (!isNaN(parseFloat(masterNumber)) && !isNaN(masterNumber - 0)) {
						// if masterNumber is number
						mastersSort[masterNumber - 1] = masters[i];
					} else {
						console.log('check sdkjs/draw/model/VisioDocument.js : parseMasters');
						mastersSort = masters;
						break;
					}
				}

				masters = mastersSort;
				for (let i = 0; i < masters.length; i++) {
					let masterPart = masters[i];
					let contentMaster = masterPart.getDocumentContent();
					reader = new StaxParser(contentMaster, masterPart, context);
					let MasterContent = new CMasterContents();
					MasterContent.fromXml(reader);
					this.masterContents.push(MasterContent);
				}
			}
		}
	}

	function parsePages(documentPart, reader, context) {
		let pagesPart = documentPart.getPartByRelationshipType(AscCommon.openXml.Types.pages.relationType);
		if (pagesPart) {
			let contentPages = pagesPart.getDocumentContent();
			reader = new StaxParser(contentPages, pagesPart, context);
			this.pages = new CPages();
			this.pages.fromXml(reader);

			let pages = pagesPart.getPartsByRelationshipType(AscCommon.openXml.Types.page.relationType);
			if (pages) {
				// order is important so sort masters using uri
				let pagesSort = [];
				for (let i = 0; i < pages.length; i++) {
					let pageNumber = pages[i].uri.slice(-5)[0]; // for page3.xml we get 3
					if (!isNaN(parseFloat(pageNumber)) && !isNaN(pageNumber - 0)) {
						// if masterNumber is number
						pagesSort[pageNumber - 1] = pages[i];
					} else {
						console.log('check sdkjs/draw/model/VisioDocument.js : parsePages');
						pagesSort = pages;
						break;
					}
				}
				pages = pagesSort;
				for (let i = 0; i < pages.length; i++) {
					let pagePart = pages[i];
					let contentPage = pagePart.getDocumentContent();
					reader = new StaxParser(contentPage, pagePart, context);
					let PageContent = new CPageContents();
					PageContent.fromXml(reader);
					this.pageContents.push(PageContent);
				}
			}
		}
	}

	function parseTheme(documentPart, reader, context) {
		let themePart = documentPart.getPartByRelationshipType(AscCommon.openXml.Types.theme.relationType);
		if (themePart) {
			let themePartContent = themePart.getDocumentContent();
			reader = new StaxParser(themePartContent, themePart, context);
			this.theme = new AscFormat.CTheme();
			this.theme.fromXml(reader, true);
		}
	}

	function parseComments(documentPart, reader, context) {
		let commentsPart = documentPart.getPartByRelationshipType(AscCommon.openXml.Types.visioComments.relationType);
		if (commentsPart) {
			let commentsPartContent = commentsPart.getDocumentContent();
			reader = new StaxParser(commentsPartContent, commentsPart, context);
			this.commentsPart = new CComments();
			this.commentsPart.fromXml(reader, true);
		}
	}

	function parseExtensions(documentPart, reader, context) {
		let extensionsPart = documentPart.getPartByRelationshipType(AscCommon.openXml.Types.visioExtensions.relationType);
		if (extensionsPart) {
			let extensionsPartContent = extensionsPart.getDocumentContent();
			reader = new StaxParser(extensionsPartContent, extensionsPart, context);
			this.extensions = new CExtensions();
			this.extensions.fromXml(reader, true);
		}
	}

	function parseDataConnections(documentPart, reader, context) {
		let dataConnectionsPart = documentPart.getPartByRelationshipType(AscCommon.openXml.Types.visioDataConnections.relationType);
		if (dataConnectionsPart) {
			let dataConnectionsPartContent = dataConnectionsPart.getDocumentContent();
			reader = new StaxParser(dataConnectionsPartContent, dataConnectionsPart, context);
			this.dataConnections = new CDataConnections();
			this.dataConnections.fromXml(reader, true);
		}
	}

	function parseDataRecordSets(documentPart, reader, context) {
		let dataRecordSetsPart = documentPart.getPartByRelationshipType(AscCommon.openXml.Types.visioDataRecordSets.relationType);
		if (dataRecordSetsPart) {
			let dataRecordSetsPartContent = dataRecordSetsPart.getDocumentContent();
			reader = new StaxParser(dataRecordSetsPartContent, dataRecordSetsPart, context);
			this.dataRecordSets = new CDataRecordSets();
			this.dataRecordSets.fromXml(reader, true);
		}
	}

	function parseValidation(documentPart, reader, context) {
		let validationPart = documentPart.getPartByRelationshipType(AscCommon.openXml.Types.validation.relationType);
		if (validationPart) {
			let validationPartContent = validationPart.getDocumentContent();
			reader = new StaxParser(validationPartContent, validationPart, context);
			this.validation = new CValidation();
			this.validation.fromXml(reader, true);
		}
	}

	// Not realized, file defines schema and data of that schema
	function parseSolutions(documentPart, reader, context) {
		let solutionsPart = documentPart.getPartByRelationshipType(AscCommon.openXml.Types.solutions.relationType);
		if (solutionsPart) {
			let solutionsPartContent = solutionsPart.getDocumentContent();
			reader = new StaxParser(solutionsPartContent, solutionsPart, context);
			this.solutions = new CSolutions();
			this.solutions.fromXml(reader, true);

			let solutions = solutionsPart.getPartsByRelationshipType(AscCommon.openXml.Types.solution.relationType);
			if (solutions) {
				// order is important so sort masters using uri
				let solutionsSort = [];
				for (let i = 0; i < solutions.length; i++) {
					let solutionNumber = +solutions[i].uri.match(/\d+/)[0];
					if (!isNaN(parseFloat(solutionNumber)) && !isNaN(solutionNumber - 0)) {
						// if masterNumber is number
						solutionsSort[solutionNumber - 1] = solutions[i];
					} else {
						console.log('check sdkjs/draw/model/VisioDocument.js : parseSolutions');
						solutionsSort = solutions;
						break;
					}
				}
				solutions = solutionsSort;
				for (let i = 0; i < solutions.length; i++) {
					let solutionPart = solutions[i];
					let contentSolution = solutionPart.getDocumentContent();
					reader = new StaxParser(contentSolution, solutionPart, context);
					let solutionContent = new CSolutionXML();
					solutionContent.fromXml(reader);
					this.solutionXMLs.push(solutionContent);
				}
			}
		}
	}

	// function handleEmbeddedDataRels(fullDocPart) {
	// 	// unfinished
	// 	// Proposal: find embedded data files related to parts
	//	// and add links to this.EmbeddedData(see below)[n] consider embedded data file path from it
	// 	// save this links so varibles like StyleSheet.embeddedData['rId1'] or
	//	// Document.embeddedData['rId2']
	// 	let relationTypes = ["http://schemas.openxmlformats.org/officeDocument/2006/relationships/oleObject"];
	//
	// 	let parts = fullDocPart.getParts();
	// 	let partsWithForeignDataLinks = parts.filter(function findPartsWhichLinksToForeignData(part) {
	// 		return -1 !== part.getRelationships().findIndex(function (relationship) {
	// 			return relationTypes.includes(relationship.relationshipType);
	// 		})
	// 	});
	//
	// 	let a = 1;
	// }

	// function saveEmbeddedData(zip) {
	// 	// unfinished
	// 	// Proposal: save embedded files (e.g. .xmls .emf, ...) data like base64 string
	// 	// Create obj with that string, filepath, and filename
	// 	// to this(VisioDocument) like this.EmbeddedData = [];
	// }


	//-------------------------------------------------------------export---------------------------------------------------
	window['Asc']            = window['Asc'] || {};
	window['AscCommon']      = window['AscCommon'] || {};
	window['AscCommonWord']  = window['AscCommonWord'] || {};
	window['AscCommonSlide'] = window['AscCommonSlide'] || {};
	window['AscCommonExcel'] = window['AscCommonExcel'] || {};
	window['AscCommonDraw']  = window['AscCommonDraw'] || {};
	window['AscFormat']  = window['AscFormat'] || {};
	window['AscWord'] = window['AscWord'] || {};

	window['AscCommonDraw'].CVisioDocument = CVisioDocument;
	window['AscCommonDraw'].CWindows = CWindows;
	window['AscCommonDraw'].CMasters = CMasters;
	window['AscCommonDraw'].CMasterContents = CMasterContents;
	window['AscCommonDraw'].CPages = CPages;
	window['AscCommonDraw'].CPageContents = CPageContents;
	window['AscCommonDraw'].CComments = CComments;
	window['AscCommonDraw'].CExtensions = CExtensions;
	window['AscCommonDraw'].CDataConnections = CDataConnections;
	window['AscCommonDraw'].CDataRecordSets = CDataRecordSets;
	window['AscCommonDraw'].CValidation = CValidation;
	// Not realized, file defines schema and data of that schema
	window['AscCommonDraw'].CSolutions = CSolutions;
	window['AscCommonDraw'].CSolutionXML = CSolutionXML;
})(window, window.document);
