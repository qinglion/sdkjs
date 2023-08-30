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

		QUnit.module.skip("Test draw serialize")

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

		QUnit.test("Compare files count", function (assert)
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

		let ignoreFolders = ["docProps"];
		let ignoreFiles = ["theme1.xml"];
		// testFile("Basic ShapesA_start", Asc.BasicShapesA_start, ignoreFolders, ignoreFiles);
		testFile("generatedVsdx2schema", Asc.generatedVsdx2schema, ignoreFolders, ignoreFiles);


		function testFile(fileName, base64, ignoreFolders, ignoreFiles) {
			QUnit.test('File ' + fileName, function (assert)
			{
				// Read and parse vsdx file
				const api = new Asc.asc_docs_api({'id-view': 'editor_sdk'});
				api.InitEditor();
				let vsdxOriginal = AscCommon.Base64.decode(base64);
				const openResOriginal = api.OpenDocumentFromZip(vsdxOriginal);

				let jsZlibOriginal = new AscCommon.ZLib();
				jsZlibOriginal.open(vsdxOriginal);
				let originalFiles = jsZlibOriginal.files;

				api.saveDocumentToZip(api.Document, AscCommon.c_oEditorId.Draw, function (data) {
					if (data) {
						// Read and parse custom vsdx file
						const api2 = new Asc.asc_docs_api({'id-view': 'editor_sdk'});
						api2.InitEditor();
						const openResCustom = api2.OpenDocumentFromZip(data);

						let jsZlibCustom = new AscCommon.ZLib();
						jsZlibCustom.open(data);
						let customFiles = jsZlibCustom.files;

						assert.strictEqual(customFiles.length, originalFiles.length, "Parsed vsdx contains as many xml files as initial vsdx");

						originalFiles = originalFiles.sort( function (a, b) { return  a.localeCompare(b);});
						customFiles = customFiles.sort( function (a, b) { return  a.localeCompare(b);});

						assert.deepEqual(customFiles, originalFiles, 'Original vsdx has the same file structire as custom vsdx');

						let docOriginal = new AscCommon.openXml.OpenXmlPackage(jsZlibOriginal, null);
						let docCustom = new AscCommon.openXml.OpenXmlPackage(jsZlibCustom, null);
						for (let i = 0; i < originalFiles.length; i++) {
							let path = originalFiles[i];
							if (originalFiles[i].includes('/')) {
								path = "/" + path;
							}
							if (pathCheckFolderPresence(path, ignoreFolders)) {
								assert.ok(true, format('Checking %s was successful. Path is ignored!', path));
								continue;
							}
							if (ignoreFiles.includes(path.split('/').pop())) {
								assert.ok(true, format('Checking %s was successful. File is ignored!', path));
								continue;
							}

							let contentOriginal = docOriginal.getPartByUri(path).getDocumentContent();
							let contentCustom = docCustom.getPartByUri(path).getDocumentContent();
							contentOriginal = contentOriginal.trim();
							contentCustom = contentCustom.trim();

							// global js API DOMParser
							const domParser = new DOMParser();
							let fileDomOriginal = domParser.parseFromString(contentOriginal, "application/xml");
							let fileDomCustom = domParser.parseFromString(contentCustom, "application/xml");

							let compareResult = compareDOMs(fileDomOriginal, fileDomCustom);
							let differences = compareResult.filter(function (compareObject) {
								return compareObject.missingElements.length || compareObject.extraElements.length;
							});

							let message = '';
							if (differences.length === 0) {
								message = format('Checking %s was successful. Files are equal.', path);
							} else {
								let differencesString = differencesToString(differences);
								message = format('Checking %s was not successful.\nDifferences:\n%s', path, differencesString);
							}
							assert.strictEqual(differences.length, 0, message);
						}
					} else {
						return false;
					}
				});
			});
		}
	}

	function pathCheckFolderPresence(path, folders) {
		let foldersUsed = path.split('/').slice(0, -1);
		let isIgnored = foldersUsed.some(function (folder) {
			return folders.includes(folder);
		})
		return isIgnored;
	}

	function format () {
		var args = [].slice.call(arguments);
		var initial = args.shift();

		function replacer (text, replacement) {
			return text.replace('%s', replacement);
		}
		return args.reduce(replacer, initial);
	}

	function differencesToString(differences) {
		return differences.map(function (differenceObject) {
			return differenceToString(differenceObject);
		}).join('\n');
	}

	function differenceToString(difference) {
		let result = '';
		result += format('\nComparing elements <%s>.', difference.tagsCompared);
		if (difference.missingElements.length) {
			let missingElements = difference.missingElements.map(function (el) {
				return format('<%s>', el.nodeName);
			} );
			result += format('\nMissing in custom: %s.\n', missingElements.join(', '));
		} else {
			let extraElements = difference.extraElements.map(function (el) {
				return format('<%s>', el.nodeName);
			});
			result += format('\nExtra in custom: %s.\n', extraElements.join(', '));
		}
		return result;
	}

	function compareDOMs(originalNode, customNode, result) {
		if (typeof result === 'undefined') {
			result = [];
		}
		if (originalNode.children.length !== 0) { // Check if it's an element node
			let originalElement = originalNode;
			let customElement = customNode;

			let differencesInChildren = compareTagsFlat(originalElement, customElement);
			result.push({
				tagsCompared : originalNode.nodeName,
				missingElements : differencesInChildren.missingElements,
				equalElements : differencesInChildren.equalElements,
				extraElements : differencesInChildren.extraElements
			});


			let equalElements = differencesInChildren.equalElements;
			// recursive cals
			for (let i = 0; i < equalElements.length; i++) {
				result = result.concat(compareDOMs(equalElements[i][0], equalElements[i][1]));
			}
		}
		return result;
	}

	function compareTagsFlat(originalElement, customElement) {
		// indifferent of children.length there may be extra nodes missing nodes and nodes with equal nodeNames
		// eg
		// Orig Custom          Orig Custom
		//  A   D                 D   A                   A   C
		//  B   E                 E   B                   B   D
		//  C                         C
		// Mis ABC Extra DE       Mis DE Extra ABC        Mis AB Extra CD

		//  A   D                 D   A                   A   A
		//  B   B                 C   B                   B   B
		//  C                         C
		// Mis AC Extra D Equ B   Mis D Extra AB Equ C    Equ AB

		// B    B
		// B
		// Mis B (second) Extra - Equ B (first). So in that case we recursively comprate two first B
		// TODO: Not checking each B values or attributes. This is a flaw.
		// Bcs if 2-nd B in original and 1-st B in custom are absolutely equal then original B 1-rst is missing
		// But result is 2-nd B in orig is missing and orig 1-st B is not equal to custom  1-st B

		let originalElementChildren = Array.from(originalElement.children);
		let customElementChildren = Array.from(customElement.children);

		const missingElements = [];
		const equalElements = [];
		const extraElements = [];

		// Iterate through the children of originalElement and check if they are missing in customElement
		originalElementChildren.forEach(function (originalChild) {
			const foundIndex = customElementChildren.findIndex(function(customChild) {
				return customChild.nodeName === originalChild.nodeName;
			});

			if (foundIndex  === -1) {
				missingElements.push(originalChild);
			} else {
				// Remove the found child from customElement to handle duplicates
				const removedChild = customElementChildren.splice(foundIndex, 1)[0];
				equalElements.push([originalChild, removedChild]);
			}
		});

		// Find extra elements present in customElement but not in originalElement
		customElementChildren.forEach(function (customChild) {
			if (!originalElementChildren.some(function (originalChild) {return originalChild.nodeName === customChild.nodeName;})) {
				extraElements.push(customChild);
			}
		});

		return {
			missingElements: missingElements,
			equalElements: equalElements,
			extraElements: extraElements
		};
	}
});
