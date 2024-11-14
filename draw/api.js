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
	const c_oAscFontRenderingModeType = Asc.c_oAscFontRenderingModeType;

	/**
	 *
	 * @param config
	 * @constructor
	 * @extends {AscCommon.baseEditorsApi}
	 */
	function asc_docs_api(config)
	{
		AscCommon.baseEditorsApi.call(this, config, AscCommon.c_oEditorId.Draw);

		/**
		 *
		 * @type {CVisioDocument}
		 */
		this.Document = null;

		/**		 * @type {HTMLDivElement}		*/
		this.HtmlElement = null;

		/**		 * @type {HTMLCanvasElement}	*/
		this.canvas = null;

		/**		 * @type {HTMLCanvasElement}	*/
		this.thumbnailsCanvas = null;
		this.locale = null;
		this.bInit_word_control = false;

		if (window.editor == undefined)
		{
			window.editor = this;
			window['editor'] = window.editor;
			Asc['editor'] = Asc.editor = this;

			if (window["NATIVE_EDITOR_ENJINE"])
				editor = window.editor;
		}

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

		AscFonts.g_fontApplication.Init();

		this.FontLoader  = AscCommon.g_font_loader;
		this.ImageLoader = AscCommon.g_image_loader;
		this.FontLoader.put_Api(this);
		this.ImageLoader.put_Api(this);

		this._loadSdkImages();

		this.WordControl      = new AscCommonDraw.CEditorPage(this);
		this.WordControl.Name = this.HtmlElementName;
		this.CreateComponents();
		this.WordControl.Init();

		this.asc_setViewMode(this.isViewMode);
	};
	asc_docs_api.prototype.CreateCSS = function()
	{
		var _head = document.getElementsByTagName('head')[0];

		var style0       = document.createElement('style');
		style0.type      = 'text/css';
		style0.innerHTML = ".block_elem { position:absolute;padding:0;margin:0; }";
		_head.appendChild(style0);
	};
	asc_docs_api.prototype.CreateComponents = function()
	{
		this.asc_setSkin(this.skinObject);
		delete this.skinObject;

		this.CreateCSS();

		//stubs for html page
		window.CLayoutThumbnailDrawer = function () {};
		window.CMasterThumbnailDrawer = function () {};
		var _innerHTML = "<div id=\"id_panel_thumbnails\" class=\"block_elem\" style=\"touch-action:none;-webkit-touch-callout:none;background-color:" + AscCommon.GlobalSkin.BackgroundColorThumbnails + ";\">\
									<div id=\"id_panel_thumbnails_split\" class=\"block_elem\" style=\"pointer-events:none;background-color:" + AscCommon.GlobalSkin.BackgroundColorThumbnails + ";\"></div>\
		                            <canvas id=\"id_thumbnails_background\" class=\"block_elem\" style=\"-ms-touch-action: none;-webkit-user-select: none;z-index:1\"></canvas>\
		                            <canvas id=\"id_thumbnails\" class=\"block_elem\" style=\"-ms-touch-action: none;-webkit-user-select: none;z-index:2\"></canvas>\
		                            <div id=\"id_vertical_scroll_thmbnl\" style=\"left:0;top:0;width:1px;overflow:hidden;position:absolute;\">\
									</div>\
		                        </div>\
		                    <div id=\"id_main_parent\" class=\"block_elem\" style=\"width:100%;height:100%;touch-action:none;-ms-touch-action: none;-moz-user-select:none;-khtml-user-select:none;user-select:none;overflow:hidden;border-left-width: 1px;border-left-color:" + AscCommon.GlobalSkin.BorderSplitterColor + "; border-left-style: solid;\" UNSELECTABLE=\"on\">\
                            <div id=\"id_main\" class=\"block_elem\" style=\"width:100%;height:100%;z-index:5;-ms-touch-action: none;-moz-user-select:none;-khtml-user-select:none;user-select:none;background-color:" + AscCommon.GlobalSkin.BackgroundColor + ";overflow:hidden;\" UNSELECTABLE=\"on\">\
								<div id=\"id_panel_left\" class=\"block_elem\">\
									<canvas id=\"id_buttonTabs\" class=\"block_elem\"></canvas>\
									<canvas id=\"id_vert_ruler\" class=\"block_elem\"></canvas>\
								</div>\
                                <div id=\"id_panel_top\" class=\"block_elem\">\
									<canvas id=\"id_hor_ruler\" class=\"block_elem\"></canvas>\
                                </div>\
                                <div id=\"id_main_view\" class=\"block_elem\" style=\"width:100%;height:100%;overflow:hidden\">\
                                    <canvas id=\"id_viewer\" class=\"block_elem\" style=\"-ms-touch-action: none;-webkit-user-select: none;background-color:" + AscCommon.GlobalSkin.BackgroundColor + ";z-index:6\"></canvas>\
                                    <canvas id=\"id_viewer_overlay\" class=\"block_elem\" style=\"-ms-touch-action: none;-webkit-user-select: none;z-index:7\"></canvas>\
                                    <div id=\"id_target_cursor\" class=\"block_elem\" width=\"1\" height=\"1\" style=\"-ms-touch-action: none;-webkit-user-select: none;width:2px;height:13px;display:none;z-index:9;\"></div>\
                                </div>\
							    <div id=\"id_panel_right\" class=\"block_elem\" style=\"margin-right:1px;background-color:" + AscCommon.GlobalSkin.BackgroundColor + ";z-index:0;\">\
							        <div id=\"id_buttonRulers\" class=\"block_elem buttonRuler\"></div>\
								    <div id=\"id_vertical_scroll\" style=\"left:0;top:0;width:14px;overflow:hidden;position:absolute;\">\
								    </div>\
								    <div id=\"id_buttonPrevPage\" class=\"block_elem buttonPrevPage\"></div>\
								    <div id=\"id_buttonNextPage\" class=\"block_elem buttonNextPage\"></div>\
                                </div>\
                                <div id=\"id_horscrollpanel\" class=\"block_elem\" style=\"margin-bottom:1px;background-color:" + AscCommon.GlobalSkin.BackgroundColor + ";\">\
                                    <div id=\"id_horizontal_scroll\" style=\"left:0;top:0;height:14px;overflow:hidden;position:absolute;width:100%;\">\
                                    </div>\
                                </div>\
                            </div>";
		if (this.HtmlElement)
			_innerHTML += this.HtmlElement.innerHTML;

		if (this.HtmlElement != null)
		{
			this.HtmlElement.style.backgroundColor = AscCommon.GlobalSkin.BackgroundColor;
			this.HtmlElement.innerHTML = _innerHTML;
		}

		this.canvas = document.getElementById("id_viewer");
	};
	// работа с шрифтами
	asc_docs_api.prototype.asyncFontsDocumentStartLoaded = function(blockType)
	{
		this.sync_StartAction(undefined === blockType ? Asc.c_oAscAsyncActionType.BlockInteraction : blockType, Asc.c_oAscAsyncAction.LoadDocumentFonts);
		var _progress         = this.OpenDocumentProgress;
		_progress.Type        = Asc.c_oAscAsyncAction.LoadDocumentFonts;
		_progress.FontsCount  = this.FontLoader.fonts_loading.length;
		_progress.CurrentFont = 0;

		var _loader_object = this.WordControl.m_oLogicDocument;
		var _count         = 0;
		if (_loader_object !== undefined && _loader_object != null)
		{
			for (var i in _loader_object.ImageMap)
			{
				if (this.DocInfo && this.DocInfo.get_OfflineApp())
				{
					var localUrl = _loader_object.ImageMap[i];
					g_oDocumentUrls.addImageUrl(localUrl, this.documentUrl + 'media/' + localUrl);
				}
				++_count;
			}
		}

		_progress.ImagesCount  = _count;
		_progress.CurrentImage = 0;
	};
	asc_docs_api.prototype.asyncFontsDocumentEndLoaded   = function(blockType) {
		this.sync_EndAction(undefined === blockType ? Asc.c_oAscAsyncActionType.BlockInteraction : blockType, Asc.c_oAscAsyncAction.LoadDocumentFonts);

		this.EndActionLoadImages = 0;

		if (null != this.WordControl.m_oLogicDocument)
		{
			//this.WordControl.m_oDrawingDocument.CheckGuiControlColors();
			// this.sendColorThemes(this.WordControl.m_oLogicDocument.themes[0]);
		}

		// открытие после загрузки документа

		var _loader_object = this.WordControl.m_oLogicDocument;
		if (null == _loader_object)
			_loader_object = this.WordControl.m_oDrawingDocument.m_oDocumentRenderer;

		var _count = 0;
		for (var i in _loader_object.ImageMap)
			++_count;

		if (_count > 0)
		{
			this.EndActionLoadImages = 1;
			this.sync_StartAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.LoadDocumentImages);
		}

		this.ImageLoader.bIsLoadDocumentFirst = true;
		this.ImageLoader.LoadDocumentImages(_loader_object.ImageMap);
	};
	asc_docs_api.prototype.asyncImagesDocumentEndLoaded = function()
	{
		this.ImageLoader.bIsLoadDocumentFirst = false;

		// на методе _openDocumentEndCallback может поменяться this.EndActionLoadImages
		if (this.EndActionLoadImages == 1)
		{
			this.sync_EndAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.LoadDocumentImages);
		}
		this.EndActionLoadImages = 0;

		this.ServerImagesWaitComplete = true;
		this._openDocumentEndCallback();
	};
	asc_docs_api.prototype._openDocumentEndCallback = function()
	{
		if (this.isDocumentLoadComplete || !this.ServerImagesWaitComplete || !this.ServerIdWaitComplete || !this.WordControl || !this.WordControl.m_oLogicDocument)
			return;

		if (this.isViewMode)
			this.asc_setViewMode(true);

		this.bInit_word_control = true;
		this.onDocumentContentReady();

		// Меняем тип состояния (на никакое)
		this.advancedOptionsAction = AscCommon.c_oAscAdvancedOptionsAction.None;

		this.WordControl.GoToPage(this.Document.getCurrentPage());
	};

	asc_docs_api.prototype.OpenDocumentFromZip = function(data)
	{
		let res = this.OpenDocumentFromZipNoInit(data);
		this.Document.loadFonts();
		return res;
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

		// var context = reader.context;
		// this.WordControl.m_oLogicDocument.ImageMap = context.loadDataLinks();
		AscCommon.pptx_content_loader.Reader.ImageMapChecker = AscCommon.pptx_content_loader.ImageMapChecker;
		this.Document.imageMap = xmlParserContext.loadDataLinks();
		this.ServerIdWaitComplete = true;

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
		AscCommon.pptx_content_loader.ImageMapChecker = {};
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

	asc_docs_api.prototype.asc_nativeCalculateFile = function(options)
	{
	};
	asc_docs_api.prototype.asc_nativePrintPagesCount = function()
	{
		return 1;
	};
	asc_docs_api.prototype.asc_nativeGetPDF = function(options)
	{
		var pagescount = this["asc_nativePrintPagesCount"]();
		if (options && options["printOptions"] && options["printOptions"]["onlyFirstPage"])
			pagescount = 1;

		var _renderer                         = new AscCommon.CDocumentRenderer();
		_renderer.InitPicker(AscCommon.g_oTextMeasurer.m_oManager);
		_renderer.VectorMemoryForPrint        = new AscCommon.CMemory();
		_renderer.DocInfo(this.asc_getCoreProps());
		var _bOldShowMarks                    = this.ShowParaMarks;
		this.ShowParaMarks                    = false;
		_renderer.IsNoDrawingEmptyPlaceholder = true;

		let nativeOptions = options ? options["nativeOptions"] : undefined;
		let pages = nativeOptions ? AscCommon.getNativePrintRanges(nativeOptions["pages"], nativeOptions["currentPage"], pagescount) : undefined;

		for (var i = 0; i < pagescount; i++)
		{
			if (pages !== undefined && !pages[i])
				continue;
			this["asc_nativePrint"](_renderer, i, options);
		}

		//todo ShowParaMarks
		this.ShowParaMarks = _bOldShowMarks;

		window["native"]["Save_End"]("", _renderer.Memory.GetCurPosition());

		return _renderer.Memory.data;
	};
	asc_docs_api.prototype.asc_nativePrint = function(_printer, _page, _options)
	{
		if (undefined === _printer && _page === undefined)
		{
			if (undefined !== window["AscDesktopEditor"]) {
				var isSelection = (_options && _options["printOptions"] && _options["printOptions"]["selection"]) ? true : false;
				//todo isSelection
				let pagescount = 1;
				var _logic_doc = this.Document;

				window["AscDesktopEditor"]["Print_Start"](this.DocumentUrl, pagescount, "", 0);

				var oDocRenderer = new AscCommon.CDocumentRenderer();
				oDocRenderer.InitPicker(AscCommon.g_oTextMeasurer.m_oManager);
				oDocRenderer.VectorMemoryForPrint = new AscCommon.CMemory();
				var bOldShowMarks = this.ShowParaMarks;
				this.ShowParaMarks = false;
				oDocRenderer.IsNoDrawingEmptyPlaceholder = true;

				for (var i = 0; i < pagescount; i++) {
					oDocRenderer.Memory.Seek(0);
					oDocRenderer.VectorMemoryForPrint.ClearNoAttack();

					oDocRenderer.BeginPage(_logic_doc.GetWidthMM(i), _logic_doc.GetHeightMM(i));
					_logic_doc.draw(100, oDocRenderer);
					oDocRenderer.EndPage();

					window["AscDesktopEditor"]["Print_Page"](oDocRenderer.Memory.GetBase64Memory(), _logic_doc.GetWidthMM(i), _logic_doc.GetHeightMM(i));
				}
				if (0 === pagescount) {
					oDocRenderer.BeginPage(_logic_doc.GetWidthMM(i), _logic_doc.GetHeightMM(i));
					oDocRenderer.EndPage();

					window["AscDesktopEditor"]["Print_Page"](oDocRenderer.Memory.GetBase64Memory());
				}

				this.ShowParaMarks = bOldShowMarks;

				window["AscDesktopEditor"]["Print_End"]();
			}
		} else {
			let _logic_doc = this.Document;
			_printer.BeginPage(_logic_doc.GetWidthMM(_page), _logic_doc.GetHeightMM(_page));
			_logic_doc.draw(100, _printer);
			_printer.EndPage();
		}
	};
	asc_docs_api.prototype.openDocument = function(file)
	{
		let perfStart = performance.now();
		// if (file.changes && this.VersionHistory)
		// {
		// 	this.VersionHistory.changes = file.changes;
		// 	this.VersionHistory.applyChanges(this);
		// }
		this.isOpenOOXInBrowser = this["asc_isSupportFeature"]("ooxml") && AscCommon.checkOOXMLSignature(file.data);
		if (this.isOpenOOXInBrowser) {
			this.openOOXInBrowserZip = file.data;
			this.OpenDocumentFromZip(file.data);
		} else {
			//this.OpenDocumentFromBin(file.url, file.data);
		}
		let perfEnd = performance.now();
		AscCommon.sendClientLog("debug", AscCommon.getClientInfoString("onOpenDocument", perfEnd - perfStart), this);
	};
	asc_docs_api.prototype.isDocumentModified = function()
	{
		return false;
		if (!this.canSave)
		{
			// Пока идет сохранение, мы не закрываем документ
			return true;
		}
		return this.isDocumentModify;
	};
	asc_docs_api.prototype.SetDrawingFreeze = function(bIsFreeze)
	{
		//todo
	};
	asc_docs_api.prototype.asc_setSpellCheck = function(isOn)
	{
	};
	asc_docs_api.prototype.asc_setSpellCheckSettings = function(oSettings)
	{
	};
	asc_docs_api.prototype.zoomIn         = function()
	{
		this.WordControl.zoom_In();
	};
	asc_docs_api.prototype.zoomOut        = function()
	{
		this.WordControl.zoom_Out();
	};
	asc_docs_api.prototype.zoomFitToPage  = function()
	{
		if (!this.isLoadFullApi)
		{
			this.tmpZoomType = AscCommon.c_oZoomType.FitToPage;
			return;
		}
		this.WordControl.zoom_FitToPage();
	};
	asc_docs_api.prototype.zoomFitToWidth = function()
	{
		if (!this.isLoadFullApi)
		{
			this.tmpZoomType = AscCommon.c_oZoomType.FitToWidth;
			return;
		}
		this.WordControl.zoom_FitToWidth();
	};
	asc_docs_api.prototype.zoomCustomMode = function()
	{
		if (!this.isLoadFullApi)
		{
			this.tmpZoomType = AscCommon.c_oZoomType.CustomMode;
			return;
		}
		this.WordControl.m_nZoomType = 0;
		this.WordControl.zoom_Fire();
	};
	asc_docs_api.prototype.zoom100        = function()
	{
		this.WordControl.m_nZoomValue = 100;
		this.WordControl.zoom_Fire();
	};
	asc_docs_api.prototype.zoom           = function(percent)
	{
		this.WordControl.m_nZoomValue = percent;
		this.WordControl.zoom_Fire(0);
	};
	asc_docs_api.prototype.goToPage       = function(number)
	{
		this.WordControl.GoToPage(number);
	};
	asc_docs_api.prototype.SetFontRenderingMode         = function(mode)
	{
		if (!this.isLoadFullApi)
		{
			this.tmpFontRenderingMode = mode;
			return;
		}

		if (c_oAscFontRenderingModeType.noHinting === mode)
			AscCommon.g_fontManager.SetHintsProps(false, false);
		else if (c_oAscFontRenderingModeType.hinting === mode)
			AscCommon.g_fontManager.SetHintsProps(true, false);
		else if (c_oAscFontRenderingModeType.hintingAndSubpixeling === mode)
			AscCommon.g_fontManager.SetHintsProps(true, true);

		if (AscCommon.g_fontManager2 !== undefined && AscCommon.g_fontManager2 !== null)
			AscCommon.g_fontManager2.ClearFontsRasterCache();

		// this.WordControl.m_oDrawingDocument.ClearCachePages();
		//
		// if (this.bInit_word_control)
		// 	this.WordControl.OnScroll();
	}
	asc_docs_api.prototype.asc_setLocale = function(val)
	{
		this.locale = val;
	};
	asc_docs_api.prototype.asc_getLocale = function()
	{
		return this.locale;
	};
	asc_docs_api.prototype.asc_SetDocumentUnits = function(_units)
	{
		//todo
		this.tmpDocumentUnits = _units;
	};
	asc_docs_api.prototype.Resize = function() {
		if (false === this.bInit_word_control)
			return;
		this.WordControl.OnResize(false);
	};
	asc_docs_api.prototype.sendEvent = function()
	{
		this.sendInternalEvent.apply(this, arguments);
		var name = arguments[0];
		if (_callbacks.hasOwnProperty(name))
		{
			for (var i = 0; i < _callbacks[name].length; ++i)
			{
				_callbacks[name][i].apply(this || window, Array.prototype.slice.call(arguments, 1));
			}
			return true;
		}
		return false;
	};
	var _callbacks = {};
	asc_docs_api.prototype.asc_registerCallback = function(name, callback)
	{
		if (!_callbacks.hasOwnProperty(name))
			_callbacks[name] = [];
		_callbacks[name].push(callback);
	};
	asc_docs_api.prototype.asc_unregisterCallback = function(name, callback)
	{
		if (_callbacks.hasOwnProperty(name))
		{
			for (var i = _callbacks[name].length - 1; i >= 0; --i)
			{
				if (_callbacks[name][i] == callback)
					_callbacks[name].splice(i, 1);
			}
		}
	};
	asc_docs_api.prototype.asc_checkNeedCallback = function(name)
	{
		if (_callbacks.hasOwnProperty(name))
		{
			return true;
		}
		return false;
	};
	asc_docs_api.prototype.asc_SetFastCollaborative = function(isOn)
	{
	};
	asc_docs_api.prototype.getCountPages  = function()
	{
		return this.WordControl && this.WordControl.m_oLogicDocument && this.WordControl.m_oLogicDocument.getCountPages() || 0
	};
	asc_docs_api.prototype.ShowThumbnails           = function(bIsShow)
	{
		if (bIsShow)
		{
			this.WordControl.Splitter1Pos = this.WordControl.OldSplitter1Pos;
			if (this.WordControl.Splitter1Pos == 0)
				this.WordControl.Splitter1Pos = 70;
			this.WordControl.OnResizeSplitter();
		}
		else
		{
			var old                       = this.WordControl.OldSplitter1Pos;
			this.WordControl.Splitter1Pos = 0;
			this.WordControl.OnResizeSplitter();
			this.WordControl.OldSplitter1Pos = old;
		}
	}
	asc_docs_api.prototype["asc_setViewerTargetType"] = asc_docs_api.prototype.asc_setViewerTargetType = function(type) {
		this.isHandMode = ("hand" === type);
		// this.WordControl.checkMouseHandMode();
		// this.WordControl.onMouseMove();
		this.sendEvent("asc_onChangeViewerTargetType", this.isHandMode);
	};
	asc_docs_api.prototype.getLogicDocument = asc_docs_api.prototype.private_GetLogicDocument = function() {
		return this.WordControl && this.WordControl.m_oLogicDocument || null;
	};

	asc_docs_api.prototype.asc_DownloadAs = function(options)
	{
		if (this.isLongAction()) {
			return;
		}
		this.downloadAs(Asc.c_oAscAsyncAction.DownloadAs, options);
	};
	/*callbacks*/
	asc_docs_api.prototype.sync_zoomChangeCallback  = function(percent, type)
	{	//c_oAscZoomType.Current, c_oAscZoomType.FitWidth, c_oAscZoomType.FitPage
		this.sendEvent("asc_onZoomChange", percent, type);
	};

	//temp stubs
	asc_docs_api.prototype.getCountSlides = function()
	{
		return this.Document.getCountPages();
	};
	asc_docs_api.prototype.DemonstrationEndShowMessage = function(message)
	{
	}
	asc_docs_api.prototype.asc_setShowGridlines = function(isShow)
	{
	}
	asc_docs_api.prototype.asc_setShowGuides = function(isShow)
	{
	};
	asc_docs_api.prototype.asc_setShowSmartGuides = function(isShow)
	{
	};
	asc_docs_api.prototype.asc_ShowNotes = function(bIsShow)
	{
	};
	asc_docs_api.prototype.SetThemesPath = function(bIsFreeze)
	{
	};
	//-------------------------------------------------------------export---------------------------------------------------
	window['Asc']                                                       = window['Asc'] || {};
	window['Asc']['asc_docs_api']                                       = asc_docs_api;
	asc_docs_api.prototype['OpenDocumentFromZip']             			= asc_docs_api.prototype.OpenDocumentFromZip;
	asc_docs_api.prototype['asc_nativeOpenFile']             			= asc_docs_api.prototype.asc_nativeOpenFile;
	asc_docs_api.prototype['asc_nativeApplyChanges2']             		= asc_docs_api.prototype.asc_nativeApplyChanges2;
	asc_docs_api.prototype['asc_nativeGetFileData']             		= asc_docs_api.prototype.asc_nativeGetFileData;
	asc_docs_api.prototype['asc_nativeCalculateFile']             		= asc_docs_api.prototype.asc_nativeCalculateFile;
	asc_docs_api.prototype['asc_nativePrintPagesCount']             	= asc_docs_api.prototype.asc_nativePrintPagesCount;
	asc_docs_api.prototype['asc_nativeGetPDF']             				= asc_docs_api.prototype.asc_nativeGetPDF;
	asc_docs_api.prototype['asc_nativePrint']             				= asc_docs_api.prototype.asc_nativePrint;

})(window, window.document);
