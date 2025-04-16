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

(function(window, undefined) {

	var tempHelp = new ArrayBuffer(8);
	var tempHelpUnit = new Uint8Array(tempHelp);
	var tempHelpFloat = new Float64Array(tempHelp);
	function SheetMemory(structSize, maxIndex) {
		//todo separate structure for data and style
		this.data = null;
		this.indexA = -1;
		this.indexB = -1;
		this.structSize = structSize;
		this.maxIndex = maxIndex;
	}
	SheetMemory.prototype.checkIndex = function(index) {
		if (index > this.maxIndex) {
			index = this.maxIndex;
		}
		if (this.data) {
			let allocatedCount = this.getAllocatedCount();
			if (index > this.indexB) {
				if (this.indexA + allocatedCount - 1 < index) {
					let newAllocatedCount = Math.min(Math.max((1.5 * allocatedCount) >> 0, index - this.indexA + 1), (this.maxIndex - this.indexA + 1));
					if (newAllocatedCount > allocatedCount) {
						let oldData = this.data;
						this.data = new Uint8Array(newAllocatedCount * this.structSize);
						this.data.set(oldData);
					}
				}
				this.indexB = index;
			} else if (index < this.indexA) {
				let oldData = this.data;
				let oldIndexA = this.indexA;
				this.indexA = Math.max(0, index);
				let diff = oldIndexA - this.indexA;
				this.data = new Uint8Array((allocatedCount + diff) * this.structSize);
				this.data.set(oldData, diff * this.structSize);
			}
		} else {
			this.indexA = this.indexB = index;
			let newAllocatedCount = Math.min(32, (this.maxIndex - this.indexA + 1));
			this.data = new Uint8Array(newAllocatedCount * this.structSize);
		}
	};
	SheetMemory.prototype.hasIndex = function(index) {
		return this.indexA <= index && index <= this.indexB;
	};
	SheetMemory.prototype.getMinIndex = function() {
		return this.indexA;
	};
	SheetMemory.prototype.getMaxIndex = function() {
		return this.indexB;
	};
	SheetMemory.prototype.getAllocatedCount = function() {
		return this.data && (this.data.length / this.structSize) || 0;
	};
	SheetMemory.prototype.clone = function() {
		var sheetMemory = new SheetMemory(this.structSize, this.maxIndex);
		sheetMemory.data = this.data ? new Uint8Array(this.data) : null;
		sheetMemory.indexA = this.indexA;
		sheetMemory.indexB = this.indexB;
		return sheetMemory;
	};
	SheetMemory.prototype.deleteRange = function(start, deleteCount) {
		let delA = start;
		let delB = start + deleteCount - 1;
		if (delA > this.indexB) {
			return;
		}
		if (delA <= this.indexA) {
			if (delB < this.indexA) {
				this.indexA -= deleteCount;
				this.indexB -= deleteCount;
			} else if (delB >= this.indexB) {
				this.data = null;
				this.indexA = this.indexB = -1;
			} else {
				let endOffset = (delB + 1 - this.indexA) * this.structSize;
				this.data.set(this.data.subarray(endOffset), 0);
				this.data.fill(0, (this.indexB - delB) * this.structSize);
				this.indexA = delA;
				this.indexB -= deleteCount;
			}
		} else {
			if (delB >= this.indexB) {
				this.data.fill(0, (delA - this.indexA) * this.structSize);
				this.indexB = delA - 1;
			} else {
				let startOffset = (delA - this.indexA) * this.structSize;
				let endOffset = (delB + 1 - this.indexA) * this.structSize;
				this.data.set(this.data.subarray(endOffset), startOffset);
				this.data.fill(0, (this.indexB - this.indexA + 1 - deleteCount) * this.structSize);
				this.indexB -= deleteCount;
			}
		}
	};
	SheetMemory.prototype.insertRange = function(start, insertCount) {
		let insA = start;
		let insB = start + insertCount;
		if (insA > this.indexB) {
			return;
		}
		if (insA <= this.indexA) {
			this.indexA += insertCount;
			this.indexB += insertCount;
		} else {
			this.checkIndex(this.indexB + insertCount);
			const newCount = (this.indexB + 1 - this.indexA);
			const startOffset = (insA - this.indexA) * this.structSize;
			const endOffset = (insB - this.indexA) * this.structSize;
			const endData = (newCount - insertCount) * this.structSize;
			this.data.set(this.data.subarray(startOffset, endData), endOffset);
			this.data.fill(0, startOffset, endOffset);
		}
	};
	SheetMemory.prototype.copyRange = function(sheetMemory, startFrom, startTo, count) {
		let dataCopy, startToSrc = startTo, countSrc = count;
		if (startFrom <= sheetMemory.indexB && startFrom + count - 1 >= sheetMemory.indexA) {
			if (startFrom < sheetMemory.indexA) {
				let diff = sheetMemory.indexA - startFrom;
				startTo += diff;
				count -= diff;
				startFrom = sheetMemory.indexA;
			}
			if (startFrom + count - 1 > sheetMemory.indexB) {
				count -= startFrom + count - 1 - sheetMemory.indexB;
			}
			if (count > 0) {
				let startOffsetFrom = (startFrom - sheetMemory.indexA) * this.structSize;
				let endOffsetFrom = (startFrom - sheetMemory.indexA + count) * this.structSize;
				dataCopy = sheetMemory.data.slice(startOffsetFrom, endOffsetFrom);
			}
		}
		this.clear(startToSrc, startToSrc + countSrc);
		if(dataCopy) {
			this.checkIndex(startTo);
			this.checkIndex(startTo + count - 1);
			let startOffsetTo = (startTo - this.indexA) * this.structSize;
			this.data.set(dataCopy, startOffsetTo);
		}
	};
	SheetMemory.prototype.copyRangeByChunk = function(from, fromCount, to, toCount) {
		if (from <= this.indexB && from + fromCount - 1 >= this.indexA) {
			//todo from < this.indexA
			var fromStartOffset = Math.max(0, (from - this.indexA)) * this.structSize;
			var fromEndOffset = (Math.min((from + fromCount), this.indexB + 1) - this.indexA) * this.structSize;
			var fromSubArray = this.data.subarray(fromStartOffset, fromEndOffset);
			this.checkIndex(to + toCount - 1);
			for (var i = to; i < to + toCount && i <= this.indexB; i += fromCount) {
				this.data.set(fromSubArray, (i - this.indexA) * this.structSize);
			}
		}
	};
	SheetMemory.prototype.clear = function(start, end) {
		start = Math.max(start, this.indexA);
		end = Math.min(end, this.indexB + 1);
		if (start < end) {
			this.data.fill(0, (start - this.indexA) * this.structSize, (end - this.indexA) * this.structSize);
		}
	};
	SheetMemory.prototype.getUint8 = function(index, offset) {
		offset += (index - this.indexA) * this.structSize;
		return this.data[offset];
	};
	SheetMemory.prototype.setUint8 = function(index, offset, val) {
		offset += (index - this.indexA) * this.structSize;
		this.data[offset] = val;
	};
	SheetMemory.prototype.getUint16 = function(index, offset) {
		offset += (index - this.indexA) * this.structSize;
		return AscFonts.FT_Common.IntToUInt(this.data[offset] | this.data[offset + 1] << 8);
	};
	SheetMemory.prototype.setUint16 = function(index, offset, val) {
		offset += (index - this.indexA) * this.structSize;
		this.data[offset] = (val) & 0xFF;
		this.data[offset + 1] = (val >>> 8) & 0xFF;
	};
	SheetMemory.prototype.getUint32 = function(index, offset) {
		offset += (index - this.indexA) * this.structSize;
		return AscFonts.FT_Common.IntToUInt(this.data[offset] | this.data[offset + 1] << 8 | this.data[offset + 2] << 16 | this.data[offset + 3] << 24);
	};
	SheetMemory.prototype.setUint32 = function(index, offset, val) {
		offset += (index - this.indexA) * this.structSize;
		this.data[offset] = (val) & 0xFF;
		this.data[offset + 1] = (val >>> 8) & 0xFF;
		this.data[offset + 2] = (val >>> 16) & 0xFF;
		this.data[offset + 3] = (val >>> 24) & 0xFF;
	};
	SheetMemory.prototype.getFloat64 = function(index, offset) {
		offset += (index - this.indexA) * this.structSize;
		tempHelpUnit[0] = this.data[offset];
		tempHelpUnit[1] = this.data[offset + 1];
		tempHelpUnit[2] = this.data[offset + 2];
		tempHelpUnit[3] = this.data[offset + 3];
		tempHelpUnit[4] = this.data[offset + 4];
		tempHelpUnit[5] = this.data[offset + 5];
		tempHelpUnit[6] = this.data[offset + 6];
		tempHelpUnit[7] = this.data[offset + 7];
		return tempHelpFloat[0];
	};
	SheetMemory.prototype.setFloat64 = function(index, offset, val) {
		offset += (index - this.indexA) * this.structSize;
		tempHelpFloat[0] = val;
		this.data[offset] = tempHelpUnit[0];
		this.data[offset + 1] = tempHelpUnit[1];
		this.data[offset + 2] = tempHelpUnit[2];
		this.data[offset + 3] = tempHelpUnit[3];
		this.data[offset + 4] = tempHelpUnit[4];
		this.data[offset + 5] = tempHelpUnit[5];
		this.data[offset + 6] = tempHelpUnit[6];
		this.data[offset + 7] = tempHelpUnit[7];
	};

	// Export
	window['AscCommonExcel'] = window['AscCommonExcel'] || {};
	window['AscCommonExcel'].SheetMemory = SheetMemory;
})(window);
