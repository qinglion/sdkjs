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

(function(){
        
    // api objects
    let position    = AscPDF.Api.Types.position;
    let scaleWhen   = AscPDF.Api.Types.scaleWhen;
    let scaleHow    = AscPDF.Api.Types.scaleHow;
    let highlight   = AscPDF.Api.Types.highlight;

    let PUSHBUTTON_BG = {
        r: 191,
        g: 191,
        b: 191
    }

    /**
	 * Class representing a button field.
	 * @constructor
     * @extends {CBaseField}
	 */
    function CPushButtonField(sName, aRect)
    {
        AscPDF.CBaseField.call(this, sName, AscPDF.FIELD_TYPES.button, aRect);

        this._buttonAlignX      = 0.5; // must be integer
        this._buttonAlignY      = 0.5; // must be integer
        this._buttonFitBounds   = false;
        this._buttonPosition    = position["textOnly"];
        this._buttonScaleHow    = scaleHow["proportional"];
        this._buttonScaleWhen   = scaleWhen["always"];
        this._highlight         = AscPDF.BUTTON_HIGHLIGHT_TYPES.invert;
        this._textFont          = AscPDF.DEFAULT_FIELD_FONT;

        this._buttonCaption     = undefined;
        this._downCaption       = undefined;
        this._rollOverCaption   = undefined;

        this._pressed = false;
        this._hovered = false;

        AscCommon.History.StartNoHistoryMode();
        this.content = new AscPDF.CTextBoxContent(this, Asc.editor.getPDFDoc());
		this.content.SetAlign(AscPDF.ALIGN_TYPE.center);
        AscCommon.History.EndNoHistoryMode();

        this._imgData = {
            normal:     "",
            mouseDown:  "",
            rollover:   "",

            // регистрируем что картинки изменились, нужно при записи, чтобы не писать исходные картинки снова
            changedInfo: {
                normal:     false,
                mouseDown:  false,
                rollover:   false
            }
        };

        this._captionRun            = null;
        this._downCaptionRun        = null;
        this._rollOverCaptionRun    = null;
		
		this._needUpdateImage = true;
		this._rasterId        = null;
    }
    CPushButtonField.prototype.constructor = CPushButtonField;
    AscFormat.InitClass(CPushButtonField, AscPDF.CBaseField, AscDFH.historyitem_type_Pdf_Button_Field);

    CPushButtonField.prototype.GetFontSizeAP = function(oContent) {
        let oPara   = oContent.GetElement(0);
        let oRun    = oPara.GetElement(0);
        let oTextPr = oRun.Get_CompiledPr(true);

        return oTextPr.FontSize;
    };
    CPushButtonField.prototype.AddImage = function(oImgData, nAPType) {
        if (!oImgData) {
            return;
        }
        const oHTMLImg = oImgData.Image;
        if (!oHTMLImg || oHTMLImg.width === 0 || oHTMLImg.height === 0) {
            return;
        }

        let oDoc    = this.GetDocument();
        let oViewer = Asc.editor.getDocumentRenderer();
        let aFields = oViewer.IsOpenFormsInProgress == false ? oDoc.GetAllWidgets(this.GetFullName()) : [this];

        let aFonts = aFields.map(function(field) {
            return field.GetTextFontActual();
        });

        let oThis = this;
        if (!oDoc.checkFonts(aFonts, function() { oThis.AddImage(oImgData, nAPType);})) {
            return;
        }

        oDoc.DoAction(function() {
            aFields.forEach(function(field) {
                if (field.GetLayout() == position["textOnly"])
                    return;
    
                field.SetWasChanged(true);
                field.DoInitialRecalc();
                field.SetNeedRecalc(true);
                field.SetImageRasterId(AscFormat.checkRasterImageId(oImgData.src), nAPType);
    
                let sTargetSrc;
                if (nAPType != AscPDF.APPEARANCE_TYPES.rollover && nAPType != AscPDF.APPEARANCE_TYPES.mouseDown) {
                    sTargetSrc = oImgData.src;
                    field.SetImage(sTargetSrc);
                }
                
                if (undefined == nAPType) {
                    field.SetImageRasterId('', AscPDF.APPEARANCE_TYPES.rollover);
                    field.SetImageRasterId('', AscPDF.APPEARANCE_TYPES.mouseDown);
                }            
            });
            
            if (oViewer.IsOpenFormsInProgress == false) {
                aFields.forEach(function(field) {
                    if (field.GetLayout() == position["textOnly"])
                        return;
    
                    field.SetNeedRecalc(true);
                });
                
                let oDoc            = this.GetDocument();
                let oActionsQueue   = oDoc.GetActionsQueue();
                oActionsQueue.Continue();   
            }
        }, AscDFH.historydescription_Pdf_FieldImportImage, this);
    };
    CPushButtonField.prototype.IsImageChanged = function(nAPType) {
        switch (nAPType) {
            case AscPDF.APPEARANCE_TYPES.rollover:
                return this._imgData.changedInfo.rollover;
            case AscPDF.APPEARANCE_TYPES.mouseDown:
                return this._imgData.changedInfo.mouseDown;
            case AscPDF.APPEARANCE_TYPES.normal:
            default:
                return this._imgData.changedInfo.normal;
        }
    };
    CPushButtonField.prototype.GetImageRasterId = function(nAPType) {
        switch (nAPType) {
            case AscPDF.APPEARANCE_TYPES.rollover:
                return this._imgData.rollover;
            case AscPDF.APPEARANCE_TYPES.mouseDown:
                return this._imgData.mouseDown;
            case AscPDF.APPEARANCE_TYPES.normal:
            default:
                return this._imgData.normal;
        }
    };
    /**
     * Sets image only for this pushbutton (without commiting). Needs for history.
     * @memberof CPushButtonField
     * @param {number} nAPType - appearence typef
     * @typeofeditors ["PDF"]
     */
    CPushButtonField.prototype.AddImage2 = function(sRasterId, nAPType) {
        this.SetImageRasterId(sRasterId, nAPType);
        if (AscPDF.APPEARANCE_TYPES.normal == nAPType && !this.IsPressed() && !this.IsHovered()) {
            this.SetImage(sRasterId);
        }
        else if (AscPDF.APPEARANCE_TYPES.mouseDown && this.IsPressed()) {
            this.SetImage(sRasterId);
        }
        else if (AscPDF.APPEARANCE_TYPES.rollover && this.IsHovered()) {
            this.SetImage(sRasterId);
        }
    };
    CPushButtonField.prototype.SetNeedUpdateImage = function(isNeed) {
        this._needUpdateImage = isNeed;
        isNeed && this.AddToRedraw(true);
    };
    CPushButtonField.prototype.IsNeedUpdateImage = function() {
        return this._needUpdateImage;
    };
    /**
     * Sets image without any history changes.
     * @memberof CPushButtonField
     * @param {string} rasterId
     * @typeofeditors ["PDF"]
     */
    CPushButtonField.prototype.SetImage = function(rasterId) {
		if (this._rasterId === rasterId && this.GetDrawing())
			return;
		
		this.SetNeedUpdateImage(true);
		this._rasterId = rasterId;
		
		this._UpdateImage();
	};
	CPushButtonField.prototype._UpdateImage = function() {
		if (!this.IsNeedUpdateImage())
			return;
		
		this.SetNeedUpdateImage(!this._SetImage());
	};
	CPushButtonField.prototype._SetImage = function() {
		let sRasterId = this._rasterId;
		
        if (!this.DoInitialRecalc()) {
            this.AddToRedraw();
            return;
        }
        
		if (!sRasterId)
			return this._RemoveImage();
		
        let oImgData = null;

        if (sRasterId) {
            oImgData = Asc.editor.ImageLoader.map_image_index[AscCommon.getFullImageSrc2(sRasterId)];
        }
		
		if (!oImgData || oImgData.Status === AscFonts.ImageLoadStatus.Loading)
			return false;
		
		this._RemoveImage();
        this.CheckTextFont();
        this.CheckTextColor();

        let oHTMLImg = oImgData.Image;

        AscCommon.History.StartNoHistoryMode();
        
        const dImgW = Math.max((oHTMLImg.width * g_dKoef_pix_to_mm), 1);
        const dImgH = Math.max((oHTMLImg.height * g_dKoef_pix_to_mm), 1);
        const oRect = this.IsButtonFitBounds() ? this.getFormRect() : this.getFormRelRect();
        let nContentW = 0;
        let nContentH = 0;

        let nHeaderPos = this.GetLayout();
        switch (nHeaderPos) {
            case position["textOnly"]:
                return;
            case position["iconTextH"]:
            case position["textIconH"]:
                let oPara = this.content.GetElement(0);
                oPara.Recalculate_Page(0);
                nContentW = oPara.GetContentWidthInRange();
                break;
            case position["iconTextV"]:
            case position["textIconV"]:
                nContentH = this.content.Get_EmptyHeight();
                break;
        }

        let dFrmW = oRect.W;
        let dFrmH = oRect.H;
        
        let nRotAngle = this.GetRotate();
        if (nRotAngle === 90 || nRotAngle === 270) {
            let tmp = dFrmW;
            dFrmW = dFrmH;
            dFrmH = tmp;
        }

        const dCW   = (dFrmW - nContentW)/dImgW;
        const dCH   = (dFrmH - nContentH)/dImgH;
        const dCoef = Math.min(dCW, dCH);
        const dDrawingW = dCW * dImgW;
        const dDrawingH = dCH * dImgH;
        const nScaleHow = this.GetScaleHow();

        // Мы всегда создаем drawing с максимальной доступными размерами и делаем crop картинки (если скейл пропорциональный или скейла нет вовсе).
        // В это свойство пишем фактический размер картинки (не исходный размер), тот, который реально рисуется.
        this.relImgSize = {
            W: 0,
            H: 0
        };

        let nScaleWhen = this.GetScaleWhen();
        switch (nScaleWhen) {
            case scaleWhen["always"]: {
                this.relImgSize.W = nScaleHow == scaleHow["proportional"] ? dCoef*dImgW : dCW * dImgW;
                this.relImgSize.H = nScaleHow == scaleHow["proportional"] ? dCoef*dImgH : dCH * dImgH;
                break;
            }
                
            case scaleWhen["never"]: {
                this.relImgSize.W = dImgW;
                this.relImgSize.H = dImgH;
                break;
            }
                
            case scaleWhen["tooBig"]: {
                if (dImgW > dDrawingW || dImgH > dDrawingH) {
                    this.relImgSize.W = nScaleHow == scaleHow["proportional"] ? dCoef*dImgW : dCW * dImgW;
                    this.relImgSize.H = nScaleHow == scaleHow["proportional"] ? dCoef*dImgH : dCH * dImgH;
                }
                else {
                    this.relImgSize.W = dImgW;
                    this.relImgSize.H = dImgH;
                }
                break;
            }

            case scaleWhen["tooSmall"]: {
                if (dImgW < dDrawingW && dImgH < dDrawingH) {
                    this.relImgSize.W = nScaleHow == scaleHow["proportional"] ? dCoef*dImgW : dCW * dImgW;
                    this.relImgSize.H = nScaleHow == scaleHow["proportional"] ? dCoef*dImgH : dCH * dImgH;
                }
                else {
                    this.relImgSize.W = dImgW;
                    this.relImgSize.H = dImgH;
                }
                break;
            }
        }
        const oDrawing = new AscCommonWord.ParaDrawing(dDrawingW, dDrawingH, null, this.content.DrawingDocument, this.content, null);
        oDrawing.Set_WrappingType(WRAPPING_TYPE_SQUARE);
        oDrawing.Set_DrawingType(drawing_Inline);
        
        let oImgShape = new AscFormat.CImageShape();
        AscFormat.fillImage(oImgShape, sRasterId, 0, 0, dDrawingW, dDrawingH);

        oImgShape.setParent(oDrawing);
        oDrawing.Set_GraphicObject(oImgShape);
        
        let oRunForImg;
        let oTargetPara;
        let oCaptionRun;
        switch (nHeaderPos) {
            case position["iconOnly"]:
                oRunForImg = this.content.GetElement(0).GetElement(0);
                break;
            case position["iconTextV"]:
                oRunForImg = this.content.GetElement(0).GetElement(0);
                break;
            case position["textIconV"]:
                oRunForImg = this.content.GetElement(1).GetElement(0);
                break;
            case position["iconTextH"]:
                oTargetPara = this.content.GetElement(0);
                if (oTargetPara.GetElementsCount() == 1) {
                    let oRun = new ParaRun(oTargetPara, false);
                    oTargetPara.Add_ToContent(oTargetPara.Content.length - 1, oRun);
                }

                oRunForImg = oTargetPara.GetElement(0);
                oCaptionRun = oTargetPara.GetElement(1);
                if (oCaptionRun) {
                    nContentH = this.content.Get_EmptyHeight();
                    oCaptionRun.Pr.Position = (dFrmH - nContentH/2) / 2;
                    oCaptionRun.RecalcInfo.TextPr = true;
                    oCaptionRun.Get_CompiledPr();
                }
                break;
            case position["textIconH"]:
                oTargetPara = this.content.GetElement(0);
                if (oTargetPara.GetElementsCount() == 1) {
                    let oRun = new ParaRun(oTargetPara, false);
                    oTargetPara.Add_ToContent(oTargetPara.Content.length - 1, oRun);
                }

                oRunForImg = oTargetPara.GetElement(1);
                oCaptionRun = oTargetPara.GetElement(0);
                if (oCaptionRun) {
                    nContentH = this.content.Get_EmptyHeight();
                    oCaptionRun.Pr.Position = (dFrmH - nContentH/2) / 2;
                    oCaptionRun.RecalcInfo.TextPr = true;
                    oCaptionRun.Get_CompiledPr();
                }
                break;
            case position["overlay"]:
                oTargetPara = this.content.GetElement(0);
                oRunForImg = oTargetPara.GetElement(0);

                oDrawing.Set_DrawingType(drawing_Anchor);
                oDrawing.Set_WrappingType(WRAPPING_TYPE_NONE);
                oDrawing.Set_BehindDoc(true);
                break;
        }

        
        oRunForImg.Add_ToContent(oRunForImg.Content.length, oDrawing);
        oDrawing.Set_Parent(oRunForImg);
        oImgShape.recalculate();
        this.SetNeedRecalc(true);
        
        let oIconPos = this.GetIconPosition();
        this.SetIconPosition(oIconPos.X, oIconPos.Y);

        AscCommon.History.EndNoHistoryMode();
		return true;
    };
    CPushButtonField.prototype._RemoveImage = function() {
        AscCommon.History.StartNoHistoryMode();

        let oExistDrawing = this.GetDrawing();
        if (oExistDrawing) {
            oExistDrawing.PreDelete();
            var oParentRun = oExistDrawing.GetRun();
            oParentRun.RemoveElement(oExistDrawing);

            let oFirstRun = this.content.GetElement(0).GetElement(0);
            let oRunElm = oFirstRun.GetElement(oFirstRun.GetElementsCount() - 1);
            // удаляем таб
            if (oRunElm && true ==  oRunElm.IsTab()) {
                oFirstRun.RemoveFromContent(oFirstRun.GetElementsCount() - 1, 1);
            }
        }

        AscCommon.History.EndNoHistoryMode();
		
		return true;
    };
	CPushButtonField.prototype.getAllRasterImages = function(images) {
		if (this._rasterId)
			images.push(this._rasterId);
	};
    /**
     * Defines how a button reacts when a user clicks it. The four highlight modes supported are:
     * none — No visual indication that the button has been clicked.
     * invert — The region encompassing the button’s rectangle inverts momentarily.
     * push — The down face for the button (if any) is displayed momentarily.
     * outline — The border of the rectangleinverts momentarily.
     * @memberof CPushButtonField
     * @param {number} nType - AscPDF.BUTTON_HIGHLIGHT_TYPES
     * @typeofeditors ["PDF"]
     */
    CPushButtonField.prototype.SetHighlight = function(nType) {
        AscCommon.History.Add(new CChangesPDFPushbuttonHighlightType(this, this._highlight, nType));

        this._highlight = nType;

        if (nType != AscPDF.BUTTON_HIGHLIGHT_TYPES.push) {
            this.asc_curImageState = undefined;
            this.SetImageRasterId('', AscPDF.APPEARANCE_TYPES.mouseDown);
            this.SetImageRasterId('', AscPDF.APPEARANCE_TYPES.rollover);
        }

        this.SetWasChanged(true);
    };
    CPushButtonField.prototype.GetHighlight = function() {
        return this._highlight;
    };
    /**
     * Corrects the positions of the caption and image.
     * @memberof CPushButtonField
     * @typeofeditors ["PDF"]
     */
    CPushButtonField.prototype.Internal_CorrectContentPos = function() {
        const oRect = this.IsButtonFitBounds() ? this.getFormRect() : this.getFormRelRect();
        let dFrmW = oRect.W;
        let dFrmH = oRect.H;
        
        let nRotAngle = this.GetRotate();
        if (nRotAngle === 90 || nRotAngle === 270) {
            let tmp = dFrmW;
            dFrmW = dFrmH;
            dFrmH = tmp;
        }

        let nButtonPos = this.GetLayout();
        let oDrawing = this.GetDrawing();

        let oPara1                      = this.content.GetElement(0);
        oPara1.Pr.Spacing.Before        = 0;
        oPara1.Pr.Spacing.After         = 0;
        oPara1.CompiledPr.NeedRecalc    = true;

        let oPara2;
        if (this.content.GetElementsCount() == 2) {
            oPara2 = this.content.GetElement(1);
            oPara2.Pr.Spacing.Before = 0;
            oPara2.Pr.Spacing.After  = 0;
            oPara2.CompiledPr.NeedRecalc = true;
        }
        
        // положение текста с картинкой в одном параграфе
        if (oDrawing) {
            let oRun = oPara1.GetElement(0);

            if ([position["iconTextH"], position["textIconH"]].includes(nButtonPos) && this.content.GetElementsCount() == 1) {
                this.content.Recalculate_Page(0, true);
                let oContentBounds  = this.content.GetContentBounds(0);
                
                if (nButtonPos == position["iconTextH"])
                    this.content.SetAlign(AscPDF.ALIGN_TYPE.right);
                else if (nButtonPos == position["textIconH"])
                    this.content.SetAlign(AscPDF.ALIGN_TYPE.left);

                let nFreeHorSpace = dFrmW - (oContentBounds.Right - oContentBounds.Left);
                if (nFreeHorSpace > 0) {
                    let oTabs = new CParaTabs();
                    oTabs.Add(new CParaTab(Asc.c_oAscTabType.Left, this.content.X + oRun.GetContentWidthInRange() + nFreeHorSpace / 2, undefined));
                    oRun.Add_ToContent(oRun.GetElementsCount(), new AscWord.CRunTab());

                    oPara1.SetParagraphTabs(oTabs);
                }
            }
            else if (nButtonPos == position["overlay"]) {
                let oPara = this.content.GetElement(0);
                let oCaptionRun = this.GetCaptionRun();
                oPara.Pr.Spacing.Before = 0;
                oPara.Pr.Spacing.After  = 0;
                oPara.CompiledPr.NeedRecalc = true;
                if (oCaptionRun) {
                    oCaptionRun.Pr.Position = 0;
                    oCaptionRun.RecalcInfo.TextPr = true
                }
                    
                this.content.Recalculate_Page(0, true);
                let oContentBounds  = this.content.GetContentBounds(0);
                let nContentH       = oContentBounds.Bottom - oContentBounds.Top;

                oPara.Pr.Spacing.Before = (dFrmH - nContentH) / 2;
                this.content.SetAlign(AscPDF.ALIGN_TYPE.center);
                oPara.CompiledPr.NeedRecalc = true;
            }

            return;
        }
        
        // центрируем текст если картинки нет
        let oCaptionRun = this.GetCaptionRun();
        if (oCaptionRun) {
            oCaptionRun.Pr.Position = 0;
            oCaptionRun.RecalcInfo.TextPr = true
        }

        this.content.Recalculate_Page(0, true);
        let oContentBounds  = this.content.GetContentBounds(0);
        let nContentH       = oContentBounds.Bottom - oContentBounds.Top;

        if (this.content.GetElementsCount() == 1)
            oPara1.Pr.Spacing.Before = (dFrmH - nContentH) / 2;
        else if (this.content.GetElementsCount() == 2) {
            if (nButtonPos == position["textIconV"]) {
                oPara1.Pr.Spacing.Before = (dFrmH - nContentH / 2) / 2;
            }
            else if (nButtonPos == position["iconTextV"]) {
                oPara1.Pr.Spacing.Before = (dFrmH - nContentH / 2) / 2 - nContentH / 2;
            }

            oPara2.CompiledPr.NeedRecalc = true;
            oPara1.CompiledPr.NeedRecalc = true;
        }

        this.content.SetAlign(AscPDF.ALIGN_TYPE.center);
    };

    /**
     * Gets the caption associated with a button.
     * @memberof CPushButtonField
     * @param {number} [nFace=0] - (optional) If specified, gets a caption of the given type:
     * 0 — (default) normal caption
     * 1 — down caption
     * 2 — rollover caption
     * @typeofeditors ["PDF"]
     */
    CPushButtonField.prototype.GetCaption = function(nFace) {
        switch (nFace) {
            case AscPDF.APPEARANCE_TYPES.normal:
                return this._buttonCaption;
            case AscPDF.APPEARANCE_TYPES.mouseDown:
                return this._downCaption;
            case AscPDF.APPEARANCE_TYPES.rollover:
                return this._rollOverCaption;
            default:
                return this._buttonCaption;
        }
    };
    /**
     * Sets the caption associated with a button.
     * @memberof CPushButtonField
     * @param {string} cCaption - The caption associated with the button.
     * @param {number} [nFace=0] - (optional) If specified, gets a caption of the given type:
     * 0 — (default) normal caption
     * 1 — down caption
     * 2 — rollover caption
     * @typeofeditors ["PDF"]
     */
    CPushButtonField.prototype.SetCaption = function(cCaption, nFace) {
        if (nFace == null)
            nFace = 0;

        if (typeof(cCaption) != "string")
            return false;
        
        AscFonts.FontPickerByCharacter.getFontsByString(cCaption);

        let sPrevCaption;
        switch (nFace) {
            case 0:
                sPrevCaption = this.GetCaption();
                this._buttonCaption = cCaption;
                let oCaptionRun;
                let oPara = this.content.GetElement(0);

                AscCommon.History.StartNoHistoryMode();
                switch (this._buttonPosition) {
                    case position["textIconV"]:
                    case position["textOnly"]:
                    case position["textIconH"]:
                        oCaptionRun = oPara.GetElement(0);
                        oCaptionRun.ClearContent();
                        oCaptionRun.AddText(cCaption);
                        this.SetCaptionRun(oCaptionRun);
                        break;
                    case position["iconOnly"]:
                        this.SetCaptionRun(null);
                        break;
                    case position["iconTextV"]:
                        oCaptionRun = this.content.GetElement(1).GetElement(0);
                        oCaptionRun.ClearContent();
                        oCaptionRun.AddText(cCaption);
                        this.SetCaptionRun(oCaptionRun);
                        break;
                    case position["iconTextH"]:
                        oCaptionRun = oPara.GetElement(1);
                        if (oCaptionRun.IsParaEndRun()) {
                            oCaptionRun = new ParaRun(oPara, false);
                            oCaptionRun.AddText(cCaption);
                            oPara.AddToContent(1, oCaptionRun);
                        }
                        else {
                            oCaptionRun.ClearContent();
                            oCaptionRun.AddText(cCaption);
                        }
                        
                        this.SetCaptionRun(oCaptionRun);
                        break;
                    case position["overlay"]:
                        oCaptionRun = oPara.GetElement(0);
                        
                        oCaptionRun.ClearContent();
                        oCaptionRun.AddText(cCaption);
                        this.SetCaptionRun(oCaptionRun);
                        break;
                }
                AscCommon.History.EndNoHistoryMode();
                break;
            case 1:
                sPrevCaption = this._downCaption;
                this._downCaption = cCaption;
                break;
            case 2:
                sPrevCaption = this._rollOverCaption;
                this._rollOverCaption = cCaption;
                break;
        }

        AscCommon.History.Add(new CChangesPDFPushbuttonCaption(this, sPrevCaption, cCaption, nFace));

        this.SetWasChanged(true);
        this.SetNeedUpdateImage(true);
        this.SetNeedRecalc(true);
    };
    CPushButtonField.prototype.SetValue = function() {
        return;
    };
    CPushButtonField.prototype.private_SetValue = CPushButtonField.prototype.SetValue;
    CPushButtonField.prototype.Draw = function(oGraphicsPDF, oGraphicsWord) {
        if (this.IsHidden() && !this.IsEditMode())
            return;
		
		this._UpdateImage();

        this.CheckImageOnce();
        this.Recalculate();
        this.DrawBackground(oGraphicsPDF);
        this.DrawBorders(oGraphicsPDF)

        let oClipRect = this.getFormRect();
        oGraphicsWord.AddClipRect(oClipRect.X, oClipRect.Y, oClipRect.W, oClipRect.H);

        // draw behind doc
        if (this.GetLayout() == position["overlay"]) {
            let oDrawing = this.GetDrawing();
            if (oDrawing)
                oDrawing.GraphicObj.draw(oGraphicsWord);
        }

        this.content.Draw(0, oGraphicsWord);
        oGraphicsWord.RemoveLastClip();

        if (this.IsPressed()) {
            let oViewer     = editor.getDocumentRenderer();
            let aOrigRect   = this.GetOrigRect();
            let oTr         = oGraphicsPDF.GetTransform();

            let origX   = aOrigRect[0];
            let origY   = aOrigRect[1];
            let X       = aOrigRect[0] * oTr.sx;
            let Y       = aOrigRect[1] * oTr.sy;
            let nWidth  = (aOrigRect[2] - aOrigRect[0]) * oTr.sx;
            let nHeight = (aOrigRect[3] - aOrigRect[1]) * oTr.sy;

            // Create a new canvas element for the cropped area
            let oGrContext          = oGraphicsPDF.GetContext();
            let croppedCanvas       = document.createElement('canvas');
            let oCroppedCtx         = croppedCanvas.getContext("2d");
            croppedCanvas.width     = nWidth + 0.5 >> 0;
            croppedCanvas.height    = nHeight + 0.5 >> 0;
            
            if (this.GetHighlight() == AscPDF.BUTTON_HIGHLIGHT_TYPES.invert) {
                let xCenter = oViewer.width >> 1;
                if (oViewer.documentWidth > oViewer.width)
                {
                    xCenter = (oViewer.documentWidth >> 1) - (oViewer.scrollX) >> 0;
                }
                let yPos    = oViewer.scrollY >> 0;
                let page    = oViewer.drawingPages[this.GetPage()];
                let w       = (page.W * AscCommon.AscBrowser.retinaPixelRatio) >> 0;
                let h       = (page.H * AscCommon.AscBrowser.retinaPixelRatio) >> 0;
                let indLeft = ((xCenter * AscCommon.AscBrowser.retinaPixelRatio) >> 0) - (w >> 1);
                let indTop  = ((page.Y - yPos) * AscCommon.AscBrowser.retinaPixelRatio) >> 0;

                let x = X + indLeft;
                let y = Y + indTop;
                let nDWidth = 0;
                let nDHeight = 0;

                if (x < 0) {
                    nDWidth = nWidth - (nWidth + x);
                    X       += nDWidth;
                    nWidth  += x >> 0;
                    croppedCanvas.width = nWidth;
                    x = 0;
                }
                if (y < 0) {
                    nDHeight    = nHeight - (nHeight + y);
                    Y           += nDHeight;
                    nHeight     += y >> 0;
                    croppedCanvas.height = nHeight;
                    y = 0;
                }
                
                oCroppedCtx.drawImage(oViewer.canvas, x, y, nWidth, nHeight, 0, 0, nWidth, nHeight);
                
                if (page.ImageAnnots) {
                    oCroppedCtx.drawImage(page.ImageAnnots, X, Y, nWidth, nHeight, 0, 0, nWidth, nHeight);
                }
    
                oCroppedCtx.drawImage(oGrContext.canvas, X, Y, nWidth, nHeight, 0, 0, nWidth, nHeight);
                oCroppedCtx.globalCompositeOperation='difference';
                oCroppedCtx.fillStyle='white';
                oCroppedCtx.fillRect(0, 0, croppedCanvas.width,croppedCanvas.height);
                oGraphicsPDF.DrawImageXY(oCroppedCtx.canvas, origX, origY);
            }
            else if (this.GetHighlight() == AscPDF.BUTTON_HIGHLIGHT_TYPES.outline) {
                let nLineWidth = this.GetBorderWidth();

                oCroppedCtx.drawImage(oGrContext.canvas, X, Y, nWidth, nHeight, 0, 0, nWidth, nHeight);
                oCroppedCtx.clearRect(nLineWidth * oTr.sy, nLineWidth * oTr.sy, croppedCanvas.width - 2 * nLineWidth * oTr.sy, croppedCanvas.height - 2 * nLineWidth * oTr.sy);
    
                oCroppedCtx.globalCompositeOperation='difference';
                oCroppedCtx.fillStyle='white';
                oCroppedCtx.fillRect(0, 0, croppedCanvas.width,croppedCanvas.height);
                oCroppedCtx.globalCompositeOperation='source-over';
                oCroppedCtx.drawImage(oGrContext.canvas, X + nLineWidth * oTr.sy, Y + nLineWidth * oTr.sy, nWidth - 2 * nLineWidth * oTr.sy, nHeight - 2 * nLineWidth * oTr.sy, nLineWidth * oTr.sy, nLineWidth * oTr.sy, nWidth -  2 * nLineWidth * oTr.sy, nHeight - 2 * nLineWidth * oTr.sy);
    
                oGraphicsPDF.DrawImageXY(oCroppedCtx.canvas, origX, origY);
            }
        }
        
        this.DrawLocks(oGraphicsPDF);
        this.DrawEdit(oGraphicsWord);
    };
    CPushButtonField.prototype.SetImageRasterId = function(sRasterId, nAPType) {
        let sPrevRasterId;
        let oViewer = Asc.editor.getDocumentRenderer();
        let oDoc    = this.GetDocument();

        if (undefined == nAPType) {
            nAPType = AscPDF.APPEARANCE_TYPES.normal;
        }

        switch (nAPType) {
            case AscPDF.APPEARANCE_TYPES.rollover:
                sPrevRasterId           = this._imgData.rollover;
                this._imgData.rollover  = sRasterId;
                this._imgData.changedInfo.rollover = true;
                break;
            case AscPDF.APPEARANCE_TYPES.mouseDown:
                sPrevRasterId           = this._imgData.mouseDown;
                this._imgData.mouseDown = sRasterId;
                this._imgData.changedInfo.mouseDown = true;
                break;
            case AscPDF.APPEARANCE_TYPES.normal:
                sPrevRasterId           = this._imgData.normal;
                this._imgData.normal    = sRasterId;
                this._imgData.changedInfo.normal = true;
                break;
        }

        if (!sPrevRasterId && !sRasterId) {
            return;
        }

        if (oViewer.IsOpenFormsInProgress == false && oDoc.History.UndoRedoInProgress == false) {
            oDoc.History.Add(new CChangesPDFPushbuttonImage(this, sPrevRasterId, sRasterId, nAPType));
        }

        this.SetNeedUpdateImage(true);
        this.SetWasChanged(true);
    };
    CPushButtonField.prototype.DrawPressed = function() {
        if (this.IsReadOnly()) {
            return;
        }

        this.SetPressed(true);
        this.AddToRedraw();

        if (this.IsNeedDrawFromStream()) {
            return;
        }
             
        let sTargetCaption;
        let sTargetImgRasterId;
        let sMouseDownCaption   = this.GetCaption(AscPDF.APPEARANCE_TYPES.mouseDown);
        let sNormalCaption      = this.GetCaption(AscPDF.APPEARANCE_TYPES.normal);
        let oCaptionRun         = this.GetCaptionRun();

        if (this._imgData.mouseDown || sMouseDownCaption) {
            sTargetCaption = sMouseDownCaption;
            sTargetImgRasterId = this._imgData.mouseDown;
        }
        else if (this._imgData.normal || sNormalCaption) {
            sTargetCaption = sNormalCaption;
            sTargetImgRasterId = this._imgData.normal;
        }

        if (sTargetImgRasterId || sTargetCaption) {
            AscCommon.History.StartNoHistoryMode();
            if (oCaptionRun && sTargetCaption) {
                oCaptionRun.ClearContent();
                oCaptionRun.AddText(sTargetCaption);
            }

            this.SetImage(sTargetImgRasterId);
            this.SetNeedRecalc(true);
            AscCommon.History.EndNoHistoryMode();
        }

        if (this.GetHighlight() == AscPDF.BUTTON_HIGHLIGHT_TYPES.push) {
            this.SetNeedRecalc(true);
        }
    };
    CPushButtonField.prototype.DrawUnpressed = function() {
        if (this.IsReadOnly()) {
            return;
        }

        this.SetPressed(false);
        this.AddToRedraw();

        if (this.IsNeedDrawFromStream()) {
            return;
        }
        
        if (this._imgData.mouseDown || this.GetCaption(AscPDF.APPEARANCE_TYPES.normal) || this.GetCaption(AscPDF.APPEARANCE_TYPES.rollover)) {
            let sTargetImgRasterId = this.IsHovered() && this.GetCaption(AscPDF.APPEARANCE_TYPES.rollover) ? this._imgData.rollover : this._imgData.normal;
            let sTargetCaption = this.IsHovered() && this.GetCaption(AscPDF.APPEARANCE_TYPES.rollover) ? this.GetCaption(AscPDF.APPEARANCE_TYPES.rollover) : this.GetCaption(AscPDF.APPEARANCE_TYPES.normal);

            let oCaptionRun         = this.GetCaptionRun();
            let sDefaultCaption     = this.GetCaption(AscPDF.APPEARANCE_TYPES.normal);

            AscCommon.History.StartNoHistoryMode();
            if (oCaptionRun && sDefaultCaption && sTargetCaption) {
                oCaptionRun.ClearContent();
                oCaptionRun.AddText(sTargetCaption);
            }

            this.SetImage(sTargetImgRasterId);
            this.SetNeedRecalc(true);
            AscCommon.History.EndNoHistoryMode();
        }

        if (this.GetHighlight() == AscPDF.BUTTON_HIGHLIGHT_TYPES.push) {
            this.SetNeedRecalc(true);
        }
    };
    CPushButtonField.prototype.CreateFill = function(sRasterId) {
        let oFill;
        if (sRasterId) {
            oFill   = new AscFormat.CUniFill();
            oFill.fill  = new AscFormat.CBlipFill();
            oFill.fill.setRasterImageId(sRasterId);
            oFill.fill.tile     = null;
            oFill.fill.srcRect  = null;
            oFill.fill.stretch  = true;
            oFill.convertToPPTXMods();
        }
        else {
            oFill = AscFormat.CreateNoFillUniFill();
        }

        return oFill;
    };
    CPushButtonField.prototype.DrawRollover = function() {
        // rollover состояние может быть только в push
        if (this.GetHighlight() != AscPDF.BUTTON_HIGHLIGHT_TYPES.push) {
            return;
        }

        if (this.IsReadOnly()) {
            return;
        }

        this.SetHovered(true);
        this.AddToRedraw();

        if (this.IsNeedDrawFromStream()) {
            return;
        }

        let sRolloverCaption = this.GetCaption(AscPDF.APPEARANCE_TYPES.rollover);

        if (this._imgData.rollover || sRolloverCaption) {
            AscCommon.History.StartNoHistoryMode();
            
            let oCaptionRun = this.GetCaptionRun();
            // сначала добавляем текст, т.к. учитывается его размер при добавлении картинки
            if (oCaptionRun && sRolloverCaption) {
                oCaptionRun.ClearContent();
                oCaptionRun.AddText(sRolloverCaption);
            }

            this.SetImage(this._imgData.rollover);
            this.SetNeedRecalc(true);
            AscCommon.History.EndNoHistoryMode();
        }
    };
    CPushButtonField.prototype.OnEndRollover = function() {
        // rollover состояние может быть только в push
        if (this.GetHighlight() != AscPDF.BUTTON_HIGHLIGHT_TYPES.push) {
            return;
        }

        this.SetHovered(false);
        this.AddToRedraw();

        if (this.IsNeedDrawFromStream()) {
            return;
        }
        
        if (this._imgData.rollover || this.GetCaption(AscPDF.APPEARANCE_TYPES.rollover)) {
            AscCommon.History.StartNoHistoryMode();

            let oCaptionRun         = this.GetCaptionRun();
            let sRolloverCaption    = this.GetCaption(AscPDF.APPEARANCE_TYPES.rollover);
            let sDefaultCaption     = this.GetCaption(AscPDF.APPEARANCE_TYPES.normal);
            if (oCaptionRun && sDefaultCaption && sRolloverCaption) {
                oCaptionRun.ClearContent();
                oCaptionRun.AddText(sDefaultCaption);
            }

            this.SetImage(this._imgData.normal);
            this.SetNeedRecalc(true);

            AscCommon.History.EndNoHistoryMode();
        }
    };
    CPushButtonField.prototype.DrawBackground = function(oGraphicsPDF) {
        
        let aOrigRect       = this.GetOrigRect();
        let aBgColor        = this.GetBackgroundColor();
        let oBgRGBColor;

        if (aBgColor && aBgColor.length != 0)
            oBgRGBColor = this.GetRGBColor(aBgColor);

        if (this.IsPressed() && this.IsHovered()) {
            switch (this.GetBorderStyle()) {
                case AscPDF.BORDER_TYPES.inset:
                    oBgRGBColor = MakeColorMoreGray(oBgRGBColor || {r: 255, g: 255, b: 255}, 50);
                    break;
                case AscPDF.BORDER_TYPES.beveled:
                    break;
            }
        }

        if (oBgRGBColor) {
            let X       = aOrigRect[0];
            let Y       = aOrigRect[1];
            let nWidth  = aOrigRect[2] - aOrigRect[0];
            let nHeight = aOrigRect[3] - aOrigRect[1];

            oGraphicsPDF.SetGlobalAlpha(1);
            
            if (oBgRGBColor.r != 255 || oBgRGBColor.g != 255 || oBgRGBColor.b != 255) {
                oGraphicsPDF.SetFillStyle(oBgRGBColor.r, oBgRGBColor.g, oBgRGBColor.b);
                oGraphicsPDF.FillRect(X, Y, nWidth, nHeight);
            }
        }
    };
    CPushButtonField.prototype.CheckImageOnce = function() {
        // на открытии не заполняли контент формы, но если внешнего вида нет, тогда рисуем сами, нужно заполнить форму контентом
        let oDrawing = this.GetDrawing();
        if (!oDrawing && !this.IsNeedDrawFromStream() && !this.imageChecked) {
            this.DoInitialRecalc();
            let sImgRasterId = this._imgData.normal;
            if (sImgRasterId)
                this.SetImage(sImgRasterId);
        }

        this.imageChecked = true;
    };
    CPushButtonField.prototype.CalculateContentClipRect = function() {
        if (!this.content)
            return;

        let aRect = this.GetOrigRect();
        if (!aRect) {
            return;
        }

        let X           = aRect[0];
        let Y           = aRect[1];
        let nWidth      = aRect[2] - aRect[0];
        let nHeight     = aRect[3] - aRect[1];
        let oMargins    = this.GetMarginsFromBorders();

        let contentX;
        let contentXLimit;
        
        if (this.IsButtonFitBounds() == false) {
            contentX = (X + 2 * oMargins.left) * g_dKoef_pt_to_mm;
            contentXLimit = (X + nWidth - 2 * oMargins.left) * g_dKoef_pt_to_mm;
        }
        else {
            contentX = (X) * g_dKoef_pt_to_mm;
            contentXLimit = (X + nWidth) * g_dKoef_pt_to_mm;
        }

        this.contentClipRect = {
            X: contentX,
            Y: (Y + 2 * oMargins.top) * g_dKoef_pt_to_mm,
            W: contentXLimit - contentX,
            H: (nHeight - 2 * oMargins.top -  2 * oMargins.bottom) * g_dKoef_pt_to_mm,
            Page: this.GetPage()
        };
        return this.contentClipRect;
    };
    CPushButtonField.prototype.DoInitialRecalc = function() {
        if (null == this.contentClipRect || this.IsNeedRecalc()) {
            if (this.GetDocument().checkFieldFont(this)) {
                this.Recalculate();
                return true;
            }

            return false;
        }

        return true;
    };
    CPushButtonField.prototype.Recalculate = function() {
        if (this.IsNeedRecalc() == false)
            return;

        this.CheckTextFont();
        
        if (false == this.RecalculateContentRect()) {
            this.Internal_CorrectContentPos();
            this.content.Recalculate_Page(0, false);
        }

        if (this.IsNeedRecalcTextTransform()) {
            this.RecalculateTextTransform();
        }
        
        this.SetNeedRecalc(false);
    };
    CPushButtonField.prototype.RecalculateContentRect = function() {
        let aOrigRect = this.GetOrigRect();
        
        let X       = aOrigRect[0];
        let Y       = aOrigRect[1];
        let nWidth  = (aOrigRect[2] - aOrigRect[0]);
        let nHeight = (aOrigRect[3] - aOrigRect[1]);

        let oMargins = this.GetMarginsFromBorders();
        
        let contentX;
        let contentY;
        let contentXLimit;
        let contentYLimit;
        
        if (this.IsButtonFitBounds() == false) {
            contentX = (X + 2 * oMargins.left) * g_dKoef_pt_to_mm;
            contentY = (Y + 2 * oMargins.top) * g_dKoef_pt_to_mm;
            contentXLimit = (X + nWidth - 2 * oMargins.left) * g_dKoef_pt_to_mm;
            contentYLimit = (Y + nHeight - 2 * oMargins.bottom) * g_dKoef_pt_to_mm;
        }
        else {
            contentX = (X) * g_dKoef_pt_to_mm;
            contentY = (Y) * g_dKoef_pt_to_mm;
            contentXLimit = (X + nWidth) * g_dKoef_pt_to_mm;
            contentYLimit = (Y + nHeight) * g_dKoef_pt_to_mm;
        }

        if (this.IsPressed() && this.IsHovered() && this.GetHighlight() == AscPDF.BUTTON_HIGHLIGHT_TYPES.push) {
            if (this.IsButtonFitBounds() == true) {
                contentX += oMargins.left * g_dKoef_pt_to_mm;
                contentY += oMargins.top * g_dKoef_pt_to_mm;
            }
            else {
                switch (this.GetBorderStyle()) {
                    case AscPDF.BORDER_TYPES.solid:
                    case AscPDF.BORDER_TYPES.dashed:
                    case AscPDF.BORDER_TYPES.underline:
                        contentX += oMargins.left * g_dKoef_pt_to_mm;
                        contentY += oMargins.top * g_dKoef_pt_to_mm;
                        contentXLimit += oMargins.left * g_dKoef_pt_to_mm;
                        contentYLimit += oMargins.top * g_dKoef_pt_to_mm;
                        break;
                    case AscPDF.BORDER_TYPES.beveled:
                    case AscPDF.BORDER_TYPES.inset:
                        contentX += oMargins.left * g_dKoef_pt_to_mm / 2;
                        contentY += oMargins.top * g_dKoef_pt_to_mm / 2;
                        contentXLimit += oMargins.left * g_dKoef_pt_to_mm / 2;
                        contentYLimit += oMargins.top * g_dKoef_pt_to_mm / 2;
                        break;
                }
            }
        }
	
		let rot = this.GetRotate();
		if (90 === rot || 270 === rot){
			let contentW = contentYLimit - contentY;
			contentXLimit = contentX + contentW;
		}

        if (contentX != this.content.X || contentY != this.content.Y ||
            contentXLimit != this.content.XLimit) {
            this.content.X      = contentX;
            this.content.Y      = contentY;
            this.content.XLimit = contentXLimit;
            this.content.YLimit = 20000;
            
            this.CalculateContentClipRect();
            this.Internal_CorrectContentPos();
            this.content.Recalculate_Page(0, true);

            return true;
        }

        return false;
    };
	CPushButtonField.prototype.CheckTextColor = function() {
		let oCaptionRun = this.GetCaptionRun();
		if (oCaptionRun == null)
			return;
		
		AscCommon.ExecuteNoHistory(function(){
			let aColor = this.GetTextColor();
			let oRGB = this.GetRGBColor(aColor);
			let oCaptionColor = oCaptionRun.Get_Color();
			
			if (oRGB.r === oCaptionColor.r
				&& oRGB.g === oCaptionColor.g
				&& oRGB.b === oCaptionColor.b)
				return;
			
			this._textColor = aColor;
			
			if (!this.content)
				return;
			
			let oPara       = oCaptionRun.Paragraph;
			let oApiPara    = editor.private_CreateApiParagraph(oPara);
			
			oApiPara.SetColor(oRGB.r, oRGB.g, oRGB.b, false);
			oPara.RecalcCompiledPr(true);
		}, undefined, this);
	};
	CPushButtonField.prototype.CheckTextFont = function() {
		let oCaptionRun = this.GetCaptionRun();
		if (oCaptionRun == null)
			return;
		
		AscCommon.ExecuteNoHistory(function(){
			let sFont = this.GetTextFontActual();
			this.content.SetFont(sFont);
			let oStyle = this.GetFontStyle();
			this.content.SetBold(oStyle.bold);
			this.content.SetItalic(oStyle.italic);
            if (this.GetTextSize()) {
                this.content.SetFontSize(this.GetTextSize());
            }
        }, undefined, this);
    };
    CPushButtonField.prototype.GetCaptionRun = function() {
        return this._captionRun;
    };
    CPushButtonField.prototype.SetCaptionRun = function(oRun) {
        this._captionRun = oRun;  
    };

    CPushButtonField.prototype.DrawFromStream = function(oGraphicsPDF, oGraphicsWord) {
        if (this.IsHidden() && !this.IsEditMode())
            return;
        
        let oViewer = editor.getDocumentRenderer();
        oGraphicsPDF.SetGlobalAlpha(1);
        
        let nImgType;
        if (this.IsPressed()) {
            nImgType = AscPDF.APPEARANCE_TYPES.mouseDown;
        }
        else if (this.IsHovered()) {
            nImgType = AscPDF.APPEARANCE_TYPES.rollover;
        }
        else
            nImgType = undefined;

        let originView = this.GetOriginView(nImgType, oGraphicsPDF.GetDrawingPageW(), oGraphicsPDF.GetDrawingPageH());
        if (!originView) {
            this.DrawLocks(oGraphicsPDF);
            this.DrawEdit(oGraphicsWord);
            return;
        }

        let oTr             = oGraphicsPDF.GetTransform();
        let highlightType   = this.GetHighlight();

        let aOrigRect = this.GetRect();

        let origX   = aOrigRect[0];
        let origY   = aOrigRect[1];
        let X       = originView.x;
        let Y       = originView.y;

        let nWidth  = originView.width;
        let nHeight = originView.height;

        let nLineWidth = this.GetBorderWidth() + 1;

        // Create a new canvas element for the cropped area
        var croppedCanvas       = document.createElement('canvas');
        var oCroppedCtx         = croppedCanvas.getContext("2d");
        croppedCanvas.width     = nWidth;
        croppedCanvas.height    = nHeight;

        if (this.IsPressed() == false) {
            oGraphicsPDF.DrawImageXY(originView, origX, origY, undefined, true);
            this.DrawLocks(oGraphicsPDF);
            this.DrawEdit(oGraphicsWord);
            return;
        }

        if (originView) {
            switch (highlightType) {
                case AscPDF.BUTTON_HIGHLIGHT_TYPES.none:
                case AscPDF.BUTTON_HIGHLIGHT_TYPES.push:
                    oGraphicsPDF.DrawImageXY(originView, origX, origY, undefined, true);
                    break;
                case AscPDF.BUTTON_HIGHLIGHT_TYPES.invert: {
                    let xCenter = oViewer.width >> 1;
                    if (oViewer.documentWidth > oViewer.width)
                    {
                        xCenter = (oViewer.documentWidth >> 1) - (oViewer.scrollX) >> 0;
                    }
                    let yPos    = oViewer.scrollY >> 0;
                    let page    = oViewer.drawingPages[this.GetPage()];
                    let w       = (page.W * AscCommon.AscBrowser.retinaPixelRatio) >> 0;
                    let h       = (page.H * AscCommon.AscBrowser.retinaPixelRatio) >> 0;
                    let indLeft = ((xCenter * AscCommon.AscBrowser.retinaPixelRatio) >> 0) - (w >> 1);
                    let indTop  = ((page.Y - yPos) * AscCommon.AscBrowser.retinaPixelRatio) >> 0;

                    let x = X + indLeft;
                    let y = Y + indTop;
                    let nDWidth = 0;
                    let nDHeight = 0;

                    if (x < 0) {
                        nDWidth = nWidth - (nWidth + x);
                        X       += nDWidth;
                        nWidth  += x >> 0;
                        croppedCanvas.width = nWidth;
                        x = 0;
                    }
                    if (y < 0) {
                        nDHeight    = nHeight - (nHeight + y);
                        Y           += nDHeight;
                        nHeight     += y >> 0;
                        croppedCanvas.height = nHeight;
                        y = 0;
                    }

                    oCroppedCtx.drawImage(oViewer.canvas, x, y, nWidth, nHeight, 0, 0, nWidth, nHeight);
                    
                    if (page.ImageAnnots) {
                        oCroppedCtx.drawImage(page.ImageAnnots, X, Y, nWidth, nHeight, 0, 0, nWidth, nHeight);
                    }

                    oCroppedCtx.drawImage(originView, nDWidth, nDHeight, originView.width, originView.height, 0, 0, originView.width, originView.height);
                    oCroppedCtx.globalCompositeOperation='difference';
                    oCroppedCtx.fillStyle='white';
                    oCroppedCtx.fillRect(0, 0, croppedCanvas.width,croppedCanvas.height);
                    oGraphicsPDF.DrawImageXY(oCroppedCtx.canvas, origX, origY, undefined, true);
                    break;
                }
                case AscPDF.BUTTON_HIGHLIGHT_TYPES.outline: {
                    if (originView) {
                        oCroppedCtx.drawImage(originView, 0, 0);
                    }
                    else {
                        oCroppedCtx.drawImage(oViewer.canvasForms, X, Y, nWidth, nHeight, 0, 0, nWidth, nHeight);
                    }
    
                    oCroppedCtx.clearRect(nLineWidth * oTr.sy, nLineWidth * oTr.sy, croppedCanvas.width - 2 * nLineWidth * oTr.sy, croppedCanvas.height - 2 * nLineWidth * oTr.sy);
    
                    oCroppedCtx.globalCompositeOperation='difference';
                    oCroppedCtx.fillStyle='white';
                    oCroppedCtx.fillRect(0, 0, croppedCanvas.width,croppedCanvas.height);
                    oCroppedCtx.globalCompositeOperation='source-over';
                    oCroppedCtx.drawImage(originView, nLineWidth * oTr.sy, nLineWidth * oTr.sy, nWidth - 2 * nLineWidth * oTr.sy, nHeight - 2 * nLineWidth * oTr.sy, nLineWidth * oTr.sy, nLineWidth * oTr.sy, nWidth -  2 * nLineWidth * oTr.sy, nHeight - 2 * nLineWidth * oTr.sy);
    
                    oGraphicsPDF.DrawImageXY(oCroppedCtx.canvas, origX, origY, undefined, true);
                    break;
                }
            }
        }

        this.DrawLocks(oGraphicsPDF);
        this.DrawEdit(oGraphicsWord);
    };
    CPushButtonField.prototype.SetPressed = function(bValue) {
        this._pressed = bValue;
    };
    CPushButtonField.prototype.IsPressed = function() {
        return this._pressed;
    };
    CPushButtonField.prototype.IsHovered = function() {
        return this._hovered;
    };
    CPushButtonField.prototype.SetHovered = function(bValue) {
        this._hovered = bValue;
    };

    CPushButtonField.prototype.onMouseDown = function(x, y, e) {
        let oDoc            = this.GetDocument();
        let oActionsQueue   = oDoc.GetActionsQueue();

        let isInFocus   = oDoc.activeForm === this;
        oDoc.activeForm = this;

        if (oDoc.IsEditFieldsMode()) {
            let oController = oDoc.GetController();
            this.editShape.select(oController, this.GetPage());
            if (false == this.IsLocked()) {
                this.editShape.onMouseDown(x, y, e)
            }
            return;
        }

        function callbackAfterFocus() {
            this.SetInForm(true);
        }
        
        this.DrawPressed();
        
        let oOnFocus = this.GetTrigger(AscPDF.FORMS_TRIGGERS_TYPES.OnFocus);
        // вызываем выставление курсора после onFocus. Если уже в фокусе, тогда сразу.
        if (false == isInFocus && oOnFocus && oOnFocus.Actions.length > 0)
            oActionsQueue.callbackAfterFocus = callbackAfterFocus.bind(this);
        else
            callbackAfterFocus.bind(this)();

        if (isInFocus) {
            this.AddActionsToQueue(AscPDF.FORMS_TRIGGERS_TYPES.MouseDown);
        }
        else {
            this.AddActionsToQueue(AscPDF.FORMS_TRIGGERS_TYPES.MouseDown, AscPDF.FORMS_TRIGGERS_TYPES.OnFocus);
        }
    };
    CPushButtonField.prototype.onMouseUp = function() {
        this.SetPressed(false); // флаг что нужно рисовать нажатие

        if (this.GetHighlight() != AscPDF.BUTTON_HIGHLIGHT_TYPES.none) {
            this.DrawUnpressed();
        }

        this.AddActionsToQueue(AscPDF.FORMS_TRIGGERS_TYPES.MouseUp);
    };
    CPushButtonField.prototype.onMouseEnter = function() {
        this.AddActionsToQueue(AscPDF.FORMS_TRIGGERS_TYPES.MouseEnter);
        this.DrawRollover();
    };

    CPushButtonField.prototype.onMouseExit = function() {
        this.AddActionsToQueue(AscPDF.FORMS_TRIGGERS_TYPES.MouseExit);
        this.OnEndRollover();
    };
    CPushButtonField.prototype.buttonImportIcon = function() {
        if (this.IsReadOnly()) {
            return;
        }
        
        let Api                 = Asc.editor;
        let oThis               = this;
        let oDoc                = this.GetDocument();
        let oActionsQueue       = oDoc.GetActionsQueue();
        this.asc_curImageState  = undefined;

        if (oActionsQueue.curAction) {
            oActionsQueue.curAction.bContinueAfterEval = false;
        }
        
        Api.oSaveObjectForAddImage = this;

        function importCanceled(error, files) {
            if (error.canceled == true || !files) {
                oActionsQueue.Continue();
            }
            else {
                Api._uploadCallback(error, files, oThis);
            }

            AscCommon.global_mouseEvent.UnLockMouse();
        }

        this.fErrorCallback = importCanceled;

        AscCommon.global_mouseEvent.LockMouse();
        if (window["AscDesktopEditor"] && window["AscDesktopEditor"]["IsLocalFile"]()) {
            window["AscDesktopEditor"]["OpenFilenameDialog"]("images", false, function(_file) {
                var file = _file;
                if (Array.isArray(file))
                    file = file[0];
                if (!file) {
                    oActionsQueue.Continue();
                    return;
                }
        
                var _url = window["AscDesktopEditor"]["LocalFileGetImageUrl"](file);
                editor._addImageUrl([AscCommon.g_oDocumentUrls.getImageUrl(_url)], oThis);
            });
        }
        else {
            AscCommon.ShowImageFileDialog(Api.documentId, Api.documentUserId, undefined, Api.documentShardKey, Api.documentWopiSrc, Api.documentUserSessionId, importCanceled, function(error) {
                if (c_oAscError.ID.No !== error) {
                    Api.sendEvent("asc_onError", error, c_oAscError.Level.NoCritical);
                }

                Api.sync_StartAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.UploadImage);
                AscCommon.global_mouseEvent.UnLockMouse();
            });
        }
    };
    CPushButtonField.prototype.GetDrawing = function() {
        return this.content.GetAllDrawingObjects()[0];
    };
    CPushButtonField.prototype.SetButtonFitBounds = function(bValue) {
        if (this._buttonFitBounds != bValue) {
            AscCommon.History.Add(new CChangesPDFPushbuttonFitBounds(this, this._buttonFitBounds, bValue));

            this._buttonFitBounds = bValue;
            this.SetNeedUpdateImage(true);
            this.SetNeedRecalc(true);
            this.SetWasChanged(true);
        }
    };
    CPushButtonField.prototype.IsButtonFitBounds = function() {
        return this._buttonFitBounds;
    };
    CPushButtonField.prototype.SetScaleWhen = function(nType) {
        AscCommon.History.Add(new CChangesPDFPushbuttonScaleWhenType(this, this._buttonScaleWhen, nType));

        this._buttonScaleWhen = nType;
        this.SetNeedUpdateImage(true);
        this.SetWasChanged(true);
        this._UpdateImage();
    };
    CPushButtonField.prototype.GetScaleWhen = function() {
        return this._buttonScaleWhen;
    };
    CPushButtonField.prototype.SetScaleHow = function(nType) {
        AscCommon.History.Add(new CChangesPDFPushbuttonScaleHowType(this, this._buttonScaleHow, nType));

        this._buttonScaleHow = nType;
        this.SetNeedUpdateImage(true);
        this.SetWasChanged(true);
        this._UpdateImage();
    };
    CPushButtonField.prototype.GetScaleHow = function() {
        return this._buttonScaleHow;
    };
    /**
     * Controls how the text and the icon of the button are positioned with respect to each other within the button face. The
     * convenience position object defines all of the valid alternatives..
     * @memberof CPushButtonField
     * @param {number} nType
     * @typeofeditors ["PDF"]
     */
    CPushButtonField.prototype.SetLayout = function(nType) {
        AscCommon.History.Add(new CChangesPDFPushbuttonLayout(this, this.GetLayout(), nType));

        switch (nType) {
            case position["textOnly"]:
                this.SetTextOnly();
                break;
            case position["iconOnly"]:
                this.SetIconOnly();
                break;
            case position["iconTextV"]:
                this.SetIconTextV();
                break;
            case position["textIconV"]:
                this.SetTextIconV();
                break;
            case position["iconTextH"]:
                this.SetIconTextH();
                break;
            case position["textIconH"]:
                this.SetTextIconH();
                break;
            case position["overlay"]:
                this.SetOverlay();
                break;
        }

        this.SetWasChanged(true);
        this.SetNeedRecalc(true);
    };
    CPushButtonField.prototype.GetLayout = function() {
        return this._buttonPosition;
    };
    CPushButtonField.prototype.SetIconPosition = function(X, Y) {
        AscCommon.History.Add(new CChangesPDFPushbuttonIconPos(this, [this._buttonAlignX, this._buttonAlignY], [X, Y]));

        if (X != null)
            this._buttonAlignX = Math.abs(Math.min(X, 1));
        if (Y != null)
            this._buttonAlignY = Math.abs(Math.min(Y, 1));

        this.SetWasChanged(true);
        this.SetNeedRecalc(true);

        AscCommon.History.StartNoHistoryMode();
        let oDrawing = this.GetDrawing();
        if (oDrawing) {
            let nScaleWhen  = this.GetScaleWhen();
            let nScaleHow   = this.GetScaleHow();
            
            let nDrawingW = oDrawing.Extent.W;
            let nDrawingH = oDrawing.Extent.H;

            // выставляем положение картинки только в случае, когда скейл пропорциональный или его нет вовсе или когда размеры картинки больше чем размеры drawing под эту картинку,
            // т.к. в ином случае картинка будет растянута по размерам формы
            if (nScaleHow === scaleHow["proportional"] || nScaleWhen == scaleWhen["never"] || (nScaleWhen == scaleWhen["tooSmall"] && (this.relImgSize.W > nDrawingW || this.relImgSize.H > nDrawingH))) {
                let shape = oDrawing.GraphicObj;
				let nW = nDrawingW;
				let nH = nDrawingH;

				let nDstW = this.relImgSize.W;
				let nDstH = this.relImgSize.H;
				
				let spaceX = nW - nDstW;
				let spaceY = nH - nDstH;
				//
				var nPadL = this._buttonAlignX * spaceX;
				var nPadT = (1 - this._buttonAlignY) * spaceY;

				let srcRect = new AscFormat.CSrcRect();
				srcRect.setLTRB(
					100 * -nPadL / nDstW,
					100 * -nPadT / nDstH,
					100 * (1 + (spaceX - nPadL) / nDstW),
					100 * (1 + (spaceY - nPadT) / nDstH)
				);
				shape.setSrcRect(srcRect);
				shape.blipFill.stretch = false;
            }
        }
        AscCommon.History.EndNoHistoryMode();
    };
    CPushButtonField.prototype.GetIconPosition = function() {
        let oIconPos = {X: this._buttonAlignX, Y: this._buttonAlignY};

        oIconPos["X"] = oIconPos.X;
        oIconPos["Y"] = oIconPos.Y;

        return oIconPos;
    };
    CPushButtonField.prototype.SetTextOnly = function() {
        if (this._buttonPosition == position["textOnly"])
            return;

        this._buttonPosition = position["textOnly"];

        AscCommon.History.StartNoHistoryMode();

        let oPara;
        if (this.content.Content.length == 2) {
            for (let i = 0; i < this.content.Content.length; i++) {
                oPara = this.content.GetElement(i);
    
                if (oPara.GetAllDrawingObjects().length > 0) {
                    this.content.RemoveFromContent(i, 1, false);
                    break;
                }
            }
        }
        else {
            oPara = this.content.GetElement(0);
            oPara.RemoveFromContent(1, oPara.GetElementsCount() - 1, false);
            let oTargetRun = oPara.GetElement(0);
            oTargetRun.ClearContent();

            let sCaption = this.GetCaption();
            if (sCaption) {
                oTargetRun.AddText(sCaption);
                this.SetCaptionRun(oTargetRun);
            }
        }

        this.SetImage('');
        AscCommon.History.EndNoHistoryMode();

        this.SetImageRasterId('', AscPDF.APPEARANCE_TYPES.normal);
        this.SetImageRasterId('', AscPDF.APPEARANCE_TYPES.rollover);
        this.SetImageRasterId('', AscPDF.APPEARANCE_TYPES.mouseDown);

        this.SetWasChanged(true);
        this.SetNeedRecalc(true);
    };
    CPushButtonField.prototype.SetIconOnly = function() {
        if (this._buttonPosition == position["iconOnly"])
            return;

        AscCommon.History.StartNoHistoryMode();

        let oPara;
        if (this.content.Content.length == 2) {
            switch (this._buttonPosition) {
                case position["iconTextV"]: {
                    this.content.RemoveFromContent(1, 1, false);
                    break;
                }
                case position["textIconV"]: {
                    this.content.RemoveFromContent(0, 1, false);
                    break;
                }
            }
        }
        else {
            oPara = this.content.GetElement(0);
            
            let aRunForDel = [];
            let oTmpRun;
            for (let i = 0; i < oPara.Content.length - 1; i++) {
                oTmpRun = oPara.GetElement(i);
                if (oTmpRun.GetAllDrawingObjects().length == 0 && oTmpRun.Content.length != 0) {
                    aRunForDel.push(oTmpRun);
                }
            }

            let oCaptionRun = this.GetCaptionRun();
            if (oCaptionRun) {
                oCaptionRun.ClearContent()
                this.SetCaptionRun(null);
            }

            let nPosInPara;
            for (let i = 0; i < aRunForDel.length; i++) {
                let oRun = aRunForDel[i];
                oRun.PreDelete();
                nPosInPara = oPara.Content.indexOf(oRun);
                oPara.Remove_FromContent(nPosInPara, 1, true);
            }
            oPara.CorrectContent();
        }

        this._buttonPosition = position["iconOnly"];
        
        AscCommon.History.EndNoHistoryMode();

        this.SetNeedUpdateImage(true);
        this.SetNeedRecalc(true);
    };
    CPushButtonField.prototype.SetIconTextV = function() {
        if (this._buttonPosition == position["iconTextV"])
            return;

        this._buttonPosition = position["iconTextV"];

        AscCommon.History.StartNoHistoryMode();

        let oPara1;
        let oPara2;
        if (this.content.Content.length == 2) {
            oPara1 = this.content.GetElement(0);
            oPara2 = this.content.GetElement(1);

            this.content.Remove_FromContent(0, 1);
            this.content.Add_ToContent(1, oPara1);
        }
        else {
            oPara1 = this.content.GetElement(0);
            let aRunForDel = [];
            let oTmpRun;
            for (let i = 0; i < oPara1.Content.length - 1; i++) {
                oTmpRun = oPara1.GetElement(i);
                if (oTmpRun.GetAllDrawingObjects().length == 0 && oTmpRun.Content.length != 0) {
                    aRunForDel.push(oTmpRun);
                }
            }

            let nPosInPara;
            for (let i = 0; i < aRunForDel.length; i++) {
                let oRun = aRunForDel[i];
                oRun.PreDelete();
                nPosInPara = oPara1.Content.indexOf(oRun);
                oPara1.Remove_FromContent(nPosInPara, 1, true);
            }
            oPara1.CorrectContent();

            let oNewPara = new AscWord.Paragraph(this.content, false);
            oNewPara.CorrectContent();
            this.content.AddToContent(1, oNewPara);
            oNewPara.Set_Align(align_Center);
            oNewPara.RecalcCompiledPr(true);

            let oCaptionRun = this.GetCaptionRun();

            if (oCaptionRun) {
                oCaptionRun.ClearContent();
                this.SetCaptionRun(null);
            }

            let sCaption = this.GetCaption();
            if (sCaption) {
                oCaptionRun = oNewPara.GetElement(0);
                oCaptionRun.AddText(sCaption);
                this.SetCaptionRun(oCaptionRun);
            }
        }

        AscCommon.History.EndNoHistoryMode();

        this.SetNeedUpdateImage(true);
        this.SetNeedRecalc(true);
    };
    CPushButtonField.prototype.SetTextIconV = function() {
        if (this._buttonPosition == position["textIconV"])
            return;

        this._buttonPosition = position["textIconV"];

        AscCommon.History.StartNoHistoryMode();

        let oPara1;
        let oPara2;
        if (this.content.Content.length == 2) {
            oPara1 = this.content.GetElement(0);
            oPara2 = this.content.GetElement(1);

            this.content.Remove_FromContent(0, 1);
            this.content.Add_ToContent(1, oPara1);
        }
        else {
            oPara1 = this.content.GetElement(0);
            let aRunForDel = [];
            let oTmpRun;
            for (let i = 0; i < oPara1.Content.length - 1; i++) {
                oTmpRun = oPara1.GetElement(i);
                if (oTmpRun.GetAllDrawingObjects().length == 0 && oTmpRun.Content.length != 0) {
                    aRunForDel.push(oTmpRun);
                }
            }

            let nPosInPara;
            for (let i = 0; i < aRunForDel.length; i++) {
                let oRun = aRunForDel[i];
                oRun.PreDelete();
                nPosInPara = oPara1.Content.indexOf(oRun);
                oPara1.Remove_FromContent(nPosInPara, 1, true);
            }
            oPara1.CorrectContent();
            
            let oNewPara = new AscWord.Paragraph(this.content, false);
            oNewPara.CorrectContent();
            this.content.AddToContent(0, oNewPara);
            oNewPara.Set_Align(align_Center);
            oNewPara.RecalcCompiledPr(true);

            let oCaptionRun = this.GetCaptionRun();

            if (oCaptionRun) {
                oCaptionRun.ClearContent();
                this.SetCaptionRun(null);
            }

            let sCaption = this.GetCaption();
            if (sCaption) {
                oCaptionRun = oNewPara.GetElement(0);
                oCaptionRun.AddText(sCaption);
                this.SetCaptionRun(oCaptionRun);
            }
        }

        AscCommon.History.EndNoHistoryMode();

        this.SetNeedUpdateImage(true);
        this.SetNeedRecalc(true);
    };
    CPushButtonField.prototype.SetIconTextH = function() {
        if (this._buttonPosition == position["iconTextH"])
            return;

        this._buttonPosition = position["iconTextH"];

        AscCommon.History.StartNoHistoryMode();

        let oPara;
        if (this.content.Content.length == 2) {
            for (let i = 0; i < this.content.Content.length; i++) {
                oPara = this.content.GetElement(i);
                if (oPara.GetAllDrawingObjects().length == 0) {
                    this.content.RemoveFromContent(i, 1, false);
                    break;
                }
            }
        }

        oPara = this.content.GetElement(0);
        let aRunForDel = [];
        let oTmpRun;
        
        for (let i = 0; i < oPara.Content.length - 1; i++) {
            oTmpRun = oPara.GetElement(i);
            if (oTmpRun.GetAllDrawingObjects().length == 0 && oTmpRun.Content.length != 0) {
                aRunForDel.push(oTmpRun);
            }
        }

        let nPosInPara;
        for (let i = 0; i < aRunForDel.length; i++) {
            let oRun = aRunForDel[i];
            oRun.PreDelete();
            nPosInPara = oPara.Content.indexOf(oRun);
            oPara.Remove_FromContent(nPosInPara, 1, true);
        }
        oPara.CorrectContent();

        let oCaptionRun = this.GetCaptionRun();

        if (oCaptionRun) {
            oCaptionRun.ClearContent();
            this.SetCaptionRun(null);
        }

        let sCaption = this.GetCaption();
        if (sCaption) {
            oTmpRun = new ParaRun(oPara, false);
            oTmpRun.AddText(sCaption);
            this.SetCaptionRun(oTmpRun);

            oPara.Add_ToContent(oPara.Content.length - 1, oTmpRun);
        }

        AscCommon.History.EndNoHistoryMode();

        this.SetNeedUpdateImage(true);
        this.SetNeedRecalc(true);
    };
    CPushButtonField.prototype.SetTextIconH = function() {
        if (this._buttonPosition == position["textIconH"])
            return;

        this._buttonPosition = position["textIconH"];

        AscCommon.History.StartNoHistoryMode();

        let oPara;
        if (this.content.Content.length == 2) {
            for (let i = 0; i < this.content.Content.length; i++) {
                oPara = this.content.GetElement(i);
                if (oPara.GetAllDrawingObjects().length == 0) {
                    this.content.RemoveFromContent(i, 1, false);
                    break;
                }
            }
        }

        oPara = this.content.GetElement(0);
        let aRunForDel = [];
        let oTmpRun;
        
        for (let i = 0; i < oPara.Content.length - 1; i++) {
            oTmpRun = oPara.GetElement(i);
            if (oTmpRun.GetAllDrawingObjects().length == 0 && oTmpRun.Content.length != 0) {
                aRunForDel.push(oTmpRun);
            }
        }

        let nPosInPara;
        for (let i = 0; i < aRunForDel.length; i++) {
            let oRun = aRunForDel[i];
            oRun.PreDelete();
            nPosInPara = oPara.Content.indexOf(oRun);
            oPara.Remove_FromContent(nPosInPara, 1, true);
        }
        oPara.CorrectContent();

        let oCaptionRun = this.GetCaptionRun();

        if (oCaptionRun) {
            oCaptionRun.ClearContent();
            this.SetCaptionRun(null);
        }

        let sCaption = this.GetCaption();
        if (sCaption) {
            oTmpRun = new ParaRun(oPara, false);
            oTmpRun.AddText(sCaption);
            oPara.Add_ToContent(0, oTmpRun);

            this.SetCaptionRun(oTmpRun);
        }
        
        AscCommon.History.EndNoHistoryMode();

        this.SetNeedUpdateImage(true);
        this.SetNeedRecalc(true);
    };
    CPushButtonField.prototype.SetOverlay = function() {
        if (this._buttonPosition == position["overlay"])
            return;

        this._buttonPosition = position["overlay"];

        AscCommon.History.StartNoHistoryMode();

        let oPara;
        if (this.content.Content.length == 2) {
            for (let i = 0; i < this.content.Content.length; i++) {
                oPara = this.content.GetElement(i);
                if (oPara.GetAllDrawingObjects().length == 0) {
                    this.content.RemoveFromContent(i, 1, false);
                    break;
                }
            }
        }

        oPara = this.content.GetElement(0);
        let aRunForDel = [];
        let oTmpRun;
        
        for (let i = 0; i < oPara.Content.length - 1; i++) {
            oTmpRun = oPara.GetElement(i);
            if (oTmpRun.GetAllDrawingObjects().length == 0) {
                aRunForDel.push(oTmpRun);
            }
        }

        let nPosInPara;
        let oCaptionRun = this.GetCaptionRun();

        if (oCaptionRun) {
            oCaptionRun.ClearContent();
            this.SetCaptionRun(null);
        }

        for (let i = 0; i < aRunForDel.length; i++) {
            let oRun = aRunForDel[i];
            oRun.PreDelete();
            nPosInPara = oPara.Content.indexOf(oRun);
            oPara.Remove_FromContent(nPosInPara, 1, true);
        }
        oPara.CorrectContent();

        let sCaption = this.GetCaption();
        if (sCaption) {
            oCaptionRun = oPara.GetElement(0);
            this.SetCaptionRun(oCaptionRun);
            oCaptionRun.AddText(sCaption);
        }

        AscCommon.History.EndNoHistoryMode();

        this.SetNeedUpdateImage(true);
        this.SetNeedRecalc(true);
    };
	CPushButtonField.prototype._isCenterAlign = function() {
		return false;
	};

    /**
     * Applies value of this field to all field with the same name.
     * @memberof CPushButtonField
     * @typeofeditors ["PDF"]
     */
    CPushButtonField.prototype.Commit = function() {
        let oDoc = this.GetDocument();
        let aFields = this.GetDocument().GetAllWidgets(this.GetFullName());
        let oThisPara = this.content.GetElement(0);
        
        oDoc.StartNoHistoryMode();

        if (aFields.length == 1)
            this.SetNeedCommit(false);

        for (let i = 0; i < aFields.length; i++) {
            if (aFields[i] == this)
                continue;

            let oFieldPara = aFields[i].content.GetElement(0);
            let oThisRun, oFieldRun;
            for (let nItem = 0; nItem < oThisPara.Content.length - 1; nItem++) {
                oThisRun = oThisPara.Content[nItem];
                oFieldRun = oFieldPara.Content[nItem];
                oFieldRun.ClearContent();

                for (let nRunPos = 0; nRunPos < oThisRun.Content.length; nRunPos++) {
                    oFieldRun.AddToContent(nRunPos, AscCommon.IsSpace(oThisRun.Content[nRunPos].Value) ? new AscWord.CRunSpace(oThisRun.Content[nRunPos].Value) : new AscWord.CRunText(oThisRun.Content[nRunPos].Value));
                }
            }

            aFields[i].SetNeedRecalc(true);
        }

        oDoc.EndNoHistoryMode();
    };

    CPushButtonField.prototype.Reset = function() {
    };
	CPushButtonField.prototype.WriteToBinary = function(memory) {
        memory.WriteByte(AscCommon.CommandType.ctAnnotField);

        // длина комманд
        let nStartPos = memory.GetCurPosition();
        memory.Skip(4);

        this.WriteToBinaryBase(memory);
        this.WriteToBinaryBase2(memory);

        // флаги кнопки
        let nPosForButtonFlags  = memory.GetCurPosition();
        let nButtonFlags        = 0;
        memory.Skip(4);
        
        // normal caption
        let sCaption = this.GetCaption(AscPDF.APPEARANCE_TYPES.normal);
        if (sCaption != null) {
            memory.fieldDataFlags |= (1 << 10);
            memory.WriteString(sCaption);
        }

        // rollover caption
        let sRolloverCaption = this.GetCaption(AscPDF.APPEARANCE_TYPES.rollover);
        if (sRolloverCaption != null) {
            memory.fieldDataFlags |= (1 << 11);
            memory.WriteString(sRolloverCaption);
        }

        // mouseDown caption
        let sDownCaption = this.GetCaption(AscPDF.APPEARANCE_TYPES.mouseDown);
        if (sDownCaption != null) {
            memory.fieldDataFlags |= (1 << 12);
            memory.WriteString(sDownCaption);
        }

        // button header position position
        let nButtonPosition = this.GetLayout();
        if (nButtonPosition != null) {
            memory.fieldDataFlags |= (1 << 13);
            memory.WriteByte(nButtonPosition);
        }

        // scale when
        let nScaleWhen = this.GetScaleWhen();
        if (nScaleWhen != null) {
            nButtonFlags |= (1 << 0);
            nButtonFlags |= (1 << 1);
            memory.WriteByte(nScaleWhen);
        }

        // scale how
        let nScaleHow = this.GetScaleHow();
        if (nScaleWhen != null) {
            nButtonFlags |= (1 << 0);
            nButtonFlags |= (1 << 2);
            memory.WriteByte(nScaleHow);
        }

        // icon pos
        let oIconPos = this.GetIconPosition();
        nButtonFlags |= (1 << 0);
        nButtonFlags |= (1 << 3);
        memory.WriteDouble(oIconPos.X);
        memory.WriteDouble(oIconPos.Y);

        let isButtonFB = this.IsButtonFitBounds();
        if (isButtonFB) {
            nButtonFlags |= (1 << 4);
        }

        function WriteImage(memory, nImgType) {
            let sPathToImg = AscCommon.getFullImageSrc2(this.GetImageRasterId(nImgType));
            let nExistIdx = memory.images.indexOf(sPathToImg);
            if (nExistIdx === -1) {
                memory.WriteLong(memory.images.length);
                memory.images.push(sPathToImg);
            }
            else
                memory.WriteLong(nExistIdx);
        }

        // not supported in server side now
        // if (this.IsImageChanged(AscPDF.APPEARANCE_TYPES.normal)) {
        //     nButtonFlags |= (1 << 5);
        //     WriteImage.call(this, memory, AscPDF.APPEARANCE_TYPES.normal);
            
        // }
        // if (this.IsImageChanged(AscPDF.APPEARANCE_TYPES.rollover)) {
        //     nButtonFlags |= (1 << 6);
        //     WriteImage.call(this, memory, AscPDF.APPEARANCE_TYPES.rollover);
        // }
        // if (this.IsImageChanged(AscPDF.APPEARANCE_TYPES.mouseDown)) {
        //     nButtonFlags |= (1 << 7);
        //     WriteImage.call(this, memory, AscPDF.APPEARANCE_TYPES.mouseDown);
        // }

        nButtonFlags |= (1 << 5);
        WriteImage.call(this, memory, AscPDF.APPEARANCE_TYPES.normal);

        nButtonFlags |= (1 << 6);
        WriteImage.call(this, memory, AscPDF.APPEARANCE_TYPES.rollover);
        
        nButtonFlags |= (1 << 7);
        WriteImage.call(this, memory, AscPDF.APPEARANCE_TYPES.mouseDown);

        let nEndPos = memory.GetCurPosition();

        // запись флагов
        memory.Seek(nPosForButtonFlags);
        memory.WriteLong(nButtonFlags);
        memory.Seek(memory.posForWidgetFlags);
        memory.WriteLong(memory.widgetFlags);
        memory.Seek(memory.posForFieldDataFlags);
        memory.WriteLong(memory.fieldDataFlags);

        // запись длины комманд
        memory.Seek(nStartPos);
        memory.WriteLong(nEndPos - nStartPos);
        memory.Seek(nEndPos);
    };
    function MakeColorMoreGray(rgbColor, nPower) {
        // Получаем значения компонентов цвета
        const r = rgbColor.r;
        const g = rgbColor.g;
        const b = rgbColor.b;
      
        // Вычисляем новые значения компонентов с учетом затемнения (уменьшения интенсивности)
        const grayR = Math.max(0, r - nPower);
        const grayG = Math.max(0, g - nPower);
        const grayB = Math.max(0, b - nPower);
      
        // Возвращаем новый серый цвет
        return {
            r: grayR,
            g: grayG,
            b: grayB
        };
    }

    if (!window["AscPDF"])
	    window["AscPDF"] = {};

	window["AscPDF"].CPushButtonField       = CPushButtonField;
	window["AscPDF"].PUSHBUTTON_BG          = PUSHBUTTON_BG;
	window["AscPDF"].MakeColorMoreGray      = MakeColorMoreGray;
    
})();

