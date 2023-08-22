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
		this.Api = Api;

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

		// TODO mb consider 'this'(CVisioDocument) contains parts(.xml files) like document.xml and windows.xml
		// only but not XMLmethods and call class representing document.xml VisioDocument_Type
		// this.VisioDocument_Type = null;
		this.Windows = null;
		this.Masters = null;
		this.MasterContents = [];
		this.Pages = null;
		this.PagesContents = [];
		this.Theme = null;
	}


	CVisioDocument.prototype.fromZip = function(zip, context, oReadResult) {
		// Maybe it should be moved to 	sdkjs-ooxml/visio/Editor/SerializeXml.js like in 'word' case?
		// 'word' case: 								sdkjs-ooxml/word/Editor/SerializeXml.js
		context.zip = zip;

		let reader;
		let doc = new AscCommon.openXml.OpenXmlPackage(zip, null);

		// TODO Import from AscCommon (and dont forget to use(import) AscCommon theme)
		// let appPart = doc.getPartByRelationshipType(AscCommon.openXml.Types.extendedFileProperties.relationType);
		// if (appPart) {
		// 	let appContent = appPart.getDocumentContent();
		// 	reader = new StaxParser(appContent, appPart, context);
		// 	this.App = new AscCommon.CApp();
		// 	this.App.fromXml(reader, true);
		// }
		//
		// let corePart = doc.getPartByRelationshipType(AscCommon.openXml.Types.coreFileProperties.relationType);
		// if (corePart) {
		// 	let coreContent = corePart.getDocumentContent();
		// 	reader = new StaxParser(coreContent, corePart, context);
		// 	this.Core = new AscCommon.CCore();
		// 	this.Core.fromXml(reader, true);
		// }
		//
		// let customPrPart = doc.getPartByRelationshipType(AscCommon.openXml.Types.customFileProperties.relationType);
		// if (customPrPart) {
		// 	let customPrPartContent = customPrPart.getDocumentContent();
		// 	reader = new StaxParser(customPrPartContent, customPrPart, context);
		// 	this.CustomProperties = new AscCommon.CCustomProperties();
		// 	this.CustomProperties.fromXml(reader, true);
		// }

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

		}
	};
	// TODO mb rewrite consider 'CVisioDocument' contains parts(.xml files) only but not XML
	CVisioDocument.prototype.toZip = function(zip, context) {
		// let memory = new AscCommon.CMemory();
		let memory = new CMemory();
		memory.context = context;
		context.document = this;

		let filePart = new AscCommon.openXml.OpenXmlPackage(zip, memory);

		let docPart = filePart.addPart(AscCommon.openXml.Types.visioDocument);
		let windowsPart = docPart.part.addPart(AscCommon.openXml.Types.visioDocumentWindows);
		let mastersPart = docPart.part.addPart(AscCommon.openXml.Types.masters);
		// let themePart = docPart.part.addPart(AscCommon.openXml.Types.theme);

		for (let i = 0; i < this.MasterContents.length; i++) {
			let masterContent =  mastersPart.part.addPart(AscCommon.openXml.Types.master);
			masterContent.part.setDataXml(this.MasterContents[i], memory);
		}

		let pagesPart = docPart.part.addPart(AscCommon.openXml.Types.pages);

		for (let i = 0; i < this.PagesContents.length; i++) {
			let pageContent =  pagesPart.part.addPart(AscCommon.openXml.Types.page);
			pageContent.part.setDataXml(this.PagesContents[i], memory);
		}

		docPart.part.setDataXml(this, memory);
		windowsPart.part.setDataXml(this.Windows, memory);
		mastersPart.part.setDataXml(this.Masters, memory);
		pagesPart.part.setDataXml(this.Pages, memory);
		// themePart.part.setDataXml(this.Theme, memory);
		memory.Seek(0);
	};


	// Main classes for reading

	// Docs:
	// Windows_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/windows_type-complextypevisio-xml
	function CWindows() {
		this.clientWidth = null;
		this.clientHeight = null;
		this.window = [];
		return this;
	}

	// Docs:
	// Masters_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/masters_type-complextypevisio-xml
	function CMasters_Type() {
		this.master = [];
		this.masterShortcut = [];
		return this;
	}

	function CMasterContents_Type() {
		this.shapes = [];
		this.connects = [];
		return this;
	}

	// Docs:
	// Pages_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/pages_type-complextypevisio-xml
	function CPages_Type() {
		this.page = [];
		return this;
	}

	// Docs:
	// Элемент Shapes (PageContents_Type complexType): https://learn.microsoft.com/ru-ru/office/client-developer/visio/shapes-element-pagecontents_type-complextypevisio-xml
	// PageContents_Type complexType: https://learn.microsoft.com/ru-ru/office/client-developer/visio/pagecontents_type-complextypevisio-xml
	function CPageContents_Type() {
		this.shapes = [];
		this.connects = [];
		return this;
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
					let masterNumber = masters[i].uri.slice(-5)[0]; // for master3.xml we get 3
					if (!isNaN(parseFloat(masterNumber)) && !isNaN(masterNumber - 0)) {
						// if masterNumber is number
						mastersSort[masterNumber - 1] = masters[i];
					} else {
						console.log('check sdkjs/draw/model/VisioDocument.js : 138');
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
						console.log('check sdkjs/draw/model/VisioDocument.js : 261');
						pagesSort = pages;
						break;
					}
				}
				;
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
			this.theme = new AscFormat.CTheme();
			this.theme.fromXml(reader, true);
		}
	}


	//-------------------------------------------------------------export---------------------------------------------------
	window['AscCommonDraw']												= window['AscCommonDraw'] || {};
	window['AscCommonWord']												= window['AscCommonWord'] || {};
	window['AscFormat']														= window['AscFormat'] || {};

	window['AscCommonDraw'].CVisioDocument = CVisioDocument;
	window['AscCommonDraw'].CWindows = CWindows;
	window['AscCommonDraw'].CMasters_Type = CMasters_Type;
	window['AscCommonDraw'].CMasterContents_Type = CMasterContents_Type;
	window['AscCommonDraw'].CPages_Type = CPages_Type;
	window['AscCommonDraw'].CPageContents_Type = CPageContents_Type;


	//Copied from sdkjs/common/Drawings/Metafile.js
	function CMemory(bIsNoInit)
	{
		this.Init = function()
		{
			var _canvas = document.createElement('canvas');
			var _ctx    = _canvas.getContext('2d');
			this.len    = 1024 * 1024 * 5;
			this.ImData = _ctx.createImageData(this.len / 4, 1);
			this.data   = this.ImData.data;
			this.pos    = 0;
		}

		this.ImData = null;
		this.data   = null;
		this.len    = 0;
		this.pos    = 0;

		this.context = null;

		if (true !== bIsNoInit)
			this.Init();

		this.Copy = function(oMemory, nPos, nLen)
		{
			for (var Index = 0; Index < nLen; Index++)
			{
				this.CheckSize(1);
				this.data[this.pos++] = oMemory.data[Index + nPos];
			}
		};

		this.CheckSize          = function(count)
		{
			if (this.pos + count >= this.len)
			{
				var _canvas = document.createElement('canvas');
				var _ctx    = _canvas.getContext('2d');

				var oldImData = this.ImData;
				var oldData   = this.data;
				var oldPos    = this.pos;

				this.len = Math.max(this.len * 2, this.pos + ((3 * count / 2) >> 0));

				this.ImData = _ctx.createImageData(this.len / 4, 1);
				this.data   = this.ImData.data;
				var newData = this.data;

				for (var i = 0; i < this.pos; i++)
					newData[i] = oldData[i];
			}
		}
		this.GetBase64Memory    = function()
		{
			return AscCommon.Base64.encode(this.data, 0, this.pos);
		}
		this.GetBase64Memory2   = function(nPos, nLen)
		{
			return AscCommon.Base64.encode(this.data, nPos, nLen);
		}
		this.GetData   = function(nPos, nLen)
		{
			var _canvas = document.createElement('canvas');
			var _ctx    = _canvas.getContext('2d');

			var len = this.GetCurPosition();

			//todo ImData.data.length multiple of 4
			var ImData = _ctx.createImageData(Math.ceil(len / 4), 1);
			var res = ImData.data;

			for (var i = 0; i < len; i++)
				res[i] = this.data[i];
			return res;
		}
		this.GetDataUint8   = function(pos, len)
		{
			if (undefined === pos) {
				pos = 0;
			}
			if (undefined === len) {
				len = this.GetCurPosition() - pos;
			}
			return this.data.slice(pos, pos + len);
		}
		this.GetCurPosition     = function()
		{
			return this.pos;
		}
		this.Seek               = function(nPos)
		{
			this.pos = nPos;
		}
		this.Skip               = function(nDif)
		{
			this.pos += nDif;
		}
		this.WriteWithLen = function(_this, callback)
		{
			let oldPos = this.GetCurPosition();
			this.WriteULong(0);
			callback.call(_this, this);
			let curPos = this.GetCurPosition();
			let len = curPos - oldPos;
			this.Seek(oldPos);
			this.WriteULong(len - 4);
			this.Seek(curPos);
			return len;
		};
		this.WriteBool          = function(val)
		{
			this.CheckSize(1);
			if (false == val)
				this.data[this.pos++] = 0;
			else
				this.data[this.pos++] = 1;
		}
		this.WriteByte          = function(val)
		{
			this.CheckSize(1);
			this.data[this.pos++] = val;
		}
		this.WriteSByte         = function(val)
		{
			this.CheckSize(1);
			if (val < 0)
				val += 256;
			this.data[this.pos++] = val;
		}
		this.WriteShort          = function(val)
		{
			this.CheckSize(2);
			this.data[this.pos++] = (val) & 0xFF;
			this.data[this.pos++] = (val >>> 8) & 0xFF;
		}
		this.WriteUShort          = function(val)
		{
			this.WriteShort(AscFonts.FT_Common.UShort_To_Short(val));
		}
		this.WriteLong          = function(val)
		{
			this.CheckSize(4);
			this.data[this.pos++] = (val) & 0xFF;
			this.data[this.pos++] = (val >>> 8) & 0xFF;
			this.data[this.pos++] = (val >>> 16) & 0xFF;
			this.data[this.pos++] = (val >>> 24) & 0xFF;
		}
		this.WriteULong          = function(val)
		{
			this.WriteLong(AscFonts.FT_Common.UintToInt(val));
		}
		this.WriteDouble        = function(val)
		{
			this.CheckSize(4);
			var lval              = ((val * 100000) >> 0) & 0xFFFFFFFF; // спасаем пять знаков после запятой.
			this.data[this.pos++] = (lval) & 0xFF;
			this.data[this.pos++] = (lval >>> 8) & 0xFF;
			this.data[this.pos++] = (lval >>> 16) & 0xFF;
			this.data[this.pos++] = (lval >>> 24) & 0xFF;
		}
		var tempHelp = new ArrayBuffer(8);
		var tempHelpUnit = new Uint8Array(tempHelp);
		var tempHelpFloat = new Float64Array(tempHelp);
		this.WriteDouble2       = function(val)
		{
			this.CheckSize(8);
			tempHelpFloat[0] = val;
			this.data[this.pos++] = tempHelpUnit[0];
			this.data[this.pos++] = tempHelpUnit[1];
			this.data[this.pos++] = tempHelpUnit[2];
			this.data[this.pos++] = tempHelpUnit[3];
			this.data[this.pos++] = tempHelpUnit[4];
			this.data[this.pos++] = tempHelpUnit[5];
			this.data[this.pos++] = tempHelpUnit[6];
			this.data[this.pos++] = tempHelpUnit[7];
		}
		this._doubleEncodeLE754 = function(v)
		{
			//код взят из jspack.js на основе стандарта Little-endian N-bit IEEE 754 floating point
			var s, e, m, i, d, c, mLen, eLen, eBias, eMax;
			var el = {len : 8, mLen : 52, rt : 0};
			mLen = el.mLen, eLen = el.len * 8 - el.mLen - 1, eMax = (1 << eLen) - 1, eBias = eMax >> 1;

			s = v < 0 ? 1 : 0;
			v = Math.abs(v);
			if (isNaN(v) || (v == Infinity))
			{
				m = isNaN(v) ? 1 : 0;
				e = eMax;
			}
			else
			{
				e = Math.floor(Math.log(v) / Math.LN2);            // Calculate log2 of the value
				if (v * (c = Math.pow(2, -e)) < 1)
				{
					e--;
					c *= 2;
				}        // Math.log() isn't 100% reliable

				// Round by adding 1/2 the significand's LSD
				if (e + eBias >= 1)
				{
					v += el.rt / c;
				}            // Normalized:  mLen significand digits
				else
				{
					v += el.rt * Math.pow(2, 1 - eBias);
				}         // Denormalized:  <= mLen significand digits
				if (v * c >= 2)
				{
					e++;
					c /= 2;
				}                // Rounding can increment the exponent

				if (e + eBias >= eMax)
				{
					// Overflow
					m = 0;
					e = eMax;
				}
				else if (e + eBias >= 1)
				{
					// Normalized - term order matters, as Math.pow(2, 52-e) and v*Math.pow(2, 52) can overflow
					m = (v * c - 1) * Math.pow(2, mLen);
					e = e + eBias;
				}
				else
				{
					// Denormalized - also catches the '0' case, somewhat by chance
					m = v * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
					e = 0;
				}
			}
			var a = new Array(8);
			for (i = 0, d = 1; mLen >= 8; a[i] = m & 0xff, i += d, m /= 256, mLen -= 8);
			for (e = (e << mLen) | m, eLen += mLen; eLen > 0; a[i] = e & 0xff, i += d, e /= 256, eLen -= 8);
			a[i - d] |= s * 128;
			return a;
		}
		this.WriteStringBySymbol = function(code)
		{
			if (code < 0xFFFF)
			{
				this.CheckSize(4);
				this.data[this.pos++] = 1;
				this.data[this.pos++] = 0;
				this.data[this.pos++] = code & 0xFF;
				this.data[this.pos++] = (code >>> 8) & 0xFF;
			}
			else
			{
				this.CheckSize(6);
				this.data[this.pos++] = 2;
				this.data[this.pos++] = 0;

				var codePt = code - 0x10000;
				var c1 = 0xD800 | (codePt >> 10);
				var c2 = 0xDC00 | (codePt & 0x3FF);
				this.data[this.pos++] = c1 & 0xFF;
				this.data[this.pos++] = (c1 >>> 8) & 0xFF;
				this.data[this.pos++] = c2 & 0xFF;
				this.data[this.pos++] = (c2 >>> 8) & 0xFF;
			}
		}
		this.WriteString        = function(text)
		{
			if ("string" != typeof text)
				text = text + "";

			var count = text.length & 0xFFFF;
			this.CheckSize(2 * count + 2);
			this.data[this.pos++] = count & 0xFF;
			this.data[this.pos++] = (count >>> 8) & 0xFF;
			for (var i = 0; i < count; i++)
			{
				var c                 = text.charCodeAt(i) & 0xFFFF;
				this.data[this.pos++] = c & 0xFF;
				this.data[this.pos++] = (c >>> 8) & 0xFF;
			}
		}
		this.WriteString2       = function(text)
		{
			if ("string" != typeof text)
				text = text + "";

			var count      = text.length & 0x7FFFFFFF;
			var countWrite = 2 * count;
			this.WriteLong(countWrite);
			this.CheckSize(countWrite);
			for (var i = 0; i < count; i++)
			{
				var c                 = text.charCodeAt(i) & 0xFFFF;
				this.data[this.pos++] = c & 0xFF;
				this.data[this.pos++] = (c >>> 8) & 0xFF;
			}
		}
		this.WriteString3       = function(text)
		{
			if ("string" != typeof text)
				text = text + "";

			var count      = text.length & 0x7FFFFFFF;
			var countWrite = 2 * count;
			this.CheckSize(countWrite);
			for (var i = 0; i < count; i++)
			{
				var c                 = text.charCodeAt(i) & 0xFFFF;
				this.data[this.pos++] = c & 0xFF;
				this.data[this.pos++] = (c >>> 8) & 0xFF;
			}
		}
		this.WriteString4       = function(text)
		{
			if ("string" != typeof text)
				text = text + "";

			var count      = text.length & 0x7FFFFFFF;
			this.WriteLong(count);
			this.CheckSize(2 * count);
			for (var i = 0; i < count; i++)
			{
				var c                 = text.charCodeAt(i) & 0xFFFF;
				this.data[this.pos++] = c & 0xFF;
				this.data[this.pos++] = (c >>> 8) & 0xFF;
			}
		}
		this.WriteStringA = function(text)
		{
			var count = text.length & 0xFFFF;
			this.WriteULong(count);
			this.CheckSize(count);
			for (var i=0;i<count;i++)
			{
				var c = text.charCodeAt(i) & 0xFF;
				this.data[this.pos++] = c;
			}
		};
		this.ClearNoAttack      = function()
		{
			this.pos = 0;
		}

		this.WriteLongAt = function(_pos, val)
		{
			this.data[_pos++] = (val) & 0xFF;
			this.data[_pos++] = (val >>> 8) & 0xFF;
			this.data[_pos++] = (val >>> 16) & 0xFF;
			this.data[_pos++] = (val >>> 24) & 0xFF;
		}

		this.WriteBuffer = function(data, _pos, count)
		{
			this.CheckSize(count);
			for (var i = 0; i < count; i++)
			{
				this.data[this.pos++] = data[_pos + i];
			}
		}

		this.WriteUtf8Char = function(code)
		{
			this.CheckSize(1);
			if (code < 0x80) {
				this.data[this.pos++] = code;
			}
			else if (code < 0x0800) {
				this.data[this.pos++] = (0xC0 | (code >> 6));
				this.data[this.pos++] = (0x80 | (code & 0x3F));
			}
			else if (code < 0x10000) {
				this.data[this.pos++] = (0xE0 | (code >> 12));
				this.data[this.pos++] = (0x80 | ((code >> 6) & 0x3F));
				this.data[this.pos++] = (0x80 | (code & 0x3F));
			}
			else if (code < 0x1FFFFF) {
				this.data[this.pos++] = (0xF0 | (code >> 18));
				this.data[this.pos++] = (0x80 | ((code >> 12) & 0x3F));
				this.data[this.pos++] = (0x80 | ((code >> 6) & 0x3F));
				this.data[this.pos++] = (0x80 | (code & 0x3F));
			}
			else if (code < 0x3FFFFFF) {
				this.data[this.pos++] = (0xF8 | (code >> 24));
				this.data[this.pos++] = (0x80 | ((code >> 18) & 0x3F));
				this.data[this.pos++] = (0x80 | ((code >> 12) & 0x3F));
				this.data[this.pos++] = (0x80 | ((code >> 6) & 0x3F));
				this.data[this.pos++] = (0x80 | (code & 0x3F));
			}
			else if (code < 0x7FFFFFFF) {
				this.data[this.pos++] = (0xFC | (code >> 30));
				this.data[this.pos++] = (0x80 | ((code >> 24) & 0x3F));
				this.data[this.pos++] = (0x80 | ((code >> 18) & 0x3F));
				this.data[this.pos++] = (0x80 | ((code >> 12) & 0x3F));
				this.data[this.pos++] = (0x80 | ((code >> 6) & 0x3F));
				this.data[this.pos++] = (0x80 | (code & 0x3F));
			}
		};

		this.WriteXmlString = function(val)
		{
			var pCur = 0;
			var pEnd = val.length;
			while (pCur < pEnd)
			{
				var code = val.charCodeAt(pCur++);
				if (code >= 0xD800 && code <= 0xDFFF && pCur < pEnd)
				{
					code = 0x10000 + (((code & 0x3FF) << 10) | (0x03FF & val.charCodeAt(pCur++)));
				}
				this.WriteUtf8Char(code);
			}
		};
		this.WriteXmlStringEncode = function(val)
		{
			var pCur = 0;
			var pEnd = val.length;
			while (pCur < pEnd)
			{
				var code = val.charCodeAt(pCur++);
				if (code >= 0xD800 && code <= 0xDFFF && pCur < pEnd)
				{
					code = 0x10000 + (((code & 0x3FF) << 10) | (0x03FF & val.charCodeAt(pCur++)));
				}
				this.WriteXmlCharCode(code);
			}
		};
		this.WriteXmlCharCode = function(code)
		{
			switch (code)
			{
				case 0x26:
					//&
					this.WriteUtf8Char(0x26);
					this.WriteUtf8Char(0x61);
					this.WriteUtf8Char(0x6d);
					this.WriteUtf8Char(0x70);
					this.WriteUtf8Char(0x3b);
					break;
				case 0x27:
					//'
					this.WriteUtf8Char(0x26);
					this.WriteUtf8Char(0x61);
					this.WriteUtf8Char(0x70);
					this.WriteUtf8Char(0x6f);
					this.WriteUtf8Char(0x73);
					this.WriteUtf8Char(0x3b);
					break;
				case 0x3c:
					//<
					this.WriteUtf8Char(0x26);
					this.WriteUtf8Char(0x6c);
					this.WriteUtf8Char(0x74);
					this.WriteUtf8Char(0x3b);
					break;
				case 0x3e:
					//>
					this.WriteUtf8Char(0x26);
					this.WriteUtf8Char(0x67);
					this.WriteUtf8Char(0x74);
					this.WriteUtf8Char(0x3b);
					break;
				case 0x22:
					//"
					this.WriteUtf8Char(0x26);
					this.WriteUtf8Char(0x71);
					this.WriteUtf8Char(0x75);
					this.WriteUtf8Char(0x6f);
					this.WriteUtf8Char(0x74);
					this.WriteUtf8Char(0x3b);
					break;
				default:
					this.WriteUtf8Char(code);
					break;
			}
		};
		this.WriteXmlBool = function(val)
		{
			this.WriteXmlString(val ? '1' : '0');
		};
		this.WriteXmlByte = function(val)
		{
			this.WriteXmlInt(val);
		};
		this.WriteXmlSByte = function(val)
		{
			this.WriteXmlInt(val);
		};
		this.WriteXmlInt = function(val)
		{
			this.WriteXmlString(val.toFixed(0));
		};
		this.WriteXmlUInt = function(val)
		{
			this.WriteXmlInt(val);
		};
		this.WriteXmlInt64 = function(val)
		{
			this.WriteXmlInt(val);
		};
		this.WriteXmlUInt64 = function(val)
		{
			this.WriteXmlInt(val);
		};
		this.WriteXmlDouble = function(val)
		{
			this.WriteXmlNumber(val);
		};
		this.WriteXmlNumber = function(val)
		{
			this.WriteXmlString(val.toString());
		};
		this.WriteXmlNodeStart = function(name)
		{
			this.WriteUtf8Char(0x3c);
			this.WriteXmlString(name);
		};
		this.WriteXmlNodeEnd = function(name)
		{
			this.WriteUtf8Char(0x3c);
			this.WriteUtf8Char(0x2f);
			this.WriteXmlString(name);
			this.WriteUtf8Char(0x3e);
		};
		this.WriteXmlNodeWithText = function(name, text)
		{
			this.WriteXmlNodeStart(name);
			this.WriteXmlAttributesEnd(false);
			if (text)
				this.WriteXmlStringEncode(text.toString());
			this.WriteXmlNodeEnd(name);
		};
		this.WriteXmlAttributesEnd = function(isEnd)
		{
			if (isEnd)
				this.WriteUtf8Char(0x2f);
			this.WriteUtf8Char(0x3e);
		};
		this.WriteXmlAttributeString = function(name, val)
		{
			this.WriteUtf8Char(0x20);
			this.WriteXmlString(name);
			this.WriteUtf8Char(0x3d);
			this.WriteUtf8Char(0x22);
			this.WriteXmlString(val.toString());
			this.WriteUtf8Char(0x22);
		};
		this.WriteXmlAttributeStringEncode = function(name, val)
		{
			this.WriteUtf8Char(0x20);
			this.WriteXmlString(name);
			this.WriteUtf8Char(0x3d);
			this.WriteUtf8Char(0x22);
			this.WriteXmlStringEncode(val.toString());
			this.WriteUtf8Char(0x22);
		};
		this.WriteXmlAttributeBool = function(name, val)
		{
			this.WriteXmlAttributeString(name, val ? '1' : '0');
		};
		this.WriteXmlAttributeByte = function(name, val)
		{
			this.WriteXmlAttributeInt(name, val);
		};
		this.WriteXmlAttributeSByte = function(name, val)
		{
			this.WriteXmlAttributeInt(name, val);
		};
		this.WriteXmlAttributeInt = function(name, val)
		{
			this.WriteXmlAttributeString(name, val.toFixed(0));
		};
		this.WriteXmlAttributeUInt = function(name, val)
		{
			this.WriteXmlAttributeInt(name, val);
		};
		this.WriteXmlAttributeInt64 = function(name, val)
		{
			this.WriteXmlAttributeInt(name, val);
		};
		this.WriteXmlAttributeUInt64 = function(name, val)
		{
			this.WriteXmlAttributeInt(name, val);
		};
		this.WriteXmlAttributeDouble = function(name, val)
		{
			this.WriteXmlAttributeNumber(name, val);
		};
		this.WriteXmlAttributeNumber = function(name, val)
		{
			this.WriteXmlAttributeString(name, val.toString());
		};
		this.WriteXmlNullable = function(val, name)
		{
			if (val) {
				val.toXml(this, name);
			}
		};
		//пересмотреть, куча аргументов
		this.WriteXmlArray = function(val, name, opt_parentName, needWriteCount, ns, childns)
		{
			if (!ns) {
				ns = "";
			}
			if (!childns) {
				childns = "";
			}
			if(val && val.length > 0) {
				if(opt_parentName) {
					this.WriteXmlNodeStart(ns + opt_parentName);
					if (needWriteCount) {
						this.WriteXmlNullableAttributeNumber("count", val.length);
					}
					this.WriteXmlAttributesEnd();
				}
				val.forEach(function(elem, index){
					elem.toXml(this, name, childns, childns, index);
				}, this);
				if(opt_parentName) {
					this.WriteXmlNodeEnd(ns + opt_parentName);
				}
			}
		};
		this.WriteXmlNullableAttributeString = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlAttributeString(name, val)
			}
		};
		this.WriteXmlNullableAttributeStringEncode = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlAttributeStringEncode(name, val)
			}
		};
		this.WriteXmlNonEmptyAttributeStringEncode = function(name, val)
		{
			if (val) {
				this.WriteXmlAttributeStringEncode(name, val)
			}
		};
		this.WriteXmlNullableAttributeBool = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlAttributeBool(name, val)
			}
		};
		this.WriteXmlNullableAttributeBool2 = function(name, val)
		{
			//добавлюя по аналогии с x2t
			if (null !== val && undefined !== val) {
				this.WriteXmlNullableAttributeString(name, val ? "1": "0")
			}
		};
		this.WriteXmlNullableAttributeByte = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlAttributeByte(name, val)
			}
		};
		this.WriteXmlNullableAttributeSByte = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlAttributeSByte(name, val)
			}
		};
		this.WriteXmlNullableAttributeInt = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlAttributeInt(name, val)
			}
		};
		this.WriteXmlNullableAttributeUInt = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlAttributeUInt(name, val)
			}
		};
		this.WriteXmlNullableAttributeInt64 = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlAttributeInt64(name, val)
			}
		};
		this.WriteXmlNullableAttributeUInt64 = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlAttributeUInt64(name, val)
			}
		};
		this.WriteXmlNullableAttributeDouble = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlAttributeDouble(name, val)
			}
		};
		this.WriteXmlNullableAttributeNumber = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlAttributeNumber(name, val)
			}
		};
		this.WriteXmlNullableAttributeIntWithKoef = function(name, val, koef)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlAttributeInt(name, val * koef)
			}
		};
		this.WriteXmlNullableAttributeUIntWithKoef = function(name, val, koef)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlAttributeUInt(name, val * koef)
			}
		};
		this.WriteXmlAttributeBoolIfTrue = function(name, val)
		{
			if (val) {
				this.WriteXmlAttributeBool(name, val)
			}
		};
		this.WriteXmlValueString = function(name, val)
		{
			this.WriteXmlNodeStart(name);
			this.WriteXmlAttributesEnd();
			this.WriteXmlString(val.toString());
			this.WriteXmlNodeEnd(name);
		};
		this.WriteXmlValueStringEncode = function(name, val)
		{
			this.WriteXmlNodeStart(name);
			this.WriteXmlAttributeString("xml:space", "preserve");
			this.WriteXmlAttributesEnd();
			this.WriteXmlStringEncode(val.toString());
			this.WriteXmlNodeEnd(name);
		};
		this.WriteXmlValueStringEncode2 = function(name, val)
		{
			this.WriteXmlNodeStart(name);
			this.WriteXmlAttributesEnd();
			this.WriteXmlStringEncode(val.toString());
			this.WriteXmlNodeEnd(name);
		};
		this.WriteXmlValueBool = function(name, val)
		{
			this.WriteXmlNodeStart(name);
			this.WriteXmlAttributesEnd();
			this.WriteXmlBool(val);
			this.WriteXmlNodeEnd(name);
		};
		this.WriteXmlValueByte = function(name, val)
		{
			this.WriteXmlNodeStart(name);
			this.WriteXmlAttributesEnd();
			this.WriteXmlByte(val);
			this.WriteXmlNodeEnd(name);
		};
		this.WriteXmlValueSByte = function(name, val)
		{
			this.WriteXmlNodeStart(name);
			this.WriteXmlAttributesEnd();
			this.WriteXmlSByte(val);
			this.WriteXmlNodeEnd(name);
		};
		this.WriteXmlValueInt = function(name, val)
		{
			this.WriteXmlNodeStart(name);
			this.WriteXmlAttributesEnd();
			this.WriteXmlInt(val);
			this.WriteXmlNodeEnd(name);
		};
		this.WriteXmlValueUInt = function(name, val)
		{
			this.WriteXmlNodeStart(name);
			this.WriteXmlAttributesEnd();
			this.WriteXmlUInt(val);
			this.WriteXmlNodeEnd(name);
		};
		this.WriteXmlValueInt64 = function(name, val)
		{
			this.WriteXmlNodeStart(name);
			this.WriteXmlAttributesEnd();
			this.WriteXmlInt64(val);
			this.WriteXmlNodeEnd(name);
		};
		this.WriteXmlValueUInt64 = function(name, val)
		{
			this.WriteXmlNodeStart(name);
			this.WriteXmlAttributesEnd();
			this.WriteXmlUInt64(val);
			this.WriteXmlNodeEnd(name);
		};
		this.WriteXmlValueDouble = function(name, val)
		{
			this.WriteXmlNodeStart(name);
			this.WriteXmlAttributesEnd();
			this.WriteXmlDouble(val);
			this.WriteXmlNodeEnd(name);
		};
		this.WriteXmlValueNumber = function(name, val)
		{
			this.WriteXmlNodeStart(name);
			this.WriteXmlAttributesEnd();
			this.WriteXmlNumber(val);
			this.WriteXmlNodeEnd(name);
		};
		this.WriteXmlNullableValueString = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlValueString(name, val)
			}
		};
		this.WriteXmlNullableValueStringEncode = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlValueStringEncode(name, val)
			}
		};
		this.WriteXmlNullableValueStringEncode2 = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlValueStringEncode2(name, val)
			}
		};
		this.WriteXmlNullableValueBool = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlValueBool(name, val)
			}
		};
		this.WriteXmlNullableValueByte = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlValueByte(name, val)
			}
		};
		this.WriteXmlNullableValueSByte = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlValueSByte(name, val)
			}
		};
		this.WriteXmlNullableValueInt = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlValueInt(name, val)
			}
		};
		this.WriteXmlNullableValueUInt = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlValueUInt(name, val)
			}
		};
		this.WriteXmlNullableValueInt64 = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlValueInt64(name, val)
			}
		};
		this.WriteXmlNullableValueUInt64 = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlValueUInt64(name, val)
			}
		};
		this.WriteXmlNullableValueDouble = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlValueDouble(name, val)
			}
		};
		this.WriteXmlNullableValueNumber = function(name, val)
		{
			if (null !== val && undefined !== val) {
				this.WriteXmlValueNumber(name, val)
			}
		};
		this.XlsbStartRecord = function(type, len) {
			//Type
			if (type < 0x80) {
				this.WriteByte(type);
			}
			else {
				this.WriteByte((type & 0x7F) | 0x80);
				this.WriteByte(type >> 7);
			}
			//Len
			for (var i = 0; i < 4; ++i) {
				var part = len & 0x7F;
				len = len >> 7;
				if (len === 0) {
					this.WriteByte(part);
					break;
				}
				else {
					this.WriteByte(part | 0x80);
				}
			}
		};
		this.XlsbEndRecord = function() {
		};
		//все аргументы сохраняю как в x2t, ns - префикс пока не использую
		this.WritingValNode = function(ns, name, val) {
			this.WriteXmlNodeStart(name);
			this.WriteXmlAttributeString("val", val);
			this.WriteXmlAttributesEnd(true);
		};
		this.WritingValNodeEncodeXml = function(ns, name, val) {
			this.WriteXmlNodeStart(name);
			this.WriteXmlNullableAttributeStringEncode("val", val);
			this.WriteXmlAttributesEnd(true);
		};
		this.WritingValNodeIf = function(ns, name, cond, val) {
			this.WriteXmlNodeStart(name);
			if (cond) {
				this.WriteXmlAttributeString("val", val);
			}
			this.WriteXmlAttributesEnd(true);
		};
		this.WriteXmlHeader = function()
		{
			this.WriteXmlString("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n");
		};
		this.WriteXmlRelationshipsNS = function()
		{
			this.WriteXmlAttributeString("xmlns:r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships");
		};
	}



})(window, window.document);
