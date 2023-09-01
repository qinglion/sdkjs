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

		// TODO mb consider 'this'(CVisioDocument) contains parts(.xml files) like document.xml and windows.xml
		// only but not XMLmethods and call class representing document.xml VisioDocument_Type
		// this.VisioDocument_Type = null;
		this.Windows = null;
		this.Masters = null;
		this.MasterContents = [];
		this.Pages = null;
		this.PagesContents = [];
		this.Theme = null;
		this.App = null;
		this.Core = null;
		this.CustomProperties = null;
		this.Thumbnail = null;
		this.Comments = null;
		this.Extensions = null;
		this.DataConnections = null;
		this.DataRecordSets = null;

		//------------------------------------------------------------------------------------------------------------------
		//  Сохраняем ссылки на глобальные объекты
		//------------------------------------------------------------------------------------------------------------------
		this.History              = History;
		this.IdCounter            = AscCommon.g_oIdCounter;
		this.TableId              = AscCommon.g_oTableId;
		// this.CollaborativeEditing = (("undefined" !== typeof(AscCommon.CWordCollaborativeEditing) && AscCommon.CollaborativeEditing instanceof AscCommon.CWordCollaborativeEditing) ? AscCommon.CollaborativeEditing : null);
		this.Api                  = Api;
		//------------------------------------------------------------------------------------------------------------------
		//  Выставляем ссылки на главный класс
		//------------------------------------------------------------------------------------------------------------------
		if (false !== isMainLogicDocument)
		{
			// if (this.History)
			// 	this.History.Set_LogicDocument(this);
		}
		this.MainDocument = false !== isMainLogicDocument;
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
			// this.VisioDocument_Type = new AscCommonDraw.VisioDocument_Type();
			// this.VisioDocument_Type.fromXml(reader);

			parseWindows.call(this, documentPart, reader, context);
			parseMasters.call(this, documentPart, reader, context);
			parsePages.call(this, documentPart, reader, context);
			parseTheme.call(this, documentPart, reader, context);
			parseComments.call(this, documentPart, reader, context);
			parseExtensions.call(this, documentPart, reader, context);
			parseDataConnections.call(this, documentPart, reader, context);
			parseDataRecordSets.call(this, documentPart, reader, context);
		}
	};
	// TODO mb rewrite consider 'CVisioDocument' contains parts(.xml files) only but not XML
	CVisioDocument.prototype.toZip = function(zip, context) {
		let memory = new AscCommon.CMemory();
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

		for (let i = 0; i < this.MasterContents.length; i++) {
			let masterContent =  mastersPart.part.addPart(AscCommon.openXml.Types.master);
			masterContent.part.setDataXml(this.MasterContents[i], memory);
		}

		let pagesPart = docPart.part.addPart(AscCommon.openXml.Types.pages);

		for (let i = 0; i < this.PagesContents.length; i++) {
			let pageContent = pagesPart.part.addPart(AscCommon.openXml.Types.page);
			pageContent.part.setDataXml(this.PagesContents[i], memory);

			// I add page[N].xml.rels below
			// It has links to all masters but
			// in test1 file in page[N].xml.rels rId[N] states to random master[N]
			// e.g. rId3 to ../masters/master1.xml
			// here rId1 will state to master1, rId2 to master2, etc.
			// TODO check if this is important
			// in page[N].xml there is no rId used only <Shape ... Master="[ID]">
			// e. g. <Shape ... Master="1">
			for (let i = 0; i < this.MasterContents.length; i++) {
				pageContent.part.addRelationship(AscCommon.openXml.Types.masterFromPage.relationType,
					"../masters/master" + (i + 1) + ".xml");
			}
		}

		docPart.part.setDataXml(this, memory);
		appPart.part.setDataXml(this.App, memory);
		corePart.part.setDataXml(this.Core, memory);
		if (this.CustomProperties) {
			// if Custom part exists
			customPrPart.part.setDataXml(this.CustomProperties, memory);
		}
		if (this.Thumbnail) {
			thumbNailPart.part.setData(this.Thumbnail, memory);
		}
		if (this.Windows) {
			// if Windows part exists
			windowsPart.part.setDataXml(this.Windows, memory);
		}
		mastersPart.part.setDataXml(this.Masters, memory);
		pagesPart.part.setDataXml(this.Pages, memory);
		if (this.Theme) {
			// if Theme part exists (by docs it MUST exist)
			themePart.part.setDataXml(this.Theme, memory);
		}
		if (this.Comments) {
			commentsPart.part.setDataXml(this.Comments, memory);
		}
		if (this.Extensions) {
			extensionsPart.part.setDataXml(this.Extensions, memory);
		}
		if (this.DataConnections) {
			dataConnectionsPart.part.setDataXml(this.DataConnections, memory);
		}
		if (this.DataRecordSets) {
			dataRecordSetsPart.part.setDataXml(this.DataRecordSets, memory);
		}
		memory.Seek(0);
	};


	// Main classes for reading

	// Docs:
	// Windows_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/windows_type-complextypevisio-xml
	function CWindows() {
		this.clientWidth = null;
		this.clientHeight = null;
		this.window = [];
		this.xmlSpace = null;
		return this;
	}

	// Docs:
	// Masters_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/masters_type-complextypevisio-xml
	function CMasters_Type() {
		this.master = [];
		this.masterShortcut = [];
		this.xmlSpace = null;
		return this;
	}

	// Another name in docs PageContents_Type
	function CMasterContents_Type() {
		this.shapes = [];
		this.connects = [];
		this.xmlSpace = null;
		return this;
	}

	// Docs:
	// Pages_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/pages_type-complextypevisio-xml
	function CPages_Type() {
		this.page = [];
		this.xmlSpace = null;
		return this;
	}

	// Docs:
	// Элемент Shapes (PageContents_Type complexType): https://learn.microsoft.com/ru-ru/office/client-developer/visio/shapes-element-pagecontents_type-complextypevisio-xml
	// PageContents_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/pagecontents_type-complextypevisio-xml
	function CPageContents_Type() {
		this.shapes = [];
		this.connects = [];
		this.xmlSpace = null;
		return this;
	}

	// Docs:
// Comments_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/comments_type-complextypevisio-xml
	function CComments() {
		this.showCommentTags = null;
		this.authorList = [];
		this.commentList = [];
		this.xmlSpace = null;
		return this;
	}

	// Docs:
// Extensions_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/extensions_type-complextypevisio-xml
	function CExtensions() {
		this.cellDef = [];
		this.functionDef = [];
		this.sectionDef = [];
		this.xmlSpace = null;
		return this;
	}

	// Docs:
// DataConnections_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/dataconnections_type-complextypevisio-xml
	function CDataConnections() {
		this.nextID = null;
		this.dataConnection = [];
		this.xmlSpace = null;
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
		return this;
	}


	function parseApp(doc, reader, context) {
		let appPart = doc.getPartByRelationshipType(AscCommon.openXml.Types.extendedFileProperties.relationType);
		if (appPart) {
			let appContent = appPart.getDocumentContent();
			reader = new StaxParser(appContent, appPart, context);
			this.App = new AscCommon.CApp();
			this.App.fromXml(reader, true);
		}
	}

	function parseCore(doc, reader, context) {
		let corePart = doc.getPartByRelationshipType(AscCommon.openXml.Types.coreFileProperties.relationType);
		if (corePart) {
			let coreContent = corePart.getDocumentContent();
			reader = new StaxParser(coreContent, corePart, context);
			this.Core = new AscCommon.CCore();
			this.Core.fromXml(reader, true);
		}
	}

	function parseCustomProperties(doc, reader, context) {
		let customPrPart = doc.getPartByRelationshipType(AscCommon.openXml.Types.customFileProperties.relationType);
		if (customPrPart) {
			let customPrPartContent = customPrPart.getDocumentContent();
			reader = new StaxParser(customPrPartContent, customPrPart, context);
			this.CustomProperties = new AscCommon.CCustomProperties();
			this.CustomProperties.fromXml(reader, true);
		}
	}

	function parseThumbnail(doc, reader, context) {
		let thumbnailPart = doc.getPartByRelationshipType(AscCommon.openXml.Types.thumbnail.relationType);
		if (thumbnailPart) {
			let thumbnailPartContent = thumbnailPart.getDocumentContent();
			this.Thumbnail = thumbnailPartContent;
		}
	}

	function parseWindows(documentPart, reader, context) {
		let windowsPart = documentPart.getPartByRelationshipType(AscCommon.openXml.Types.visioDocumentWindows.relationType);
		if (windowsPart) {
			let contentWindows = windowsPart.getDocumentContent();
			reader = new StaxParser(contentWindows, windowsPart, context);
			this.Windows = new CWindows();
			this.Windows.fromXml(reader);
		}
	}

	function parseMasters(documentPart, reader, context) {
		let mastersPart = documentPart.getPartByRelationshipType(AscCommon.openXml.Types.masters.relationType);
		if (mastersPart) {
			let contentMasters = mastersPart.getDocumentContent();
			reader = new StaxParser(contentMasters, mastersPart, context);
			this.Masters = new CMasters_Type();
			this.Masters.fromXml(reader);

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
					let MasterContent = new CMasterContents_Type();
					MasterContent.fromXml(reader);
					this.MasterContents.push(MasterContent);
				}
			}
		}
	}

	function parsePages(documentPart, reader, context) {
		let pagesPart = documentPart.getPartByRelationshipType(AscCommon.openXml.Types.pages.relationType);
		if (pagesPart) {
			let contentPages = pagesPart.getDocumentContent();
			reader = new StaxParser(contentPages, pagesPart, context);
			this.Pages = new CPages_Type();
			this.Pages.fromXml(reader);

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
					let PageContent = new CPageContents_Type();
					PageContent.fromXml(reader);
					this.PagesContents.push(PageContent);
				}
			}
		}
	}

	function parseTheme(documentPart, reader, context) {
		let themePart = documentPart.getPartByRelationshipType(AscCommon.openXml.Types.theme.relationType);
		if (themePart) {
			let themePartContent = themePart.getDocumentContent();
			reader = new StaxParser(themePartContent, themePart, context);
			this.Theme = new AscFormat.CTheme();
			this.Theme.fromXml(reader, true);
		}
	}

	function parseComments(documentPart, reader, context) {
		let commentsPart = documentPart.getPartByRelationshipType(AscCommon.openXml.Types.visioComments.relationType);
		if (commentsPart) {
			let commentsPartContent = commentsPart.getDocumentContent();
			reader = new StaxParser(commentsPartContent, commentsPart, context);
			this.Comments = new CComments();
			this.Comments.fromXml(reader, true);
		}
	}

	function parseExtensions(documentPart, reader, context) {
		let extensionsPart = documentPart.getPartByRelationshipType(AscCommon.openXml.Types.visioExtensions.relationType);
		if (extensionsPart) {
			let extensionsPartContent = extensionsPart.getDocumentContent();
			reader = new StaxParser(extensionsPartContent, extensionsPart, context);
			this.Extensions = new CExtensions();
			this.Extensions.fromXml(reader, true);
		}
	}

	function parseDataConnections(documentPart, reader, context) {
		let dataConnectionsPart = documentPart.getPartByRelationshipType(AscCommon.openXml.Types.visioDataConnections.relationType);
		if (dataConnectionsPart) {
			let dataConnectionsPartContent = dataConnectionsPart.getDocumentContent();
			reader = new StaxParser(dataConnectionsPartContent, dataConnectionsPart, context);
			this.DataConnections = new CDataConnections();
			this.DataConnections.fromXml(reader, true);
		}
	}

	function parseDataRecordSets(documentPart, reader, context) {
		let dataRecordSetsPart = documentPart.getPartByRelationshipType(AscCommon.openXml.Types.visioDataRecordSets.relationType);
		if (dataRecordSetsPart) {
			let dataRecordSetsPartContent = dataRecordSetsPart.getDocumentContent();
			reader = new StaxParser(dataRecordSetsPartContent, dataRecordSetsPart, context);
			this.DataRecordSets = new CDataRecordSets();
			this.DataRecordSets.fromXml(reader, true);
		}
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

	window['AscCommonDraw'].CVisioDocument = CVisioDocument;
	window['AscCommonDraw'].CWindows = CWindows;
	window['AscCommonDraw'].CMasters_Type = CMasters_Type;
	window['AscCommonDraw'].CMasterContents_Type = CMasterContents_Type;
	window['AscCommonDraw'].CPages_Type = CPages_Type;
	window['AscCommonDraw'].CPageContents_Type = CPageContents_Type;
	window['AscCommonDraw'].CComments = CComments;
	window['AscCommonDraw'].CExtensions = CExtensions;
	window['AscCommonDraw'].CDataConnections = CDataConnections;
	window['AscCommonDraw'].CDataRecordSets = CDataRecordSets;
})(window, window.document);
