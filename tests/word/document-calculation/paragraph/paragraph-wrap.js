/*
 * (c) Copyright Ascensio System SIA 2010-2025
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

$(function () {
	
	let logicDocument = AscTest.CreateLogicDocument();
	
	const charWidth = AscTest.CharWidth * AscTest.FontSize;
	
	const L_FIELD = 20 * charWidth;
	const R_FIELD = 20 * charWidth;
	const PAGE_W  = 100 * charWidth;

	
	function addFlowImageToParagraph(p, w, h, x, y)
	{
		let d = AscTest.CreateImage(w, h);
		let run = new AscWord.CRun();
		p.AddToContent(0, run);
		run.AddToContent(0, d);
		
		d.Set_DrawingType(drawing_Anchor);
		d.Set_Distance(0, 0, 0, 0);
		d.Set_WrappingType(WRAPPING_TYPE_SQUARE);
		d.Set_PositionH(Asc.c_oAscRelativeFromH.Page, false, x);
		d.Set_PositionV(Asc.c_oAscRelativeFromV.Page, false, y);
		return d;
	}
	
	function initDocument()
	{
		AscTest.ClearDocument();
		logicDocument.AddToContent(0, AscTest.CreateParagraph());
		
		let sectPr = AscTest.GetFinalSection();
		sectPr.SetPageSize(PAGE_W, 1000);
		sectPr.SetPageMargins(L_FIELD, 50, R_FIELD, 50);
	}
	
	function checkText(assert, para, lines)
	{
		assert.strictEqual(para.getLineCount(), lines.length, "Check number of lines");
		
		for (let i = 0, lineCount = Math.min(lines.length, para.GetLinesCount()); i < lineCount; ++i)
		{
			assert.strictEqual(para.getRangeCount(i), lines[i].length, "Check number of ranges in " + (i + 1) + " line");
			for (let j = 0, rangeCount = Math.min(lines[i].length, para.getRangeCount(i)); j < rangeCount; ++j)
			{
				assert.strictEqual(para.getTextInLineRange(i, j), lines[i][j], "Check text in range " + j);
			}
		}
	}
	function checkRangeBounds(assert, para, lines)
	{
		for (let i = 0, lineCount = Math.min(lines.length, para.GetLinesCount()); i < lineCount; ++i)
		{
			for (let j = 0, rangeCount = Math.min(lines[i].length, para.getRangeCount(i)); j < rangeCount; ++j)
			{
				let range = para.getRange(i, j);
				assert.close(range.X, lines[i][j][0], 0.001, "Check x for " + j + "range");
				assert.close(range.XEnd, lines[i][j][1], 0.001, "Check x for " + j + "range");
			}
		}
	}
	
	QUnit.module("Test paragraph wrap");
	
	QUnit.test("Test simple wrap", function(assert)
	{
		initDocument();
		
		let p1 = logicDocument.GetElement(0);
		
		let p2 = AscTest.CreateParagraph();
		
		logicDocument.AddToContent(0, p2);
		
		addFlowImageToParagraph(p2, 50, 50, 45 * charWidth, 40);
		
		AscTest.AddTextToParagraph(p1, "VeryLongWord The quick brown fox jumps over the lazy dog");
		
		AscTest.Recalculate();
		
		checkText(assert, p1, [
			["VeryLongWord The quick ", "brown fox jumps over the "],
			["lazy dog\r\n", ""],
		]);
	});
	
	QUnit.test("Test the first line indent", function(assert)
	{
		function initParagraphWithImage(text, x, y)
		{
			initDocument();
			
			let p1 = logicDocument.GetElement(0);
			let p2 = AscTest.CreateParagraph();
			logicDocument.AddToContent(0, p2);
			
			addFlowImageToParagraph(p2, 50, 50, x, y);
			
			p1.SetParagraphIndent({FirstLine : 5 * charWidth, Left : 5 * charWidth});
			AscTest.AddTextToParagraph(p1, text);
			AscTest.Recalculate();
			return p1;
		}
		
		let imageX0 = 45 * charWidth;
		let imageX1 = imageX0 + 50;
		let p = initParagraphWithImage("VeryLongWord The quick brown fox jumps over the lazy dog", imageX0, 40);
		
		checkText(assert, p, [
			["VeryLongWord ", "The quick brown fox jumps "],
			["over the lazy dog\r\n", ""],
		]);
		checkRangeBounds(assert, p, [
			[[L_FIELD + 10 * charWidth, imageX0], [imageX1, PAGE_W - R_FIELD]],
			[[L_FIELD + 5 * charWidth, imageX0], [imageX1, PAGE_W - R_FIELD]]
		]);
	});
});
