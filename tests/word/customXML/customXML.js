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

$(function () {
	let logicDocument = AscTest.CreateLogicDocument();
	let custom;
	let oXMLManager = logicDocument.getCustomXmlManager();

	function CreateContentControl()
	{
		let cc = new AscWord.CBlockLevelSdt(logicDocument);
		cc.SetPlaceholder(c_oAscDefaultPlaceholderName.Text);
		cc.ReplacePlaceHolderWithContent();
		cc.SetShowingPlcHdr(false);
		return cc;
	}
	function CreateDataBindingForCC(contentControl, prefix, itemId, xpath, checkSum)
	{
		let oDataBinding = new AscWord.DataBinding(
			prefix === undefined ? "xmlns:ns0='http://example.com/picture' " : prefix,
			itemId === undefined ? "{694325A8-B1C9-407B-A2C2-E2DD1740AA5E}" : itemId,
			xpath === undefined ? "/ns0:documentData[1]/ns0:simpleText[1]" : xpath,
			checkSum === undefined ? "Gt6wYg==" : checkSum,
		);

		contentControl.Pr.DataBinding = oDataBinding;
		contentControl.checkDataBinding();
	}
	function CreateCustomXMLForDocument(strContent, ItemId, Uri)
	{
		let oContent = oXMLManager.parseCustomXML(strContent);
		let oXML		= new AscWord.CustomXml();

		oXML.itemId		= ItemId === undefined
			? "{694325A8-B1C9-407B-A2C2-E2DD1740AA5E}"
			: ItemId;

		oXML.uri		= Uri === undefined
			? ['http://example.com/picture']
			: Uri;

		oXML.content	= strContent === undefined
			? oXMLManager.parseCustomXML(oCustomXMLs.withoutContent)
			: oContent;

		oXMLManager.add(oXML);
	}

	const oCustomXMLData = {
		date: "2000-01-01",
		'checkboxTrue': true,
		'checkboxFalse': false,
		'checkbox0': 0,
		'checkbox1': 1,
		'checkboxMess': "hello",
	}
	const oCustomXMLs = {
		"withoutContent" : "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<documentData xmlns=\"http://example.com/picture\">\n<simpleText></simpleText>\n</documentData>\"",
		"date" : "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<documentData xmlns=\"http://example.com/picture\">\n<simpleText>" + oCustomXMLData.date + "</simpleText>\n</documentData>\"",
		'checkboxTrue': "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<documentData xmlns=\"http://example.com/picture\">\n<simpleText>" + oCustomXMLData.checkboxTrue + "</simpleText>\n</documentData>\"",
		'checkboxFalse': "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<documentData xmlns=\"http://example.com/picture\">\n<simpleText>" + oCustomXMLData.checkboxFalse + "</simpleText>\n</documentData>\"",
		'checkbox0': "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<documentData xmlns=\"http://example.com/picture\">\n<simpleText>" + oCustomXMLData.checkbox0 + "</simpleText>\n</documentData>\"",
		'checkbox1': "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<documentData xmlns=\"http://example.com/picture\">\n<simpleText>" + oCustomXMLData.checkbox1 + "</simpleText>\n</documentData>\"",
		'checkboxMess': "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<documentData xmlns=\"http://example.com/picture\">\n<simpleText>" + oCustomXMLData.checkboxMess + "</simpleText>\n</documentData>\"",

		'checkboxTrueAnotherXML': "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n	<weather>" + oCustomXMLData.checkboxTrue + "</weather>",
	}

	function CreateDateCC(nPos)
	{
		let cc = CreateFilledContentControl(nPos)
		let dateTimePr = new AscWord.CSdtDatePickerPr();
		cc.ApplyDatePickerPr(dateTimePr, true);
		return cc;
	}
	function CreateCheckBoxCC(nPos)
	{
		let cc = CreateFilledContentControl(nPos)
		let checkboxPr = new AscWord.CSdtCheckBoxPr();
		cc.ApplyCheckBoxPr(checkboxPr);
		return cc;
	}
	function CreateComboBox(nPos)
	{
		let cc = CreateFilledContentControl(nPos);
		let comboBoxPr = new AscWord.CSdtComboBoxPr();
		cc.ApplyComboBoxPr(comboBoxPr, true);
		return cc;
	}
	function CreatePicture(nPos)
	{
		let cc = CreateFilledContentControl(nPos);
		let picturePr = new AscWord.CSdtPictureFormPr();
		cc.ApplyPicturePr(picturePr);
		return cc;
	}
	function CreateText(nPos)
	{
		let cc = CreateFilledContentControl(nPos);
		let textPr = new AscWord.CSdtTextFormPr();
		cc.ApplyTextFormPr(textPr);
		return cc;
	}

	function CreateFilledContentControl(nPos)
	{
		let cc = CreateContentControl();
		let docContent = cc.GetContent();
		docContent.ClearContent(false);

		logicDocument.AddToContent(nPos, cc);
		return cc;
	}
	function CheckContentParagraph(assert, oContentArr, arrSample)
	{
		for (let i = 0; i < arrSample.length; i++)
		{
			let oCurStr = arrSample[i];
			let oCurContent = oContentArr[i].GetText();
			assert.strictEqual(oCurStr, oCurContent, oCurContent);
		}
	}

	function Reset()
	{
		AscTest.ClearDocument();
		oXMLManager.xml = []
	}

	QUnit.testStart( function() {Reset()} );

	QUnit.test("Date and CheckBox content control's load from different CustomXML's", async function (assert)
	{
		CreateCustomXMLForDocument(oCustomXMLs.date);
		CreateCustomXMLForDocument(oCustomXMLs.checkboxTrueAnotherXML, "{694325A8-B1C9-407B-A2C2-E2DD1740AA55}", ["/weather[1]"]);

		let c1			= CreateDateCC(0);
		CreateDataBindingForCC(c1);

		let oDatePr		= c1.GetDatePickerPr();
		let strDate		= oDatePr.GetFullDate();
		let oDate		= new Date(strDate).toDateString();
		let oStartDate	= new Date(oCustomXMLData.date).toDateString();

		assert.strictEqual(oDate, oStartDate, "Date loaded from CustomXml");

		let c2			= CreateCheckBoxCC(1);
		debugger
		CreateDataBindingForCC(c2, '', "{694325A8-B1C9-407B-A2C2-E2DD1740AA55}", '/weather[1]', '');
		let oCHeckBoxPr		= c2.GetCheckBoxPr();

		assert.strictEqual(
			oCHeckBoxPr.Checked,
			oCustomXMLData.checkboxTrue,
			"Check load checkbox content from CustomXML with text \"" + oCustomXMLData.checkboxTrue + "\" is true"
		);

		assert.strictEqual(
			oXMLManager.getCustomXMLString(oXMLManager.getCustomXml(1)),
			"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<weather>" + oCustomXMLData.checkboxTrue + "</weather>",
			"Check saved CustomXML"
		);
	});

	QUnit.test("Date content control load form CustomXML", async function (assert)
	{
		CreateCustomXMLForDocument(oCustomXMLs.date);

		let c1			= CreateDateCC(0);
		CreateDataBindingForCC(c1);

		let oDatePr		= c1.GetDatePickerPr();
		let strDate		= oDatePr.GetFullDate();
		let oDate		= new Date(strDate).toDateString();
		let oStartDate	= new Date(oCustomXMLData.date).toDateString();

		assert.strictEqual(oDate, oStartDate, "Date loaded from CustomXml");
	});

	QUnit.test("Checkbox content control load form CustomXML", async function (assert)
	{
		function getCheck(strContent)
		{
			return '<?xml version="1.0" encoding="UTF-8"?>\n' +
			'<documentData xmlns="http://example.com/picture">\n' +
				'\t<simpleText>'+ strContent +'</simpleText>\n' +
			'</documentData>';
		}

		CreateCustomXMLForDocument(oCustomXMLs.checkboxTrue);
		let c1			= CreateCheckBoxCC(0);
		CreateDataBindingForCC(c1);
		let oCHeckBoxPr	= c1.GetCheckBoxPr();

		assert.strictEqual(
			oCHeckBoxPr.Checked,
			oCustomXMLData.checkboxTrue,
			"Check load checkbox content from CustomXML with text \"" + oCustomXMLData.checkboxTrue + "\" is true"
		);
		Reset();

		CreateCustomXMLForDocument(oCustomXMLs.checkboxFalse);
		c1				= CreateCheckBoxCC(0);
		CreateDataBindingForCC(c1);
		oCHeckBoxPr		= c1.GetCheckBoxPr();
		assert.strictEqual(
			oCHeckBoxPr.Checked,
			oCustomXMLData.checkboxFalse,
			"Check load checkbox content from CustomXML with text \"" + oCustomXMLData.checkboxFalse + "\" is false"
		);
		Reset();

		CreateCustomXMLForDocument(oCustomXMLs.checkbox0);
		c1				= CreateCheckBoxCC(0);
		CreateDataBindingForCC(c1);
		oCHeckBoxPr		= c1.GetCheckBoxPr();
		assert.strictEqual(
			oCHeckBoxPr.Checked,
			oCustomXMLData.checkboxFalse,
			"Check load checkbox content from CustomXML with text \"" + oCustomXMLData.checkbox0 + "\" is false"
			);
		Reset();

		CreateCustomXMLForDocument(oCustomXMLs.checkbox1);
		c1				= CreateCheckBoxCC(0);
		CreateDataBindingForCC(c1);
		oCHeckBoxPr		= c1.GetCheckBoxPr();
		assert.strictEqual(
			oCHeckBoxPr.Checked,
			oCustomXMLData.checkboxTrue,
			"Check load checkbox content from CustomXML with text \"" + oCustomXMLData.checkbox1 + "\" is true"
		);
		Reset();

		CreateCustomXMLForDocument(oCustomXMLs.checkboxMess);
		c1				= CreateCheckBoxCC(0);
		CreateDataBindingForCC(c1);
		oCHeckBoxPr		= c1.GetCheckBoxPr();
		assert.strictEqual(
			oCHeckBoxPr.Checked,
			oCustomXMLData.checkboxFalse,
			"Check load checkbox content from CustomXML with text \"" + oCustomXMLData.checkboxMess + "\" is false"
		);

		c1.SetCheckBoxChecked(true);
		assert.strictEqual(
			oXMLManager.getCustomXMLString(oXMLManager.getCustomXml(0)),
			getCheck('true'),
			"Check saved CustomXML"
		);

		c1.SetCheckBoxChecked(false);
		assert.strictEqual(
			oXMLManager.getCustomXMLString(oXMLManager.getCustomXml(0)),
			getCheck('false'),
			"Check saved CustomXML"
		);

		Reset();
	});

});
