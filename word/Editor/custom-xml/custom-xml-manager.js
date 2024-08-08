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

(function(window)
{
	/**
	 * Класс представляющий текстовый символ
	 * @param {AscWord.CDocument} document
	 * @constructor
	 */
	function CustomXmlManager(document)
	{
		this.document = document;
		this.xml = [];
	}
	CustomXmlManager.prototype.add = function(customXml)
	{
		// TODO: Надо будет сделать этот метод с сохранением в историю, когда
		//       будем реализовывать возможность добавления таких xml во время работы
		this.xml.push(customXml);
	};
	CustomXmlManager.prototype.getCount = function()
	{
		return this.xml.length;
	};
	CustomXmlManager.prototype.getCustomXml = function(index)
	{
		return this.xml[index];
	};
	CustomXmlManager.prototype.findElementsByXPath = function (root, xpath)
	{
		let parts = xpath.split('/');
		parts.shift(); // Убираем пустой первый элемент

		let currentElement = root;

		for (let i = 0; i < parts.length; i++) {
			let part = parts[i];
			let namespaceAndTag = part.split('[')[0];
			let index = parseInt(part.split('[')[1].slice(0, -1)) - 1;
			let tagName = namespaceAndTag.includes(":") ? namespaceAndTag.split(':')[1] : namespaceAndTag;

			let matchingChildren = currentElement.content.filter(function (child) {
				let arr = child.name.split(":");
				if (arr.length > 1)
				{
					return arr[1] === tagName;
				}
				else
				{
					return arr[0] === tagName;
				}

			});

			if (matchingChildren.length <= index) {
				return null; // Элемент не найден
			}

			currentElement = matchingChildren[index];
		}

		return currentElement;
	}
	CustomXmlManager.prototype.getContentByDataBinding = function(dataBinding, oContentLink)
	{
		for (let i = 0; i < this.xml.length; ++i)
		{
			let customXml = this.xml[i];

			customXml.oContentLink = oContentLink;
			
			// этот атрибут может быть опущен, так искать плохо
			if (dataBinding.storeItemID === customXml.itemId)
			{
				let xPath = dataBinding.xpath;

				let content = this.findElementsByXPath(customXml.content, xPath);
				return content.textContent;
			}
		}
	};
	CustomXmlManager.prototype.setContentByDataBinding = function (dataBinding, data)
	{
		for (let i = 0; i < this.xml.length; ++i)
		{
			let customXml = this.xml[i];

			if (dataBinding.storeItemID === customXml.itemId)
			{
				let xPath = dataBinding.xpath;

				let content = this.findElementsByXPath(customXml.content, xPath);
				content.textContent = data;
			}
		}
	};
	CustomXmlManager.prototype.parseCustomXML = function (strCustomXml)
	{
		let oStax			= new StaxParser(strCustomXml);
		let oCurrentContent	= null;

		// switch to CT_Node
		function CustomXMLItem(par, name)
		{
			this.parent			= par;
			this.content		= [];
			this.name			= name ? name : "";
			this.attribute		= {};
			this.textContent	= "";
			this.current		= undefined;
			this.str			= "";

			this.AddAttribute = function (name, value)
			{
				this.attribute[name] = value;
			}
			this.AddContent = function (name)
			{
				let one			= new CustomXMLItem(this, name);
				oCurrentContent	= one;

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
				let buffer	= this.GetBuffer();
				let arr		= Array.prototype.slice.call(buffer.data.slice(1, buffer.pos));
				let str		= String.fromCharCode.apply(null, arr);
				str			= str.replaceAll("&quot;", "\"");
				str			= str.replaceAll("&amp;", "&");

				this.str = str;
				return str;
			}
			this.GetBuffer = function ()
			{
				let writer = new AscCommon.CMemory();
				let nTab = 0;

				function Write(content)
				{
					let current = null;

					if (!content.name)
					{
						writer.WriteXmlString("\x00<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
						current = content.content[0];
					}
					else
					{
						current = content;
					}

					for (let i = 0; i < nTab; i++)
					{
						writer.WriteXmlString("	");
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
						nTab++;
						if (i === 0)
							writer.WriteXmlString("\n");
						let curContent = current.content[i];
						Write(curContent);
						nTab--;
						writer.WriteXmlString("\n");
					}

					if (current.textContent)
						writer.WriteXmlStringEncode(current.textContent.toString().trim());

					writer.WriteXmlNodeEnd(current.name);
				}

				Write(this);
				return writer;
			}
		}

		let oParContent = oCurrentContent = new CustomXMLItem(null);

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

		return oParContent;
	};

	CustomXmlManager.prototype.getCustomXMLString = function(customXml)
	{
		function replaceSubstring(originalString, startPoint, endPoint, insertionString)
		{
			if (startPoint < 0 || endPoint >= originalString.length || startPoint > endPoint)
				return originalString;

			const prefix	= originalString.substring(0, startPoint);
			const suffix	= originalString.substring(endPoint + 1);

			return prefix + insertionString + suffix;
		}

		let oContent					= customXml.oContentLink;

		if (oContent.IsCheckBox() || oContent.IsDatePicker() || oContent.IsPicture() || oContent.IsDropDownList() || oContent.IsComboBox() || oContent.Pr.Text)
		{
			return customXml.content.GetStringFromBuffer();
		}
		else
		{
			let writer						= new AscCommon.CMemory();
			writer.context					= new AscCommon.XmlWriterContext(AscCommon.c_oEditorId.Word);
			writer.context.docSaveParams	= new DocSaveParams(undefined, undefined, false, undefined);

			let drawDoc						= new AscCommon.CDrawingDocument();
			drawDoc.m_oWordControl			= drawDoc;
			drawDoc.m_oWordControl.m_oApi	= window.editor;
			let doc 						= new AscWord.CDocument(drawDoc);

			doc.ReplaceContent(oContent.Content);

			let jsZlib						= new AscCommon.ZLib();
			jsZlib.create();
			doc.toZip(jsZlib, new AscCommon.XmlWriterContext(AscCommon.c_oEditorId.Word));

			let data 						= jsZlib.save();
			let jsZlib2						= new AscCommon.ZLib();
			jsZlib2.open(data);
			var openDoc						= new AscCommon.openXml.OpenXmlPackage(jsZlib2, null);

			let outputUString = "<?xml version=\"1.0\" standalone=\"yes\"?>\n" +
				"<?mso-application progid=\"Word.Document\"?>\n" +
				"<pkg:package xmlns:pkg=\"http://schemas.microsoft.com/office/2006/xmlPackage\">";

			jsZlib2.files.forEach(function(path) {
				if ((path === "_rels/.rels" || path === "word/document.xml" || path === "word/_rels/document.xml.rels") && !path.includes("glossary"))
				{
					let ctfBytes	= jsZlib2.getFile(path);
					let ctfText		= AscCommon.UTF8ArrayToString(ctfBytes, 0, ctfBytes.length);
					let type		= openDoc.getContentType(path);

					if (path === "word/_rels/document.xml.rels")
					{
						let text = '';
						let arrRelationships = openDoc.getRelationships();
						for (let i = 0; i < arrRelationships.length; i++)
						{
							let relation	= arrRelationships[i];
							let relId		= relation.relationshipId;
							let relType		= relation.relationshipType;
							let relTarget	= relation.target;
							if(i===0)
							{
								relType		= relType.replace("relationships\/officeDocument", "relationships\/styles");
								relTarget	= relTarget.replace("word/document.xml", "styles.xml");
							}

							text			+= "<Relationship Id=\"" + relId + "\" Type=\"" + relType + "\" Target=\"" + relTarget + "\"/>"
						}

						let nStart	= ctfText.indexOf("<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">", 0) + "<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">".length;
						let nEnd	= ctfText.indexOf("</Relationships>", nStart) - 1;
						ctfText		= replaceSubstring(ctfText, nStart, nEnd, text);
					}

					outputUString += "<pkg:part pkg:name=\"/" + path + "\" " +
						"pkg:contentType=\"" + type +"\"> " +
						"<pkg:xmlData>" + ctfText.replace("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>", "").replace("\n", "") + "</pkg:xmlData></pkg:part>"
				}
			});

			//check diffrences between main write and this, when save main document higlight write correct
			//	outputUString = outputUString.replace("FFFF00", "yellow");


			//need get contentType from openXml.Types
			outputUString = outputUString.replace("pkg:contentType=\"application/xml\"", "pkg:contentType=\"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml\"");
			outputUString = outputUString.replace("pkg:contentType=\"application/vnd.openxmlformats-package.relationships+xml\"", "pkg:contentType=\"application/vnd.openxmlformats-package.relationships+xml\" pkg:padding=\"512\"")
			outputUString = outputUString.replace("\"/word/_rels/document.xml.rels\"pkg:contentType=\"application/vnd.openxmlformats-package.relationships+xml\"", "\"/word/_rels/document.xml.rels\"pkg:contentType=\"application/vnd.openxmlformats-package.relationships+xml\" pkg:padding=\"256\"")

			outputUString += "</pkg:package>";

			//create flat xml
			outputUString = outputUString.replaceAll("<", "&lt;");
			outputUString = outputUString.replaceAll(">", "&gt;");

			let str = customXml.content.GetStringFromBuffer();
			let nStartIndex = str.indexOf("<simpleText>") + '<simpleText>'.length;
			let nEndIndex = str.indexOf("/pkg:package&gt;") + '/pkg:package&gt;'.length ;

			str = replaceSubstring(str, nStartIndex, nEndIndex, outputUString);

			// nStartIndex = str.indexOf("<simpleText>") + '<simpleText>'.length;
			// nEndIndex = str.indexOf("/pkg:package&gt;") + '/pkg:package&gt;'.length ;
			//customXml.oContentLink.Pr.DataBinding.recalculateCheckSum(str.substring(nStartIndex, nEndIndex));

			return str;
		}
	};
	
	//--------------------------------------------------------export----------------------------------------------------
	window['AscWord'] = window['AscWord'] || {};
	window['AscWord'].CustomXmlManager = CustomXmlManager;
	
})(window);
