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
	 *
	 * @param config
	 * @constructor
	 * @extends {AscCommon.baseEditorsApi}
	 */
	function asc_docs_api(config)
	{
		AscCommon.baseEditorsApi.call(this, config, AscCommon.c_oEditorId.Draw);

		this.Document = null;
		this.HtmlElement = null;
		this.canvas = null;

		this._init();
		return this;
	}

	asc_docs_api.prototype = Object.create(AscCommon.baseEditorsApi.prototype);
	asc_docs_api.prototype.constructor = asc_docs_api;

	asc_docs_api.prototype.InitEditor = function(){
		this.Document = new AscCommonDraw.CVisioDocument(this, this.WordControl.m_oDrawingDocument);

		this.WordControl.m_oLogicDocument = this.Document;
		this.WordControl.m_oDrawingDocument.m_oLogicDocument = this.WordControl.m_oLogicDocument;
	};
	asc_docs_api.prototype._onEndLoadSdk  = function()
	{
		AscCommon.baseEditorsApi.prototype._onEndLoadSdk.call(this);

		this.CreateComponents();
	};
	asc_docs_api.prototype.CreateComponents = function()
	{
		window.editor = this;

		//stubs for html page
		window.CLayoutThumbnailDrawer = function () {};
		window.CMasterThumbnailDrawer = function () {};
		this.WordControl  = new AscCommonSlide.CEditorPage(this);
		if (this.HtmlElement != null)
			this.HtmlElement.innerHTML = ("<div id=\"id_main\" class=\"block_elem\" style=\"width:100%;height:100%;touch-action:none;-ms-touch-action: none;-moz-user-select:none;-khtml-user-select:none;user-select:none;background-color:" + AscCommon.GlobalSkin.BackgroundColor + ";overflow:hidden;\" UNSELECTABLE=\"on\">\
                                    <div id=\"id_main_view\" class=\"block_elem\" style=\"width:100%;height:100%;touch-action:none;overflow:hidden\">\
                                        <canvas id=\"id_viewer\" class=\"block_elem\" style=\"width:100%;height:100%;touch-action:none;-ms-touch-action: none;-webkit-user-select: none; background-color:" + AscCommon.GlobalSkin.BackgroundColor + ";z-index:1\"></canvas>\
									    <canvas id=\"id_viewer_overlay\" class=\"block_elem\" style=\"touch-action:none;-ms-touch-action: none;-webkit-user-select: none; z-index:2\"></canvas>\
									    <div id=\"id_target_cursor\" class=\"block_elem\" width=\"1\" height=\"1\" style=\"touch-action:none;-ms-touch-action: none;-webkit-user-select: none;width:2px;height:13px;z-index:4;\"></div>\
                                    </div>\
									</div>" + this.HtmlElement.innerHTML);
		this.canvas = document.getElementById("id_viewer");
	};

	asc_docs_api.prototype.OpenDocumentFromZip = function(data)
	{
		return this.OpenDocumentFromZipNoInit(data);
	};
	asc_docs_api.prototype.OpenDocumentFromZipNoInit = function(data)
	{
		if (!data) {
			return false;
		}
		let xmlParserContext = new AscCommon.XmlParserContext();

		let jsZlib = new AscCommon.ZLib();
		if (!jsZlib.open(data)) {
			return false;
		}

		this.InitEditor();
		this.Document.fromZip(jsZlib, xmlParserContext);

		jsZlib.close();
		return true;
	};
	asc_docs_api.prototype.asc_CloseFile            = function()
	{
		AscCommon.History.Clear();
		AscCommon.g_oTableId.Clear();
		AscCommon.g_oIdCounter.Clear();
		this.isApplyChangesOnOpenEnabled = true;
		this.isDocumentLoadComplete = false;
		this.turnOffSpecialModes();
	};
	// Callbacks
	/* все имена callback'оф начинаются с On. Пока сделаны:
	 */
	var _callbacks = {};

	asc_docs_api.prototype.asc_registerCallback = function(name, callback)
	{
		if (!_callbacks.hasOwnProperty(name))
			_callbacks[name] = [];
		_callbacks[name].push(callback);
	};
	asc_docs_api.prototype.asc_nativeOpenFile = function(base64File, version)
	{
		// this.SpellCheckUrl = '';
		//
		// this.User = new AscCommon.asc_CUser();
		// this.User.setId("TM");
		// this.User.setUserName("native");

		this.InitEditor();

		AscCommon.g_oIdCounter.Set_Load(true);

		this.InitEditor();

		this.isOpenOOXInBrowser = this["asc_isSupportFeature"]("ooxml") && AscCommon.checkOOXMLSignature(base64File);
		if (this.isOpenOOXInBrowser) {
			//slice because array contains garbage after end of function
			this.openOOXInBrowserZip = base64File.slice();
			this.OpenDocumentFromZipNoInit(base64File);
		}

		this.LoadedObject = 1;
		AscCommon.g_oIdCounter.Set_Load(false);
	};

	asc_docs_api.prototype.asc_nativeApplyChanges2 = function(data, isFull)
	{
		// Чтобы заново созданные параграфы не отображались залоченными
		AscCommon.g_oIdCounter.Set_Load(true);
		//todo

		AscCommon.g_oIdCounter.Set_Load(false);
	};

	asc_docs_api.prototype.asc_nativeGetFileData = function()
	{
		if (this.isOpenOOXInBrowser && this.saveDocumentToZip) {
			let res;
			this.saveDocumentToZip(this.Document, this.editorId, function (data) {
				res = data;
			});
			if (res) {
				window["native"] && window["native"]["Save_End"] && window["native"]["Save_End"](";v10;", res.length);
				return res;
			}
			return new Uint8Array(0);
		}
	};

	//-------------------------------------------------------------export---------------------------------------------------
	window['Asc']                                                       = window['Asc'] || {};
	window['Asc']['asc_docs_api']                                       = asc_docs_api;
	asc_docs_api.prototype['OpenDocumentFromZip']             			= asc_docs_api.prototype.OpenDocumentFromZip;
	asc_docs_api.prototype['asc_nativeOpenFile']             			= asc_docs_api.prototype.asc_nativeOpenFile;
	asc_docs_api.prototype['asc_nativeApplyChanges2']             		= asc_docs_api.prototype.asc_nativeApplyChanges2;
	asc_docs_api.prototype['asc_nativeGetFileData']             		= asc_docs_api.prototype.asc_nativeGetFileData;

})(window, window.document);
