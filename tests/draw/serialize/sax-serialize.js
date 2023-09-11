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
	const api = new Asc.asc_docs_api({
		'id-view': 'editor_sdk'
	});
	AscCommon.g_oTableId.init();
	let memory = new AscCommon.CMemory();
	memory.SetXmlAttributeQuote(0x27);

	testFileSerizlizeUseParseCompare.skip = function testFileSkip(fileName, base64, ignoreFolders, ignoreFiles, ignoredTags, ignoredAttributes, downloadFile) {
		this(fileName, base64, ignoreFolders, ignoreFiles, ignoredTags, ignoredAttributes, downloadFile, true);
	}

	//todo events
	setTimeout(startTests, 3000);

	function startTests() {
		api.InitEditor();

		QUnit.start();

		QUnit.module("Test main functions")

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


		// File contents (strings) before and after parse are the same but

		// Exceptions:
		// comments, schema tags - schema namespace, schema location,
		// hidden characters: /n/t,
		// quotes: double or single,
		// xml declaration: UTF and utf,
		// attributes order (order set like in MS but in generated file with XMLSpy and Linquid studio they are different),
		// ignoring long fractial numbers eg 3.1415926535897900073734945 cuts to 3.14159265358979,
		// tag auto-generated_for_wildcard,
		// files SolutionXML, SolutionsXML, Validation
		// and attributes and tags with any type

		// Errors in:
		// <Cell N='Value' U='STR'>&lt;?xml version='1.0'?&gt;&lt;VisioReportDefinition xmlns='urn:schemas-microsoft-com:office:visio:reportdefinition' ReportExists='1' SelectDrawingDataMethod='2' Description='Summary of milestones in timeline with start date and duration' Precision='2' ShowUnits='1' CaseSensitive='0' UserCells='0' HiddenProperties='0' AdvancedFilter='0' FilterExpression='' Version='3'&gt;&lt;Name&gt;Milestone Summary&lt;/Name&gt;&lt;Title&gt;Milestone Summary&lt;/Title&gt;&lt;VisioRptDefField ID='1' Display='1' DisplayOrder='3' Type='2' SummaryTypes='0' Tag='2'&gt;&lt;Name&gt;Duration&lt;/Name&gt;&lt;DisplayName&gt;Duration&lt;/DisplayName&gt;&lt;/VisioRptDefField&gt;&lt;VisioRptDefField ID='2' Display='1' DisplayOrder='2' Type='5' SummaryTypes='0' Tag='2'&gt;&lt;Name&gt;Start&lt;/Name&gt;&lt;DisplayName&gt;Start&lt;/DisplayName&gt;&lt;/VisioRptDefField&gt;&lt;VisioRptDefField ID='3' Display='1' DisplayOrder='1' Type='0' SummaryTypes='0' Tag='2'&gt;&lt;Name&gt;Task Name&lt;/Name&gt;&lt;DisplayName&gt;Task Name&lt;/DisplayName&gt;&lt;/VisioRptDefField&gt;&lt;VisioRptDefGroup ID='0' GroupingField='0' ItemDisplay='1' GrandSummary='0' ExcludeDuplicates='0'/&gt;&lt;VisioRptDefSort ID='1' SortField='2' Ascending='1' CaseSensitive='0'/&gt;&lt;/VisioReportDefinition&gt;</Cell>
		// <Text><cp IX='0'/>Project Timeline</Text>
		// <Text><cp IX='0'/><fld IX='0'>4/1/2014</fld></Text>

		// Only .xml check no .rels check or embeddings
		QUnit.module("Test xml serialize use strings compare Altova generated");

		testXmlFilesArchieve(Asc.altovaXml);

		QUnit.module("Test xml serialize use strings compare Liquid generated");

		testXmlFilesArchieve(Asc.liquidXml);

		QUnit.module("Test xml serialize use strings compare real file");

		testXmlFilesArchieve(Asc.timelineDiagrammVisioSpecificXmlOnly);

		QUnit.module("Test file serialize use parse compare");

		let ignoredFolders = ["docProps"];
		// ignore some files related to embedded files. Embedded files not yet needed
		// note: there may be missing rels beacause they are related to embedded files
		ignoredFolders = ignoredFolders.concat(["media", "embeddings"]);

		// In theme1.xml after parse lost <a:extLst>, <a:font> - fonts for each language only main fonts remain,
		// missing <a:tileRect> and <a:effectStyle>, some effectStyles are applied (e.g. shadows)
		// Maybe only theme1.xml is parsed - check it
		let ignoredFiles = ["theme1.xml", "theme2.xml", "theme3.xml", "theme4.xml"];
		// Not realized, Solution defines its own schema and data of that schema
		ignoredFiles = ignoredFiles.concat(["solutions.xml.rels", "solution1.xml", "solutions.xml", "validation.xml"]);

		// Remove elements(tags) with ignoredTagsExistence from extraElements or missingElements
		// So they are not considered in test result but still their children compared

		// Remove Shapes because in random generated file there may be empty Shapes tag
		// when in original file there was no Shapes tag
		let ignoredTagsExistence = ["Shapes"];

		let ignoredAttributes = ["xsi:schemaLocation", "xmlns:xsi", "xmlns", "xmlns:r", "xml:space"];

		// tags order and tag values are not compared - no such functionality for now

		testFileSerizlizeUseParseCompare("Example vsdx", Asc.exampleVsdx, ignoredFolders, ignoredFiles, ignoredTagsExistence, ignoredAttributes, false);
		testFileSerizlizeUseParseCompare("Basic ShapesA_start", Asc.BasicShapesA_start, ignoredFolders, ignoredFiles, ignoredTagsExistence, ignoredAttributes, false);
		testFileSerizlizeUseParseCompare("generatedVsdx2schema", Asc.generatedVsdx2schema, ignoredFolders, ignoredFiles, ignoredTagsExistence, ignoredAttributes, false);
		// ignore some files related to embedded files. Embedded files not yet needed
		let timeLineIgnoreFiles = ignoredFiles.concat(["master6.xml.rels"])
		testFileSerizlizeUseParseCompare("Timeline_diagram_start", Asc.Timeline_diagram_start, ignoredFolders, timeLineIgnoreFiles, ignoredTagsExistence, ignoredAttributes, false);
		testFileSerizlizeUseParseCompare("rows_test", Asc.rows_test, ignoredFolders, ignoredFiles, ignoredTagsExistence, ignoredAttributes, false);

		// Some errors still there in module below
		QUnit.module("Comparing many files");

		for (let key in Asc) {
			if (key.startsWith('test_file')) {
				let fileBase64 = Asc[key];
				 testFileSerizlizeUseParseCompare(key, fileBase64, ignoredFolders, ignoredFiles, ignoredTagsExistence, ignoredAttributes, false);
			}
		}
	}

	function testXmlFilesArchieve(base64zip) {
		let generatedXmlFiles = AscCommon.Base64.decode(base64zip);

		let jsZlibOriginal = new AscCommon.ZLib();
		jsZlibOriginal.open(generatedXmlFiles);
		let originalFiles = jsZlibOriginal.files;

		originalFiles.forEach(function(originalFilePath) {
			// let ignoreFiles = ["Solutions.xml", "SolutionsXML.xml", "Validation.xml"];
			let ignoreFiles = ["to prepare file check.txt"];
			let ignoreQuotes = true;
			let doRemoveLineBreaks = false;
			if (!ignoreFiles.includes(originalFilePath)) {
				let fileUint8 = jsZlibOriginal.getFile(originalFilePath);
				let fileContent = AscCommon.UTF8ArrayToString(fileUint8, 0, fileUint8.length);

				let testName = "Compare " + originalFilePath;

				// className === C + rootTagName(first tag name)
				let rootTagNameMatchResult = fileContent.match(/<(\w+)/);
				if (rootTagNameMatchResult) {
					let componentClassName = "C" + rootTagNameMatchResult[1];
					let componentClass = AscCommonDraw[componentClassName];
					if (componentClass) {
						let componentObject = new componentClass(api);
						QUnit.test(testName, function (assert) {
							testFileSerializeUseStringsCompare(assert, componentObject, fileContent, ignoreQuotes, doRemoveLineBreaks);
						});
					} else {
						QUnit.test(testName, function (assert)
						{
							QUnit.assert.ok(componentClass, "Class for parse not found");
						});
					}
				}	else {
					QUnit.test(testName, function (assert)
					{
						QUnit.assert.ok(false, "rootTagNameMatchResult is false");
					});
				}
			}
		});
	}

	function testFileSerizlizeUseParseCompare(fileName, base64, ignoreFolders, ignoreFiles, ignoredTagsExistence, ignoredAttributes, downloadFile, skip) {
		let testFunction = skip ? QUnit.test.skip : QUnit.test;
		testFunction('File ' + fileName, function (assert)
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
					if(downloadFile) {
						AscCommon.DownloadFileFromBytes(data, fileName, AscCommon.openXml.GetMimeType("vsdx"));
					}

					// Read and parse custom vsdx file
					const api2 = new Asc.asc_docs_api({'id-view': 'editor_sdk'});
					api2.InitEditor();
					const openResCustom = api2.OpenDocumentFromZip(data);

					let jsZlibCustom = new AscCommon.ZLib();
					jsZlibCustom.open(data);
					let customFiles = jsZlibCustom.files;

					let exceptionsMessage = format('Ignoring:\nFolders: %s\nFiles: %s\nTags: %s\nAttributes: %s',
						ignoreFolders.join(', '), ignoreFiles.join(', '), ignoredTagsExistence.join(', '), ignoredAttributes.join(', '));
					// \n doesnt work in success assert to split
					exceptionsMessage.split('\n').forEach(function(line) { return assert.ok(true, line);})

					originalFiles = originalFiles.filter(function (path) {
						let folderIgnored = pathCheckFolderPresence(path, ignoreFolders);
						let fileIgnored = ignoreFiles.includes(path.split('/').pop());
						return !folderIgnored && !fileIgnored;
					});
					customFiles = customFiles.filter(function (path) {
						let folderIgnored = pathCheckFolderPresence(path, ignoreFolders);
						let fileIgnored = ignoreFiles.includes(path.split('/').pop());
						return !folderIgnored && !fileIgnored;
					});

					assert.strictEqual(customFiles.length, originalFiles.length, "Parsed vsdx contains as many xml files as initial vsdx");

					originalFiles = originalFiles.sort( function(a, b) { return a.localeCompare(b);});
					customFiles = customFiles.sort( function(a, b) { return a.localeCompare(b);});

					assert.deepEqual(customFiles, originalFiles, 'Original vsdx has the same file structire as custom vsdx');

					let docOriginal = new AscCommon.openXml.OpenXmlPackage(jsZlibOriginal, null);
					let docCustom = new AscCommon.openXml.OpenXmlPackage(jsZlibCustom, null);
					for (let i = 0; i < originalFiles.length; i++) {
						let path = originalFiles[i];
						if (originalFiles[i].includes('/')) {
							path = "/" + path;
						}

						let contentOriginal = docOriginal.getPartByUri(path).getDocumentContent();

						let contentCustom;
						try {
							contentCustom = docCustom.getPartByUri(path).getDocumentContent();
						} catch (exception) {
							// check if TypeError
							if (exception.name === "TypeError") {
								assert.strictEqual("Cant read file", "File read", format(
									"Checking %s failed. Cant read custom file, check files count and file structure checks.",
									path));
								continue;
							}
						}
						contentOriginal = contentOriginal.trim();
						contentCustom = contentCustom.trim();

						// global js API DOMParser
						const domParser = new DOMParser();
						let fileDomOriginal = domParser.parseFromString(contentOriginal, "application/xml");
						let fileDomCustom = domParser.parseFromString(contentCustom, "application/xml");

						let compareResult = compareDOMs(fileDomOriginal, fileDomCustom);

						let compareResultIgnoredTags = getCompareResultIgnoredTagsExistence(compareResult, ignoredTagsExistence);
						let compareResultIgnoredAttributes = getCompareResultIgnoredAttributes(compareResultIgnoredTags, ignoredAttributes);

						let differences = compareResultIgnoredAttributes.filter(function (compareObject) {
							let attrDifs = compareObject.differencesInAttributes;
							let wrongAttributes = attrDifs.wrongValuesAttributePairs.length ||
								attrDifs.extraAttributes.length || attrDifs.missingAttributes.length;
							return compareObject.missingElements.length || compareObject.extraElements.length || wrongAttributes;
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
	function addLineBreaks(xmlString) {
		// bad line breaks
		for (let i = 0; i < 2; i++) {
			xmlString = xmlString.replaceAll(/(<\w.+?)<(\w)/g, '$1\n<$2');
		}
		xmlString = xmlString.replaceAll('></', '>\n</');
		return xmlString;
	}

	function removeLineBreaks(string) {
		string = string.replaceAll(/[\r\n]+/g, '');
		string = addLineBreaks(string);
		return string;
	}

	function findFirstDifference(str1, str2) {
		const minLength = Math.min(str1.length, str2.length);

		for (let i = 0; i < minLength; i++) {
			if (str1[i] !== str2[i]) {
				return `Difference found at position ${i}: char ${str1.charCodeAt(i)} !== char ${str2.charCodeAt(i)}`;
			}
		}

		if (str1.length !== str2.length) {
			const longerStr = str1.length > str2.length ? str1 : str2;
			return `Strings have different lengths. First difference found at position ${minLength}: ${longerStr[minLength]}`;
		}

		return "No difference found";
	}

	function testFileSerializeUseStringsCompare(assert, serializeObj, expecteedXml, ignoreQuotes, doRemoveLineBreaks) {
		//fromXml
		let context = new AscCommon.XmlParserContext();
		let zip = new AscCommon.ZLib();
		let rels = new AscCommon.openXml.OpenXmlPackage(zip, null);
		let reader = new StaxParser(expecteedXml, rels, context);
		serializeObj.fromXml(reader);

		//toXml
		memory.Seek(0);
		memory.context = new AscCommon.XmlWriterContext();
		memory.context.clearCurrentPartDataMaps();
		context.document = serializeObj;
		let filePart = new AscCommon.openXml.OpenXmlPackage(zip, memory);
		let data = filePart.getXmlBytes(this, serializeObj, memory);
		let content = AscCommon.UTF8ArrayToString(data, 0, data.length);

		//compare
		let expectedContent = expecteedXml.replace(/\t/g,'');
		let resultContent = content;
		//todo flag in memeory?
		resultContent = resultContent.replace(/&quot;/g,'"');
		if (ignoreQuotes) {
			resultContent = resultContent.replaceAll("\"", "'");
			expectedContent = expectedContent.replaceAll("\"", "'");
		}
		if (doRemoveLineBreaks) {
			resultContent = removeLineBreaks(resultContent);
			resultContent = addLineBreaks(resultContent);
			expectedContent = removeLineBreaks(expectedContent);
			expectedContent = addLineBreaks(expectedContent);
		}
		let message = `Comparing ${serializeObj.constructor.name} xml stings. ${findFirstDifference(resultContent, expectedContent)}`;
		assert.strictEqual(resultContent, expectedContent, message);
	}

	function getCompareResultIgnoredTagsExistence(compareResult, ignoredTags) {
		return compareResult.map(function (compareObject) {
			let newMissingElements = compareObject.missingElements.filter(function (missingElement) {
				return !ignoredTags.includes(missingElement.nodeName);
			});
			let newExtraElements = compareObject.extraElements.filter(function (extraElement) {
				return !ignoredTags.includes(extraElement.nodeName);
			});
			return {
				tagsCompared: compareObject.tagsCompared,
				missingElements: newMissingElements,
				equalElements: compareObject.equalElements,
				extraElements: newExtraElements,
				differencesInAttributes : compareObject.differencesInAttributes
			}
		});
	}

	function getCompareResultIgnoredAttributes(compareResult, ignoredAttributes) {
		return compareResult.map(function (compareObject) {
			let attrDifs = compareObject.differencesInAttributes;
			let newMissingAttributes = attrDifs.missingAttributes.filter(function (missingAttribute) {
				return !ignoredAttributes.includes(missingAttribute.name);
			});
			attrDifs.missingAttributes = newMissingAttributes;

			let newExtraAttributes = attrDifs.extraAttributes.filter(function (extraAttribute) {
				return !ignoredAttributes.includes(extraAttribute.name);
			});
			attrDifs.extraAttributes = newExtraAttributes;

			let newWrongValuesAttributePairs = attrDifs.wrongValuesAttributePairs.filter(function (wrongValuesAttributePair) {
				return !ignoredAttributes.includes(wrongValuesAttributePair[1].name); //[1] is equal to [0] here
			});
			attrDifs.wrongValuesAttributePairs = newWrongValuesAttributePairs;

			return {
				tagsCompared: compareObject.tagsCompared,
				missingElements: compareObject.missingElements,
				equalElements: compareObject.equalElements,
				extraElements: compareObject.extraElements,
				differencesInAttributes : compareObject.differencesInAttributes // changed implicitly
			}
		});
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

	function compareDOMs(originalNode, customNode, result) {
		if (typeof result === 'undefined') {
			result = [];
		}
		if (originalNode.children.length !== 0) { // Check if it's an element node
			let originalElement = originalNode;
			let customElement = customNode;

			let differencesInChildren = compareTagsFlat(originalElement, customElement);
			let differencesInAttributes = compareAttributes(originalElement, customElement);
			result.push({
				tagsCompared : originalNode.nodeName,
				missingElements : differencesInChildren.missingElements,
				equalElements : differencesInChildren.equalElements,
				extraElements : differencesInChildren.extraElements,
				differencesInAttributes : differencesInAttributes
			});

			let equalElements = differencesInChildren.equalElements;
			// recursive cals
			for (let i = 0; i < equalElements.length; i++) {
				result = result.concat(compareDOMs(equalElements[i][0], equalElements[i][1]));
			}
		} else {
			// let differencesInValues = {
			// 	originalValue: originalNode.value,
			// 	customValue: customNode.value,
			// 	compareResult: originalNode.value === customNode.value
			// }
			// ...
		}

		return result;
	}

	function compareAttributes(originalElement, customElement) {
		let originalAttributes;
		let customAttributes;
		if (originalElement.attributes) {
			originalAttributes = Array.from(originalElement.attributes);
			originalAttributes.sort(function (a, b) {return a.name.localeCompare(b);})
		} else {
			originalAttributes = [];
		}
		if (customElement.attributes) {
			customAttributes = Array.from(customElement.attributes);
			customAttributes.sort(function (a, b) {return a.name.localeCompare(b);})
		} else {
			customAttributes = [];
		}

		const missingAttributes = [];
		const extraAttributes = [];
		const wrongValuesAttributePairs = [];
		const correctAttributePairs = [];

		// Iterate through the children of originalElement and check if they are missing in customElement
		originalAttributes.forEach(function (originalAttribute) {
			const foundIndex = customAttributes.findIndex(function(customAttribute) {
				return customAttribute.name === originalAttribute.name;
			});

			if (foundIndex  === -1) {
				missingAttributes.push(originalAttribute);
			} else {
				// Remove the found child from customElement to handle duplicates
				const removedChild = customAttributes.splice(foundIndex, 1)[0];
				if (originalAttribute.value === removedChild.value) {
					correctAttributePairs.push([originalAttribute, removedChild]);
				} else {
					wrongValuesAttributePairs.push([originalAttribute, removedChild]);
				}
			}
		});

		// Find extra elements present in customElement but not in originalElement
		// may be some() check can be omitted
		customAttributes.forEach(function (customAttribute) {
			if (!originalAttributes.some(function (originalAttribute) {return originalAttribute.name === customAttribute.name;})) {
				extraAttributes.push(customAttribute);
			}
		});

		return {
			missingAttributes,
			extraAttributes,
			wrongValuesAttributePairs,
			correctAttributePairs
		};
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
		}

		if (difference.extraElements.length) {
			let extraElements = difference.extraElements.map(function (el) {
				return format('<%s>', el.nodeName);
			});
			result += format('\nExtra in custom: %s.\n', extraElements.join(', '));
		}

		if (difference.differencesInAttributes.missingAttributes.length) {
			let badAttributesElements = difference.differencesInAttributes.missingAttributes.map(function (el) {
				return format('%s', el.name);
			});
			result += format('\nMissing attributes in custom: %s.\n', badAttributesElements.join(', '));
		}
		if (difference.differencesInAttributes.extraAttributes.length) {
			let badAttributesElements = difference.differencesInAttributes.extraAttributes.map(function (el) {
				return format('%s', el.name);
			});
			result += format('\nExtra attributes in custom: %s.\n', badAttributesElements.join(', '));
		}
		if (difference.differencesInAttributes.wrongValuesAttributePairs.length) {
			let badAttributesElements = difference.differencesInAttributes.wrongValuesAttributePairs.map(function (el) {
				return format('%s: %s !== %s', el[0].name, el[0].value, el[1].value);
			});
			result += format('\nWrong values in custom attributes:\n%s.\n', badAttributesElements.join('\n'));
		}
		return result;
	}

});
