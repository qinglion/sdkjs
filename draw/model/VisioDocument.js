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
	function CVisioDocument(Api, isMainLogicDocument) {
		this.Api = Api;

		this.DocumentSettings = null;
		this.Colors = [];
		this.FaceNames = [];
		this.StyleSheets = [];
		this.DocumentSheet = null;
		this.EventList = [];
		this.HeaderFooter = null;
		this.PublishSettings = null;
		this.Any = null;
		this.AnyAttr = null;
	}

	CVisioDocument.prototype.fromZip = function(zip, context, oReadResult) {
		// Maybe it should be moved to 	sdkjs-ooxml/visio/Editor/SerializeXml.js like in 'word' case?
		// 'word' case: 								sdkjs-ooxml/word/Editor/SerializeXml.js
		context.zip = zip;

		let reader;
		let doc = new AscCommon.openXml.OpenXmlPackage(zip, null);

		// handle appPart and CorePart like in 'word' case

		let documentPart = doc.getPartByRelationshipType(AscCommon.openXml.Types.visioDocument.relationType);
		if (documentPart) {
			let contentDocument = documentPart.getDocumentContent();
			reader = new StaxParser(contentDocument, documentPart, context);
			this.fromXml(reader);
		}

		let windowsPart = documentPart.getPartByRelationshipType(AscCommon.openXml.Types.visioDocumentWindows.relationType);
		if (windowsPart) {
			let contentWindows = windowsPart.getDocumentContent();
			reader = new StaxParser(contentWindows, windowsPart, context);
			this.Windows = new AscCommonDraw.CWindows();
			this.Windows.fromXml(reader);
		}

		let pagesPart = documentPart.getPartByRelationshipType(AscCommon.openXml.Types.pages.relationType);
		if (pagesPart) {
			let contentPages = pagesPart.getDocumentContent();
			reader = new StaxParser(contentPages, pagesPart, context);
			this.Windows = new AscCommonDraw.CWindows();
			this.Windows.fromXml(reader);
		}
	};
	CVisioDocument.prototype.toZip = function(zip, context) {
		let memory = new AscCommon.CMemory();
		memory.context = context;
		context.document = this;

		let filePart = new AscCommon.openXml.OpenXmlPackage(zip, memory);

		let docPart = filePart.addPart(AscCommon.openXml.Types.visioDocument);
		docPart.part.setDataXml(this, memory);
		memory.Seek(0);
	};

	//-------------------------------------------------------------export---------------------------------------------------
	window['AscCommonDraw']												= window['AscCommonDraw'] || {};
	window['AscCommonWord']												= window['AscCommonWord'] || {};

	window['AscCommonDraw'].CVisioDocument = CVisioDocument;
	
})(window, window.document);
