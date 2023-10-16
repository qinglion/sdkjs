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

(	/**
	 * @param {jQuery} $
	 * @param {Window} window
	 * @param {undefined} undefined
	 */
	function ($, window, undefined) {

		var AscBrowser = AscCommon.AscBrowser;

		var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});
		var asc_applyFunction = AscCommonExcel.applyFunction;
		var c_oTargetType = AscCommonExcel.c_oTargetType;

		/**
		 * Desktop event controller for WorkbookView
		 * -----------------------------------------------------------------------------
		 * @constructor
		 * @memberOf Asc
		 */
		function asc_CEventsController() {
			//----- declaration -----
			this.settings = {
				vscrollStep: 10,
				hscrollStep: 10,
				scrollTimeout: 20,
				wheelScrollLinesV: 3
			};

			this.view     = undefined;
			this.widget   = undefined;
			this.element  = undefined;
			this.handlers = undefined;
			this.vsb	= undefined;
			this.vsbApi	= undefined;
			this.vsbMax	= undefined;
			this.hsb	= undefined;
			this.hsbApi = undefined;
			this.hsbMax	= undefined;

			this.resizeTimerId = undefined;
			this.scrollTimerId = undefined;
			this.moveRangeTimerId = undefined;
			this.moveResizeRangeTimerId = undefined;
			this.fillHandleModeTimerId = undefined;
			this.enableKeyEvents = true;
			this.isSelectMode = false;
			this.hasCursor = false;
			this.hasFocus = false;
			this.skipKeyPress = undefined;
			this.targetInfo = undefined;
			this.isResizeMode = false;
			this.isResizeModeMove = false;
						
			// Режим автозаполнения
			this.isFillHandleMode = false;
			this.isMoveRangeMode = false;
			this.isMoveResizeRange = false;
			// Режим установки закреплённых областей
			this.frozenAnchorMode = false;
			
			// Обработчик кликов для граф.объектов
			this.clickCounter = new AscFormat.ClickCounter();
			this.isMousePressed = false;
			this.isShapeAction = false;
            this.isUpOnCanvas = false;

			// Был ли DblClick обработан в onMouseDown эвенте
			this.isDblClickInMouseDown = false;
			// Нужно ли обрабатывать эвент браузера dblClick
			this.isDoBrowserDblClick = false;
			// Последние координаты, при MouseDown (для IE)
			this.mouseDownLastCord = null;
			//-----------------------

            this.vsbApiLockMouse = false;
            this.hsbApiLockMouse = false;

            //когда нажали на кнопку свертывания/развертывания группы строк
            this.isRowGroup = false;

            this.smoothWheelCorrector = null;
            if (AscCommon.AscBrowser.isMacOs) {
                this.smoothWheelCorrector = new AscCommon.CMouseSmoothWheelCorrector(this, function (deltaX, deltaY) {

                    if (deltaX) {
                        deltaX = Math.sign(deltaX) * Math.ceil(Math.abs(deltaX / 3));
                        this.scrollHorizontal(deltaX, null);
                    }
                    if (deltaY) {
                        deltaY = Math.sign(deltaY) * Math.ceil(Math.abs(deltaY * this.settings.wheelScrollLinesV / 3));
                        this.scrollVertical(deltaY, null);
                    }

                });

                this.smoothWheelCorrector.setNormalDeltaActive(3);
            }

            this.lastTab = null;

            return this;
		}

		/**
		 * @param {AscCommonExcel.WorkbookView} view
		 * @param {Element} widgetElem
		 * @param {Element} canvasElem
		 * @param {Object} handlers  Event handlers (resize, scrollY, scrollX, changeSelection, ...)
		 */
		asc_CEventsController.prototype.init = function (view, widgetElem, canvasElem, handlers) {
			var self = this;
			this.view     = view;
			this.widget   = widgetElem;
			this.element  = canvasElem;
			this.handlers = new AscCommonExcel.asc_CHandlersList(handlers);
            this._createScrollBars();

			if(Asc.editor.isEditOleMode) {
				return;
			}

			if( this.view.Api.isMobileVersion ){
                /*раньше события на ресайз вызывался из меню через контроллер. теперь контроллер в меню не доступен, для ресайза подписываемся на глобальный ресайз от window.*/
                window.addEventListener("resize", function () {self._onWindowResize.apply(self, arguments);}, false);
                return this;
            }

			// initialize events
			if (window.addEventListener) {
				window.addEventListener("resize"	, function () {self._onWindowResize.apply(self, arguments);}				, false);
				window.addEventListener("mousemove"	, function () {return self._onWindowMouseMove.apply(self, arguments);}		, false);
				window.addEventListener("mouseup"	, function () {return self._onWindowMouseUp.apply(self, arguments);}		, false);
				window.addEventListener("mouseleave", function () {return self._onWindowMouseLeaveOut.apply(self, arguments);}	, false);
				window.addEventListener("mouseout"	, function () {return self._onWindowMouseLeaveOut.apply(self, arguments);}	, false);
			}

			// prevent changing mouse cursor when 'mousedown' is occurred
			if (this.element.onselectstart) {
				this.element.onselectstart = function () {return false;};
			}

			if (this.element.addEventListener) {
				this.element.addEventListener("mousedown"	, function () {return self._onMouseDown.apply(self, arguments);}		, false);
				this.element.addEventListener("mouseup"		, function () {return self._onMouseUp.apply(self, arguments);}			, false);
				this.element.addEventListener("mousemove"	, function () {return self._onMouseMove.apply(self, arguments);}		, false);
				this.element.addEventListener("mouseleave"	, function () {return self._onMouseLeave.apply(self, arguments);}		, false);
				this.element.addEventListener("dblclick"	, function () {return self._onMouseDblClick.apply(self, arguments);}	, false);
			}
			if (this.widget.addEventListener) {
				// https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel
				// detect available wheel event
				var nameWheelEvent = (!AscCommon.AscBrowser.isMacOs && "onwheel" in document.createElement("div")) ? "wheel" :	// Modern browsers support "wheel"
					document.onmousewheel !== undefined ? "mousewheel" : 				// Webkit and IE support at least "mousewheel"
						"DOMMouseScroll";												// let's assume that remaining browsers are older Firefox

				this.widget.addEventListener(nameWheelEvent, function () {
					return self._onMouseWheel.apply(self, arguments);
				}, false);
				this.widget.addEventListener('contextmenu', function (e) {
					e.stopPropagation();
					e.preventDefault();
					return false;
				}, false)
			}

			// Курсор для графических объектов. Определяем mousedown и mouseup для выделения текста.
			var oShapeCursor = document.getElementById("id_target_cursor");
			if (null != oShapeCursor && oShapeCursor.addEventListener) {
				oShapeCursor.addEventListener("mousedown"	, function () {return self._onMouseDown.apply(self, arguments);}, false);
				oShapeCursor.addEventListener("mouseup"		, function () {return self._onMouseUp.apply(self, arguments);}, false);
				oShapeCursor.addEventListener("mousemove"	, function () {return self._onMouseMove.apply(self, arguments);}, false);
                oShapeCursor.addEventListener("mouseleave"	, function () {return self._onMouseLeave.apply(self, arguments);}, false);
			}

    		return this;
		};

		asc_CEventsController.prototype.destroy = function () {
			return this;
		};

		/** @param flag {Boolean} */
		asc_CEventsController.prototype.enableKeyEventsHandler = function (flag) {
			this.enableKeyEvents = !!flag;
		};

		/** @return {Boolean} */
		asc_CEventsController.prototype.canEdit = function () {
			return this.view.canEdit();
		};

		/** @return {Boolean} */
		asc_CEventsController.prototype.getCellEditMode = function () {
			return this.view.isCellEditMode;
		};

		asc_CEventsController.prototype.setFocus = function (hasFocus) {
			this.hasFocus = !!hasFocus;
		};

		asc_CEventsController.prototype.gotFocus = function (hasFocus) {
			this.setFocus(hasFocus);
			this.handlers.trigger('gotFocus', this.hasFocus);
		};

		/** @return {Boolean} */
		asc_CEventsController.prototype.getFormulaEditMode = function () {
			return this.view.isFormulaEditMode;
		};

		asc_CEventsController.prototype.getSelectionDialogMode = function () {
			return this.view.selectionDialogMode;
		};

		asc_CEventsController.prototype.reinitScrollX = function (settings, pos, max, max2) {
			var step = this.settings.hscrollStep;
			this.hsbMax = Math.max(max * step, 1);
			settings.contentW = this.hsbMax - 1;
			this.hsbApi.Repos(settings, false, false, pos * step);
			this.hsbApi.maxScrollX2 = Math.max(max2 * step, 1);
		};
		asc_CEventsController.prototype.reinitScrollY = function (settings, pos, max, max2) {
			var step = this.settings.vscrollStep;
			this.vsbMax = Math.max(max * step, 1);
			settings.contentH = this.vsbMax - 1;
			this.vsbApi.Repos(settings, false, false, pos * step);
			this.vsbApi.maxScrollY2 = Math.max(max2 * step, 1);
		};

		/**
		 * @param {AscCommon.CellBase} delta
		 */
		asc_CEventsController.prototype.scroll = function (delta) {
			if (delta) {
				if (delta.col) {this.scrollHorizontal(delta.col);}
				if (delta.row) {this.scrollVertical(delta.row);}
			}
		};

		/**
		 * @param delta {Number}
		 * @param [event] {MouseEvent}
		 */
		asc_CEventsController.prototype.scrollVertical = function (delta, event) {
			if (window["NATIVE_EDITOR_ENJINE"])
				return;

			if (event && event.preventDefault)
				event.preventDefault();
			this.vsbApi.scrollByY(this.settings.vscrollStep * delta);
			return true;
		};

		/**
		 * @param delta {Number}
		 * @param [event] {MouseEvent}
		 */
		asc_CEventsController.prototype.scrollHorizontal = function (delta, event) {
			if (window["NATIVE_EDITOR_ENJINE"])
				return;

			if (event && event.preventDefault)
				event.preventDefault();
			this.hsbApi.scrollByX(this.settings.hscrollStep * delta);
			return true;
		};

		// Будем делать dblClick как в Excel
		asc_CEventsController.prototype.doMouseDblClick = function (event) {
			var t = this;
			var ctrlKey = !AscCommon.getAltGr(event) && (event.metaKey || event.ctrlKey);

			// Для формулы не нужно выходить из редактирования ячейки
			if (this.getFormulaEditMode() || this.getSelectionDialogMode()) {return true;}

			if (this.view.Api.isEditVisibleAreaOleEditor) {return true;}

			if (this.targetInfo && (this.targetInfo.target === AscCommonExcel.c_oTargetType.GroupRow ||
				this.targetInfo.target === AscCommonExcel.c_oTargetType.GroupCol)) {
				return false;
			}

			if(this.targetInfo && (this.targetInfo.target === c_oTargetType.MoveResizeRange ||
				this.targetInfo.target === c_oTargetType.MoveRange ||
				this.targetInfo.target === c_oTargetType.FilterObject ||
				this.targetInfo.target === c_oTargetType.TableSelectionChange))
				return true;

			if (t.getCellEditMode()) {if (!t.handlers.trigger("stopCellEditing")) {return true;}}

			var coord = t._getCoordinates(event);
			var graphicsInfo = t.handlers.trigger("getGraphicsInfo", coord.x, coord.y);
			if (graphicsInfo)
				return;

			setTimeout(function () {
				var coord = t._getCoordinates(event);
				t.handlers.trigger("mouseDblClick", coord.x, coord.y, event, function () {
					// Мы изменяли размеры колонки/строки, не редактируем ячейку. Обновим состояние курсора
					t.handlers.trigger("updateWorksheet", coord.x, coord.y, ctrlKey,
						function (info) {t.targetInfo = info;});
				});
			}, 100);

			return true;
		};

		// Будем показывать курсор у редактора ячейки (только для dblClick)
		asc_CEventsController.prototype.showCellEditorCursor = function () {
			if (this.getCellEditMode()) {
				if (this.isDoBrowserDblClick) {
					this.isDoBrowserDblClick = false;
					this.handlers.trigger("showCellEditorCursor");
				}
			}
		};

		asc_CEventsController.prototype.createScrollSettings = function () {
			var settings = new AscCommon.ScrollSettings();

			settings.scrollBackgroundColor = GlobalSkin.ScrollBackgroundColor;
			settings.scrollBackgroundColorHover = GlobalSkin.ScrollBackgroundColor;
			settings.scrollBackgroundColorActive = GlobalSkin.ScrollBackgroundColor;

			settings.scrollerColor = GlobalSkin.ScrollerColor;
			settings.scrollerHoverColor = GlobalSkin.ScrollerHoverColor;
			settings.scrollerActiveColor = GlobalSkin.ScrollerActiveColor;

			settings.arrowColor = GlobalSkin.ScrollArrowColor;
			settings.arrowHoverColor = GlobalSkin.ScrollArrowHoverColor;
			settings.arrowActiveColor = GlobalSkin.ScrollArrowActiveColor;

			settings.strokeStyleNone = GlobalSkin.ScrollOutlineColor;
			settings.strokeStyleOver = GlobalSkin.ScrollOutlineHoverColor;
			settings.strokeStyleActive = GlobalSkin.ScrollOutlineActiveColor;

			settings.targetColor = GlobalSkin.ScrollerTargetColor;
			settings.targetHoverColor = GlobalSkin.ScrollerTargetHoverColor;
			settings.targetActiveColor = GlobalSkin.ScrollerTargetActiveColor;

			return settings;
		};

		asc_CEventsController.prototype.updateScrollSettings = function () {
			var opt = this.settings, settings;
			var ws = window["Asc"]["editor"].wb.getWorksheet();
			if (this.vsbApi) {
				settings = this.createScrollSettings();

				settings.vscrollStep = opt.vscrollStep;
				settings.hscrollStep = opt.hscrollStep;
				settings.wheelScrollLines = opt.wheelScrollLinesV;
				settings.isVerticalScroll = true;
				settings.isHorizontalScroll = false;
				this.vsbApi.canvasH = null;
				this.reinitScrollY(settings, ws.getFirstVisibleRow(true), ws.getVerticalScrollRange(), ws.getVerticalScrollMax());
				this.vsbApi.settings = settings;
			}
			if (this.hsbApi) {
				settings = this.createScrollSettings();
				settings.vscrollStep = opt.vscrollStep;
				settings.hscrollStep = opt.hscrollStep;
				settings.isVerticalScroll = false;
				settings.isHorizontalScroll = true;
				this.hsbApi.canvasW = null;
				this.reinitScrollX(settings, ws.getFirstVisibleCol(true), ws.getHorizontalScrollRange(), ws.getHorizontalScrollMax());
				this.hsbApi.settings = settings;
			}
		};

		asc_CEventsController.prototype._createScrollBars = function () {
			var self = this, settings, opt = this.settings;

			// vertical scroll bar
			this.vsb = document.createElement('div');
			this.vsb.id = "ws-v-scrollbar";
			this.vsb.style.backgroundColor = AscCommon.GlobalSkin.ScrollBackgroundColor;
			this.widget.appendChild(this.vsb);

			if (!this.vsbApi) {
				settings = this.createScrollSettings();
				settings.vscrollStep = opt.vscrollStep;
				settings.hscrollStep = opt.hscrollStep;
				settings.wheelScrollLines = opt.wheelScrollLinesV;
				settings.isVerticalScroll = true;
				settings.isHorizontalScroll = false;

				this.vsbApi = new AscCommon.ScrollObject(this.vsb.id, settings);
				this.vsbApi.bind("scrollvertical", function(evt) {
					self.handlers.trigger("scrollY", evt.scrollPositionY / self.settings.vscrollStep, !self.vsbApi.scrollerMouseDown);
				});
				this.vsbApi.bind("mouseup", function(evt) {
					if (self.vsbApi.scrollerMouseDown) {
						self.handlers.trigger('initRowsCount');
					}
				});
				this.vsbApi.onLockMouse = function(evt){
                    self.vsbApiLockMouse = true;
				};
				this.vsbApi.offLockMouse = function(){
                    self.vsbApiLockMouse = false;
				};
			}

			// horizontal scroll bar
			this.hsb = document.createElement('div');
			this.hsb.id = "ws-h-scrollbar";
			this.hsb.style.backgroundColor = AscCommon.GlobalSkin.ScrollBackgroundColor;
			this.widget.appendChild(this.hsb);

			if (!this.hsbApi) {
				settings = this.createScrollSettings();
				settings.vscrollStep = opt.vscrollStep;
				settings.hscrollStep = opt.hscrollStep;
				settings.isVerticalScroll = false;
				settings.isHorizontalScroll = true;

				this.hsbApi = new AscCommon.ScrollObject(this.hsb.id, settings);
				this.hsbApi.bind("scrollhorizontal",function(evt) {
					self.handlers.trigger("scrollX", evt.scrollPositionX / self.settings.hscrollStep, !self.hsbApi.scrollerMouseDown);
				});
				this.hsbApi.bind("mouseup", function(evt) {
					if (self.hsbApi.scrollerMouseDown) {
						self.handlers.trigger('initColsCount');
					}
				});
				this.hsbApi.onLockMouse = function(){
                    self.hsbApiLockMouse = true;
				};
				this.hsbApi.offLockMouse = function(){
                    self.hsbApiLockMouse = false;
				};
			}

            if(!this.view.Api.isMobileVersion){
                // right bottom corner
                var corner = document.createElement('div');
                corner.id = "ws-scrollbar-corner";
				corner.style.backgroundColor = AscCommon.GlobalSkin.ScrollBackgroundColor
                this.widget.appendChild(corner);
            }
            else{
                this.hsb.style.zIndex = -10;
                this.hsb.style.right = 0;
                this.hsb.style.display = "none";
                this.vsb.style.zIndex = -10;
                this.vsb.style.bottom = 0;
                this.vsb.style.display = "none";
            }


		};

		/**
		 * @param event {MouseEvent}
		 * @param callback {Function}
		 * @private
		 */
		asc_CEventsController.prototype._continueChangeVisibleArea = function (event, callback) {
			var t = this;
			var coord = this._getCoordinates(event);

			this.handlers.trigger("changeVisibleArea", /*isStartPoint*/false, coord.x, coord.y, false,
				function (d) {
					t.scroll(d);

					asc_applyFunction(callback);
				});
		};

		/**
		 *
		 * @param event {MouseEvent}
		 */
		asc_CEventsController.prototype._continueChangeVisibleArea2 = function (event) {
			var t = this;
			var fn = function () {t._continueChangeVisibleArea2(event);};

			var callback = function () {
				if (t.isChangeVisibleAreaMode && !t.hasCursor) {
					t.visibleAreaSelectionTimerId = window.setTimeout(fn, t.settings.scrollTimeout);
				}
			}
			window.clearTimeout(t.visibleAreaSelectionTimerId);
			window.setTimeout(function () {
				if (t.isChangeVisibleAreaMode && !t.hasCursor) {
					t._continueChangeVisibleArea(event, callback);
				}
			}, 0);

		};

		/**
		 *
		 * @param event {MouseEvent}
		 * @param callback {Function}
		 */
		asc_CEventsController.prototype._startChangeVisibleArea = function (event, callback) {
			var coord = this._getCoordinates(event);
			this.handlers.trigger("changeVisibleArea", /*isStartPoint*/true, coord.x, coord.y, false, callback);
		};

		/**
		 * @param event {MouseEvent}
		 * @param callback {Function}
		 */
		asc_CEventsController.prototype._changeSelection = function (event, callback) {
			var t = this;
			var coord = this._getCoordinates(event);

			this.handlers.trigger("changeSelection", /*isStartPoint*/false, coord.x, coord.y, /*isCoord*/true, false,
				function (d) {
					t.scroll(d);

					asc_applyFunction(callback);
				});
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._changeSelection2 = function (event) {
			var t = this;

			var fn = function () { t._changeSelection2(event); };
			var callback = function () {
				if (t.isSelectMode && !t.hasCursor) {
					t.scrollTimerId = window.setTimeout(fn, t.settings.scrollTimeout);
				}
			};

			window.clearTimeout(t.scrollTimerId);
			t.scrollTimerId = window.setTimeout(function () {
				if (t.isSelectMode && !t.hasCursor) {
					t._changeSelection(event, callback);
				}
			}, 0);
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._moveRangeHandle2 = function (event) {
			var t = this;

			var fn = function () {
				t._moveRangeHandle2(event);
			};

			var callback = function () {
				if (t.isMoveRangeMode && !t.hasCursor) {
					t.moveRangeTimerId  = window.setTimeout(fn, t.settings.scrollTimeout);
				}
			};

			window.clearTimeout(t.moveRangeTimerId);
			t.moveRangeTimerId = window.setTimeout(function () {
				if (t.isMoveRangeMode && !t.hasCursor) {
					t._moveRangeHandle(event, callback);
				}
			}, 0);
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._moveResizeRangeHandle2 = function (event) {
			var t = this;

			var fn = function () {
				t._moveResizeRangeHandle2(event);
			};

			var callback = function () {
				if (t.isMoveResizeRange && !t.hasCursor) {
					t.moveResizeRangeTimerId  = window.setTimeout(fn, t.settings.scrollTimeout);
				}
			};

			window.clearTimeout(t.moveResizeRangeTimerId);
			t.moveResizeRangeTimerId = window.setTimeout(function () {
				if (t.isMoveResizeRange && !t.hasCursor) {
					t._moveResizeRangeHandle(event, t.targetInfo, callback);
				}
			}, 0);
		};

		/**
		 * Окончание выделения
		 * @param event {MouseEvent}
		 */
		asc_CEventsController.prototype._changeSelectionDone = function (event) {
			var coord = this._getCoordinates(event);
			var ctrlKey = !AscCommon.getAltGr(event) && (event.metaKey || event.ctrlKey);
			if (false !== ctrlKey) {
				coord.x = -1;
				coord.y = -1;
			}
			this.handlers.trigger("changeSelectionDone", coord.x, coord.y, event);
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._resizeElement = function (event) {
			var coord = this._getCoordinates(event);
			this.handlers.trigger("resizeElement", this.targetInfo, coord.x, coord.y);
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._resizeElementDone = function (event) {
			var coord = this._getCoordinates(event);
			this.handlers.trigger("resizeElementDone", this.targetInfo, coord.x, coord.y, this.isResizeModeMove);
			this.isResizeModeMove = false;
		};

		/**
		 * @param event {MouseEvent}
		 * @param callback {Function}
		 */
		asc_CEventsController.prototype._changeFillHandle = function (event, callback, tableIndex) {
			var t = this;
			// Обновляемся в режиме автозаполнения
			var coord = this._getCoordinates(event);
			this.handlers.trigger("changeFillHandle", coord.x, coord.y,
				function (d) {
					if (!d) return;
					t.scroll(d);
					asc_applyFunction(callback);
				}, tableIndex);
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._changeFillHandle2 = function (event) {
			var t = this;

			var fn = function () {
				t._changeFillHandle2(event);
			};

			var callback = function () {
				if (t.isFillHandleMode && !t.hasCursor) {
					t.fillHandleModeTimerId  = window.setTimeout(fn, t.settings.scrollTimeout);
				}
			};

			window.clearTimeout(t.fillHandleModeTimerId);
			t.fillHandleModeTimerId = window.setTimeout(function () {
				if (t.isFillHandleMode && !t.hasCursor) {
					t._changeFillHandle(event, callback);
				}
			}, 0);
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._changeFillHandleDone = function (event) {
			// Закончили автозаполнение, пересчитаем
			var coord = this._getCoordinates(event);
			var ctrlKey = !AscCommon.getAltGr(event) && (event.metaKey || event.ctrlKey);
			this.handlers.trigger("changeFillHandleDone", coord.x, coord.y, ctrlKey);
		};

		/**
		 * @param event {MouseEvent}
		 * @param callback {Function}
		 */
		asc_CEventsController.prototype._moveRangeHandle = function (event, callback, colRowMoveProps) {
			var t = this;
			// Обновляемся в режиме перемещения диапазона
			var coord = this._getCoordinates(event);
			this.handlers.trigger("moveRangeHandle", coord.x, coord.y,
				function (d) {
					if (!d) return;
					t.scroll(d);
					asc_applyFunction(callback);
				}, colRowMoveProps);
		};

		/**
		 * @param event {MouseEvent}
		 * @param target
		 */
		asc_CEventsController.prototype._moveFrozenAnchorHandle = function (event, target) {
			var t = this;
			var coord = t._getCoordinates(event);
			t.handlers.trigger("moveFrozenAnchorHandle", coord.x, coord.y, target);
		};
		
		/**
		 * @param event {MouseEvent}
		 * @param target
		 */
		asc_CEventsController.prototype._moveFrozenAnchorHandleDone = function (event, target) {
			// Закрепляем область
			var t = this;
			var coord = t._getCoordinates(event);
			t.handlers.trigger("moveFrozenAnchorHandleDone", coord.x, coord.y, target);
		};

		/**
		 * @param event {MouseEvent}
		 * @param target
		 * @param callback {Function}
		 */
		asc_CEventsController.prototype._moveResizeRangeHandle = function (event, target, callback) {
			var t = this;
			// Обновляемся в режиме перемещения диапазона
			var coord = this._getCoordinates(event);
			this.handlers.trigger("moveResizeRangeHandle", coord.x, coord.y, target,
				function (d) {
					if (!d) return;
					t.scroll(d);
					asc_applyFunction(callback);
				});
		};

		asc_CEventsController.prototype._groupRowClick = function (event, target) {
			// Обновляемся в режиме перемещения диапазона
			var coord = this._getCoordinates(event);
			return this.handlers.trigger("groupRowClick", coord.x, coord.y, target, event.type);
		};

		asc_CEventsController.prototype._commentCellClick = function (event) {
			// ToDo delete this function!
			var coord = this._getCoordinates(event);
			this.handlers.trigger("commentCellClick", coord.x, coord.y);
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._moveRangeHandleDone = function (event) {
			// Закончили перемещение диапазона, пересчитаем
			var ctrlKey = !AscCommon.getAltGr(event) && (event.metaKey || event.ctrlKey);
			this.handlers.trigger("moveRangeHandleDone", ctrlKey);
		};

		asc_CEventsController.prototype._moveResizeRangeHandleDone = function (isPageBreakPreview) {
			// Закончили перемещение диапазона, пересчитаем
			this.handlers.trigger("moveResizeRangeHandleDone", isPageBreakPreview);
		};

		/** @param event {jQuery.Event} */
		asc_CEventsController.prototype._onWindowResize = function (event) {
			var self = this;
			window.clearTimeout(this.resizeTimerId);
			this.resizeTimerId = window.setTimeout(function () {self.handlers.trigger("resize", event);}, 150);
		};

		/** @param oEvent {AscCommon.CKeyboardEvent} */
		asc_CEventsController.prototype._onWindowKeyDown = function (oEvent) {
			const oThis = this;
			let nRetValue = keydownresult_PreventKeyPress;
			const nShortcutAction = oThis.view.Api.getShortcut(oEvent);

			// Для таких браузеров, которые не присылают отжатие левой кнопки мыши для двойного клика, при выходе из
			// окна редактора и отпускания кнопки, будем отрабатывать выход из окна (только Chrome присылает эвент MouseUp даже при выходе из браузера)
			this.showCellEditorCursor();

			if (oThis.getCellEditMode() && !oThis.hasFocus || oThis.isSelectMode ||
				oThis.isFillHandleMode || oThis.isMoveRangeMode || oThis.isMoveResizeRange) {
				// Почему-то очень хочется обрабатывать лишние условия в нашем коде, вместо обработки наверху...
				if (oThis.enableKeyEvents || (nShortcutAction !== Asc.c_oAscSpreadsheetShortcutType.Print)) {
					// Только если отключены эвенты и нажаты Ctrl+S или Ctrl+P мы их обработаем
					return nRetValue;
				}
			}

			let bIsSelect = oEvent.IsShift();
			const bIsMacOs = AscCommon.AscBrowser.isMacOs;
			const bSelectionDialogMode = this.getSelectionDialogMode();
			const bIsFormulaEditMode = this.getFormulaEditMode();
			const bCanEdit = this.canEdit();
			let nDeltaColumn = 0;
			let nDeltaRow = 0;
			// Двигаемся ли мы в выделенной области
			let bSelectionActivePointChanged = false;
			let bIsNeedCheckActiveCellChanged = null;
			let oActiveCell;

			switch (nShortcutAction) {
				case Asc.c_oAscSpreadsheetShortcutType.RecalculateAll: {
					oThis.handlers.trigger("calculate", Asc.c_oAscCalculateType.All);
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.RecalculateActiveSheet: {
					oThis.handlers.trigger("calculate", Asc.c_oAscCalculateType.ActiveSheet);
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.RefreshAllPivots:
				case Asc.c_oAscSpreadsheetShortcutType.RefreshSelectedPivots: {
					if (bCanEdit && !oThis.getCellEditMode() && !bSelectionDialogMode) {
						oThis.handlers.trigger("refreshConnections", nShortcutAction === Asc.c_oAscSpreadsheetShortcutType.RefreshAllPivots);
					}
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.EditSelectAll: {
					if (!oThis.getCellEditMode()) {
						oThis.handlers.trigger("selectColumnsByRange");
						oThis.handlers.trigger("selectRowsByRange");
						nRetValue = keydownresult_PreventAll;
					}
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.CellInsertDate:
				case Asc.c_oAscSpreadsheetShortcutType.CellInsertTime: {
					if (!bCanEdit || oThis.getCellEditMode() || bSelectionDialogMode) {
						break;
					}
					// При нажатии символа, фокус не ставим. Очищаем содержимое ячейки
					const oEnterOptions = new AscCommonExcel.CEditorEnterOptions();
					oEnterOptions.newText = '';
					oEnterOptions.quickInput = true;
					this.handlers.trigger("editCell", oEnterOptions);
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.NextWorksheet: {
					oThis.handlers.trigger("showNextPrevWorksheet", +1);
					nRetValue = keydownresult_PreventAll;
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.PreviousWorksheet: {
					oThis.handlers.trigger("showNextPrevWorksheet", -1);
					nRetValue = keydownresult_PreventAll;
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.Strikeout: {
					if (!bCanEdit || bSelectionDialogMode || oThis.getCellEditMode()) {
						break;
					}
					oThis.handlers.trigger("setFontAttributes", "s");
					nRetValue = keydownresult_PreventAll;
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.Italic: {
					if (!bCanEdit || bSelectionDialogMode || oThis.getCellEditMode()) {
						break;
					}
					oThis.handlers.trigger("setFontAttributes", "i");
					nRetValue = keydownresult_PreventAll;
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.Bold: {
					if (!bCanEdit || bSelectionDialogMode || oThis.getCellEditMode()) {
						break;
					}
					oThis.handlers.trigger("setFontAttributes", "b");
					nRetValue = keydownresult_PreventAll;
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.Underline: {
					if (!bCanEdit || bSelectionDialogMode || oThis.getCellEditMode()) {
						break;
					}
					oThis.handlers.trigger("setFontAttributes", "u");
					nRetValue = keydownresult_PreventAll;
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.EditRedo: {
					if (!(bCanEdit || oThis.handlers.trigger('isRestrictionComments')) || bSelectionDialogMode || oThis.getCellEditMode()) {
						break;
					}
					bIsNeedCheckActiveCellChanged = true;
					oThis.handlers.trigger("redo");
					nRetValue = keydownresult_PreventAll;
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.EditUndo: {
					if (!(bCanEdit || oThis.handlers.trigger('isRestrictionComments')) || bSelectionDialogMode || oThis.getCellEditMode()) {
						break;
					}
					bIsNeedCheckActiveCellChanged = true;
					oThis.handlers.trigger("undo");
					nRetValue = keydownresult_PreventAll;
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.SpeechWorker: {
					if (oThis.getCellEditMode() || bSelectionDialogMode) {
						break;
					}
					AscCommon.EditorActionSpeaker.toggle();
					nRetValue = keydownresult_PreventAll;
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.CellInsertSumFunction: {
					if (!bCanEdit || oThis.getCellEditMode() || bSelectionDialogMode) {
						break;
					}
					this.handlers.trigger('addFunction',
						AscCommonExcel.cFormulaFunctionToLocale ? AscCommonExcel.cFormulaFunctionToLocale['SUM'] :
							'SUM', Asc.c_oAscPopUpSelectorType.Func, true);
					nRetValue = keydownresult_PreventAll;
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.Print: {
					if (oThis.getCellEditMode()) {
						break;
					}
					oThis.handlers.trigger("print");
					nRetValue = keydownresult_PreventAll;
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.EditOpenCellEditor: {
					if (!bCanEdit || oThis.getCellEditMode() || bSelectionDialogMode) {
						break;
					}
					if (AscBrowser.isOpera) {
						nRetValue = keydownresult_PreventAll;
					}
					// При F2 выставляем фокус в редакторе
					const oEnterOptions = new AscCommonExcel.CEditorEnterOptions();
					oEnterOptions.focus = true;
					oThis.handlers.trigger("editCell", oEnterOptions);
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.CellAddSeparator: {
					if (!bCanEdit || oThis.getCellEditMode() || bSelectionDialogMode) {
						break;
					}
					window["Asc"]["editor"].wb.EnterText(this.view.Api.asc_getDecimalSeparator().charCodeAt(0), true);
					//stop to prevent double enter
					nRetValue = keydownresult_PreventAll;
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.CellNumberFormat: {
					if (!bCanEdit || bSelectionDialogMode || oThis.getCellEditMode()) {
						break;
					}
					oThis.handlers.trigger("setCellFormat", Asc.c_oAscNumFormatType.Number);
					nRetValue = keydownresult_PreventAll;
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.CellTimeFormat: {
					if (!bCanEdit || bSelectionDialogMode || oThis.getCellEditMode()) {
						break;
					}
					oThis.handlers.trigger("setCellFormat", Asc.c_oAscNumFormatType.Time);
					nRetValue = keydownresult_PreventAll;
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.CellDateFormat: {
					if (!bCanEdit || bSelectionDialogMode || oThis.getCellEditMode()) {
						break;
					}
					oThis.handlers.trigger("setCellFormat", Asc.c_oAscNumFormatType.Date);
					nRetValue = keydownresult_PreventAll;
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.CellCurrencyFormat: {
					if (!bCanEdit || bSelectionDialogMode || oThis.getCellEditMode()) {
						break;
					}
					oThis.handlers.trigger("setCellFormat", Asc.c_oAscNumFormatType.Currency);
					nRetValue = keydownresult_PreventAll;
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.CellPercentFormat: {
					if (!bCanEdit || bSelectionDialogMode || oThis.getCellEditMode()) {
						break;
					}
					oThis.handlers.trigger("setCellFormat", Asc.c_oAscNumFormatType.Percent);
					nRetValue = keydownresult_PreventAll;
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.CellExponentialFormat: {
					if (!bCanEdit || bSelectionDialogMode || oThis.getCellEditMode()) {
						break;
					}
					oThis.handlers.trigger("setCellFormat", Asc.c_oAscNumFormatType.Scientific);
					nRetValue = keydownresult_PreventAll;
					break;
				}
				case Asc.c_oAscSpreadsheetShortcutType.CellGeneralFormat: {
					if (!bCanEdit || bSelectionDialogMode || oThis.getCellEditMode()) {
						break;
					}
					oThis.handlers.trigger("setCellFormat", Asc.c_oAscNumFormatType.General);
					nRetValue = keydownresult_PreventAll;
					break;
				}

				case Asc.c_oAscSpreadsheetShortcutType.ShowFormulas: {
					if (bSelectionDialogMode || oThis.getCellEditMode()) {
						break;
					}
					oThis.handlers.trigger("showFormulas");
					nRetValue = keydownresult_PreventAll;
					break;
				}
				default: {
					const oCustom = oThis.view.Api.getCustomShortcutAction(nShortcutAction);
					if (oCustom) {
						if (!bCanEdit || bSelectionDialogMode || oThis.getCellEditMode()) {
							break;
						}
						if (AscCommon.c_oAscCustomShortcutType.Symbol === oCustom.Type) {
							const oEnterOptions = new AscCommonExcel.CEditorEnterOptions();
							oEnterOptions.newText = '';
							oEnterOptions.quickInput = true;
							this.handlers.trigger("editCell", oEnterOptions);
						}
					} else {
						nRetValue = keydownresult_PreventNothing;
					}
					break;
				}
			}
			if (!nShortcutAction) {
				switch (oEvent.GetKeyCode()) {
					case 82:
						if (oEvent.CtrlKey && bIsSelect) {
							if (bCanEdit && !oThis.getCellEditMode() && !bSelectionDialogMode) {
								oThis.handlers.trigger("changeFormatTableInfo");
							}
							nRetValue = keydownresult_PreventAll;
						}
						break;
					case 8: // backspace
						if (!bCanEdit || oThis.getCellEditMode() || bSelectionDialogMode) {
							break;
						}
						nRetValue = keydownresult_PreventAll;

						// При backspace фокус не в редакторе (стираем содержимое)
						const oEnterOptions = new AscCommonExcel.CEditorEnterOptions();
						oEnterOptions.newText = '';
						oThis.handlers.trigger("editCell", oEnterOptions);
						break;

					case 46: // Del
						if (!bCanEdit || this.getCellEditMode() || bSelectionDialogMode || bIsSelect) {
							break;
						}
						// Удаляем содержимое
						this.handlers.trigger("empty");
						break;

					case 9: // tab
						if (oThis.getCellEditMode() || bSelectionDialogMode) {
							break;
						}
						// Отключим стандартную обработку браузера нажатия tab
						nRetValue = keydownresult_PreventAll;

						// Особый случай (возможно движение в выделенной области)
						bSelectionActivePointChanged = true;
						if (bIsSelect) {
							nDeltaColumn = -1;			// (shift + tab) - движение по ячейкам влево на 1 столбец
							bIsSelect = false;	// Сбросим shift, потому что мы не выделяем
						} else {
							oActiveCell = oThis.handlers.trigger("getActiveCell");
							if (oThis.lastTab === null) {
								if (oActiveCell) {
									oThis.lastTab = oActiveCell.c2;
								}
							} else if (!oActiveCell) {
								oThis.lastTab = null;
							}
							nDeltaColumn = +1;			// (tab) - движение по ячейкам вправо на 1 столбец
						}
						break;

					case 13:  // "enter"
						if (oThis.getCellEditMode() || bSelectionDialogMode) {
							break;
						}
						// Особый случай (возможно движение в выделенной области)
						bSelectionActivePointChanged = true;
						if (bIsSelect) {
							nDeltaRow = -1;			// (shift + enter) - движение по ячейкам наверх на 1 строку
							bIsSelect = false;	// Сбросим shift, потому что мы не выделяем
							oThis.lastTab = null;
						} else {
							if (oThis.lastTab !== null) {
								oActiveCell = oThis.handlers.trigger("getActiveCell");
								if (oActiveCell) {
									nDeltaColumn = oThis.lastTab - oActiveCell.c2;
								} else {
									oThis.lastTab = null;
								}
							}
							nDeltaRow = +1;			// (enter) - движение по ячейкам вниз на 1 строку
						}
						break;

					case 27: // Esc
						oThis.handlers.trigger("stopFormatPainter");
						oThis.handlers.trigger("stopAddShape");
						oThis.handlers.trigger("cleanCutData", true, true);
						oThis.handlers.trigger("cleanCopyData", true, true);
						oThis.view.Api.cancelEyedropper();
						window['AscCommon'].g_specialPasteHelper.SpecialPasteButton_Hide();
						break;

					case 144: //Num Lock
					case 145: //Scroll Lock
						if (AscBrowser.isOpera) {
							nRetValue = keydownresult_PreventAll;
						}
						break;

					case 32: // Spacebar
						if (oThis.getCellEditMode()) {
							break;
						}
						const bIsSelectColumns = oEvent.CtrlKey;
						if (bIsSelectColumns && bIsSelect && bIsMacOs) {
							break;
						}
						// Отключим стандартную обработку браузера нажатия
						// Ctrl+Shift+Spacebar, Ctrl+Spacebar, Shift+Spacebar
						nRetValue = keydownresult_PreventAll;
						if (bIsSelectColumns) {
							oThis.handlers.trigger("selectColumnsByRange");
						}
						if (bIsSelect) {
							oThis.handlers.trigger("selectRowsByRange");
						}
						break;
					case 33: // PageUp
						nDeltaRow = -0.5;
						bIsNeedCheckActiveCellChanged = true;
						nRetValue = keydownresult_PreventAll;
						break;

					case 34: // PageDown
						nDeltaRow = +0.5;
						bIsNeedCheckActiveCellChanged = true;
						nRetValue = keydownresult_PreventAll;
						break;

					case 37: // left
						nDeltaColumn = oEvent.CtrlKey ? -1.5 : -1;  // Движение стрелками (влево-вправо, вверх-вниз)
						bIsNeedCheckActiveCellChanged = true;
						nRetValue = keydownresult_PreventAll;                          // Отключим стандартную обработку браузера нажатия left
						break;

					case 38: // up
						if (bCanEdit && !oThis.getCellEditMode() && !bSelectionDialogMode && oEvent.IsAlt() && oThis.handlers.trigger("onDataValidation")) {
							break;
						}
						nDeltaRow = oEvent.CtrlKey ? -1.5 : -1;  // Движение стрелками (влево-вправо, вверх-вниз)
						bIsNeedCheckActiveCellChanged = true;
						nRetValue = keydownresult_PreventAll;                           // Отключим стандартную обработку браузера нажатия up
						break;

					case 39: // right
						nDeltaColumn = oEvent.CtrlKey ? +1.5 : +1;  // Движение стрелками (влево-вправо, вверх-вниз)
						bIsNeedCheckActiveCellChanged = true;
						nRetValue = keydownresult_PreventAll;                           // Отключим стандартную обработку браузера нажатия right
						break;

					case 40: // down
						nRetValue = keydownresult_PreventAll;                           // Отключим стандартную обработку браузера нажатия down
						// Обработка Alt + down
						if (bCanEdit && !oThis.getCellEditMode() && !bSelectionDialogMode && oEvent.IsAlt()) {
							if (oThis.handlers.trigger("onShowFilterOptionsActiveCell")) {
								break;
							}
							if (oThis.handlers.trigger("onDataValidation")) {
								break;
							}
							oThis.handlers.trigger("showAutoComplete");
							break;
						}
						nDeltaRow = oEvent.CtrlKey ? +1.5 : +1;  // Движение стрелками (влево-вправо, вверх-вниз)
						bIsNeedCheckActiveCellChanged = true;
						break;

					case 36: // home
						nRetValue = keydownresult_PreventAll;                           // Отключим стандартную обработку браузера нажатия home
						if (bIsFormulaEditMode) {
							break;
						}
						nDeltaColumn = -2.5;
						if (oEvent.CtrlKey) {
							nDeltaRow = -2.5;
						}
						bIsNeedCheckActiveCellChanged = true;
						break;

					case 35: // end
						nRetValue = keydownresult_PreventAll;                           // Отключим стандартную обработку браузера нажатия end
						if (bIsFormulaEditMode) {
							break;
						}
						nDeltaColumn = 2.5;
						if (oEvent.CtrlKey) {
							nDeltaRow = 2.5;
						}
						bIsNeedCheckActiveCellChanged = true;
						break;
					case 93:
						if (!oEvent.MacCmdKey) {
							nRetValue = keydownresult_PreventAll;
							this.handlers.trigger('onContextMenu', oEvent);
						}
						break;
					default:
						nRetValue = keydownresult_PreventNothing;
						break;
				}
			}

			let oActiveCellBefore;
			if (bIsNeedCheckActiveCellChanged) {
				oActiveCellBefore = oThis.handlers.trigger("getActiveCell");
			}
			const CheckLastTab = function () {
				if (bIsNeedCheckActiveCellChanged) {
					const oActiveCellAfter = oThis.handlers.trigger("getActiveCell");
					if (!oActiveCellBefore || !oActiveCellAfter || !oActiveCellAfter.isEqual(oActiveCellBefore)) {
						oThis.lastTab = null;
					}
				}
			};

			if ((nDeltaColumn !== 0 || nDeltaRow !== 0) && false === oThis.handlers.trigger("isGlobalLockEditCell")) {
				const bIsChangeVisibleAreaMode = this.view.Api.isEditVisibleAreaOleEditor;
				if (bIsChangeVisibleAreaMode) {
					oThis.handlers.trigger("changeVisibleArea", !bIsSelect, nDeltaColumn, nDeltaRow, false, function (d) {
						const oWb = window["Asc"]["editor"].wb;
						if (oThis.targetInfo) {
							oWb._onUpdateWorksheet(oThis.targetInfo.coordX, oThis.targetInfo.coordY, false);
						}
						oThis.scroll(d);
						const oOleSize = oWb.getOleSize();
						oOleSize.addPointToLocalHistory();
						CheckLastTab();
					}, true);
				} else if (bSelectionActivePointChanged) { // Проверка на движение в выделенной области
					oThis.handlers.trigger("selectionActivePointChanged", nDeltaColumn, nDeltaRow, function (d) {
						oThis.scroll(d);
						CheckLastTab();
					});
				} else {
					oThis.handlers.trigger("changeSelection", /*isStartPoint*/!bIsSelect, nDeltaColumn, nDeltaRow, /*isCoord*/false, false,
						function (d) {
							const oWb = window["Asc"]["editor"].wb;
							if (oThis.targetInfo) {
								oWb._onUpdateWorksheet(oThis.targetInfo.coordX, oThis.targetInfo.coordY, false);
							}
							oThis.scroll(d);
							CheckLastTab();
						});
				}
			}

			if (nRetValue & keydownresult_PreventKeyPress) {
				oThis._setSkipKeyPress(true);
			}
			return nRetValue;
		};

		/** @param event {AscCommon.CKeyboardEvent} */
		asc_CEventsController.prototype._onWindowKeyPress = function (event) {
			// Нельзя при отключенных эвентах возвращать false (это касается и ViewerMode)
			if (!this.enableKeyEvents) {
				return true;
			}

			// не вводим текст в режиме просмотра
			// если в FF возвращать false, то отменяется дальнейшая обработка серии keydown -> keypress -> keyup
			// и тогда у нас не будут обрабатываться ctrl+c и т.п. события
			if (!this.canEdit() || this.getSelectionDialogMode() || this.view.Api.isEditVisibleAreaOleEditor) {
				return true;
			}

			// Для таких браузеров, которые не присылают отжатие левой кнопки мыши для двойного клика, при выходе из
			// окна редактора и отпускания кнопки, будем отрабатывать выход из окна (только Chrome присылает эвент MouseUp даже при выходе из браузера)
			this.showCellEditorCursor();

			// Не можем вводить когда селектим или когда совершаем действия с объектом
			if (this.getCellEditMode() && !this.hasFocus || this.isSelectMode ||
				!this.handlers.trigger('canReceiveKeyPress')) {
				return true;
			}

			if (this.skipKeyPress || event.KeyCode < 32) {
				this._setSkipKeyPress(true);
				return true;
			}

			if (!this.getCellEditMode()) {
				if (this.handlers.trigger("graphicObjectWindowKeyPress", event)) {
					return true;
				}

				// При нажатии символа, фокус не ставим и очищаем содержимое ячейки
				var enterOptions = new AscCommonExcel.CEditorEnterOptions();
				enterOptions.newText = '';
				enterOptions.quickInput = true;
				this.handlers.trigger("editCell", enterOptions);
			}
			return true;
		};

		asc_CEventsController.prototype.EnterText = function (codePoints) {
			//TODO практически копия _onWindowKeyPress - после того, как будет включена функция EnterText - проверить и объединить функции
			// Нельзя при отключенных эвентах возвращать false (это касается и ViewerMode)
			if (!this.enableKeyEvents) {
				return true;
			}

			// не вводим текст в режиме просмотра
			// если в FF возвращать false, то отменяется дальнейшая обработка серии keydown -> keypress -> keyup
			// и тогда у нас не будут обрабатываться ctrl+c и т.п. события
			if (!this.canEdit() || this.getSelectionDialogMode() || this.view.Api.isEditVisibleAreaOleEditor) {
				return true;
			}

			// Для таких браузеров, которые не присылают отжатие левой кнопки мыши для двойного клика, при выходе из
			// окна редактора и отпускания кнопки, будем отрабатывать выход из окна (только Chrome присылает эвент MouseUp даже при выходе из браузера)
			this.showCellEditorCursor();

			// Не можем вводить когда селектим или когда совершаем действия с объектом
			if (this.getCellEditMode() && !this.hasFocus || this.isSelectMode ||
				!this.handlers.trigger('canReceiveKeyPress')) {
				return true;
			}

			/*if (this.skipKeyPress) {
				this._setSkipKeyPress(true);
				return true;
			}*/

			if (!this.getCellEditMode()) {
				if (this.handlers.trigger("graphicObjectWindowEnterText", codePoints)) {
					return true;
				}

				// При нажатии символа, фокус не ставим и очищаем содержимое ячейки
				var enterOptions = new AscCommonExcel.CEditorEnterOptions();
				enterOptions.newText = '';
				enterOptions.quickInput = true;
				this.handlers.trigger("editCell", enterOptions);
			}
			return true;
		};

		/** @param event {AscCommon.CKeyboardEvent} */
		asc_CEventsController.prototype._onWindowKeyUp = function (event) {
			// При отпускании shift нужно переслать информацию о выделении
			if (16 === event.KeyCode) {
				this.handlers.trigger("updateSelectionName");
			}
			this.handlers.trigger("graphicObjectWindowKeyUp", event);
			return true;
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._onWindowMouseMove = function (event) {
			var coord = this._getCoordinates(event);
				
			if (this.isSelectMode && !this.hasCursor) {this._changeSelection2(event);}
			if (this.isChangeVisibleAreaMode && !this.hasCursor) {
				this._continueChangeVisibleArea2(event);
			}
			if (this.isResizeMode && !this.hasCursor) {
				this.isResizeModeMove = true;
				this._resizeElement(event);
			}
            if (this.hsbApiLockMouse)
                this.hsbApi.mouseDown ? this.hsbApi.evt_mousemove.call(this.hsbApi,event) : false;
            else if (this.vsbApiLockMouse)
                this.vsbApi.mouseDown ? this.vsbApi.evt_mousemove.call(this.vsbApi,event) : false;
				
			// Режим установки закреплённых областей
			if (this.frozenAnchorMode) {
				this._moveFrozenAnchorHandle(event, this.frozenAnchorMode);
				return true;
			}

			if (this.isShapeAction) {
				event.isLocked = this.isMousePressed;
				this.handlers.trigger("graphicObjectMouseMove", event, coord.x, coord.y);
			}

			if (this.isRowGroup) {
				if(!this._groupRowClick(event, this.targetInfo)) {
					this.isRowGroup = false;
				}
			}

			return true;
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._onWindowMouseUp = function (event) {
			AscCommon.global_mouseEvent.UnLockMouse();

			var coord = this._getCoordinates(event);
            if (this.hsbApiLockMouse)
                this.hsbApi.mouseDown ? this.hsbApi.evt_mouseup.call(this.hsbApi, event) : false;
            else if (this.vsbApiLockMouse)
                this.vsbApi.mouseDown ? this.vsbApi.evt_mouseup.call(this.vsbApi, event) : false;

			this.isMousePressed = false;
			// Shapes
			if (this.isShapeAction) {
                if(!this.isUpOnCanvas) {
					let oDrawingsController = this.view.getWorksheet().objectRender.controller;
					if(oDrawingsController.haveTrackedObjects()) {
						event.isLocked = this.isMousePressed;
						event.ClickCount = this.clickCounter.clickCount;
						event.fromWindow = true;
						this.handlers.trigger("graphicObjectMouseUp", event, coord.x, coord.y);
						this._changeSelectionDone(event);
					}
                }
                this.isUpOnCanvas = false;
				return true;
			}

			if (this.isChangeVisibleAreaMode) {
				this.isChangeVisibleAreaMode = false;
				const oOleSize = this.view.getOleSize();
				oOleSize.addPointToLocalHistory();
			}

			if (this.isSelectMode) {
				this.isSelectMode = false;
				this._changeSelectionDone(event);
			}

			if (this.isResizeMode) {
				this.isResizeMode = false;
				this._resizeElementDone(event);
			}

			// Режим автозаполнения
			if (this.isFillHandleMode) {
				// Закончили автозаполнение
				this.isFillHandleMode = false;
				this._changeFillHandleDone(event);
			}

			// Режим перемещения диапазона
			if (this.isMoveRangeMode) {
				// Закончили перемещение диапазона
				this.isMoveRangeMode = false;
				this._moveRangeHandleDone(event);
			}

			if (this.isMoveResizeRange) {
				this.isMoveResizeRange = false;
				this._moveResizeRangeHandleDone(this.targetInfo && this.targetInfo.isPageBreakPreview);
			}
			// Режим установки закреплённых областей
			if (this.frozenAnchorMode) {
				this._moveFrozenAnchorHandleDone(event, this.frozenAnchorMode);
				this.frozenAnchorMode = false;
			}

			// Мы можем dblClick и не отработать, если вышли из области и отпустили кнопку мыши, нужно отработать
			this.showCellEditorCursor();


			return true;
		};

		/**
		 *
		 * @param event
		 * @param x
		 * @param y
		 */
		asc_CEventsController.prototype._onWindowMouseUpExternal = function (event, x, y) {
			// ToDo стоит переделать на нормальную схему, пока пропишем прямо в эвенте
			if (null != x && null != y)
				event.coord = {x: x, y: y};
			this._onWindowMouseUp(event);

			if (window.g_asc_plugins)
                window.g_asc_plugins.onExternalMouseUp();
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._onWindowMouseLeaveOut = function (event) {
			// Когда обрабатывать нечего - выходим
			if (!this.isDoBrowserDblClick)
				return true;

			var relatedTarget = event.relatedTarget || event.fromElement;
			// Если мы двигаемся по редактору ячейки, то ничего не снимаем
			if (relatedTarget && ("ce-canvas-outer" === relatedTarget.id ||
				"ce-canvas" === relatedTarget.id || "ce-canvas-overlay" === relatedTarget.id ||
				"ce-cursor" === relatedTarget.id || "ws-canvas-overlay" === relatedTarget.id))
				return true;

			// Для таких браузеров, которые не присылают отжатие левой кнопки мыши для двойного клика, при выходе из
			// окна редактора и отпускания кнопки, будем отрабатывать выход из окна (только Chrome присылает эвент MouseUp даже при выходе из браузера)
			this.showCellEditorCursor();
			return true;
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._onMouseDown = function (event) {
			var t = this;
			asc["editor"].checkInterfaceElementBlur();
			var ctrlKey = !AscCommon.getAltGr(event) && (event.metaKey || event.ctrlKey);
			var coord = t._getCoordinates(event);
			var button = AscCommon.getMouseButton(event);
			event.isLocked = t.isMousePressed = true;
			this.isShapeAction = false;
			// Shapes
			var graphicsInfo = t.handlers.trigger("getGraphicsInfo", coord.x, coord.y);
			if(!graphicsInfo) {
				// Update state for device without cursor
				this._onMouseMove(event);
			}

			if (this.view.Api.isEditVisibleAreaOleEditor) {
				if (button === 0 && this.view.isInnerOfWorksheet(coord.x, coord.y)) {
					if (this.targetInfo && this.targetInfo.target === c_oTargetType.MoveResizeRange) {
						t._moveResizeRangeHandle(event, t.targetInfo);
						t.isMoveResizeRange = true;
					} else {
						this._startChangeVisibleArea(event);
						this.isChangeVisibleAreaMode = true;
					}
				}
				return;
			}

			if (AscCommon.g_inputContext) {
				AscCommon.g_inputContext.externalChangeFocus();
			}

			AscCommon.global_mouseEvent.LockMouse();

			if(t.view.Api.isEyedropperStarted()) {
				return;
			}
			if (t.handlers.trigger("isGlobalLockEditCell")) {
				return;
			}

			if (!this.enableKeyEvents) {
				t.handlers.trigger("canvasClick");
			}

			if (!(asc["editor"].isStartAddShape || asc["editor"].isInkDrawerOn() || this.getSelectionDialogMode() || this.getCellEditMode() && !this.handlers.trigger("stopCellEditing"))) {
				const isPlaceholder = t.handlers.trigger("onPointerDownPlaceholder", coord.x, coord.y);
				if (isPlaceholder) {
					return;
				}
			}

			// do not work with drawings in selection dialog mode
			if (!this.getSelectionDialogMode()) {
				if (asc["editor"].isStartAddShape || asc["editor"].isInkDrawerOn() || graphicsInfo) {


					if (this.getCellEditMode() && !this.handlers.trigger("stopCellEditing")) {
						return;
					}

					t.isShapeAction = true;
					t.isUpOnCanvas = false;


					t.clickCounter.mouseDownEvent(coord.x, coord.y, button);
					event.ClickCount = t.clickCounter.clickCount;
					if (0 === event.ClickCount % 2) {
						t.isDblClickInMouseDown = true;
					}

					t.handlers.trigger("graphicObjectMouseDown", event, coord.x, coord.y);
					t.handlers.trigger("updateSelectionShape", /*isSelectOnShape*/true);
					return;
				}
			}


			if (2 === event.detail) {
				// Это означает, что это MouseDown для dblClick эвента (его обрабатывать не нужно)
				// Порядок эвентов для dblClick - http://javascript.ru/tutorial/events/mouse#dvoynoy-levyy-klik

				// Проверка для IE, т.к. он присылает DblClick при сдвиге мыши...
				if (this.mouseDownLastCord && coord.x === this.mouseDownLastCord.x && coord.y === this.mouseDownLastCord.y &&
					0 === button && !this.handlers.trigger('isFormatPainter')) {
					// Выставляем, что мы уже сделали dblClick (иначе вдруг браузер не поддерживает свойство detail)
					this.isDblClickInMouseDown = true;
					// Нам нужно обработать эвент браузера о dblClick (если мы редактируем ячейку, то покажем курсор, если нет - то просто ничего не произойдет)
					this.isDoBrowserDblClick = true;
					this.doMouseDblClick(event);
					// Обнуляем координаты
					this.mouseDownLastCord = null;
					return;
				}
			}
			// Для IE preventDefault делать не нужно
			if (!(AscBrowser.isIE || AscBrowser.isOpera)) {
				if (event.preventDefault) {
					event.preventDefault();
				} else {
					event.returnValue = false;
				}
			}

			// Запоминаем координаты нажатия
			this.mouseDownLastCord = coord;

			if (!t.getCellEditMode() && !t.getSelectionDialogMode()) {
				this.gotFocus(true);
				if (event.shiftKey && !(t.targetInfo.target === c_oTargetType.ColumnRowHeaderMove && this.canEdit())) {
					t.isSelectMode = true;
					t._changeSelection(event);
					return;
				}
				if (t.targetInfo) {
					if ((t.targetInfo.target === c_oTargetType.ColumnResize ||
						t.targetInfo.target === c_oTargetType.RowResize) && 0 === button) {
						t.isResizeMode = true;
						t._resizeElement(event);
						return;
					} else if (t.targetInfo.target === c_oTargetType.FillHandle && this.canEdit()) {
						// В режиме автозаполнения
						this.isFillHandleMode = true;
						t._changeFillHandle(event, null, t.targetInfo.tableIndex);
						return;
					} else if (t.targetInfo.target === c_oTargetType.MoveRange && this.canEdit()) {
						// В режиме перемещения диапазона
						this.isMoveRangeMode = true;
						t._moveRangeHandle(event);
						return;
					} else if (t.targetInfo.target === c_oTargetType.FilterObject) {
						if (0 === button) {
							if (t.targetInfo.isDataValidation) {
								this.handlers.trigger('onDataValidation');
							} else if (t.targetInfo.idPivot) {
								this.handlers.trigger("pivotFiltersClick", t.targetInfo.idPivot);
							} else if (t.targetInfo.idPivotCollapse) {
								this.handlers.trigger("pivotCollapseClick", t.targetInfo.idPivotCollapse);
							} else if (t.targetInfo.idTableTotal) {
								this.handlers.trigger("tableTotalClick", t.targetInfo.idTableTotal);
							} else {
								this.handlers.trigger("autoFiltersClick", t.targetInfo.idFilter);
							}
						}
						event.preventDefault && event.preventDefault();
						event.stopPropagation && event.stopPropagation();
						return;
					} else if (t.targetInfo.commentIndexes) {
						t._commentCellClick(event);
					} else if (t.targetInfo.target === c_oTargetType.MoveResizeRange && this.canEdit()) {
						this.isMoveResizeRange = true;
						t._moveResizeRangeHandle(event, t.targetInfo);
						return;
					} else if ((t.targetInfo.target === c_oTargetType.FrozenAnchorV ||
						t.targetInfo.target === c_oTargetType.FrozenAnchorH) && this.canEdit()) {
						// Режим установки закреплённых областей
						this.frozenAnchorMode = t.targetInfo.target;
						t._moveFrozenAnchorHandle(event, this.frozenAnchorMode);
						return;
					} else if (t.targetInfo.target === c_oTargetType.GroupRow && 0 === button) {
						if(t._groupRowClick(event, t.targetInfo)) {
							t.isRowGroup = true;
						}
						return;
					} else if (t.targetInfo.target === c_oTargetType.GroupCol && 0 === button) {
						if(t._groupRowClick(event, t.targetInfo)) {
							t.isRowGroup = true;
						}
						return;
					} else if ((t.targetInfo.target === c_oTargetType.GroupCol || t.targetInfo.target === c_oTargetType.GroupRow) && 2 === button) {
						this.handlers.trigger('onContextMenu', null);
						return;
					} else if (t.targetInfo.target === c_oTargetType.TableSelectionChange) {
						this.handlers.trigger('onChangeTableSelection', t.targetInfo);
						return;
					}
				}
			} else {
				if (this.getFormulaEditMode()) {
					if (this.targetInfo && this.targetInfo.target === c_oTargetType.MoveResizeRange) {
						this.isMoveResizeRange = true;
						this._moveResizeRangeHandle(event, this.targetInfo);
						return;
					} else if (this.targetInfo && this.targetInfo.target === c_oTargetType.FillHandle) {
						return;
					}

					if (2 === button) {
						return;
					}
				} else {
					if (!this.handlers.trigger("stopCellEditing")) {
						return;
					}
				}

				this.gotFocus(true);

				if (event.shiftKey) {
					this.isSelectMode = true;
					this._changeSelection(event);
					return;
				}
			}

			// Если нажали правую кнопку мыши, то сменим выделение только если мы не в выделенной области
			if (2 === button) {
				this.handlers.trigger("changeSelectionRightClick", coord.x, coord.y, this.targetInfo && this.targetInfo.target);
				this.handlers.trigger('onContextMenu', event);
			} else {
				if (this.targetInfo && this.targetInfo.target === c_oTargetType.FillHandle && this.canEdit()) {
					// В режиме автозаполнения
					this.isFillHandleMode = true;
					this._changeFillHandle(event, null, t.targetInfo.tableIndex);
				} else {
					if (this.targetInfo && this.targetInfo.target === c_oTargetType.ColumnRowHeaderMove) {
						this.isMoveRangeMode = true;
						t._moveRangeHandle(event, null, {ctrlKey: ctrlKey, shiftKey: event.shiftKey});
						t.handlers.trigger("updateWorksheet", coord.x, coord.y);
						//t.handlers.trigger("updateWorksheet", coord.x, coord.y, ctrlKey, function(info){t.targetInfo = info;});
					} else {
						this.isSelectMode = true;
						this.handlers.trigger("changeSelection", /*isStartPoint*/true, coord.x, coord.y, /*isCoord*/true,
							ctrlKey);
					}
				}
			}
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._onMouseUp = function (event) {
			var button = AscCommon.getMouseButton(event);
			AscCommon.global_mouseEvent.UnLockMouse();

			if (this.isChangeVisibleAreaMode) {
				this.isChangeVisibleAreaMode = false;
				const oOleSize = this.view.getOleSize();
				oOleSize.addPointToLocalHistory();
			}

			if (2 === button) {
				if (this.isShapeAction) {
					this.handlers.trigger('onContextMenu', event);
				}
				return true;
			}

			var coord = this._getCoordinates(event);
			if(this.view.Api.isEyedropperStarted()) {
				this.view.Api.finishEyedropper();
				var t = this;
				t.handlers.trigger("updateWorksheet", coord.x, coord.y, false, function(info){t.targetInfo = info;});
				return true;
			}
			// Shapes
			event.isLocked = this.isMousePressed = false;

			if (this.isShapeAction) {
				event.ClickCount = this.clickCounter.clickCount;
				this.handlers.trigger("graphicObjectMouseUp", event, coord.x, coord.y);
				this._changeSelectionDone(event);
                if (asc["editor"].isStartAddShape || asc["editor"].isInkDrawerOn())
                {
                    event.preventDefault && event.preventDefault();
                    event.stopPropagation && event.stopPropagation();
                }
                else
                {
                    this.isUpOnCanvas = true;
                }

				return true;
			}

			if (this.isSelectMode) {
				this.isSelectMode = false;
				this._changeSelectionDone(event);
			}

			if (this.isResizeMode) {
				this.isResizeMode = false;
				this._resizeElementDone(event);
			}
			// Режим автозаполнения
			if (this.isFillHandleMode) {
				// Закончили автозаполнение
				this.isFillHandleMode = false;
				this._changeFillHandleDone(event);
			}
			// Режим перемещения диапазона
			if (this.isMoveRangeMode) {
				this.isMoveRangeMode = false;
				this._moveRangeHandleDone(event);
			}

			if (this.isMoveResizeRange) {
				this.isMoveResizeRange = false;
				this._moveResizeRangeHandleDone(this.targetInfo && this.targetInfo.pageBreakSelectionType);
				return true;
			}
			// Режим установки закреплённых областей
			if (this.frozenAnchorMode) {
				this._moveFrozenAnchorHandleDone(event, this.frozenAnchorMode);
				this.frozenAnchorMode = false;
			}

			if (this.isRowGroup/* && this.targetInfo && this.targetInfo.target === c_oTargetType.GroupRow && 0 === event.button*/) {
				this._groupRowClick(event, this.targetInfo);
				this.isRowGroup = false;
				return;
			}

			if (this.targetInfo && this.targetInfo.target === c_oTargetType.ColumnHeader) {
				this._onMouseMove(event);
			}

			// Мы можем dblClick и не отработать, если вышли из области и отпустили кнопку мыши, нужно отработать
			this.showCellEditorCursor();
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._onMouseMove = function (event) {
			var t = this;
			var ctrlKey = !AscCommon.getAltGr(event) && (event.metaKey || event.ctrlKey);
			var coord = t._getCoordinates(event);

			t.hasCursor = true;

			if(t.view.Api.isEyedropperStarted()) {
				t.view.Api.checkEyedropperColor(coord.x, coord.y);
				t.handlers.trigger("updateWorksheet", coord.x, coord.y, ctrlKey, function(info){t.targetInfo = info;});
				return true;
			}
			// Shapes
			var graphicsInfo = t.handlers.trigger("getGraphicsInfo", coord.x, coord.y);
			if ( graphicsInfo )
				this.clickCounter.mouseMoveEvent(coord.x, coord.y);

			if (t.isSelectMode) {
				t._changeSelection(event);
				return true;
			}

			if (t.isChangeVisibleAreaMode) {
				t._continueChangeVisibleArea(event);
				return true;
			}

			if (t.isResizeMode) {
				t._resizeElement(event);
				this.isResizeModeMove = true;
				return true;
			}

			// Режим автозаполнения
			if (t.isFillHandleMode) {
				t._changeFillHandle(event);
				return true;
			}

			// Режим перемещения диапазона
			if (t.isMoveRangeMode) {
				t._moveRangeHandle(event);
				return true;
			}

			if (t.isMoveResizeRange) {
				t._moveResizeRangeHandle(event, t.targetInfo);
				return true;
			}
			
			// Режим установки закреплённых областей
			if (t.frozenAnchorMode) {
				t._moveFrozenAnchorHandle(event, this.frozenAnchorMode);
				return true;
			}

			if (t.isShapeAction || graphicsInfo || asc["editor"].isInkDrawerOn()) {
				event.isLocked = t.isMousePressed;
				t.handlers.trigger("graphicObjectMouseMove", event, coord.x, coord.y);
				t.handlers.trigger("updateWorksheet", coord.x, coord.y, ctrlKey, function(info){t.targetInfo = info;});
				return true;
			}

			t.handlers.trigger("updateWorksheet", coord.x, coord.y, ctrlKey, function(info){t.targetInfo = info;});
			return true;
		};

    	/** @param event {MouseEvent} */
		asc_CEventsController.prototype._onMouseLeave = function (event) {
			var t = this;
			var coord = t._getCoordinates(event);
			this.hasCursor = false;
			if (!this.isSelectMode && !this.isResizeMode && !this.isMoveResizeRange) {
				this.targetInfo = undefined;
				this.handlers.trigger("updateWorksheet", coord.x, coord.y);
			}
			if (this.isMoveRangeMode) {
				t.moveRangeTimerId = window.setTimeout(function(){t._moveRangeHandle2(event)},0);
			}
			if (this.isMoveResizeRange) {
				t.moveResizeRangeTimerId = window.setTimeout(function(){t._moveResizeRangeHandle2(event)},0);
			}
			if (this.isFillHandleMode) {
				t.fillHandleModeTimerId = window.setTimeout(function(){t._changeFillHandle2(event)},0);
			}
			if(t.view.Api.isEyedropperStarted()) {
				this.view.Api.sendEvent("asc_onHideEyedropper");
			}
			return true;
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._onMouseWheel = function (event) {
			var ctrlKey = !AscCommon.getAltGr(event) && (event.metaKey || event.ctrlKey);
			if (ctrlKey) {
				if (event.preventDefault) {
					event.preventDefault();
				} else {
					event.returnValue = false;
				}

				return false;
			}
			if (this.isFillHandleMode || this.isMoveRangeMode || this.isMoveResizeRange || this.isChangeVisibleAreaMode) {
				return true;
			}

			if (undefined !== window["AscDesktopEditor"])
            {
                if (false === window["AscDesktopEditor"]["CheckNeedWheel"]())
                    return true;
            }

			var self = this;
			var deltaX = 0, deltaY = 0;
			if (undefined !== event.wheelDelta && 0 !== event.wheelDelta) {
				deltaY = -1 * event.wheelDelta / 40;
			} else if (undefined !== event.detail && 0 !== event.detail) {
				// FF
				deltaY = event.detail;
			} else if (undefined !== event.deltaY && 0 !== event.deltaY) {
				// FF
				//ограничиваем шаг из-за некорректного значения deltaY после обновления FF
				//TODO необходимо пересмотреть. нужны корректные значения и учетом системного шага.
				var _maxDelta = 3;
				if (AscCommon.AscBrowser.isMozilla && Math.abs(event.deltaY) > _maxDelta) {
					deltaY = Math.sign(event.deltaY) * _maxDelta;
				} else {
					deltaY = event.deltaY;
				}
			}
            if (undefined !== event.deltaX && 0 !== event.deltaX) {
                deltaX = event.deltaX;
            }
			if (event.axis !== undefined && event.axis === event.HORIZONTAL_AXIS) {
				deltaX = deltaY;
				deltaY = 0;
			}

			if (undefined !== event.wheelDeltaX && 0 !== event.wheelDeltaX) {
				// Webkit
				deltaX = -1 * event.wheelDeltaX / 40;
			}
			if (undefined !== event.wheelDeltaY && 0 !== event.wheelDeltaY) {
				// Webkit
				deltaY = -1 * event.wheelDeltaY / 40;
			}
			if (event.shiftKey) {
				deltaX = deltaY;
				deltaY = 0;
			}

			if (this.smoothWheelCorrector)
			{
				deltaX = this.smoothWheelCorrector.get_DeltaX(deltaX);
                deltaY = this.smoothWheelCorrector.get_DeltaY(deltaY);
			}
			if(this.handlers.trigger("graphicObjectMouseWheel", deltaX, deltaY)) {
				self._onMouseMove(event);
				AscCommon.stopEvent(event);
				return true;
			}

			this.handlers.trigger("updateWorksheet", /*x*/undefined, /*y*/undefined, /*ctrlKey*/undefined,
				function () {
					if (deltaX && (!self.smoothWheelCorrector || !self.smoothWheelCorrector.isBreakX())) {
						deltaX = Math.sign(deltaX) * Math.ceil(Math.abs(deltaX / 3));
						self.scrollHorizontal(deltaX, event);
					}
					if (deltaY && (!self.smoothWheelCorrector || !self.smoothWheelCorrector.isBreakY())) {
						deltaY = Math.sign(deltaY) * Math.ceil(Math.abs(deltaY * self.settings.wheelScrollLinesV / 3));
						self.scrollVertical(deltaY, event);
					}
					self._onMouseMove(event);
				});

            this.smoothWheelCorrector && this.smoothWheelCorrector.checkBreak();
            AscCommon.stopEvent(event);
			return true;
		};

		/** @param event {KeyboardEvent} */
		asc_CEventsController.prototype._onMouseDblClick = function(event) {
			if (this.handlers.trigger('isGlobalLockEditCell') || this.handlers.trigger('isFormatPainter')) {
				return false;
			}

			// Браузер не поддерживает свойство detail (будем делать по координатам)
			if (false === this.isDblClickInMouseDown) {
				return this.doMouseDblClick(event);
			}

			this.isDblClickInMouseDown = false;

			// Нужно отработать показ курсора, если dblClick был обработан в MouseDown
			this.showCellEditorCursor();
			return true;
		};

		/** @param event */
		asc_CEventsController.prototype._getCoordinates = function (event) {
			// ToDo стоит переделать
			if (event.coord) {
				return event.coord;
			}

			var offs = this.element.getBoundingClientRect();
			var x = ((event.pageX * AscBrowser.zoom) >> 0) - offs.left;
			var y = ((event.pageY * AscBrowser.zoom) >> 0) - offs.top;

			x *= AscCommon.AscBrowser.retinaPixelRatio;
			y *= AscCommon.AscBrowser.retinaPixelRatio;

			return {x: x, y: y};
		};

		asc_CEventsController.prototype._setSkipKeyPress = function (val) {
			this.skipKeyPress = val;
		};

		//------------------------------------------------------------export---------------------------------------------------
		window['AscCommonExcel'] = window['AscCommonExcel'] || {};
		window["AscCommonExcel"].asc_CEventsController = asc_CEventsController;
	}
)(jQuery, window);
