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
	var api = new Asc.asc_docs_api({
		'id-view': 'editor_sdk'
	});
	AscCommon.g_oTableId.init()

	//todo events
	setTimeout(startTests, 3000);

	function startTests() {
		QUnit.start();

		QUnit.module("Test draw serialize")

		QUnit.test("Test api.OpenDocumentFromZip", function (assert)
		{
			const api = new Asc.asc_docs_api({'id-view': 'editor_sdk'});
			api.InitEditor();
			// get Uint8Array
			let vsdx = AscCommon.Base64.decode(Asc.exampleVsdx);
			const openRes = api.OpenDocumentFromZip(vsdx);
			assert.strictEqual(openRes, true, "Check OpenDocumentFromZip");
		});

		QUnit.test("Check api.saveDocumentToZip", function (assert)
		{
			// Read and parse vsdx file
			const api = new Asc.asc_docs_api({'id-view': 'editor_sdk'});
			api.InitEditor();
			let vsdx = AscCommon.Base64.decode(Asc.exampleVsdx);
			const openRes = api.OpenDocumentFromZip(vsdx);

			// Creating .vsdx from api and get Uint8Array to data variable
			api.saveDocumentToZip(api.Document, AscCommon.c_oEditorId.Draw, function (data) {
				if (data) {
					assert.strictEqual(Boolean(data), true, "saveDocumentToZip returned data");

					// Download .vsdx
					// AscCommon.DownloadFileFromBytes(data, "title", AscCommon.openXml.GetMimeType("vsdx"));
				}
			});
		});

		QUnit.test("Compare files structure", function (assert)
		{
			// Read and parse vsdx file
			const api = new Asc.asc_docs_api({'id-view': 'editor_sdk'});
			api.InitEditor();
			let vsdx = AscCommon.Base64.decode(Asc.exampleVsdx);
			const openRes = api.OpenDocumentFromZip(vsdx);

			// Creating .vsdx and get Uint8Array to data variable
			api.saveDocumentToZip(api.Document, AscCommon.c_oEditorId.Draw, function (data) {
				if (data) {
					// Read and parse vsdx file
					const api2 = new Asc.asc_docs_api({'id-view': 'editor_sdk'});
					api2.InitEditor();

					let jsZlib = new AscCommon.ZLib();
					jsZlib.open(data);

					assert.strictEqual(jsZlib.files.length, 23, "Parsed vsdx contains 23 xml files like initial vsdx. Files Count correctly.");

					const openRes2 = api2.OpenDocumentFromZip(data);

				} else {
					return false;
				}
			});
		});

		QUnit.module("Comparing file structures")

		testFile("Basic ShapesA_start", Asc.BasicShapesA_start);


		function testFile(fileName, base64) {
			QUnit.test('File ' + fileName, function (assert)
			{
				// Read and parse vsdx file
				const api = new Asc.asc_docs_api({'id-view': 'editor_sdk'});
				api.InitEditor();
				let vsdx = AscCommon.Base64.decode(base64);
				const openRes = api.OpenDocumentFromZip(vsdx);

				let jsZlib = new AscCommon.ZLib();
				jsZlib.open(vsdx);
				let originalFiles = jsZlib.files;

				api.saveDocumentToZip(api.Document, AscCommon.c_oEditorId.Draw, function (data) {
					if (data) {
						// Read and parse vsdx file
						const api2 = new Asc.asc_docs_api({'id-view': 'editor_sdk'});
						api2.InitEditor();
						const openRes2 = api2.OpenDocumentFromZip(data);

						let jsZlibCustom = new AscCommon.ZLib();
						jsZlibCustom.open(data);
						let customFiles = jsZlibCustom.files;

						assert.strictEqual(originalFiles.length, customFiles.length, "Parsed vsdx contains as many xml files as initial vsdx");

						originalFiles = originalFiles.sort( function (a, b) { return  a.localeCompare(b);});
						customFiles = customFiles.sort( function (a, b) { return  a.localeCompare(b);});

						assert.deepEqual(originalFiles, customFiles, 'Original vsdx has the same file structire as custom vsdx');

						// TODO compare files content using DOMParser
						console.log(DOMParser);
						// let memory = new AscCommon.CMemory();
						// let textDecoder = new TextDecoder("utf-8");
						//
						// api2.Document.toXml(memory);
						// let documentCustom = textDecoder.decode(memory.GetData());
						//
						// memory = new AscCommon.CMemory();
						// api.Document.toXml(memory);
						// let documentOrig = textDecoder.decode(memory.GetData());
						// let a =1;



					} else {
						return false;
					}
				});
			});
		}

		function a() {

		}
	}
});
