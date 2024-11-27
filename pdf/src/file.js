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

(function(window, undefined) {

    /*
    function TextStreamReader(data, size)
    {
        this.data = data;
        this.size = size;
        this.pos = 0;

        this.Seek = function(pos)
        {
            if (pos > this.size)
                return 1;
            this.pos = pos;
            return 0;
        };
        this.Skip = function(skip)
        {
            return this.Seek(this.pos + skip);
        };

        // 1 bytes
        this.GetUChar = function()
        {
            if (this.pos >= this.size)
                return 0;
            return this.data[this.pos++];
        };
        this.GetChar = function()
        {
            if (this.pos >= this.size)
                return 0;
            var m = this.data[this.pos++];
            if (m > 0x7F)
                m -= 256;
            return m;
        };

        // 2 byte
        this.GetUShort = function()
        {
            if (this.pos + 1 >= this.size)
                return 0;
            return (this.data[this.pos++] | this.data[this.pos++] << 8);
        };
        this.GetShort = function()
        {
            if (this.pos + 1 >= this.size)
                return 0;
            var _c = (this.data[this.pos++] | this.data[this.pos++] << 8);

            if (_c > 0x7FFF)
                return _c - 65536;
            return _c;
        };

        // 4 byte
        this.GetULong = function()
        {
            if (this.pos + 3 >= this.size)
                return 0;
            var s = (this.data[this.pos++] | this.data[this.pos++] << 8 | this.data[this.pos++] << 16 | this.data[this.pos++] << 24);
            if (s < 0)
                s += (0xFFFFFFFF + 1);
            return s;
        };
        this.GetLong = function()
        {
            return (this.data[this.pos++] | this.data[this.pos++] << 8 | this.data[this.pos++] << 16 | this.data[this.pos++] << 24);
        };

        // double
        this.GetDouble = function()
        {
            return this.GetLong() / 10000;
        };
        this.GetDouble2 = function()
        {
            return this.GetShort() / 100;
        };
    }
    */

    function CSpan()
    {
        this.fontName = 0;
        this.fontSize = 0;

        this.colorR = 0;
        this.colorG = 0;
        this.colorB = 0;

        this.inner = "";

        this.CreateDublicate = function()
        {
            var ret = new CSpan();

            ret.fontName = this.fontName;
            ret.fontSize = this.fontSize;

            ret.colorR = this.colorR;
            ret.colorG = this.colorG;
            ret.colorB = this.colorB;

            ret.inner = this.inner;

            return ret;
        }
    }

    var supportImageDataConstructor = (AscCommon.AscBrowser.isIE && !AscCommon.AscBrowser.isIeEdge) ? false : true;

    function CFile()
    {
    	this.nativeFile = 0;
    	this.pages = [];
        this.originalPagesCount = 0;
    	this.zoom = 1;
    	this.isUse3d = false;
    	this.cacheManager = null;
    	this.logging = true;

    	this.Selection = {
            Page1 : 0,
            Line1 : 0,
            Word1 : 0,
            Glyph1 : 0,

            Page2 : 0,
            Line2 : 0,
            Word2 : 0,
            Glyph2 : 0,

            quads: [],
            IsSelection : false
        };

        this.viewer = null;

        this.maxCanvasSize = 0;
        if (AscCommon.AscBrowser.isAppleDevices || AscCommon.AscBrowser.isAndroid)
            this.maxCanvasSize = 4096;
    }

    // interface
    CFile.prototype.close = function() 
    {
        if (this.nativeFile)
        {
            this.nativeFile["close"]();
            this.nativeFile = null;
            this.pages = [];
        }
    };
    CFile.prototype.getFileBinary = function()
    {
        return this.nativeFile ? this.nativeFile["getFileBinary"]() : null;
    };
    CFile.prototype.getUint8Array = function(ptr, len)
    {
        return this.nativeFile ? this.nativeFile["getUint8Array"](ptr, len) : null;
    };
    CFile.prototype.getUint8ClampedArray = function(ptr, len)
    {
        return this.nativeFile ? this.nativeFile["getUint8ClampedArray"](ptr, len) : null;
    };
    CFile.prototype.free = function(pointer)
    {
        this.nativeFile && this.nativeFile["free"](pointer);
    };
    CFile.prototype.getStructure = function() 
    {
        return this.nativeFile ? this.nativeFile["getStructure"]() : [];
    };
    CFile.prototype.getDocumentInfo = function()
    {
        return this.nativeFile ? this.nativeFile["getDocumentInfo"]() : null;
    };
    CFile.prototype.isNeedCMap = function()
    {
        return this.nativeFile ? this.nativeFile["isNeedCMap"]() : false;
    };
    CFile.prototype.setCMap = function(data)
    {
        if (this.nativeFile)
            this.nativeFile["setCMap"](data);
    };

    CFile.prototype.getPage = function(pageIndex, width, height, isNoUseCacheManager, backgroundColor)
    {
        if (!this.nativeFile)
            return null;
        if (pageIndex < 0 || pageIndex >= this.pages.length || this.pages[pageIndex].originIndex == undefined)
            return null;

        if (!width) width = this.pages[pageIndex].W;
        if (!height) height = this.pages[pageIndex].H;

        var requestW = width;
        var requestH = height;

        if (this.maxCanvasSize > 0)
        {
            if (width > this.maxCanvasSize || height > this.maxCanvasSize)
            {
                var maxKoef = Math.max(width / this.maxCanvasSize, height / this.maxCanvasSize);
                width = (0.5 + (width / maxKoef)) >> 0;
                height = (0.5 + (height / maxKoef)) >> 0;

                if (width > this.maxCanvasSize) width = this.maxCanvasSize;
                if (height > this.maxCanvasSize) height = this.maxCanvasSize;
            }
        }

        var t0 = performance.now();
        var pixels = this.nativeFile["getPagePixmap"](pageIndex, width, height, backgroundColor);
        if (!pixels)
            return null;

        var image = null;
        if (!this.logging)
        {
            image = this._pixelsToCanvas(pixels, width, height, isNoUseCacheManager);
        }
        else
        {
            var t1 = performance.now();
            image = this._pixelsToCanvas(pixels, width, height, isNoUseCacheManager);
            var t2 = performance.now();
            //console.log("time: " + (t1 - t0) + ", " + (t2 - t1));
        }
        this.free(pixels);

        image.requestWidth = requestW;
        image.requestHeight = requestH;
        return image;
    };
    CFile.prototype.addPage = function(pageIndex, pageObj) {
        return this.nativeFile["addPage"](pageIndex, pageObj);
    };
    CFile.prototype.removePage = function(pageIndex) {
        return this.nativeFile["removePage"](pageIndex);
    };
    CFile.prototype.getPageWidth = function(nPage) {
        return this.pages[nPage].W;
    };
    CFile.prototype.getPageHeight = function(nPage) {
        return this.pages[nPage].H;
    };
    CFile.prototype.getLinks = function(pageIndex)
    {
        return this.nativeFile ? this.nativeFile["getLinks"](pageIndex) : [];
    };

    CFile.prototype.getText = function(pageIndex)
    {
        return this.nativeFile ? this.nativeFile["getGlyphs"](pageIndex) : [];
    };

    CFile.prototype.destroyText = function()
    {
        if (this.nativeFile)
            this.nativeFile["destroyTextInfo"]();
    };

    CFile.prototype.getPageBase64 = function(pageIndex, width, height)
	{
		var _canvas = this.getPage(pageIndex, width, height);
		if (!_canvas)
			return "";
		
		try
		{
			return _canvas.toDataURL("image/png");
		}
		catch (err)
		{
		}
		
		return "";
	};
	CFile.prototype.isValid = function()
	{
		return this.pages.length > 0;
	};

	// private functions
	CFile.prototype._pixelsToCanvas2d = function(pixels, width, height, isNoUseCacheManager)
    {        
        var canvas = null;
        if (this.cacheManager && isNoUseCacheManager !== true)
        {
            canvas = this.cacheManager.lock(width, height);
        }
        else
        {
            canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
        }
        
        var ctx = canvas.getContext("2d");
        var mappedBuffer = this.getUint8ClampedArray(pixels, 4 * width * height);
        var imageData = null;
        if (supportImageDataConstructor)
        {
            imageData = new ImageData(mappedBuffer, width, height);
        }
        else
        {
            imageData = ctx.createImageData(width, height);
            imageData.data.set(mappedBuffer, 0);                    
        }
        if (ctx)
            ctx.putImageData(imageData, 0, 0);
        return canvas;
    };

	CFile.prototype._pixelsToCanvas3d = function(pixels, width, height, isNoUseCacheManager) 
    {
        var vs_source = "\
attribute vec2 aVertex;\n\
attribute vec2 aTex;\n\
varying vec2 vTex;\n\
void main() {\n\
	gl_Position = vec4(aVertex, 0.0, 1.0);\n\
	vTex = aTex;\n\
}";

        var fs_source = "\
precision mediump float;\n\
uniform sampler2D uTexture;\n\
varying vec2 vTex;\n\
void main() {\n\
	gl_FragColor = texture2D(uTexture, vTex);\n\
}";
        var canvas = null;
        if (this.cacheManager && isNoUseCacheManager !== true)
        {
            canvas = this.cacheManager.lock(width, height);
        }
        else
        {
            canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
        }

        var gl = canvas.getContext('webgl', { preserveDrawingBuffer : true });
        if (!gl)
            throw new Error('FAIL: could not create webgl canvas context');

        var colorCorrect = gl.BROWSER_DEFAULT_WEBGL;
        gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, colorCorrect);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        if (gl.getError() != gl.NONE)
            throw new Error('FAIL: webgl canvas context setup failed');

        function createShader(source, type) {
            var shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
                throw new Error('FAIL: shader compilation failed');
            return shader;
        }

        var program = gl.createProgram();
        gl.attachShader(program, createShader(vs_source, gl.VERTEX_SHADER));
        gl.attachShader(program, createShader(fs_source, gl.FRAGMENT_SHADER));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
            throw new Error('FAIL: webgl shader program linking failed');
        gl.useProgram(program);

        var texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.getUint8Array(pixels, 4 * width * height));

        if (gl.getError() != gl.NONE)
            throw new Error('FAIL: creating webgl image texture failed');

        function createBuffer(data) {
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
            return buffer;
        }

        var vertexCoords = new Float32Array([-1, 1, -1, -1, 1, -1, 1, 1]);
        var vertexBuffer = createBuffer(vertexCoords);
        var location = gl.getAttribLocation(program, 'aVertex');
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);

        if (gl.getError() != gl.NONE)
            throw new Error('FAIL: vertex-coord setup failed');

        var texCoords = new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]);
        var texBuffer = createBuffer(texCoords);
        var location = gl.getAttribLocation(program, 'aTex');
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);

        if (gl.getError() != gl.NONE)
            throw new Error('FAIL: tex-coord setup setup failed');

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        return canvas;
    };
            
    CFile.prototype._pixelsToCanvas = function(pixels, width, height, isNoUseCacheManager)
    {
        if (!this.isUse3d)
        {
            return this._pixelsToCanvas2d(pixels, width, height, isNoUseCacheManager);
        }

        try
        {
            return this._pixelsToCanvas3d(pixels, width, height, isNoUseCacheManager);
        }
        catch (err)
        {
            this.isUse3d = false;
            if (this.cacheManager)
                this.cacheManager.clear();
            return this._pixelsToCanvas(pixels, width, height, isNoUseCacheManager);
        }
    };

    CFile.prototype.isNeedPassword = function()
    {
        return this.nativeFile ? this.nativeFile["isNeedPassword"]() : false;
    };

    // TEXT
    CFile.prototype.onMouseDown = function(pageIndex, x, y)
    {
        if (this.pages[pageIndex].isConvertedToShapes)
            return;
        
        var ret = this.getNearestPos(pageIndex, x, y);
        var sel = this.Selection;

        sel.Page1  = pageIndex;
        sel.Line1  = ret.Line;
        sel.Word1  = ret.Word;
        sel.Glyph1 = ret.Glyph;

        sel.Page2  = pageIndex;
        sel.Line2  = ret.Line;
        sel.Word2  = ret.Word;
        sel.Glyph2 = ret.Glyph;

        sel.IsSelection = true;
        this.cacheSelectionQuads([]);

        this.onUpdateSelection();
        this.onUpdateOverlay();
    };
    CFile.prototype.removeSelection = function() {
        this.Selection = {
			Page1 : 0,
			Line1 : 0,
            Word1 : 0,
			Glyph1 : 0,

			Page2 : 0,
			Line2 : 0,
            Word2 : 0,
			Glyph2 : 0,
            quads: [],

			IsSelection : false
		}

        this.cacheSelectionQuads([]);
        this.viewer.getPDFDoc().TextSelectTrackHandler.Update();
    };
    CFile.prototype.isSelectionUse = function() {
        return !(this.Selection.Page1  == this.Selection.Page2  && this.Selection.Word1 == this.Selection.Word2 &&
                 this.Selection.Glyph1 == this.Selection.Glyph2 && this.Selection.Line1 == this.Selection.Line2);
    };
    CFile.prototype.sortSelection = function() {
        let sel = this.Selection;
        let Page1 = 0;
        let Page2 = 0;
        let Line1 = 0;
        let Line2 = 0;
        let Word1 = 0;
        let Word2 = 0;
        let Glyph1 = 0;
        let Glyph2 = 0;

        if (sel.Page2 > sel.Page1)
        {
            Page1 = sel.Page1;
            Page2 = sel.Page2;
            Line1 = sel.Line1;
            Line2 = sel.Line2;
            Word1 = sel.Word1;
            Word2 = sel.Word2;
            Glyph1 = sel.Glyph1;
            Glyph2 = sel.Glyph2;
        }
        else if (sel.Page2 < sel.Page1)
        {
            Page1 = sel.Page2;
            Page2 = sel.Page1;
            Line1 = sel.Line2;
            Line2 = sel.Line1;
            Word1 = sel.Word2;
            Word2 = sel.Word1;
            Glyph1 = sel.Glyph2;
            Glyph2 = sel.Glyph1;
        }
        else if (sel.Page1 === sel.Page2)
        {
            Page1 = sel.Page1;
            Page2 = sel.Page2;

            if (sel.Line1 < sel.Line2)
            {
                Line1 = sel.Line1;
                Line2 = sel.Line2;
                Word1 = sel.Word1;
                Word2 = sel.Word2;
                Glyph1 = sel.Glyph1;
                Glyph2 = sel.Glyph2;
            }
            else if (sel.Line2 < sel.Line1)
            {
                Line1 = sel.Line2;
                Line2 = sel.Line1;
                Word1 = sel.Word2;
                Word2 = sel.Word1;
                Glyph1 = sel.Glyph2;
                Glyph2 = sel.Glyph1;
            }
            else
            {
                Line1 = sel.Line1;
                Line2 = sel.Line2;

                if (sel.Word1 < sel.Word2)
                {
                    Word1 = sel.Word1;
                    Word2 = sel.Word2;
                    Glyph1 = sel.Glyph1;
                    Glyph2 = sel.Glyph2;
                }
                else if (sel.Word2 < sel.Word1)
                {
                    Word1 = sel.Word2;
                    Word2 = sel.Word1;
                    Glyph1 = sel.Glyph2;
                    Glyph2 = sel.Glyph1;
                }
                else
                {
                    Word1 = sel.Word1;
                    Word2 = sel.Word2;

                    if (-1 === sel.Glyph1)
                    {
                        Glyph1 = sel.Glyph2;
                        Glyph2 = sel.Glyph1;
                    }
                    else if (-1 === sel.Glyph2)
                    {
                        Glyph1 = sel.Glyph1;
                        Glyph2 = sel.Glyph2;
                    }
                    else if (sel.Glyph1 < sel.Glyph2)
                    {
                        Glyph1 = sel.Glyph1;
                        Glyph2 = sel.Glyph2;
                    }
                    else
                    {
                        Glyph1 = sel.Glyph2;
                        Glyph2 = sel.Glyph1;
                    }
                }
            }
        }
        return { Page1, Page2, Line1, Line2, Word1, Word2, Glyph1, Glyph2 };
    };
    CFile.prototype.getSelection = function() {
        return this.Selection;
    };

    CFile.prototype.onMouseMove = function(pageIndex, x, y)
    {
        if (false === this.Selection.IsSelection)
            return;

        var ret = this.getNearestPos(pageIndex, x, y);
        var sel = this.Selection;

        sel.Page2  = pageIndex;
        sel.Line2  = ret.Line;
        sel.Word2  = ret.Word;
        sel.Glyph2 = ret.Glyph;

        this.onUpdateOverlay();
    };

    CFile.prototype.onMouseUp = function()
    {
        this.Selection.IsSelection = false;
        this.viewer.getPDFDoc().TextSelectTrackHandler.Update(true);
        this.onUpdateSelection();
        this.onUpdateOverlay();

        if (this.viewer.Api.isMarkerFormat) {
            let oDoc    = this.viewer.getPDFDoc();
            let oViewer = this.viewer;
            let oColor  = oDoc.GetMarkerColor(oViewer.Api.curMarkerType);

            oDoc.DoAction(function() {
                switch (oViewer.Api.curMarkerType) {
                    case AscPDF.ANNOTATIONS_TYPES.Highlight:
                        oViewer.Api.SetHighlight(oColor.r, oColor.g, oColor.b, oColor.a);
                        break;
                    case AscPDF.ANNOTATIONS_TYPES.Underline:
                        oViewer.Api.SetUnderline(oColor.r, oColor.g, oColor.b, oColor.a);
                        break;
                    case AscPDF.ANNOTATIONS_TYPES.Strikeout:
                        oViewer.Api.SetStrikeout(oColor.r, oColor.g, oColor.b, oColor.a);
                        break;
                }
            }, AscDFH.historydescription_Pdf_AddHighlightAnnot);
        }
    };

    CFile.prototype.getPageText = function(pageIndex)
    {
        return this.pages[pageIndex].text;
    };

    CFile.prototype.getNearestPos = function(pageIndex, x, y, bExcludeSpaces)
    {
        let oText = this.getPageText(pageIndex);
        if (!oText)
            return { Line : -1, Word : -1, Glyph : -1 };

        let _minDist = 0xFFFFFF;

        let _line  = -1;
        let _word  = -1;
        let _glyph = -1;

        for (let iLine = 0; iLine < oText.length; ++iLine)
        {
            let oLine = oText[iLine];
            if (oLine.Ex == 1 && oLine.Ey == 0)
            {
                let _distX = x - oLine.X;
                if (y >= (oLine.Y - oLine.Ascent) && y <= (oLine.Y + oLine.Descent) && _distX >= 0 && _distX <= oLine.Width)
                { // попали внутрь линии
                    _line = iLine;
                    for (let iWord = 0; iWord < oLine.Words.length; ++iWord)
                    {
                        let oWord = oLine.Words[iWord];
                        let dWordX2 = oWord.X + oWord.Width;
                        if (_distX >= oWord.X && _distX <= dWordX2)
                        { // если слова перекрывают друг друга то выделение происходит по порядку следования
                            _word = iWord;
                            if (bExcludeSpaces && oWord.IsSpace)
                            {
                                _glyph = 0;
                                let bRightCloser = dWordX2 - _distX < _distX - oWord.X;
                                if (bRightCloser && iWord + 1 < oLine.Words.length)
                                    _word = iWord + 1;
                                else if (iWord - 1 > 0)
                                {
                                    _word = iWord - 1;
                                    _glyph = oLine.Words[_word].Chars.length - 1;
                                }
                                return { Line : _line, Word : _word, Glyph : _glyph };
                            }

                            for (_glyph = 1; _glyph < oWord.Chars.length; ++_glyph)
                            { // если символы перекрывают друг друга то текущий выделяется по пересечении начала следующего
                                let oChar = oWord.Chars[_glyph];
                                if (oChar.X > _distX)
                                    break;
                            }
                            return { Line : _line, Word : _word, Glyph : --_glyph };
                        }
                    }
                }

                let tmp = Math.abs(y - oLine.Y);
                if (_distX >= 0 && _distX <= oLine.Width)
                    tmp = Math.abs(y - oLine.Y);
                else if (_distX < 0)
                    tmp = Math.sqrt((x - oLine.X) * (x - oLine.X) + (y - oLine.Y) * (y - oLine.Y));
                else
                {
                    let _xx1 = oLine.X + oLine.Width;
                    tmp = Math.sqrt((x - _xx1) * (x - _xx1) + (y - oLine.Y) * (y - oLine.Y));
                }

                if (tmp < _minDist)
                {
                    _minDist = tmp;
                    _line = iLine;

                    if (_distX < 0)
                    {
                        _word = 0;
                        _glyph = -2;
                    }
                    else if (_distX > oLine.Width)
                    {
                        _word = oLine.Words.length - 1;
                        _glyph = -1;
                    }
                    else
                    {
                        for (let iWord = 0; iWord < oLine.Words.length; ++iWord)
                        {
                            let oWord = oLine.Words[iWord];
                            let dWordX2 = oWord.X + oWord.Width;
                            if (_distX >= oWord.X && _distX <= dWordX2)
                            {
                                _word = iWord;
                                for (_glyph = 1; _glyph < oWord.Chars.length; ++_glyph)
                                { // если символы перекрывают друг друга то текущий выделяется по пересечении начала следующего
                                    let oChar = oWord.Chars[_glyph];
                                    if (oChar.X > _distX)
                                        break;
                                }
                                --_glyph;
                                break;
                            }
                        }
                    }
                }
                // Ничего не надо делать, уже найдена более "ближняя" линия
            }
            else
            {
                // определяем точки descent линии
                let ortX = -oLine.Ey;
                let ortY = oLine.Ex;

                let _dx = oLine.X + ortX * oLine.Descent;
                let _dy = oLine.Y + ortY * oLine.Descent;

                // теперь проекции (со знаком) на линию descent
                let h = -((x - _dx) * ortX + (y - _dy) * ortY);
                let w = (x - _dx) * oLine.Ex + (y - _dy) * oLine.Ey;

                if (w >= 0 && w <= oLine.Width && h >= 0 && h <= (oLine.Descent + oLine.Ascent))
                { // попали внутрь линии
                    _line = iLine;
                    for (let iWord = 0; iWord < oLine.Words.length; ++iWord)
                    {
                        let oWord = oLine.Words[iWord];
                        let dWordX2 = oWord.X + oWord.Width;
                        if (w >= oWord.X && w <= dWordX2)
                        {
                            _word = iWord;
                            for (_glyph = 1; _glyph < oWord.Chars.length; ++_glyph)
                            {
                                let oChar = oWord.Chars[_glyph];
                                if (oChar.X > w)
                                    break;
                            }
                            return { Line : _line, Word : _word, Glyph : --_glyph };
                        }
                    }
                }

                let tmp = 0;
                if (w >= 0 && w <= oLine.Width)
                    tmp = Math.abs(h - oLine.Descent);
                else if (w < 0)
                    tmp = Math.sqrt((x - oLine.X) * (x - oLine.X) + (y - oLine.Y) * (y - oLine.Y));
                else
                {
                    let _tmpX = oLine.X + oLine.Width * oLine.Ex;
                    let _tmpY = oLine.Y + oLine.Width * oLine.Ey;
                    tmp = Math.sqrt((x - _tmpX) * (x - _tmpX) + (y - _tmpY) * (y - _tmpY));
                }

                if (tmp < _minDist)
                {
                    _minDist = tmp;
                    _line = iLine;

                    if (w < 0)
                    {
                        _word = 0;
                        _glyph = -2;
                    }
                    else if (w > oLine.Width)
                    {
                        _word = oLine.Words.length - 1;
                        _glyph = -1;
                    }
                    else
                    {
                        for (let iWord = 0; iWord < oLine.Words.length; ++iWord)
                        {
                            let oWord = oLine.Words[iWord];
                            let dWordX2 = oWord.X + oWord.Width;
                            if (w >= oWord.X && w <= dWordX2)
                            {
                                _word = iWord;
                                for (_glyph = 1; _glyph < oWord.Chars.length; ++_glyph)
                                {
                                    let oChar = oWord.Chars[_glyph];
                                    if (oChar.X > w)
                                        break;
                                }
                                --_glyph;
                            }
                        }
                    }
                }
                // Ничего не надо делать, уже найдена более "ближняя" линия
            }
        }
        return { Line : _line, Word : _word, Glyph : _glyph };
    };
    CFile.prototype.selectWholeWord = function(pageIndex, x, y) {
        var oNearesPos = this.getNearestPos(pageIndex, x, y, true);
        if (oNearesPos.Glyph < 0)
            return;

        let oSelectionInfo = {
            Glyph1: -2,
            Glyph2: -1,
            IsSelection: true,
            Word1: oNearesPos.Word,
            Word2: oNearesPos.Word,
            Line1: oNearesPos.Line,
            Line2: oNearesPos.Line,
            Page1: pageIndex,
            Page2: pageIndex,
            quads: []
        }

        let oText = this.getPageText(pageIndex);
        let oWord = oText[oNearesPos.Line].Words[oNearesPos.Word];
        if (oWord.IsSpace && oNearesPos.Word - 1 >= 0)
        {
            oSelectionInfo.Word1 = oNearesPos.Word - 1;
            oSelectionInfo.Word2 = oNearesPos.Word - 1;
        }
        
        this.Selection = oSelectionInfo;
        this.onUpdateOverlay();
    };
    CFile.prototype.selectWholeRow = function(pageIndex, x, y) {
        var oNearesPos = this.getNearestPos(pageIndex, x, y, true);

        let oText = this.getPageText(pageIndex);
        let oSelectionInfo = {
            Glyph1: -2,
            Glyph2: -1,
            IsSelection: true,
            Word1: 0,
            Word2: oText[oNearesPos.Line].Words.length - 1,
            Line1: oNearesPos.Line,
            Line2: oNearesPos.Line,
            Page1: pageIndex,
            Page2: pageIndex,
            quads: []
        }

        this.Selection = oSelectionInfo;
        this.onUpdateOverlay();
    };
    CFile.prototype.cacheSelectionQuads = function(aQuads) {
        this.Selection.quads = aQuads;
    };
    CFile.prototype.getSelectionQuads = function() {
        let aInfo = [];
        
        if (false == this.isSelectionUse()) {
            this.cacheSelectionQuads(aInfo);
            return aInfo;
        }
        else if (this.Selection.quads.length != 0)
            return this.Selection.quads;
        
        const { Page1, Page2, Line1, Line2, Word1, Word2, Glyph1, Glyph2 } = this.sortSelection();

        for (let iPage = Page1; iPage <= Page2; ++iPage)
        {
            if (this.pages[iPage].isConvertedToShapes)
                continue;

            let oText = this.getPageText(iPage);
            if (!oText)
                continue;

            let oInfo = { page: iPage, quads: [] };
            let dKoefX = (this.pages[iPage].Dpi / 25.4);
            let dKoefY = (this.pages[iPage].Dpi / 25.4);

            let startLine = iPage == Page1 ? Line1 : 0;
            let endLine   = iPage == Page2 ? Line2 : oText.length - 1;
            
            for (let iLine = startLine; iLine <= endLine; ++iLine)
            {
                let oLine = oText[iLine];
                let words = oLine.Words;

                let isStartLine = iPage == Page1 && iLine == Line1;
                let isEndLine   = iPage == Page2 && iLine == Line2;

                let startWord = isStartLine ? Word1 : 0;
                let endWord   = isEndLine   ? Word2 : words.length - 1;

                let startChar = isStartLine ? Glyph1 : -2;
                let endChar   = isEndLine   ? Glyph2 : -1;

                let off1 = 0;
                let off2 = 0;

                if (startChar == -2)
                    off1 = words[startWord].X;
                else if (startChar == -1)
                    off1 = words[startWord].X + words[startWord].Width;
                else
                    off1 = words[startWord].Chars[startChar].X;

                if (endChar == -2)
                    off2 = words[endWord].X;
                else if (endChar == -1)
                    off2 = words[endWord].X + words[endWord].Width;
                else
                    off2 = words[endWord].Chars[endChar].X;

                if (off2 <= off1)
                    continue;

                // в принципе код один и тот же. Но почти всегда линии горизонтальные.
                // а для горизонтальной линии все можно пооптимизировать
                if (oLine.Ex == 1 && oLine.Ey == 0)
                {
                    let _x = (dKoefX * (oLine.X + off1));
                    let _r = (dKoefX * (oLine.X + off2));
                    let _y = (dKoefY * (oLine.Y - oLine.Ascent));
                    let _b = (dKoefY * (oLine.Y + oLine.Descent));

                    oInfo.quads.push([_x,_y,_r,_y,_x,_b,_r,_b]);
                }
                else
                {
                    // определяем точки descent линии
                    let ortX = -oLine.Ey;
                    let ortY = oLine.Ex;

                    let _dx = oLine.X + ortX * oLine.Descent;
                    let _dy = oLine.Y + ortY * oLine.Descent;

                    let _x1 = _dx + off1 * oLine.Ex;
                    let _y1 = _dy + off1 * oLine.Ey;

                    let _x2 = _x1 - ortX * (oLine.Ascent + oLine.Descent);
                    let _y2 = _y1 - ortY * (oLine.Ascent + oLine.Descent);

                    let _x3 = _x2 + (off2 - off1) * oLine.Ex;
                    let _y3 = _y2 + (off2 - off1) * oLine.Ey;

                    let _x4 = _x3 + ortX * (oLine.Ascent + oLine.Descent);
                    let _y4 = _y3 + ortY * (oLine.Ascent + oLine.Descent);

                    _x1 = (dKoefX * _x1);
                    _x2 = (dKoefX * _x2);
                    _x3 = (dKoefX * _x3);
                    _x4 = (dKoefX * _x4);

                    _y1 = (dKoefY * _y1);
                    _y2 = (dKoefY * _y2);
                    _y3 = (dKoefY * _y3);
                    _y4 = (dKoefY * _y4);

                    oInfo.quads.push([_x2,_y2, _x3,_y3, _x1,_y1, _x4,_y4]);
                }
            }

            if (oInfo.quads.length > 0)
                aInfo.push(oInfo);
        }
        
        this.cacheSelectionQuads(aInfo);
        return aInfo;
    };
    CFile.prototype.drawSelection = function(pageIndex, overlay, x, y)
    {
        if (this.pages[pageIndex].isConvertedToShapes)
            return;
        
        let oText = this.getPageText(pageIndex);
        if (!oText)
            return;

        const { Page1, Page2, Line1, Line2, Word1, Word2, Glyph1, Glyph2 } = this.sortSelection();

        if (Page1 > pageIndex || Page2 < pageIndex)
            return;

        let width = AscCommon.AscBrowser.convertToRetinaValue(this.viewer.drawingPages[pageIndex].W, true) >> 0;
        let height = AscCommon.AscBrowser.convertToRetinaValue(this.viewer.drawingPages[pageIndex].H, true) >> 0;

        let dKoefX = width  / this.pages[pageIndex].W;
        let dKoefY = height / this.pages[pageIndex].H;
        dKoefX *= (this.pages[pageIndex].Dpi / 25.4);
        dKoefY *= (this.pages[pageIndex].Dpi / 25.4);

        let startLine = pageIndex == Page1 ? Line1 : 0;
        let endLine   = pageIndex == Page2 ? Line2 : oText.length - 1;

        for (let iLine = startLine; iLine <= endLine; ++iLine)
        {
            let oLine = oText[iLine];
            let words = oLine.Words;

            let isStartLine = pageIndex == Page1 && iLine == Line1;
            let isEndLine   = pageIndex == Page2 && iLine == Line2;

            let startWord = isStartLine ? Word1 : 0;
            let endWord   = isEndLine   ? Word2 : words.length - 1;

            let startChar = isStartLine ? Glyph1 : -2;
            let endChar   = isEndLine   ? Glyph2 : -1;

            let off1 = 0;
            let off2 = 0;

            if (startChar == -2)
                off1 = words[startWord].X;
            else if (startChar == -1)
                off1 = words[startWord].X + words[startWord].Width;
            else
                off1 = words[startWord].Chars[startChar].X;

            if (endChar == -2)
                off2 = words[endWord].X;
            else if (endChar == -1)
                off2 = words[endWord].X + words[endWord].Width;
            else
                off2 = words[endWord].Chars[endChar].X;

            if (off2 <= off1)
                continue;

            // в принципе код один и тот же. Но почти всегда линии горизонтальные.
            // а для горизонтальной линии все можно пооптимизировать
            if (oLine.Ex == 1 && oLine.Ey == 0)
            {
                let _x = (x + dKoefX * (oLine.X + off1));
                let _r = (x + dKoefX * (oLine.X + off2));
                let _y = (y + dKoefY * (oLine.Y - oLine.Ascent));
                let _b = (y + dKoefY * (oLine.Y + oLine.Descent));

                overlay.CheckPoint(_x, _y);
                overlay.CheckPoint(_r, _b);

                overlay.m_oContext.rect(_x,_y,_r-_x,_b-_y);
            }
            else
            {
                // определяем точки descent линии
                let ortX = -oLine.Ey;
                let ortY = oLine.Ex;

                let _dx = oLine.X + ortX * oLine.Descent;
                let _dy = oLine.Y + ortY * oLine.Descent;

                let _x1 = _dx + off1 * oLine.Ex;
                let _y1 = _dy + off1 * oLine.Ey;

                let _x2 = _x1 - ortX * (oLine.Ascent + oLine.Descent);
                let _y2 = _y1 - ortY * (oLine.Ascent + oLine.Descent);

                let _x3 = _x2 + (off2 - off1) * oLine.Ex;
                let _y3 = _y2 + (off2 - off1) * oLine.Ey;

                let _x4 = _x3 + ortX * (oLine.Ascent + oLine.Descent);
                let _y4 = _y3 + ortY * (oLine.Ascent + oLine.Descent);

                _x1 = (x + dKoefX * _x1);
                _x2 = (x + dKoefX * _x2);
                _x3 = (x + dKoefX * _x3);
                _x4 = (x + dKoefX * _x4);

                _y1 = (y + dKoefY * _y1);
                _y2 = (y + dKoefY * _y2);
                _y3 = (y + dKoefY * _y3);
                _y4 = (y + dKoefY * _y4);

                overlay.CheckPoint(_x1, _y1);
                overlay.CheckPoint(_x2, _y2);
                overlay.CheckPoint(_x3, _y3);
                overlay.CheckPoint(_x4, _y4);

                let ctx = overlay.m_oContext;
                ctx.moveTo(_x1, _y1);
                ctx.lineTo(_x2, _y2);
                ctx.lineTo(_x3, _y3);
                ctx.lineTo(_x4, _y4);
                ctx.closePath();
            }
        }
    };

    CFile.prototype.copySelection = function(pageIndex, _text_format)
    {
        if (!this.isSelectionUse())
            return "";
        let oText = this.getPageText(pageIndex);
        if (!oText)
            return "";

        const { Page1, Page2, Line1, Line2, Word1, Word2, Glyph1, Glyph2 } = this.sortSelection();

        if (Page1 > pageIndex || Page2 < pageIndex)
            return "";

        let ret = "";

        let startLine = pageIndex == Page1 ? Line1 : 0;
        let endLine   = pageIndex == Page2 ? Line2 : oText.length - 1;

        for (let iLine = startLine; iLine <= endLine; ++iLine)
        {
            let oLine = oText[iLine];
            let words = oLine.Words;

            let isStartLine = pageIndex == Page1 && iLine == Line1;
            let isEndLine   = pageIndex == Page2 && iLine == Line2;

            let startWord = isStartLine ? Word1 : 0;
            let endWord   = isEndLine   ? Word2 : words.length - 1;

            let startChar = isStartLine ? Glyph1 : -2;
            let endChar   = isEndLine   ? Glyph2 : -1;

            let textLine = "<p><span>";

            for (let iWord = startWord; iWord <= endWord; ++iWord)
            {
                let oWord = words[iWord];
                let chars = oWord.Chars;

                let wordStartChar = iWord == startWord ? startChar : -2;
                let wordEndChar   = iWord == endWord   ? endChar   : -1;

                if (wordStartChar == -2)
                    wordStartChar = 0;
                else if (wordStartChar == -1)
                    continue;
                if (wordEndChar == -2)
                    wordEndChar = 0;
                if (wordEndChar == -1)
                    wordEndChar = chars.length;

                for (let iChar = wordStartChar; iChar < wordEndChar; ++iChar)
                {
                    let _char = chars[iChar].Char;
                    _char = _char == 0xFFFF ? ' ' : String.fromCodePoint(_char);
                    textLine += _char;

                    if (_text_format)
                        _text_format.Text += _char;
                }
            }

            textLine += "</span></p>";

            if (_text_format)
                _text_format.Text += "\n";

            ret += textLine;
        }
        return ret;
    };

    CFile.prototype.copy = function(_text_format)
    {
        let sel = this.Selection;
        let page1 = sel.Page1;
        let page2 = sel.Page2;

        if (page2 < page1)
        {
            page1 = page2;
            page2 = sel.Page1;
        }

        let ret = "<div>";
        for (let i = page1; i <= page2; ++i)
        {
            if (this.pages[i].isConvertedToShapes)
                continue;

            ret += this.copySelection(i, _text_format);
        }
        ret += "</div>";

        return ret;
    };

    CFile.prototype.selectAll = function()
    {
        this.removeSelection();
        let sel = this.Selection;
        
        let pagesCount = this.pages.length;
        if (0 != pagesCount)
        {
            let oText = this.getPageText(pagesCount - 1);
            if (!oText)
                return;

            sel.Glyph1 = -2;
            sel.Page2 = pagesCount - 1;
            sel.Line2 = oText.length - 1;
            sel.Word2 = oText[sel.Line2].Words.length - 1;
            sel.Glyph2 = -1;
        }

        this.onUpdateSelection();
        this.onUpdateOverlay();
        this.viewer.getPDFDoc().TextSelectTrackHandler.Update();
    };

    CFile.prototype.onUpdateOverlay = function()
    {
        this.viewer.onUpdateOverlay();
    };

    CFile.prototype.onUpdateSelection = function()
    {
        if (this.viewer.Api)
            this.viewer.Api.sendEvent("asc_onSelectionEnd");
    };

    // SEARCH
    CFile.prototype.startSearch = function(text)
    {
        this.viewer.StartSearch();

        this.SearchInfo.Text = text;
        this.SearchInfo.Page = 0;

        var oThis = this;
        this.SearchInfo.Id = setTimeout(function(){oThis.onSearchPage();}, 1);
    };
    CFile.prototype.onSearchPage = function()
    {
        this.SearchPage(this.SearchInfo.Page, this.SearchInfo.Text);
        this.SearchInfo.Page++;

        if (this.SearchInfo.Page >= this.pages.length)
        {
            this.stopSearch();
            return;
        }

        var oThis = this;
        this.SearchInfo.Id = setTimeout(function(){oThis.onSearchPage();}, 1);
    };
    CFile.prototype.stopSearch = function()
    {
        if (null != this.SearchInfo.Id)
        {
            clearTimeout(this.SearchInfo.Id);
            this.SearchInfo.Id = null;
        }
        this.viewer.EndSearch(false);
    };
    

    // класс элемента совпадения при поиске на странице
    function PdfPageMatch() {
        Array.apply(null, arguments);
        
        this.pdfPageMatch = true;
    }


    PdfPageMatch.prototype = Object.create(Array.prototype);
    PdfPageMatch.prototype.constructor = PdfPageMatch;

    PdfPageMatch.prototype.Get_AbsolutePage = function() {
        if (this[0])
            return this[0].PageNum;
        return -1;
    };
    PdfPageMatch.prototype.GetTextFromLine = function(oText, Line, Word1, Word2, Char1, Char2)
    {
        let textLine = "";
        if (Word1 == Word2 && Char1 == Char2)
            return textLine;

        let words = oText[Line]["Words"];
        for (let iWord = Word1; iWord <= Word2; ++iWord)
        {
            let oWord = words[iWord];
            let chars = oWord.Chars;

            let wordStartChar = iWord == Word1 ? Char1 : -2;
            let wordEndChar   = iWord == Word2 ? Char2 : -1;

            if (wordStartChar == -2)
                wordStartChar = 0;
            else if (wordStartChar == -1)
                continue;
            if (wordEndChar == -2)
                wordEndChar = 0;
            if (wordEndChar == -1)
                wordEndChar = chars.length;

            for (let iChar = wordStartChar; iChar < wordEndChar; ++iChar)
            {
                let _char = chars[iChar]["Char"];
                _char = _char == 0xFFFF ? ' ' : String.fromCodePoint(_char);
                textLine += _char;
            }
        }
        return textLine;
    };
    PdfPageMatch.prototype.GetTextAroundSearchResult = function(nId) {
        let oDoc            = Asc.editor.getPDFDoc();
        let oSearchEngine   = oDoc.SearchEngine;

        let aMatches = oSearchEngine.Elements[nId];

        let aResult = ["", "", ""];
        // найденный текст может быть разбит на части (строки)
        for (let nPart = 0; nPart < aMatches.length; nPart++) {
            let oPart = aMatches[nPart];
            // знаем в какой строке было найдено совпадение
            let oLine = oSearchEngine.PagesLines[oPart.PageNum][oPart.LineNum];

            if (nPart == 0 && aMatches.length == 1) {
                aResult[0] = this.GetTextFromLine(oSearchEngine.PagesLines[oPart.PageNum],
                    oPart.LineNum, 0, oPart.Word1, 0, oPart.Char1);
                aResult[1] = oPart.Text;
                aResult[2] = this.GetTextFromLine(oSearchEngine.PagesLines[oPart.PageNum],
                    oPart.LineNum, oPart.Word2, oLine["Words"].length - 1, oPart.Char2, -1);
            }
            else if (nPart == 0) {
                aResult[0] = this.GetTextFromLine(oSearchEngine.PagesLines[oPart.PageNum],
                    oPart.LineNum, 0, oPart.Word1, 0, oPart.Char1);
                aResult[1] = oPart.Text;
            }
            else if (nPart == aMatches.length - 1) {
                aResult[1] += oPart.Text;
                aResult[2] = this.GetTextFromLine(oSearchEngine.PagesLines[oPart.PageNum],
                    oPart.LineNum, oPart.Word2, oLine["Words"].length - 1, oPart.Char2, -1);
            }
            else {
                aResult[1] += oPart.Text;
            }
        }

        return aResult;
    };

    CFile.prototype.searchPage = function(pageIndex)
    {
        let oDoc          = Asc.editor.getPDFDoc();
        let oSearchEngine = oDoc.SearchEngine;
        let oResult = {
            matches:    [],
            pageLines:  []
        };

        let searchText = oSearchEngine.Text;
        let textLength = searchText.length;
        if (0 == textLength)
            return oResult;

        let oText = this.getPageText(pageIndex);
        if (!oText)
            return oResult;
        
        if (!oSearchEngine.MatchCase)
            searchText = searchText.toLowerCase();

        oResult.pageLines = oText;

        let oMatch = {};
        let posInText = 0;
        if (searchText[posInText] == ' ')
        {
            for (let i = posInText; i < searchText.length; ++i)
            {
                if (searchText[i] == ' ')
                    posInText++;
                else
                    break;
            }
        }
        let PosStartText = posInText;

        for (let iLine = 0; iLine < oText.length; ++iLine)
        {
            if (searchText[posInText] == ' ')
            {
                for (let i = posInText; i < searchText.length; ++i)
                {
                    if (searchText[i] == ' ')
                        posInText++;
                    else
                        break;
                }
            }

            let oLine = oText[iLine];
            let words = oLine["Words"];
            let ignoreFirstSpace = true;

            for (let iWord = 0; iWord < words.length; ++iWord)
            {
                let oWord = words[iWord];
                if (ignoreFirstSpace && oWord["IsSpace"])
                    continue;
                ignoreFirstSpace = false;
                let chars = oWord["Chars"];

                if (oSearchEngine.Word)
                {
                    let wordText = chars.map(char => String.fromCodePoint(char["Char"])).join("");
                    let processedWordText = oSearchEngine.MatchCase ? wordText : wordText.toLowerCase();

                    if (processedWordText == searchText)
                    {
                        let rects = new PdfPageMatch();
                        rects.push({
                            PageNum : pageIndex,
                            LineNum: iLine,
                            Word1: iWord,
                            Word2: iWord,
                            Char1: -2,
                            Char2: -1,
                            X : oLine["X"] + oLine["Ascent"] * oLine["Ey"] + oWord["X"] * oLine["Ex"],
                            Y : oLine["Y"] - oLine["Ascent"] * oLine["Ex"] + oWord["X"] * oLine["Ey"],
                            W : oWord["Width"],
                            H : oLine["Ascent"] + oLine["Descent"],
                            Ex : oLine["Ex"],
                            Ey : oLine["Ey"],
                            Text: processedWordText
                        });
                        oResult.matches.push(rects);
                    }
                    continue;
                }

                for (let iChar = 0; iChar < chars.length; ++iChar)
                {
                    let nChar = chars[iChar]["Char"];
                    if (nChar == 0xFFFF)
                        nChar = 32;

                    let cChar = String.fromCodePoint(nChar);
                    if (!oSearchEngine.MatchCase)
                        cChar = cChar.toLowerCase();

                    if (searchText[posInText] != cChar)
                    {
                        if (oMatch.Line != undefined)
                        { // Возвращаемся к началу совпадения
                            iLine = oMatch.Line;
                            iWord = oMatch.Word;
                            iChar = oMatch.Char;
                            oMatch = {};
                            posInText = PosStartText;

                            oLine = oText[iLine];
                            words = oLine["Words"];
                            oWord = words[iWord];
                            chars = oWord["Chars"];
                        }
                        continue;
                    }

                    if (posInText == PosStartText)
                    { // Начало совпадения
                        oMatch.Line = iLine;
                        oMatch.Word = iWord;
                        oMatch.Char = iChar;
                    }

                    if (++posInText == searchText.length)
                    { // Полное совпадение
                        let rects = new PdfPageMatch();
                        // Добавление всех областей совпадения от oMatch до текущего
                        if (++iChar == chars.length)
                            iChar = -1;
                        GetMatches(rects, oMatch, iLine, iWord, iChar);
                        oResult.matches.push(rects);
                        // Возвращаемся к началу совпадения
                        iLine = oMatch.Line;
                        iWord = oMatch.Word;
                        iChar = oMatch.Char;
                        oMatch = {};
                        posInText = PosStartText;

                        oLine = oText[iLine];
                        words = oLine["Words"];
                        oWord = words[iWord];
                        chars = oWord["Chars"];
                    }
                }
            }
        }

        function GetMatches(rects, oMatch, curLine, curWord, curChar)
        {
            for (let iLine = oMatch.Line; iLine <= curLine; ++iLine)
            {
                let oLine = oText[iLine];
                let words = oLine["Words"];

                let isStartLine = iLine == oMatch.Line;
                let isEndLine   = iLine == curLine;

                let startWord = isStartLine ? oMatch.Word : 0;
                let endWord   = isEndLine   ? curWord : words.length - 1;

                let startChar = isStartLine ? oMatch.Char : -2;
                let endChar   = isEndLine   ? curChar : -1;

                let off1 = 0;
                let off2 = 0;

                if (startChar == -2)
                    off1 = words[startWord].X;
                else if (startChar == -1)
                    off1 = words[startWord].X + words[startWord].Width;
                else
                    off1 = words[startWord].Chars[startChar].X;

                if (endChar == -2)
                    off2 = words[endWord].X;
                else if (endChar == -1)
                    off2 = words[endWord].X + words[endWord].Width;
                else
                    off2 = words[endWord].Chars[endChar].X;

                if (off2 <= off1)
                    continue;

                rects.push({
                    PageNum : pageIndex,
                    LineNum: iLine,
                    Word1: startWord,
                    Word2: endWord,
                    Char1: startChar,
                    Char2: endChar,
                    X : oLine["X"] + oLine["Ascent"] * oLine["Ey"] + off1 * oLine["Ex"],
                    Y : oLine["Y"] - oLine["Ascent"] * oLine["Ex"] + off1 * oLine["Ey"],
                    W : off2 - off1,
                    H : oLine["Ascent"] + oLine["Descent"],
                    Ex : oLine["Ex"],
                    Ey : oLine["Ey"],
                    Text: rects.GetTextFromLine(oText, iLine, startWord, endWord, startChar, endChar)
                });
            }
        }

        return oResult;
    };

    window["AscViewer"] = window["AscViewer"] || {};

    window["AscViewer"]["baseUrl"] = (typeof document !== 'undefined' && document.currentScript) ? "" : "./../src/engine/";
    window["AscViewer"]["baseEngineUrl"] = "./../src/engine/";

    window["AscViewer"].createFile = function(data)
    {
        var file = new CFile();
        file.nativeFile = new window["AscViewer"]["CDrawingFile"]();
        var error = file.nativeFile["loadFromData"](data);
        if (0 === error)
        {
            file.nativeFile["onRepaintPages"] = function(pages) {
                file.onRepaintPages && file.onRepaintPages(pages);
            };
            file.nativeFile["onRepaintAnnotations"] = function(pages) {
                file.onRepaintAnnotations && file.onRepaintAnnotations(pages);
            };
            file.nativeFile["onRepaintForms"] = function(pages) {
                file.onRepaintForms && file.onRepaintForms(pages);
            };

            file.nativeFile["onUpdateStatistics"] = function(par, word, symbol, space) {
                file.onUpdateStatistics && file.onUpdateStatistics(par, word, symbol, space);
            };
            file.nativeFile["isPunctuation"] = function(unicode) {
                return AscCommon.g_aPunctuation[unicode];
            };
            file.pages = file.nativeFile["getPages"]();

            for (var i = 0, len = file.pages.length; i < len; i++)
            {
                var page = file.pages[i];
                
                page.W              = page["W"];
                page.H              = page["H"];
                page.Dpi            = page["Dpi"];
                page.originIndex    = page["originIndex"]; // исходный индекс в файле
                page.originRotate   = page["Rotate"];
                page.Rotate         = page["Rotate"];
            }
            file.originalPagesCount = file.pages.length;

            //file.cacheManager = new AscCommon.CCacheManager();
            return file;   
        }
        else if (4 === error)
        {
            return file;
        }
        
        file.close();
        return null;
    };
    window["AscViewer"].setFilePassword = function(file, password)
    {
        var error = file.nativeFile["loadFromDataWithPassword"](password);
        if (0 === error)
        {
            file.nativeFile["onRepaintPages"] = function(pages) {
                file.onRepaintPages && file.onRepaintPages(pages);
            };
            file.nativeFile["onUpdateStatistics"] = function(par, word, symbol, space) {
                file.onUpdateStatistics && file.onUpdateStatistics(par, word, symbol, space);
            };
            file.nativeFile["isPunctuation"] = function(unicode) {
                return AscCommon.g_aPunctuation[unicode];
            };
            file.pages = file.nativeFile["getPages"]();

            for (var i = 0, len = file.pages.length; i < len; i++)
            {
                var page = file.pages[i];
                page.W              = page["W"];
                page.H              = page["H"];
                page.Dpi            = page["Dpi"];
                page.originIndex    = page["originIndex"]; // исходный индекс в файле
                page.originRotate   = page["Rotate"];
                page.Rotate         = page["Rotate"];
            }
            file.originalPagesCount = file.pages.length;
            
            //file.cacheManager = new AscCommon.CCacheManager();
        }
    };
	window["AscViewer"].createEmptyFile = function()
	{
		return new CFile();
	};

    //--------------------------------------------------------export----------------------------------------------------
	window['AscPDF'].PdfPageMatch = PdfPageMatch;

})(window, undefined);
