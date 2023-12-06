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
	 * @constructor
	 */
	function DataBinding(prefix, itemID, xpath, checkSum)
	{
		this.prefixMappings		= prefix ? prefix : undefined;
		this.storeItemID 		= itemID ? itemID : undefined;
		this.xpath				= xpath ? xpath : undefined;
		this.storeItemCheckSum	= checkSum ? checkSum : undefined;
	}
	DataBinding.prototype.copy = function()
	{
		return new DataBinding(this.prefixMappings, this.storeItemID, this.xpath, this.storeItemCheckSum);
	};
	DataBinding.prototype.recalculateCheckSum = function (stringOfCustomXMlContent)
	{
		// 		let str = stringOfCustomXMlContent;
// 		const encoder = new TextEncoder();
// 		stringOfCustomXMlContent = encoder.encode(stringOfCustomXMlContent);
//
// 		function calculateMsoCrc32Utf8(data) {
// 			const polynomial = 0xAF; // Полином x^32+x^7+x^5+x^3+x^2+x+1
// 			let crc = 0xFFFFFFFF; // Начальное значение
//
// 			for (let i = 0; i < data.length; i++) {
// 				let code = data.charCodeAt(i);
//
// 				if (code < 0x80) {
// 					code = code & 0xFF; // Приводим к однобайтовому значению
// 					crc ^= (code << 24);
// 				} else if (code < 0x800) {
// 					crc ^= ((0xC0 | (code >> 6)) << 24);
// 					crc ^= ((0x80 | (code & 0x3F)) << 24);
// 				} else if (code < 0x10000) {
// 					crc ^= ((0xE0 | (code >> 12)) << 24);
// 					crc ^= ((0x80 | ((code >> 6) & 0x3F)) << 24);
// 					crc ^= ((0x80 | (code & 0x3F)) << 24);
// 				} else {
// 					crc ^= ((0xF0 | (code >> 18)) << 24);
// 					crc ^= ((0x80 | ((code >> 12) & 0x3F)) << 24);
// 					crc ^= ((0x80 | ((code >> 6) & 0x3F)) << 24);
// 					crc ^= ((0x80 | (code & 0x3F)) << 24);
// 				}
//
// 				for (let j = 0; j < 8; j++) {
// 					if ((crc & 0x80000000) !== 0) {
// 						crc = (crc << 1) ^ polynomial;
// 					} else {
// 						crc <<= 1;
// 					}
// 				}
// 			}
//
// 			return crc >>> 0; // Возвращаем беззнаковое 32-битное значение
// 		}
//
//
//
// 		function calculateCRC(data) {
// 			const polynomial = 0xAF; // Полином x32+x7+x5+x3+x2+x+1
// 			let crc = 0xFFFFFFFF; // Начальное значение
//
// 			for (let i = 0; i < data.length; i++) {
// 				let code = data.charCodeAt(i);
//
// 				if (code < 0x80) {
// 					crc ^= (code << 24);
// 				} else if (code < 0x800) {
// 					crc ^= ((0xC0 | (code >> 6)) << 24);
// 					crc ^= ((0x80 | (code & 0x3F)) << 24);
// 				} else if (code < 0x10000) {
// 					crc ^= ((0xE0 | (code >> 12)) << 24);
// 					crc ^= ((0x80 | ((code >> 6) & 0x3F)) << 24);
// 					crc ^= ((0x80 | (code & 0x3F)) << 24);
// 				} else {
// 					crc ^= ((0xF0 | (code >> 18)) << 24);
// 					crc ^= ((0x80 | ((code >> 12) & 0x3F)) << 24);
// 					crc ^= ((0x80 | ((code >> 6) & 0x3F)) << 24);
// 					crc ^= ((0x80 | (code & 0x3F)) << 24);
// 				}
//
// 				for (let j = 0; j < 8; j++) {
// 					if ((crc & 0x80000000) !== 0) {
// 						crc = (crc << 1) ^ polynomial;
// 					} else {
// 						crc <<= 1;
// 					}
// 				}
// 			}
//
// 			return crc >>> 0;
// 		}
//
// 		function CRC(CrcValue, data) {
// 			for (let i = 0; i < data.length; i++) {
// 				let byte = data.charCodeAt(i);
//
// 				let index = CrcValue;
// 				index = (index >>> 24) ^ byte;
//
// 				CrcValue <<= 8;
// 				CrcValue ^= index; // Просто XOR с байтом
// 			}
//
// 			return CrcValue >>> 0; // Возвращаем беззнаковое 32-битное значение
// 		}
//
// 		const crcResult = CRC( 0xFFFFFFFF, str);
// 		const byteArray = [
// 			(crcResult >> 24) & 0xFF,
// 			(crcResult >> 16) & 0xFF,
// 			(crcResult >> 8) & 0xFF,
// 			crcResult & 0xFF
// 		];
//
// 		const base64Value = bytesToBase64(byteArray);
// 		console.log(base64Value)
//
// 		function bytesToBase64(bytes) {
// 			const base64Chars =
// 				'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
//
// 			let result = '';
// 			let i = 0;
//
// 			while (i < bytes.length) {
// 				const byte1 = bytes[i++] & 0xff;
// 				const byte2 = bytes[i++] & 0xff;
// 				const byte3 = bytes[i++] & 0xff;
//
// 				const enc1 = byte1 >> 2;
// 				const enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
// 				const enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
// 				const enc4 = byte3 & 63;
//
// 				if (isNaN(byte2)) {
// 					enc3 = enc4 = 64;
// 				} else if (isNaN(byte3)) {
// 					enc4 = 64;
// 				}
//
// 				result +=
// 					base64Chars.charAt(enc1) +
// 					base64Chars.charAt(enc2) +
// 					base64Chars.charAt(enc3) +
// 					base64Chars.charAt(enc4);
// 			}
//
// 			return result;
// 		}
//
//
//
//
// 		console.log(calculateCRC(str));
//
// 		//check
// 		const CRC32_POLY = 0x04C11DB7;
// 		let crc32TableArray = new Array(256);
// 		let crcValue = 0xFFFFFFFF;
//
// // InitializationOfCRC32TableArray Function
// 		function initializeCRC32TableArray() {
// 			for (let iValue = 0; iValue < crc32TableArray.length; iValue++) {
// 				let cValue = iValue << 24;
// 				for (let jValue = 8; jValue > 0; jValue--) {
// 					cValue = (cValue & 0x80000000) ? ((cValue << 1) ^ CRC32_POLY) : (cValue << 1);
// 					crc32TableArray[iValue] = cValue;
// 				}
// 			}
// 		}
//
// // Calculation of crc32Value
// 		function calculateCRC32Value(pBuffer, cLength) {
// 			for (let i = 0; i < cLength; i++) {
// 				let tempIndex = (crcValue >>> 24) ^ pBuffer[i];
// 				crcValue = (crcValue << 8) ^ crc32TableArray[tempIndex];
// 			}
// 		}
//
// 		initializeCRC32TableArray();
// 		const buffer = stringOfCustomXMlContent;
// 		const bufferLength = buffer.length;
// 		calculateCRC32Value(buffer, bufferLength);
// 		console.log("CRC32 Value:", crcValue);
//
//
// 		let crc = AscCommon.g_oCRC32.Calculate_ByString(str, str.length);
// 		console.log(crc)
// 		this.storeItemCheckSum = AscCommon.Base64.encode(crcValue.toString());
	}
	DataBinding.prototype.toBinary = function(writer)
	{
		return this.Write_ToBinary(writer);
	};
	DataBinding.fromBinary = function(reader)
	{
		let data = new DataBinding();
		data.Read_FromBinary(reader);
		return data;
	};
	DataBinding.prototype.Write_ToBinary = function(writer)
	{
		let startPos = writer.GetCurPosition();
		writer.Skip(4);
		let flags = 0;
		
		if (undefined !== this.prefixMappings)
		{
			writer.WriteString2(this.prefixMappings);
			flags |= 1;
		}
		
		if (undefined !== this.storeItemID)
		{
			writer.WriteLong(this.storeItemID);
			flags |= 2;
		}
		
		if (undefined !== this.xpath)
		{
			writer.WriteString2(this.xpath);
			flags |= 4;
		}
		
		let endPos = startPos.GetCurPosition();
		writer.Seek(startPos);
		writer.WriteLong(flags);
		writer.Seek(endPos);
	};
	DataBinding.prototype.Read_FromBinary = function(reader)
	{
		let flags = reader.GetLong();
		if (flags & 1)
			this.prefixMappings = reader.GetString2();
		if (flags & 2)
			this.storeItemID = reader.GetString2();
		if (flags & 4)
			this.xpath = reader.GetString2();
	};
	
	//--------------------------------------------------------export----------------------------------------------------
	window['AscWord'] = window['AscWord'] || {};
	window['AscWord'].DataBinding = DataBinding;
	
})(window);
