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

//for zlib async loading
QUnit.config.autostart = false;
$(function() {
	var api = new Asc.asc_draw_api({
		'id-view': 'editor_sdk'
	});
	//todo events
	setTimeout(startTests, 1000);

	function startTests() {
		QUnit.start();

		QUnit.module("Test draw serialize")

		QUnit.test("Test OpenDocumentFromZip", function (assert)
		{
			const api = new Asc.asc_draw_api({'id-view': 'editor_sdk'});
			api.Document = new AscCommonDraw.CVisioDocument(api);
			let vsdx = AscCommon.Base64.decode(Asc.testVsdx);
			const openRes = api.OpenDocumentFromZip(vsdx);
			assert.strictEqual(openRes, true, "Check OpenDocumentFromZip");
		});

		// QUnit.test("Test vsdx files", function (assert)
		// {
		// 	const api = new Asc.asc_draw_api({'id-view': 'editor_sdk'});
		// 	api.Document = new AscCommonDraw.CVisioDocument(api);
		// 	const openRes = api.OpenDocumentFromZip();
		// 	assert.strictEqual(openRes, true, "Check OpenDocumentFromZip");
		// });
	}
});
