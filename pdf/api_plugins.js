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

(function(window, undefined)
{
    /**
     * Base class.
     * @global
     * @class
     * @name Api
     */
    let Api = window["asc_docs_api"];

	/**
     * Gets current page index
     * @memberof Api
     * @typeofeditors ["PDFE"]
     * @alias GetCurrentPage
	 * @returns {number}
     * @see office-js-api/Examples/Plugins/PDF/Api/Methods/GetCurrentPage.js
	 */
    Api.prototype["pluginMethod_GetCurrentPage"] = function() {
        return this.getCurrentPage();
    };

	/**
	 * Gets page image
	 * @memberof Api
	 * @typeofeditors ["PDFE"]
	 * @alias GetPageImage
	 * @param {number} nPage - page index
	 * @param {object} [oParams={}] - image params
	 * @param {number} [oParams.maxSize] - the size of the larger side in pixels
	 * @param {boolean} [oParams.annotations=false] - will annotations be rendered
	 * @param {boolean} [oParams.fields=false] - will fields be rendered
	 * @param {boolean} [oParams.drawings=false] - will drawings be rendered
	 * @returns {canvas}
	 * @see office-js-api/Examples/Plugins/PDF/Api/Methods/GetPageImage.js
	 */
	Api.prototype["pluginMethod_GetPageImage"] = function(nPage, oParams) {
		if (!oParams) {
			oParams = {};
		}

		let oViewer		= this.DocumentRenderer;
		let oFile		= oViewer.file;
		let nPt2Px		= g_dKoef_pt_to_mm * g_dKoef_mm_to_pix;

		let nWidthPx	= oFile.pages[nPage].W * nPt2Px;
		let nHeightPx	= oFile.pages[nPage].H * nPt2Px;

		if (oParams["maxSize"]) {
			let aspectRatio = nWidthPx / nHeightPx;
			if (aspectRatio >= 1) {
				nWidthPx = oParams["maxSize"];
				nHeightPx = oParams["maxSize"] / aspectRatio;
			}
			else {
				nHeightPx = oParams["maxSize"];
				nWidthPx = oParams["maxSize"] * aspectRatio;
			}
		}

		nWidthPx = nWidthPx >> 0;
		nHeightPx = nHeightPx >> 0;

		let image = !oFile.pages[nPage].isRecognized ? oFile.getPage(nPage, nWidthPx, nHeightPx, undefined, 0xFFFFFF) : null;

		if (!image) {
			let pageColor = this.getPageBackgroundColor();

			image = document.createElement('canvas');

			let ctx = image.getContext('2d');

			image.width = nWidthPx;
			image.height = nHeightPx;

			ctx.fillStyle = "rgba(" + pageColor.R + "," + pageColor.G + "," + pageColor.B + ",1)";
			ctx.fillRect(0, 0, nWidthPx, nHeightPx);
		}

		image.requestWidth = nWidthPx;
		image.requestHeight = nHeightPx;

		let ctx = image.getContext('2d');

		if (oParams['drawings']) {
			oViewer._drawDrawingsOnCtx(nPage, ctx);
		}
		if (oParams['annotations']) {
			oViewer._drawMarkupAnnotsOnCtx(nPage, ctx);
			oViewer._drawAnnotsOnCtx(nPage, ctx);
		}
		if (oParams['fields']) {
			oViewer._drawFieldsOnCtx(nPage, ctx, false, true);
		}

		return ctx.canvas;
	};

    /**
     * Replace page content by xml
     * @memberof Api
     * @typeofeditors ["PDFE"]
     * @alias ReplacePageContent
	 * @param {number} nPage - page index
	 * @param {object} oParams - replace params
	 * @param {string} oParams.html - html to replace content
	 * @param {string[]} oParams.xmls - array of xml shapes to replace content
	 * @returns {boolean}
     * @see office-js-api/Examples/Plugins/PDF/Api/Methods/ReplacePageContent.js
	 */
    Api.prototype["pluginMethod_ReplacePageContent"] = function(nPage, oParams) {
		let oDoc = this.getPDFDoc();
		
		if (oParams['xmls']) {
			return oDoc.EditPage(nPage, oParams['xmls']);
		}
		else if (oParams['html']) {
			let _elem = document.getElementById("pmpastehtml");
			if (_elem)
				return;

			window.g_asc_plugins && window.g_asc_plugins.setPluginMethodReturnAsync();

			_elem = document.createElement("div");
			_elem.id = "pmpastehtml";
			_elem.style.color = "rgb(0,0,0)";
			_elem.innerHTML = oParams['html'];
			document.body.appendChild(_elem);
			
			this.incrementCounterLongAction();
			let b_old_save_format = AscCommon.g_clipboardBase.bSaveFormat;
			AscCommon.g_clipboardBase.bSaveFormat = false;
			let _t = this;

			let currRestrictionType = this.restrictions;
			this.asc_setRestriction(Asc.c_oAscRestrictionType.None);
			this.asc_PasteData(AscCommon.c_oAscClipboardDataFormat.HtmlElement, _elem, undefined, undefined, undefined,
				function () {
					let oPageInfo = oDoc.GetPageInfo(nPage);
        			oPageInfo.SetRecognized(true);

					_t.decrementCounterLongAction();

					let fCallback = function () {
						document.body.removeChild(_elem);
						_elem = null;
						AscCommon.g_clipboardBase.bSaveFormat = b_old_save_format;
					};
					if (_t.checkLongActionCallback(fCallback, null)) {
						fCallback();
					}
					window.g_asc_plugins &&	window.g_asc_plugins.onPluginMethodReturn(true);
					_t.asc_setRestriction(currRestrictionType);
				}
			);
			

			return true;
		}
    };
	
})(window);


