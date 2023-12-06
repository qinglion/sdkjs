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
			let tagName = namespaceAndTag.split(':')[1];

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
	}
	
	//--------------------------------------------------------export----------------------------------------------------
	window['AscWord'] = window['AscWord'] || {};
	window['AscWord'].CustomXmlManager = CustomXmlManager;
	
})(window);
