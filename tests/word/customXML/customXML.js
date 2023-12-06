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

	//something (zlib engine) does not have time to load, for now need to leave this line of code here
	debugger
	//====

	AscCommon.zlib_load(function (){return true},function (){return false})
	window.onZlibEngineInit()

	let logicDocument = AscTest.CreateLogicDocument();
	let custom;

	function proceedCustomXml(strXml)
	{
		let oStax = new StaxParser(strXml);

		// switch to CT_Node
		function CustomXMLItem(par, name)
		{
			this.parent = par;
			this.content = [];
			this.name = name ? name : "";
			this.attribute = {};
			this.textContent = "";
			this.current = undefined;

			this.str = "";

			this.AddAttribute = function (name, value)
			{
				this.attribute[name] = value;
			}
			this.AddContent = function (name)
			{
				let one = new CustomXMLItem(this, name);
				oCurrentContent = one;
				this.content.push(one);
			}
			this.GetParent = function ()
			{
				if (this.parent)
					return this.parent;

				return null;
			}
			this.SetParent = function (oPar)
			{
				this.parent = oPar;
			}
			this.AddTextContent = function (text)
			{
				if (text !== "")
					this.textContent += text;
			}
			this.GetStringFromBuffer = function ()
			{
				let buffer = this.GetBuffer();
				let arr = Array.prototype.slice.call(buffer.data.slice(1, buffer.pos));
				let str = String.fromCharCode.apply(null, arr);
				str = str.replaceAll("&quot;", "\"");
				str = str.replaceAll("&amp;", "&");

				this.str = str;
				return str;
			}
			this.GetBuffer = function ()
			{
				let writer = new AscCommon.CMemory();

				function Write(content)
				{
					let current = null;

					if (!content.name)
					{
						writer.WriteXmlString("\x00<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
						current = content.content[0];
					} else
					{
						current = content;
					}

					writer.WriteXmlNodeStart(current.name);

					let atr = Object.keys(current.attribute)

					for (let i = 0; i < atr.length; i++)
					{
						let cur = atr[i];
						writer.WriteXmlAttributeStringEncode(cur, current.attribute[cur]);
					}
					writer.WriteXmlAttributesEnd();

					for (let i = 0; i < current.content.length; i++)
					{
						let curContent = current.content[i];
						Write(curContent);
					}

					if (current.textContent)
						writer.WriteXmlStringEncode(current.textContent.toString());

					writer.WriteXmlNodeEnd(current.name);
				}

				Write(this);
				return writer;
			}
		}

		let oParentContent;
		let oCurrentContent = oParentContent = new CustomXMLItem(null);

		while (oStax.Read())
		{
			switch (oStax.GetEventType())
			{
				case EasySAXEvent.CHARACTERS:
					oCurrentContent.AddTextContent(oStax.text);
					break;
				case EasySAXEvent.END_ELEMENT:
					oCurrentContent = oCurrentContent.parent;
					break;
				case EasySAXEvent.START_ELEMENT:
					let name = oStax.GetName();
					oCurrentContent.AddContent(name)

					while (oStax.MoveToNextAttribute())
					{
						let nameAttrib = oStax.GetName();
						let valueAttrib = oStax.GetValue();
						oCurrentContent.AddAttribute(nameAttrib, valueAttrib);
					}
					break;
			}
		}

		return oParentContent
	}
	function getXml(arrStr)
	{
		let start = '<?xml version="1.0" encoding="UTF-8"?>\n' +
		'<documentData xmlns="http://example.com/picture">\n' +
		'    <simpleText>&lt;?xml version="1.0" standalone="yes"?&gt;\n' +
		'        &lt;?mso-application progid="Word.Document"?&gt;\n' +
		'        &lt;pkg:package xmlns:pkg="http://schemas.microsoft.com/office/2006/xmlPackage"&gt;&lt;pkg:part\n' +
		'        pkg:name="/_rels/.rels" pkg:contentType="application/vnd.openxmlformats-package.relationships+xml"\n' +
		'        pkg:padding="512"&gt;&lt;pkg:xmlData&gt;&lt;Relationships\n' +
		'        xmlns="http://schemas.openxmlformats.org/package/2006/relationships"&gt;&lt;Relationship Id="rId1"\n' +
		'        Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"\n' +
		'        Target="word/document.xml"/&gt;&lt;/Relationships&gt;&lt;/pkg:xmlData&gt;&lt;/pkg:part&gt;&lt;pkg:part\n' +
		'        pkg:name="/word/document.xml"\n' +
		'        pkg:contentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"&gt;&lt;pkg:xmlData&gt;&lt;w:document\n' +
		'        xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"\n' +
		'        xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex"\n' +
		'        xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex"\n' +
		'        xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex"\n' +
		'        xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex"\n' +
		'        xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex"\n' +
		'        xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex"\n' +
		'        xmlns:cx6="http://schemas.microsoft.com/office/drawing/2016/5/12/chartex"\n' +
		'        xmlns:cx7="http://schemas.microsoft.com/office/drawing/2016/5/13/chartex"\n' +
		'        xmlns:cx8="http://schemas.microsoft.com/office/drawing/2016/5/14/chartex"\n' +
		'        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"\n' +
		'        xmlns:aink="http://schemas.microsoft.com/office/drawing/2016/ink"\n' +
		'        xmlns:am3d="http://schemas.microsoft.com/office/drawing/2017/model3d"\n' +
		'        xmlns:o="urn:schemas-microsoft-com:office:office"\n' +
		'        xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"\n' +
		'        xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml"\n' +
		'        xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"\n' +
		'        xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"\n' +
		'        xmlns:w10="urn:schemas-microsoft-com:office:word"\n' +
		'        xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"\n' +
		'        xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"\n' +
		'        xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml"\n' +
		'        xmlns:w16cex="http://schemas.microsoft.com/office/word/2018/wordml/cex"\n' +
		'        xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid"\n' +
		'        xmlns:w16="http://schemas.microsoft.com/office/word/2018/wordml"\n' +
		'        xmlns:w16sdtdh="http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash"\n' +
		'        xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex"\n' +
		'        xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"\n' +
		'        xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"\n' +
		'        xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"\n' +
		'        xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se w16cid\n' +
		'        w16 w16cex w16sdtdh wp14"\n' +
		'        &gt;&lt;w:body&gt;';

		arrStr.forEach(str => start += '&lt;w:p&gt;&lt;w:r&gt;&lt;w:t&gt;' + str + '&lt;/w:t&gt;&lt;/w:r&gt;&lt;/w:p&gt;')

			     start += '&lt;/w:body&gt;&lt;/w:document&gt;&lt;/pkg:xmlData&gt;&lt;/pkg:part&gt;&lt;pkg:part\n' +
		'        pkg:name="/word/_rels/document.xml.rels"\n' +
		'        pkg:contentType="application/vnd.openxmlformats-package.relationships+xml" pkg:padding="256"&gt;&lt;pkg:xmlData&gt;&lt;Relationships\n' +
		'        xmlns="http://schemas.openxmlformats.org/package/2006/relationships"&gt;&lt;Relationship Id="rId1"\n' +
		'        Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/&gt;&lt;/Relationships&gt;&lt;/pkg:xmlData&gt;&lt;/pkg:part&gt;&lt;pkg:part\n' +
		'        pkg:name="/word/styles.xml"\n' +
		'        pkg:contentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"&gt;&lt;pkg:xmlData&gt;&lt;w:styles\n' +
		'        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"\n' +
		'        xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"\n' +
		'        xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"\n' +
		'        xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"\n' +
		'        xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml"\n' +
		'        xmlns:w16cex="http://schemas.microsoft.com/office/word/2018/wordml/cex"\n' +
		'        xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid"\n' +
		'        xmlns:w16="http://schemas.microsoft.com/office/word/2018/wordml"\n' +
		'        xmlns:w16sdtdh="http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash"\n' +
		'        xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" mc:Ignorable="w14 w15 w16se w16cid w16\n' +
		'        w16cex w16sdtdh"&gt;&lt;w:docDefaults&gt;&lt;w:rPrDefault&gt;&lt;w:rPr&gt;&lt;w:rFonts w:asciiTheme="minorHAnsi"\n' +
		'        w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorBidi"/&gt;&lt;w:sz w:val="22"/&gt;&lt;w:szCs\n' +
		'        w:val="22"/&gt;&lt;w:lang w:val="ru-RU" w:eastAsia="en-US" w:bidi="ar-SA"/&gt;&lt;/w:rPr&gt;&lt;/w:rPrDefault&gt;&lt;w:pPrDefault&gt;&lt;w:pPr&gt;&lt;w:spacing\n' +
		'        w:after="160" w:line="259" w:lineRule="auto"/&gt;&lt;/w:pPr&gt;&lt;/w:pPrDefault&gt;&lt;/w:docDefaults&gt;&lt;w:style\n' +
		'        w:type="paragraph" w:default="1" w:styleId="a"&gt;&lt;w:name w:val="Normal"/&gt;&lt;w:qFormat/&gt;&lt;w:pPr&gt;&lt;w:spacing\n' +
		'        w:after="200" w:line="276" w:lineRule="auto"/&gt;&lt;/w:pPr&gt;&lt;/w:style&gt;&lt;w:style w:type="character"\n' +
		'        w:default="1" w:styleId="a0"&gt;&lt;w:name w:val="Default Paragraph Font"/&gt;&lt;w:uiPriority w:val="1"/&gt;&lt;w:semiHidden/&gt;&lt;w:unhideWhenUsed/&gt;&lt;/w:style&gt;&lt;w:style\n' +
		'        w:type="table" w:default="1" w:styleId="a1"&gt;&lt;w:name w:val="Normal Table"/&gt;&lt;w:uiPriority w:val="99"/&gt;&lt;w:semiHidden/&gt;&lt;w:unhideWhenUsed/&gt;&lt;w:tblPr&gt;&lt;w:tblInd\n' +
		'        w:w="0" w:type="dxa"/&gt;&lt;w:tblCellMar&gt;&lt;w:top w:w="0" w:type="dxa"/&gt;&lt;w:left w:w="108"\n' +
		'        w:type="dxa"/&gt;&lt;w:bottom w:w="0" w:type="dxa"/&gt;&lt;w:right w:w="108" w:type="dxa"/&gt;&lt;/w:tblCellMar&gt;&lt;/w:tblPr&gt;&lt;/w:style&gt;&lt;w:style\n' +
		'        w:type="numbering" w:default="1" w:styleId="a2"&gt;&lt;w:name w:val="No List"/&gt;&lt;w:uiPriority w:val="99"/&gt;&lt;w:semiHidden/&gt;&lt;w:unhideWhenUsed/&gt;&lt;/w:style&gt;&lt;/w:styles&gt;&lt;/pkg:xmlData&gt;&lt;/pkg:part&gt;&lt;/pkg:package&gt;\n' +
		'    </simpleText>\n' +
		'</documentData>'

		return start
	}
	function CreateContentControl()
	{
		let cc = new AscWord.CBlockLevelSdt(logicDocument);
		cc.SetPlaceholder(c_oAscDefaultPlaceholderName.Text);
		cc.ReplacePlaceHolderWithContent();
		cc.SetShowingPlcHdr(false);
		return cc;
	}
	function CreateFilledContentControl()
	{
		let cc = CreateContentControl();
		let docContent = cc.GetContent();
		docContent.ClearContent(false);

		let d1 = new AscWord.DataBinding();
		d1.prefixMappings = "xmlns:ns0='http://example.com/picture' ";
		d1.storeItemID = "{694325A8-B1C9-407B-A2C2-E2DD1740AA5E}";
		d1.xpath = "/ns0:documentData[1]/ns0:simpleText[1]";
		d1.storeItemCheckSum = "Gt6wYg==";
		cc.Pr.DataBinding = d1;

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
	function updateXML(strXml)
	{
		custom = new AscWord.CustomXml();
		custom.itemId ="{694325A8-B1C9-407B-A2C2-E2DD1740AA5E}";
		custom.uri = ['http://example.com/picture'];
		custom.content = proceedCustomXml(strXml);
		logicDocument.customXml.add(custom)
	}

	function formatXml(xml) {
		var formatted = '';
		var reg = /(>)(<)(\/*)/g;
		xml = xml.replace(reg, '$1\r\n$2$3');
		var pad = 0;
		jQuery.each(xml.split('\r\n'), function(index, node) {
			var indent = 0;
			if (node.match( /.+<\/\w[^>]*>$/ )) {
				indent = 0;
			} else if (node.match( /^<\/\w/ )) {
				if (pad != 0) {
					pad -= 1;
				}
			} else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
				indent = 1;
			} else {
				indent = 0;
			}

			var padding = '';
			for (var i = 0; i < pad; i++) {
				padding += '  ';
			}

			formatted += padding + node + '\r\n';
			pad += indent;
		});

		return formatted;
	}

	//todo  content control inside content control:
	//      picture
	//      richText
	//      simpleText
	//      checkBox

	window['asc_docs_api'] = AscCommon.baseEditorsApi;
	const editor = new AscCommon.baseEditorsApi({});

	QUnit.test("Load content from customXML", function (assert)
	{
		AscTest.ClearDocument();

		let c1 = CreateFilledContentControl();
		logicDocument.AddToContent(0, c1);
		updateXML(getXml(['Один два три 4 пять']))
		c1.checkDataBinding();
		CheckContentParagraph(assert, c1.Content.Content, ['Один два три 4 пять '])
	});

	QUnit.test("Load content from customXML", function (assert)
	{
		AscTest.ClearDocument();

		let c1 = CreateFilledContentControl();
		logicDocument.AddToContent(0, c1);
		updateXML(getXml(['Один два три 4 пять', '23']))
		c1.checkDataBinding();
		CheckContentParagraph(assert, c1.Content.Content, ['Один два три 4 пять ', '23 '])
	});

	QUnit.test("Save content to customXML", function (assert)
	{
		AscTest.ClearDocument();
		let c1 = CreateFilledContentControl();
		logicDocument.AddToContent(0, c1);
		c1.checkDataBinding();

		let doc = new AscTest.CreateLogicDocument();
		doc.ReplaceContent(c1.Content.Content);

		// let jsZlib = new AscCommon.ZLib();
		// jsZlib.create();
		// doc.toZip(jsZlib, new AscCommon.XmlWriterContext(AscCommon.c_oEditorId.Word));
		// let data = jsZlib.save();
		// let jsZlib2 = new AscCommon.ZLib();
		// jsZlib2.open(data);
		//
		// let openDoc = new AscCommon.openXml.OpenXmlPackage(jsZlib2, null);
		//
		// console.log(openDoc)

		let str = AscCommon.getCustomXmlFromContentControl(custom);
		str = str.replaceAll('&lt;', '<');
		str = str.replaceAll('&gt;', '>');

		console.log(str)
		console.log(formatXml(str))

		// check content of customXMl

		assert.strictEqual("save", false, "Check no format validation");
	});

});
