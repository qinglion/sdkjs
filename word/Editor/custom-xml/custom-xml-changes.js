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

"use strict";

AscDFH.changesFactory[AscDFH.historyitem_type_CustomXML_Add]			= CChangesCustomXmlAdd;
AscDFH.changesFactory[AscDFH.historyitem_type_CustomXML_Remove]			= CChangesCustomXmlRemove;

AscDFH.changesFactory[AscDFH.historyitem_type_ChangeCustomXMLStart]			= CChangesStartCustomXml;
AscDFH.changesFactory[AscDFH.historyitem_type_ChangeCustomXMLPart]			= CChangesPartCustomXml;
AscDFH.changesFactory[AscDFH.historyitem_type_ChangeCustomXMLEnd]			= CChangesEndCustomXml;

AscDFH.changesRelationMap[AscDFH.historyitem_type_CustomXML_Add]		= [
	AscDFH.historyitem_type_CustomXML_Add,
	AscDFH.historyitem_type_CustomXML_Remove
];

AscDFH.changesRelationMap[AscDFH.historyitem_type_CustomXML_Remove]		= [
	AscDFH.historyitem_type_CustomXML_Add,
	AscDFH.historyitem_type_CustomXML_Remove
];

function CChangesStartCustomXml(Class, Old, New, Color) {
	AscDFH.CChangesBaseProperty.call(this, Class, Old, New, Color);
}
CChangesStartCustomXml.prototype = Object.create(AscDFH.CChangesBaseProperty.prototype);
CChangesStartCustomXml.prototype.constructor = CChangesStartCustomXml;
CChangesStartCustomXml.prototype.Type = AscDFH.historyitem_type_ChangeCustomXMLStart;
CChangesStartCustomXml.prototype.Undo = function () {
	if (!this.Class.partsOfCustomXml) {
		return this.Redo();
	}

	this.Class.m_aCustomXmlData = this.Class.partsOfCustomXml.reverse().join("");
	this.Class.addContentByXMLString(this.Class.m_aCustomXmlData);
	delete this.Class.partsOfCustomXml;
};
CChangesStartCustomXml.prototype.Redo = function () {
	if (this.Class.partsOfCustomXml) {
		return this.Undo();
	}
	this.Class.partsOfCustomXml = [];
};

function CChangesPartCustomXml(Class, Old, New, Color) {
	AscDFH.CChangesBaseProperty.call(this, Class, Old, New, Color);
}
CChangesPartCustomXml.prototype = Object.create(AscDFH.CChangesBaseProperty.prototype);
CChangesPartCustomXml.prototype.constructor = CChangesPartCustomXml;
CChangesPartCustomXml.prototype.Type = AscDFH.historyitem_type_ChangeCustomXMLPart;
CChangesPartCustomXml.prototype.private_SetValue = function (oPr) {
	if (oPr.length) {
		this.Class.partsOfCustomXml.push(oPr);
	}
};
CChangesPartCustomXml.prototype.WriteToBinary = function (Writer) {
	Writer.WriteString2(this.Old);
	Writer.WriteString2(this.New);
};
CChangesPartCustomXml.prototype.ReadFromBinary = function (Reader) {
	this.Old = Reader.GetString2();
	this.New = Reader.GetString2();
};

function CChangesEndCustomXml(Class, Old, New, Color) {
	AscDFH.CChangesBaseProperty.call(this, Class, Old, New, Color);
}
CChangesEndCustomXml.prototype = Object.create(AscDFH.CChangesBaseProperty.prototype);
CChangesEndCustomXml.prototype.constructor = CChangesEndCustomXml;
CChangesEndCustomXml.prototype.Type = AscDFH.historyitem_type_ChangeCustomXMLEnd;
CChangesEndCustomXml.prototype.Undo = function () {
	if (this.Class.partsOfCustomXml) {
		return this.Redo();
	}
	this.Class.partsOfCustomXml = [];
};
CChangesEndCustomXml.prototype.Redo = function () {
	if (!this.Class.partsOfCustomXml) {
		return this.Undo();
	}

	this.Class.m_aCustomXmlData = this.Class.partsOfCustomXml.join("");
	this.Class.addContentByXMLString(this.Class.m_aCustomXmlData);
	delete this.Class.partsOfCustomXml;
};

/**
 * @constructor
 * @extends {AscDFH.CChangesBase}
 */
function CChangesCustomXmlAdd(Class, Id, xml)
{
	AscDFH.CChangesBase.call(this, Class);

	this.Id		= Id;
	this.xml	= xml;
}
CChangesCustomXmlAdd.prototype = Object.create(AscDFH.CChangesBase.prototype);
CChangesCustomXmlAdd.prototype.constructor = CChangesCustomXmlAdd;
CChangesCustomXmlAdd.prototype.Type = AscDFH.historyitem_type_CustomXML_Add;
CChangesCustomXmlAdd.prototype.Undo = function()
{
	let oXml = this.Class.m_arrXmlById[this.Id];
	if (oXml)
	{
		delete this.Class.m_arrXmlById[this.Id];
		for (let i = 0; i < this.Class.xml.length; i++)
		{
			if (this.Class.xml[i] === oXml)
			{
				this.Class.xml.splice(i, 1);
			}
		}
	}
};
CChangesCustomXmlAdd.prototype.Redo = function()
{
	this.Class.m_arrXmlById[this.Id] = this.xml;
	this.Class.xml.push(this.xml);
};
CChangesCustomXmlAdd.prototype.WriteToBinary = function(Writer)
{
	// String : Id customXML
	Writer.WriteString2(this.Id);
};
CChangesCustomXmlAdd.prototype.ReadFromBinary = function(Reader)
{
	// String : Id customXML
	this.Id      = Reader.GetString2();
	this.xml = AscCommon.g_oTableId.Get_ById(this.Id);
};
CChangesCustomXmlAdd.prototype.CreateReverseChange = function()
{
	return new CChangesCustomXmlRemove(this.Class, this.Id, this.xml);
};
CChangesCustomXmlAdd.prototype.Merge = function(oChange)
{
	if (this.Class !== oChange.Class)
		return true;

	if ((AscDFH.historyitem_type_CustomXML_Add === oChange.Type || AscDFH.historyitem_type_CustomXML_Remove === oChange.Type) && this.Id === oChange.Id)
		return false;

	return true;
};

/**
 * @constructor
 * @extends {AscDFH.CChangesBase}
 */
function CChangesCustomXmlRemove(Class, Id, xml)
{
	AscDFH.CChangesBase.call(this, Class);

	this.Id		= Id;
	this.xml	= xml;
}
CChangesCustomXmlRemove.prototype = Object.create(AscDFH.CChangesBase.prototype);
CChangesCustomXmlRemove.prototype.constructor = CChangesCustomXmlRemove;
CChangesCustomXmlRemove.prototype.Type = AscDFH.historyitem_type_CustomXML_Remove;
CChangesCustomXmlRemove.prototype.Undo = function()
{
	this.Class.m_arrXmlById[this.Id] = this.xml;
	this.Class.xml.push(this.xml);
};
CChangesCustomXmlRemove.prototype.Redo = function()
{
	let xml = this.Class.m_arrXmlById[this.Id];
	if (xml)
	{
		delete this.Class.m_arrXmlById[this.Id];
		for (let i = 0; i < this.Class.xml.length; i++)
		{
			if (this.Class.xml[i] === xml)
			{
				this.Class.xml.splice(i, 1);
			}
		}
	}
};
CChangesCustomXmlRemove.prototype.WriteToBinary = function(Writer)
{
	// String : Id customXML
	Writer.WriteString2(this.Id);
};
CChangesCustomXmlRemove.prototype.ReadFromBinary = function(Reader)
{
	// String : Id customXML
	this.Id		= Reader.GetString2();
	this.xml	= AscCommon.g_oTableId.Get_ById(this.Id);
};
CChangesCustomXmlRemove.prototype.CreateReverseChange = function()
{
	return new CChangesCustomXmlAdd(this.Class, this.Id, this.xml);
};
CChangesCustomXmlRemove.prototype.Merge = function(oChange)
{
	if (this.Class !== oChange.Class)
		return true;

	if ((AscDFH.historyitem_type_CustomXML_Add === oChange.Type || AscDFH.historyitem_type_CustomXML_Remove === oChange.Type) && this.Id === oChange.Id)
		return false;

	return true;
};
