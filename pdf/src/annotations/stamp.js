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

(function(){

    let STAMP_XML = {
        // dinamic
        'D_Approved': '<wps:wsp><wps:cNvPr id="0" name=""/><wps:cNvSpPr/><wps:spPr bwMode="auto"><a:xfrm flipH="0" flipV="0" rot="0"><a:off x="0" y="0"/><a:ext cx="4169433" cy="742948"/></a:xfrm><a:prstGeom prst="flowChartProcess"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="E1F7E5"><a:alpha val="80000"/></a:srgbClr></a:solidFill><a:ln algn="ctr" cap="flat" cmpd="sng" w="38099"><a:solidFill><a:srgbClr val="0E8A26"/></a:solidFill><a:prstDash val="solid"/></a:ln></wps:spPr><wps:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></wps:style><wps:txbx><w:txbxContent><w:p><w:pPr><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind/><w:contextualSpacing w:val="true"/><w:jc w:val="center"/><w:rPr><w:b/><w:bCs/><w:color w:val="0e8a26"/><w:sz w:val="56"/><w:szCs w:val="56"/><w:highlight w:val="none"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="0e8a26"/><w:sz w:val="48"/><w:szCs w:val="48"/></w:rPr><w:t xml:space="preserve">APPROVED</w:t></w:r><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="0e8a26"/><w:sz w:val="56"/><w:szCs w:val="56"/><w:highlight w:val="none"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="0e8a26"/><w:sz w:val="56"/><w:szCs w:val="56"/><w:highlight w:val="none"/></w:rPr></w:r></w:p><w:p><w:pPr><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind/><w:contextualSpacing w:val="true"/><w:jc w:val="center"/><w:rPr><w:b w:val="0"/><w:bCs w:val="0"/><w:color w:val="0e8a26"/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:pPr><w:r><w:rPr><w:b w:val="0"/><w:bCs w:val="0"/><w:color w:val="0e8a26"/><w:sz w:val="32"/><w:szCs w:val="32"/><w:highlight w:val="none"/></w:rPr><w:t xml:space="preserve">by Dmitrii Gorshkov at 18:02, Nov 05, 2024</w:t></w:r><w:r><w:rPr><w:b w:val="0"/><w:bCs w:val="0"/><w:color w:val="0e8a26"/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:r><w:r><w:rPr><w:b w:val="0"/><w:bCs w:val="0"/><w:color w:val="0e8a26"/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:r></w:p></w:txbxContent></wps:txbx><wps:bodyPr anchor="b" anchorCtr="0" bIns="45720" compatLnSpc="0" forceAA="0" fromWordArt="0" horzOverflow="overflow" lIns="91440" numCol="1" rIns="91440" rtlCol="0" spcCol="0" tIns="45720" upright="0" vert="horz" vertOverflow="overflow" wrap="square"/></wps:wsp>',
        'D_Revised': '<wps:wsp><wps:cNvPr id="0" name=""/><wps:cNvSpPr/><wps:spPr bwMode="auto"><a:xfrm flipH="0" flipV="0" rot="0"><a:off x="0" y="0"/><a:ext cx="4169433" cy="742948"/></a:xfrm><a:prstGeom prst="flowChartProcess"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="DCE6FF"><a:alpha val="80000"/></a:srgbClr></a:solidFill><a:ln algn="ctr" cap="flat" cmpd="sng" w="38099"><a:solidFill><a:srgbClr val="4E80F5"/></a:solidFill><a:prstDash val="solid"/></a:ln></wps:spPr><wps:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></wps:style><wps:txbx><w:txbxContent><w:p><w:pPr><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind/><w:contextualSpacing w:val="true"/><w:jc w:val="center"/><w:rPr><w:b/><w:bCs/><w:color w:val="0e8a26"/><w:sz w:val="56"/><w:szCs w:val="56"/><w:highlight w:val="none"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="4e80f5"/><w:sz w:val="48"/><w:szCs w:val="48"/></w:rPr><w:t xml:space="preserve">REVISED</w:t></w:r><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="0e8a26"/><w:sz w:val="56"/><w:szCs w:val="56"/><w:highlight w:val="none"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="0e8a26"/><w:sz w:val="56"/><w:szCs w:val="56"/><w:highlight w:val="none"/></w:rPr></w:r></w:p><w:p><w:pPr><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind/><w:contextualSpacing w:val="true"/><w:jc w:val="center"/><w:rPr><w:b w:val="0"/><w:bCs w:val="0"/><w:color w:val="4e80f5"/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:pPr><w:r><w:rPr><w:b w:val="0"/><w:bCs w:val="0"/><w:color w:val="4e80f5"/><w:sz w:val="32"/><w:szCs w:val="32"/><w:highlight w:val="none"/></w:rPr><w:t xml:space="preserve">by Dmitrii Gorshkov </w:t></w:r><w:r><w:rPr><w:b w:val="0"/><w:bCs w:val="0"/><w:color w:val="4e80f5"/><w:sz w:val="32"/><w:szCs w:val="32"/><w:highlight w:val="none"/></w:rPr><w:t xml:space="preserve">at 18:02, Nov 05, 2024</w:t></w:r><w:r><w:rPr><w:b w:val="0"/><w:bCs w:val="0"/><w:color w:val="4e80f5"/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:r><w:r><w:rPr><w:b w:val="0"/><w:bCs w:val="0"/><w:color w:val="4e80f5"/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:r></w:p></w:txbxContent></wps:txbx><wps:bodyPr anchor="b" anchorCtr="0" bIns="45720" compatLnSpc="0" forceAA="0" fromWordArt="0" horzOverflow="overflow" lIns="91440" numCol="1" rIns="91440" rtlCol="0" spcCol="0" tIns="45720" upright="0" vert="horz" vertOverflow="overflow" wrap="square"/></wps:wsp>',
        'D_Reviewed': '<wps:wsp><wps:cNvPr id="0" name=""/><wps:cNvSpPr/><wps:spPr bwMode="auto"><a:xfrm flipH="0" flipV="0" rot="0"><a:off x="0" y="0"/><a:ext cx="4169433" cy="742948"/></a:xfrm><a:prstGeom prst="flowChartProcess"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="DCE6FF"><a:alpha val="80000"/></a:srgbClr></a:solidFill><a:ln algn="ctr" cap="flat" cmpd="sng" w="38099"><a:solidFill><a:srgbClr val="4E80F5"/></a:solidFill><a:prstDash val="solid"/></a:ln></wps:spPr><wps:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></wps:style><wps:txbx><w:txbxContent><w:p><w:pPr><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind/><w:contextualSpacing w:val="true"/><w:jc w:val="center"/><w:rPr><w:b/><w:bCs/><w:color w:val="0e8a26"/><w:sz w:val="56"/><w:szCs w:val="56"/><w:highlight w:val="none"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="4e80f5"/><w:sz w:val="48"/><w:szCs w:val="48"/></w:rPr><w:t xml:space="preserve">REVIEWED</w:t></w:r><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="0e8a26"/><w:sz w:val="56"/><w:szCs w:val="56"/><w:highlight w:val="none"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="0e8a26"/><w:sz w:val="56"/><w:szCs w:val="56"/><w:highlight w:val="none"/></w:rPr></w:r></w:p><w:p><w:pPr><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind/><w:contextualSpacing w:val="true"/><w:jc w:val="center"/><w:rPr><w:b w:val="0"/><w:bCs w:val="0"/><w:color w:val="4e80f5"/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:pPr><w:r><w:rPr><w:b w:val="0"/><w:bCs w:val="0"/><w:color w:val="4e80f5"/><w:sz w:val="32"/><w:szCs w:val="32"/><w:highlight w:val="none"/></w:rPr><w:t xml:space="preserve">by Dmitrii Gorshkov </w:t></w:r><w:r><w:rPr><w:b w:val="0"/><w:bCs w:val="0"/><w:color w:val="4e80f5"/><w:sz w:val="32"/><w:szCs w:val="32"/><w:highlight w:val="none"/></w:rPr><w:t xml:space="preserve">at 18:02, Nov 05, 2024</w:t></w:r><w:r><w:rPr><w:b w:val="0"/><w:bCs w:val="0"/><w:color w:val="4e80f5"/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:r><w:r><w:rPr><w:b w:val="0"/><w:bCs w:val="0"/><w:color w:val="4e80f5"/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:r></w:p></w:txbxContent></wps:txbx><wps:bodyPr anchor="b" anchorCtr="0" bIns="45720" compatLnSpc="0" forceAA="0" fromWordArt="0" horzOverflow="overflow" lIns="91440" numCol="1" rIns="91440" rtlCol="0" spcCol="0" tIns="45720" upright="0" vert="horz" vertOverflow="overflow" wrap="square"/></wps:wsp>',
        'D_Received': '<wps:wsp><wps:cNvPr id="0" name=""/><wps:cNvSpPr/><wps:spPr bwMode="auto"><a:xfrm flipH="0" flipV="0" rot="0"><a:off x="0" y="0"/><a:ext cx="4169433" cy="742948"/></a:xfrm><a:prstGeom prst="flowChartProcess"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="DCE6FF"><a:alpha val="80000"/></a:srgbClr></a:solidFill><a:ln algn="ctr" cap="flat" cmpd="sng" w="38099"><a:solidFill><a:srgbClr val="4E80F5"/></a:solidFill><a:prstDash val="solid"/></a:ln></wps:spPr><wps:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></wps:style><wps:txbx><w:txbxContent><w:p><w:pPr><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind/><w:contextualSpacing w:val="true"/><w:jc w:val="center"/><w:rPr><w:b/><w:bCs/><w:color w:val="0e8a26"/><w:sz w:val="56"/><w:szCs w:val="56"/><w:highlight w:val="none"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="4e80f5"/><w:sz w:val="48"/><w:szCs w:val="48"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="4e80f5"/><w:sz w:val="48"/><w:szCs w:val="48"/></w:rPr><w:t xml:space="preserve">RECEIVED</w:t></w:r><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="0e8a26"/><w:sz w:val="56"/><w:szCs w:val="56"/><w:highlight w:val="none"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="0e8a26"/><w:sz w:val="56"/><w:szCs w:val="56"/><w:highlight w:val="none"/></w:rPr></w:r></w:p><w:p><w:pPr><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind/><w:contextualSpacing w:val="true"/><w:jc w:val="center"/><w:rPr><w:b w:val="0"/><w:bCs w:val="0"/><w:color w:val="4e80f5"/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:pPr><w:r><w:rPr><w:b w:val="0"/><w:bCs w:val="0"/><w:color w:val="4e80f5"/><w:sz w:val="32"/><w:szCs w:val="32"/><w:highlight w:val="none"/></w:rPr><w:t xml:space="preserve">by Dmitrii Gorshkov </w:t></w:r><w:r><w:rPr><w:b w:val="0"/><w:bCs w:val="0"/><w:color w:val="4e80f5"/><w:sz w:val="32"/><w:szCs w:val="32"/><w:highlight w:val="none"/></w:rPr><w:t xml:space="preserve">at 18:02, Nov 05, 2024</w:t></w:r><w:r><w:rPr><w:b w:val="0"/><w:bCs w:val="0"/><w:color w:val="4e80f5"/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:r><w:r><w:rPr><w:b w:val="0"/><w:bCs w:val="0"/><w:color w:val="4e80f5"/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:r></w:p></w:txbxContent></wps:txbx><wps:bodyPr anchor="b" anchorCtr="0" bIns="45720" compatLnSpc="0" forceAA="0" fromWordArt="0" horzOverflow="overflow" lIns="91440" numCol="1" rIns="91440" rtlCol="0" spcCol="0" tIns="45720" upright="0" vert="horz" vertOverflow="overflow" wrap="square"/></wps:wsp>',
        
        // standard
        'SB_Approved': '<wps:wsp><wps:cNvPr id="0" name=""/><wps:cNvSpPr/><wps:spPr bwMode="auto"><a:xfrm flipH="0" flipV="0" rot="0"><a:off x="0" y="0"/><a:ext cx="2128836" cy="500544"/></a:xfrm><a:prstGeom prst="flowChartProcess"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="E1F7E5"><a:alpha val="80000"/></a:srgbClr></a:solidFill><a:ln algn="ctr" cap="flat" cmpd="sng" w="38099"><a:solidFill><a:srgbClr val="0E8A26"/></a:solidFill><a:prstDash val="solid"/></a:ln></wps:spPr><wps:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></wps:style><wps:txbx><w:txbxContent><w:p><w:pPr><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind/><w:contextualSpacing w:val="true"/><w:jc w:val="center"/><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="0e8a26"/><w:sz w:val="52"/><w:szCs w:val="52"/></w:rPr><w:t xml:space="preserve">APPROVED</w:t></w:r><w:r><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r></w:p></w:txbxContent></wps:txbx><wps:bodyPr anchor="b" anchorCtr="0" bIns="45720" compatLnSpc="0" forceAA="0" fromWordArt="0" horzOverflow="overflow" lIns="91440" numCol="1" rIns="91440" rtlCol="0" spcCol="0" tIns="45720" upright="0" vert="horz" vertOverflow="overflow" wrap="square"><a:noAutofit/></wps:bodyPr></wps:wsp>',
        'SB_NotApproved': '<wps:wsp><wps:cNvPr id="0" name=""/><wps:cNvSpPr/><wps:spPr bwMode="auto"><a:xfrm flipH="0" flipV="0" rot="0"><a:off x="0" y="0"/><a:ext cx="2993133" cy="483168"/></a:xfrm><a:prstGeom prst="flowChartProcess"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="FFDCDC"><a:alpha val="80000"/></a:srgbClr></a:solidFill><a:ln algn="ctr" cap="flat" cmpd="sng" w="38099"><a:solidFill><a:srgbClr val="F23D3D"/></a:solidFill><a:prstDash val="solid"/></a:ln></wps:spPr><wps:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></wps:style><wps:txbx><w:txbxContent><w:p><w:pPr><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind/><w:contextualSpacing w:val="true"/><w:jc w:val="center"/><w:rPr><w:b/><w:color w:val="f23d3d"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="f23d3d"/><w:sz w:val="52"/><w:szCs w:val="52"/></w:rPr><w:t xml:space="preserve">NOT APPROVED</w:t></w:r><w:r><w:rPr><w:b/><w:color w:val="f23d3d"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:color w:val="f23d3d"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r></w:p></w:txbxContent></wps:txbx><wps:bodyPr anchor="b" anchorCtr="0" bIns="45720" compatLnSpc="0" forceAA="0" fromWordArt="0" horzOverflow="overflow" lIns="91440" numCol="1" rIns="91440" rtlCol="0" spcCol="0" tIns="45720" upright="0" vert="horz" vertOverflow="overflow" wrap="square"><a:noAutofit/></wps:bodyPr></wps:wsp>',
        'SB_Revised': '<wps:wsp><wps:cNvPr id="0" name=""/><wps:cNvSpPr/><wps:spPr bwMode="auto"><a:xfrm flipH="0" flipV="0" rot="0"><a:off x="0" y="0"/><a:ext cx="1762128" cy="492442"/></a:xfrm><a:prstGeom prst="flowChartProcess"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="DCE6FF"><a:alpha val="80000"/></a:srgbClr></a:solidFill><a:ln algn="ctr" cap="flat" cmpd="sng" w="38099"><a:solidFill><a:srgbClr val="4E80F5"/></a:solidFill><a:prstDash val="solid"/></a:ln></wps:spPr><wps:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></wps:style><wps:txbx><w:txbxContent><w:p><w:pPr><w:suppressLineNumbers w:val="false"/><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:before="0" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind/><w:contextualSpacing w:val="true"/><w:jc w:val="center"/><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="4e80f5"/><w:sz w:val="52"/><w:szCs w:val="52"/></w:rPr><w:t xml:space="preserve">REVISED</w:t></w:r><w:r><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r></w:p></w:txbxContent></wps:txbx><wps:bodyPr anchor="ctr" anchorCtr="0" bIns="45720" compatLnSpc="0" forceAA="0" fromWordArt="0" horzOverflow="overflow" lIns="91440" numCol="1" rIns="91440" rtlCol="0" spcCol="0" tIns="45720" upright="0" vert="horz" vertOverflow="overflow" wrap="square"><a:noAutofit/></wps:bodyPr></wps:wsp>',
        'SB_Confidential': '<wps:wsp><wps:cNvPr id="0" name=""/><wps:cNvSpPr/><wps:spPr bwMode="auto"><a:xfrm flipH="0" flipV="0" rot="0"><a:off x="0" y="0"/><a:ext cx="2819396" cy="492442"/></a:xfrm><a:prstGeom prst="flowChartProcess"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="DCE6FF"><a:alpha val="80000"/></a:srgbClr></a:solidFill><a:ln algn="ctr" cap="flat" cmpd="sng" w="38099"><a:solidFill><a:srgbClr val="4E80F5"/></a:solidFill><a:prstDash val="solid"/></a:ln></wps:spPr><wps:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></wps:style><wps:txbx><w:txbxContent><w:p><w:pPr><w:suppressLineNumbers w:val="false"/><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:before="0" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind/><w:contextualSpacing w:val="true"/><w:jc w:val="center"/><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="4e80f5"/><w:sz w:val="52"/><w:szCs w:val="52"/></w:rPr><w:t xml:space="preserve">CONFIDENTIAL</w:t></w:r><w:r><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r></w:p></w:txbxContent></wps:txbx><wps:bodyPr anchor="ctr" anchorCtr="0" bIns="45720" compatLnSpc="0" forceAA="0" fromWordArt="0" horzOverflow="overflow" lIns="91440" numCol="1" rIns="91440" rtlCol="0" spcCol="0" tIns="45720" upright="0" vert="horz" vertOverflow="overflow" wrap="square"><a:noAutofit/></wps:bodyPr></wps:wsp>',
        'SB_ForComment': '<wps:wsp><wps:cNvPr id="0" name=""/><wps:cNvSpPr/><wps:spPr bwMode="auto"><a:xfrm flipH="0" flipV="0" rot="0"><a:off x="0" y="0"/><a:ext cx="2828927" cy="492442"/></a:xfrm><a:prstGeom prst="flowChartProcess"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="DCE6FF"><a:alpha val="80000"/></a:srgbClr></a:solidFill><a:ln algn="ctr" cap="flat" cmpd="sng" w="38099"><a:solidFill><a:srgbClr val="4E80F5"/></a:solidFill><a:prstDash val="solid"/></a:ln></wps:spPr><wps:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></wps:style><wps:txbx><w:txbxContent><w:p><w:pPr><w:suppressLineNumbers w:val="false"/><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:before="0" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind/><w:contextualSpacing w:val="true"/><w:jc w:val="center"/><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="4e80f5"/><w:sz w:val="52"/><w:szCs w:val="52"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="4e80f5"/><w:sz w:val="52"/><w:szCs w:val="52"/></w:rPr><w:t xml:space="preserve">FOR </w:t></w:r><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="4e80f5"/><w:sz w:val="52"/><w:szCs w:val="52"/></w:rPr><w:t xml:space="preserve">COMMENT</w:t></w:r><w:r><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r></w:p></w:txbxContent></wps:txbx><wps:bodyPr anchor="b" anchorCtr="0" bIns="45720" compatLnSpc="0" forceAA="0" fromWordArt="0" horzOverflow="overflow" lIns="91440" numCol="1" rIns="91440" rtlCol="0" spcCol="0" tIns="45720" upright="0" vert="horz" vertOverflow="overflow" wrap="square"><a:noAutofit/></wps:bodyPr></wps:wsp>',
        'SB_ForPublicRelease': '<wps:wsp><wps:cNvPr id="0" name=""/><wps:cNvSpPr/><wps:spPr bwMode="auto"><a:xfrm flipH="0" flipV="0" rot="0"><a:off x="0" y="0"/><a:ext cx="4038602" cy="492442"/></a:xfrm><a:prstGeom prst="flowChartProcess"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="DCE6FF"><a:alpha val="80000"/></a:srgbClr></a:solidFill><a:ln algn="ctr" cap="flat" cmpd="sng" w="38099"><a:solidFill><a:srgbClr val="4E80F5"/></a:solidFill><a:prstDash val="solid"/></a:ln></wps:spPr><wps:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></wps:style><wps:txbx><w:txbxContent><w:p><w:pPr><w:suppressLineNumbers w:val="false"/><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:before="0" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind/><w:contextualSpacing w:val="true"/><w:jc w:val="center"/><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="4e80f5"/><w:sz w:val="52"/><w:szCs w:val="52"/></w:rPr><w:t xml:space="preserve">FOR PUBLIC RELEASE</w:t></w:r><w:r><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r></w:p></w:txbxContent></wps:txbx><wps:bodyPr anchor="b" anchorCtr="0" bIns="45720" compatLnSpc="0" forceAA="0" fromWordArt="0" horzOverflow="overflow" lIns="91440" numCol="1" rIns="91440" rtlCol="0" spcCol="0" tIns="45720" upright="0" vert="horz" vertOverflow="overflow" wrap="square"><a:noAutofit/></wps:bodyPr></wps:wsp>',
        'SB_NotForPublicRelease': '<wps:wsp><wps:cNvPr id="0" name=""/><wps:cNvSpPr/><wps:spPr bwMode="auto"><a:xfrm flipH="0" flipV="0" rot="0"><a:off x="0" y="0"/><a:ext cx="4895852" cy="480329"/></a:xfrm><a:prstGeom prst="flowChartProcess"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="DCE6FF"><a:alpha val="80000"/></a:srgbClr></a:solidFill><a:ln algn="ctr" cap="flat" cmpd="sng" w="38099"><a:solidFill><a:srgbClr val="4E80F5"/></a:solidFill><a:prstDash val="solid"/></a:ln></wps:spPr><wps:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></wps:style><wps:txbx><w:txbxContent><w:p><w:pPr><w:suppressLineNumbers w:val="false"/><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:before="0" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind/><w:contextualSpacing w:val="true"/><w:jc w:val="center"/><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="4e80f5"/><w:sz w:val="52"/><w:szCs w:val="52"/></w:rPr><w:t xml:space="preserve">NOT FOR PUBLIC RELEASE</w:t></w:r><w:r><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r></w:p></w:txbxContent></wps:txbx><wps:bodyPr anchor="b" anchorCtr="0" bIns="45720" compatLnSpc="0" forceAA="0" fromWordArt="0" horzOverflow="overflow" lIns="91440" numCol="1" rIns="91440" rtlCol="0" spcCol="0" tIns="45720" upright="0" vert="horz" vertOverflow="overflow" wrap="square"><a:noAutofit/></wps:bodyPr></wps:wsp>',
        'SB_PreliminaryResults': '<wps:wsp><wps:cNvPr id="0" name=""/><wps:cNvSpPr/><wps:spPr bwMode="auto"><a:xfrm flipH="0" flipV="0" rot="0"><a:off x="0" y="0"/><a:ext cx="4214826" cy="483193"/></a:xfrm><a:prstGeom prst="flowChartProcess"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="DCE6FF"><a:alpha val="80000"/></a:srgbClr></a:solidFill><a:ln algn="ctr" cap="flat" cmpd="sng" w="38099"><a:solidFill><a:srgbClr val="4E80F5"/></a:solidFill><a:prstDash val="solid"/></a:ln></wps:spPr><wps:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></wps:style><wps:txbx><w:txbxContent><w:p><w:pPr><w:suppressLineNumbers w:val="false"/><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:before="0" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind/><w:contextualSpacing w:val="true"/><w:jc w:val="center"/><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="4e80f5"/><w:sz w:val="52"/><w:szCs w:val="52"/></w:rPr><w:t xml:space="preserve">PRELIMINARY RESULTS</w:t></w:r><w:r><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r></w:p></w:txbxContent></wps:txbx><wps:bodyPr anchor="b" anchorCtr="0" bIns="45720" compatLnSpc="0" forceAA="0" fromWordArt="0" horzOverflow="overflow" lIns="91440" numCol="1" rIns="91440" rtlCol="0" spcCol="0" tIns="45720" upright="0" vert="horz" vertOverflow="overflow" wrap="square"><a:noAutofit/></wps:bodyPr></wps:wsp>',
        'SB_InformationOnly': '<wps:wsp><wps:cNvPr id="0" name=""/><wps:cNvSpPr/><wps:spPr bwMode="auto"><a:xfrm flipH="0" flipV="0" rot="0"><a:off x="0" y="0"/><a:ext cx="3671904" cy="511768"/></a:xfrm><a:prstGeom prst="flowChartProcess"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="DCE6FF"><a:alpha val="80000"/></a:srgbClr></a:solidFill><a:ln algn="ctr" cap="flat" cmpd="sng" w="38099"><a:solidFill><a:srgbClr val="4E80F5"/></a:solidFill><a:prstDash val="solid"/></a:ln></wps:spPr><wps:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></wps:style><wps:txbx><w:txbxContent><w:p><w:pPr><w:suppressLineNumbers w:val="false"/><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:before="0" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind/><w:contextualSpacing w:val="true"/><w:jc w:val="center"/><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="4e80f5"/><w:sz w:val="52"/><w:szCs w:val="52"/></w:rPr><w:t xml:space="preserve">INFORMATION </w:t></w:r><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="4e80f5"/><w:sz w:val="52"/><w:szCs w:val="52"/></w:rPr><w:t xml:space="preserve">ONLY</w:t></w:r><w:r><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r></w:p></w:txbxContent></wps:txbx><wps:bodyPr anchor="b" anchorCtr="0" bIns="45720" compatLnSpc="0" forceAA="0" fromWordArt="0" horzOverflow="overflow" lIns="91440" numCol="1" rIns="91440" rtlCol="0" spcCol="0" tIns="45720" upright="0" vert="horz" vertOverflow="overflow" wrap="square"><a:noAutofit/></wps:bodyPr></wps:wsp>',
        'SB_Draft': '<wps:wsp><wps:cNvPr id="0" name=""/><wps:cNvSpPr/><wps:spPr bwMode="auto"><a:xfrm flipH="0" flipV="0" rot="0"><a:off x="0" y="0"/><a:ext cx="1514466" cy="469590"/></a:xfrm><a:prstGeom prst="flowChartProcess"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="FFE6C8"><a:alpha val="80000"/></a:srgbClr></a:solidFill><a:ln algn="ctr" cap="flat" cmpd="sng" w="38099"><a:solidFill><a:srgbClr val="FF8E00"/></a:solidFill><a:prstDash val="solid"/></a:ln></wps:spPr><wps:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></wps:style><wps:txbx><w:txbxContent><w:p><w:pPr><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind/><w:contextualSpacing w:val="true"/><w:jc w:val="center"/><w:rPr><w:b/><w:color w:val="ff8e00"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="ff8e00"/><w:sz w:val="52"/><w:szCs w:val="52"/></w:rPr><w:t xml:space="preserve">DRAFT</w:t></w:r><w:r><w:rPr><w:b/><w:color w:val="ff8e00"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:color w:val="ff8e00"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r></w:p></w:txbxContent></wps:txbx><wps:bodyPr anchor="b" anchorCtr="0" bIns="45720" compatLnSpc="0" forceAA="0" fromWordArt="0" horzOverflow="overflow" lIns="91440" numCol="1" rIns="91440" rtlCol="0" spcCol="0" tIns="45720" upright="0" vert="horz" vertOverflow="overflow" wrap="square"><a:noAutofit/></wps:bodyPr></wps:wsp>',
        'SB_Completed': '<wps:wsp><wps:cNvPr id="0" name=""/><wps:cNvSpPr/><wps:spPr bwMode="auto"><a:xfrm flipH="0" flipV="0" rot="0"><a:off x="0" y="0"/><a:ext cx="2144214" cy="500544"/></a:xfrm><a:prstGeom prst="flowChartProcess"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="E1F7E5"><a:alpha val="80000"/></a:srgbClr></a:solidFill><a:ln algn="ctr" cap="flat" cmpd="sng" w="38099"><a:solidFill><a:srgbClr val="0E8A26"/></a:solidFill><a:prstDash val="solid"/></a:ln></wps:spPr><wps:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></wps:style><wps:txbx><w:txbxContent><w:p><w:pPr><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind/><w:contextualSpacing w:val="true"/><w:jc w:val="center"/><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="0e8a26"/><w:sz w:val="52"/><w:szCs w:val="52"/></w:rPr><w:t xml:space="preserve">COMPLETED</w:t></w:r><w:r><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r></w:p></w:txbxContent></wps:txbx><wps:bodyPr anchor="b" anchorCtr="0" bIns="45720" compatLnSpc="0" forceAA="0" fromWordArt="0" horzOverflow="overflow" lIns="91440" numCol="1" rIns="91440" rtlCol="0" spcCol="0" tIns="45720" upright="0" vert="horz" vertOverflow="overflow" wrap="square"><a:noAutofit/></wps:bodyPr></wps:wsp>',
        'SB_Final': '<wps:wsp><wps:cNvPr id="0" name=""/><wps:cNvSpPr/><wps:spPr bwMode="auto"><a:xfrm flipH="0" flipV="0" rot="0"><a:off x="0" y="0"/><a:ext cx="1278605" cy="500544"/></a:xfrm><a:prstGeom prst="flowChartProcess"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="E1F7E5"><a:alpha val="80000"/></a:srgbClr></a:solidFill><a:ln algn="ctr" cap="flat" cmpd="sng" w="38099"><a:solidFill><a:srgbClr val="0E8A26"/></a:solidFill><a:prstDash val="solid"/></a:ln></wps:spPr><wps:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></wps:style><wps:txbx><w:txbxContent><w:p><w:pPr><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind/><w:contextualSpacing w:val="true"/><w:jc w:val="center"/><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="0e8a26"/><w:sz w:val="52"/><w:szCs w:val="52"/></w:rPr><w:t xml:space="preserve">FINAL</w:t></w:r><w:r><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:color w:val="4e80f5"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r></w:p></w:txbxContent></wps:txbx><wps:bodyPr anchor="b" anchorCtr="0" bIns="45720" compatLnSpc="0" forceAA="0" fromWordArt="0" horzOverflow="overflow" lIns="91440" numCol="1" rIns="91440" rtlCol="0" spcCol="0" tIns="45720" upright="0" vert="horz" vertOverflow="overflow" wrap="square"><a:noAutofit/></wps:bodyPr></wps:wsp>',
        'SB_Void': '<wps:wsp><wps:cNvPr id="0" name=""/><wps:cNvSpPr/><wps:spPr bwMode="auto"><a:xfrm flipH="0" flipV="0" rot="0"><a:off x="0" y="0"/><a:ext cx="1190626" cy="483168"/></a:xfrm><a:prstGeom prst="flowChartProcess"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="FFDCDC"><a:alpha val="80000"/></a:srgbClr></a:solidFill><a:ln algn="ctr" cap="flat" cmpd="sng" w="38099"><a:solidFill><a:srgbClr val="F23D3D"/></a:solidFill><a:prstDash val="solid"/></a:ln></wps:spPr><wps:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></wps:style><wps:txbx><w:txbxContent><w:p><w:pPr><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind/><w:contextualSpacing w:val="true"/><w:jc w:val="center"/><w:rPr><w:b/><w:color w:val="f23d3d"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="f23d3d"/><w:sz w:val="52"/><w:szCs w:val="52"/></w:rPr><w:t xml:space="preserve">VOID</w:t></w:r><w:r><w:rPr><w:b/><w:color w:val="f23d3d"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:color w:val="f23d3d"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r></w:p></w:txbxContent></wps:txbx><wps:bodyPr anchor="b" anchorCtr="0" bIns="45720" compatLnSpc="0" forceAA="0" fromWordArt="0" horzOverflow="overflow" lIns="91440" numCol="1" rIns="91440" rtlCol="0" spcCol="0" tIns="45720" upright="0" vert="horz" vertOverflow="overflow" wrap="square"><a:noAutofit/></wps:bodyPr></wps:wsp>',
        
        // sign
        'SH_SignHere': '<wps:wsp><wps:cNvPr id="0" name=""/><wps:cNvSpPr/><wps:spPr bwMode="auto"><a:xfrm flipH="0" flipV="0" rot="5399875"><a:off x="0" y="0"/><a:ext cx="533814" cy="2202779"/></a:xfrm><a:prstGeom prst="flowChartOffpageConnector"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="FFDCDC"><a:alpha val="80000"/></a:srgbClr></a:solidFill><a:ln algn="ctr" cap="flat" cmpd="sng" w="38099"><a:solidFill><a:srgbClr val="F23D3D"/></a:solidFill><a:prstDash val="solid"/></a:ln></wps:spPr><wps:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></wps:style><wps:txbx><w:txbxContent><w:p><w:pPr><w:suppressLineNumbers w:val="false"/><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind w:right="144"/><w:contextualSpacing w:val="true"/><w:jc w:val="right"/><w:rPr><w:b/><w:bCs/><w:i/><w:color w:val="f23d3d"/><w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:i/><w:iCs/><w:color w:val="f23d3d"/><w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr><w:t xml:space="preserve">SIGN </w:t></w:r><w:r><w:rPr><w:b/><w:bCs/><w:i/><w:iCs/><w:color w:val="f23d3d"/><w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr><w:t xml:space="preserve">HERE</w:t></w:r><w:r><w:rPr><w:b/><w:bCs/><w:i/><w:color w:val="f23d3d"/><w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:bCs/><w:i/><w:color w:val="f23d3d"/><w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr></w:r></w:p><w:p><w:pPr><w:pBdr/><w:spacing/><w:ind/><w:jc w:val="center"/><w:rPr><w:bCs/><w:i/><w:color w:val="f23d3d"/></w:rPr></w:pPr><w:r><w:rPr><w:i/><w:iCs/><w:color w:val="f23d3d"/></w:rPr><w:t xml:space="preserve"/></w:r><w:r><w:rPr><w:bCs/><w:i/><w:color w:val="f23d3d"/></w:rPr></w:r><w:r><w:rPr><w:bCs/><w:i/><w:color w:val="f23d3d"/></w:rPr></w:r></w:p></w:txbxContent></wps:txbx><wps:bodyPr anchor="ctr" anchorCtr="0" bIns="45720" compatLnSpc="0" forceAA="0" fromWordArt="0" horzOverflow="overflow" lIns="91440" numCol="1" rIns="91440" rtlCol="0" spcCol="0" tIns="45720" upright="0" vert="vert270" vertOverflow="overflow" wrap="square"/></wps:wsp>',
        'SH_Witness': '<wps:wsp><wps:cNvPr id="0" name=""/><wps:cNvSpPr/><wps:spPr bwMode="auto"><a:xfrm flipH="0" flipV="0" rot="5399875"><a:off x="0" y="0"/><a:ext cx="533812" cy="2095497"/></a:xfrm><a:prstGeom prst="flowChartOffpageConnector"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="FFE6C8"><a:alpha val="80000"/></a:srgbClr></a:solidFill><a:ln algn="ctr" cap="flat" cmpd="sng" w="38099"><a:solidFill><a:srgbClr val="FF8E00"/></a:solidFill><a:prstDash val="solid"/></a:ln></wps:spPr><wps:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></wps:style><wps:txbx><w:txbxContent><w:p><w:pPr><w:suppressLineNumbers w:val="false"/><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind w:right="144"/><w:contextualSpacing w:val="true"/><w:jc w:val="right"/><w:rPr><w:b/><w:bCs/><w:color w:val="ff8e00"/><w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:i/><w:iCs/><w:color w:val="ff8e00"/><w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr><w:t xml:space="preserve">WITNESS</w:t></w:r><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="ff8e00"/><w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="ff8e00"/><w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr></w:r></w:p><w:p><w:pPr><w:pBdr/><w:spacing/><w:ind/><w:jc w:val="center"/><w:rPr/></w:pPr><w:r/><w:r/></w:p></w:txbxContent></wps:txbx><wps:bodyPr anchor="ctr" anchorCtr="0" bIns="45720" compatLnSpc="0" forceAA="0" fromWordArt="0" horzOverflow="overflow" lIns="91440" numCol="1" rIns="91440" rtlCol="0" spcCol="0" tIns="45720" upright="0" vert="vert270" vertOverflow="overflow" wrap="square"/></wps:wsp>',
        'SH_InitialHere': '<wps:wsp><wps:cNvPr id="0" name=""/><wps:cNvSpPr/><wps:spPr bwMode="auto"><a:xfrm flipH="0" flipV="0" rot="5399875"><a:off x="0" y="0"/><a:ext cx="533814" cy="2012026"/></a:xfrm><a:prstGeom prst="flowChartOffpageConnector"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="DCE6FF"><a:alpha val="70000"/></a:srgbClr></a:solidFill><a:ln algn="ctr" cap="flat" cmpd="sng" w="38099"><a:solidFill><a:srgbClr val="4E80F5"/></a:solidFill><a:prstDash val="solid"/></a:ln></wps:spPr><wps:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></wps:style><wps:txbx><w:txbxContent><w:p><w:pPr><w:suppressLineNumbers w:val="false"/><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind w:right="0"/><w:contextualSpacing w:val="true"/><w:jc w:val="left"/><w:rPr><w:b/><w:bCs/><w:color w:val="4e80f5"/><w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:i/><w:iCs/><w:color w:val="4e80f5"/><w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:bCs/><w:i/><w:iCs/><w:color w:val="4e80f5"/><w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr><w:t xml:space="preserve"/></w:r><w:r><w:rPr><w:b/><w:bCs/><w:i/><w:iCs/><w:color w:val="4e80f5"/><w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr><w:t xml:space="preserve"/></w:r><w:r><w:rPr><w:b/><w:bCs/><w:i/><w:iCs/><w:color w:val="4e80f5"/><w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr><w:t xml:space="preserve">INITIAL</w:t></w:r><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="4e80f5"/><w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="4e80f5"/><w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr></w:r></w:p></w:txbxContent></wps:txbx><wps:bodyPr anchor="ctr" anchorCtr="0" bIns="45720" compatLnSpc="0" forceAA="0" fromWordArt="0" horzOverflow="overflow" lIns="91440" numCol="1" rIns="91440" rtlCol="0" spcCol="0" tIns="45720" upright="0" vert="vert270" vertOverflow="overflow" wrap="square"/></wps:wsp>',
        
        // foxit
        'Expired': '<wps:wsp><wps:cNvPr id="0" name=""/><wps:cNvSpPr/><wps:spPr bwMode="auto"><a:xfrm flipH="0" flipV="0" rot="0"><a:off x="0" y="0"/><a:ext cx="1857375" cy="525523"/></a:xfrm><a:prstGeom prst="flowChartProcess"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="FFDCFF"><a:alpha val="80000"/></a:srgbClr></a:solidFill><a:ln algn="ctr" cap="flat" cmpd="sng" w="38099"><a:solidFill><a:srgbClr val="800085"/></a:solidFill><a:prstDash val="solid"/></a:ln></wps:spPr><wps:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></wps:style><wps:txbx><w:txbxContent><w:p><w:pPr><w:pBdr/><w:spacing w:after="0" w:afterAutospacing="1" w:beforeAutospacing="1" w:line="240" w:lineRule="auto"/><w:ind/><w:contextualSpacing w:val="true"/><w:jc w:val="center"/><w:rPr><w:b/><w:color w:val="800085"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="800085"/><w:sz w:val="52"/><w:szCs w:val="52"/></w:rPr><w:t xml:space="preserve">EXPIRED</w:t></w:r><w:r><w:rPr><w:b/><w:color w:val="800085"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r><w:r><w:rPr><w:b/><w:color w:val="800085"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:r></w:p></w:txbxContent></wps:txbx><wps:bodyPr anchor="b" anchorCtr="0" bIns="45720" compatLnSpc="0" forceAA="0" fromWordArt="0" horzOverflow="overflow" lIns="91440" numCol="1" rIns="91440" rtlCol="0" spcCol="0" tIns="45720" upright="0" vert="horz" vertOverflow="overflow" wrap="square"><a:noAutofit/></wps:bodyPr></wps:wsp>',
    }

    let STAMP_TYPES = {
        // dinamic
        'D_Approved':               'D_Approved',
        'D_Revised':                'D_Revised',
        'D_Reviewed':               'D_Reviewed',
        'D_Received':               'D_Received',
        
        // standard
        'SB_Approved':              'SB_Approved',
        'SB_NotApproved':           'SB_NotApproved',
        'SB_Revised':               'SB_Revised',
        'SB_Confidential':          'SB_Confidential',
        'SB_ForComment':            'SB_ForComment',
        'SB_ForPublicRelease':      'SB_ForPublicRelease',
        'SB_NotForPublicRelease':   'SB_NotForPublicRelease',
        'SB_PreliminaryResults':    'SB_PreliminaryResults',
        'SB_InformationOnly':       'SB_InformationOnly',
        'SB_Draft':                 'SB_Draft',
        'SB_Completed':             'SB_Completed',
        'SB_Final':                 'SB_Final',
        'SB_Void':                  'SB_Void',
        
        // sign
        'SH_SignHere':              'SH_SignHere',
        'SH_Witness':               'SH_Witness',
        'SH_InitialHere':           'SH_InitialHere',
        
        // foxit
        'Expired':                  'Expired',

        // onlyoffice
        'Image':                    'Image'
    }

    /**
	 * Class representing a stamp annotation.
	 * @constructor
    */
    function CAnnotationStamp(sName, nPage, aRect, oDoc)
    {
        AscPDF.CPdfShape.call(this);
        AscPDF.CAnnotationBase.call(this, sName, AscPDF.ANNOTATIONS_TYPES.Stamp, nPage, aRect, oDoc);
        
        this._rotate = 0;
        this._stampType = undefined;

        this.Init();
    }
    
	CAnnotationStamp.prototype.constructor = CAnnotationStamp;
    AscFormat.InitClass(CAnnotationStamp, AscPDF.CPdfShape, AscDFH.historyitem_type_Pdf_Annot_Stamp);
    Object.assign(CAnnotationStamp.prototype, AscPDF.CAnnotationBase.prototype);

    CAnnotationStamp.prototype.IsStamp = function() {
        return true;
    };
    CAnnotationStamp.prototype.Draw = function(oGraphicsPDF, oGraphicsWord) {
        let sType = this.GetIconType();
        if (sType == undefined) {
            return;
        }

        this.Recalculate();
        if (AscPDF.STAMP_TYPES.Image == sType) {
            this.draw(oGraphicsWord);
        }
        else {
            let oStructure = this.GetRenderStructure();
            let nScale = this.GetOriginViewScale();
            let oTr = new AscCommon.CMatrix();
            oTr.Scale(nScale, nScale);

            let oOwnTr = this.getTransformMatrix();
            AscCommon.global_MatrixTransformer.MultiplyAppend(oTr, oOwnTr);

            oStructure.draw(oGraphicsWord, oTr);
        }
    };
    CAnnotationStamp.prototype.SetRenderStructure = function(oStructure) {
        this.renderStructure = oStructure;
    };
    CAnnotationStamp.prototype.GetRenderStructure = function() {
        if (this.renderStructure) {
            return this.renderStructure;
        }
        else {
            let oDoc = this.GetDocument();
            let oTextDrawer = oDoc.CreateStampRender(this.GetIconType());
            this.SetRenderStructure(oTextDrawer.m_aStack[0]);
            return this.renderStructure;
        }
    };
    CAnnotationStamp.prototype.SetInRect = function(aInRect) {
        AscCommon.History.Add(new CChangesPDFAnnotStampInRect(this, this.inRect, aInRect));

        this.inRect = aInRect;
        
        function getDistance(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        }

        let nShapeW = getDistance(aInRect[0], aInRect[1], aInRect[6], aInRect[7]);
        let nShapeH = getDistance(aInRect[0], aInRect[1], aInRect[2], aInRect[3]);

        this.spPr.xfrm.setExtX(nShapeW * g_dKoef_pt_to_mm);
        this.spPr.xfrm.setExtY(nShapeH * g_dKoef_pt_to_mm);

        let aRect = this.GetRect();
        
        let nAnnotW = aRect[2] - aRect[0];
        let nAnnotH = aRect[3] - aRect[1];
        
        let nOffX = (aRect[0] - (nShapeW - nAnnotW) / 2);
        let nOffY = (aRect[1] - (nShapeH - nAnnotH) / 2);
        
        this.spPr.xfrm.setOffX(nOffX * g_dKoef_pt_to_mm);
        this.spPr.xfrm.setOffY(nOffY * g_dKoef_pt_to_mm);
    };
    CAnnotationStamp.prototype.GetInRect = function() {
        return this.inRect;
    };
    CAnnotationStamp.prototype.GetDrawing = function() {
        return this.content.GetAllDrawingObjects()[0];
    };
    CAnnotationStamp.prototype.SetWasChanged = function(isChanged) {
        let oViewer = Asc.editor.getDocumentRenderer();

        if (this._wasChanged !== isChanged && oViewer.IsOpenAnnotsInProgress == false) {
            this._wasChanged = isChanged;
        }
    };
    CAnnotationStamp.prototype.GetOriginViewScale = function() {
        let aInRect = this.GetInRect();
        if (!aInRect) {
            return 1;
        }

        function getDistance(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        }

        let nSourceH = getDistance(aInRect[0], aInRect[1], aInRect[2], aInRect[3]) * g_dKoef_pt_to_mm;
        let nCurrentH = this.getXfrmExtY();

        return nCurrentH / nSourceH;
    };
    CAnnotationStamp.prototype.DrawFromStream = function(oGraphicsPDF) {
        if (this.IsHidden() == true)
            return;
            
        let nScale      = this.GetOriginViewScale();
        let originView  = this.GetOriginView(oGraphicsPDF.GetDrawingPageW() * nScale, oGraphicsPDF.GetDrawingPageH() * nScale);
        let nRot        = this.GetRot();

        if (originView) {
            let oXfrm = this.getXfrm();
            
            let X = oXfrm.offX / g_dKoef_pt_to_mm;
            let Y = oXfrm.offY / g_dKoef_pt_to_mm;

            if (this.IsHighlight())
                AscPDF.startMultiplyMode(oGraphicsPDF.GetContext());
            
            oGraphicsPDF.DrawImageXY(originView, X, Y, nRot, true);
            AscPDF.endMultiplyMode(oGraphicsPDF.GetContext());
        }
    };
    CAnnotationStamp.prototype.GetOriginViewInfo = function(nPageW, nPageH) {
        let oViewer     = editor.getDocumentRenderer();
        let oFile       = oViewer.file;
        let nPage       = this.GetOriginPage();

        if (this.APInfo == null || this.APInfo.size.w != nPageW || this.APInfo.size.h != nPageH) {
            this.APInfo = {
                info: oFile.nativeFile["getAnnotationsAP"](nPage, nPageW, nPageH, undefined, this.GetApIdx()),
                size: {
                    w: nPageW,
                    h: nPageH
                }
            }
        }
        
        for (let i = 0; i < this.APInfo.info.length; i++) {
            if (this.APInfo.info[i]["i"] == this._apIdx)
                return this.APInfo.info[i];
        }

        return null;
    };
    CAnnotationStamp.prototype.SetPosition = function(x, y) {
        let oDoc        = this.GetDocument();
        let aCurRect    = this.GetOrigRect();

        let nOldX = aCurRect[0];
        let nOldY = aCurRect[1];

        let nDeltaX = x - nOldX;
        let nDeltaY = y - nOldY;

        if (0 == nDeltaX && 0 == nDeltaY) {
            return;
        }

        oDoc.History.Add(new CChangesPDFAnnotPos(this, [aCurRect[0], aCurRect[1]], [x, y]));

        let nWidth  = aCurRect[2] - aCurRect[0];
        let nHeight = aCurRect[3] - aCurRect[1];

        this._origRect[0] = x;
        this._origRect[1] = y;
        this._origRect[2] = x + nWidth;
        this._origRect[3] = y + nHeight;
        
        let oXfrm = this.getXfrm();
        let nOffX = x - (this.getXfrmExtX() / g_dKoef_pt_to_mm - nWidth) / 2;
        let nOffY = y - (this.getXfrmExtY() / g_dKoef_pt_to_mm - nHeight) / 2;

        AscCommon.History.StartNoHistoryMode();
        oXfrm.setOffX(nOffX * g_dKoef_pt_to_mm);
        oXfrm.setOffY(nOffY * g_dKoef_pt_to_mm);
        AscCommon.History.EndNoHistoryMode();

        this.SetNeedRecalc(true);
        this.SetWasChanged(true);
    };
    CAnnotationStamp.prototype.SetRect = function(aRect) {
        let oViewer     = editor.getDocumentRenderer();
        let oDoc        = oViewer.getPDFDoc();
        let aCurRect    = this.GetRect();

        let bCalcRect = aCurRect && aCurRect.length != 0 && false == AscCommon.History.UndoRedoInProgress;

        oDoc.History.Add(new CChangesPDFAnnotRect(this, aCurRect, aRect));
        this._origRect = aRect;

        if (bCalcRect) {
            let nX1 = aRect[0] * g_dKoef_pt_to_mm;
            let nX2 = aRect[2] * g_dKoef_pt_to_mm;
            let nY1 = aRect[1] * g_dKoef_pt_to_mm;
            let nY2 = aRect[3] * g_dKoef_pt_to_mm;

            this.spPr.xfrm.setExtX(nX2 - nX1);
            this.spPr.xfrm.setExtY(nY2 - nY1);
            this.spPr.xfrm.setOffX(nX1);
            this.spPr.xfrm.setOffY(nY1);

            this.recalcBounds();
            this.recalcGeometry();
            this.Recalculate(true);
            
            let oGrBounds = this.bounds;
            this._origRect[0] = Math.round(oGrBounds.l) * g_dKoef_mm_to_pt;
            this._origRect[1] = Math.round(oGrBounds.t) * g_dKoef_mm_to_pt;
            this._origRect[2] = Math.round(oGrBounds.r) * g_dKoef_mm_to_pt;
            this._origRect[3] = Math.round(oGrBounds.b) * g_dKoef_mm_to_pt;
        }

        this.SetWasChanged(true);
    };
    CAnnotationStamp.prototype.canRotate = function() {
        return true;
    };
    CAnnotationStamp.prototype.Recalculate = function(bForce) {
        if (true !== bForce && false == this.IsNeedRecalc()) {
            return;
        }

        this.recalculateTransform();
        this.updateTransformMatrix();
        this.recalculate();
        this.SetNeedRecalc(false);
    };
    CAnnotationStamp.prototype.RefillGeometry = function(oGeometry, aBounds) {
        oGeometry.Recalculate(aBounds[2] - aBounds[0], aBounds[3] - aBounds[1]);
        return oGeometry;
    };
    CAnnotationStamp.prototype.LazyCopy = function() {
        let oDoc = this.GetDocument();
        oDoc.StartNoHistoryMode();

        let oNewStamp = new CAnnotationStamp(AscCommon.CreateGUID(), this.GetPage(), this.GetOrigRect().slice(), oDoc);

        oNewStamp.inRect = this.inRect;
        oNewStamp.lazyCopy = true;

        this.fillObject(oNewStamp);

        let aStrokeColor    = this.GetStrokeColor();
        let aFillColor      = this.GetFillColor();

        oNewStamp._apIdx = this._apIdx;
        oNewStamp._originView = this._originView;
        oNewStamp.SetOriginPage(this.GetOriginPage());
        oNewStamp.SetAuthor(this.GetAuthor());
        oNewStamp.SetModDate(this.GetModDate());
        oNewStamp.SetCreationDate(this.GetCreationDate());
        aStrokeColor && oNewStamp.SetStrokeColor(aStrokeColor.slice());
        aFillColor && oNewStamp.SetFillColor(aFillColor.slice());
        oNewStamp.SetWidth(this.GetWidth());
        oNewStamp.SetOpacity(this.GetOpacity());
        oNewStamp.recalcGeometry()
        oNewStamp.Recalculate(true);
        oNewStamp.SetIconType(this.GetIconType());
        oNewStamp.SetRenderStructure(this.GetRenderStructure());

        oDoc.EndNoHistoryMode();
        return oNewStamp;
    };
    
    CAnnotationStamp.prototype.IsSelected = function() {
        let oViewer         = editor.getDocumentRenderer();
        let oDrawingObjects = oViewer.DrawingObjects;
        return oDrawingObjects.selectedObjects.includes(this);
    };
    
    CAnnotationStamp.prototype.SetIconType = function(sType) {
        if (sType == this._stampType) {
            return;
        }

        AscCommon.History.Add(new CChangesPDFAnnotStampType(this, this._stampType, sType));
        this._stampType = sType;
        this.SetWasChanged(true);
    };
    CAnnotationStamp.prototype.GetIconType = function() {
        return this._stampType;
    };
    CAnnotationStamp.prototype.SetRotate = function(nAngle) {
        let oViewer = Asc.editor.getDocumentRenderer();
        if (this._rotate == nAngle) {
            return;
        }
        
        AscCommon.History.Add(new CChangesPDFAnnotRotate(this, this._rotate, nAngle));

		let oXfrm = this.getXfrm();
        oXfrm.rot = -nAngle * (Math.PI / 180);
		
        this._rotate = nAngle;

        if (oViewer.IsOpenAnnotsInProgress == false) {
            this.recalcBounds();
            this.recalcGeometry();
            this.Recalculate(true);
            
            let oGrBounds = this.bounds;
            this._origRect[0] = Math.round(oGrBounds.l) * g_dKoef_mm_to_pt;
            this._origRect[1] = Math.round(oGrBounds.t) * g_dKoef_mm_to_pt;
            this._origRect[2] = Math.round(oGrBounds.r) * g_dKoef_mm_to_pt;
            this._origRect[3] = Math.round(oGrBounds.b) * g_dKoef_mm_to_pt;
        }

        this.SetWasChanged(true);
        this.SetNeedRecalc(true);
    };
    CAnnotationStamp.prototype.GetRotate = function() {
        return this._rotate;
    };
    CAnnotationStamp.prototype.handleUpdateRot = function(){
        AscFormat.CShape.prototype.handleUpdateRot.call(this);
        let oXfrm = this.getXfrm();

        this.SetRotate(-oXfrm.rot * (180 / Math.PI));
    };
    CAnnotationStamp.prototype.WriteToBinary = function(memory) {
        memory.WriteByte(AscCommon.CommandType.ctAnnotField);

        let nStartPos = memory.GetCurPosition();
        memory.Skip(4);

        this.WriteToBinaryBase(memory);
        this.WriteToBinaryBase2(memory);
        
        memory.WriteString(this.GetIconType());
        memory.WriteLong(this.GetRotate());

        let nEndPos = memory.GetCurPosition();
        memory.Seek(memory.posForFlags);
        memory.WriteLong(memory.annotFlags);
        
        memory.Seek(nStartPos);
        memory.WriteLong(nEndPos - nStartPos);
        memory.Seek(nEndPos);
    };
    
    CAnnotationStamp.prototype.getNoChangeAspect = function() {
        return true;
    };
    CAnnotationStamp.prototype.Init = function() {
        AscCommon.History.StartNoHistoryMode();

        let aOrigRect = this.GetRect();
        let aAnnotRectMM = aOrigRect ? aOrigRect.map(function(measure) {
            return measure * g_dKoef_pt_to_mm;
        }) : [];

        let nOffX = aAnnotRectMM[0];
        let nOffY = aAnnotRectMM[1];
        let nExtX = aAnnotRectMM[2] - aAnnotRectMM[0];
        let nExtY = aAnnotRectMM[3] - aAnnotRectMM[1];

        this.setSpPr(new AscFormat.CSpPr());
        this.spPr.setLn(new AscFormat.CLn());
        this.spPr.ln.setFill(AscFormat.CreateNoFillUniFill());
        this.spPr.setFill(AscFormat.CreateSolidFillRGBA(255, 255, 255, 255));
        this.spPr.setParent(this);
        this.spPr.setXfrm(new AscFormat.CXfrm());
        this.spPr.xfrm.setParent(this.spPr);
        
        this.spPr.xfrm.setOffX(nOffX);
        this.spPr.xfrm.setOffY(nOffY);
        this.spPr.xfrm.setExtX(nExtX);
        this.spPr.xfrm.setExtY(nExtY);
        
        this.spPr.setGeometry(AscFormat.CreateGeometry("rect"));

        this.setStyle(AscFormat.CreateDefaultShapeStyle());
        this.setBDeleted(false);
        this.recalculate();
        
        AscCommon.History.EndNoHistoryMode();
    };
    
    window["AscPDF"].CAnnotationStamp = CAnnotationStamp;
    window["AscPDF"].STAMP_XML = STAMP_XML;
    window["AscPDF"].STAMP_TYPES = window["AscPDF"]["STAMP_TYPES"] = STAMP_TYPES;
})();

