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
(function(window, document)
{
	const CBinaryFileWriter = window['AscCommon'].CBinaryFileWriter;

	function BinaryVSDYWriter()
	{
		this.memory = null;
		this.nRealTableCount = 0;
		this.nStart = 0;
		this.nLastFilePos = 0;

		this.Write = function(document)
		{
			let t = this;
			var writer = new AscCommon.CBinaryFileWriter();
			return writer.WriteDocument3(document, false, "VSDY", function () {
				t.WriteContent(writer, document);
			});
		};
		this.WriteContent = function(binaryFileWriter, document) {
			// Define table types
			const TABLE_TYPES = {
				DOCUMENT: 1,
				APP: 2,
				CORE: 3,
				CUSTOM_PROPERTIES: 4
			};
			this.memory = binaryFileWriter

			var nTableCount = 128;//Специально ставим большое число, чтобы не увеличивать его при добавлении очередной таблицы.
			this.nRealTableCount = 0;
			this.nStart = this.memory.GetCurPosition();
			//вычисляем с какой позиции можно писать таблицы
			var nmtItemSize = 5;//5 byte
			this.nLastFilePos = this.nStart + nTableCount * nmtItemSize;
			//Write mtLen
			this.memory.WriteUChar(0);

			var t = this;
			//Write SignatureTable
			if (document.app) {
				this.WriteTable(TABLE_TYPES.APP, {Write: function(){
						document.app.toStream(binaryFileWriter);
					}});
			}
			if (document.core) {
				this.WriteTable(TABLE_TYPES.CORE, {Write: function(){
						document.core.toStream(binaryFileWriter);
					}});
			}
			if (document.customProperties && document.customProperties.hasProperties()) {
				this.WriteTable(TABLE_TYPES.CUSTOM_PROPERTIES, {Write: function(){
						document.customProperties.toStream(binaryFileWriter);
					}});
			}
			this.WriteTable(TABLE_TYPES.DOCUMENT, {Write: function(){
					document.toPPTY(binaryFileWriter);
				}});

			//Пишем количество таблиц
			this.memory.Seek(this.nStart);
			this.memory.WriteUChar(this.nRealTableCount);

			//seek в конец, потому что GetBase64Memory заканчивает запись на текущей позиции.
			this.memory.Seek(this.nLastFilePos);
		}
		//todo remove coping
		this.WriteTable = function(type, oTableSer)
		{
			var nCurPos = this.WriteTableStart(type);
			oTableSer.Write();
			this.WriteTableEnd(nCurPos);
		}
		this.WriteTableStart = function(type)
		{
			//Write mtItem
			//Write mtiType
			this.memory.WriteUChar(type);
			//Write mtiOffBits
			this.memory.WriteULong(this.nLastFilePos);

			//Write table
			//Запоминаем позицию в MainTable
			var nCurPos = this.memory.GetCurPosition();
			//Seek в свободную область
			this.memory.Seek(this.nLastFilePos);
			return nCurPos;
		}
		this.WriteTableEnd = function(nCurPos)
		{
			//сдвигаем позицию куда можно следующую таблицу
			this.nLastFilePos = this.memory.GetCurPosition();
			//Seek вобратно в MainTable
			this.memory.Seek(nCurPos);

			this.nRealTableCount++;
		}
	}

	/**
	 * Write children to stream for CVisioDocument
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.CVisioDocument.prototype.writeChildren = function (pWriter) {
		// Write documentSettings
		pWriter.WriteRecordPPTY(0, this.documentSettings);
		
		// Write colors
		if (this.colors && this.colors.length > 0) {
			pWriter.StartRecord(1);
			for (let i = 0; i < this.colors.length; i++) {
				pWriter.WriteRecordPPTY(0, this.colors[i]);
			}
			pWriter.EndRecord();
		}
		
		// Write faceNames
		if (this.faceNames && this.faceNames.length > 0) {
			pWriter.StartRecord(2);
			for (let i = 0; i < this.faceNames.length; i++) {
				pWriter.WriteRecordPPTY(0, this.faceNames[i]);
			}
			pWriter.EndRecord();
		}
		
		// Write styleSheets
		if (this.styleSheets && this.styleSheets.length > 0) {
			pWriter.StartRecord(3);
			for (let i = 0; i < this.styleSheets.length; i++) {
				pWriter.WriteRecordPPTY(0, this.styleSheets[i]);
			}
			pWriter.EndRecord();
		}
		
		// Write documentSheet
		pWriter.WriteRecordPPTY(4, this.documentSheet);
		
		// Write eventList
		if (this.eventList && this.eventList.length > 0) {
			pWriter.StartRecord(5);
			for (let i = 0; i < this.eventList.length; i++) {
				pWriter.WriteRecordPPTY(0, this.eventList[i]);
			}
			pWriter.EndRecord();
		}
		
		// Write headerFooter
		pWriter.WriteRecordPPTY(6, this.headerFooter);
		
		// Write masters
		pWriter.WriteRecordPPTY(7, this.masters);
		
		// Write pages
		pWriter.WriteRecordPPTY(8, this.pages);
		
		// Write dataConnections
		if (this.dataConnections) {
			pWriter.StartRecord(9);
			pWriter.WriteRecordPPTY(0, this.dataConnections);
			pWriter.EndRecord();
		}
		
		// Write dataRecordSets
		if (this.dataRecordSets) {
			pWriter.StartRecord(10);
			pWriter.WriteRecordPPTY(0, this.dataRecordSets);
			pWriter.EndRecord();
		}
		
		// Write solutions
		if (this.solutions) {
			pWriter.StartRecord(11);
			pWriter.WriteRecordPPTY(0, this.solutions);
			pWriter.EndRecord();
		}
		
		// Write validation
		pWriter.WriteRecordPPTY(12, this.validation);
		
		// Write commentsPart
		pWriter.StartRecord(13);
		pWriter.WriteRecordPPTY(0, this.commentsPart);
		pWriter.EndRecord();
		
		// Write windows
		pWriter.StartRecord(14);
		pWriter.WriteRecordPPTY(0, this.windows);
		pWriter.EndRecord();
		
		// todo Write themes
		// if (this.themes) {
		// 	for (let i = 0; i < this.themes.length; i++) {
		// 		pWriter.StartRecord(15);
		// 		pWriter.binaryPPTYWriter.WriteTheme(this.themes[i]);
		// 		pWriter.EndRecord();
		// 	}
		// }
	};

	/**
	 * Write attributes to stream for CWindows
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.CWindows.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteUInt2(0, this.clientWidth);
		pWriter._WriteUInt2(1, this.clientHeight);
	};

	/**
	 * Write children to stream for CWindows
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.CWindows.prototype.writeChildren = function (pWriter) {
		if (this.window) {
			for (let i = 0; i < this.window.length; i++) {
				pWriter.WriteRecordPPTY(0, this.window[i]);
			}
		}
	};

	/**
	 * Write children to stream for CMasters
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.CMasters.prototype.writeChildren = function (pWriter) {
		if (this.master) {
			for (let i = 0; i < this.master.length; i++) {
				pWriter.WriteRecordPPTY(0, this.master[i]);
			}
		}
	};

	/**
	 * Write children to stream for CPageContents
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.CPageContents.prototype.writeChildren = function (pWriter) {
		// Write shapes
		if (this.shapes && this.shapes.length > 0) {
			pWriter.StartRecord(0);
			for (let i = 0; i < this.shapes.length; i++) {
				pWriter.WriteRecordPPTY(0, this.shapes[i]);
			}
		}
		pWriter.EndRecord();
		
		// Write connects
		if (this.connects && this.connects.length > 0) {
			pWriter.StartRecord(1);
			for (let i = 0; i < this.connects.length; i++) {
				pWriter.WriteRecordPPTY(0, this.connects[i]);
			}
			pWriter.EndRecord();
		}
		pWriter.EndRecord();
	};

	/**
	 * Write children to stream for CMasterContents
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.CMasterContents.prototype.writeChildren = function (pWriter) {
		// Write shapes
		if (this.shapes && this.shapes.length > 0) {
			pWriter.StartRecord(0);
			for (let i = 0; i < this.shapes.length; i++) {
				pWriter.WriteRecordPPTY(0, this.shapes[i]);
			}
			pWriter.EndRecord();
		}
		
		// Write connects
		if (this.connects && this.connects.length > 0) {
			pWriter.StartRecord(1);
			for (let i = 0; i < this.connects.length; i++) {
				pWriter.WriteRecordPPTY(0, this.connects[i]);
			}
			pWriter.EndRecord();
		}
	};


	/**
	 * Write children to stream for CPages
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.CPages.prototype.writeChildren = function (pWriter) {
		if (this.page) {
			for (let i = 0; i < this.page.length; i++) {
				pWriter.WriteRecordPPTY(0, this.page[i]);
			}
		}
	};

	/**
	 * Write attributes to stream for StyleSheet_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.StyleSheet_Type.prototype.privateWriteAttributes = function (pWriter) {
        pWriter._WriteUInt2(0, this.id);
        pWriter._WriteString2(1, this.nameU);
        pWriter._WriteString2(2, this.name);
		pWriter._WriteBool2(3, this.isCustomName);
		pWriter._WriteBool2(4, this.isCustomNameU);
		pWriter._WriteUInt2(5, this.lineStyle);
		pWriter._WriteUInt2(6, this.fillStyle);
		pWriter._WriteUInt2(7, this.textStyle);
    };
	/**
	 * Write children to stream for StyleSheet_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.StyleSheet_Type.prototype.writeChildren = function (pWriter) {
		this.elements.forEach(function(elem) {
			switch (elem.kind) {
				case c_oVsdxSheetStorageKind.Cell_Type:
					pWriter.WriteRecordPPTY(0, elem);
					break;
				case c_oVsdxSheetStorageKind.Trigger_Type:
					pWriter.WriteRecordPPTY(1, elem);
					break;
				case c_oVsdxSheetStorageKind.Section_Type:
					pWriter.WriteRecordPPTY(2, elem);
					break;
			}
		});
    };

	/**
	 * Write attributes to stream for CComments
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.CComments.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteBool2(0, this.showCommentTags);
	};

	/**
	 * Write children to stream for CComments
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.CComments.prototype.writeChildren = function (pWriter) {
		// Write authorList
		if (this.authorList && this.authorList.length > 0) {
			pWriter.StartRecord(0);
			for (let i = 0; i < this.authorList.length; i++) {
				pWriter.WriteRecordPPTY(0, this.authorList[i]);
			}
			pWriter.EndRecord();
		}
		
		// Write commentList
		if (this.commentList && this.commentList.length > 0) {
			pWriter.StartRecord(1);
			for (let i = 0; i < this.commentList.length; i++) {
				pWriter.WriteRecordPPTY(0, this.commentList[i]);
			}
			pWriter.EndRecord();
		}
	};

	/**
	 * Write attributes to stream for CDataConnections
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.CDataConnections.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteUInt2(0, this.nextID);
	};

	/**
	 * Write children to stream for CDataConnections
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.CDataConnections.prototype.writeChildren = function (pWriter) {
		if (this.dataConnection) {
			for (let i = 0; i < this.dataConnection.length; i++) {
				pWriter.WriteRecordPPTY(0, this.dataConnection[i]);
			}
		}
	};

	/**
	 * Write attributes to stream for CDataRecordSets
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.CDataRecordSets.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteUInt2(0, this.nextID);
		pWriter._WriteUInt2(1, this.activeRecordsetID);
		pWriter._WriteString2(2, this.dataWindowOrder);
	};

	/**
	 * Write children to stream for CDataRecordSets
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.CDataRecordSets.prototype.writeChildren = function (pWriter) {
		if (this.dataRecordSet) {
			for (let i = 0; i < this.dataRecordSet.length; i++) {
				pWriter.WriteRecordPPTY(0, this.dataRecordSet[i]);
			}
		}
	};

	/**
	 * Write children to stream for CValidation
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.CValidation.prototype.writeChildren = function (pWriter) {
		// Write validationProperties
		pWriter.WriteRecordPPTY(0, this.validationProperties);
		
		// Write ruleSets
		if (this.ruleSets && this.ruleSets.length > 0) {
			pWriter.StartRecord(1);
			for (let i = 0; i < this.ruleSets.length; i++) {
				pWriter.WriteRecordPPTY(0, this.ruleSets[i]);
			}
			pWriter.EndRecord();
		}
		
		// Write issues
		if (this.issues && this.issues.length > 0) {
			pWriter.StartRecord(2);
			for (let i = 0; i < this.issues.length; i++) {
				pWriter.WriteRecordPPTY(0, this.issues[i]);
			}
			pWriter.EndRecord();
		}
	};

	/**
	 * Write children to stream for Comments_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Comments_Type.prototype.writeChildren = function (pWriter) {
		// In the readChild method, there's a comment about C++ initializing Comments
		// and calling fromPPTY. We'll implement a placeholder for element type 0.
		pWriter.WriteRecordPPTY(0, this.comment);
	};

	/**
	 * Write attributes to stream for RuleTest_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.RuleTest_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.value);
	};

	/**
	 * Write children to stream for RuleTest_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.RuleTest_Type.prototype.writeChildren = function (pWriter) {
		// No children to write based on the readChild implementation
	};

	/**
	 * Write attributes to stream for RuleFilter_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.RuleFilter_Type.prototype.privateWriteAttributes = AscVisio.RuleTest_Type.prototype.privateWriteAttributes;

	/**
	 * Write children to stream for RuleFilter_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.RuleFilter_Type.prototype.writeChildren = function (pWriter) {
		// No children to write based on the readChild implementation
	};

	/**
	 * Write attributes to stream for RowKeyValue_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.RowKeyValue_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteUInt2(0, this.rowID);
		pWriter._WriteString2(1, this.value);
	};

	/**
	 * Write children to stream for RowKeyValue_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.RowKeyValue_Type.prototype.writeChildren = function (pWriter) {
		// No children to write based on the readChild implementation
	};

	/**
	 * Write attributes to stream for DataColumn_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.DataColumn_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.columnNameID);
		pWriter._WriteString2(1, this.name);
		pWriter._WriteString2(2, this.label);
		pWriter._WriteString2(3, this.origLabel);
		// Note: langID is skipped in the reader as a TODO
		pWriter._WriteUInt2(5, this.calendar);
		pWriter._WriteUInt2(6, this.dataType);
		pWriter._WriteString2(7, this.unitType);
		pWriter._WriteUInt2(8, this.currency);
		pWriter._WriteUInt2(9, this.degree);
		pWriter._WriteUInt2(10, this.displayWidth);
		pWriter._WriteUInt2(11, this.displayOrder);
		pWriter._WriteBool2(12, this.mapped);
		pWriter._WriteBool2(13, this.hyperlink);
	};

	/**
	 * Write children to stream for DataColumn_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.DataColumn_Type.prototype.writeChildren = function (pWriter) {
		// No children to write based on the readChild implementation
	};

	/**
	 * Write attributes to stream for RuleInfo_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.RuleInfo_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteUInt2(0, this.ruleID);
		pWriter._WriteUInt2(1, this.ruleSetID);
	};

	/**
	 * Write children to stream for RuleInfo_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.RuleInfo_Type.prototype.writeChildren = function (pWriter) {
		// No children to write based on the readChild implementation
	};

	/**
	 * Write attributes to stream for IssueTarget_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.IssueTarget_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteUInt2(0, this.pageID);
		pWriter._WriteUInt2(1, this.shapeID);
	};

	/**
	 * Write children to stream for IssueTarget_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.IssueTarget_Type.prototype.writeChildren = function (pWriter) {
		// No children to write based on the readChild implementation
	};

	/**
	 * Write attributes to stream for Rule_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Rule_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteUInt2(0, this.id);
		pWriter._WriteString2(1, this.category);
		pWriter._WriteString2(2, this.nameU);
		pWriter._WriteBool2(3, this.ignored);
		pWriter._WriteString2(4, this.description);
		pWriter._WriteInt2(5, this.ruleTarget);
	};

	/**
	 * Write children to stream for Rule_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Rule_Type.prototype.writeChildren = function (pWriter) {
		// Write ruleFilter
		pWriter.WriteRecordPPTY(0, this.ruleFilter);
		
		// Write ruleTest
		pWriter.WriteRecordPPTY(1, this.ruleTest);
	};

	/**
	 * Write attributes to stream for RuleSetFlags_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.RuleSetFlags_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteBool2(0, this.hidden);
	};

	/**
	 * Write children to stream for RuleSetFlags_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.RuleSetFlags_Type.prototype.writeChildren = function (pWriter) {
		// No children to write based on the readChild implementation
	};

	/**
	 * Write attributes to stream for RowMap_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.RowMap_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteUInt2(0, this.rowID);
		pWriter._WriteUInt2(1, this.pageID);
		pWriter._WriteUInt2(2, this.shapeID);
	};

	/**
	 * Write children to stream for RowMap_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.RowMap_Type.prototype.writeChildren = function (pWriter) {
		// No children to write based on the readChild implementation
	};

	/**
	 * Write attributes to stream for PrimaryKey_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.PrimaryKey_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.columnNameID);
	};

	/**
	 * Write children to stream for PrimaryKey_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.PrimaryKey_Type.prototype.writeChildren = function (pWriter) {
		// Write rowKeyValue elements
		if (this.rowKeyValue) {
			for (let i = 0; i < this.rowKeyValue.length; i++) {
				pWriter.WriteRecordPPTY(0, this.rowKeyValue[i]);
			}
		}
	};

	/**
	 * Write attributes to stream for DataColumns_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.DataColumns_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.sortColumn);
		pWriter._WriteBool2(1, this.sortAsc);
	};

	/**
	 * Write children to stream for DataColumns_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.DataColumns_Type.prototype.writeChildren = function (pWriter) {
		// Write dataColumn elements
		if (this.dataColumn) {
			for (let i = 0; i < this.dataColumn.length; i++) {
				pWriter.WriteRecordPPTY(0, this.dataColumn[i]);
			}
		}
	};

	/**
	 * Write to binary format for Icon_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Icon_Type.prototype.toPPTY = function (pWriter) {
		pWriter.StartRecord(0);
		pWriter._WriteString2(0, this.value);
		pWriter.EndRecord();
	};

	/**
	 * Write attributes to stream for PageSheet_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.PageSheet_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.uniqueID);
		pWriter._WriteUInt2(1, this.lineStyle);
		pWriter._WriteUInt2(2, this.fillStyle);
		pWriter._WriteUInt2(3, this.textStyle);
	};

	/**
	 * Write children to stream for PageSheet_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.PageSheet_Type.prototype.writeChildren = function (pWriter) {
		// Write elements (cells, triggers, sections)
		if (this.elements) {
			for (let key in this.elements) {
				if (this.elements.hasOwnProperty(key)) {
					const element = this.elements[key];
					if (element instanceof AscVisio.Cell_Type) {
						pWriter.WriteRecordPPTY(0, element);
					} else if (element instanceof AscVisio.Trigger_Type) {
						pWriter.WriteRecordPPTY(1, element);
					} else if (element instanceof AscVisio.Section_Type) {
						pWriter.WriteRecordPPTY(2, element);
					}
				}
			}
		}
	};

	/**
	 * Write attributes to stream for tp_Type (Text Properties Type)
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.tp_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteUInt2(0, this.iX);
	};

	/**
	 * Write children to stream for tp_Type (Text Properties Type)
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.tp_Type.prototype.writeChildren = function (pWriter) {
		// No children to write based on the implementation in SerializeReader.js
	};

	/**
	 * Write attributes to stream for pp_Type (Text Paragraph Properties Type)
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.pp_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteUInt2(0, this.iX);
	};

	/**
	 * Write children to stream for pp_Type (Text Paragraph Properties Type)
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.pp_Type.prototype.writeChildren = function (pWriter) {
		// No children to write based on the implementation in SerializeReader.js
	};

	/**
	 * Write attributes to stream for fld_Type (Text Field Type)
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.fld_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteUInt2(0, this.iX);
		pWriter._WriteString2(1, this.value);
	};

	/**
	 * Write children to stream for fld_Type (Text Field Type)
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.fld_Type.prototype.writeChildren = function (pWriter) {
		// No children to write based on the implementation in SerializeReader.js
	};

	/**
	 * Write attributes to stream for cp_Type (Character Properties Type)
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.cp_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteUInt2(0, this.iX);
	};

	/**
	 * Write children to stream for cp_Type (Character Properties Type)
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.cp_Type.prototype.writeChildren = function (pWriter) {
		// No children to write based on the implementation in SerializeReader.js
	};

	/**
	 * Write attributes to stream for CommentEntry_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.CommentEntry_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteUInt2(0, this.authorID);
		pWriter._WriteUInt2(1, this.pageID);
		pWriter._WriteUInt2(2, this.shapeID);
		pWriter._WriteString2(3, this.date);
		pWriter._WriteString2(4, this.editDate);
		pWriter._WriteUInt2(5, this.commentID);
		pWriter._WriteUInt2(6, this.autoCommentType);
		pWriter._WriteString2(7, this.value);
	};

	/**
	 * Write children to stream for CommentEntry_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.CommentEntry_Type.prototype.writeChildren = function (pWriter) {
		// No children to write based on the implementation in SerializeReader.js
	};

	/**
	 * Write attributes to stream for AuthorEntry_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.AuthorEntry_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteUInt2(0, this.id);
		pWriter._WriteString2(1, this.name);
		pWriter._WriteString2(2, this.initials);
		pWriter._WriteString2(3, this.resolutionID);
	};

	/**
	 * Write children to stream for AuthorEntry_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.AuthorEntry_Type.prototype.writeChildren = function (pWriter) {
		// No children to write based on the implementation in SerializeReader.js
	};

	/**
	 * Write attributes to stream for Issue_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Issue_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteUInt2(0, this.id);
		pWriter._WriteBool2(1, this.ignored);
	};

	/**
	 * Write children to stream for Issue_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Issue_Type.prototype.writeChildren = function (pWriter) {
		// Write issueTarget
		pWriter.WriteRecordPPTY(0, this.issueTarget);
		
		// Write ruleInfo
		pWriter.WriteRecordPPTY(1, this.ruleInfo);
	};

	// 	/**
	//  * Write attributes to stream for CText_text
	//  *
	//  * @param {CBinaryFileWriter} pWriter - The binary writer
	//  */
	// AscVisio.CText_text.prototype.privateWriteAttributes = function (pWriter) {
	// 	pWriter._WriteUInt2(0, this.cp);
	// 	pWriter._WriteUInt2(1, this.pp);
	// 	pWriter._WriteUInt2(2, this.tp);
	// };
	//
	// /**
	//  * Write children to stream for CText_text
	//  *
	//  * @param {CBinaryFileWriter} pWriter - The binary writer
	//  */
	// AscVisio.CText_text.prototype.writeChildren = function (pWriter) {
	// 	pWriter._WriteString2(0, this.text);
	//
	// 	// Write fields if present
	// 	if (this.fields) {
	// 		pWriter.StartRecord(1);
	// 		for (let i = 0; i < this.fields.length; i++) {
	// 			pWriter.WriteRecordPPTY(0, this.fields[i]);
	// 		}
	// 		pWriter.EndRecord();
	// 	}
	// };
	//
	// /**
	//  * Write children to stream for CShapes
	//  *
	//  * @param {CBinaryFileWriter} pWriter - The binary writer
	//  */
	// AscVisio.CShapes.prototype.writeChildren = function (pWriter) {
	// 	if (this.shapes) {
	// 		for (let i = 0; i < this.shapes.length; i++) {
	// 			pWriter.WriteRecordPPTY(0, this.shapes[i]);
	// 		}
	// 	}
	// };
	//
	// /**
	//  * Write children to stream for CEventList
	//  *
	//  * @param {CBinaryFileWriter} pWriter - The binary writer
	//  */
	// AscVisio.CEventList.prototype.writeChildren = function (pWriter) {
	// 	if (this.events) {
	// 		for (let i = 0; i < this.events.length; i++) {
	// 			pWriter.WriteRecordPPTY(0, this.events[i]);
	// 		}
	// 	}
	// };
	//
	// /**
	//  * Write children to stream for CStyleSheets
	//  *
	//  * @param {CBinaryFileWriter} pWriter - The binary writer
	//  */
	// AscVisio.CStyleSheets.prototype.writeChildren = function (pWriter) {
	// 	if (this.styleSheets) {
	// 		for (let i = 0; i < this.styleSheets.length; i++) {
	// 			pWriter.WriteRecordPPTY(0, this.styleSheets[i]);
	// 		}
	// 	}
	// };
	//
	// /**
	//  * Write children to stream for CColors
	//  *
	//  * @param {CBinaryFileWriter} pWriter - The binary writer
	//  */
	// AscVisio.CColors.prototype.writeChildren = function (pWriter) {
	// 	if (this.colors) {
	// 		for (let i = 0; i < this.colors.length; i++) {
	// 			pWriter.WriteRecordPPTY(0, this.colors[i]);
	// 		}
	// 	}
	// };
	//
	// 	/**
	//  * Write children to stream for CFaceNames
	//  *
	//  * @param {CBinaryFileWriter} pWriter - The binary writer
	//  */
	// AscVisio.CFaceNames.prototype.writeChildren = function (pWriter) {
	// 	if (this.faceNames) {
	// 		for (let i = 0; i < this.faceNames.length; i++) {
	// 			pWriter.WriteRecordPPTY(0, this.faceNames[i]);
	// 		}
	// 	}
	// };

	/**
	 * Write attributes to stream for Issue_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Issue_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.id);
		pWriter._WriteString2(1, this.ignored);
		pWriter._WriteString2(2, this.ruleID);
	};

	/**
	 * Write children to stream for Issue_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Issue_Type.prototype.writeChildren = function (pWriter) {
		// Write targets if present
		if (this.targets && this.targets.length > 0) {
			pWriter.StartRecord(0);
			for (let i = 0; i < this.targets.length; i++) {
				pWriter.WriteRecordPPTY(0, this.targets[i]);
			}
			pWriter.EndRecord();
		}
	};

	/**
	 * Write attributes to stream for RuleSet_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.RuleSet_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.id);
		pWriter._WriteString2(1, this.name);
		pWriter._WriteString2(2, this.namespace);
		pWriter._WriteString2(3, this.description);
		pWriter._WriteString2(4, this.enabled);
	};

	/**
	 * Write children to stream for RuleSet_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.RuleSet_Type.prototype.writeChildren = function (pWriter) {
		// Write ruleSetFlags if present
		pWriter.WriteRecordPPTY(0, this.ruleSetFlags);
		
		// Write rules if present
		if (this.rules) {
			pWriter.StartRecord(1);
			for (let i = 0; i < this.rules.length; i++) {
				pWriter.WriteRecordPPTY(0, this.rules[i]);
			}
			pWriter.EndRecord();
		}
	};

	/**
	 * Write attributes to stream for ValidationProperties_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.ValidationProperties_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.showIgnored);
		pWriter._WriteString2(1, this.lastValidated);
		pWriter._WriteString2(2, this.showPerPage);
	};

	/**
	 * Write children to stream for ValidationProperties_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.ValidationProperties_Type.prototype.writeChildren = function (pWriter) {
		// Implementation left intentionally empty as there are no child elements to write
	};

	/**
	 * Write attributes to stream for DataRecordSet_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.DataRecordSet_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.id);
		pWriter._WriteString2(1, this.connectionID);
		pWriter._WriteString2(2, this.name);
		pWriter._WriteString2(3, this.nextRowID);
		pWriter._WriteString2(4, this.refreshConflict);
		pWriter._WriteString2(5, this.refreshNoReconciliationUI);
		pWriter._WriteString2(6, this.rowOrder);
		pWriter._WriteString2(7, this.timeout);
	};

	/**
	 * Write children to stream for DataRecordSet_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.DataRecordSet_Type.prototype.writeChildren = function (pWriter) {
		// Write dataColumns if present
		pWriter.WriteRecordPPTY(0, this.dataColumns);
		
		// Write primaryKey if present
		pWriter.WriteRecordPPTY(1, this.primaryKey);
		
		// Write rowMaps if present
		if (this.rowMaps) {
			pWriter.StartRecord(2);
			for (let i = 0; i < this.rowMaps.length; i++) {
				pWriter.WriteRecordPPTY(0, this.rowMaps[i]);
			}
			pWriter.EndRecord();
		}
		
		// Write refreshConflicts if present
		if (this.refreshConflicts) {
			pWriter.StartRecord(3);
			for (let i = 0; i < this.refreshConflicts.length; i++) {
				pWriter.WriteRecordPPTY(0, this.refreshConflicts[i]);
			}
			pWriter.EndRecord();
		}
		
		// Write autoLinkComparisons if present
		if (this.autoLinkComparisons) {
			pWriter.StartRecord(4);
			for (let i = 0; i < this.autoLinkComparisons.length; i++) {
				pWriter.WriteRecordPPTY(0, this.autoLinkComparisons[i]);
			}
			pWriter.EndRecord();
		}
	};

		/**
	 * Write attributes to stream for DataConnection_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.DataConnection_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.id);
		pWriter._WriteString2(1, this.fileName);
		pWriter._WriteString2(2, this.connectionString);
		pWriter._WriteString2(3, this.command);
		pWriter._WriteString2(4, this.timeRefreshed);
		pWriter._WriteString2(5, this.commandType);
	};

	/**
	 * Write children to stream for DataConnection_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.DataConnection_Type.prototype.writeChildren = function (pWriter) {
		// Write adoData if present
		pWriter.WriteRecordPPTY(0, this.adoData);
	};

	/**
	 * Write attributes to stream for Solution_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Solution_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.name);
	};

	/**
	 * Write children to stream for Solution_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Solution_Type.prototype.writeChildren = function (pWriter) {
		// Write solutionXMLs if present
		if (this.solutionXMLs) {
			pWriter.StartRecord(0);
			for (let i = 0; i < this.solutionXMLs.length; i++) {
				pWriter.WriteRecordPPTY(0, this.solutionXMLs[i]);
			}
			pWriter.EndRecord();
		}
	};

	/**
	 * Write attributes to stream for Window_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Window_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.id);
		pWriter._WriteInt2(1, this.sheet);
		pWriter._WriteString2(2, this.viewScale);
		pWriter._WriteString2(3, this.viewCenterX);
		pWriter._WriteString2(4, this.viewCenterY);
		pWriter._WriteString2(5, this.containerType);
		pWriter._WriteString2(6, this.showRulers);
		pWriter._WriteString2(7, this.showGrid);
		pWriter._WriteString2(8, this.showPageBreaks);
		pWriter._WriteString2(9, this.showGuides);
		pWriter._WriteString2(10, this.glueType);
		pWriter._WriteString2(11, this.stbVisible);
		pWriter._WriteString2(12, this.stbWidth);
		pWriter._WriteString2(13, this.dynFeedback);
		pWriter._WriteString2(14, this.drawingResizable);
		pWriter._WriteString2(15, this.drawingOrientation);
		pWriter._WriteString2(16, this.windowTop);
		pWriter._WriteString2(17, this.windowLeft);
		pWriter._WriteString2(18, this.windowWidth);
		pWriter._WriteString2(19, this.windowHeight);
		pWriter._WriteString2(20, this.windowState);
		pWriter._WriteString2(21, this.dockedStencilPos);
		pWriter._WriteString2(22, this.dockedStencilSize);
		pWriter._WriteString2(23, this.previousDockedStencilSize);
		pWriter._WriteString2(24, this.stencilHasDynamics);
		pWriter._WriteString2(25, this.containerID);
		pWriter._WriteString2(26, this.dynamicsOn);
		pWriter._WriteString2(27, this.pageVisible);
		pWriter._WriteString2(28, this.tabSplitterPos);
		pWriter._WriteString2(29, this.tabsVisible);
	};

	/**
	 * Write children to stream for Window_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Window_Type.prototype.writeChildren = function (pWriter) {
		// Implementation left intentionally empty as there are no child elements to write
	};

	/**
	 * Write attributes to stream for Page_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Page_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.id);
		pWriter._WriteString2(1, this.name);
		pWriter._WriteString2(2, this.nameU);
		pWriter._WriteString2(3, this.background);
		pWriter._WriteString2(4, this.backgroundPage);
		pWriter._WriteString2(5, this.viewCenterX);
		pWriter._WriteString2(6, this.viewCenterY);
		pWriter._WriteString2(7, this.viewScale);
	};

	/**
	 * Write children to stream for Page_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Page_Type.prototype.writeChildren = function (pWriter) {
		// Write pageSheet if present
		pWriter.WriteRecordPPTY(0, this.pageSheet);
		
		// Write rel if present
		pWriter.WriteRecordPPTY(1, this.rel);
	};

	/**
	 * Write attributes to stream for Connect_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Connect_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.fromCell);
		pWriter._WriteString2(1, this.toCell);
		pWriter._WriteString2(2, this.fromSheet);
		pWriter._WriteString2(3, this.toSheet);
	};

	/**
	 * Write children to stream for Connect_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Connect_Type.prototype.writeChildren = function (pWriter) {
		// Implementation left intentionally empty as there are no child elements to write
	};

		/**
	 * Write attributes to stream for Shape_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Shape_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.id);
		pWriter._WriteString2(1, this.type);
		pWriter._WriteString2(2, this.master);
		pWriter._WriteString2(3, this.lineStyle);
		pWriter._WriteString2(4, this.fillStyle);
		pWriter._WriteString2(5, this.textStyle);
	};

	/**
	 * Write children to stream for Shape_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Shape_Type.prototype.writeChildren = function (pWriter) {
		// Write cells
		if (this.cells && this.cells.length > 0) {
			pWriter.StartRecord(0);
			for (let i = 0; i < this.cells.length; i++) {
				pWriter.WriteRecordPPTY(0, this.cells[i]);
			}
			pWriter.EndRecord();
		}
		
		// Write sections
		if (this.sections && this.sections.length > 0) {
			pWriter.StartRecord(1);
			for (let i = 0; i < this.sections.length; i++) {
				pWriter.WriteRecordPPTY(0, this.sections[i]);
			}
			pWriter.EndRecord();
		}
		
		// Write text
		pWriter.WriteRecordPPTY(2, this.text);
		
		// Write data
		pWriter.WriteRecordPPTY(3, this.data);
		
		// Write foreignData
		pWriter.WriteRecordPPTY(4, this.foreignData);
		
		// Write shapes
		if (this.shapes && this.shapes.length > 0) {
			pWriter.StartRecord(5);
			for (let i = 0; i < this.shapes.length; i++) {
				pWriter.WriteRecordPPTY(0, this.shapes[i]);
			}
			pWriter.EndRecord();
		}
		
		// Write connects
		if (this.connects && this.connects.length > 0) {
			pWriter.StartRecord(6);
			for (let i = 0; i < this.connects.length; i++) {
				pWriter.WriteRecordPPTY(0, this.connects[i]);
			}
			pWriter.EndRecord();
		}
	};

	/**
	 * Write attributes to stream for Master_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Master_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.id);
		pWriter._WriteString2(1, this.baseID);
		pWriter._WriteString2(2, this.hidden);
		pWriter._WriteString2(3, this.iconUpdate);
		pWriter._WriteString2(4, this.matchByName);
		pWriter._WriteString2(5, this.name);
		pWriter._WriteString2(6, this.nameU);
		pWriter._WriteString2(7, this.prompt);
		pWriter._WriteString2(8, this.promptU);
		pWriter._WriteString2(9, this.uniGUID);
	};

	/**
	 * Write children to stream for Master_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Master_Type.prototype.writeChildren = function (pWriter) {
		// Write masterShape
		pWriter.WriteRecordPPTY(0, this.masterShape);
		
		// Write pageSheet
		pWriter.WriteRecordPPTY(1, this.pageSheet);
		
		// Write refBy
		pWriter.WriteRecordPPTY(2, this.refBy);
		
		// Write icon
		pWriter.WriteRecordPPTY(3, this.icon);
		
		// Write rel
		pWriter.WriteRecordPPTY(4, this.rel);
	};

	/**
	 * Write attributes to stream for Text_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Text_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.cp);
		pWriter._WriteString2(1, this.pp);
		pWriter._WriteString2(2, this.tp);
	};

	/**
	 * Write children to stream for Text_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Text_Type.prototype.writeChildren = function (pWriter) {
		pWriter._WriteString2(0, this.text);
		
		// Write fields if present
		if (this.fields && this.fields.length > 0) {
			pWriter.StartRecord(1);
			for (let i = 0; i < this.fields.length; i++) {
				pWriter.WriteRecordPPTY(0, this.fields[i]);
			}
			pWriter.EndRecord();
		}
	};

	/**
	 * Write attributes to stream for ForeignData_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.ForeignData_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.type);
		pWriter._WriteString2(1, this.showAsIcon);
		pWriter._WriteString2(2, this.objectType);
		pWriter._WriteString2(3, this.objectID);
		pWriter._WriteString2(4, this.noShow);
		pWriter._WriteString2(5, this.foreignType);
		pWriter._WriteString2(6, this.compression);
	};

	/**
	 * Write children to stream for ForeignData_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.ForeignData_Type.prototype.writeChildren = function (pWriter) {
		// Write foreignData
		pWriter._WriteString2(0, this.foreignData);
	};

	/**
	 * Write attributes to stream for RefBy_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.RefBy_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.id);
		pWriter._WriteString2(1, this.name);
	};

	/**
	 * Write children to stream for RefBy_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.RefBy_Type.prototype.writeChildren = function (pWriter) {
		// Implementation left intentionally empty as there are no child elements to write
	};

	/**
	 * Write attributes to stream for Text_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Text_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.text);
	};

	/**
	 * Write children to stream for Text_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Text_Type.prototype.writeChildren = function (pWriter) {
		// Write cp (character properties)
		if (this.cp && this.cp.length > 0) {
			pWriter.StartRecord(0);
			for (let i = 0; i < this.cp.length; i++) {
				pWriter.WriteRecordPPTY(0, this.cp[i]);
			}
			pWriter.EndRecord();
		}
		
		// Write pp (paragraph properties)
		if (this.pp && this.pp.length > 0) {
			pWriter.StartRecord(1);
			for (let i = 0; i < this.pp.length; i++) {
				pWriter.WriteRecordPPTY(0, this.pp[i]);
			}
			pWriter.EndRecord();
		}
		
		// Write tp (text properties)
		if (this.tp && this.tp.length > 0) {
			pWriter.StartRecord(2);
			for (let i = 0; i < this.tp.length; i++) {
				pWriter.WriteRecordPPTY(0, this.tp[i]);
			}
			pWriter.EndRecord();
		}
		
		// Write fld (field properties)
		if (this.fld && this.fld.length > 0) {
			pWriter.StartRecord(3);
			for (let i = 0; i < this.fld.length; i++) {
				pWriter.WriteRecordPPTY(0, this.fld[i]);
			}
			pWriter.EndRecord();
		}
	};

	/**
	 * Write attributes to stream for HeaderFooter_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.HeaderFooter_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteDouble2(0, this.headerMargin);
		pWriter._WriteDouble2(1, this.footerMargin);
		pWriter._WriteString2(2, this.headerLeft);
		pWriter._WriteString2(3, this.headerCenter);
		pWriter._WriteString2(4, this.headerRight);
		pWriter._WriteString2(5, this.footerLeft);
		pWriter._WriteString2(6, this.footerCenter);
		pWriter._WriteString2(7, this.footerRight);
		pWriter._WriteString2(8, this.headerFooterFont);
	};

	/**
	 * Write children to stream for HeaderFooter_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.HeaderFooter_Type.prototype.writeChildren = function (pWriter) {
		// Implementation left intentionally empty as there are no child elements to write
	};

	/**
	 * Write attributes to stream for EventItem_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.EventItem_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.eventCode);
		pWriter._WriteString2(1, this.enabled);
		pWriter._WriteString2(2, this.target);
		pWriter._WriteString2(3, this.action);
	};

	/**
	 * Write children to stream for EventItem_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.EventItem_Type.prototype.writeChildren = function (pWriter) {
		// Implementation left intentionally empty as there are no child elements to write
	};

	/**
	 * Write attributes to stream for DocumentSheet_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.DocumentSheet_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.lineStyle);
		pWriter._WriteString2(1, this.fillStyle);
		pWriter._WriteString2(2, this.textStyle);
	};

	/**
	 * Write children to stream for DocumentSheet_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.DocumentSheet_Type.prototype.writeChildren = function (pWriter) {
		// Write cells
		if (this.cells && this.cells.length > 0) {
			pWriter.StartRecord(0);
			for (let i = 0; i < this.cells.length; i++) {
				pWriter.WriteRecordPPTY(0, this.cells[i]);
			}
			pWriter.EndRecord();
		}
		
		// Write sections
		if (this.sections && this.sections.length > 0) {
			pWriter.StartRecord(1);
			for (let i = 0; i < this.sections.length; i++) {
				pWriter.WriteRecordPPTY(0, this.sections[i]);
			}
			pWriter.EndRecord();
		}
		
		// Write triggers
		if (this.triggers && this.triggers.length > 0) {
			pWriter.StartRecord(2);
			for (let i = 0; i < this.triggers.length; i++) {
				pWriter.WriteRecordPPTY(0, this.triggers[i]);
			}
			pWriter.EndRecord();
		}
	};

	/**
	 * Write attributes to stream for FaceName_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.FaceName_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.id);
		pWriter._WriteString2(1, this.name);
		pWriter._WriteString2(2, this.characterSet);
		pWriter._WriteString2(3, this.charSet);
		pWriter._WriteString2(4, this.panos);
		pWriter._WriteString2(5, this.family);
		pWriter._WriteString2(6, this.pitch);
	};

	/**
	 * Write children to stream for FaceName_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.FaceName_Type.prototype.writeChildren = function (pWriter) {
		// Implementation left intentionally empty as there are no child elements to write
	};

	/**
	 * Write attributes to stream for ColorEntry_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.ColorEntry_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.id);
		pWriter._WriteString2(1, this.rgb);
	};

	/**
	 * Write children to stream for ColorEntry_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.ColorEntry_Type.prototype.writeChildren = function (pWriter) {
		// Implementation left intentionally empty as there are no child elements to write
	};

	/**
	 * Write attributes to stream for DocumentSettings_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.DocumentSettings_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.topPage);
		pWriter._WriteString2(1, this.defaultTextStyle);
		pWriter._WriteString2(2, this.defaultLineStyle);
		pWriter._WriteString2(3, this.defaultFillStyle);
		pWriter._WriteString2(4, this.defaultGuideStyle);
		pWriter._WriteInt2(5, this.glueSettings);
		pWriter._WriteInt2(6, this.snapSettings);
		pWriter._WriteInt2(7, this.snapExtensions);
		pWriter._WriteInt2(8, this.snapAngles);
		pWriter._WriteBool2(9, this.dynamicGridEnabled);
		pWriter._WriteBool2(10, this.protectStyles);
		pWriter._WriteBool2(11, this.protectShapes);
		pWriter._WriteBool2(12, this.protectBkgnds);
		pWriter._WriteBool2(13, this.protectMasters);
		pWriter._WriteString2(13, this.customMenusFile);
		pWriter._WriteString2(14, this.customToolbarsFile);
		pWriter._WriteString2(15, this.attachedToolbars);
	};

	/**
	 * Write children to stream for DocumentSettings_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.DocumentSettings_Type.prototype.writeChildren = function (pWriter) {
	}

	/**
	 * Write attributes to stream for Section_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Section_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.n);
		pWriter._WriteString2(1, this.del);
	};

	/**
	 * Write children to stream for Section_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Section_Type.prototype.writeChildren = function (pWriter) {
		// Write rows
		if (this.rows && this.rows.length > 0) {
			for (let i = 0; i < this.rows.length; i++) {
				pWriter.WriteRecordPPTY(0, this.rows[i]);
			}
		}
	};

	/**
	 * Write attributes to stream for Trigger_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Trigger_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.n);
	};

	/**
	 * Write children to stream for Trigger_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Trigger_Type.prototype.writeChildren = function (pWriter) {
		// Write cells
		if (this.cells && this.cells.length > 0) {
			for (let i = 0; i < this.cells.length; i++) {
				pWriter.WriteRecordPPTY(0, this.cells[i]);
			}
		}
	};

	/**
	 * Write attributes to stream for Row_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Row_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.n);
		pWriter._WriteString2(1, this.del);
		pWriter._WriteString2(2, this.ix);
		pWriter._WriteString2(3, this.t);
		pWriter._WriteString2(4, this.local);
		pWriter._WriteString2(5, this.hidden);
	};

	/**
	 * Write children to stream for Row_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Row_Type.prototype.writeChildren = function (pWriter) {
		// Write cells
		if (this.cells && this.cells.length > 0) {
			for (let i = 0; i < this.cells.length; i++) {
				pWriter.WriteRecordPPTY(0, this.cells[i]);
			}
		}
	};

	/**
	 * Write attributes to stream for Cell_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Cell_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.n);
		pWriter._WriteString2(1, this.u);
		pWriter._WriteString2(2, this.e);
		pWriter._WriteString2(3, this.f);
		pWriter._WriteString2(4, this.v);
	};

	/**
	 * Write children to stream for Cell_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Cell_Type.prototype.writeChildren = function (pWriter) {
		// Implementation left intentionally empty as there are no child elements to write
	};

	/**
	 * Write attributes to stream for ForeignData_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.ForeignData_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.type);
		pWriter._WriteString2(1, this.imgOffsetX);
		pWriter._WriteString2(2, this.imgOffsetY);
		pWriter._WriteString2(3, this.imgWidth);
		pWriter._WriteString2(4, this.imgHeight);
		pWriter._WriteString2(5, this.compressionType);
		pWriter._WriteString2(6, this.compressionLevel);
	};

	/**
	 * Write children to stream for ForeignData_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.ForeignData_Type.prototype.writeChildren = function (pWriter) {
		// Write image data
		if (this.data) {
			pWriter.WriteString(0, this.data);
		}
	};

	/**
	 * Write attributes to stream for StyleSheet_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.StyleSheet_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.id);
		pWriter._WriteString2(1, this.name);
		pWriter._WriteString2(2, this.nameU);
		pWriter._WriteString2(3, this.isCustomNameU);
		pWriter._WriteString2(4, this.isCustomName);
		pWriter._WriteString2(5, this.lineStyle);
		pWriter._WriteString2(6, this.fillStyle);
		pWriter._WriteString2(7, this.textStyle);
	};

	/**
	 * Write children to stream for StyleSheet_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.StyleSheet_Type.prototype.writeChildren = function (pWriter) {
		// Write cells
		if (this.cells && this.cells.length > 0) {
			pWriter.StartRecord(0);
			for (let i = 0; i < this.cells.length; i++) {
				pWriter.WriteRecordPPTY(0, this.cells[i]);
			}
			pWriter.EndRecord();
		}
		
		// Write sections
		if (this.sections && this.sections.length > 0) {
			pWriter.StartRecord(1);
			for (let i = 0; i < this.sections.length; i++) {
				pWriter.WriteRecordPPTY(0, this.sections[i]);
			}
			pWriter.EndRecord();
		}
	};

	/**
	 * Write attributes to stream for CSolution
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.CSolutions.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.current);
	};

	/**
	 * Write children to stream for CSolutions
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.CSolutions.prototype.writeChildren = function (pWriter) {
		// Write solution objects
		if (this.solution && this.solution.length > 0) {
			for (let i = 0; i < this.solution.length; i++) {
				pWriter.WriteRecordPPTY(0, this.solution[i]);
			}
		}
	};

	/**
	 * Write attributes to stream for ValidationProperties_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.ValidationProperties_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.lastValidated);
		pWriter._WriteString2(1, this.showIgnored);
		pWriter._WriteString2(2, this.delaySavePages);
		pWriter._WriteString2(3, this.makeReport);
		pWriter._WriteBool2(4, this.doRefs);
	};

	/**
	 * Write children to stream for ValidationProperties_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.ValidationProperties_Type.prototype.writeChildren = function (pWriter) {
		// Implementation left intentionally empty as there are no child elements to write
	};

	/**
	 * Write attributes to stream for RuleSet_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.RuleSet_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.id);
		pWriter._WriteString2(1, this.name);
		pWriter._WriteString2(2, this.namespace);
		pWriter._WriteString2(3, this.version);
		pWriter._WriteString2(4, this.description);
		pWriter._WriteString2(5, this.langid);
		pWriter._WriteString2(6, this.enabled);
	};

	/**
	 * Write children to stream for RuleSet_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.RuleSet_Type.prototype.writeChildren = function (pWriter) {
		// Write ruleSetFlags
		pWriter.WriteRecordPPTY(0, this.ruleSetFlags);
		
		// Write rules
		if (this.rules && this.rules.length > 0) {
			pWriter.StartRecord(1);
			for (let i = 0; i < this.rules.length; i++) {
				pWriter.WriteRecordPPTY(0, this.rules[i]);
			}
			pWriter.EndRecord();
		}
	};

	/**
	 * Write attributes to stream for Issue_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Issue_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.id);
		pWriter._WriteString2(1, this.ignored);
		pWriter._WriteString2(2, this.name);
		pWriter._WriteString2(3, this.severity);
		pWriter._WriteString2(4, this.nameu);
	};

	/**
	 * Write children to stream for Issue_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Issue_Type.prototype.writeChildren = function (pWriter) {
		// Write issueTargets
		if (this.issueTargets && this.issueTargets.length > 0) {
			pWriter.StartRecord(0);
			for (let i = 0; i < this.issueTargets.length; i++) {
				pWriter.WriteRecordPPTY(0, this.issueTargets[i]);
			}
			pWriter.EndRecord();
		}
		
		// Write ruleInfo
		pWriter.WriteRecordPPTY(1, this.ruleInfo);
	};

	/**
	 * Write attributes to stream for DataRecordSet_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.DataRecordSet_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.id);
		pWriter._WriteString2(1, this.name);
		pWriter._WriteString2(2, this.dataColumns);
		pWriter._WriteString2(3, this.nextRowID);
		pWriter._WriteString2(4, this.connectionID);
		pWriter._WriteString2(5, this.timeRefreshed);
		pWriter._WriteString2(6, this.timeEdited);
		pWriter._WriteString2(7, this.reliableSortOrder);
		pWriter._WriteString2(8, this.dataLanguage);
	};

	/**
	 * Write children to stream for DataRecordSet_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.DataRecordSet_Type.prototype.writeChildren = function (pWriter) {
		// Write dataColumns
		pWriter.WriteRecordPPTY(0, this.dataColumnsObj);
		
		// Write primaryKey
		pWriter.WriteRecordPPTY(1, this.primaryKey);
		
		// Write dataRowSortOrder
		pWriter.WriteRecordPPTY(2, this.dataRowSortOrder);
		
		// Write dataRowMap
		pWriter.WriteRecordPPTY(3, this.dataRowMap);
		
		// Write refreshConflicts
		if (this.refreshConflicts && this.refreshConflicts.length > 0) {
			pWriter.StartRecord(4);
			for (let i = 0; i < this.refreshConflicts.length; i++) {
				pWriter.WriteRecordPPTY(0, this.refreshConflicts[i]);
			}
			pWriter.EndRecord();
		}
		
		// Write autoLinkComparisons
		if (this.autoLinkComparisons && this.autoLinkComparisons.length > 0) {
			pWriter.StartRecord(5);
			for (let i = 0; i < this.autoLinkComparisons.length; i++) {
				pWriter.WriteRecordPPTY(0, this.autoLinkComparisons[i]);
			}
			pWriter.EndRecord();
		}
		
		// Write dataRow
		if (this.dataRow && this.dataRow.length > 0) {
			pWriter.StartRecord(6);
			for (let i = 0; i < this.dataRow.length; i++) {
				pWriter.WriteRecordPPTY(0, this.dataRow[i]);
			}
			pWriter.EndRecord();
		}
	};

	/**
	 * Write attributes to stream for DataConnection_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.DataConnection_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.id);
		pWriter._WriteString2(1, this.fileName);
		pWriter._WriteString2(2, this.connectionString);
		pWriter._WriteString2(3, this.command);
		pWriter._WriteString2(4, this.timeRefreshed);
		pWriter._WriteString2(5, this.commandType);
	};

	/**
	 * Write children to stream for DataConnection_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.DataConnection_Type.prototype.writeChildren = function (pWriter) {
		// Write adoData if present
		pWriter.WriteRecordPPTY(0, this.adoData);
	};

	/**
	 * Write attributes to stream for Master_Type
	 * 
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Master_Type.prototype.privateWriteAttributes = function (pWriter) {
		pWriter._WriteString2(0, this.id);
		pWriter._WriteString2(1, this.baseId);
		pWriter._WriteString2(2, this.uniqueId);
		pWriter._WriteString2(3, this.name);
		pWriter._WriteString2(4, this.nameU);
		pWriter._WriteString2(5, this.iconUpdate);
		pWriter._WriteString2(6, this.patternFlags);
		pWriter._WriteString2(7, this.prompt);
		pWriter._WriteString2(8, this.hidden);
		pWriter._WriteString2(9, this.iconSize);
		pWriter._WriteString2(10, this.alignName);
		pWriter._WriteString2(11, this.matchByName);
	};

	/**
	 * Write children to stream for Master_Type
	 *
	 * @param {CBinaryFileWriter} pWriter - The binary writer
	 */
	AscVisio.Master_Type.prototype.writeChildren = function (pWriter) {
		// Write icon
		pWriter.WriteRecordPPTY(0, this.icon);
		
		// Write pageSheet
		pWriter.WriteRecordPPTY(1, this.pageSheet);
		
		// Write rel
		pWriter.WriteRecordPPTY(2, this.rel);
	};

	// /**
	//  * Write attributes to stream for CText_text
	//  *
	//  * @param {CBinaryFileWriter} pWriter - The binary writer
	//  */
	// AscVisio.CText_text.prototype.privateWriteAttributes = function (pWriter) {
	// 	pWriter._WriteString2(0, this.text);
	// 	pWriter._WriteBool2(1, this.simpleText);
	// };
	//
	// /**
	//  * Write children to stream for CText_text
	//  *
	//  * @param {CBinaryFileWriter} pWriter - The binary writer
	//  */
	// AscVisio.CText_text.prototype.writeChildren = function (pWriter) {
	// 	// Write pp (paragraph properties)
	// 	if (this.pp && this.pp.length > 0) {
	// 		pWriter.StartRecord(0);
	// 		for (let i = 0; i < this.pp.length; i++) {
	// 			pWriter.WriteRecordPPTY(0, this.pp[i]);
	// 		}
	// 		pWriter.EndRecord();
	// 	}
	//
	// 	// Write cp (character properties)
	// 	if (this.cp && this.cp.length > 0) {
	// 		pWriter.StartRecord(1);
	// 		for (let i = 0; i < this.cp.length; i++) {
	// 			pWriter.WriteRecordPPTY(0, this.cp[i]);
	// 		}
	// 		pWriter.EndRecord();
	// 	}
	// };
	//
	// /**
	//  * Write attributes to stream for CShapes
	//  *
	//  * @param {CBinaryFileWriter} pWriter - The binary writer
	//  */
	// AscVisio.CShapes.prototype.privateWriteAttributes = function (pWriter) {
	// 	// No attributes to write for CShapes
	// };
	//
	// /**
	//  * Write children to stream for CShapes
	//  *
	//  * @param {CBinaryFileWriter} pWriter - The binary writer
	//  */
	// AscVisio.CShapes.prototype.writeChildren = function (pWriter) {
	// 	if (this.shape && this.shape.length > 0) {
	// 		for (let i = 0; i < this.shape.length; i++) {
	// 			pWriter.WriteRecordPPTY(0, this.shape[i]);
	// 		}
	// 	}
	// };
	//
	// /**
	//  * Write attributes to stream for CEventList
	//  *
	//  * @param {CBinaryFileWriter} pWriter - The binary writer
	//  */
	// AscVisio.CEventList.prototype.privateWriteAttributes = function (pWriter) {
	// 	// No attributes to write for CEventList
	// };
	//
	// /**
	//  * Write children to stream for CEventList
	//  *
	//  * @param {CBinaryFileWriter} pWriter - The binary writer
	//  */
	// AscVisio.CEventList.prototype.writeChildren = function (pWriter) {
	// 	if (this.eventItem && this.eventItem.length > 0) {
	// 		for (let i = 0; i < this.eventItem.length; i++) {
	// 			pWriter.WriteRecordPPTY(0, this.eventItem[i]);
	// 		}
	// 	}
	// };
	//
	// /**
	//  * Write attributes to stream for CStyleSheets
	//  *
	//  * @param {CBinaryFileWriter} pWriter - The binary writer
	//  */
	// AscVisio.CStyleSheets.prototype.privateWriteAttributes = function (pWriter) {
	// 	// No attributes to write for CStyleSheets
	// };
	//
	// /**
	//  * Write children to stream for CStyleSheets
	//  *
	//  * @param {CBinaryFileWriter} pWriter - The binary writer
	//  */
	// AscVisio.CStyleSheets.prototype.writeChildren = function (pWriter) {
	// 	if (this.styleSheet && this.styleSheet.length > 0) {
	// 		for (let i = 0; i < this.styleSheet.length; i++) {
	// 			pWriter.WriteRecordPPTY(0, this.styleSheet[i]);
	// 		}
	// 	}
	// };
	//
	// /**
	//  * Write attributes to stream for CColors
	//  *
	//  * @param {CBinaryFileWriter} pWriter - The binary writer
	//  */
	// AscVisio.CColors.prototype.privateWriteAttributes = function (pWriter) {
	// 	// No attributes to write for CColors
	// };
	//
	// /**
	//  * Write children to stream for CColors
	//  *
	//  * @param {CBinaryFileWriter} pWriter - The binary writer
	//  */
	// AscVisio.CColors.prototype.writeChildren = function (pWriter) {
	// 	if (this.colorEntry && this.colorEntry.length > 0) {
	// 		for (let i = 0; i < this.colorEntry.length; i++) {
	// 			pWriter.WriteRecordPPTY(0, this.colorEntry[i]);
	// 		}
	// 	}
	// };
	//
	// /**
	//  * Write attributes to stream for CFaceNames
	//  *
	//  * @param {CBinaryFileWriter} pWriter - The binary writer
	//  */
	// AscVisio.CFaceNames.prototype.privateWriteAttributes = function (pWriter) {
	// 	// No attributes to write for CFaceNames
	// };
	//
	// /**
	//  * Write children to stream for CFaceNames
	//  *
	//  * @param {CBinaryFileWriter} pWriter - The binary writer
	//  */
	// AscVisio.CFaceNames.prototype.writeChildren = function (pWriter) {
	// 	if (this.faceName && this.faceName.length > 0) {
	// 		for (let i = 0; i < this.faceName.length; i++) {
	// 			pWriter.WriteRecordPPTY(0, this.faceName[i]);
	// 		}
	// 	}
	// };

	window['AscVisio']  = window['AscVisio'] || {};

	window['AscVisio'].BinaryVSDYWriter = BinaryVSDYWriter;

})(window, window.document);