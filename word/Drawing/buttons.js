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

(function(window, undefined){

	var AscCommon = window['AscCommon'];

	// класс для регистрации кнопок, для загрузки только нужных
	// для текущего devicePixelRatio
	function StorageBaseImageCtrl()
	{
		this.controls = [];
		this.updateIndex = 0;
		this.isNeedUpdate = false;
	}
	// регистрируем
	StorageBaseImageCtrl.prototype.register = function(image)
	{
		this.controls.push(image);
	};
	// картинка не готова, но запрошена. значит после загрузки - нужно перерисоваться
	StorageBaseImageCtrl.prototype.updateLater = function()
	{
		this.updateIndex++;
	};
	StorageBaseImageCtrl.prototype.needUpdate = function()
	{
		this.isNeedUpdate = true;
	};
	// картинка загрузилась - нужно проверить, надо ли перерисовать оверлей
	StorageBaseImageCtrl.prototype.updateOverlay = function()
	{
		if (this.updateIndex == 0)
			return;
		this.updateIndex--;
		if (this.updateIndex < 0)
			this.updateIndex = 0;
		if (this.updateIndex != 0)
		{
			// обновится, когда все загрузятся
			return;
		}

		if (!this.isNeedUpdate)
		{
			// не было запроса на отрисовку, пока грузили
			return;
		}

		this.isNeedUpdate = false;

		var wordControl = window.editor ? window.editor.WordControl : undefined;
		if (wordControl)
		{
			wordControl.ShowOverlay();
			wordControl.StartUpdateOverlay();
			wordControl.OnUpdateOverlay();
			wordControl.EndUpdateOverlay();
			
			// TODO: Пока временно сделаем так, в будущем надо отделить загрузку и обновление картинок, которые
			//       рисуются не на оверлее
			let drawingDocument = wordControl.m_oDrawingDocument;
			if (drawingDocument)
			{
				drawingDocument.ClearCachePages();
				drawingDocument.FirePaint();
			}
		}
	};
	StorageBaseImageCtrl.prototype.resize = function()
	{
		for (var i = 0, len = this.controls.length; i < len; i++)
		{
			this.controls[i]._loadIndex(undefined);
			if (this.controls[i].images_active.length > 0)
				this.controls[i]._loadActiveIndex(undefined);
		}
	}
	AscCommon.g_imageControlsStorage = new StorageBaseImageCtrl();

	function BaseImageCtrl()
	{
		// регистрируем
		AscCommon.g_imageControlsStorage.register(this);

		this.images = [];
		this.images_active = [];
		this.images_hover = [];
		this.url = "";
		this.baseUrl = "";
	}

	// поддерживаемые devicePixelRatio
	BaseImageCtrl.prototype.support = [1, 1.25, 1.5, 1.75, 2];

	// на старте - грузим сразу ВСЕ размеры (не используем этот режим)
	BaseImageCtrl.prototype.isLoadAllSizes = false;

	// дописка к урлу (@..x)
	BaseImageCtrl.prototype.getAddon = function(val)
	{
		val = (val * 100) >> 0;
		if (100 === val)
			return "";

		while (0 === (val % 10))
			val = (val / 10) >> 0;

		if (val < 10)
			return "@" + val + "x";

		var str = "" + val;
		return "@" + str.substring(0, 1) + "." + str.substr(1) + "x";
	};

	// индекс картинки под текущий devicePixelRatio
	BaseImageCtrl.prototype.getIndex = function()
	{
		var scale = AscCommon.AscBrowser.retinaPixelRatio;
		var index = 0;
		var len = this.support.length;
		while (index < len)
		{
			if (this.support[index] > (scale + 0.01))
				break;
			++index;
		}
		--index;
		if (index < 0)
			return 0;
		if (index >= len)
			return len - 1;
		return index;
	};

	// стартовые загрузки
	BaseImageCtrl.prototype.load = function(type, url, index)
	{
		this.url = url;
		if (index !== undefined)
		{
			this._loadByIndex(index, url);
			return;
		}

		if (!this.isLoadAllSizes)
		{
			this._loadIndex();
			return;
		}
		for (var i = 0, len = this.support.length; i < len; i++)
		{
			this._loadIndex(i);
		}
	};
	BaseImageCtrl.prototype.loadActive = function(url, index)
	{
		if (index !== undefined)
		{
			this._loadActiveByIndex(index, url);
			return;
		}
		if (!this.isLoadAllSizes)
		{
			this._loadActiveIndex();
			return;
		}
		for (var i = 0, len = this.support.length; i < len; i++)
		{
			this._loadActiveIndex(i);
		}
	};
	BaseImageCtrl.prototype.loadHover = function(url, index)
	{
		if (index !== undefined)
		{
			this._loadHoverByIndex(index, url);
			return;
		}
		if (!this.isLoadAllSizes)
		{
			this._loadHoverByIndex(index, url);
			return;
		}
		for (var i = 0, len = this.support.length; i < len; i++)
		{
			this._loadHoverByIndex(i, url);
		}
	};

	// берем картинку. если ее нет - то грузим, если не готова - то просто после загрузки - обновляем оверлей
	BaseImageCtrl.prototype.get = function(isActive, isHover)
	{
		if (isActive)
		{
			let activeImg = this.getActive();
			if (activeImg)
				return activeImg;
		}

		if (isHover)
		{
			let hoverImg = this.getHover();
			if (hoverImg)
				return hoverImg;
		}

		var index = this.getIndex();
		if (!this.images[index])
		{
			AscCommon.g_imageControlsStorage.needUpdate();
			this._loadIndex(index);
			return null;
		}
		if (!this.images[index].asc_complete)
		{
			AscCommon.g_imageControlsStorage.needUpdate();
			return null;
		}
		return this.images[index];
	};
	BaseImageCtrl.prototype.getActive = function()
	{
		var index = this.getIndex();
		if (!this.images_active[index])
		{
			AscCommon.g_imageControlsStorage.needUpdate();
			this._loadActiveIndex(index);
			return null;
		}
		if (!this.images_active[index].asc_complete)
		{
			AscCommon.g_imageControlsStorage.needUpdate();
			return null;
		}
		return this.images_active[index];
	};
	BaseImageCtrl.prototype.getHover = function()
	{
		var index = this.getIndex();
		if (!this.images_hover[index])
		{
			AscCommon.g_imageControlsStorage.needUpdate();
			this._loadHoverByIndex(index);
			return null;
		}
		if (!this.images_hover[index].asc_complete)
		{
			AscCommon.g_imageControlsStorage.needUpdate();
			return null;
		}
		return this.images_hover[index];
	};
	BaseImageCtrl.prototype._loadImg = function(url)
	{
		let img = new Image();
		img.src = url;
		if (img.complete)
		{
			img.asc_complete = true;
		}
		else
		{
			AscCommon.g_imageControlsStorage.updateLater();
			img.onload = function()
			{
				this.asc_complete = true;
				AscCommon.g_imageControlsStorage.updateOverlay();
			};
			img.onerror = function()
			{
				this.asc_complete = false;
				AscCommon.g_imageControlsStorage.updateOverlay();
			};
			AscCommon.backoffOnErrorImg(img);
		}
		return img;
	};
	// загрузка картинки по индексу. если индекса нет - то текущий
	BaseImageCtrl.prototype._loadIndex = function(index)
	{
		if (undefined === index)
			index = this.getIndex();

		if (!this.images[index])
			this.images[index] = this._loadImg(this.baseUrl + "/" + this.url + this.getAddon(this.support[index]) + ".png");
	};
	BaseImageCtrl.prototype._loadActiveIndex = function(index)
	{
		if (undefined === index)
			index = this.getIndex();

		if (!this.images_active[index])
			this.images_active[index] = this._loadImg(this.baseUrl + "/" + this.url + "_active" + this.getAddon(this.support[index]) + ".png");
	};
	BaseImageCtrl.prototype._loadHoverIndex = function(index)
	{
		if (undefined === index)
			index = this.getIndex();
		
		if (!this.images_hover[index])
			this.images_hover[index] = this._loadImg(this.baseUrl + "/" + this.url + "_hover" + this.getAddon(this.support[index]) + ".png");
	};
	BaseImageCtrl.prototype._loadByIndex = function(index, url)
	{
		if (undefined === index)
			index = this.getIndex();

		if (!this.images[index])
			this.images[index] = this._loadImg(this.baseUrl + url);
	};
	BaseImageCtrl.prototype._loadActiveByIndex = function(index, url)
	{
		if (undefined === index)
			index = this.getIndex();
		
		if (!this.images_active[index])
			this.images_active[index] = this._loadImg(this.baseUrl + url);
	};
	BaseImageCtrl.prototype._loadHoverByIndex = function(index, url)
	{
		if (undefined === index)
			index = this.getIndex();
		
		if (!this.images_hover[index])
			this.images_hover[index] = this._loadImg(this.baseUrl + url);
	};

	AscCommon.BaseImageCtrl = BaseImageCtrl;

	function iconsStr2IconsObj (icons) {
		if (typeof icons !== 'string')
			return icons;

		/*
			valid params:
			theme-type - {string} theme type (light|dark|common)
			theme-name - {string} the name of theme
			state - {string} state of icons for different situations (normal|hover|active)
			scale - {string} list of avaliable scales (100|125|150|175|200|default|extended)
			extension - {string} use it after symbol "." (png|jpeg|svg)

			Example: "resources/%theme-type%(light|dark)/icon%state%(normal|hover)%scale%(default).%extension%(png)"
		*/
		let params_array = {
			"theme-name" : { origin : "", values : [""] },
			"theme-type" : { origin : "", values : [""] },
			"state" : { origin : "", values : ["normal"] },
			"scale" : { origin : "", values : [] },
			"extension" : { origin : "", values : [] }
		};

		// For bug in version <= 8.2.0
		let initScaleAddon = "";

		let param_parse = function(name) {
			let posOrigin = icons.indexOf("%" + name + "%");
			if (posOrigin === -1)
				return;
			let pos = posOrigin + name.length + 2;
			let pos1 = icons.indexOf("(", pos);
			if (pos1 != pos)
				return;
			let pos2 = icons.indexOf(")", pos1);
			params_array[name].origin = icons.substring(posOrigin, pos2 + 1);
			params_array[name].values = icons.substring(pos1 + 1, pos2).split("|");

			if ("scale" === name && posOrigin > 0 && icons.charCodeAt(posOrigin - 1) == 47)
				initScaleAddon = "icon";
		};

		for (let name in params_array)
			param_parse(name);

		for (let styleIndex = 0, stylesLen = params_array["scale"].values.length; styleIndex < stylesLen; styleIndex++) {
			if ("default" === params_array["scale"].values[styleIndex])
				params_array["scale"].values.splice(styleIndex, 1, "100", "125", "150", "175", "200");
		}

		let rasterExt = "";
		let isSvgPresent = false;

		for (let extIndex = 0, extsLen = params_array["extension"].values.length; extIndex < extsLen; extIndex++) {
			if ("svg" === params_array["extension"].values[extIndex])
				isSvgPresent = true;
			else
				rasterExt = params_array["extension"].values[extIndex];
		}
		if (isSvgPresent && rasterExt === "")
			rasterExt = "svg";

		let iconsObject = [];
		for (let themeNameIndex = 0, themeNamesLen = params_array["theme-name"].values.length; themeNameIndex < themeNamesLen; themeNameIndex++) {
			let themeName = params_array["theme-name"].values[themeNameIndex];
			for (let themeTypeIndex = 0, themeTypesLen = params_array["theme-type"].values.length; themeTypeIndex < themeTypesLen; themeTypeIndex++) {
				let url = icons;
				let themeType = params_array["theme-type"].values[themeTypeIndex];

				let obj = {};
				if ("" !== themeName)
					obj["theme"] = themeName;

				if ("" !== themeType)
					obj["style"] = themeType;

				if ("" != params_array["theme-name"].origin)
					url = url.replaceAll(params_array["theme-name"].origin, themeName);
				if ("" != params_array["theme-type"].origin)
					url = url.replaceAll(params_array["theme-type"].origin, themeType);

				let scalesLen = params_array["scale"].values.length;
				if (0 == scalesLen) {
					params_array["scale"].values.push("100");
					scalesLen++;
				}
				for (let scaleIndex = 0; scaleIndex < scalesLen; scaleIndex++) {
					let scaleValue = params_array["scale"].values[scaleIndex];
					let isAll = false;

					if (scaleValue.length > 0) {
						if (scaleValue === "*")
							isAll = true;
						else if (scaleValue.charAt(scaleValue.length - 1) === "%")
							scaleValue = scaleValue.substring(0, scaleValue.length - 1);
					} else {
						isAll = true;
						scaleValue = "*";
					}

					let addonScale = "";
					if (!isAll) {
						let intScale = parseInt(scaleValue);
						if (intScale !== 100) {
							let addon100 = intScale % 100;
							addonScale = "@" + ((intScale / 100) >> 0);
							if (addon100 !== 0) {
								if (0 === (addon100 % 10))
									addon100 /= 10;
								addonScale += ("." + addon100);
							}
							addonScale += "x";
						}
						scaleValue = scaleValue + "%";
					}

					let urlAll = url;
					if (params_array["scale"].origin != "")
						urlAll = urlAll.replaceAll(params_array["scale"].origin, initScaleAddon + addonScale);
					if (params_array["extension"].origin != "")
						urlAll = urlAll.replaceAll(params_array["extension"].origin, (isAll && isSvgPresent) ? "svg" : rasterExt);

					obj[scaleValue] = {};
					let states =  params_array["state"].values;
					for (let stateIndex = 0, statesLen = states.length; stateIndex < statesLen; stateIndex++) {
						let stateValue = params_array["state"].values[stateIndex];
						if (params_array["state"].origin !== "") {
							if ("normal" === stateValue) {
								let statePos = urlAll.indexOf(params_array["state"].origin);
								obj[scaleValue][stateValue] = urlAll.replace(params_array["state"].origin, "");
								if (obj[scaleValue][stateValue].charAt(statePos) == "/")
									obj[scaleValue][stateValue] = obj[scaleValue][stateValue].substring(0, statePos) + obj[scaleValue][stateValue].substring(statePos + 1);
							} else {
								obj[scaleValue][stateValue] = urlAll.replace(params_array["state"].origin, "_" + stateValue);
							}
						} else
							obj[scaleValue][stateValue] = urlAll;
					}
				}
				iconsObject.push(obj);
			}
		}

		return iconsObject;
	}

	AscCommon.IconsStr2IconsObj = iconsStr2IconsObj;

})(window);

/*
	OVERLAY ICONS
 */
(function(window, undefined){

	/**
	 * @constructor
	 * @extends {AscCommon.BaseImageCtrl}
	 */
	function OverlayRasterIcon()
	{
		AscCommon.BaseImageCtrl.call(this);
		this.baseUrl = "../../../../sdkjs/common/Images/icons";
	}
	OverlayRasterIcon.prototype = Object.create(AscCommon.BaseImageCtrl.prototype);
	OverlayRasterIcon.prototype.constructor = OverlayRasterIcon;

	AscCommon.OverlayRasterIcon = OverlayRasterIcon;

	AscCommon.OverlayRasterIcons = {};
	AscCommon.OverlayRasterIcons.Anchor = new OverlayRasterIcon();
	AscCommon.OverlayRasterIcons.Anchor.load(0, "anchor");

})(window);

/*
    PLACEHOLDERS
 */
(function(window, undefined){

	var AscCommon = window['AscCommon'];

	AscCommon.PlaceholderButtonType = {
		Image : 0,
		ImageUrl : 1,
		Chart : 2,
		Table : 3,
		Video : 4,
		Audio : 5,
		SmartArt: 6
	};

	var exportObj = AscCommon.PlaceholderButtonType;
	AscCommon["PlaceholderButtonType"] = exportObj;
	exportObj["Image"] = exportObj.Image;
	exportObj["ImageUrl"] = exportObj.ImageUrl;
	exportObj["Chart"] = exportObj.Chart;
	exportObj["Table"] = exportObj.Table;
	exportObj["Video"] = exportObj.Video;
	exportObj["Audio"] = exportObj.Audio;
	exportObj["SmartArt"] = exportObj.SmartArt;

	AscCommon.PlaceholderButtonState = {
		None : 0,
		Active : 1,
		Over : 2
	};

	var ButtonSize1x = 42;
	var ButtonImageSize1x = 28;
	var ButtonBetweenSize1x = 8;

	/**
	 * @constructor
	 * @extends {AscCommon.BaseImageCtrl}
	 */
	function PI()
	{
		AscCommon.BaseImageCtrl.call(this);
		this.baseUrl = "../../../../sdkjs/common/Images/placeholders";
	}
	PI.prototype = Object.create(AscCommon.BaseImageCtrl.prototype);
	PI.prototype.constructor = PI;

	function PlaceholderIcons()
	{
		this.images = [];

		this.register = function(type, url, support_active)
		{
			this.images[type] = new PI();
			this.images[type].load(type, url);
			support_active && this.images[type].loadActive();
		};
		this.get = function(type)
		{
			return this.images[type] ? this.images[type].get() : null;
		};
		this.getActive = function(type)
		{
			return this.images[type] ? this.images[type].getActive() : null;
		};
	}

	AscCommon.CreateDrawingPlaceholder = function(id, buttons, page, rect, transform, isDisabled)
	{
		var placeholder = new Placeholder();
		placeholder.id = id;
		placeholder.buttons = buttons;
		placeholder.anchor.page = page;
		placeholder.anchor.rect = rect;
		placeholder.anchor.transform = transform;
		placeholder.isDisabled = isDisabled;
		for (var i = 0; i < placeholder.buttons.length; i++)
			placeholder.states[i] = AscCommon.PlaceholderButtonState.None;

		return placeholder;
	};

	// объект плейсхордер - может содержать в себе несколько кнопок
	// сам решает, где и как рисовать
	function Placeholder()
	{
		this.events = null; // Placeholders

		this.buttonSize = ButtonSize1x;
		this.buttonBetweenSize = ButtonBetweenSize1x;
		this.buttonImageSize = ButtonImageSize1x;

		// id button (parent shape id)
		this.id = null;

		this.api = Asc.editor || editor;

		// list of buttons {AscCommon.PlaceholderButtonType}
		this.buttons = [];
		this.states = []; // states

		// position
		this.anchor = {
			page : -1,
			rect : { x : 0, y : 0, w : 0, h : 0 },
			transform : null
		};

		this.isDisabled = false;
	}

	Placeholder.prototype.getCenterInPixels = function(pixelsRect, pageWidthMM, pageHeightMM)
	{
		var cx = this.anchor.rect.x + this.anchor.rect.w / 2;
		var cy = this.anchor.rect.y + this.anchor.rect.h / 2;
		if (this.anchor.transform)
		{
			var tmpCx = cx;
			var tmpCy = cy;
			cx = this.anchor.transform.TransformPointX(tmpCx, tmpCy);
			cy = this.anchor.transform.TransformPointY(tmpCx, tmpCy);
		}

		return {
			x : (0.5 + pixelsRect.left + cx * (pixelsRect.right - pixelsRect.left) / pageWidthMM) >> 0,
			y : (0.5 + pixelsRect.top + cy * (pixelsRect.bottom - pixelsRect.top) / pageHeightMM) >> 0
		};
	};

	// расчет всех ректов кнопок
	Placeholder.prototype.getButtonRects = function(pointCenter, scale, isDraw)
	{
		//координаты ретины - масштабируются при отрисовке
		var ButtonSize = this.buttonSize;//AscCommon.AscBrowser.convertToRetinaValue(ButtonSize1x, true);
		var ButtonBetweenSize = this.buttonBetweenSize;//AscCommon.AscBrowser.convertToRetinaValue(ButtonBetweenSize1x, true);

		if (isDraw)
		{
			ButtonSize = AscCommon.AscBrowser.convertToRetinaValue(ButtonSize, true);
			ButtonBetweenSize = AscCommon.AscBrowser.convertToRetinaValue(ButtonBetweenSize, true);
		}

		// максимум 2 ряда
		var buttonsCount = this.buttons.length;
		var countColumn = (buttonsCount < 3) ? buttonsCount : (this.buttons.length + 1) >> 1;
		var countColumn2 = buttonsCount - countColumn;

		var sizeAllHor = (countColumn * ButtonSize + (countColumn - 1) * ButtonBetweenSize);
		var sizeAllHor2 = (countColumn2 * ButtonSize + (countColumn2 - 1) * ButtonBetweenSize);

		var xStart = pointCenter.x - (sizeAllHor >> 1);
		var yStart = pointCenter.y - (((buttonsCount == countColumn) ? ButtonSize : (2 * ButtonSize + ButtonBetweenSize)) >> 1);

		var ret = [];
		var x = xStart;
		var y = yStart;
		var i = 0;
		while (i < countColumn)
		{
			ret.push({x : x, y : y});
			x += (ButtonSize + ButtonBetweenSize);
			i++;
		}

		x = xStart + ((sizeAllHor - sizeAllHor2) >> 1);
		y = yStart + ButtonSize + ButtonBetweenSize;
		while (i < buttonsCount)
		{
			ret.push({x : x, y : y});
			x += (ButtonSize + ButtonBetweenSize);
			i++;
		}

		return ret;
	};

	Placeholder.prototype.isInside = function(x, y, pixelsRect, pageWidthMM, pageHeightMM, pointMenu)
	{
		var pointCenter = this.getCenterInPixels(pixelsRect, pageWidthMM, pageHeightMM);
		var scale = {
			x : (pixelsRect.right - pixelsRect.left) / pageWidthMM,
			y : (pixelsRect.bottom - pixelsRect.top) / pageHeightMM
		};
		var rects = this.getButtonRects(pointCenter, scale);
		var ButtonSize = this.buttonSize;//AscCommon.AscBrowser.convertToRetinaValue(ButtonSize1x, true);

		var px = (0.5 + pixelsRect.left + x * (pixelsRect.right - pixelsRect.left) / pageWidthMM) >> 0;
		var py = (0.5 + pixelsRect.top + y * (pixelsRect.bottom - pixelsRect.top) / pageHeightMM) >> 0;

		var rect;
		for (var i = 0; i < rects.length; i++)
		{
			rect = rects[i];
			if ((px >= rect.x) && (px <= (rect.x + ButtonSize)) && (py >= rect.y) && (py <= (rect.y + ButtonSize)))
			{
				if (pointMenu)
				{
					pointMenu.x = rect.x;
					pointMenu.y = rect.y;
				}
				return i;
			}
		}

		return -1;
	};

	Placeholder.prototype.recalculateButtonsSize = function (scale) {
		const buttonSize = AscCommon.AscBrowser.convertToRetinaValue(ButtonSize1x, true);
		const buttonBetweenSize = AscCommon.AscBrowser.convertToRetinaValue(ButtonBetweenSize1x, true);

		const buttonsCount = this.buttons.length;
		const countColumn = (buttonsCount < 3) ? buttonsCount : (this.buttons.length + 1) >> 1;

		const sizeAllHor = (countColumn * buttonSize + (countColumn - 1) * buttonBetweenSize);

		let sizeAllVer = buttonsCount > 0 ? buttonSize : 0;
		if (buttonsCount > countColumn)
			sizeAllVer += (buttonSize + buttonBetweenSize);

		const parentW = (this.anchor.rect.w * scale.x) >> 0;
		const parentH = (this.anchor.rect.h * scale.y) >> 0;

		const widthCoefficient = parentW / (sizeAllHor + (buttonBetweenSize << 1));
		const heightCoefficient = parentH / (sizeAllVer + (buttonBetweenSize << 1));
		const nScaleCoefficient = Math.min(widthCoefficient, heightCoefficient, 1);

		this.buttonSize = (ButtonSize1x * nScaleCoefficient) >> 0;
		this.buttonBetweenSize = (ButtonBetweenSize1x * nScaleCoefficient) >> 0;
		this.buttonImageSize = (ButtonImageSize1x * nScaleCoefficient) >> 0;
	};

	Placeholder.prototype.onPointerDown = function(x, y, pixelsRect, pageWidthMM, pageHeightMM)
	{
		if(this.isDisabled) return false;
		let pointMenu = { x : 0, y : 0 };
		let indexButton = this.isInside(x, y, pixelsRect, pageWidthMM, pageHeightMM, pointMenu);

		if (-1 == indexButton)
			return false;

		if (this.states[indexButton] == AscCommon.PlaceholderButtonState.Active)
		{
			this.states[indexButton] = AscCommon.PlaceholderButtonState.Over;
			this.events.onUpdateOverlay();
			this.events.endUpdateOverlay();

			this.events.closeCallback(this.buttons[indexButton], this);
			return true;
		}
		else if (this.events.mapActive[this.buttons[indexButton]])
		{
			for (var i = 0; i < this.buttons.length; i++)
			{
				if (indexButton != i)
					this.states[i] = AscCommon.PlaceholderButtonState.None;
			}

			this.states[indexButton] = AscCommon.PlaceholderButtonState.Active;
			this.events.onUpdateOverlay();
			this.events.endUpdateOverlay();
		}

		var xCoord = pointMenu.x;
		var yCoord = pointMenu.y;

		var word_control = this.events.document.m_oWordControl;
		switch (this.api.editorId)
		{
			case AscCommon.c_oEditorId.Word:
				if (true === word_control.m_bIsRuler)
				{
					xCoord += (5 * AscCommon.g_dKoef_mm_to_pix) >> 0;
					yCoord += (7 * AscCommon.g_dKoef_mm_to_pix) >> 0;
				}
				break;
			case AscCommon.c_oEditorId.Presentation:
				xCoord += ((word_control.m_oMainParent.AbsolutePosition.L + word_control.m_oMainView.AbsolutePosition.L) * AscCommon.g_dKoef_mm_to_pix) >> 0;
				yCoord += ((word_control.m_oMainParent.AbsolutePosition.T + word_control.m_oMainView.AbsolutePosition.T) * AscCommon.g_dKoef_mm_to_pix) >> 0;
				yCoord += this.buttonSize;
				break;
			default:
				break;
		}

		this.events.callCallback(this.buttons[indexButton], this, xCoord, yCoord);
		return true;
	};

	Placeholder.prototype.onPointerMove = function(x, y, pixelsRect, pageWidthMM, pageHeightMM, checker)
	{
		if(this.isDisabled) return false;
		var indexButton = this.isInside(x, y, pixelsRect, pageWidthMM, pageHeightMM);

		// может в кнопку-то и не попали, но состояние могло смениться => нужно перерисовать интерфейс
		var isUpdate = false;
		for (var i = 0; i < this.buttons.length; i++)
		{
			if (i == indexButton)
			{
				if (this.states[i] == AscCommon.PlaceholderButtonState.None)
				{
					this.states[i] = AscCommon.PlaceholderButtonState.Over;
					isUpdate = true;
				}
			}
			else
			{
				if (this.states[i] == AscCommon.PlaceholderButtonState.Over)
				{
					this.states[i] = AscCommon.PlaceholderButtonState.None;
					isUpdate = true;
				}
			}
		}

		checker.isNeedUpdateOverlay |= isUpdate;
		if (this.buttons[indexButton] !== undefined)
		{
			checker.placeholderType = this.buttons[indexButton];
			checker.page = this.anchor.page;
		}
		return (-1 !== indexButton);
	};

	Placeholder.prototype.onPointerUp = function(x, y, pixelsRect, pageWidthMM, pageHeightMM)
	{
		// ничего. нажимаем сразу при down
	};

	Placeholder.prototype.draw = function(overlay, pixelsRect, pageWidthMM, pageHeightMM)
	{
		var pointCenter = this.getCenterInPixels(pixelsRect, pageWidthMM, pageHeightMM);
		var scale = {
			x : (pixelsRect.right - pixelsRect.left) / pageWidthMM,
			y : (pixelsRect.bottom - pixelsRect.top) / pageHeightMM
		};
		this.recalculateButtonsSize(scale);
		var rects = this.getButtonRects(pointCenter, scale, true);
		if (rects.length != this.buttons.length)
			return;

		var buttonSize = AscCommon.AscBrowser.convertToRetinaValue(this.buttonSize, true);
		var buttonImageSize = AscCommon.AscBrowser.convertToRetinaValue(this.buttonImageSize, true);
		var offsetImage = (buttonSize - buttonImageSize) >> 1;

		var ctx = overlay.m_oContext;
		for (var i = 0; i < this.buttons.length; i++)
		{
			overlay.CheckPoint(rects[i].x, rects[i].y);
			overlay.CheckPoint(rects[i].x + buttonSize, rects[i].y + buttonSize);

			var img = (this.states[i] == AscCommon.PlaceholderButtonState.Active) ? this.events.icons.getActive(this.buttons[i]) : this.events.icons.get(this.buttons[i]);
			if (img)
			{
				var oldGlobalAlpha = ctx.globalAlpha;

				ctx.globalAlpha = ((this.states[i] == AscCommon.PlaceholderButtonState.None) ? 0.5 : 1);

				/* первый вариант
				ctx.beginPath();
				ctx.fillStyle = "#F1F1F1";
				ctx.fillRect(rects[i].x, rects[i].y, ButtonSize, ButtonSize);
				ctx.beginPath();
				*/

				// второй вариант
				ctx.beginPath();
				ctx.fillStyle = (this.states[i] == AscCommon.PlaceholderButtonState.Active) ? "#7D858C" : "#F1F1F1";
				var x = rects[i].x;
				var y = rects[i].y;
				var r = 4;
				ctx.moveTo(x + r, y);
				ctx.lineTo(x + buttonSize - r, y);
				ctx.quadraticCurveTo(x + buttonSize, y, x + buttonSize, y + r);
				ctx.lineTo(x + buttonSize, y + buttonSize - r);
				ctx.quadraticCurveTo(x + buttonSize, y + buttonSize, x + buttonSize - r, y + buttonSize);
				ctx.lineTo(x + r, y + buttonSize);
				ctx.quadraticCurveTo(x, y + buttonSize, x, y + buttonSize - r);
				ctx.lineTo(x, y + r);
				ctx.quadraticCurveTo(x, y, x + r, y);
				ctx.fill();
				ctx.beginPath();

				ctx.drawImage(img, rects[i].x + offsetImage, rects[i].y + offsetImage, buttonImageSize, buttonImageSize);

				ctx.globalAlpha = oldGlobalAlpha;
			}
		}
	};

	AscCommon.DrawingPlaceholder = Placeholder;

	function Placeholders(drDocument)
	{
		this.document = drDocument;

		this.callbacks = [];
		this.objects = [];

		this.api = Asc.editor || editor;

		this.icons = new PlaceholderIcons();
		this.icons.register(AscCommon.PlaceholderButtonType.Image, "image");
		this.icons.register(AscCommon.PlaceholderButtonType.ImageUrl, "image_url");
		this.icons.register(AscCommon.PlaceholderButtonType.Table, "table", true);
		this.icons.register(AscCommon.PlaceholderButtonType.Chart, "chart", true);
		this.icons.register(AscCommon.PlaceholderButtonType.Audio, "audio");
		this.icons.register(AscCommon.PlaceholderButtonType.Video, "video");
		this.icons.register(AscCommon.PlaceholderButtonType.SmartArt, "smartart", true);

		// типы, которые поддерживают состояние Active
		this.mapActive = [];
		this.mapActive[AscCommon.PlaceholderButtonType.Table] = true;
		this.mapActive[AscCommon.PlaceholderButtonType.Chart] = true;
		this.mapActive[AscCommon.PlaceholderButtonType.SmartArt] = true;
	}

	Placeholders.prototype.registerCallback = function(type, callback)
	{
		this.callbacks[type] = callback;
	};

	Placeholders.prototype.callCallback = function(type, obj, xCoord, yCoord)
	{
		this.callbacks[type] && this.callbacks[type](obj, xCoord, yCoord);
	};

	Placeholders.prototype.closeCallback = function(type, obj)
	{
		this.api.sendEvent("asc_onHidePlaceholderActions");
	};

	Placeholders.prototype.closeAllActive = function()
	{
		var isUpdate = false;
		for (var i = 0; i < this.objects.length; i++)
		{
			var obj = this.objects[i];
			for (var j = 0; j < obj.states.length; j++)
			{
				if (obj.states[j] == AscCommon.PlaceholderButtonState.Active)
				{
					isUpdate = true;
					obj.states[j] = AscCommon.PlaceholderButtonState.None;
				}
			}
		}
		if (isUpdate)
			this.onUpdateOverlay();
	};

	Placeholders.prototype.draw = function(overlay, page, pixelsRect, pageWidthMM, pageHeightMM)
	{
		for (var i = 0; i < this.objects.length; i++)
		{
			if (this.objects[i].anchor.page != page)
				continue;

			this.objects[i].draw(overlay, pixelsRect, pageWidthMM, pageHeightMM);
		}
	};

	Placeholders.prototype.onPointerDown = function(pos, pixelsRect, pageWidthMM, pageHeightMM)
	{
		for (var i = 0; i < this.objects.length; i++)
		{
			if (this.objects[i].anchor.page != pos.Page)
				continue;

			if (this.objects[i].onPointerDown(pos.X, pos.Y, pixelsRect, pageWidthMM, pageHeightMM))
				return true;
		}
		return false;
	};

	Placeholders.prototype.onUpdateOverlay = function () {
		if (this.api.editorId === AscCommon.c_oEditorId.Spreadsheet) {
			const oController = this.api.getGraphicController();
			oController.updateOverlay();
		} else {
			if (this.api.WordControl) {
				this.api.WordControl.OnUpdateOverlay();
			}
		}
	};

	Placeholders.prototype.endUpdateOverlay = function () {
		if (this.api.editorId !== AscCommon.c_oEditorId.Spreadsheet) {
			this.api.WordControl.EndUpdateOverlay();
		}
	};

	Placeholders.prototype.updateCursorType = function (nX, nY, nPlaceholder, nPage)
	{
		if (this.api.editorId !== AscCommon.c_oEditorId.Spreadsheet)
		{
			this.api.sync_MouseMoveStartCallback();
			const oMouseMoveData         = new AscCommon.CMouseMoveData();
			const oCoords         = this.api.getDrawingDocument().ConvertCoordsToCursorWR(nX, nY, nPage);
			oMouseMoveData.X_abs       = oCoords.X;
			oMouseMoveData.Y_abs       = oCoords.Y;
			oMouseMoveData.Type      = Asc.c_oAscMouseMoveDataTypes.Placeholder;
			oMouseMoveData.PlaceholderType = nPlaceholder;
			this.document.SetCursorType("default", oMouseMoveData);
			this.api.sync_MouseMoveEndCallback();
		}
	};

	Placeholders.prototype.onPointerMove = function(pos, pixelsRect, pageWidthMM, pageHeightMM)
	{
		const oChecker = { isNeedUpdateOverlay : false, placeholderType: null, page: null };
		for (let i = 0; i < this.objects.length; i++)
		{
			if (this.objects[i].anchor.page != pos.Page)
				continue;

			this.objects[i].onPointerMove(pos.X, pos.Y, pixelsRect, pageWidthMM, pageHeightMM, oChecker);
		}
		const bIsButton = oChecker.placeholderType !== null;

		if (bIsButton)
			this.updateCursorType(pos.X, pos.Y, oChecker.placeholderType, oChecker.page);

		// обновить оверлей
		if (oChecker.isNeedUpdateOverlay)
		{
			this.onUpdateOverlay();

			if (bIsButton)
				this.endUpdateOverlay();
		}
		if (bIsButton)
		{
			return {placeholderType: oChecker.placeholderType, cursor: "default"};
		}
		return null;
	};

	Placeholders.prototype.onPointerUp = function(pos, pixelsRect, pageWidthMM, pageHeightMM)
	{
		return this.onPointerMove(pos, pixelsRect, pageWidthMM, pageHeightMM);
	};

	Placeholders.prototype.update = function(objects)
	{
		if (this.api.isViewMode || this.api.isRestrictionSignatures())
			objects = [];

		var count = this.objects.length;
		var newCount = objects ? objects.length : 0;
		if (count != newCount)
			return this._onUpdate(objects);

		var t1, t2;
		for (var i = 0; i < count; i++)
		{
			if (this.objects[i].id != objects[i].id)
				return this._onUpdate(objects);

			if (this.objects[i].anchor.page != objects[i].anchor.page)
				return this._onUpdate(objects);

			t1 = this.objects[i].anchor.rect;
			t2 = objects[i].anchor.rect;

			if (Math.abs(t1.x - t2.x) > 0.001 || Math.abs(t1.y - t2.y) > 0.001 ||
				Math.abs(t1.w - t2.w) > 0.001 || Math.abs(t1.h - t2.h) > 0.001)
				return this._onUpdate(objects);

			t1 = this.objects[i].anchor.transform;
			t2 = objects[i].anchor.transform;

			if (!t1 && !t2)
				continue;

			if ((t1 && !t2) || (!t1 && t2))
				return this._onUpdate(objects);

			if (Math.abs(t1.sx - t2.sx) > 0.001 || Math.abs(t1.sy - t2.sy) > 0.001 ||
				Math.abs(t1.shx - t2.shx) > 0.001 || Math.abs(t1.shy - t2.shy) > 0.001 ||
				Math.abs(t1.tx - t2.tx) > 0.001 || Math.abs(t1.ty - t2.ty) > 0.001)
				return this._onUpdate(objects);
		}
	};

	Placeholders.prototype._onUpdate = function(objects)
	{
		this.objects = objects ? objects : [];
		for (var i = 0; i < this.objects.length; i++)
		{
			this.objects[i].events = this;
		}

		this.onUpdateOverlay();
	};

	AscCommon.DrawingPlaceholders = Placeholders;

	// example use
	/*
	placeholders.registerCallback(AscCommon.PlaceholderButtonType.Image, function(obj, x, y) {});
	this.placeholders.update(
		[
			AscCommon.CreateDrawingPlaceholder(0, [
			 AscCommon.PlaceholderButtonType.Image,
			 AscCommon.PlaceholderButtonType.Video,
			 AscCommon.PlaceholderButtonType.Audio,
			 AscCommon.PlaceholderButtonType.Table,
			 AscCommon.PlaceholderButtonType.Chart
			], 0, { x : 10, y : 10, w : 100, h : 100 }, null),
			AscCommon.CreateDrawingPlaceholder(0, [AscCommon.PlaceholderButtonType.Image], 0, { x : 100, y : 100, w : 100, h : 100 }, null)
		]
	);
	*/

})(window);

/*
    CONTENTCONTROLS
 */
(function(window, undefined){

	var AscCommon = window['AscCommon'];

	AscCommon.CCButtonType = {
		Name : 0,
		Toc : 1,
		Image : 2,
		Combo : 3,
		Date : 4,
		Signature : 5
	};

	var exportObj = AscCommon.CCButtonType;
	AscCommon["CCButtonType"] = exportObj;
	exportObj["Name"] = exportObj.Name;
	exportObj["Toc"] = exportObj.Toc;
	exportObj["Combo"] = exportObj.Combo;
	exportObj["Date"] = exportObj.Date;
	exportObj["Signature"] = exportObj.Signature;

	AscCommon.ContentControlTrack = {
		Hover : 0,
		In    : 1
	};

	function getOutlineCC(isActive)
	{
		var _editor = Asc.editor || editor;
		if (_editor && _editor.isDarkMode === true)
			return isActive ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.23)";
		return isActive ? AscCommon.GlobalSkin.FormsContentControlsOutlineActive : AscCommon.GlobalSkin.FormsContentControlsOutlineHover;
	}

	// показ диалогов в мобильной версии должен быть только по клику
	function _sendEventToApi(api, obj, x, y, isclick)
	{
		if (!api.isMobileVersion || isclick || obj["type"] !== Asc.c_oAscContentControlSpecificType.Picture || !obj["isForm"])
		{
			api.sendEvent("asc_onShowContentControlsActions", obj, x, y);
			return;
		}
		api.setHandlerOnClick(function(){
			api.sendEvent("asc_onShowContentControlsActions", obj, x, y);
		});
	}

	function CCIcons()
	{
		/**
		 * @constructor
		 * @extends {AscCommon.BaseImageCtrl}
		 */
		function CCI(baseUrl)
		{
			AscCommon.BaseImageCtrl.call(this);
			this.baseUrl = baseUrl ? baseUrl : "../../../../sdkjs/common/Images/content_controls";
		}
		CCI.prototype = Object.create(AscCommon.BaseImageCtrl.prototype);
		CCI.prototype.constructor = CCI;

		this.images = [];
		this.pluginImages = {};

		this.registerIconObj = function(type, images, baseUrl)
		{
			for (let i = 0; i < images.length; i++)
			{
				let image					= new CCI(baseUrl);
				let oCurrentThemeImages		= images[i];
				let style					= oCurrentThemeImages.style || "default";
				let theme					= oCurrentThemeImages.theme || "default";

				delete oCurrentThemeImages.style;
				delete oCurrentThemeImages.theme;

				let keys = Object.keys(oCurrentThemeImages);

				for (let j = 0; j < keys.length; j++)
				{
					let key		= keys[j];
					let index	= this.calculateIndex(key, image)
					let icon	= oCurrentThemeImages[keys[j]];

					this.registerExternalIcon(image, index,{
						type: type,
						style: style,
						theme: theme,
						icon: icon,
					});
				}
			}
		};
		this.calculateIndex = function (index, image)
		{
			if (index)
				index = index.slice(0, -1); // delete %

			index = index/100;

			if (typeof index === 'number')
			{
				for (let p = 0; p < image.support.length; p++)
				{
					if (image.support[p] === index)
					{
						return p;
					}
				}
			}
			return false;
		};
		this.registerExternalIcon = function(image, index, data)
		{
			if (index === false)
				return;

			let type	= data.type; // id of icon
			let style	= data.style;// type of theme
			let theme	= data.theme;// name of theme
			let icon	= data.icon; // {normal_url | active_url | hover_url}

			if (image.support[index])
			{
				image.load(type, icon["normal"], index);

				if (icon["active"])
					image.loadActive(icon["active"], index);

				if (icon["hover"])
					image.loadHover(icon["hover"], index);

				if (!this.pluginImages[type])
					this.pluginImages[type] = {};

				if (!this.pluginImages[type][style])
					this.pluginImages[type][style] = {};

				this.pluginImages[type][style][theme] = image;
			}
		};

		this.register = function(type, url, baseUrl)
		{
			var image = new CCI(baseUrl);
			image.load(type, url);
			image.loadActive();
			this.images[type] = image;
		};
		
		this.registerNoActive = function(type, url, baseUrl)
		{
			var image = new CCI(baseUrl);
			image.load(type, url);
			this.images[type] = image;
		};

		this.getImage = function(type, isActive, isHover)
		{
			let pluginImage = this.pluginImages[type];
			if (pluginImage)
			{
				let skinType  = AscCommon.GlobalSkin.Type;
				let skinStyle = AscCommon.GlobalSkin.Name;

				if (pluginImage[skinType] && pluginImage[skinType][skinStyle])
				{
					return pluginImage[skinType][skinStyle].get(isActive, isHover);
				}
				else if (pluginImage[skinType] && pluginImage[skinType]['default'])
				{
					return pluginImage[skinType]['default'].get(isActive, isHover);
				}
				else if (pluginImage['default']['default'])
				{
					return pluginImage['default']['default'].get(isActive, isHover);
				}
			}

			if (!this.images[type])
				return null;

			return this.images[type].get(isActive);
		};

		this.generateComboImages = function()
		{
			var imageCC = new CCI();
			this.images[AscCommon.CCButtonType.Combo] = imageCC;
			imageCC.type = AscCommon.CCButtonType.Combo;

			var sizes = [20, 25, 30, 35, 40];
			var sizes_count = 2 * sizes.length;
			for (var i = 0; i < sizes_count; i++)
			{
				var index = i >> 1;
				var isActive = (0x01 === (0x01 & i));
				var size = sizes[index];

				var image = document.createElement("canvas");
				image.width = size;
				image.height = size;

				var ctx = image.getContext("2d");
				var data = ctx.createImageData(size, size);
				var px = data.data;

				var len = (size >> 1) - 1;
				var count = (len + 1) >> 1;
				var x = (size - len) >> 1;
				var y = (size - count) >> 1;

				var color = isActive ? 255 : 0;

				while ( len > 0 )
				{
					var ind = 4 * (size * y + x);
					for ( var j = 0; j < len; j++ )
					{
						px[ind++] = color;
						px[ind++] = color;
						px[ind++] = color;
						px[ind++] = 255;
					}

					x += 1;
					y += 1;
					len -= 2;
				}

				ctx.putImageData(data, 0, 0);

				image.asc_complete = true;

				if (isActive)
					imageCC.images_active[index] = image;
				else
					imageCC.images[index] = image;
			}
		};
	}

	var CONTENT_CONTROL_HEADER_MOVER_W = 15;
	var CONTENT_CONTROL_TRACK_H = 20;

	function CContentControlTrack(parent, obj, state, geom)
	{
		if (window["NATIVE_EDITOR_ENJINE"])
			return;

		// contentControls
		this.parent = parent;

		// native contentControl
		this.base = obj;
		this.type = this.base.GetSpecificType();
		this.isForm = this.base.IsForm();
		this.formInfo = null;
		this.state = state;
		this.visualState = - 1;

		this.isFixedForm = this.base.IsFixedForm();

		this.OffsetX = 0;
		this.OffsetY = 0;

		this.transform       = null;
		this.invertTransform = null;

		this.UpdateTransform();

		this.Pos = { X : 0, Y : 0, Page : 0 };

		this.ComboRect = null;
		this.Buttons = []; // header buttons
		this.pluginButtons = [];

		this.Name = this.base.GetAlias();
		if (this.base.IsBuiltInTableOfContents && this.base.IsBuiltInTableOfContents())
			this.Name = AscCommon.translateManager.getValue("Table of Contents");

		this.Color = this.base.GetColor();

		this.HoverButtonIndex = -2; // -1 => Text, otherwise index in this.Buttons
		this.ActiveButtonIndex = -2; // -1 => Text, otherwise index in this.Buttons

		this.IsNoButtons = false;
		if (this.parent.document.m_oWordControl.m_oApi.isViewMode)
			this.IsNoButtons = true;

		this.IsFillFormsMode = false;
		if (this.parent.document.m_oLogicDocument)
			this.IsFillFormsMode = this.parent.document.m_oLogicDocument.IsFillingFormMode();

		this.geom  = undefined;
		this.rects = undefined;
		this.paths = undefined;

		this.UpdateGeom(geom);
	}
	
	CContentControlTrack.prototype.UpdateTransform = function()
	{
		this.OffsetX = 0;
		this.OffsetY = 0;

		this.isFixedForm = this.base.IsFixedForm();
		this.transform   = this.base.Get_ParentTextTransform ? this.base.Get_ParentTextTransform() : null;

		if (this.transform && this.transform.IsIdentity())
			this.transform = null;
		if (this.transform && this.transform.IsIdentity2())
		{
			this.OffsetX = this.transform.tx;
			this.OffsetY = this.transform.ty;
			this.transform = null;
		}
		this.invertTransform = this.transform ? AscCommon.global_MatrixTransformer.Invert(this.transform) : null;
	};
	CContentControlTrack.prototype.UpdateGeom = function(geom)
	{
		this.UpdateTransform();

		this.geom  = geom;
		this.rects = undefined;
		this.paths = undefined;

		if (undefined === geom[0].Points)
			this.rects = geom;
		else
			this.paths = geom;

		this.formInfo = null;
		this.Pos      = { X : 0, Y : 0, Page : 0 };

		this.GetPosition();
		this.CalculateNameRect();
		this.CalculateMoveRect();
		this.CalculateButtons();
	};
	CContentControlTrack.prototype.IsUseMoveRect = function()
	{
		if (this.IsNoButtons || this.IsFillFormsMode || this.isFixedForm)
			return false;
		return true;
	};

	CContentControlTrack.prototype.IsNoUseButtons = function()
	{
		if (this.IsNoButtons)
			return true;
		
		if (this.base && !this.base.CheckOFormUserMaster())
			return true;

		switch (this.type)
		{
			case Asc.c_oAscContentControlSpecificType.TOC:
			{
				if (this.IsFillFormsMode)
					return true;
				return false;
			}
			case Asc.c_oAscContentControlSpecificType.Signature:
			case Asc.c_oAscContentControlSpecificType.Picture:
			case Asc.c_oAscContentControlSpecificType.ComboBox:
			case Asc.c_oAscContentControlSpecificType.DropDownList:
			case Asc.c_oAscContentControlSpecificType.DateTime:
			{
				return false;
			}
			default:
				break;
		}
		return false;
	};

	// является ли имя кнопкой
	CContentControlTrack.prototype.IsNameAdvanced = function()
	{
		if (this.parent.document.m_oWordControl.m_oApi.isViewMode)
			return false;

		if (Asc.c_oAscContentControlSpecificType.TOC === this.type)
			return true;

		return false;
	};
	CContentControlTrack.prototype.fillText = function(ctx, text, x, y, maxWidth)
	{
		if (AscCommon.AscBrowser.isMozilla)
			ctx.fillText(text, x, y, maxWidth);
		else
			ctx.fillText(text, x, y);
	};
	CContentControlTrack.prototype.CalculateNameRectNatural = function()
	{
		return this.parent.measure(this.Name);
	};
	CContentControlTrack.prototype.CalculateNameRect = function(koefX, koefY)
	{
		if (this.Name == "")
			return null;

		var width = this.parent.measure(this.Name);
		width += 6; // 3 + 3

		if (this.IsNameAdvanced() && !this.IsNoUseButtons())
		{
			width += 5;
			width += 3;
		}
		else
		{
			width += 3;
		}

		var rect = {
			X : this.Pos.X,
			Y : this.Pos.Y - CONTENT_CONTROL_TRACK_H / koefY,
			W : width / koefX,
			H : CONTENT_CONTROL_TRACK_H / koefY
		};

		if (!this.IsNoUseButtons())
			rect.X += CONTENT_CONTROL_HEADER_MOVER_W / koefX;

		return rect;
	};
	// расчет области для переноса
	CContentControlTrack.prototype.CalculateMoveRect = function(koefX, koefY, isCheckTrack)
	{
		if (this.IsNoUseButtons() || this.IsFillFormsMode || this.isFixedForm)
		{
			if (true !== isCheckTrack)
				return null;

			var rectEmpty = {
				X : this.Pos.X,
				Y : this.Pos.Y,
				W : 0,
				H : CONTENT_CONTROL_TRACK_H / koefY
			};
			rectEmpty.Y -= rectEmpty.H;
			return rectEmpty;
		}

		var rect = {
			X : this.Pos.X,
			Y : this.Pos.Y,
			W : CONTENT_CONTROL_HEADER_MOVER_W / koefX,
			H : CONTENT_CONTROL_TRACK_H / koefY
		};

		if (this.formInfo && undefined !== this.formInfo.MoveRectH)
		{
			rect.W = CPolygonCC.prototype.rectMoveWidthPx / koefX;
			rect.H = this.formInfo.MoveRectH;
			rect.X -= rect.W;
			return rect;
		}

		if (this.Name == "" && this.Buttons.length == 0)
			rect.X -= rect.W;
		else
			rect.Y -= rect.H;

		return rect;
	};
	// генерация кнопок по типу
	CContentControlTrack.prototype.CalculateButtons = function()
	{
		this.Buttons = [];
		if (this.IsNoUseButtons())
			return;

		switch (this.type)
		{
			case Asc.c_oAscContentControlSpecificType.TOC:
			{
				this.Buttons.push(AscCommon.CCButtonType.Toc);
				break;
			}
			case Asc.c_oAscContentControlSpecificType.Signature:
			{
				this.Buttons.push(AscCommon.CCButtonType.Signature);
				break;
			}
			case Asc.c_oAscContentControlSpecificType.Picture:
			{
				this.Buttons.push(AscCommon.CCButtonType.Image);
				break;
			}
			case Asc.c_oAscContentControlSpecificType.ComboBox:
			case Asc.c_oAscContentControlSpecificType.DropDownList:
			case Asc.c_oAscContentControlSpecificType.DateTime:
			default:
				break;
		}
		
		this.Buttons = this.Buttons.concat(this.pluginButtons);
	};
	CContentControlTrack.prototype.CalculateComboRect = function(koefX, koefY)
	{
		if (this.IsNoUseButtons() || !this.ComboRect)
			return null;

		var rect = {
			X : this.ComboRect.X,
			Y : this.ComboRect.Y,
			W : CONTENT_CONTROL_TRACK_H / koefX,
			H : (this.ComboRect.B - this.ComboRect.Y),
			Page : this.ComboRect.Page
		};
		if (this.formInfo)
		{
			rect.W = CPolygonCC.prototype.rectComboWidthPx / koefX;
		}

		return rect;
	};
	CContentControlTrack.prototype._addToArray = function(arr, x)
	{
		for (var indexA = arr.length - 1; indexA >= 0; indexA--)
		{
			if (Math.abs(x - arr[indexA]) < 0.00001)
				return;
		}
		arr.push(x);
	};
	CContentControlTrack.prototype.GetPosition = function()
	{
		var eps = 0.00001;
		var i, j, count, curRect, curSavedRect;
		var arrY = [];
		var countY = 0;
		var counter2 = 0;
		if (this.rects)
		{
			count = this.rects.length;
			for (i = 0; i < count; i++)
			{
				curRect = this.rects[i];
				counter2 = 0;
				for (j = 0; j < countY; j++)
				{
					curSavedRect = arrY[j];

					// проверяем Y
					if ((0x01 == (0x01 & counter2)) && Math.abs(curSavedRect.Y - curRect.Y) < eps)
					{
						this._addToArray(curSavedRect.allX, curRect.X);
						this._addToArray(curSavedRect.allX, curRect.R);

						if (curSavedRect.X > curRect.X)
							curSavedRect.X = curRect.X;
						if (curSavedRect.R < curRect.R)
							curSavedRect.R = curRect.R;
						counter2 |= 1;
					}
					// проверяем B
					if ((0x02 == (0x02 & counter2)) && Math.abs(curSavedRect.B - curRect.Y) < eps)
					{
						this._addToArray(curSavedRect.allX, curRect.X);
						this._addToArray(curSavedRect.allX, curRect.R);

						if (curSavedRect.X > curRect.X)
							curSavedRect.X = curRect.X;
						if (curSavedRect.R < curRect.R)
							curSavedRect.R = curRect.R;
						counter2 |= 2;
					}
					if (3 == counter2)
						break;
				}

				// добавляем новые
				if (0x01 != (0x01 & counter2))
				{
					arrY.push({ X : curRect.X, R : curRect.R, Y : curRect.Y, Page : curRect.Page, allX : [curRect.X, curRect.R] });
					++countY;
				}
				if ((0x02 != (0x02 & counter2)) && (Math.abs(curRect.B - curRect.Y) > eps))
				{
					arrY.push({ X : curRect.X, R : curRect.R, Y : curRect.B, Page : curRect.Page, allX : [curRect.X, curRect.R] });
					++countY;
				}
			}
		}
		if (this.paths)
		{
			count = this.paths.length;
			var k, page;
			for (i = 0; i < count; i++)
			{
				page = this.paths[i].Page;

				for (k = 0; k < this.paths[i].Points.length; k++)
				{
					curRect = this.paths[i].Points[k];
					counter2 = 0;
					for (j = 0; j < countY; j++)
					{
						curSavedRect = arrY[j];

						// проверяем Y
						if (Math.abs(curSavedRect.Y - curRect.Y) < eps)
						{
							this._addToArray(curSavedRect.allX, curRect.X);

							if (curSavedRect.X > curRect.X)
								curSavedRect.X = curRect.X;
							if (curSavedRect.R < curRect.X)
								curSavedRect.R = curRect.X;
							counter2 = 1;
						}
						if (1 == counter2)
							break;
					}

					// добавляем новый
					if (1 != counter2)
					{
						arrY.push({ X : curRect.X, R : curRect.X, Y : curRect.Y, Page : page, allX : [curRect.X] });
						++countY;
					}
				}
			}
		}
		
		let curPage = this.parent.getCurrentPage();
		arrY.sort(function(a, b){
			if (curPage === a.Page && curPage !== b.Page)
				return -1;
			else if (curPage !== a.Page && curPage !== b.Page)
				return 1;
			else if (a.Page !== b.Page)
				return a.Page - b.Page;
			
			return a.Y - b.Y;
		});

		if (arrY.length > 0)
		{
			this.Pos.X = arrY[0].X;
			this.Pos.Y = arrY[0].Y;
			this.Pos.Page = arrY[0].Page;
		}

		// ComboRect
		if (!this.IsNoUseButtons())
		{
			switch (this.type)
			{
				case Asc.c_oAscContentControlSpecificType.ComboBox:
				case Asc.c_oAscContentControlSpecificType.DropDownList:
				case Asc.c_oAscContentControlSpecificType.DateTime:
				{
					var len = arrY.length;
					if (len > 0)
					{
						this.ComboRect = { X : arrY[len - 1].R, Y : arrY[len - 1].Y, B : arrY[len - 1].Y, Page : arrY[len - 1].Page };
						for (i = len - 2; i >= 0; i--)
						{
							if (this.ComboRect.Page != arrY[i].Page || Math.abs(this.ComboRect.X - arrY[i].R) > eps || arrY[i].allX.length > 2)
								break;
						}
						if (i == (len - 1)) i--;
						if (i < 0) i = 0;

						if (i >= 0)
							this.ComboRect.Y = arrY[i].Y;
					}
					break;
				}
				default:
					break;
			}
		}

		if (this.isForm)
		{
			this.formInfo = {};
			var _geom, _polygonDrawer;
			if (this.rects)
			{
				_geom = this.rects[0];
				_polygonDrawer = new CPolygonCC();
				_polygonDrawer.init(this, AscCommon.g_dKoef_mm_to_pix, 0, 1);

				_polygonDrawer.moveTo(_geom.R, _geom.Y);
				_polygonDrawer.lineTo(_geom.X, _geom.Y);
				_polygonDrawer.lineTo(_geom.X, _geom.B);
				_polygonDrawer.lineTo(_geom.R, _geom.B);
				_polygonDrawer.closePath();
				this.formInfo.MoveRectH = _polygonDrawer.rectMove ? _polygonDrawer.rectMove.h : 0;
				this.formInfo.bounds = _polygonDrawer.bounds;
			}
			else if (this.paths)
			{
				_geom = this.paths[0];

				_polygonDrawer = new CPolygonCC();
				_polygonDrawer.init(this, AscCommon.g_dKoef_mm_to_pix, 0, 1);

				for (var pointIndex = 0, pointCount = _geom.Points.length; pointIndex < pointCount; pointIndex++)
				{
					_polygonDrawer.lineTo(_geom.Points[pointIndex].X, _geom.Points[pointIndex].Y);
				}
				_polygonDrawer.closePath();
				this.formInfo.MoveRectH = _polygonDrawer.rectMove ? _polygonDrawer.rectMove.h : 0;
				this.formInfo.bounds = _polygonDrawer.bounds;
			}
		}
	};
	CContentControlTrack.prototype.GetButtonObj = function(indexButton)
	{
		var button = AscCommon.CCButtonType.Name;
		if (indexButton >= 0 && indexButton < this.Buttons.length)
			button = this.Buttons[indexButton];
		if (indexButton == this.Buttons.length)
		{
			switch (this.type)
			{
				case Asc.c_oAscContentControlSpecificType.ComboBox:
				case Asc.c_oAscContentControlSpecificType.DropDownList:
				{
					button = AscCommon.CCButtonType.Combo;
					break;
				}
				case Asc.c_oAscContentControlSpecificType.DateTime:
				{
					button = AscCommon.CCButtonType.Date;
					break;
				}
			}
		}

		return new Asc.CButtonData( {
			"obj" : this.base,
			"type" : this.type,
			"button" : button,
			"isForm" : this.isForm,
			"pr" : this.base.GetContentControlPr ? this.base.GetContentControlPr() : null
		});
	};
	CContentControlTrack.prototype.Copy = function()
	{
		let newCCTrack = new CContentControlTrack(this.parent, this.base, this.state, this.geom);
		newCCTrack.pluginButtons = this.pluginButtons.slice();
		newCCTrack.visualState   = this.visualState;
		return newCCTrack;
	};

	CContentControlTrack.prototype.isFormFullOneButtonHover = function()
	{
		return (!this.IsNoUseButtons()
			&& this.formInfo
			&& (Asc.c_oAscContentControlSpecificType.Picture === this.type || Asc.c_oAscContentControlSpecificType.Signature === this.type));
	};
	CContentControlTrack.prototype.isHitInMoveRect = function(xPos, yPos, koefX, koefY)
	{
		let rectMove = this.CalculateMoveRect(koefX, koefY, true);
		return (rectMove && rectMove.W > 0.001 && xPos > rectMove.X && xPos < (rectMove.X + rectMove.W) && yPos > rectMove.Y && yPos < (rectMove.Y + rectMove.H))
	};
	CContentControlTrack.prototype.isHitInNameRect = function(xPos, yPos, koefX, koefY)
	{
		let rectName = this.IsNameAdvanced() ? this.CalculateNameRect(koefX, koefY) : null;
		return (rectName && xPos > rectName.X && xPos < (rectName.X + rectName.W) && yPos > rectName.Y && yPos < (rectName.Y + rectName.H))
	};
	CContentControlTrack.prototype.isHitInComboRect = function(xPos, yPos, koefX, koefY)
	{
		let rectCombo = this.CalculateComboRect(koefX, koefY);
		return (rectCombo && xPos > rectCombo.X && xPos < (rectCombo.X + rectCombo.W) && yPos > rectCombo.Y && yPos < (rectCombo.Y + rectCombo.H));
	};
	CContentControlTrack.prototype.getButton = function(xPos, yPos, koefX, koefY)
	{
		if (!this.Buttons.length)
			return null;
		
		var indexButton = -1;
		
		var x, y, w, h;
		let resX = 0, resY = 0;
		if (this.formInfo)
		{
			if (this.isFormFullOneButtonHover())
			{
				x = this.formInfo.bounds.x;
				y = this.formInfo.bounds.y;
				w = this.formInfo.bounds.w;
				h = this.formInfo.bounds.h;
			}
			else
			{
				w = CONTENT_CONTROL_TRACK_H / koefX;
				h = CONTENT_CONTROL_TRACK_H / koefY;
				
				x = this.formInfo.bounds.x + (this.formInfo.bounds.w - w) / 2;
				y = this.formInfo.bounds.y + (this.formInfo.bounds.h - h) / 2;
			}
			
			if (xPos > x && xPos < (x + w) && yPos > y && yPos < (y + h))
			{
				indexButton = 0;
				resX = x;
				resY = y + h;
			}
		}
		else
		{
			let rectOrigin = this.CalculateNameRect(koefX, koefY) || this.CalculateMoveRect(koefX, koefY);
			if (!rectOrigin)
				return null;
			
			x = rectOrigin.X + rectOrigin.W;
			y = rectOrigin.Y;
			w = CONTENT_CONTROL_TRACK_H / koefX;
			h = CONTENT_CONTROL_TRACK_H / koefY;
			
			for (var indexB = 0; indexB < this.Buttons.length; indexB++)
			{
				if (xPos > x && xPos < (x + w) && yPos > y && yPos < (y + h))
				{
					resX = x + this.OffsetX;
					resY = rectOrigin.Y + rectOrigin.H + this.OffsetY;
					indexButton = indexB;
					break;
				}
				x += w;
			}
		}
		
		if (-1 === indexButton)
			return null;
		
		return {
			index : indexButton,
			x : resX,
			y : resY,
			button : this.Buttons[indexButton]
		};
	};
	CContentControlTrack.prototype.isEqual = function(track)
	{
		if (this.base.GetId() !== track.base.GetId())
			return false;
		
		if (this.state !== track.state)
			return false;
		
		if (this.rects && track.rects)
		{
			let count1 = this.rects.length;
			let count2 = track.rects.length;
			
			if (count1 !== count2)
				return false;
			
			for (let j = 0; j < count1; ++j)
			{
				if (this.rects[j].Page !== track.rects[j].Page
					|| Math.abs(this.rects[j].X - track.rects[j].X) > 0.00001
					|| Math.abs(this.rects[j].Y - track.rects[j].Y) > 0.00001
					|| Math.abs(this.rects[j].R - track.rects[j].R) > 0.00001
					|| Math.abs(this.rects[j].B - track.rects[j].B) > 0.00001)
				{
					return false;
				}
			}
		}
		else if (this.path && track.path)
		{
			let count1 = this.paths.length;
			let count2 = track.paths.length;
			
			if (count1 !== count2)
				return false;
			
			for (var j = 0; j < count1; j++)
			{
				if (this.paths[j].Page !== track.paths[j].Page)
					return false;
				
				let _points1 = this.paths[j].Points;
				let _points2 = track.paths[j].Points;
				
				if (_points1.length !== _points2.length)
					return false;
				
				for (var k = 0; k < _points1.length; k++)
				{
					if (Math.abs(_points1[k].X - _points2[k].X) > 0.00001 || Math.abs(_points1[k].Y - _points2[k].Y) > 0.00001)
						return false;
				}
			}
		}
		else
		{
			return false;
		}
		
		return true;
	};
	CContentControlTrack.prototype.addPluginButtons = function(buttons, pluginGuid, baseUrl)
	{
		let result = 0;
		for (let i = 0; i < buttons.length; ++i)
		{
			let buttonId = buttons[i]["id"];
			if (this.pluginButtons.includes(buttonId))
				continue;
			
			this.parent.registerPluginButton(buttons[i], pluginGuid, baseUrl);
			
			this.Buttons.push(buttonId);
			this.pluginButtons.push(buttonId);
			result += 1;
		}
		return result;
	};
	CContentControlTrack.prototype.isPluginButton = function(buttonId)
	{
		return this.pluginButtons.includes(buttonId);
	};
	CContentControlTrack.prototype.isPluginButtonActive = function()
	{
		let index = this.ActiveButtonIndex;
		if (index < 0 || index >= this.Buttons.length)
			return false;
		
		return this.isPluginButton(this.Buttons[index]);
	};
	CContentControlTrack.prototype.removePluginButton = function(buttonId)
	{
		let pos = this.Buttons.indexOf(buttonId);
		if (-1 !== pos)
			this.Buttons.splice(pos, 1);
		
		pos = this.pluginButtons.indexOf(buttonId);
		if (-1 !== pos)
			this.pluginButtons.splice(pos, 1);
	};

	// draw methods
	CContentControlTrack.prototype.SetColor = function(ctx)
	{
		if (this.Color)
		{
			ctx.strokeStyle = "rgba(" + this.Color.r + ", " + this.Color.g + ", " + this.Color.b + ", 1)";
			ctx.fillStyle = "rgba(" + this.Color.r + ", " + this.Color.g + ", " + this.Color.b + ", 0.25)";
		}
		else
		{
			ctx.strokeStyle = "#ADADAD";
			ctx.fillStyle = "rgba(205, 205, 205, 0.5)";
		}
	};

	function ContentControls(drDocument)
	{
		this.document = drDocument;

		this.icons = new CCIcons();
		this.icons.register(AscCommon.CCButtonType.Toc, "toc");
		this.icons.register(AscCommon.CCButtonType.Image, "img");
		this.icons.registerNoActive(AscCommon.CCButtonType.Signature, "signature");
		this.icons.generateComboImages();

		this.ContentControlObjects = [];
		this.ContentControlObjectsLast = [];
		this.ContentControlSmallChangesCheck = { X: 0, Y: 0, Page: 0, Min: 2, IsSmall : true };
		this.lastActive = null;
		this.lastHover  = null;
		this.lastInline = null;

		this.measures = {};

		this.pluginButtons = {};

		this.clearAttack = function()
		{
			this.ContentControlObjects = [];
			this.ContentControlObjectsLast = [];
		};
		
		this.addPluginButtons = function(pluginButtons)
		{
			let pluginGuid = pluginButtons["guid"];
			let baseUrl    = pluginButtons["baseUrl"];
			let items      = pluginButtons["items"];

			let added = 0;
			for (let ccId in items)
			{
				let buttons = items[ccId];
				for (let i = 0; i < this.ContentControlObjects.length; i++)
				{
					let ccTrack = this.ContentControlObjects[i];
					if (ccTrack.base.GetId() === ccId)
					{
						added += ccTrack.addPluginButtons(buttons, pluginGuid, baseUrl);
						break;
					}
				}
			}
			
			if (added)
				this.updateOverlay();
		};
		
		this.registerPluginButton = function(button, pluginGuid, baseUrl)
		{
			if (!this.pluginButtons[pluginGuid])
				this.pluginButtons[pluginGuid] = {};
			
			let buttonId = button["id"];
			if (this.pluginButtons[pluginGuid][buttonId])
				return;
			
			this.pluginButtons[pluginGuid][buttonId] = true;
			let icons = AscCommon.IconsStr2IconsObj(button["icons"]);
			this.icons.registerIconObj(button["id"], icons, baseUrl);
		};
		
		this.onClickPluginButton = function(buttonId, ccTrack)
		{
			if (!ccTrack || !ccTrack.base)
				return;
			
			window.g_asc_plugins.onPluginEvent2(
				"onContentControlButtonClick",
				{
					"buttonId": buttonId,
					"contentControlId": ccTrack.base.GetId()
				}
			);
		};
		
		this.removePluginButtons = function(pluginGuid)
		{
			if (!this.pluginButtons[pluginGuid])
				return;
			
			for (let buttonId in this.pluginButtons[pluginGuid])
			{
				for (let i = 0, len = this.ContentControlObjects.length; i < len; ++i)
				{
					let ccTrack = this.ContentControlObjects[i];
					if (AscCommon.ContentControlTrack.In === ccTrack.state)
						ccTrack.removePluginButton(buttonId);
				}
			}
			
			delete this.pluginButtons[pluginGuid];
			this.updateOverlay();
		};

		this.getFont = function(koef)
		{
			if (!koef)
				return "11px Helvetica, Arial, sans-serif";
			var size = (1 + 2 * 11 / koef) >> 0;
			if (size & 1)
				return (size >> 1) + ".5px Helvetica, Arial, sans-serif";
			return (size >> 1) + "px Helvetica, Arial, sans-serif";
		};

		this.measure = function(text)
		{
			if (!this.measures[text])
			{
				var ctx = this.document.CanvasHitContext;
				ctx.font = "11px Helvetica, Arial, sans-serif";

				this.measures[text] = ctx.measureText(text).width;
			}

			return this.measures[text];
		};

		// сохранение текущих в последние
		// вызывается в конце метода DrawContentControlsTrack
		this.ContentControlsSaveLast = function()
		{
			this.ContentControlObjectsLast = [];
			for (var i = 0; i < this.ContentControlObjects.length; i++)
			{
				this.ContentControlObjectsLast.push(this.ContentControlObjects[i].Copy());
			}
		};

		// совпадают ли текущие с последними? (true не совпадают)
		// вызывается на onPointerMove, если никаких других причин для обновления интерфейса нет - то
		// смотрим, сменилось ли тут чего-то
		this.ContentControlsCheckLast = function()
		{
			let _len1 = this.ContentControlObjects.length;
			let _len2 = this.ContentControlObjectsLast.length;

			if (_len1 !== _len2)
				return true;

			for (var i = 0; i < _len1; i++)
			{
				let _obj1 = this.ContentControlObjects[i];
				let _obj2 = this.ContentControlObjectsLast[i];
				
				if (!_obj1.isEqual(_obj2))
					return true;
			}

			return false;
		};
		
		this._getContentControlsForTrackIn = function(tracks)
		{
			let result = {};
			for (let i = 0, len = tracks.length; i < len; ++i)
			{
				if (AscCommon.ContentControlTrack.In === tracks[i].state)
					result[tracks[i].base.GetId()] = tracks[i].base;
			}
			return result;
		};
		
		this.sendShowHidePluginEvent = function()
		{
			let prev = this._getContentControlsForTrackIn(this.lastTracks);
			let curr = this._getContentControlsForTrackIn(this.ContentControlObjects);
			
			let hide = [];
			for (let id in prev)
			{
				if (!curr[id])
					hide.push(id);
			}
			
			let show = [];
			for (let id in curr)
			{
				if (!prev[id])
					show.push(id);
			}
			
			if (hide.length)
				window.g_asc_plugins.onPluginEvent("onHideContentControlTrack", hide);
			
			if (show.length)
				window.g_asc_plugins.onPluginEvent("onShowContentControlTrack", show);
		};
		
		this.onAttachPluginEvent = function(pluginGuid)
		{
			let controls = Object.keys(this._getContentControlsForTrackIn(this.ContentControlObjects));
			
			let guids = {};
			guids[pluginGuid] = true;
			
			if (controls.length)
				window.g_asc_plugins.onPluginEvent2("onShowContentControlTrack", controls, guids);
		};

		// отрисовка
		this.DrawContentControlsTrack = function(overlay)
		{
			var ctx = overlay.m_oContext;

			var _object;
			var _pages = this.document.m_arrPages;
			var _drawingPage;
			var _pageStart = this.document.m_lDrawingFirst;
			var _pageEnd = this.document.m_lDrawingEnd;
			var _geom;
			if (_pageStart < 0)
				return;
			
			var _x, _y, _r, _b;
			var _koefX = (_pages[_pageStart].drawingPage.right - _pages[_pageStart].drawingPage.left) / _pages[_pageStart].width_mm;
			var _koefY = (_pages[_pageStart].drawingPage.bottom - _pages[_pageStart].drawingPage.top) / _pages[_pageStart].height_mm;
			var rPR = AscCommon.AscBrowser.retinaPixelRatio;

			let arrDraw = [];

			for (var nIndexContentControl = 0; nIndexContentControl < this.ContentControlObjects.length; nIndexContentControl++)
			{
				_object = this.ContentControlObjects[nIndexContentControl];
				_object.SetColor(ctx);
				ctx.lineWidth = Math.round(rPR);

				if (!_object.isForm)
				{
					if (!_object.transform)
					{
						if (_object.rects)
						{
							for (var j = 0; j < _object.rects.length; j++)
							{
								_geom = _object.rects[j];

								if (_geom.Page < _pageStart || _geom.Page > _pageEnd)
									continue;

								_drawingPage = _pages[_geom.Page].drawingPage;

								ctx.beginPath();

								_x = (_drawingPage.left + _koefX * (_geom.X + _object.OffsetX)) * rPR;
								_y = (_drawingPage.top  + _koefY * (_geom.Y + _object.OffsetY)) * rPR;
								_r = (_drawingPage.left + _koefX * (_geom.R + _object.OffsetX)) * rPR;
								_b = (_drawingPage.top  + _koefY * (_geom.B + _object.OffsetY)) * rPR;

								overlay.CheckRect(_x, _y, _r - _x, _b - _y);
								ctx.rect((_x >> 0) + 0.5 * Math.round(rPR), (_y >> 0) + 0.5 * Math.round(rPR), (_r - _x) >> 0, (_b - _y) >> 0);

								if (_object.state == AscCommon.ContentControlTrack.Hover)
									ctx.fill();
								ctx.stroke();

								ctx.beginPath();
							}
						}
						else if (_object.paths)
						{
							for (var j = 0; j < _object.paths.length; j++)
							{
								_geom = _object.paths[j];
								if (_geom.Page < _pageStart || _geom.Page > _pageEnd)
									continue;

								_drawingPage = _pages[_geom.Page].drawingPage;

								ctx.beginPath();

								for (var pointIndex = 0, pointCount = _geom.Points.length; pointIndex < pointCount; pointIndex++)
								{
									_x = (_drawingPage.left + _koefX * (_geom.Points[pointIndex].X + _object.OffsetX)) * rPR;
									_y = (_drawingPage.top  + _koefY * (_geom.Points[pointIndex].Y + _object.OffsetY)) * rPR;

									overlay.CheckPoint(_x, _y);

									_x = (_x >> 0) + 0.5 * Math.round(rPR);
									_y = (_y >> 0) + 0.5 * Math.round(rPR);

									if (0 == pointCount)
										ctx.moveTo(_x, _y);
									else
										ctx.lineTo(_x, _y);
								}

								ctx.closePath();

								if (_object.state == AscCommon.ContentControlTrack.Hover)
									ctx.fill();
								ctx.stroke();

								ctx.beginPath();
							}
						}
					}
					else
					{
						if (_object.rects)
						{
							for (var j = 0; j < _object.rects.length; j++)
							{
								_geom = _object.rects[j];

								if (_geom.Page < _pageStart || _geom.Page > _pageEnd)
									continue;

								_drawingPage = _pages[_geom.Page].drawingPage;

								var x1 = _object.transform.TransformPointX(_geom.X, _geom.Y);
								var y1 = _object.transform.TransformPointY(_geom.X, _geom.Y);
								var x2 = _object.transform.TransformPointX(_geom.R, _geom.Y);
								var y2 = _object.transform.TransformPointY(_geom.R, _geom.Y);
								var x3 = _object.transform.TransformPointX(_geom.R, _geom.B);
								var y3 = _object.transform.TransformPointY(_geom.R, _geom.B);
								var x4 = _object.transform.TransformPointX(_geom.X, _geom.B);
								var y4 = _object.transform.TransformPointY(_geom.X, _geom.B);

								x1 = (_drawingPage.left + _koefX * x1) * rPR;
								x2 = (_drawingPage.left + _koefX * x2) * rPR;
								x3 = (_drawingPage.left + _koefX * x3) * rPR;
								x4 = (_drawingPage.left + _koefX * x4) * rPR;

								y1 = (_drawingPage.top + _koefY * y1) * rPR;
								y2 = (_drawingPage.top + _koefY * y2) * rPR;
								y3 = (_drawingPage.top + _koefY * y3) * rPR;
								y4 = (_drawingPage.top + _koefY * y4) * rPR;

								ctx.beginPath();

								overlay.CheckPoint(x1, y1);
								overlay.CheckPoint(x2, y2);
								overlay.CheckPoint(x3, y3);
								overlay.CheckPoint(x4, y4);

								ctx.moveTo(x1, y1);
								ctx.lineTo(x2, y2);
								ctx.lineTo(x3, y3);
								ctx.lineTo(x4, y4);
								ctx.closePath();

								if (_object.state == AscCommon.ContentControlTrack.Hover)
									ctx.fill();
								ctx.stroke();

								ctx.beginPath();
							}
						}
						else if (_object.paths)
						{
							for (var j = 0; j < _object.paths.length; j++)
							{
								_geom = _object.paths[j];
								if (_geom.Page < _pageStart || _geom.Page > _pageEnd)
									continue;

								_drawingPage = _pages[_geom.Page].drawingPage;

								ctx.beginPath();

								for (var pointIndex = 0, pointCount = _geom.Points.length; pointIndex < pointCount; pointIndex++)
								{
									_x = _object.transform.TransformPointX(_geom.Points[pointIndex].X, _geom.Points[pointIndex].Y);
									_y = _object.transform.TransformPointY(_geom.Points[pointIndex].X, _geom.Points[pointIndex].Y);

									_x = (_drawingPage.left + _koefX * _x) * rPR;
									_y = (_drawingPage.top + _koefY * _y) * rPR;

									overlay.CheckPoint(_x, _y);

									if (0 == pointCount)
										ctx.moveTo(_x, _y);
									else
										ctx.lineTo(_x, _y);
								}

								ctx.closePath();

								if (_object.state == AscCommon.ContentControlTrack.Hover)
									ctx.fill();
								ctx.stroke();

								ctx.beginPath();
							}
						}
					}
				}
				else
				{
					if (_object.rects)
					{
						for (var j = 0; j < _object.rects.length; j++)
						{
							_geom = _object.rects[j];

							if (_geom.Page < _pageStart || _geom.Page > _pageEnd)
								continue;

							_drawingPage = _pages[_geom.Page].drawingPage;

							var _polygonDrawer = new CPolygonCC();
							_polygonDrawer.init(_object, (_koefX + _koefY) / 2, j, _object.rects.length);

							_polygonDrawer.moveTo(_geom.R, _geom.Y);
							_polygonDrawer.lineTo(_geom.X, _geom.Y);
							_polygonDrawer.lineTo(_geom.X, _geom.B);
							_polygonDrawer.lineTo(_geom.R, _geom.B);
							_polygonDrawer.closePath();

							_polygonDrawer.draw(overlay, _object, _drawingPage, _koefX, _koefY, this.icons);
						}
					}
					else if (_object.paths)
					{
						for (var j = 0; j < _object.paths.length; j++)
						{
							_geom = _object.paths[j];
							if (_geom.Page < _pageStart || _geom.Page > _pageEnd)
								continue;

							_drawingPage = _pages[_geom.Page].drawingPage;

							var _polygonDrawer = new CPolygonCC();
							_polygonDrawer.init(_object, (_koefX + _koefY) / 2, j, _object.paths.length);
							for (var pointIndex = 0, pointCount = _geom.Points.length; pointIndex < pointCount; pointIndex++)
							{
								_polygonDrawer.lineTo(_geom.Points[pointIndex].X, _geom.Points[pointIndex].Y);
							}
							_polygonDrawer.closePath();

							_polygonDrawer.draw(overlay, _object, _drawingPage, _koefX, _koefY, this.icons);
						}
					}
				}

				if (_object.state == AscCommon.ContentControlTrack.In && !_object.isForm)
				{
					let cctw = Math.round(CONTENT_CONTROL_TRACK_H * rPR);

					// draw header
					if (_object.Pos.Page >= _pageStart && _object.Pos.Page <= _pageEnd)
					{
						_drawingPage = _pages[_object.Pos.Page].drawingPage;
						if (!_object.transform)
						{
							_x = (((_drawingPage.left + _koefX * (_object.Pos.X + _object.OffsetX)) * rPR) >> 0) + 0.5 * Math.round(rPR);
							_y = (((_drawingPage.top + _koefY * (_object.Pos.Y + _object.OffsetY)) * rPR) >> 0) + 0.5 * Math.round(rPR);

							if (_object.Name != "" || 0 != _object.Buttons.length)
								_y -= cctw;
							else
								_x -= Math.round(CONTENT_CONTROL_HEADER_MOVER_W * rPR);

							var widthName = 0;
							if (_object.Name != "")
								widthName = ((_object.CalculateNameRect(_koefX, _koefY).W * _koefX) * rPR) >> 0;

							var widthHeader = (widthName + CONTENT_CONTROL_TRACK_H * _object.Buttons.length * rPR) >> 0 ;
							var xText = _x;

							if (_object.IsUseMoveRect())
							{
								widthHeader += Math.round(CONTENT_CONTROL_HEADER_MOVER_W * rPR);
								xText += Math.round(CONTENT_CONTROL_HEADER_MOVER_W * rPR);
							}

							if (0 != widthHeader)
							{
								// сразу чекаем весь хедер
								overlay.CheckRect(_x, _y, widthHeader, cctw);

								// рисуем подложку
								ctx.fillStyle = AscCommon.GlobalSkin.ContentControlsBack;
								ctx.rect(_x, _y, widthHeader, cctw);
								ctx.fill();
								ctx.beginPath();

								// draw mover in header
								if (_object.IsUseMoveRect())
								{
									ctx.rect(_x, _y, Math.round(CONTENT_CONTROL_HEADER_MOVER_W * rPR), cctw);
									ctx.fillStyle = (1 === _object.visualState) ? AscCommon.GlobalSkin.ContentControlsAnchorActive : AscCommon.GlobalSkin.ContentControlsBack;
									ctx.fill();
									ctx.beginPath();

									var cx = _x - 0.5 * Math.round(rPR) + Math.round(5 * rPR);
									var cy = _y - 0.5 * Math.round(rPR) + Math.round(5 * rPR);

									var px3 = Math.round(2 * rPR);
									var px5 = Math.round(4 * rPR);
									var px10 = Math.round(8 * rPR);

									var _color = "#ADADAD";
									if (0 === _object.visualState || 1 === _object.visualState)
										_color = "#444444";

									overlay.AddRect(cx, cy, px3, px3);
									overlay.AddRect(cx, cy + px5, px3, px3);
									overlay.AddRect(cx, cy + px10, px3, px3);
									overlay.AddRect(cx + px5, cy, px3, px3);
									overlay.AddRect(cx + px5, cy + px5, px3, px3);
									overlay.AddRect(cx + px5, cy + px10, px3, px3);

									ctx.fillStyle = _color;
									ctx.fill();
									ctx.beginPath();
								}

								// draw name
								if (_object.Name != "")
								{
									if (_object.ActiveButtonIndex == -1)
										ctx.fillStyle = AscCommon.GlobalSkin.ContentControlsActive;
									else if (_object.HoverButtonIndex == -1)
										ctx.fillStyle = AscCommon.GlobalSkin.ContentControlsHover;
									else
										ctx.fillStyle = AscCommon.GlobalSkin.ContentControlsBack;

									ctx.rect(xText, _y, widthName, cctw);
									ctx.fill();
									ctx.beginPath();

									ctx.fillStyle = (_object.ActiveButtonIndex == -1) ? AscCommon.GlobalSkin.ContentControlsTextActive : AscCommon.GlobalSkin.ContentControlsText;
									ctx.font = Math.round(11 * rPR) + "px Helvetica, Arial, sans-serif";
									
									let _textShift = ctx.direction === "rtl" ? _object.CalculateNameRectNatural() * rPR : 0;
									_object.fillText(ctx, _object.Name, xText + Math.round(3 * rPR) + _textShift, _y + cctw - Math.round(6 * rPR), _object.CalculateNameRectNatural() * rPR);

									if (_object.IsNameAdvanced() && !_object.IsNoUseButtons())
									{
										var nY = _y - 0.5 * Math.round(rPR);
										nY += Math.round(10 * rPR);
										nY -= Math.round(rPR);

										var plus = AscCommon.AscBrowser.isCustomScalingAbove2() ? 0.5 * (rPR >> 0): (rPR >> 0);
										ctx.lineWidth = Math.round(rPR);
										var nX = (xText + widthName - (7 * rPR >> 0)) >> 0;
										for (var i = 0; i <=  (2 * rPR >> 0); i+=plus)
											ctx.rect(nX + i, nY + i, Math.round(rPR), Math.round(rPR));

										for (var i = 0; i <=  (2 * rPR >> 0); i+=plus)
											ctx.rect(nX + Math.round(4 * rPR) - i, nY + i, Math.round(rPR), Math.round(rPR));

										ctx.fill();
										ctx.beginPath();
									}
								}

								// draw buttons
								for (var nIndexB = 0; nIndexB < _object.Buttons.length; nIndexB++)
								{
									if (_object.Buttons[nIndexB] === AscCommon.CCButtonType.Signature)
										continue;
									
									var isFill = false;
									if (_object.ActiveButtonIndex == nIndexB)
									{
										ctx.fillStyle = AscCommon.GlobalSkin.ContentControlsActive;
										isFill = true;
									}
									else if (_object.HoverButtonIndex == nIndexB)
									{
										ctx.fillStyle = AscCommon.GlobalSkin.ContentControlsHover;
										isFill = true;
									}

									if (isFill)
									{
										ctx.rect(xText + widthName + rPR * CONTENT_CONTROL_TRACK_H * nIndexB, _y, cctw, cctw);
										ctx.fill();
										ctx.beginPath();
									}

									var image = this.icons.getImage(_object.Buttons[nIndexB], nIndexB == _object.ActiveButtonIndex, nIndexB === _object.HoverButtonIndex);
									if (image)
										ctx.drawImage(image, (xText + widthName + rPR * CONTENT_CONTROL_TRACK_H * nIndexB) >> 0, _y >> 0, cctw, cctw);
								}

								// рисуем единую обводку
								_object.SetColor(ctx);
								ctx.beginPath();
								ctx.rect(_x, _y, widthHeader, cctw);
								ctx.stroke();
								ctx.beginPath();

								if (!arrDraw.includes(_object.base.GetId()))
								{
									arrDraw.push(_object.base.GetId());
								}
							}

							// есть ли комбо-кнопка?
							if (_object.ComboRect)
							{
								_x = (((_drawingPage.left + _koefX * (_object.ComboRect.X + _object.OffsetX)) * rPR) >> 0) + 0.5 * Math.round(rPR);
								_y = (((_drawingPage.top  + _koefY * (_object.ComboRect.Y + _object.OffsetY)) * rPR) >> 0) + 0.5 * Math.round(rPR);
								_b = (((_drawingPage.top  + _koefY * (_object.ComboRect.B + _object.OffsetY)) * rPR) >> 0) + 0.5 * Math.round(rPR);
								var nIndexB = _object.Buttons.length;

								ctx.beginPath();
								ctx.rect(_x, _y, cctw, _b - _y);
								overlay.CheckRect(_x, _y, cctw, _b - _y);
								if (_object.ActiveButtonIndex == nIndexB)
									ctx.fillStyle = AscCommon.GlobalSkin.ContentControlsActive;
								else if (_object.HoverButtonIndex == nIndexB)
									ctx.fillStyle = AscCommon.GlobalSkin.ContentControlsHover;
								else
									ctx.fillStyle = AscCommon.GlobalSkin.ContentControlsBack;

								ctx.fill();
								ctx.stroke();
								ctx.beginPath();

								var image = this.icons.getImage(AscCommon.CCButtonType.Combo, _object.Buttons.length == _object.ActiveButtonIndex);
								if (image && Math.round(7 * rPR) < (_b - _y))
									ctx.drawImage(image, _x + 0.5 * Math.round(rPR), _y + 1.5 * Math.round(rPR) + ((_b - _y - cctw) >> 1), cctw, cctw);
							}
						}
						else
						{
							var _ft = _object.transform.CreateDublicate();

							var coords = new AscCommon.CMatrix();
							coords.sx = _koefX * rPR;
							coords.sy = _koefY * rPR;
							coords.tx = _drawingPage.left * rPR;
							coords.ty = _drawingPage.top * rPR;
							global_MatrixTransformer.MultiplyAppend(_ft, coords);
							ctx.transform(_ft.sx, _ft.shy, _ft.shx, _ft.sy, _ft.tx, _ft.ty);

							var scaleX_15 = CONTENT_CONTROL_HEADER_MOVER_W / _koefX;
							var scaleX_20 = CONTENT_CONTROL_TRACK_H / _koefX;
							var scaleY_20 = CONTENT_CONTROL_TRACK_H / _koefY;

							// check overlay bounds ----------
							_x = _object.Pos.X - scaleX_15;
							_y = _object.Pos.Y;

							if (_object.Name != "" || 0 != _object.Buttons.length)
							{
								_x = _object.Pos.X;
								_y = _object.Pos.Y - scaleY_20;
							}

							var widthName = 0;
							if (_object.Name != "")
								widthName = _object.CalculateNameRect(_koefX, _koefY).W;

							var widthHeader = widthName + scaleX_20 * _object.Buttons.length;
							var xText = _x;

							if (_object.IsUseMoveRect())
							{
								widthHeader += scaleX_15;
								xText += scaleX_15;
							}

							if (widthHeader > 0.001)
							{
								_r = _x + widthHeader;
								_b = _y + scaleY_20;

								var x1 = _ft.TransformPointX(_x, _y);
								var y1 = _ft.TransformPointY(_x, _y);
								var x2 = _ft.TransformPointX(_r, _y);
								var y2 = _ft.TransformPointY(_r, _y);
								var x3 = _ft.TransformPointX(_r, _b);
								var y3 = _ft.TransformPointY(_r, _b);
								var x4 = _ft.TransformPointX(_x, _b);
								var y4 = _ft.TransformPointY(_x, _b);

								x1 = _drawingPage.left + _koefX * x1;
								x2 = _drawingPage.left + _koefX * x2;
								x3 = _drawingPage.left + _koefX * x3;
								x4 = _drawingPage.left + _koefX * x4;
								y1 = _drawingPage.top + _koefY * y1;
								y2 = _drawingPage.top + _koefY * y2;
								y3 = _drawingPage.top + _koefY * y3;
								y4 = _drawingPage.top + _koefY * y4;

								overlay.CheckPoint(x1, y1);
								overlay.CheckPoint(x2, y2);
								overlay.CheckPoint(x3, y3);
								overlay.CheckPoint(x4, y4);
								// --------------------------------

								// рисуем подложку
								ctx.fillStyle = AscCommon.GlobalSkin.ContentControlsBack;
								ctx.rect(_x, _y, widthHeader, scaleY_20);
								ctx.fill();
								ctx.beginPath();

								// draw mover
								if (_object.IsUseMoveRect())
								{
									ctx.rect(_x, _y, scaleX_15, scaleY_20);
									ctx.fillStyle = (1 === _object.visualState) ? AscCommon.GlobalSkin.ContentControlsAnchorActive : AscCommon.GlobalSkin.ContentControlsBack;
									ctx.fill();
									ctx.beginPath();

									var cx1 = _x + 5 / _koefX;
									var cy1 = _y + 5 / _koefY;
									var cx2 = _x + 10 / _koefX;
									var cy2 = _y + 5 / _koefY;

									var cx3 = _x + 5 / _koefX;
									var cy3 = _y + 10 / _koefY;
									var cx4 = _x + 10 / _koefX;
									var cy4 = _y + 10 / _koefY;

									var cx5 = _x + 5 / _koefX;
									var cy5 = _y + CONTENT_CONTROL_HEADER_MOVER_W / _koefY;
									var cx6 = _x + 10 / _koefX;
									var cy6 = _y + CONTENT_CONTROL_HEADER_MOVER_W / _koefY;

									var rad = 1.5 / _koefX;
									overlay.AddEllipse2(cx1, cy1, rad);
									overlay.AddEllipse2(cx2, cy2, rad);
									overlay.AddEllipse2(cx3, cy3, rad);
									overlay.AddEllipse2(cx4, cy4, rad);
									overlay.AddEllipse2(cx5, cy5, rad);
									overlay.AddEllipse2(cx6, cy6, rad);

									var _color1 = "#ADADAD";
									if (0 === _object.visualState || 1 === _object.visualState)
										_color1 = "#444444";

									ctx.fillStyle = _color1;
									ctx.fill();
									ctx.beginPath();
								}

								// draw name
								if (_object.Name != "")
								{
									if (_object.ActiveButtonIndex == -1)
										ctx.fillStyle = AscCommon.GlobalSkin.ContentControlsActive;
									else if (_object.HoverButtonIndex == -1)
										ctx.fillStyle = AscCommon.GlobalSkin.ContentControlsHover;
									else
										ctx.fillStyle = AscCommon.GlobalSkin.ContentControlsBack;

									ctx.rect(_x + (_object.IsNoUseButtons() ? 0 : scaleX_15), _y, widthName, scaleY_20);
									ctx.fill();
									ctx.beginPath();

									ctx.fillStyle = (_object.ActiveButtonIndex == -1) ? AscCommon.GlobalSkin.ContentControlsTextActive : AscCommon.GlobalSkin.ContentControlsText;
									ctx.font = this.getFont(_koefY);
									let _textShift = ctx.direction === "rtl" ? _object.CalculateNameRectNatural() / _koefX : 0;
									_object.fillText(ctx, _object.Name, xText + 3 / _koefX + _textShift, _y + (CONTENT_CONTROL_TRACK_H - 6) / _koefY, _object.CalculateNameRectNatural() / _koefX);

									if (_object.IsNameAdvanced() && !_object.IsNoUseButtons())
									{
										var nY = _y + 9 / _koefY;
										var nX = xText + widthName - 6 / _koefX;

										for (var i = 0; i < 3; i++)
											ctx.rect(_x + nX + i / _koefX, nY + i / _koefY, 1 / _koefX, 1 / _koefY);

										for (var i = 0; i < 2; i++)
											ctx.rect(_x + nX + (4 - i) / _koefX, nY + i / _koefY, 1 / _koefX, 1 / _koefY);

										ctx.fill();
										ctx.beginPath();
									}
								}

								// draw buttons
								for (var nIndexB = 0; nIndexB < _object.Buttons.length; nIndexB++)
								{
									var isFill = false;
									if (_object.ActiveButtonIndex == nIndexB)
									{
										ctx.fillStyle = AscCommon.GlobalSkin.ContentControlsActive;
										isFill = true;
									}
									else if (_object.HoverButtonIndex == nIndexB)
									{
										ctx.fillStyle = AscCommon.GlobalSkin.ContentControlsHover;
										isFill = true;
									}

									if (isFill)
									{
										ctx.rect(xText + widthName + scaleX_20 * nIndexB, _y, scaleX_20, scaleY_20);
										ctx.fill();
										ctx.beginPath();
									}

									var image = this.icons.getImage(_object.Buttons[nIndexB], nIndexB == _object.ActiveButtonIndex);
									if (image)
										ctx.drawImage(image, xText + widthName + scaleX_20 * nIndexB, _y, scaleX_20, scaleY_20);
								}
							}

							// есть ли комбо-кнопка?
							if (_object.ComboRect)
							{
								_x = _object.ComboRect.X;
								_y = _object.ComboRect.Y;
								_b = _object.ComboRect.B;
								var nIndexB = _object.Buttons.length;

								ctx.beginPath();
								ctx.rect(_x, _y, scaleX_20, _b - _y);
								overlay.CheckRect(_x, _y, scaleX_20, _b - _y);
								if (_object.ActiveButtonIndex == nIndexB)
									ctx.fillStyle = AscCommon.GlobalSkin.ContentControlsActive;
								else if (_object.HoverButtonIndex == nIndexB)
									ctx.fillStyle = AscCommon.GlobalSkin.ContentControlsHover;
								else
									ctx.fillStyle = AscCommon.GlobalSkin.ContentControlsBack;

								ctx.fill();
								ctx.lineWidth = 1 / _koefY;
								ctx.stroke();
								ctx.lineWidth = 1;
								ctx.beginPath();

								var image = this.icons.getImage(AscCommon.CCButtonType.Combo, _object.Buttons.length == _object.ActiveButtonIndex);
								var scaleY_7 = 7 / _koefY;
								if (image && scaleY_7 < (_b - _y))
									ctx.drawImage(image, _x, _y + ((_b - _y - scaleY_20) / 2), scaleX_20, scaleY_20);
							}

							// рисуем единую обводку
							_object.SetColor(ctx);

							overlay.SetBaseTransform();

							ctx.beginPath();

							ctx.moveTo(x1, y1);
							ctx.lineTo(x2, y2);
							ctx.lineTo(x3, y3);
							ctx.lineTo(x4, y4);
							ctx.closePath();

							ctx.stroke();
							ctx.beginPath();
						}
					}
				}
			}
			
			this.ContentControlsSaveLast();
		};
		
		this.getCurrentPage = function()
		{
			return this.document.m_oWordControl && this.document.m_oWordControl.m_oLogicDocument ? this.document.m_oWordControl.m_oLogicDocument.CurPage : 0;
		};
		this.startCollectTracks = function()
		{
			// We can have many Track.In and just one Track.Hover
			// If we have an inline move, then we hold the current stack of tracks (which ends with track being moved)
			
			this.lastActive = null;
			this.lastHover  = null;
			this.lastInline = null;
			this.lastTracks = this.ContentControlObjects.slice();
			
			for (let i = 0; i < this.ContentControlObjects.length; ++i)
			{
				let ccTrack = this.ContentControlObjects[i];
				if (AscCommon.ContentControlTrack.In === ccTrack.state && -2 !== ccTrack.ActiveButtonIndex)
					this.lastActive = ccTrack;
				
				if (AscCommon.ContentControlTrack.Hover === ccTrack.state)
					this.lastHover = ccTrack;
				
				if (1 === ccTrack.visualState)
				{
					this.lastInline = ccTrack;
					this.ContentControlObjects.length = i + 1;
					break;
				}
			}
			
			if (!this.lastInline)
				this.ContentControlObjects.length = 0;
		};
		this.addTrackIn = function(obj, geom)
		{
			if (!geom || (Array.isArray(geom) && geom.length === 0) || this.lastInline)
				return;
			
			if (this.lastActive && this.lastActive.base && obj && this.lastActive.base.GetId() === obj.GetId())
			{
				this.lastActive.UpdateGeom(geom);
				this.ContentControlObjects.push(this.lastActive);
			}
			else
			{
				let lastTrack = this.findTrackInLast(obj);
				
				let newTrack;
				if (lastTrack)
				{
					newTrack = lastTrack.Copy();
					newTrack.UpdateGeom(geom);
				}
				else
				{
					newTrack = new CContentControlTrack(this, obj, AscCommon.ContentControlTrack.In, geom);
				}
				this.ContentControlObjects.push(newTrack);
			}
			
		};
		this.endCollectTracks = function()
		{
			if (this.lastActive)
			{
				if (-1 === this.ContentControlObjects.indexOf(this.lastActive))
					this.document.m_oWordControl.m_oApi.sendEvent("asc_onHideContentControlsActions");
			}
			
			if (this.lastHover)
			{
				for (let i = 0; i < this.ContentControlObjects.length; ++i)
				{
					let ccTrack = this.ContentControlObjects[i];
					if (AscCommon.ContentControlTrack.In === ccTrack.state
						&& this.lastHover.base
						&& ccTrack.base
						&& this.lastHover.base.GetId() === ccTrack.base.GetId())
					{
						this.lastHover = null;
						break;
					}
				}
				
				if (this.lastHover)
					this.ContentControlObjects.push(this.lastHover);
			}
			
			if (!this.lastInline)
				this.ContentControlObjects = this.ContentControlObjects.reverse();
			
			this.sendShowHidePluginEvent();
			
			this.lastHover  = null;
			this.lastActive = null;
			this.lastInline = null;
			this.lastTracks = [];
		};
		this.addTrackHover = function(obj, geom)
		{
			if (!geom || (Array.isArray(geom) && geom.length === 0))
				return this.removeTrackHover();
			
			for (let i = 0; i < this.ContentControlObjects.length; ++i)
			{
				let ccTrack = this.ContentControlObjects[i];
				if (ccTrack.state === AscCommon.ContentControlTrack.In && obj.GetId() === ccTrack.base.GetId())
					return;
			}
			
			for (let i = 0; i < this.ContentControlObjects.length; ++i)
			{
				let ccTrack = this.ContentControlObjects[i];
				if (ccTrack.state === AscCommon.ContentControlTrack.Hover && obj === ccTrack.base)
				{
					ccTrack.UpdateGeom(geom);
					return;
				}
			}
			
			this.removeTrackHover();
			this.ContentControlObjects.push(new CContentControlTrack(this, obj, AscCommon.ContentControlTrack.Hover, geom));
		};
		this.removeTrackHover = function()
		{
			for (let i = this.ContentControlObjects.length - 1; i >= 0; --i)
			{
				if (AscCommon.ContentControlTrack.Hover === this.ContentControlObjects[i].state)
					this.ContentControlObjects.splice(i, 1);
			}
		};
		this.findTrackInLast = function(obj)
		{
			let objId = obj.GetId();
			for (let i = 0; i < this.lastTracks.length; ++i)
			{
				let ccTrack = this.lastTracks[i];
				if (ccTrack.state === AscCommon.ContentControlTrack.In
					&& ccTrack.base
					&& ccTrack.base.GetId() === objId)
					return ccTrack;
			}
			return null;
		};

		this.checkSmallChanges = function(pos)
		{
			if (!this.ContentControlSmallChangesCheck.IsSmall)
				return;

			if (pos.Page != this.ContentControlSmallChangesCheck.Page ||
				Math.abs(pos.X - this.ContentControlSmallChangesCheck.X) > this.ContentControlSmallChangesCheck.Min ||
				Math.abs(pos.Y - this.ContentControlSmallChangesCheck.Y) > this.ContentControlSmallChangesCheck.Min)
			{
				this.ContentControlSmallChangesCheck.IsSmall = false;
			}
		};

		this.getInlineMoveTrack = function()
		{
			for (let i = 0; i < this.ContentControlObjects.length; ++i)
			{
				if (AscCommon.ContentControlTrack.In === this.ContentControlObjects[i].state && 1 === this.ContentControlObjects[i].visualState)
					return this.ContentControlObjects[i];
			}
			return null;
		};
		
		this.checkPointerInButtons = function(pos)
		{
			for (var i = 0; i < this.ContentControlObjects.length; i++)
			{
				let _object = this.ContentControlObjects[i];
				if (AscCommon.ContentControlTrack.In !== _object.state || _object.Pos.Page !== pos.Page)
					continue;
				
				let _pos = this._getTrackRelativePos(pos, _object);
				
				let xPos  = _pos.xPos;
				let yPos  = _pos.yPos;
				let koefX = _pos.koefX;
				let koefY = _pos.koefY;
				
				if (_object.isHitInMoveRect(xPos, yPos, koefX, koefY))
					return true;
				
				if (_object.getButton(xPos, yPos, koefX, koefY))
					return true;
				
				if (_object.isHitInNameRect(xPos, yPos, koefX, koefY))
					return true;
				
				if (_object.isHitInComboRect(xPos, yPos, koefX, koefY))
					return true;
			}
			
			return false;
		};
		
		this._getTrackRelativePos = function(pos, ccTrack)
		{
			var _page = this.document.m_arrPages[ccTrack.Pos.Page];
			if (!_page)
				return null;
			
			var drawingPage = _page.drawingPage;
			
			var koefX = (drawingPage.right - drawingPage.left) / _page.width_mm;
			var koefY = (drawingPage.bottom - drawingPage.top) / _page.height_mm;
			
			var xPos = pos.X - ccTrack.OffsetX;
			var yPos = pos.Y - ccTrack.OffsetY;
			if (ccTrack.transform)
			{
				var tmp = ccTrack.invertTransform.TransformPointX(xPos, yPos);
				yPos = ccTrack.invertTransform.TransformPointY(xPos, yPos);
				xPos = tmp;
			}
			return {
				xPos : xPos,
				yPos : yPos,
				koefX : koefX,
				koefY : koefY
			}
		};

		this.onPointerDown = function(pos)
		{
			var oWordControl = this.document.m_oWordControl;
			for (var i = this.ContentControlObjects.length - 1; i >= 0; --i)
			{
				let _object = this.ContentControlObjects[i];
				if (AscCommon.ContentControlTrack.In !== _object.state || _object.Pos.Page !== pos.Page)
					continue;
				
				let _pos = this._getTrackRelativePos(pos, _object);
				
				let xPos  = _pos.xPos;
				let yPos  = _pos.yPos;
				let koefX = _pos.koefX;
				let koefY = _pos.koefY;
				
				if (_object.isHitInMoveRect(xPos, yPos, koefX, koefY))
				{
					_object.visualState = 1;
					this.ContentControlSmallChangesCheck.X = pos.X;
					this.ContentControlSmallChangesCheck.Y = pos.Y;
					this.ContentControlSmallChangesCheck.Page = pos.Page;
					this.ContentControlSmallChangesCheck.IsSmall = true;

					this.document.InlineTextTrack = null;
					this.document.InlineTextTrackPage = -1;

					oWordControl.ShowOverlay();
					oWordControl.OnUpdateOverlay();
					oWordControl.EndUpdateOverlay();

					this.document.LockCursorType("default");
					// Важно селектить контрол после всех действий, т.к. селект вызывает перерисовку треков и текущий стек измениться
					oWordControl.m_oLogicDocument.SelectContentControl(_object.base.GetId());
					return true;
				}
				
				if (_object.isHitInNameRect(xPos, yPos, koefX, koefY))
				{
					if (_object.ActiveButtonIndex == -1)
					{
						_object.ActiveButtonIndex = -2;
						oWordControl.m_oApi.sendEvent("asc_onHideContentControlsActions");
					}
					else
					{
						_object.ActiveButtonIndex = -1;

						let rectName = _object.CalculateNameRect(koefX, koefY);
						var xCC = rectName.X + _object.OffsetX;
						var yCC = rectName.Y + rectName.H + _object.OffsetY;
						if (_object.transform) {
							var tmp = _object.transform.TransformPointX(xCC, yCC);
							yCC = _object.transform.TransformPointY(xCC, yCC);
							xCC = tmp;
						}

						var posOnScreen = this.document.ConvertCoordsToCursorWR(xCC, yCC, _object.Pos.Page);
						_sendEventToApi(oWordControl.m_oApi, _object.GetButtonObj(-1), posOnScreen.X, posOnScreen.Y);
					}

					oWordControl.ShowOverlay();
					oWordControl.OnUpdateOverlay();
					oWordControl.EndUpdateOverlay();

					this.document.LockCursorType("default");
					return true;
				}
				
				let buttonInfo = _object.getButton(xPos, yPos, koefX, koefY);
				if (buttonInfo && -1 !== buttonInfo.index)
				{
					let indexButton = buttonInfo.index;
					let xCC = buttonInfo.x;
					let yCC = buttonInfo.y;
					
					if (_object.ActiveButtonIndex === indexButton)
					{
						_object.ActiveButtonIndex = -2;
						oWordControl.m_oApi.sendEvent("asc_onHideContentControlsActions");
					}
					else
					{
						_object.ActiveButtonIndex = indexButton;

						xCC += _object.OffsetX;
						yCC += _object.OffsetY;

						if (_object.transform)
						{
							var tmp = _object.transform.TransformPointX(xCC, yCC);
							yCC = _object.transform.TransformPointY(xCC, yCC);
							xCC = tmp;
						}

						var posOnScreen = this.document.ConvertCoordsToCursorWR(xCC, yCC, _object.Pos.Page);
						let oButtonData = _object.GetButtonObj(indexButton);

						if (!_object.isPluginButton(oButtonData.button))
							_sendEventToApi(oWordControl.m_oApi, oButtonData, posOnScreen.X, posOnScreen.Y);
					}

					oWordControl.ShowOverlay();
					oWordControl.OnUpdateOverlay();
					oWordControl.EndUpdateOverlay();

					this.document.LockCursorType("default");
					return true;
				}

				if (_object.isHitInComboRect(xPos, yPos, koefX, koefY))
				{
					var indexB = _object.Buttons.length;
					if (_object.ActiveButtonIndex == indexB)
					{
						_object.ActiveButtonIndex = -2;
						oWordControl.m_oApi.sendEvent("asc_onHideContentControlsActions");
					}
					else
					{
						_object.ActiveButtonIndex = indexB;
						
						let rectCombo = _object.CalculateComboRect(koefX, koefY)
						var xCC = rectCombo.X + _object.OffsetX + CONTENT_CONTROL_TRACK_H / koefX;
						var yCC = rectCombo.Y + rectCombo.H + _object.OffsetY;
						if (_object.transform)
						{
							var tmp = _object.transform.TransformPointX(xCC, yCC);
							yCC = _object.transform.TransformPointY(xCC, yCC);
							xCC = tmp;
						}

						var posOnScreen = this.document.ConvertCoordsToCursorWR(xCC, yCC, rectCombo.Page);
						_sendEventToApi(oWordControl.m_oApi, _object.GetButtonObj(indexB), posOnScreen.X, posOnScreen.Y);
					}

					oWordControl.ShowOverlay();
					oWordControl.OnUpdateOverlay();
					oWordControl.EndUpdateOverlay();

					this.document.LockCursorType("default");
					return true;
				}
			}

			return false;
		};

		this.onPointerLeave = function()
		{
			let updateOverlay = false;
			for (var i = 0; i < this.ContentControlObjects.length; i++)
			{
				let ccTrack = this.ContentControlObjects[i];
				
				if (-2 !== ccTrack.HoverButtonIndex)
				{
					updateOverlay = true;
					ccTrack.HoverButtonIndex = -2;
				}
				
				if (-1 !== ccTrack.visualState)
				{
					updateOverlay = true;
					ccTrack.visualState = -1;
				}
			}

			if (updateOverlay)
				this.document.m_oWordControl.OnUpdateOverlay();
		};

		this.onPointerMove = function(pos, isWithoutCoords)
		{
			var oWordControl = this.document.m_oWordControl;
			let updateOverlay = false;
			for (let i = 0; i < this.ContentControlObjects.length; i++)
			{
				let ccTrack = this.ContentControlObjects[i];
				
				if (-2 !== ccTrack.HoverButtonIndex)
				{
					updateOverlay = true;
					ccTrack.HoverButtonIndex = -2;
				}
			}
			
			for (var i = this.ContentControlObjects.length - 1; i >= 0; --i)
			{
				let _object = this.ContentControlObjects[i];
				
				if (AscCommon.ContentControlTrack.In !== _object.state
					|| pos.Page !== _object.Pos.Page
					|| !this.document.m_arrPages[pos.Page])
					continue;
				
				if (!_object.IsNoUseButtons() && 1 === _object.visualState)
				{
					if (pos.Page == this.ContentControlSmallChangesCheck.Page &&
						Math.abs(pos.X - this.ContentControlSmallChangesCheck.X) < this.ContentControlSmallChangesCheck.Min &&
						Math.abs(pos.Y - this.ContentControlSmallChangesCheck.Y) < this.ContentControlSmallChangesCheck.Min)
					{
						oWordControl.ShowOverlay();
						oWordControl.OnUpdateOverlay();
						oWordControl.EndUpdateOverlay();
						return true;
					}
					
					this.document.InlineTextTrackEnabled = true;
					this.ContentControlSmallChangesCheck.IsSmall = false;
					
					this.document.InlineTextTrack = oWordControl.m_oLogicDocument.Get_NearestPos(pos.Page, pos.X, pos.Y);
					this.document.InlineTextTrackPage = pos.Page;
					
					oWordControl.ShowOverlay();
					oWordControl.OnUpdateOverlay();
					oWordControl.EndUpdateOverlay();
					return true;
				}
				
				if (-1 !== _object.visualState)
				{
					updateOverlay = true;
					_object.visualState = -1;
				}
				
				let _pos = this._getTrackRelativePos(pos, _object);
				
				let xPos  = _pos.xPos;
				let yPos  = _pos.yPos;
				let koefX = _pos.koefX;
				let koefY = _pos.koefY;
				
				if (!_object.IsNoUseButtons())
				{
					if (_object.isHitInMoveRect(xPos, yPos, koefX, koefY))
					{
						_object.visualState = 0;
						oWordControl.ShowOverlay();
						oWordControl.OnUpdateOverlay();
						oWordControl.EndUpdateOverlay();
						
						this.document.SetCursorType("default");
						
						oWordControl.m_oApi.sync_MouseMoveStartCallback();
						oWordControl.m_oApi.sync_MouseMoveEndCallback();
						return true;
					}
					
					if (_object.isHitInNameRect(xPos, yPos, koefX, koefY))
					{
						_object.HoverButtonIndex = -1;
						oWordControl.ShowOverlay();
						oWordControl.OnUpdateOverlay();
						oWordControl.EndUpdateOverlay();
						
						this.document.SetCursorType("default");
						
						oWordControl.m_oApi.sync_MouseMoveStartCallback();
						oWordControl.m_oApi.sync_MouseMoveEndCallback();
						return true;
					}
					
					let buttonInfo = (isWithoutCoords !== true)
						? _object.getButton(xPos, yPos, koefX, koefY)
						: null;

					if (buttonInfo)
					{
						_object.HoverButtonIndex = buttonInfo.index;
						oWordControl.ShowOverlay();
						oWordControl.OnUpdateOverlay();
						oWordControl.EndUpdateOverlay();
						
						this.document.SetCursorType("default");
						
						oWordControl.m_oApi.sync_MouseMoveStartCallback();
						oWordControl.m_oApi.sync_MouseMoveEndCallback();
						return true;
					}
				}
				
				if (_object.isHitInComboRect(xPos, yPos, koefX, koefY))
				{
					_object.HoverButtonIndex = _object.Buttons.length;
					oWordControl.ShowOverlay();
					oWordControl.OnUpdateOverlay();
					oWordControl.EndUpdateOverlay();
					
					this.document.SetCursorType("default");
					
					oWordControl.m_oApi.sync_MouseMoveStartCallback();
					oWordControl.m_oApi.sync_MouseMoveEndCallback();
					return true;
				}
			}
			
			if (updateOverlay)
				oWordControl.OnUpdateOverlay();
			
			return false;
		};

		this.onPointerUp = function(pos)
		{
			var oldContentControlSmall = this.ContentControlSmallChangesCheck.IsSmall;
			this.ContentControlSmallChangesCheck.IsSmall = true;
			
			let updateOverlay = false;
			let moveTrack = this.getInlineMoveTrack();
			let result;
			if (!moveTrack)
			{
				for (let i = 0; i < this.ContentControlObjects.length; ++i)
				{
					let ccTrack = this.ContentControlObjects[i];
					if (ccTrack.state !== AscCommon.ContentControlTrack.In)
						continue;
					
					if (ccTrack.isPluginButtonActive())
					{
						let _pos = this._getTrackRelativePos(pos, ccTrack);
						let buttonInfo = ccTrack.getButton(_pos.xPos, _pos.yPos, _pos.koefX, _pos.koefY);
						if (buttonInfo && buttonInfo.index === ccTrack.ActiveButtonIndex)
							this.onClickPluginButton(buttonInfo.button, ccTrack);
						
						ccTrack.ActiveButtonIndex = -2;
						updateOverlay = true;
					}
				}
				result = false;
			}
			else
			{
				moveTrack.visualState = -1;
				if (this.document.InlineTextTrackEnabled)
				{
					if (this.document.InlineTextTrack && !oldContentControlSmall) // значит был MouseMove
					{
						this.document.InlineTextTrack = this.document.m_oLogicDocument.Get_NearestPos(pos.Page, pos.X, pos.Y);
						this.document.m_oLogicDocument.OnContentControlTrackEnd(moveTrack.base.GetId(), this.document.InlineTextTrack, AscCommon.global_keyboardEvent.CtrlKey);
						this.document.InlineTextTrackEnabled = false;
						this.document.InlineTextTrack        = null;
						this.document.InlineTextTrackPage    = -1;
					}
					else
					{
						this.document.InlineTextTrackEnabled = false;
					}
				}
				this.onPointerMove(pos);
				result = true;
				updateOverlay = true;
			}
			
			if (updateOverlay)
				this.updateOverlay();
			
			return result;
		};
		
		this.updateOverlay = function()
		{
			let wordControl = this.document.m_oWordControl;
			wordControl.ShowOverlay();
			wordControl.StartUpdateOverlay();
			wordControl.OnUpdateOverlay();
			wordControl.EndUpdateOverlay();
		};
	}

	AscCommon.DrawingContentControls = ContentControls;

	// по точкам (paths) нужно определить отрезки и точки по порядку, чтобы была возможность делать скругления.
	// и по-всякому рисовать якорьки (движение/выпадашку для комбобокса и т.д.)

	function isEqualFloat(coord1, coord2)
	{
		return (Math.abs(coord1 - coord2) < 0.0001) ? true : false;
	}

	var PointDirection = {
		Unitialized : 0,
		Up : 1,
		Down : 2,
		Right : 3,
		Left : 4
	};
	var PointRound = {
		Unitialized : 0,
		True : 1,
		False : 2
	};

	function CPointCC(x, y)
	{
		this.x = x;
		this.y = y;
		this.inDir = PointDirection.Unitialized;
		this.outDir = PointDirection.Unitialized;
		this.round = PointRound.Unitialized;
	}

	function CPolygonCC()
	{
		this.points = [];

		this.rectMove = null;
		this.rectCombo = null;
		this.bounds = null;

		this.indexMin = 0;
		this.indexMax = 0;

		this.roundSizePx = 1;

		this.rectMoveWidth = 1;
		this.rectComboWidth = 1;
		this.roundSize = 1;

		this.isClockwise = false;
		this.isActive = false;

		this.isUseMoveRect = true;
		this.isCombobox = false;
		this.isImage = false;

		this.wideOutlineX = 0;
		this.wideOutlineY = 0;
		this.koef = 1;
	}

	CPolygonCC.prototype.rectMoveWidthPx = 13;
	CPolygonCC.prototype.rectComboWidthPx = 22;
	CPolygonCC.prototype.rectMoveImageMaxH = 30;

	CPolygonCC.prototype.nextIndex = function(index, add)
	{
		if (add === false)
			index--;
		else
			index++;
		if (index < 0)
			return this.points.length - index;
		if (index >= this.points.length)
			return index - this.points.length;
		return index;
	};
	CPolygonCC.prototype.widePoint = function(point, x, y)
	{
		if (x !== 0)
			point.x += (x === 1) ? this.wideOutlineX : -this.wideOutlineX;
		if (y !== 0)
			point.y += (y === 1) ? this.wideOutlineY : -this.wideOutlineY;
	};
	CPolygonCC.prototype.wideRects = function()
	{
		if (this.rectMove)
		{
			this.rectMove.x -= this.wideOutlineX;
			this.rectMove.y -= this.wideOutlineY;
			this.rectMove.w += this.wideOutlineX;
			this.rectMove.h += this.wideOutlineY;
		}
		if (this.rectCombo)
		{
			this.rectCombo.w += this.wideOutlineX;
			this.rectCombo.h += this.wideOutlineY;
		}
	};
	CPolygonCC.prototype.init = function(object, koef, indexPath, countPaths)
	{
		switch (object.type)
		{
			case Asc.c_oAscContentControlSpecificType.ComboBox:
			case Asc.c_oAscContentControlSpecificType.DropDownList:
			case Asc.c_oAscContentControlSpecificType.DateTime:
			{
				this.isCombobox = !(object && object.IsNoUseButtons());
				break;
			}
			case Asc.c_oAscContentControlSpecificType.Picture:
			{
				this.isImage = true;
				break;
			}
			default:
				break;
		}

		if (object.parent.document.m_oWordControl.m_oApi.isViewMode)
		{
			this.isUseMoveRect = false;
			this.isCombobox = false;
		}
		else if (object.parent.document.m_oLogicDocument && object.parent.document.m_oLogicDocument.IsFillingFormMode())
		{
			this.isUseMoveRect = false;
		}

		if (object.isFixedForm)
		{
			this.isUseMoveRect = false;
		}

		if (object.state === AscCommon.ContentControlTrack.In)
		{
			this.isActive = true;
		}

		if (!this.isActive)
		{
			this.isUseMoveRect = false;
			this.isCombobox = false;
		}

		if (0 !== indexPath)
			this.isUseMoveRect = false;
		if (indexPath !== (countPaths - 1))
			this.isCombobox = false;

		this.roundSizePx = this.isActive ? AscCommon.GlobalSkin.FormsContentControlsOutlineBorderRadiusActive : AscCommon.GlobalSkin.FormsContentControlsOutlineBorderRadiusHover;
		this.rectMoveWidth = this.rectMoveWidthPx / koef;
		this.rectComboWidth = this.rectComboWidthPx / koef;
		this.roundSize = this.roundSizePx / koef;

		if (!object.transform)
		{
			//this.wideOutlineX = 1 / koef;
			this.wideOutlineY = 1 / koef;
		}
		this.koef = koef;
	};
	CPolygonCC.prototype.moveTo = function(x, y)
	{
		if (this.points.length > 0)
			this.points = [];
		this.indexMin = 0;
		this.indexMax = 0;
		this.points.push(new CPointCC(x, y));
	};
	CPolygonCC.prototype.lineTo = function(x, y)
	{
		if (this.points.length == 0)
		{
			this.moveTo(x, y);
			return;
		}
		var lastPoint = this.points[this.points.length - 1];
		var isEqualX = isEqualFloat(lastPoint.x, x);
		var isEqualY = isEqualFloat(lastPoint.y, y);

		if (isEqualX && isEqualY)
		{
			// дублируемые не добавляем
			return;
		}

		var firstPoint = this.points[0];
		if (isEqualFloat(firstPoint.x, x) && isEqualFloat(firstPoint.y, y))
		{
			// закроем path на closePath
			return;
		}

		var newPoint = new CPointCC(x, y);

		// minimum check
		var pointCheck = this.points[this.indexMin];
		if (isEqualFloat(pointCheck.y, newPoint.y))
		{
			if (pointCheck.x > newPoint.x)
				this.indexMin = this.points.length;
		}
		if (pointCheck.y > newPoint.y)
			this.indexMin = this.points.length;

		// maximum check
		pointCheck = this.points[this.indexMax];
		if (isEqualFloat(pointCheck.y, newPoint.y))
		{
			if (pointCheck.x < newPoint.x)
				this.indexMax = this.points.length;
		}
		if (pointCheck.y < newPoint.y)
			this.indexMax = this.points.length;

		this.points.push(newPoint);
	};
	CPolygonCC.prototype.closePath = function()
	{
		this.calcRects();
		this.calcDirections();
		this.calcRounds();
	};
	CPolygonCC.prototype.calcRects = function()
	{
		var pointsLen = this.points.length;

		var minPoint = this.points[this.indexMin];
		var maxPoint = this.points[this.indexMax];

		// определяем bounds
		this.bounds = {x : minPoint.x, y : minPoint.y, w : (maxPoint.x - minPoint.x), h : (maxPoint.y - minPoint.y) };

		if (this.isUseMoveRect)
		{
			// определяем первый рект (для перетаскивания) и передвигаем точки
			// нужно найти направление, по которому мы шли, так как это экстремум, а проход в один конец, то
			// верное направление одно
			var direction = -1; // назад
			var indexMinFriend = this.nextIndex(this.indexMin);
			if (isEqualFloat(minPoint.x, this.points[indexMinFriend].x))
				direction = 1;
			this.isClockwise = (direction === 1) ? false : true;

			// зацикливаем
			var indexMinFriend = this.nextIndex(this.indexMin, direction === 1);
			var yMax = minPoint.y;
			while (isEqualFloat(this.points[indexMinFriend].x, minPoint.x))
			{
				// точка учавствует в пути - проходная или конечная
				this.points[indexMinFriend].x -= this.rectMoveWidth;
				if (this.points[indexMinFriend].y > yMax) // по идее всегда так
					yMax = this.points[indexMinFriend].y;

				if (this.isImage)
				{
					var yMaxLimit = minPoint.y + this.rectMoveImageMaxH / this.koef;
					if (yMax > yMaxLimit)
					{
						var x1 = this.points[indexMinFriend].x;
						var x2 = this.points[indexMinFriend].x + this.rectMoveWidth;
						this.points[indexMinFriend].x += this.rectMoveWidth;
						this.points.splice(indexMinFriend, 0, new CPointCC(x1, yMaxLimit));
						this.points.splice(indexMinFriend + 1, 0, new CPointCC(x2, yMaxLimit));
						yMax = yMaxLimit;
						break;
					}
				}

				indexMinFriend = this.nextIndex(indexMinFriend, direction === 1);
			}
			minPoint.x -= this.rectMoveWidth;
			this.rectMove = {x: minPoint.x, y: minPoint.y, w: this.rectMoveWidth, h: (yMax - minPoint.y)};
		}

		if (this.isCombobox)
		{
			// определяем второй рект (для комбобокса), и передвигаем точки
			// нужно найти направление, по которому мы шли, так как это экстремум, а проход в один конец, то
			// верное направление одно
			direction = -1; // назад
			var indexMaxFriend = this.nextIndex(this.indexMax);
			if (isEqualFloat(maxPoint.x, this.points[indexMaxFriend].x))
				direction = 1;

			// зацикливаем
			var indexMaxFriend = this.nextIndex(this.indexMax, direction === 1);
			var yMin = maxPoint.y;
			while (isEqualFloat(this.points[indexMaxFriend].x, maxPoint.x))
			{
				// точка учавствует в пути - проходная или конечная
				this.points[indexMaxFriend].x += this.rectComboWidth;
				if (this.points[indexMaxFriend].y < yMin) // по идее всегда так
					yMin = this.points[indexMaxFriend].y;
				indexMaxFriend = this.nextIndex(indexMaxFriend, direction === 1);
			}
			this.rectCombo = {x: maxPoint.x, y: yMin, w: this.rectComboWidth, h: (maxPoint.y - yMin)};
			maxPoint.x += this.rectComboWidth;
		}
	};
	CPolygonCC.prototype.calcDirections = function()
	{
		for (var i = 0, len = this.points.length; i < len; i++)
		{
			var curPoint = this.points[i];
			var nextPoint = (i == (len - 1)) ? this.points[0] : this.points[i + 1];

			if (isEqualFloat(curPoint.y, nextPoint.y))
			{
				if (curPoint.x < nextPoint.x)
				{
					curPoint.outDir = nextPoint.inDir = PointDirection.Right;
				}
				else
				{
					curPoint.outDir = nextPoint.inDir = PointDirection.Left;
				}
			}
			else if (isEqualFloat(curPoint.x, nextPoint.x))
			{
				if (curPoint.y < nextPoint.y)
				{
					curPoint.outDir = nextPoint.inDir = PointDirection.Down;
				}
				else
				{
					curPoint.outDir = nextPoint.inDir = PointDirection.Up;
				}
			}
		}
	};
	CPolygonCC.prototype.calcRounds = function()
	{
		for (var i = 0, len = this.points.length; i < len; i++)
		{
			var curPoint = this.points[i];
			var nextPoint = (i == (len - 1)) ? this.points[0] : this.points[i + 1];

			// 1) короткая ли линия?
			var lineLen = Math.abs(curPoint.x - nextPoint.x) + Math.abs(curPoint.y - nextPoint.y);
			if (lineLen < this.roundSize)
			{
				curPoint.round = nextPoint.round = PointRound.False;
			}

			// 2) скругляем только внешние углы.
			// зависит от направлений и от общего направления обхода
			// и тут же сразу 3) расширяем рамку!
			if (curPoint.round === PointRound.Unitialized)
			{
				switch (curPoint.inDir)
				{
					case PointDirection.Left:
					{
						switch (curPoint.outDir)
						{
							case PointDirection.Left:
							case PointDirection.Right:
							{
								curPoint.round = PointRound.False;
								break;
							}
							case PointDirection.Up:
							{
								if (this.isClockwise)
								{
									curPoint.round = PointRound.True;
									this.widePoint(curPoint, -1, 1);
								}
								else
								{
									curPoint.round = PointRound.False;
									this.widePoint(curPoint, 1, -1);
								}
								break;
							}
							case PointDirection.Down:
							{
								if (this.isClockwise)
								{
									curPoint.round = PointRound.False;
									this.widePoint(curPoint, 1, 1);
								}
								else
								{
									curPoint.round = PointRound.True;
									this.widePoint(curPoint, -1, -1);
								}
								break;
							}
							default:
								break;
						}
						break;
					}
					case PointDirection.Right:
					{
						switch (curPoint.outDir)
						{
							case PointDirection.Left:
							case PointDirection.Right:
							{
								curPoint.round = PointRound.False;
								break;
							}
							case PointDirection.Up:
							{
								if (this.isClockwise)
								{
									curPoint.round = PointRound.False;
									this.widePoint(curPoint, -1, -1);
								}
								else
								{
									curPoint.round = PointRound.True;
									this.widePoint(curPoint, 1, 1);
								}
								break;
							}
							case PointDirection.Down:
							{
								if (this.isClockwise)
								{
									curPoint.round = PointRound.True;
									this.widePoint(curPoint, 1, -1);
								}
								else
								{
									curPoint.round = PointRound.False;
									this.widePoint(curPoint, -1, 1);
								}
								break;
							}
							default:
								break;
						}
						break;
					}
					case PointDirection.Up:
					{
						switch (curPoint.outDir)
						{
							case PointDirection.Left:
							{
								if (this.isClockwise)
								{
									curPoint.round = PointRound.False;
									this.widePoint(curPoint, -1, 1);
								}
								else
								{
									curPoint.round = PointRound.True;
									this.widePoint(curPoint, 1, -1);
								}
								break;
							}
							case PointDirection.Right:
							{
								if (this.isClockwise)
								{
									curPoint.round = PointRound.True;
									this.widePoint(curPoint, -1, -1);
								}
								else
								{
									curPoint.round = PointRound.False;
									this.widePoint(curPoint, 1, 1);
								}
								break;
							}
							case PointDirection.Up:
							{
								curPoint.round = PointRound.False;
								this.widePoint(curPoint, this.isClockwise ? -1 : 1, 0);
								break;
							}
							case PointDirection.Down:
							{
								curPoint.round = PointRound.False;
								break;
							}
							default:
								break;
						}
						break;
					}
					case PointDirection.Down:
					{
						switch (curPoint.outDir)
						{
							case PointDirection.Left:
							{
								if (this.isClockwise)
								{
									curPoint.round = PointRound.True;
									this.widePoint(curPoint, 1, 1);
								}
								else
								{
									curPoint.round = PointRound.False;
									this.widePoint(curPoint, -1, -1);
								}
								break;
							}
							case PointDirection.Right:
							{
								if (this.isClockwise)
								{
									curPoint.round = PointRound.False;
									this.widePoint(curPoint, 1, -1);
								}
								else
								{
									curPoint.round = PointRound.True;
									this.widePoint(curPoint, -1, 1);
								}
								break;
							}
							case PointDirection.Up:
							{
								curPoint.round = PointRound.False;
							}
							case PointDirection.Down:
							{
								curPoint.round = PointRound.False;
								this.widePoint(curPoint, this.isClockwise ? 1 : -1, 0);
								break;
							}
							default:
								break;
						}
						break;
					}
					default:
						break;
				}
			}
		}
		this.wideRects();
	};

	var const_rad = 0.9142; // (Math.sqrt(2) - 0.5)
	CPolygonCC.prototype.draw = function(overlay, object, drPage, koefX, koefY, icons)
	{
		var ctx = overlay.m_oContext;
		var rPR = AscCommon.AscBrowser.retinaPixelRatio;
		var indent = 0.5 * Math.round(rPR);
		var pointsLen = this.points.length;
		if (!object.transform)
		{
			var point;
			var _x, _y;

			var countIteration = (0 === this.roundSizePx) ? 1 : 2;
			var currentIteration = 0;

			if (countIteration > 1 && null === this.rectMove && null === this.rectCombo)
				countIteration = 1;

			while (true)
			{
				++currentIteration;
				if (currentIteration === countIteration)
				{
					var _x1, _x2, _y1, _y2, _x3, _y3, _x4, _y4;
					var lineH = koefY * object.base.GetBoundingPolygonFirstLineH();
					if (this.rectMove)
					{
						if (this.isImage)
							lineH = koefY * this.rectMove.h;

						// draw move rect
						_x1 = ((drPage.left + koefX * (this.rectMove.x + object.OffsetX)) * rPR) >> 0;
						_y1 = ((drPage.top + koefY * (this.rectMove.y + object.OffsetY)) * rPR) >> 0;
						_x2 = 1 + ((drPage.left + koefX * (this.rectMove.x + this.rectMove.w + object.OffsetX)) * rPR) >> 0;
						_y2 = _y1;
						_x3 = _x2;
						_y3 = 1 + ((drPage.top + koefY * (this.rectMove.y + this.rectMove.h + object.OffsetY)) * rPR) >> 0;
						_x4 = _x1;
						_y4 = _y3;

						ctx.moveTo(_x1, _y1);
						ctx.lineTo(_x2, _y2);
						ctx.lineTo(_x3, _y3);
						ctx.lineTo(_x4, _y4);
						ctx.closePath();
						ctx.fill();
						ctx.beginPath();

						var yCenterPos = ((_y1 + 0.5 * lineH * rPR) >> 0) + indent;
						var xCenter = _x1 + this.rectMoveWidthPx / 2 * rPR;
						var wCenter = (this.rectMoveWidthPx * rPR / 3 + Math.round(rPR)) >> 0;
						xCenter -= wCenter / 2;
						xCenter = xCenter >> 0;
						xCenter += Math.round(rPR); // lineWidth

						if (!this.isActive)
							ctx.strokeStyle = AscCommon.GlobalSkin.FormsContentControlsOutlineHover;
						else
						{
							switch (object.visualState)
							{
								case 0:
									ctx.strokeStyle = AscCommon.GlobalSkin.FormsContentControlsOutlineMoverHover;
									break;
								case 1:
									ctx.strokeStyle = AscCommon.GlobalSkin.FormsContentControlsOutlineMoverActive;
									break;
								default:
									ctx.strokeStyle = AscCommon.GlobalSkin.FormsContentControlsOutlineActive;
									break;
							}
						}

						ctx.moveTo(xCenter, yCenterPos);
						ctx.lineTo(xCenter + wCenter, yCenterPos);
						ctx.moveTo(xCenter, yCenterPos - Math.round(2 * rPR));
						ctx.lineTo(xCenter + wCenter, yCenterPos - Math.round(2 * rPR));
						ctx.moveTo(xCenter, yCenterPos + Math.round(2 * rPR));
						ctx.lineTo(xCenter + wCenter, yCenterPos + Math.round(2 * rPR));

						ctx.lineWidth = Math.round(rPR);
						ctx.stroke();
						ctx.beginPath();
					}

					if (this.rectCombo)
					{
						// draw combo rect
						_x1 = ((drPage.left + koefX * (this.rectCombo.x + object.OffsetX)) * rPR) >> 0;
						_y1 = ((drPage.top + koefY * (this.rectCombo.y + object.OffsetY)) * rPR)>> 0;
						_x2 = (drPage.left + koefX * (this.rectCombo.x + this.rectCombo.w + object.OffsetX)) * rPR >> 0;
						_y2 = _y1;
						_x3 = _x2;
						_y3 = ((drPage.top + koefY * (this.rectCombo.y + this.rectCombo.h + object.OffsetY)) * rPR) >> 0;
						_x4 = _x1;
						_y4 = _y3;

						ctx.moveTo(_x1, _y1);
						ctx.lineTo(_x2, _y2);
						ctx.lineTo(_x3, _y3);
						ctx.lineTo(_x4, _y4);
						ctx.closePath();

						var indexButton = object.Buttons.length;
						if (object.ActiveButtonIndex === indexButton)
							ctx.fillStyle = AscCommon.GlobalSkin.FormsContentControlsMarkersBackgroundActive;
						else if (object.HoverButtonIndex === indexButton)
							ctx.fillStyle = AscCommon.GlobalSkin.FormsContentControlsMarkersBackgroundHover;
						else
							ctx.fillStyle = AscCommon.GlobalSkin.FormsContentControlsMarkersBackground;

						ctx.fill();
						ctx.beginPath();

						var image = icons.getImage(AscCommon.CCButtonType.Combo, false);
						if (image)
						{
							var canvas = document.createElement('canvas'),
							    context = canvas.getContext('2d');

							var len = Math.floor(9 * rPR);
                            var width = Math.round(18 * rPR),
							    height = Math.round(18 * rPR);
							// теперь делаем нечетную длину
							if ( 0 == (len & 1) )
								len += 1;

							var countPart = (len + 1) >> 1,
								_data, px,
								_x = ((width - len) >> 1),
								_y = height - 2 * countPart,
								r, g, b;
							r = 0;
							g = 0;
							b = 0;

							_data = context.createImageData(width, height);
							px = _data.data;

							while (len > 0) {
								var ind = 4 * (width * _y + _x);
								for (var i = 0; i < len; i++) {
									px[ind++] = r;
									px[ind++] = g;
									px[ind++] = b;
									px[ind++] = 255;
								}

								r = r >> 0;
								g = g >> 0;
								b = b >> 0;

								_x += 1;
								_y += 1;
								len -= 2;
							}

							var yPos = _y4 - height - 0.5 * (lineH * rPR - height) >> 0;
							var xPos = _x1 + (0.5 * (this.rectComboWidthPx * rPR - width) >> 0) + Math.round(rPR);
							context.putImageData(_data, 0, 0);
							ctx.drawImage(canvas, xPos, yPos);
						}
					}
					
					// Hover and normal states are rendering in the main context
					if (this.isImage && 0 === object.ActiveButtonIndex)
					{
						_x1 = (drPage.left + koefX * (this.bounds.x + object.OffsetX)) * rPR;
						_y1 = (drPage.top + koefY * (this.bounds.y + object.OffsetY)) * rPR;
						_x4 = (drPage.left + koefX * (this.bounds.x + this.bounds.w + object.OffsetX)) * rPR;
						_y4 = (drPage.top + koefY * (this.bounds.y + this.bounds.h + object.OffsetY)) * rPR;

						var imageW = AscCommon.AscBrowser.convertToRetinaValue(CONTENT_CONTROL_TRACK_H, true);
						var imageH = AscCommon.AscBrowser.convertToRetinaValue(CONTENT_CONTROL_TRACK_H, true);
						var xPos = (_x1 + _x4 - imageW) >> 1;
						var yPos = (_y1 + _y4 - imageH) >> 1;

						ctx.fillStyle = AscCommon.GlobalSkin.ContentControlsActive;
						ctx.rect(xPos, yPos, imageW, imageH);
						ctx.fill();
						ctx.beginPath();

						var image = icons.getImage(AscCommon.CCButtonType.Image, true);
						if (image)
							ctx.drawImage(image, xPos, yPos, imageW, imageH);
					}

					if (2 === currentIteration)
					{
						ctx.restore();
					}
				}

				for (var i = 0; i < pointsLen; i++)
				{
					point = this.points[i];
					_x = (drPage.left + koefX * (point.x + object.OffsetX)) * rPR;
					_y = (drPage.top + koefY * (point.y + object.OffsetY)) * rPR;

					overlay.CheckPoint(_x, _y);

					_x = (_x >> 0) + 0.5 * Math.round(rPR);
					_y = (_y >> 0) + 0.5 * Math.round(rPR);

					if (point.round !== PointRound.True)
					{
						if (0 === i)
							ctx.moveTo(_x, _y);
						else
							ctx.lineTo(_x, _y);
					}
					else
					{
						var x1, y1, x2, y2, xCP, yCP;
						var isX = true;
						switch (point.inDir)
						{
							case PointDirection.Left:
							{
								x1 = _x + this.roundSizePx;
								y1 = _y;
								break;
							}
							case PointDirection.Right:
							{
								x1 = _x - this.roundSizePx;
								y1 = _y;
								break;
							}
							case PointDirection.Up:
							{
								x1 = _x;
								y1 = _y + this.roundSizePx;
								isX = false;
								break;
							}
							case PointDirection.Down:
							{
								x1 = _x;
								y1 = _y - this.roundSizePx;
								isX = false;
								break;
							}
							default:
								break;
						}
						switch (point.outDir)
						{
							case PointDirection.Left:
							{
								x2 = _x - this.roundSizePx;
								y2 = _y;
								break;
							}
							case PointDirection.Right:
							{
								x2 = _x + this.roundSizePx;
								y2 = _y;
								break;
							}
							case PointDirection.Up:
							{
								x2 = _x;
								y2 = _y - this.roundSizePx;
								break;
							}
							case PointDirection.Down:
							{
								x2 = _x;
								y2 = _y + this.roundSizePx;
								break;
							}
							default:
								break;
						}

						if (isX)
						{
							xCP = x1 + (x2 - x1) * const_rad;
							yCP = y1 + (y2 - y1) * (1 - const_rad);
						}
						else
						{
							xCP = x1 + (x2 - x1) * (1 - const_rad);
							yCP = y1 + (y2 - y1) * const_rad;
						}

						if (0 === i)
							ctx.moveTo(x1, y1);
						else
							ctx.lineTo(x1, y1);
						ctx.quadraticCurveTo(xCP, yCP, x2, y2);
					}
				}
				ctx.closePath();

				if (currentIteration === countIteration)
				{
					if (!this.isActive)
						ctx.strokeStyle = getOutlineCC(false);
					else
						ctx.strokeStyle = getOutlineCC(true);

					ctx.lineWidth = Math.round(rPR);
					ctx.stroke();
					ctx.beginPath();

					break;
				}
				else
				{
					ctx.save();
					ctx.clip();

					ctx.fillStyle = AscCommon.GlobalSkin.FormsContentControlsMarkersBackground;
					ctx.beginPath();
				}
			}
		}
		else
		{
			var point;
			var _x, _y;

			var countIteration = (0 === this.roundSizePx) ? 1 : 2;
			var currentIteration = 0;

			if (countIteration > 1 && null === this.rectMove && null === this.rectCombo)
				countIteration = 1;

			var matrix = object.transform;
			var coordMatrix = new AscCommon.CMatrix();
			coordMatrix.sx = koefX * rPR;
			coordMatrix.sy = koefY * rPR;
			coordMatrix.tx = drPage.left * rPR;
			coordMatrix.ty = drPage.top * rPR;
			AscCommon.global_MatrixTransformer.MultiplyPrepend(coordMatrix, matrix);

			while (true)
			{
				++currentIteration;
				if (currentIteration === countIteration)
				{
					ctx.transform(coordMatrix.sx, coordMatrix.shy, coordMatrix.shx, coordMatrix.sy, coordMatrix.tx, coordMatrix.ty);

					var lineH = object.base.GetBoundingPolygonFirstLineH();
					if (this.rectMove)
					{
						if (this.isImage)
							lineH = this.rectMove.h;

						// draw move rect
						ctx.moveTo(this.rectMove.x, this.rectMove.y);
						ctx.lineTo(this.rectMove.x + this.rectMove.w, this.rectMove.y);
						ctx.lineTo(this.rectMove.x + this.rectMove.w, this.rectMove.y + this.rectMove.h);
						ctx.lineTo(this.rectMove.x, this.rectMove.y + this.rectMove.h);
						ctx.closePath();
						ctx.fill();
						ctx.beginPath();

						var xLine = this.rectMove.x + this.rectMove.w / 3;
						var wLine = this.rectMove.w / 3;
						var yLine = this.rectMove.y + 0.5 * lineH;
						var hLine = 2 / koefY;

						if (!this.isActive)
							ctx.strokeStyle = AscCommon.GlobalSkin.FormsContentControlsOutlineHover;
						else
						{
							switch (object.visualState)
							{
								case 0:
									ctx.strokeStyle = AscCommon.GlobalSkin.FormsContentControlsOutlineMoverHover;
									break;
								case 1:
									ctx.strokeStyle = AscCommon.GlobalSkin.FormsContentControlsOutlineMoverActive;
									break;
								default:
									ctx.strokeStyle = AscCommon.GlobalSkin.FormsContentControlsOutlineActive;
									break;
							}
						}

						ctx.moveTo(xLine, yLine - hLine);
						ctx.lineTo(xLine + wLine, yLine - hLine);
						ctx.moveTo(xLine, yLine);
						ctx.lineTo(xLine + wLine, yLine);
						ctx.moveTo(xLine, yLine + hLine);
						ctx.lineTo(xLine + wLine, yLine + hLine);

						ctx.lineWidth = 1 / koefY;
						ctx.stroke();
						ctx.beginPath();
					}

					if (this.rectCombo)
					{
						// draw combo rect
						ctx.moveTo(this.rectCombo.x, this.rectCombo.y);
						ctx.lineTo(this.rectCombo.x + this.rectCombo.w, this.rectCombo.y);
						ctx.lineTo(this.rectCombo.x + this.rectCombo.w, this.rectCombo.y + this.rectCombo.h);
						ctx.lineTo(this.rectCombo.x, this.rectCombo.y + this.rectCombo.h);
						ctx.closePath();

						var indexButton = object.Buttons.length;
						if (object.ActiveButtonIndex === indexButton)
							ctx.fillStyle = AscCommon.GlobalSkin.FormsContentControlsMarkersBackgroundActive;
						else if (object.HoverButtonIndex === indexButton)
							ctx.fillStyle = AscCommon.GlobalSkin.FormsContentControlsMarkersBackgroundHover;
						else
							ctx.fillStyle = AscCommon.GlobalSkin.FormsContentControlsMarkersBackground;

						ctx.fill();
						ctx.beginPath();

						var image = icons.getImage(AscCommon.CCButtonType.Combo, false);
						if (image)
						{
							var imageW = CONTENT_CONTROL_TRACK_H / koefX; // 1x scale!
							var imageH = CONTENT_CONTROL_TRACK_H / koefY;
							var yPos = this.rectCombo.y + this.rectCombo.h - imageH - 0.5 * (lineH - imageH);
							var xPos = this.rectCombo.x + 0.5 * (this.rectCombo.w - imageW);

							ctx.drawImage(image, xPos, yPos, imageW, imageH);
						}
					}

					// Hover and normal states now are rendering in the main context
					if (this.isImage && 0 === object.ActiveButtonIndex)
					{
						var imageW = CONTENT_CONTROL_TRACK_H / koefX; // 1x scale!
						var imageH = CONTENT_CONTROL_TRACK_H / koefY;
						var xPos = this.bounds.x + (this.bounds.w - imageW) / 2;
						var yPos = this.bounds.y + (this.bounds.h - imageH) / 2;

						ctx.fillStyle = AscCommon.GlobalSkin.ContentControlsActive;
						ctx.rect(xPos, yPos, imageW, imageH);
						ctx.fill();
						ctx.beginPath();

						var image = icons.getImage(AscCommon.CCButtonType.Image, true);
						if (image)
							ctx.drawImage(image, xPos, yPos, imageW, imageH);
					}

					overlay.SetBaseTransform();

					if (2 === currentIteration)
					{
						ctx.restore();
					}
				}

				for (var i = 0; i < pointsLen; i++)
				{
					point = this.points[i];
					_x = matrix.TransformPointX(point.x, point.y);
					_y = matrix.TransformPointY(point.x, point.y);

					_x = (drPage.left + koefX * _x) * rPR;
					_y = (drPage.top + koefY * _y) * rPR;

					overlay.CheckPoint(_x, _y);

					if (point.round !== PointRound.True)
					{
						if (0 === i)
							ctx.moveTo(_x, _y);
						else
							ctx.lineTo(_x, _y);
					}
					else
					{
						var x1, y1, x2, y2, xCP, yCP;
						var isX = true;
						var roundSizePxTmp = 0; // this.roundSizePx
						switch (point.inDir)
						{
							case PointDirection.Left:
							{
								x1 = _x + roundSizePxTmp;
								y1 = _y;
								break;
							}
							case PointDirection.Right:
							{
								x1 = _x - roundSizePxTmp;
								y1 = _y;
								break;
							}
							case PointDirection.Up:
							{
								x1 = _x;
								y1 = _y + roundSizePxTmp;
								isX = false;
								break;
							}
							case PointDirection.Down:
							{
								x1 = _x;
								y1 = _y - roundSizePxTmp;
								isX = false;
								break;
							}
							default:
								break;
						}
						switch (point.outDir)
						{
							case PointDirection.Left:
							{
								x2 = _x - roundSizePxTmp;
								y2 = _y;
								break;
							}
							case PointDirection.Right:
							{
								x2 = _x + roundSizePxTmp;
								y2 = _y;
								break;
							}
							case PointDirection.Up:
							{
								x2 = _x;
								y2 = _y - roundSizePxTmp;
								break;
							}
							case PointDirection.Down:
							{
								x2 = _x;
								y2 = _y + roundSizePxTmp;
								break;
							}
							default:
								break;
						}

						if (isX)
						{
							xCP = x1 + (x2 - x1) * const_rad;
							yCP = y1 + (y2 - y1) * (1 - const_rad);
						}
						else
						{
							xCP = x1 + (x2 - x1) * (1 - const_rad);
							yCP = y1 + (y2 - y1) * const_rad;
						}

						if (0 === i)
							ctx.moveTo(x1, y1);
						else
							ctx.lineTo(x1, y1);
						ctx.quadraticCurveTo(xCP, yCP, x2, y2);
					}
				}
				ctx.closePath();

				if (currentIteration === countIteration)
				{
					if (!this.isActive)
						ctx.strokeStyle = getOutlineCC(false);
					else
						ctx.strokeStyle = getOutlineCC(true);

					ctx.lineWidth = 1;
					ctx.stroke();
					ctx.beginPath();

					break;
				}
				else
				{
					ctx.save();
					ctx.clip();

					ctx.fillStyle = AscCommon.GlobalSkin.FormsContentControlsMarkersBackground;
					ctx.beginPath();
				}
			}
		}
	};

})(window);
