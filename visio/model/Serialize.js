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
	function BinaryVSDYLoader()
	{
		this.stream = null;
		this.document = null;

		this.Load = function(base64_ppty, document)
		{
			this.document = document;
			this.DrawingDocument = null;
			if(document)
			{
				this.DrawingDocument = document.DrawingDocument;
			}
			else
			{
				this.DrawingDocument = null;
			}
			this.ImageMapChecker = {};

			var isBase64 = typeof base64_ppty === 'string';
			var srcLen = isBase64 ? base64_ppty.length : base64_ppty.length;
			var nWritten = 0;

			var index = 0;
			var read_main_prop = "";
			while (true)
			{
				var _c = isBase64 ? base64_ppty.charCodeAt(index) : base64_ppty[index];
				if (_c == ";".charCodeAt(0))
					break;

				read_main_prop += String.fromCharCode(_c);
				index++;
			}
			index++;

			if ("VSDY" != read_main_prop)
				return false;

			read_main_prop = "";
			while (true)
			{
				var _c = isBase64 ? base64_ppty.charCodeAt(index) : base64_ppty[index];
				if (_c == ";".charCodeAt(0))
					break;

				read_main_prop += String.fromCharCode(_c);
				index++;
			}
			index++;

			var _version_num_str = read_main_prop.substring(1);
			var version = 1;
			if(_version_num_str.length > 0)
			{
				version = _version_num_str - 0;
			}
			read_main_prop = "";
			while (true)
			{
				var _c = isBase64 ? base64_ppty.charCodeAt(index) : base64_ppty[index];
				if (_c == ";".charCodeAt(0))
					break;

				read_main_prop += String.fromCharCode(_c);
				index++;
			}
			index++;

			const c_nVersionNoBase64 = 1;//todo Asc.c_nVersionNoBase64
			if (c_nVersionNoBase64 !== version) {
				var dstLen_str = read_main_prop;

				var dstLen = parseInt(dstLen_str);
				var memoryData = AscCommon.Base64.decode(base64_ppty, false, dstLen, index);
				this.stream = new AscCommon.FileStream(memoryData, memoryData.length);
			} else {
				this.stream = new AscCommon.FileStream();
				this.stream.obj    = null;
				this.stream.data   = base64_ppty;
				this.stream.size   = base64_ppty.length;
				//skip header
				// this.stream.EnterFrame(index);
				this.stream.Seek2(index);
			}

			this.LoadDocument();
			// if(AscFonts.IsCheckSymbols)
			// {
			// 	var bLoad = AscCommon.g_oIdCounter.m_bLoad;
			// 	AscCommon.g_oIdCounter.Set_Load(false);
			// 	for(var nField = 0; nField < this.fields.length; ++nField)
			// 	{
			// 		var oField = this.fields[nField];
			// 		var sValue = oField.private_GetString();
			// 		if(typeof sValue === "string" && sValue.length > 0)
			// 		{
			// 			AscFonts.FontPickerByCharacter.getFontsByString(sValue);
			// 		}
			// 	}
			// 	AscCommon.g_oIdCounter.Set_Load(bLoad);
			// }
			// this.fields.length = 0;
			// AscFormat.checkPlaceholdersText();

			this.ImageMapChecker = null;
		};

		/**
		 * Loads a Visio document from binary stream and processes its components.
		 * 
		 * @param  {BinaryVSDYLoader} pReader - The binary reader
		 */
		this.LoadDocument = function()
		{
			let res = c_oSerConstants.ReadOk;
			const stream = this.stream;
			
			// Define table types
			const TABLE_TYPES = {
				DOCUMENT: 1,
				APP: 2,
				CORE: 3,
				CUSTOM_PROPERTIES: 4
			};
			
			// Read the main table length
			const mtLen = stream.GetUChar();
			
			// Read and process sections immediately
			for (let i = 0; i < mtLen; ++i) {
				const sectionType = stream.GetUChar();
				const sectionOffset = stream.GetULong();
				
				// Store current position to return after processing section
				const currentPos = stream.GetCurPos();
				
				// Seek to section and process based on type
				res = stream.Seek2(sectionOffset);
				if (c_oSerConstants.ReadOk !== res) {
					return res;
				}
				
				switch (sectionType) {
					case TABLE_TYPES.APP:
						this.document.app = new AscCommon.CApp();
						this.document.app.fromStream(stream);
						break;
					
					case TABLE_TYPES.CORE:
						this.document.core = new AscCommon.CCore();
						this.document.core.fromStream(stream);
						break;
					
					case TABLE_TYPES.CUSTOM_PROPERTIES:
						if (this.document.customProperties) {
							this.document.customProperties.fromStream(stream);
						}
						break;
					
					case TABLE_TYPES.DOCUMENT:
						this.document.fromPPTY(this);
						break;
				}
				
				// Return to position after section type and offset
				res = stream.Seek2(currentPos);
				if (c_oSerConstants.ReadOk !== res) {
					return res;
				}
			}
			
			return res;
		};
	}

	/**
	 * Loads a Visio document from a binary stream
	 * 
	 * @param  {BinaryVSDYLoader} pReader - The binary reader
	 */
	AscVisio.CVisioDocument.prototype.fromPPTY = function(pReader) {
		const stream = pReader.stream;
		stream.Skip2(1);
		
		const startPos = stream.GetCurPos();
		const recordSize = stream.GetLong();
		const endPos = startPos + recordSize + 4;
		
		while (stream.GetCurPos() < endPos) {
			const recordType = stream.GetUChar();
			
			this.readChild(recordType, pReader);
		}
		
		stream.Seek2(endPos);
	};
	
	/**
	 * Read child elements from stream for CVisioDocument
	 * 
   * @param  {BinaryVSDYLoader} pReader - The binary reader
   * @param {number} elementType - The type of child element
   */
	AscVisio.CVisioDocument.prototype.readChild = function(elementType, pReader) {
		const stream = pReader.stream;
		let t = this;
		switch (elementType) {
			case 0:
				if (!this.documentSettings) {
					this.documentSettings = new AscVisio.DocumentSettings_Type();
				}
				this.documentSettings.fromPPTY(pReader);
				break;
				
			case 1:
				AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY.call({
					readChildren: AscFormat.CBaseFormatNoIdObject.prototype.readChildren,
					readChild: function(elementType, pReader) {
						const stream = pReader.stream;
						if (elementType === 0) {
							const colorEntry = new AscVisio.ColorEntry_Type();
							colorEntry.fromPPTY(pReader);
							t.colors.push(colorEntry);
							return true;
						}
						return false;
					}
				}, pReader);
				break;
				
			case 2:
				AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY.call({
					readChildren: AscFormat.CBaseFormatNoIdObject.prototype.readChildren,
					readChild: function(elementType, pReader) {
						const stream = pReader.stream;
						if (elementType === 0) {
							const faceName = new AscVisio.FaceName_Type();
							faceName.fromPPTY(pReader);
							t.faceNames.push(faceName);
							return true;
						}
						return false;
					}
				}, pReader);
				break;
				
			case 3:
				AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY.call({
					readChildren: AscFormat.CBaseFormatNoIdObject.prototype.readChildren,
					readChild: function(elementType, pReader) {
						const stream = pReader.stream;
						if (elementType === 0) {
							const styleSheet = new AscVisio.StyleSheet_Type();
							styleSheet.fromPPTY(pReader);
							t.styleSheets.push(styleSheet);
							return true;
						}
						return false;
					}
				}, pReader);
				break;
				
			case 4:
				this.documentSheet = new AscVisio.DocumentSheet_Type();
				this.documentSheet.fromPPTY(pReader);
				break;
				
			case 5:
				AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY.call({
					readChildren: AscFormat.CBaseFormatNoIdObject.prototype.readChildren,
					readChild: function(elementType, pReader) {
						const stream = pReader.stream;
						if (elementType === 0) {
							const styleSheet = new AscVisio.EventItem_Type();
							styleSheet.fromPPTY(pReader);
							t.eventList.push(styleSheet);
							return true;
						}
						return false;
					}
				}, pReader);
				break;
				
			case 6:
				if (!this.headerFooter) {
					this.headerFooter = new AscVisio.HeaderFooter_Type();
				}
				this.headerFooter.fromPPTY(pReader);
				break;
				
			case 7:
				if (!this.masters) {
					this.masters = new AscVisio.CMasters();
				}
				this.masters.fromPPTY(pReader);
				break;
				
			case 8:
				if (!this.pages) {
					this.pages = new AscVisio.CPages();
				}
				this.pages.fromPPTY(pReader);
				break;
				
			// case 9:
			// 	// todo
			// 	AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY.call({
			// 		readChildren: AscFormat.CBaseFormatNoIdObject.prototype.readChildren,
			// 		readChild: function(elementType, pReader) {
			// 			const stream = pReader.stream;
			// 			if (elementType === 0) {
			// 				const connection = new AscVisio.Connection_Type();
			// 				connection.fromPPTY(pReader);
			// 				t.connections.push(connection);
			// 				return true;
			// 			}
			// 			return false;
			// 		}
			// 	}, pReader);
			// 	break;
				
			// case 10:
			// 	//todo
			// 	AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY.call({
			// 		readChildren: AscFormat.CBaseFormatNoIdObject.prototype.readChildren,
			// 		readChild: function(elementType, pReader) {
			// 			const stream = pReader.stream;
			// 			if (elementType === 0) {
			// 				const connection = new AscVisio.Recordset_Type();
			// 				connection.fromPPTY(pReader);
			// 				t.recordsets.push(connection);
			// 				return true;
			// 			}
			// 			return false;
			// 		}
			// 	}, pReader);
			// 	break;
				
			case 11:
				if (!this.solutions) {
					this.solutions = new AscVisio.CSolutions();
				}
				this.solutions.fromPPTY(pReader);
				break;
				
			case 12:
				if (!this.validation) {
					this.validation = new AscVisio.CValidation();
				}
				this.validation.fromPPTY(pReader);
				break;
				
			// case 13:
			// 	//todo
			// 	AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY.call({
			// 		readChildren: AscFormat.CBaseFormatNoIdObject.prototype.readChildren,
			// 		readChild: function(elementType, pReader) {
			// 			const stream = pReader.stream;
			// 			if (elementType === 0) {
			// 				const connection = new AscVisio.Comment_Type();
			// 				connection.fromPPTY(pReader);
			// 				t.comments.push(connection);
			// 				return true;
			// 			}
			// 			return false;
			// 		}
			// 	}, pReader);
			// 	break;
				
			case 14:
				if (!this.windows) {
					this.windows = new AscVisio.CWindows();
				}
				this.windows.fromPPTY(pReader);
				break;
				
			case 15:
				AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY.call({
					readChildren: AscFormat.CBaseFormatNoIdObject.prototype.readChildren,
					readChild: function(elementType, pReader) {
						const stream = pReader.stream;
						if (elementType === 0) {
							let theme = new AscFormat.CTheme();
							theme.Read(stream);
							t.themes.push(theme);
							return true;
						}
						return false;
					}
				}, pReader);
				break;
			default:
				return false;
		}
	};

	/**
	 * Read attributes from stream for DocumentSettings_Type
	 * 
	 * @param  {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 */
	AscVisio.DocumentSettings_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.topPage = stream.GetULong();
				break;
			case 1:
				this.defaultTextStyle = stream.GetULong();
				break;
			case 2:
				this.defaultLineStyle = stream.GetULong();
				break;
			case 3:
				this.defaultFillStyle = stream.GetULong();
				break;
			case 4:
				this.defaultGuideStyle = stream.GetULong();
				break;
			case 5:
				this.glueSettings = stream.GetULong();
				break;
			case 6:
				this.snapSettings = stream.GetULong();
				break;
			case 7:
				this.snapExtensions = stream.GetULong();
				break;
			case 8:
				this.snapAngles = stream.GetString2();
				break;
			case 9:
				this.dynamicsOff = stream.GetBool();
				break;
			case 10:
				this.protectStyles = stream.GetBool();
				break;
			case 11:
				this.protectShapes = stream.GetBool();
				break;
			case 12:
				this.protectMasters = stream.GetBool();
				break;
			case 13:
				this.protectBkgnds = stream.GetBool();
				break;
			case 14:
				this.customMenusFile = stream.GetString2();
				break;
			case 15:
				this.customToolbarsFile = stream.GetString2();
				break;
			case 16:
				this.attachToDeployment = stream.GetBool();
				break;
			default:
				return false;
		}
		
		return true;
	};
		
	/**
	 * Read attributes from stream for ColorEntry_Type
	 * 
	 * @param  {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 */
	AscVisio.ColorEntry_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.iX = stream.GetULong();
				break;
			case 1:
				this.rGB = stream.GetString2();
				break;
			default:
				return false;
		}
		
		return true;
	};
	
	/**
	 * Read attributes from stream for FaceName_Type
	 * 
	 * @param  {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 */
	AscVisio.FaceName_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.id = stream.GetULong();
				break;
			case 1:
				this.name = stream.GetString2();
				break;
			case 2:
				this.flags = stream.GetULong();
				break;
			default:
				return false;
		}
		
		return true;
	};

	/**
	 * Read attributes from stream for FaceName_Type
	 *
	 * @param {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if attribute was handled, false otherwise
	 */
	AscVisio.FaceName_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.nameU = stream.GetString2();
				break;
			case 1:
				this.unicodeRanges = stream.GetString2();
				break;
			case 2:
				this.charSets = stream.GetString2();
				break;
			case 3:
				this.panos = stream.GetString2();
				break;
			case 4:
				this.panose = stream.GetString2();
				break;
			case 5:
				this.flags = stream.GetULong();
				break;
			default:
				return false;
		}
		
		return true;
	};

	/**
	 * Read attributes from stream for StyleSheet_Type
	 * 
	 * @param  {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if attribute was handled, false otherwise
	 */
	AscVisio.StyleSheet_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.id = stream.GetULong();
				break;
			case 1:
				this.name = stream.GetString2();
				break;
			case 2:
				this.nameU = stream.GetString2();
				break;
			case 3:
				this.lineStyle = stream.GetULong();
				break;
			case 4:
				this.fillStyle = stream.GetULong();
				break;
			case 5:
				this.textStyle = stream.GetULong();
				break;
			default:
				return false;
		}
		
		return true;
	};
	
	/**
	 * Read child elements from stream for StyleSheet_Type
	 * 
	 * @param  {number} elementType - The type of child element
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if element was handled, false otherwise
	 */
	AscVisio.StyleSheet_Type.prototype.readChild = function(elementType, pReader) {
		const stream = pReader.stream;
		switch (elementType) {
			case 0: {
				const cell = new AscVisio.Cell_Type();
				cell.fromPPTY(pReader);
				const key = AscVisio.createKeyFromSheetObject(cell);
				this.elements[key] = cell;
				break;
			}
			case 1: {
				const trigger = new AscVisio.Trigger_Type();
				trigger.fromPPTY(pReader);
				const key = AscVisio.createKeyFromSheetObject(trigger);
				this.elements[key] = trigger;
				break;
			}
			case 2: {
				const section = new AscVisio.Section_Type();
				section.fromPPTY(pReader);
				const key = AscVisio.createKeyFromSheetObject(section);
				this.elements[key] = section;
				break;
			}
			default:
				return false;
		}
		
		return true;
	};

	/**
	 * Read attributes from stream for Cell_Type
	 * 
	 * @param  {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if attribute was handled, false otherwise
	 */
	AscVisio.Cell_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.n = stream.GetString2();
				break;
			case 1:
				this.u = stream.GetString2();
				break;
			case 2:
				this.e = stream.GetString2();
				break;
			case 3:
				this.f = stream.GetString2();
				break;
			case 4:
				this.v = stream.GetString2();
				break;
			default:
				return false;
		}
		
		return true;
	};
	/**
	 * Read child elements from stream for CMasters
	 *
	 * @param  {number} elementType - The type of child element
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if element was handled, false otherwise
	 */
	AscVisio.Cell_Type.prototype.readChild = function(elementType, pReader) {
		const stream = pReader.stream;
		if (elementType === 0) {
			const refBy = new AscVisio.RefBy_Type();
			refBy.fromPPTY(pReader);
			this.refBy.push(refBy);
			return true;
		}

		return false;
	};

	/**
	 * Read attributes from stream for EventItem_Type
	 * 
	 * @param  {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if attribute was handled, false otherwise
	 */
	AscVisio.EventItem_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.eventID = stream.GetString2();
				break;
			case 1:
				this.action = stream.GetString2();
				break;
			case 2:
				this.eventCode = stream.GetLong();
				break;
			case 3:
				this.target = stream.GetString2();
				break;
			case 4:
				this.targetArgs = stream.GetString2();
				break;
			case 5:
				this.enabled = stream.GetBool();
				break;
			default:
				return false;
		}
		
		return true;
	};

	/**
	 * Read attributes from stream for HeaderFooter_Type
	 * 
	 * @param  {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if attribute was handled, false otherwise
	 */
	AscVisio.HeaderFooter_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.headerMargin = stream.GetDouble();
				break;
			case 1:
				this.footerMargin = stream.GetDouble();
				break;
			case 2:
				this.headerLeft = stream.GetString2();
				break;
			case 3:
				this.headerCenter = stream.GetString2();
				break;
			case 4:
				this.headerRight = stream.GetString2();
				break;
			case 5:
				this.footerLeft = stream.GetString2();
				break;
			case 6:
				this.footerCenter = stream.GetString2();
				break;
			case 7:
				this.footerRight = stream.GetString2();
				break;
			case 8:
				this.headerFooterFont = stream.GetString2();
				break;
			default:
				return false;
		}
		
		return true;
	};

	/**
	 * Read child elements from stream for CMasters
	 * 
	 * @param  {number} elementType - The type of child element
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if element was handled, false otherwise
	 */
	AscVisio.CMasters.prototype.readChild = function(elementType, pReader) {
		const stream = pReader.stream;
		if (elementType === 0) {
			const master = new AscVisio.Master_Type();
			master.fromPPTY(pReader);
			this.master.push(master);
			return true;
		}
		
		return false;
	};

	/**
	 * Read attributes from stream for Master_Type
	 * 
	 * @param  {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if attribute was handled, false otherwise
	 */
	AscVisio.Master_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.id = stream.GetULong();
				break;
			case 1:
				this.name = stream.GetString2();
				break;
			case 2:
				this.nameU = stream.GetString2();
				break;
			case 3:
				this.baseID = stream.GetString2();
				break;
			case 4:
				this.uniqueID = stream.GetString2();
				break;
			case 5:
				this.matchByName = stream.GetBool();
				break;
			case 6:
				this.isCustomName = stream.GetBool();
				break;
			case 7:
				this.isCustomNameU = stream.GetBool();
				break;
			case 8:
				this.iconSize = stream.GetULong();
				break;
			case 9:
				this.patternFlags = stream.GetULong();
				break;
			case 10:
				this.prompt = stream.GetString2();
				break;
			case 11:
				this.hidden = stream.GetBool();
				break;
			case 12:
				this.iconUpdate = stream.GetBool();
				break;
			case 13:
				this.alignName = stream.GetULong();
				break;
			case 14:
				this.masterType = stream.GetULong();
				break;
			default:
				return false;
		}
		
		return true;
	};
	
	/**
	 * Read child elements from stream for Master_Type
	 * 
	 * @param  {number} elementType - The type of child element
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if element was handled, false otherwise
	 */
	AscVisio.Master_Type.prototype.readChild = function(elementType, pReader) {
		const stream = pReader.stream;
		switch (elementType) {
			case 0: {
				this.pageSheet = new AscVisio.PageSheet_Type();
				this.pageSheet.fromPPTY(pReader);
				break;
			}
			case 1: {
				const nStart = stream.cur;
				const nEnd = nStart + stream.GetULong() + 4;
				this.icon = new AscVisio.Icon_Type();
				this.icon.value = stream.GetString2();
				stream.Seek2(nEnd);
				break;
			}
			//todo
			case 2: {
				const masterContents = new AscVisio.CMasterContents();
				masterContents.fromPPTY(pReader);
				//todo rels
				pReader.document.masterContents.push(masterContents);
				break;
			}
			default:
				return false;
		}

		return true;
	};

	/**
	 * Read child elements from stream for CMasterContents
	 *
	 * @param {number} elementType - The type of child element
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if element was handled, false otherwise
	 */
	AscVisio.CMasterContents.prototype.readChild = function(elementType, pReader) {
		let t = this;
		switch (elementType) {
			case 0: {
				// Read Shapes
				AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY.call({
					readChildren: AscFormat.CBaseFormatNoIdObject.prototype.readChildren,
					readChild: function(elementType, pReader) {
						if (elementType === 0) {
							const shape = new AscVisio.Shape_Type();
							shape.fromPPTY(pReader);
							t.shapes.push(shape);
							return true;
						}
						return false;
					}
				}, pReader);
				break;
			}
			case 1: {
				// Read Connects
				AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY.call({
					readChildren: AscFormat.CBaseFormatNoIdObject.prototype.readChildren,
					readChild: function(elementType, pReader) {
						if (elementType === 0) {
							const connect = new AscVisio.Connect_Type();
							connect.fromPPTY(pReader);
							t.connects.push(connect);
							return true;
						}
						return false;
					}
				}, pReader);
				break;
			}
			default:
				return false;
		}
		
		return true;
	};
	
	/**
	 * Read attributes from stream for Connect_Type
	 *
	 * @param {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if attribute was handled, false otherwise
	 */
	AscVisio.Connect_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.fromSheet = stream.GetULong();
				break;
			case 1:
				this.fromCell = stream.GetString2();
				break;
			case 2:
				this.fromPart = stream.GetLong();
				break;
			case 3:
				this.toSheet = stream.GetULong();
				break;
			case 4:
				this.toCell = stream.GetString2();
				break;
			case 5:
				this.toPart = stream.GetLong();
				break;
			default:
				return false;
		}
		
		return true;
	};

	/**
	 * Read child elements from stream for CPages
	 * 
	 * @param  {number} elementType - The type of child element
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if element was handled, false otherwise
	 */
	AscVisio.CPages.prototype.readChild = function(elementType, pReader) {
		const stream = pReader.stream;
		if (elementType === 0) {
			const page = new AscVisio.Page_Type();
			page.fromPPTY(pReader);
			this.page.push(page);
			return true;
		}
		
		return false;
	};

	/**
	 * Read attributes from stream for Page_Type
	 * 
	 * @param  {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if attribute was handled, false otherwise
	 */
	AscVisio.Page_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.id = stream.GetULong();
				break;
			case 1:
				this.name = stream.GetString2();
				break;
			case 2:
				this.nameU = stream.GetString2();
				break;
			case 3:
				this.isCustomName = stream.GetBool();
				break;
			case 4:
				this.isCustomNameU = stream.GetBool();
				break;
			case 5:
				this.background = stream.GetBool();
				break;
			case 6:
				this.backPage = stream.GetULong();
				break;
			case 7:
				this.viewScale = stream.GetDouble();
				break;
			case 8:
				this.viewCenterX = stream.GetDouble();
				break;
			case 9:
				this.viewCenterY = stream.GetDouble();
				break;
			case 10:
				this.reviewerID = stream.GetULong();
				break;
			case 11:
				this.associatedPage = stream.GetULong();
				break;
			default:
				return false;
		}
		
		return true;
	};

	/**
	 * Read child elements from stream for Page_Type
	 * 
	 * @param  {number} elementType - The type of child element
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if element was handled, false otherwise
	 */
	AscVisio.Page_Type.prototype.readChild = function(elementType, pReader) {
		switch (elementType) {
			case 0: {
				this.pageSheet = new AscVisio.PageSheet_Type();
				this.pageSheet.fromPPTY(pReader);
				break;
			}
			case 1: {
				const pageContents = new AscVisio.CPageContents();
				pageContents.fromPPTY(pReader);
				//todo rels
				pReader.document.pageContents.push(pageContents);
				break;
			}
			default:
				return false;
		}

		return true;
	};

	/**
	 * Read attributes from stream for PageSheet_Type
	 *
	 * @param {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if attribute was handled, false otherwise
	 */
	AscVisio.PageSheet_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.uniqueID = stream.GetString2();
				break;
			case 1:
				this.lineStyle = stream.GetULong();
				break;
			case 2:
				this.fillStyle = stream.GetULong();
				break;
			case 3:
				this.textStyle = stream.GetULong();
				break;
			default:
				return false;
		}
		
		return true;
	};

	/**
	 * Read child elements from stream for PageSheet_Type
	 *
	 * @param {number} elementType - The type of child element
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if element was handled, false otherwise
	 */
	AscVisio.PageSheet_Type.prototype.readChild = function(elementType, pReader) {
		switch (elementType) {
			case 0: {
				const cell = new AscVisio.Cell_Type();
				cell.fromPPTY(pReader);
				const key = AscVisio.createKeyFromSheetObject(cell);
				this.elements[key] = cell;
				break;
			}
			case 1: {
				const trigger = new AscVisio.Trigger_Type();
				trigger.fromPPTY(pReader);
				const key = AscVisio.createKeyFromSheetObject(trigger);
				this.elements[key] = trigger;
				break;
			}
			case 2: {
				const section = new AscVisio.Section_Type();
				section.fromPPTY(pReader);
				const key = AscVisio.createKeyFromSheetObject(section);
				this.elements[key] = section;
				break;
			}
			default:
				return false;
		}

		return true;
	};

	// /**
	//  * Read attributes from stream for Comment_Type
	//  *
	//  * @param  {number} attrType - The type of attribute
	//  * @param {BinaryVSDYLoader} pReader - The binary reader
	//  * @returns {boolean} - True if attribute was handled, false otherwise
	//  */
	// AscVisio.Comment_Type.prototype.readAttribute = function(attrType, pReader) {
	// 	const stream = pReader.stream;
	// 	switch (attrType) {
	// 		case 0:
	// 			this.id = stream.GetULong();
	// 			break;
	// 		case 1:
	// 			this.authorName = stream.GetString2();
	// 			break;
	// 		case 2:
	// 			this.authorInitials = stream.GetString2();
	// 			break;
	// 		case 3:
	// 			this.text = stream.GetString2();
	// 			break;
	// 		case 4:
	// 			this.date = stream.GetString2();
	// 			break;
	// 		case 5:
	// 			this.reviewerID = stream.GetULong();
	// 			break;
	// 		case 6:
	// 			this.shapeId = stream.GetULong();
	// 			break;
	// 		case 7:
	// 			this.pageId = stream.GetULong();
	// 			break;
	// 		default:
	// 			return false;
	// 	}
	//
	// 	return true;
	// };

	// /**
	//  * Read attributes from stream for Recordset_Type
	//  *
	//  * @param  {number} attrType - The type of attribute
	//  * @param {BinaryVSDYLoader} pReader - The binary reader
	//  * @returns {boolean} - True if attribute was handled, false otherwise
	//  */
	// AscVisio.Recordset_Type.prototype.readAttribute = function(attrType, pReader) {
	// 	const stream = pReader.stream;
	// 	switch (attrType) {
	// 		case 0:
	// 			this.id = stream.GetULong();
	// 			break;
	// 		case 1:
	// 			this.name = stream.GetString2();
	// 			break;
	// 		case 2:
	// 			this.dataSource = stream.GetString2();
	// 			break;
	// 		case 3:
	// 			this.command = stream.GetString2();
	// 			break;
	// 		case 4:
	// 			this.options = stream.GetULong();
	// 			break;
	// 		case 5:
	// 			this.timeRefreshed = stream.GetString2();
	// 			break;
	// 		case 6:
	// 			this.nextRowID = stream.GetULong();
	// 			break;
	// 		default:
	// 			return false;
	// 	}
	//
	// 	return true;
	// };

	/**
	 * Read child elements from stream for CSolutions
	 * 
	 * @param  {number} elementType - The type of child element
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if element was handled, false otherwise
	 */
	AscVisio.CSolutions.prototype.readChild = function(elementType, pReader) {
		const stream = pReader.stream;
		if (elementType === 0) {
			const solution = new AscVisio.Solution_Type();
			solution.fromPPTY(pReader);
			this.solution.push(solution);
			return true;
		}
		
		return false;
	};

	/**
	 * Read attributes from stream for Solution_Type
	 * 
	 * @param  {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if attribute was handled, false otherwise
	 */
	AscVisio.Solution_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.name = stream.GetString2();
				break;
			case 1:
				this.nameU = stream.GetString2();
				break;
			case 2:
				this.xml = stream.GetString2();
				break;
			default:
				return false;
		}
		
		return true;
	};

	/**
	 * Read attributes from stream for CValidation
	 * 
	 * @param  {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if attribute was handled, false otherwise
	 */
	AscVisio.CValidation.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.showIgnoredIssues = stream.GetBool();
				break;
			case 1:
				this.showPerPage = stream.GetBool();
				break;
			default:
				return false;
		}
		
		return true;
	};

	/**
	 * Read child elements from stream for CWindows
	 *
	 * @param  {number} elementType - The type of child element
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if element was handled, false otherwise
	 */
	AscVisio.CWindows.prototype.readChild = function(elementType, pReader) {
		const stream = pReader.stream;
		if (elementType === 0) {
			const window = new AscVisio.Window_Type();
			window.fromPPTY(pReader);
			this.window.push(window);
			return true;
		}
		
		return false;
	};

	/**
	 * Read attributes from stream for Window_Type
	 * 
	 * @param  {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if attribute was handled, false otherwise
	 */
	AscVisio.Window_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.id = stream.GetULong();
				break;
			case 1:
				this.wndIndex = stream.GetULong();
				break;
			case 2:
				this.pageId = stream.GetULong();
				break;
			case 3:
				this.viewCenterX = stream.GetDouble();
				break;
			case 4:
				this.viewCenterY = stream.GetDouble();
				break;
			case 5:
				this.viewScale = stream.GetDouble();
				break;
			case 6:
				this.viewWidth = stream.GetDouble();
				break;
			case 7:
				this.viewHeight = stream.GetDouble();
				break;
			case 8:
				this.pagesX = stream.GetDouble();
				break;
			case 9:
				this.pagesY = stream.GetDouble();
				break;
			case 10:
				this.viewCenterX2 = stream.GetDouble();
				break;
			case 11:
				this.viewCenterY2 = stream.GetDouble();
				break;
			case 12:
				this.dynFeedback = stream.GetULong();
				break;
			case 13:
				this.glueSettings = stream.GetULong();
				break;
			case 14:
				this.snapSettings = stream.GetULong();
				break;
			case 15:
				this.snapExtensions = stream.GetULong();
				break;
			case 16:
				this.snapAngles = stream.GetString2();
				break;
			case 17:
				this.dynGridEnabled = stream.GetBool();
				break;
			case 18:
				this.stencilPage = stream.GetULong();
				break;
			case 19:
				this.stencilVis = stream.GetBool();
				break;
			case 20:
				this.uiVisibility = stream.GetULong();
				break;
			case 21:
				this.winType = stream.GetULong();
				break;
			case 22:
				this.windowLeft = stream.GetLong();
				break;
			case 23:
				this.windowRight = stream.GetLong();
				break;
			case 24:
				this.windowTop = stream.GetLong();
				break;
			case 25:
				this.windowBottom = stream.GetLong();
				break;
			case 26:
				this.showRulers = stream.GetBool();
				break;
			case 27:
				this.showGrid = stream.GetBool();
				break;
			case 28:
				this.showGuides = stream.GetBool();
				break;
			case 29:
				this.showConnectionPoints = stream.GetBool();
				break;
			case 30:
				this.tabSplitterPos = stream.GetDouble();
				break;
			case 31:
				this.containerType = stream.GetULong();
				break;
			case 32:
				this.container = stream.GetULong();
				break;
			case 33:
				this.masterPage = stream.GetULong();
				break;
			case 34:
				this.viewMode = stream.GetULong();
				break;
			case 35:
				this.isCustomSize = stream.GetBool();
				break;
			case 36:
				this.isCustomScale = stream.GetBool();
				break;
			case 37:
				this.customWidth = stream.GetDouble();
				break;
			case 38:
				this.customHeight = stream.GetDouble();
				break;
			case 39:
				this.customScale = stream.GetDouble();
				break;
			case 40:
				this.themePage = stream.GetULong();
				break;
			case 41:
				this.selectedPage = stream.GetULong();
				break;
			default:
				return false;
		}
		
		return true;
	};

	// /**
	//  * Read attributes from stream for Comment_Type
	//  *
	//  * @param  {number} attrType - The type of attribute
	//  * @param {BinaryVSDYLoader} pReader - The binary reader
	//  * @returns {boolean} - True if attribute was handled, false otherwise
	//  */
	// AscVisio.Comment_Type.prototype.readAttribute = function(attrType, pReader) {
	// 	const stream = pReader.stream;
	// 	switch (attrType) {
	// 		case 0:
	// 			this.id = stream.GetULong();
	// 			break;
	// 		case 1:
	// 			this.authorName = stream.GetString2();
	// 			break;
	// 		case 2:
	// 			this.authorInitials = stream.GetString2();
	// 			break;
	// 		case 3:
	// 			this.text = stream.GetString2();
	// 			break;
	// 		case 4:
	// 			this.date = stream.GetString2();
	// 			break;
	// 		case 5:
	// 			this.reviewerID = stream.GetULong();
	// 			break;
	// 		case 6:
	// 			this.shapeId = stream.GetULong();
	// 			break;
	// 		case 7:
	// 			this.pageId = stream.GetULong();
	// 			break;
	// 		default:
	// 			return false;
	// 	}
	//
	// 	return true;
	// };

	// /**
	//  * Read attributes from stream for Recordset_Type
	//  *
	//  * @param  {number} attrType - The type of attribute
	//  * @param {BinaryVSDYLoader} pReader - The binary reader
	//  * @returns {boolean} - True if attribute was handled, false otherwise
	//  */
	// AscVisio.Recordset_Type.prototype.readAttribute = function(attrType, pReader) {
	// 	const stream = pReader.stream;
	// 	switch (attrType) {
	// 		case 0:
	// 			this.id = stream.GetULong();
	// 			break;
	// 		case 1:
	// 			this.name = stream.GetString2();
	// 			break;
	// 		case 2:
	// 			this.dataSource = stream.GetString2();
	// 			break;
	// 		case 3:
	// 			this.command = stream.GetString2();
	// 			break;
	// 		case 4:
	// 			this.options = stream.GetULong();
	// 			break;
	// 		case 5:
	// 			this.timeRefreshed = stream.GetString2();
	// 			break;
	// 		case 6:
	// 			this.nextRowID = stream.GetULong();
	// 			break;
	// 		default:
	// 			return false;
	// 	}
	//
	// 	return true;
	// };

	/**
	 * Read attributes from stream for DocumentSheet_Type
	 * 
	 * @param  {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if attribute was handled, false otherwise
	 */
	AscVisio.DocumentSheet_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.uniqueID = stream.GetString2();
				break;
			case 1:
				this.nameU = stream.GetString2();
				break;
			case 2:
				this.name = stream.GetString2();
				break;
			case 3:
				this.isCustomName = stream.GetBool();
				break;
			case 4:
				this.isCustomNameU = stream.GetBool();
				break;
			case 5:
				this.lineStyle = stream.GetULong();
				break;
			case 6:
				this.fillStyle = stream.GetULong();
				break;
			case 7:
				this.textStyle = stream.GetULong();
				break;
			default:
				return false;
		}
		
		return true;
	};

	/**
	 * Read child elements from stream for CWindows
	 *
	 * @param {number} elementType - The type of child element
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if element was handled, false otherwise
	 */
	AscVisio.DocumentSheet_Type.prototype.readChild = function(elementType, pReader) {
		const stream = pReader.stream;
		switch (elementType) {
			case 0: {
				const cell = new AscVisio.Cell_Type();
				cell.fromPPTY(pReader);
				const key = AscVisio.createKeyFromSheetObject(cell);
				this.elements[key] = cell;
				break;
			}
			case 1: {
				const trigger = new AscVisio.Trigger_Type();
				trigger.fromPPTY(pReader);
				const key = AscVisio.createKeyFromSheetObject(trigger);
				this.elements[key] = trigger;
				break;
			}
			case 2: {
				const selection = new AscVisio.Section_Type();
				selection.fromPPTY(pReader);
				const key = AscVisio.createKeyFromSheetObject(selection);
				this.elements[key] = selection;
				break;
			}
			default:
				return false;
		}

		return true;
	};

	/**
	 * Read attributes from stream for Trigger_Type
	 *
	 * @param {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if attribute was handled, false otherwise
	 */
	AscVisio.Trigger_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.n = stream.GetString2();
				break;
			default:
				return false;
		}
		
		return true;
	};

	/**
	 * Read child elements from stream for Trigger_Type
	 *
	 * @param {number} elementType - The type of child element
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if element was handled, false otherwise
	 */
	AscVisio.Trigger_Type.prototype.readChild = function(elementType, pReader) {
		if (elementType === 0) {
			const refBy = new AscVisio.RefBy_Type();
			refBy.fromPPTY(pReader);
			this.refBy = refBy;
			return true;
		}

		return false;
	};

	/**
	 * Read attributes from stream for Section_Type
	 *
	 * @param {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if attribute was handled, false otherwise
	 */
	AscVisio.Section_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.ix = stream.GetULong();
				break;
			case 1:
				this.n = stream.GetString2();
				break;
			case 2:
				this.del = stream.GetBool();
				break;
			default:
				return false;
		}
		
		return true;
	};

	/**
	 * Read child elements from stream for Section_Type
	 *
	 * @param {number} elementType - The type of child element
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if element was handled, false otherwise
	 */
	AscVisio.Section_Type.prototype.readChild = function(elementType, pReader) {
		switch (elementType) {
			case 0: {
				const cell = new AscVisio.Cell_Type();
				cell.fromPPTY(pReader);
				const key = AscVisio.createKeyFromSheetObject(cell);
				this.elements[key] = cell;
				break;
			}
			case 1: {
				const trigger = new AscVisio.Trigger_Type();
				trigger.fromPPTY(pReader);
				const key = AscVisio.createKeyFromSheetObject(trigger);
				this.elements[key] = trigger;
				break;
			}
			case 6: {
				const row = new AscVisio.Row_Type();
				row.fromPPTY(pReader);
				const key = AscVisio.createKeyFromSheetObject(row);
				this.elements[key] = row;
				break;
			}
			default:
				return false;
		}

		return true;
	};

	/**
	 * Read attributes from stream for Row_Type
	 *
	 * @param {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if attribute was handled, false otherwise
	 */
	AscVisio.Row_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.ix = stream.GetULong();
				break;
			case 1:
				this.n = stream.GetString2();
				break;
			case 2:
				this.localName = stream.GetString2();
				break;
			case 3:
				this.t = stream.GetString2();
				break;
			case 4:
				this.del = stream.GetBool();
				break;
			default:
				return false;
		}
		
		return true;
	};

	/**
	 * Read child elements from stream for Row_Type
	 *
	 * @param {number} elementType - The type of child element
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if element was handled, false otherwise
	 */
	AscVisio.Row_Type.prototype.readChild = function(elementType, pReader) {
		switch (elementType) {
			case 0: {
				const cell = new AscVisio.Cell_Type();
				cell.fromPPTY(pReader);
				const key = AscVisio.createKeyFromSheetObject(cell);
				this.elements[key] = cell;
				break;
			}
			case 1: {
				const trigger = new AscVisio.Trigger_Type();
				trigger.fromPPTY(pReader);
				const key = AscVisio.createKeyFromSheetObject(trigger);
				this.elements[key] = trigger;
				break;
			}
			default:
				return false;
		}

		return true;
	};

	/**
	 * Read child elements from stream for CPageContents
	 *
	 * @param {number} elementType - The type of child element
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if element was handled, false otherwise
	 */
	AscVisio.CPageContents.prototype.readChild = function(elementType, pReader) {
		let t = this;
		switch (elementType) {
			case 0: {
				// Read Shapes
				AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY.call({
					readChildren: AscFormat.CBaseFormatNoIdObject.prototype.readChildren,
					readChild: function(elementType, pReader) {
						const stream = pReader.stream;
						if (elementType === 0) {
							const shape = new AscVisio.Shape_Type();
							shape.fromPPTY(pReader);
							t.shapes.push(shape);
							return true;
						}
						return false;
					}
				}, pReader);
				break;
			}
			case 1: {
				// Read Connects
				AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY.call({
					readChildren: AscFormat.CBaseFormatNoIdObject.prototype.readChildren,
					readChild: function(elementType, pReader) {
						if (elementType === 0) {
							const connect = new AscVisio.Connect_Type();
							connect.fromPPTY(pReader);
							t.connects.push(connect);
							return true;
						}
						return false;
					}
				}, pReader);
				break;
			}
			// case 2: {
			// 	// Handle Master relationships
			// 	const stream = pReader.stream;
			// 	const endPos = stream.GetPos() + stream.GetULong() + 4;
			//
			// 	// Skip start attributes byte
			// 	stream.Skip2(1);
			//
			// 	let id = null;
			// 	let uniqueID = null;
			//
			// 	// Read attributes
			// 	while (true) {
			// 		const attrType = stream.GetUChar();
			// 		if (attrType === AscVisio.g_nodeAttributeEnd)
			// 			break;
			//
			// 		switch (attrType) {
			// 			case 0:
			// 				id = stream.GetULong();
			// 				break;
			// 			case 1:
			// 				uniqueID = stream.GetString2();
			// 				break;
			// 		}
			// 	}
			//
			// 	// Store master relationship info
			// 	if (id !== null || uniqueID !== null) {
			// 		if (!this.masterRels) {
			// 			this.masterRels = [];
			// 		}
			// 		this.masterRels.push({ id: id, uniqueID: uniqueID });
			// 	}
			//
			// 	// Seek to end of record
			// 	stream.Seek2(endPos);
			// 	break;
			// }
			// case 3: {
			// 	// Handle Page relationships
			// 	const stream = pReader.stream;
			// 	const endPos = stream.GetPos() + stream.GetULong() + 4;
			//
			// 	// Skip start attributes byte
			// 	stream.Skip2(1);
			//
			// 	let id = null;
			//
			// 	// Read attributes
			// 	while (true) {
			// 		const attrType = stream.GetUChar();
			// 		if (attrType === AscVisio.g_nodeAttributeEnd)
			// 			break;
			//
			// 		switch (attrType) {
			// 			case 0:
			// 				id = stream.GetULong();
			// 				break;
			// 		}
			// 	}
			//
			// 	// Store page relationship info
			// 	if (id !== null) {
			// 		if (!this.pageRels) {
			// 			this.pageRels = [];
			// 		}
			// 		this.pageRels.push(id);
			// 	}
			//
			// 	// Seek to end of record
			// 	stream.Seek2(endPos);
			// 	break;
			// }
			default:
				return false;
		}
		
		return true;
	};

	/**
	 * Read attributes from stream for Shape_Type
	 *
	 * @param {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if attribute was handled, false otherwise
	 */
	AscVisio.Shape_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.id = stream.GetULong();
				break;
			case 1:
				this.type = stream.GetUChar();
				break;
			case 2:
				this.originalID = stream.GetULong();
				break;
			case 3:
				this.del = stream.GetBool();
				break;
			case 4:
				this.masterShape = stream.GetULong();
				break;
			case 5:
				this.uniqueID = stream.GetString2();
				break;
			case 6:
				this.nameU = stream.GetString2();
				break;
			case 7:
				this.name = stream.GetString2();
				break;
			case 8:
				this.isCustomName = stream.GetBool();
				break;
			case 9:
				this.isCustomNameU = stream.GetBool();
				break;
			case 10:
				this.master = stream.GetULong();
				break;
			case 11:
				this.lineStyle = stream.GetULong();
				break;
			case 12:
				this.fillStyle = stream.GetULong();
				break;
			case 13:
				this.textStyle = stream.GetULong();
				break;
			default:
				return false;
		}
		
		return true;
	};

	/**
	 * Read child elements from stream for Shape_Type
	 *
	 * @param {number} elementType - The type of child element
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if element was handled, false otherwise
	 */
	AscVisio.Shape_Type.prototype.readChild = function(elementType, pReader) {
		let t = this;
		switch (elementType) {
			case 0: {
				const cell = new AscVisio.Cell_Type();
				cell.fromPPTY(pReader);
				const key = AscVisio.createKeyFromSheetObject(cell);
				this.elements[key] = cell;
				break;
			}
			case 1: {
				const trigger = new AscVisio.Trigger_Type();
				trigger.fromPPTY(pReader);
				const key = AscVisio.createKeyFromSheetObject(trigger);
				this.elements[key] = trigger;
				break;
			}
			case 2: {
				const section = new AscVisio.Section_Type();
				section.fromPPTY(pReader);
				const key = AscVisio.createKeyFromSheetObject(section);
				this.elements[key] = section;
				break;
			}
			case 3: {
				const text = new AscVisio.Text_Type();
				text.fromPPTY(pReader);
				const key = AscVisio.createKeyFromSheetObject(text);
				this.elements[key] = text;
				break;
			}
			//todo
			// case 4: {
			// 	if (!this.foreignData) {
			// 		this.foreignData = new AscVisio.ForeignData_Type();
			// 	}
			// 	this.foreignData.fromPPTY(pReader);
			// 	break;
			// }
			case 5: {
				// Read Shapes
				AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY.call({
					readChildren: AscFormat.CBaseFormatNoIdObject.prototype.readChildren,
					readChild: function(elementType, pReader) {
						if (elementType === 0) {
							const shape = new AscVisio.Shape_Type();
							shape.fromPPTY(pReader);
							t.shapes.push(shape);
							return true;
						}
						return false;
					}
				}, pReader);
				break;
			}
			default:
				return false;
		}
		
		return true;
	};

	/**
	 * Read child elements from stream for Text_Type
	 *
	 * @param {number} elementType - The type of child element
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if element was handled, false otherwise
	 */
	AscVisio.Text_Type.prototype.readChild = function(elementType, pReader) {
		let t = this;
		switch (elementType) {
			case 0: {
				// Text_cp (Character properties)
				const textCp = new AscVisio.cp_Type();
				textCp.fromPPTY(pReader);
				this.elements.push(textCp);
				break;
			}
			case 1: {
				// Text_pp (Paragraph properties)
				const textPp = new AscVisio.pp_Type();
				textPp.fromPPTY(pReader);
				this.elements.push(textPp);
				break;
			}
			case 2: {
				// Text_tp (Tab properties)
				const textTp = new AscVisio.tp_Type();
				textTp.fromPPTY(pReader);
				this.elements.push(textTp);
				break;
			}
			case 3: {
				// Text_fld (Field)
				const textFld = new AscVisio.fld_Type();
				textFld.fromPPTY(pReader);
				this.elements.push(textFld);
				break;
			}
			case 4: {
				// Text_text (Text content)
				// Read Shapes
				AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY.call({
					readChildren: AscFormat.CBaseFormatNoIdObject.prototype.readChildren,
					readAttributes: AscFormat.CBaseFormatNoIdObject.prototype.readAttributes,
					readAttribute: function(attrType, pReader) {
						if (attrType === 0) {
							t.elements.push(pReader.stream.GetString2());
							return true;
						}
						return false;
					}
				}, pReader);
				break;
			}
			default:
				return false;
		}
		
		return true;
	};

	/**
	 * Read attributes from stream for Text_fld_Type
	 *
	 * @param {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if attribute was handled, false otherwise
	 */
	AscVisio.fld_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.iX = stream.GetULong();
				break;
			case 1:
				this.value = stream.GetString2();
				break;
			default:
				return false;
		}
		
		return true;
	};

	/**
	 * Read attributes from stream for Text_tp_Type
	 *
	 * @param {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if attribute was handled, false otherwise
	 */
	AscVisio.tp_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.iX = stream.GetULong();
				break;
			default:
				return false;
		}
		
		return true;
	};

	/**
	 * Read attributes from stream for Text_pp_Type
	 *
	 * @param {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if attribute was handled, false otherwise
	 */
	AscVisio.pp_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.iX = stream.GetULong();
				break;
			default:
				return false;
		}
		
		return true;
	};

	/**
	 * Read attributes from stream for Text_cp_Type
	 *
	 * @param {number} attrType - The type of attribute
	 * @param {BinaryVSDYLoader} pReader - The binary reader
	 * @returns {boolean} - True if attribute was handled, false otherwise
	 */
	AscVisio.cp_Type.prototype.readAttribute = function(attrType, pReader) {
		const stream = pReader.stream;
		switch (attrType) {
			case 0:
				this.iX = stream.GetULong();
				break;
			default:
				return false;
		}
		
		return true;
	};


	// //todo inherit from CBaseFormatNoIdObject and move to main sdk
	// AscVisio.Comments_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.Comments_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.RuleTest_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.RuleTest_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.RuleFilter_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.RuleFilter_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.RowKeyValue_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.RowKeyValue_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.DataColumn_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.DataColumn_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.RuleInfo_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.RuleInfo_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.IssueTarget_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.IssueTarget_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.Rule_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.Rule_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.RuleSetFlags_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.RuleSetFlags_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.AutoLinkComparison_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.AutoLinkComparison_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.RefreshConflict_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.RefreshConflict_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.RowMap_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.RowMap_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.PrimaryKey_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.PrimaryKey_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.DataColumns_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.DataColumns_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.ADOData_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.ADOData_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.TabSplitterPos_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.TabSplitterPos_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.ShowConnectionPoints_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.ShowConnectionPoints_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.ShowGuides_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.ShowGuides_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.ShowGrid_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.ShowGrid_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.ShowRulers_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.ShowRulers_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.StencilGroupPos_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.StencilGroupPos_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.StencilGroup_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.StencilGroup_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.tp_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.tp_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.pp_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.pp_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.fld_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.fld_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.cp_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.cp_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.Rel_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.Rel_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.CommentEntry_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.CommentEntry_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.AuthorEntry_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.AuthorEntry_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.RefreshableData_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.RefreshableData_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.PublishedPage_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.PublishedPage_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.HeaderFooterFont_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.HeaderFooterFont_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.FooterRight_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.FooterRight_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.FooterCenter_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.FooterCenter_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.FooterLeft_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.FooterLeft_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.HeaderRight_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.HeaderRight_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.HeaderCenter_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.HeaderCenter_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.HeaderLeft_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.HeaderLeft_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.FooterMargin_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.FooterMargin_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.HeaderMargin_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.HeaderMargin_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.AttachedToolbars_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.AttachedToolbars_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.CustomToolbarsFile_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.CustomToolbarsFile_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.CustomMenusFile_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.CustomMenusFile_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.ProtectBkgnds_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.ProtectBkgnds_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.ProtectMasters_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.ProtectMasters_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.ProtectShapes_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.ProtectShapes_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.ProtectStyles_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.ProtectStyles_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.DynamicGridEnabled_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.DynamicGridEnabled_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.SnapAngle_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.SnapAngle_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.SnapExtensions_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.SnapExtensions_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.SnapSettings_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.SnapSettings_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.GlueSettings_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.GlueSettings_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.TimePrinted_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.TimePrinted_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.TimeEdited_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.TimeEdited_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.TimeSaved_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.TimeSaved_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.TimeCreated_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.TimeCreated_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.CustomProp_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.CustomProp_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.PreviewPicture_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.PreviewPicture_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.BuildNumberEdited_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.BuildNumberEdited_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.BuildNumberCreated_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.BuildNumberCreated_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.Template_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.Template_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.AlternateNames_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.AlternateNames_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.HyperlinkBase_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.HyperlinkBase_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.Desc_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.Desc_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.Keywords_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.Keywords_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.Category_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.Category_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.Company_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.Company_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.Manager_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.Manager_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.Creator_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.Creator_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.Subject_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.Subject_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.Title_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.Title_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.SectionDef_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.SectionDef_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.FunctionDef_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.FunctionDef_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.CellDef_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.CellDef_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.Issue_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.Issue_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.RuleSet_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.RuleSet_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.ValidationProperties_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.ValidationProperties_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.DataRecordSet_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.DataRecordSet_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.DataConnection_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.DataConnection_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.Connect_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.Connect_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.MasterShortcut_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.MasterShortcut_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.RefBy_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.RefBy_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.PublishSettings_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.PublishSettings_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.DataTransferInfo_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.DataTransferInfo_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.HeaderFooter_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.HeaderFooter_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.ColorEntry_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.ColorEntry_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.DocumentSettings_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.DocumentSettings_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.DocumentProperties_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.DocumentProperties_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.CellDefBase_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.CellDefBase_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.GeometryRow_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.GeometryRow_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.IndexedRow_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.IndexedRow_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.NamedIndexedRow_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.NamedIndexedRow_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.SolutionXML_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.SolutionXML_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.ExtendableCell_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.ExtendableCell_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;
	//
	// AscVisio.ShowPageBreaks_Type.prototype.fromPPTY = AscFormat.AscFormat.CBaseFormatNoIdObject.prototype.fromPPTY;
	// AscVisio.ShowPageBreaks_Type.prototype.readAttributes = AscFormat.CBaseFormatNoIdObject.prototype.readAttributes;

	window['AscVisio']  = window['AscVisio'] || {};

	window['AscVisio'].BinaryVSDYLoader = BinaryVSDYLoader;

})(window, window.document);