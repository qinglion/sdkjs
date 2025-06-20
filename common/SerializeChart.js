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

(function(window, undefined){

// Import
var c_oSerConstants = AscCommon.c_oSerConstants;

var c_oAscTickMark = Asc.c_oAscTickMark;
var c_oAscTickLabelsPos = Asc.c_oAscTickLabelsPos;
var c_oAscChartDataLabelsPos = Asc.c_oAscChartDataLabelsPos;
var c_oAscValAxUnits = Asc.c_oAscValAxUnits;
var c_oAscChartLegendShowSettings = Asc.c_oAscChartLegendShowSettings;

//Generated code

var st_pagesetuporientationDEFAULT = 0;
var st_pagesetuporientationPORTRAIT = 1;
var st_pagesetuporientationLANDSCAPE = 2;

var st_dispblanksasSPAN = 0;
var st_dispblanksasGAP = 1;
var st_dispblanksasZERO = 2;

var st_legendposB = 0;
var st_legendposTR = 1;
var st_legendposL = 2;
var st_legendposR = 3;
var st_legendposT = 4;

var st_layouttargetINNER = 0;
var st_layouttargetOUTER = 1;

var st_layoutmodeEDGE = 0;
var st_layoutmodeFACTOR = 1;

var st_orientationMAXMIN = 0;
var st_orientationMINMAX = 1;

var st_axposB = 0;
var st_axposL = 1;
var st_axposR = 2;
var st_axposT = 3;

var st_tickmarkCROSS = 0;
var st_tickmarkIN = 1;
var st_tickmarkNONE = 2;
var st_tickmarkOUT = 3;

var st_ticklblposHIGH = 0;
var st_ticklblposLOW = 1;
var st_ticklblposNEXTTO = 2;
var st_ticklblposNONE = 3;

var st_crossesAUTOZERO = 0;
var st_crossesMAX = 1;
var st_crossesMIN = 2;

var st_timeunitDAYS = 0;
var st_timeunitMONTHS = 1;
var st_timeunitYEARS = 2;

var st_lblalgnCTR = 0;
var st_lblalgnL = 1;
var st_lblalgnR = 2;

var st_builtinunitHUNDREDS = 0;
var st_builtinunitTHOUSANDS = 1;
var st_builtinunitTENTHOUSANDS = 2;
var st_builtinunitHUNDREDTHOUSANDS = 3;
var st_builtinunitMILLIONS = 4;
var st_builtinunitTENMILLIONS = 5;
var st_builtinunitHUNDREDMILLIONS = 6;
var st_builtinunitBILLIONS = 7;
var st_builtinunitTRILLIONS = 8;

var st_crossbetweenBETWEEN = 0;
var st_crossbetweenMIDCAT = 1;

var st_sizerepresentsAREA = 0;
var st_sizerepresentsW = 1;

var st_markerstyleCIRCLE = 0;
var st_markerstyleDASH = 1;
var st_markerstyleDIAMOND = 2;
var st_markerstyleDOT = 3;
var st_markerstyleNONE = 4;
var st_markerstylePICTURE = 5;
var st_markerstylePLUS = 6;
var st_markerstyleSQUARE = 7;
var st_markerstyleSTAR = 8;
var st_markerstyleTRIANGLE = 9;
var st_markerstyleX = 10;
var st_markerstyleAUTO = 11;

var st_pictureformatSTRETCH = 0;
var st_pictureformatSTACK = 1;
var st_pictureformatSTACKSCALE = 2;

var st_dlblposBESTFIT = 0;
var st_dlblposB = 1;
var st_dlblposCTR = 2;
var st_dlblposINBASE = 3;
var st_dlblposINEND = 4;
var st_dlblposL = 5;
var st_dlblposOUTEND = 6;
var st_dlblposR = 7;
var st_dlblposT = 8;

var st_trendlinetypeEXP = 0;
var st_trendlinetypeLINEAR = 1;
var st_trendlinetypeLOG = 2;
var st_trendlinetypeMOVINGAVG = 3;
var st_trendlinetypePOLY = 4;
var st_trendlinetypePOWER = 5;

var st_errdirX = 0;
var st_errdirY = 1;

var st_errbartypeBOTH = 0;
var st_errbartypeMINUS = 1;
var st_errbartypePLUS = 2;

var st_errvaltypeCUST = 0;
var st_errvaltypeFIXEDVAL = 1;
var st_errvaltypePERCENTAGE = 2;
var st_errvaltypeSTDDEV = 3;
var st_errvaltypeSTDERR = 4;

var st_splittypeAUTO = 0;
var st_splittypeCUST = 1;
var st_splittypePERCENT = 2;
var st_splittypePOS = 3;
var st_splittypeVAL = 4;

var st_ofpietypePIE = 0;
var st_ofpietypeBAR = 1;

var st_bardirBAR = 0;
var st_bardirCOL = 1;

var st_bargroupingPERCENTSTACKED = 0;
var st_bargroupingCLUSTERED = 1;
var st_bargroupingSTANDARD = 2;
var st_bargroupingSTACKED = 3;

var st_shapeCONE = 0;
var st_shapeCONETOMAX = 1;
var st_shapeBOX = 2;
var st_shapeCYLINDER = 3;
var st_shapePYRAMID = 4;
var st_shapePYRAMIDTOMAX = 5;

var st_scatterstyleNONE = 0;
var st_scatterstyleLINE = 1;
var st_scatterstyleLINEMARKER = 2;
var st_scatterstyleMARKER = 3;
var st_scatterstyleSMOOTH = 4;
var st_scatterstyleSMOOTHMARKER = 5;

var st_radarstyleSTANDARD = 0;
var st_radarstyleMARKER = 1;
var st_radarstyleFILLED = 2;

var st_groupingPERCENTSTACKED = 0;
var st_groupingSTANDARD = 1;
var st_groupingSTACKED = 2;

// chart ex st

var st_parentlabellayoutNONE = 0;
var st_parentlabellayoutBANNER = 1;
var st_parentlabellayoutOVERLAPPING = 2;

var st_regionlabellayoutNONE = 0;
var st_regionlabellayoutBESTFITONLY = 1;
var st_regionlabellayoutSHOWALL = 2;

var st_serieslayoutBOXWHISKER = 0;
var st_serieslayoutCLUSTEREDCOLUMN = 1;
var st_serieslayoutFUNNEL = 2;
var st_serieslayoutPARETOLINE = 3;
var st_serieslayoutREGIONMAP = 4;
var st_serieslayoutSUNBURST = 5;
var st_serieslayoutTREEMAP = 6;
var st_serieslayoutWATERFALL = 7;

var st_datalabelposBESTFIT = 0;
var st_datalabelposB = 1;
var st_datalabelposCTR = 2;
var st_datalabelposINBASE = 3;
var st_datalabelposINEND = 4;
var st_datalabelposL = 5;
var st_datalabelposOUTEND = 6;
var st_datalabelposR = 7;
var st_datalabelposT = 8;

var st_intervalclosedsideL = 0;
var st_intervalclosedsideR = 1;

var st_axisunitHUNDREDS = 0;
var st_axisunitTHOUSANDS = 1;
var st_axisunitTENTHOUSANDS = 2;
var st_axisunitHUNDREDTHOUSANDS = 3;
var st_axisunitMILLIONS = 4;
var st_axisunitTENMILLIONS = 5;
var st_axisunitHUNDREDMILLIONS = 6;
var st_axisunitBILLIONS = 7;
var st_axisunitTRILLIONS = 8;
var st_axisunitPERCENTAGE = 9;

var st_posalignMIN = 0;
var st_posalignCTR = 1;
var st_posalignMAX = 2;

var st_tickmarkstypeIN = 0;
var st_tickmarkstypeOUT = 1;
var st_tickmarkstypeCROSS = 2;
var st_tickmarkstypeNONE = 3;

var st_quartilemethodINCLUSIVE = 0;
var st_quartilemethodEXCLUSIVE = 1;

var st_stringdimensiontypeCAT = 10;
var st_stringdimensiontypeCOLORSTR = 11;

var st_numericdimensiontypeVAL = 0;
var st_numericdimensiontypeX = 1;
var st_numericdimensiontypeY = 2;
var st_numericdimensiontypeSIZE = 3;
var st_numericdimensiontypeCOLORVAL = 4;

var st_formuladirectionCOL = 0;
var st_formuladirectionROW = 1;

var st_sideposL = 0;
var st_sideposT = 1;
var st_sideposR = 2;
var st_sideposB = 3;

var c_oserct_extlstEXT = 0;

var c_oserct_chartspaceDATE1904 = 0;
var c_oserct_chartspaceLANG = 1;
var c_oserct_chartspaceROUNDEDCORNERS = 2;
var c_oserct_chartspaceALTERNATECONTENT = 3;
var c_oserct_chartspaceSTYLE = 4;
var c_oserct_chartspaceCLRMAPOVR = 5;
var c_oserct_chartspacePIVOTSOURCE = 6;
var c_oserct_chartspacePROTECTION = 7;
var c_oserct_chartspaceCHART = 8;
var c_oserct_chartspaceSPPR = 9;
var c_oserct_chartspaceTXPR = 10;
var c_oserct_chartspaceEXTERNALDATA = 11;
var c_oserct_chartspacePRINTSETTINGS = 12;
var c_oserct_chartspaceUSERSHAPES = 13;
var c_oserct_chartspaceEXTLST = 14;
var c_oserct_chartspaceTHEMEOVERRIDE = 15;
var c_oserct_chartspaceXLSX = 16;
var c_oserct_chartspaceSTYLES = 17;
var c_oserct_chartspaceCOLORS = 18;
var c_oserct_chartspaceXLSXEXTERNAL = 19;
var c_oserct_chartspaceXLSXZIP = 20;

const sideLeft		=  0;
const sideRight		=  1;
const sideTop		=  2;
const sideBottom	=  3;

var c_oserct_usershapes_COUNT = 0;
var c_oserct_usershapes_SHAPE_REL = 1;
var c_oserct_usershapes_SHAPE_ABS = 2;

var c_oserct_booleanVAL = 0;

var c_oserct_relidID = 0;

var c_oserct_pagesetupPAPERSIZE = 0;
var c_oserct_pagesetupPAPERHEIGHT = 1;
var c_oserct_pagesetupPAPERWIDTH = 2;
var c_oserct_pagesetupFIRSTPAGENUMBER = 3;
var c_oserct_pagesetupORIENTATION = 4;
var c_oserct_pagesetupBLACKANDWHITE = 5;
var c_oserct_pagesetupDRAFT = 6;
var c_oserct_pagesetupUSEFIRSTPAGENUMBER = 7;
var c_oserct_pagesetupHORIZONTALDPI = 8;
var c_oserct_pagesetupVERTICALDPI = 9;
var c_oserct_pagesetupCOPIES = 10;

var c_oserct_pagemarginsL = 0;
var c_oserct_pagemarginsR = 1;
var c_oserct_pagemarginsT = 2;
var c_oserct_pagemarginsB = 3;
var c_oserct_pagemarginsHEADER = 4;
var c_oserct_pagemarginsFOOTER = 5;

var c_oserct_headerfooterODDHEADER = 0;
var c_oserct_headerfooterODDFOOTER = 1;
var c_oserct_headerfooterEVENHEADER = 2;
var c_oserct_headerfooterEVENFOOTER = 3;
var c_oserct_headerfooterFIRSTHEADER = 4;
var c_oserct_headerfooterFIRSTFOOTER = 5;
var c_oserct_headerfooterALIGNWITHMARGINS = 6;
var c_oserct_headerfooterDIFFERENTODDEVEN = 7;
var c_oserct_headerfooterDIFFERENTFIRST = 8;

var c_oserct_printsettingsHEADERFOOTER = 0;
var c_oserct_printsettingsPAGEMARGINS = 1;
var c_oserct_printsettingsPAGESETUP = 2;

var c_oserct_externaldataAUTOUPDATE = 0;
var c_oserct_externaldataID = 1;

var c_oserct_dispblanksasVAL = 0;

var c_oserct_legendentryIDX = 0;
var c_oserct_legendentryDELETE = 1;
var c_oserct_legendentryTXPR = 2;
var c_oserct_legendentryEXTLST = 3;

var c_oserct_unsignedintVAL = 0;

var c_oserct_extensionANY = 0;
var c_oserct_extensionURI = 1;

var c_oserct_legendposVAL = 0;

var c_oserct_legendLEGENDPOS = 0;
var c_oserct_legendLEGENDENTRY = 1;
var c_oserct_legendLAYOUT = 2;
var c_oserct_legendOVERLAY = 3;
var c_oserct_legendSPPR = 4;
var c_oserct_legendTXPR = 5;
var c_oserct_legendEXTLST = 6;
var c_oserct_legendALIGN = 7;

var c_oserct_layoutMANUALLAYOUT = 0;
var c_oserct_layoutEXTLST = 1;

var c_oserct_manuallayoutLAYOUTTARGET = 0;
var c_oserct_manuallayoutXMODE = 1;
var c_oserct_manuallayoutYMODE = 2;
var c_oserct_manuallayoutWMODE = 3;
var c_oserct_manuallayoutHMODE = 4;
var c_oserct_manuallayoutX = 5;
var c_oserct_manuallayoutY = 6;
var c_oserct_manuallayoutW = 7;
var c_oserct_manuallayoutH = 8;
var c_oserct_manuallayoutEXTLST = 9;

var c_oserct_layouttargetVAL = 0;

var c_oserct_layoutmodeVAL = 0;

var c_oserct_doubleVAL = 0;

var c_oserct_dtableSHOWHORZBORDER = 0;
var c_oserct_dtableSHOWVERTBORDER = 1;
var c_oserct_dtableSHOWOUTLINE = 2;
var c_oserct_dtableSHOWKEYS = 3;
var c_oserct_dtableSPPR = 4;
var c_oserct_dtableTXPR = 5;
var c_oserct_dtableEXTLST = 6;

var c_oserct_seraxAXID = 0;
var c_oserct_seraxSCALING = 1;
var c_oserct_seraxDELETE = 2;
var c_oserct_seraxAXPOS = 3;
var c_oserct_seraxMAJORGRIDLINES = 4;
var c_oserct_seraxMINORGRIDLINES = 5;
var c_oserct_seraxTITLE = 6;
var c_oserct_seraxNUMFMT = 7;
var c_oserct_seraxMAJORTICKMARK = 8;
var c_oserct_seraxMINORTICKMARK = 9;
var c_oserct_seraxTICKLBLPOS = 10;
var c_oserct_seraxSPPR = 11;
var c_oserct_seraxTXPR = 12;
var c_oserct_seraxCROSSAX = 13;
var c_oserct_seraxCROSSES = 14;
var c_oserct_seraxCROSSESAT = 15;
var c_oserct_seraxTICKLBLSKIP = 16;
var c_oserct_seraxTICKMARKSKIP = 17;
var c_oserct_seraxEXTLST = 18;

var c_oserct_scalingLOGBASE = 0;
var c_oserct_scalingORIENTATION = 1;
var c_oserct_scalingMAX = 2;
var c_oserct_scalingMIN = 3;
var c_oserct_scalingEXTLST = 4;

var c_oserct_logbaseVAL = 0;

var c_oserct_orientationVAL = 0;

var c_oserct_axposVAL = 0;

var c_oserct_chartlinesSPPR = 0;

var c_oserct_titleTX = 0;
var c_oserct_titleLAYOUT = 1;
var c_oserct_titleOVERLAY = 2;
var c_oserct_titleSPPR = 3;
var c_oserct_titleTXPR = 4;
var c_oserct_titleEXTLST = 5;
var c_oserct_titleALIGN = 6;

var c_oserct_txRICH = 0;
var c_oserct_txSTRREF = 1;

var c_oserct_strrefF = 0;
var c_oserct_strrefSTRCACHE = 1;
var c_oserct_strrefEXTLST = 2;

var c_oserct_strdataPTCOUNT = 0;
var c_oserct_strdataPT = 1;
var c_oserct_strdataEXTLST = 2;

var c_oserct_strvalV = 0;
var c_oserct_strvalIDX = 1;

var c_oserct_numfmtFORMATCODE = 0;
var c_oserct_numfmtSOURCELINKED = 1;

var c_oserct_tickmarkVAL = 0;

var c_oserct_ticklblposVAL = 0;

var c_oserct_crossesVAL = 0;

var c_oserct_skipVAL = 0;

var c_oserct_timeunitVAL = 0;

var c_oserct_dateaxAXID = 0;
var c_oserct_dateaxSCALING = 1;
var c_oserct_dateaxDELETE = 2;
var c_oserct_dateaxAXPOS = 3;
var c_oserct_dateaxMAJORGRIDLINES = 4;
var c_oserct_dateaxMINORGRIDLINES = 5;
var c_oserct_dateaxTITLE = 6;
var c_oserct_dateaxNUMFMT = 7;
var c_oserct_dateaxMAJORTICKMARK = 8;
var c_oserct_dateaxMINORTICKMARK = 9;
var c_oserct_dateaxTICKLBLPOS = 10;
var c_oserct_dateaxSPPR = 11;
var c_oserct_dateaxTXPR = 12;
var c_oserct_dateaxCROSSAX = 13;
var c_oserct_dateaxCROSSES = 14;
var c_oserct_dateaxCROSSESAT = 15;
var c_oserct_dateaxAUTO = 16;
var c_oserct_dateaxLBLOFFSET = 17;
var c_oserct_dateaxBASETIMEUNIT = 18;
var c_oserct_dateaxMAJORUNIT = 19;
var c_oserct_dateaxMAJORTIMEUNIT = 20;
var c_oserct_dateaxMINORUNIT = 21;
var c_oserct_dateaxMINORTIMEUNIT = 22;
var c_oserct_dateaxEXTLST = 23;

var c_oserct_lbloffsetVAL = 0;

var c_oserct_axisunitVAL = 0;

var c_oserct_lblalgnVAL = 0;

var c_oserct_cataxAXID = 0;
var c_oserct_cataxSCALING = 1;
var c_oserct_cataxDELETE = 2;
var c_oserct_cataxAXPOS = 3;
var c_oserct_cataxMAJORGRIDLINES = 4;
var c_oserct_cataxMINORGRIDLINES = 5;
var c_oserct_cataxTITLE = 6;
var c_oserct_cataxNUMFMT = 7;
var c_oserct_cataxMAJORTICKMARK = 8;
var c_oserct_cataxMINORTICKMARK = 9;
var c_oserct_cataxTICKLBLPOS = 10;
var c_oserct_cataxSPPR = 11;
var c_oserct_cataxTXPR = 12;
var c_oserct_cataxCROSSAX = 13;
var c_oserct_cataxCROSSES = 14;
var c_oserct_cataxCROSSESAT = 15;
var c_oserct_cataxAUTO = 16;
var c_oserct_cataxLBLALGN = 17;
var c_oserct_cataxLBLOFFSET = 18;
var c_oserct_cataxTICKLBLSKIP = 19;
var c_oserct_cataxTICKMARKSKIP = 20;
var c_oserct_cataxNOMULTILVLLBL = 21;
var c_oserct_cataxEXTLST = 22;

var c_oserct_dispunitslblLAYOUT = 0;
var c_oserct_dispunitslblTX = 1;
var c_oserct_dispunitslblSPPR = 2;
var c_oserct_dispunitslblTXPR = 3;

var c_oserct_builtinunitVAL = 0;

var c_oserct_dispunitsBUILTINUNIT = 0;
var c_oserct_dispunitsCUSTUNIT = 1;
var c_oserct_dispunitsDISPUNITSLBL = 2;
var c_oserct_dispunitsEXTLST = 3;

var c_oserct_crossbetweenVAL = 0;

var c_oserct_valaxAXID = 0;
var c_oserct_valaxSCALING = 1;
var c_oserct_valaxDELETE = 2;
var c_oserct_valaxAXPOS = 3;
var c_oserct_valaxMAJORGRIDLINES = 4;
var c_oserct_valaxMINORGRIDLINES = 5;
var c_oserct_valaxTITLE = 6;
var c_oserct_valaxNUMFMT = 7;
var c_oserct_valaxMAJORTICKMARK = 8;
var c_oserct_valaxMINORTICKMARK = 9;
var c_oserct_valaxTICKLBLPOS = 10;
var c_oserct_valaxSPPR = 11;
var c_oserct_valaxTXPR = 12;
var c_oserct_valaxCROSSAX = 13;
var c_oserct_valaxCROSSES = 14;
var c_oserct_valaxCROSSESAT = 15;
var c_oserct_valaxCROSSBETWEEN = 16;
var c_oserct_valaxMAJORUNIT = 17;
var c_oserct_valaxMINORUNIT = 18;
var c_oserct_valaxDISPUNITS = 19;
var c_oserct_valaxEXTLST = 20;

var c_oserct_sizerepresentsVAL = 0;

var c_oserct_bubblescaleVAL = 0;

var c_oserct_bubbleserIDX = 0;
var c_oserct_bubbleserORDER = 1;
var c_oserct_bubbleserTX = 2;
var c_oserct_bubbleserSPPR = 3;
var c_oserct_bubbleserINVERTIFNEGATIVE = 4;
var c_oserct_bubbleserDPT = 5;
var c_oserct_bubbleserDLBLS = 6;
var c_oserct_bubbleserTRENDLINE = 7;
var c_oserct_bubbleserERRBARS = 8;
var c_oserct_bubbleserXVAL = 9;
var c_oserct_bubbleserYVAL = 10;
var c_oserct_bubbleserBUBBLESIZE = 11;
var c_oserct_bubbleserBUBBLE3D = 12;
var c_oserct_bubbleserEXTLST = 13;

var c_oserct_sertxSTRREF = 0;
var c_oserct_sertxV = 1;

var c_oserct_dptIDX = 0;
var c_oserct_dptINVERTIFNEGATIVE = 1;
var c_oserct_dptMARKER = 2;
var c_oserct_dptBUBBLE3D = 3;
var c_oserct_dptEXPLOSION = 4;
var c_oserct_dptSPPR = 5;
var c_oserct_dptPICTUREOPTIONS = 6;
var c_oserct_dptEXTLST = 7;

var c_oserct_markerSYMBOL = 0;
var c_oserct_markerSIZE = 1;
var c_oserct_markerSPPR = 2;
var c_oserct_markerEXTLST = 3;

var c_oserct_markerstyleVAL = 0;

var c_oserct_markersizeVAL = 0;

var c_oserct_pictureoptionsAPPLYTOFRONT = 0;
var c_oserct_pictureoptionsAPPLYTOSIDES = 1;
var c_oserct_pictureoptionsAPPLYTOEND = 2;
var c_oserct_pictureoptionsPICTUREFORMAT = 3;
var c_oserct_pictureoptionsPICTURESTACKUNIT = 4;

var c_oserct_pictureformatVAL = 0;

var c_oserct_picturestackunitVAL = 0;

var c_oserct_dlblsDLBL = 0;
var c_oserct_dlblsITEMS = 1;
var c_oserct_dlblsDLBLPOS = 2;
var c_oserct_dlblsDELETE = 3;
var c_oserct_dlblsLEADERLINES = 4;
var c_oserct_dlblsNUMFMT = 5;
var c_oserct_dlblsSEPARATOR = 6;
var c_oserct_dlblsSHOWBUBBLESIZE = 7;
var c_oserct_dlblsSHOWCATNAME = 8;
var c_oserct_dlblsSHOWLEADERLINES = 9;
var c_oserct_dlblsSHOWLEGENDKEY = 10;
var c_oserct_dlblsSHOWPERCENT = 11;
var c_oserct_dlblsSHOWSERNAME = 12;
var c_oserct_dlblsSHOWVAL = 13;
var c_oserct_dlblsSPPR = 14;
var c_oserct_dlblsTXPR = 15;
var c_oserct_dlblsEXTLST = 16;

var c_oserct_xForSave = 25;
var c_oserct_showDataLabelsRange = 26;
var c_oserct_showLeaderLines = 27;
var c_oserct_leaderLines = 28;
var c_oserct_dlblFieldTable = 29;

var c_oserct_dlblIDX = 0;
var c_oserct_dlblITEMS = 1;
var c_oserct_dlblDLBLPOS = 2;
var c_oserct_dlblDELETE = 3;
var c_oserct_dlblLAYOUT = 4;
var c_oserct_dlblNUMFMT = 5;
var c_oserct_dlblSEPARATOR = 6;
var c_oserct_dlblSHOWBUBBLESIZE = 7;
var c_oserct_dlblSHOWCATNAME = 8;
var c_oserct_dlblSHOWLEGENDKEY = 9;
var c_oserct_dlblSHOWPERCENT = 10;
var c_oserct_dlblSHOWSERNAME = 11;
var c_oserct_dlblSHOWVAL = 12;
var c_oserct_dlblSPPR = 13;
var c_oserct_dlblTX = 14;
var c_oserct_dlblTXPR = 15;
var c_oserct_dlblEXTLST = 16;

var c_oserct_dlblposVAL = 0;

var c_oserct_trendlineNAME = 0;
var c_oserct_trendlineSPPR = 1;
var c_oserct_trendlineTRENDLINETYPE = 2;
var c_oserct_trendlineORDER = 3;
var c_oserct_trendlinePERIOD = 4;
var c_oserct_trendlineFORWARD = 5;
var c_oserct_trendlineBACKWARD = 6;
var c_oserct_trendlineINTERCEPT = 7;
var c_oserct_trendlineDISPRSQR = 8;
var c_oserct_trendlineDISPEQ = 9;
var c_oserct_trendlineTRENDLINELBL = 10;
var c_oserct_trendlineEXTLST = 11;

var c_oserct_trendlinetypeVAL = 0;

var c_oserct_orderVAL = 0;

var c_oserct_periodVAL = 0;

var c_oserct_trendlinelblLAYOUT = 0;
var c_oserct_trendlinelblTX = 1;
var c_oserct_trendlinelblNUMFMT = 2;
var c_oserct_trendlinelblSPPR = 3;
var c_oserct_trendlinelblTXPR = 4;
var c_oserct_trendlinelblEXTLST = 5;

var c_oserct_errbarsERRDIR = 0;
var c_oserct_errbarsERRBARTYPE = 1;
var c_oserct_errbarsERRVALTYPE = 2;
var c_oserct_errbarsNOENDCAP = 3;
var c_oserct_errbarsPLUS = 4;
var c_oserct_errbarsMINUS = 5;
var c_oserct_errbarsVAL = 6;
var c_oserct_errbarsSPPR = 7;
var c_oserct_errbarsEXTLST = 8;

var c_oserct_errdirVAL = 0;

var c_oserct_errbartypeVAL = 0;

var c_oserct_errvaltypeVAL = 0;

var c_oserct_numdatasourceNUMLIT = 0;
var c_oserct_numdatasourceNUMREF = 1;

var c_oserct_numdataFORMATCODE = 0;
var c_oserct_numdataPTCOUNT = 1;
var c_oserct_numdataPT = 2;
var c_oserct_numdataEXTLST = 3;

var c_oserct_numvalV = 0;
var c_oserct_numvalIDX = 1;
var c_oserct_numvalFORMATCODE = 2;

var c_oserct_numrefF = 0;
var c_oserct_numrefNUMCACHE = 1;
var c_oserct_numrefEXTLST = 2;

var c_oserct_axdatasourceMULTILVLSTRREF = 0;
var c_oserct_axdatasourceNUMLIT = 1;
var c_oserct_axdatasourceNUMREF = 2;
var c_oserct_axdatasourceSTRLIT = 3;
var c_oserct_axdatasourceSTRREF = 4;

var c_oserct_multilvlstrrefF = 0;
var c_oserct_multilvlstrrefMULTILVLSTRCACHE = 1;
var c_oserct_multilvlstrrefEXTLST = 2;

var c_oserct_lvlPT = 0;

var c_oserct_multilvlstrdataPTCOUNT = 0;
var c_oserct_multilvlstrdataLVL = 1;
var c_oserct_multilvlstrdataEXTLST = 2;

var c_oserct_bubblechartVARYCOLORS = 0;
var c_oserct_bubblechartSER = 1;
var c_oserct_bubblechartDLBLS = 2;
var c_oserct_bubblechartBUBBLE3D = 3;
var c_oserct_bubblechartBUBBLESCALE = 4;
var c_oserct_bubblechartSHOWNEGBUBBLES = 5;
var c_oserct_bubblechartSIZEREPRESENTS = 6;
var c_oserct_bubblechartAXID = 7;
var c_oserct_bubblechartEXTLST = 8;

var c_oserct_bandfmtsBANDFMT = 0;

var c_oserct_surface3dchartWIREFRAME = 0;
var c_oserct_surface3dchartSER = 1;
var c_oserct_surface3dchartBANDFMTS = 2;
var c_oserct_surface3dchartAXID = 3;
var c_oserct_surface3dchartEXTLST = 4;

var c_oserct_surfaceserIDX = 0;
var c_oserct_surfaceserORDER = 1;
var c_oserct_surfaceserTX = 2;
var c_oserct_surfaceserSPPR = 3;
var c_oserct_surfaceserCAT = 4;
var c_oserct_surfaceserVAL = 5;
var c_oserct_surfaceserEXTLST = 6;

var c_oserct_bandfmtIDX = 0;
var c_oserct_bandfmtSPPR = 1;

var c_oserct_surfacechartWIREFRAME = 0;
var c_oserct_surfacechartSER = 1;
var c_oserct_surfacechartBANDFMTS = 2;
var c_oserct_surfacechartAXID = 3;
var c_oserct_surfacechartEXTLST = 4;

var c_oserct_secondpiesizeVAL = 0;

var c_oserct_splittypeVAL = 0;

var c_oserct_ofpietypeVAL = 0;

var c_oserct_custsplitSECONDPIEPT = 0;

var c_oserct_ofpiechartOFPIETYPE = 0;
var c_oserct_ofpiechartVARYCOLORS = 1;
var c_oserct_ofpiechartSER = 2;
var c_oserct_ofpiechartDLBLS = 3;
var c_oserct_ofpiechartGAPWIDTH = 4;
var c_oserct_ofpiechartSPLITTYPE = 5;
var c_oserct_ofpiechartSPLITPOS = 6;
var c_oserct_ofpiechartCUSTSPLIT = 7;
var c_oserct_ofpiechartSECONDPIESIZE = 8;
var c_oserct_ofpiechartSERLINES = 9;
var c_oserct_ofpiechartEXTLST = 10;

var c_oserct_pieserIDX = 0;
var c_oserct_pieserORDER = 1;
var c_oserct_pieserTX = 2;
var c_oserct_pieserSPPR = 3;
var c_oserct_pieserEXPLOSION = 4;
var c_oserct_pieserDPT = 5;
var c_oserct_pieserDLBLS = 6;
var c_oserct_pieserCAT = 7;
var c_oserct_pieserVAL = 8;
var c_oserct_pieserEXTLST = 9;

var c_oserct_gapamountVAL = 0;

var c_oserct_bar3dchartBARDIR = 0;
var c_oserct_bar3dchartGROUPING = 1;
var c_oserct_bar3dchartVARYCOLORS = 2;
var c_oserct_bar3dchartSER = 3;
var c_oserct_bar3dchartDLBLS = 4;
var c_oserct_bar3dchartGAPWIDTH = 5;
var c_oserct_bar3dchartGAPDEPTH = 6;
var c_oserct_bar3dchartSHAPE = 7;
var c_oserct_bar3dchartAXID = 8;
var c_oserct_bar3dchartEXTLST = 9;

var c_oserct_bardirVAL = 0;

var c_oserct_bargroupingVAL = 0;

var c_oserct_barserIDX = 0;
var c_oserct_barserORDER = 1;
var c_oserct_barserTX = 2;
var c_oserct_barserSPPR = 3;
var c_oserct_barserINVERTIFNEGATIVE = 4;
var c_oserct_barserPICTUREOPTIONS = 5;
var c_oserct_barserDPT = 6;
var c_oserct_barserDLBLS = 7;
var c_oserct_barserTRENDLINE = 8;
var c_oserct_barserERRBARS = 9;
var c_oserct_barserCAT = 10;
var c_oserct_barserVAL = 11;
var c_oserct_barserSHAPE = 12;
var c_oserct_barserEXTLST = 13;

var c_oserct_shapeVAL = 0;

var c_oserct_overlapVAL = 0;

var c_oserct_barchartBARDIR = 0;
var c_oserct_barchartGROUPING = 1;
var c_oserct_barchartVARYCOLORS = 2;
var c_oserct_barchartSER = 3;
var c_oserct_barchartDLBLS = 4;
var c_oserct_barchartGAPWIDTH = 5;
var c_oserct_barchartOVERLAP = 6;
var c_oserct_barchartSERLINES = 7;
var c_oserct_barchartAXID = 8;
var c_oserct_barchartEXTLST = 9;

var c_oserct_holesizeVAL = 0;

var c_oserct_doughnutchartVARYCOLORS = 0;
var c_oserct_doughnutchartSER = 1;
var c_oserct_doughnutchartDLBLS = 2;
var c_oserct_doughnutchartFIRSTSLICEANG = 3;
var c_oserct_doughnutchartHOLESIZE = 4;
var c_oserct_doughnutchartEXTLST = 5;

var c_oserct_firstsliceangVAL = 0;

var c_oserct_pie3dchartVARYCOLORS = 0;
var c_oserct_pie3dchartSER = 1;
var c_oserct_pie3dchartDLBLS = 2;
var c_oserct_pie3dchartEXTLST = 3;

var c_oserct_piechartVARYCOLORS = 0;
var c_oserct_piechartSER = 1;
var c_oserct_piechartDLBLS = 2;
var c_oserct_piechartFIRSTSLICEANG = 3;
var c_oserct_piechartEXTLST = 4;

var c_oserct_scatterserIDX = 0;
var c_oserct_scatterserORDER = 1;
var c_oserct_scatterserTX = 2;
var c_oserct_scatterserSPPR = 3;
var c_oserct_scatterserMARKER = 4;
var c_oserct_scatterserDPT = 5;
var c_oserct_scatterserDLBLS = 6;
var c_oserct_scatterserTRENDLINE = 7;
var c_oserct_scatterserERRBARS = 8;
var c_oserct_scatterserXVAL = 9;
var c_oserct_scatterserYVAL = 10;
var c_oserct_scatterserSMOOTH = 11;
var c_oserct_scatterserEXTLST = 12;

var c_oserct_scatterstyleVAL = 0;

var c_oserct_scatterchartSCATTERSTYLE = 0;
var c_oserct_scatterchartVARYCOLORS = 1;
var c_oserct_scatterchartSER = 2;
var c_oserct_scatterchartDLBLS = 3;
var c_oserct_scatterchartAXID = 4;
var c_oserct_scatterchartEXTLST = 5;

var c_oserct_radarserIDX = 0;
var c_oserct_radarserORDER = 1;
var c_oserct_radarserTX = 2;
var c_oserct_radarserSPPR = 3;
var c_oserct_radarserMARKER = 4;
var c_oserct_radarserDPT = 5;
var c_oserct_radarserDLBLS = 6;
var c_oserct_radarserCAT = 7;
var c_oserct_radarserVAL = 8;
var c_oserct_radarserEXTLST = 9;

var c_oserct_radarstyleVAL = 0;

var c_oserct_radarchartRADARSTYLE = 0;
var c_oserct_radarchartVARYCOLORS = 1;
var c_oserct_radarchartSER = 2;
var c_oserct_radarchartDLBLS = 3;
var c_oserct_radarchartAXID = 4;
var c_oserct_radarchartEXTLST = 5;

var c_oserct_stockchartSER = 0;
var c_oserct_stockchartDLBLS = 1;
var c_oserct_stockchartDROPLINES = 2;
var c_oserct_stockchartHILOWLINES = 3;
var c_oserct_stockchartUPDOWNBARS = 4;
var c_oserct_stockchartAXID = 5;
var c_oserct_stockchartEXTLST = 6;

var c_oserct_lineserIDX = 0;
var c_oserct_lineserORDER = 1;
var c_oserct_lineserTX = 2;
var c_oserct_lineserSPPR = 3;
var c_oserct_lineserMARKER = 4;
var c_oserct_lineserDPT = 5;
var c_oserct_lineserDLBLS = 6;
var c_oserct_lineserTRENDLINE = 7;
var c_oserct_lineserERRBARS = 8;
var c_oserct_lineserCAT = 9;
var c_oserct_lineserVAL = 10;
var c_oserct_lineserSMOOTH = 11;
var c_oserct_lineserEXTLST = 12;

var c_oserct_updownbarsGAPWIDTH = 0;
var c_oserct_updownbarsUPBARS = 1;
var c_oserct_updownbarsDOWNBARS = 2;
var c_oserct_updownbarsEXTLST = 3;

var c_oserct_updownbarSPPR = 0;

var c_oserct_line3dchartGROUPING = 0;
var c_oserct_line3dchartVARYCOLORS = 1;
var c_oserct_line3dchartSER = 2;
var c_oserct_line3dchartDLBLS = 3;
var c_oserct_line3dchartDROPLINES = 4;
var c_oserct_line3dchartGAPDEPTH = 5;
var c_oserct_line3dchartAXID = 6;
var c_oserct_line3dchartEXTLST = 7;

var c_oserct_groupingVAL = 0;

var c_oserct_linechartGROUPING = 0;
var c_oserct_linechartVARYCOLORS = 1;
var c_oserct_linechartSER = 2;
var c_oserct_linechartDLBLS = 3;
var c_oserct_linechartDROPLINES = 4;
var c_oserct_linechartHILOWLINES = 5;
var c_oserct_linechartUPDOWNBARS = 6;
var c_oserct_linechartMARKER = 7;
var c_oserct_linechartSMOOTH = 8;
var c_oserct_linechartAXID = 9;
var c_oserct_linechartEXTLST = 10;

var c_oserct_area3dchartGROUPING = 0;
var c_oserct_area3dchartVARYCOLORS = 1;
var c_oserct_area3dchartSER = 2;
var c_oserct_area3dchartDLBLS = 3;
var c_oserct_area3dchartDROPLINES = 4;
var c_oserct_area3dchartGAPDEPTH = 5;
var c_oserct_area3dchartAXID = 6;
var c_oserct_area3dchartEXTLST = 7;

var c_oserct_areaserIDX = 0;
var c_oserct_areaserORDER = 1;
var c_oserct_areaserTX = 2;
var c_oserct_areaserSPPR = 3;
var c_oserct_areaserPICTUREOPTIONS = 4;
var c_oserct_areaserDPT = 5;
var c_oserct_areaserDLBLS = 6;
var c_oserct_areaserTRENDLINE = 7;
var c_oserct_areaserERRBARS = 8;
var c_oserct_areaserCAT = 9;
var c_oserct_areaserVAL = 10;
var c_oserct_areaserEXTLST = 11;

var c_oserct_areachartGROUPING = 0;
var c_oserct_areachartVARYCOLORS = 1;
var c_oserct_areachartSER = 2;
var c_oserct_areachartDLBLS = 3;
var c_oserct_areachartDROPLINES = 4;
var c_oserct_areachartAXID = 5;
var c_oserct_areachartEXTLST = 6;

var c_oserct_plotareaLAYOUT = 0;
var c_oserct_plotareaITEMS = 1;
var c_oserct_plotareaAREA3DCHART = 2;
var c_oserct_plotareaAREACHART = 3;
var c_oserct_plotareaBAR3DCHART = 4;
var c_oserct_plotareaBARCHART = 5;
var c_oserct_plotareaBUBBLECHART = 6;
var c_oserct_plotareaDOUGHNUTCHART = 7;
var c_oserct_plotareaLINE3DCHART = 8;
var c_oserct_plotareaLINECHART = 9;
var c_oserct_plotareaOFPIECHART = 10;
var c_oserct_plotareaPIE3DCHART = 11;
var c_oserct_plotareaPIECHART = 12;
var c_oserct_plotareaRADARCHART = 13;
var c_oserct_plotareaSCATTERCHART = 14;
var c_oserct_plotareaSTOCKCHART = 15;
var c_oserct_plotareaSURFACE3DCHART = 16;
var c_oserct_plotareaSURFACECHART = 17;
var c_oserct_plotareaITEMS1 = 18;
var c_oserct_plotareaCATAX = 19;
var c_oserct_plotareaDATEAX = 20;
var c_oserct_plotareaSERAX = 21;
var c_oserct_plotareaVALAX = 22;
var c_oserct_plotareaDTABLE = 23;
var c_oserct_plotareaSPPR = 24;
var c_oserct_plotareaEXTLST = 25;
var c_oserct_plotareaPLOTAREAREGION = 26;

var c_oserct_thicknessVAL = 0;

var c_oserct_surfaceTHICKNESS = 0;
var c_oserct_surfaceSPPR = 1;
var c_oserct_surfacePICTUREOPTIONS = 2;
var c_oserct_surfaceEXTLST = 3;

var c_oserct_perspectiveVAL = 0;

var c_oserct_depthpercentVAL = 0;

var c_oserct_rotyVAL = 0;

var c_oserct_hpercentVAL = 0;

var c_oserct_rotxVAL = 0;

var c_oserct_view3dROTX = 0;
var c_oserct_view3dHPERCENT = 1;
var c_oserct_view3dROTY = 2;
var c_oserct_view3dDEPTHPERCENT = 3;
var c_oserct_view3dRANGAX = 4;
var c_oserct_view3dPERSPECTIVE = 5;
var c_oserct_view3dEXTLST = 6;

var c_oserct_pivotfmtIDX = 0;
var c_oserct_pivotfmtSPPR = 1;
var c_oserct_pivotfmtTXPR = 2;
var c_oserct_pivotfmtMARKER = 3;
var c_oserct_pivotfmtDLBL = 4;
var c_oserct_pivotfmtEXTLST = 5;

var c_oserct_pivotfmtsPIVOTFMT = 0;

var c_oserct_chartTITLE = 0;
var c_oserct_chartAUTOTITLEDELETED = 1;
var c_oserct_chartPIVOTFMTS = 2;
var c_oserct_chartVIEW3D = 3;
var c_oserct_chartFLOOR = 4;
var c_oserct_chartSIDEWALL = 5;
var c_oserct_chartBACKWALL = 6;
var c_oserct_chartPLOTAREA = 7;
var c_oserct_chartLEGEND = 8;
var c_oserct_chartPLOTVISONLY = 9;
var c_oserct_chartDISPBLANKSAS = 10;
var c_oserct_chartSHOWDLBLSOVERMAX = 11;
var c_oserct_chartEXTLST = 12;

var c_oserct_protectionCHARTOBJECT = 0;
var c_oserct_protectionDATA = 1;
var c_oserct_protectionFORMATTING = 2;
var c_oserct_protectionSELECTION = 3;
var c_oserct_protectionUSERINTERFACE = 4;

var c_oserct_pivotsourceNAME = 0;
var c_oserct_pivotsourceFMTID = 1;
var c_oserct_pivotsourceEXTLST = 2;

var c_oserct_style1VAL = 0;

var c_oserct_styleVAL = 0;

var c_oserct_textlanguageidVAL = 0;

var c_oseralternatecontentCHOICE = 0;
var c_oseralternatecontentFALLBACK = 1;

var c_oseralternatecontentchoiceSTYLE = 0;
var c_oseralternatecontentchoiceREQUIRES = 1;

var c_oseralternatecontentfallbackSTYLE = 0;

var c_oserct_chartstyleID = 0;
var c_oserct_chartstyleENTRY = 1;
var c_oserct_chartstyleMARKERLAYOUT = 2;

var c_oserct_chartstyleENTRYTYPE = 0;
var c_oserct_chartstyleLNREF = 1;
var c_oserct_chartstyleFILLREF = 2;
var c_oserct_chartstyleEFFECTREF = 3;
var c_oserct_chartstyleFONTREF = 4;
var c_oserct_chartstyleDEFPR = 5;
var c_oserct_chartstyleBODYPR = 6;
var c_oserct_chartstyleSPPR = 7;
var c_oserct_chartstyleLINEWIDTH = 8;

var c_oserct_chartstyleMARKERSYMBOL = 0;
var c_oserct_chartstyleMARKERSIZE = 1;

var c_oserct_chartcolorsID = 0;
var c_oserct_chartcolorsMETH = 1;
var c_oserct_chartcolorsVARIATION = 2;
var c_oserct_chartcolorsCOLOR = 3;
var c_oserct_chartcolorsEFFECT = 4;


var c_oserct_chartExSpaceCHARTDATA = 0;
var c_oserct_chartExSpaceCHART = 1;
var c_oserct_chartExSpaceSPPR = 2;
var c_oserct_chartExSpaceTXPR = 3;
var c_oserct_chartExSpaceCLRMAPOVR = 4;
var c_oserct_chartExSpaceXLSX = c_oserct_chartspaceXLSX;/* = 16*/
var c_oserct_chartExSpaceSTYLES = c_oserct_chartspaceSTYLES;/* = 17*/
var c_oserct_chartExSpaceCOLORS = c_oserct_chartspaceCOLORS;/* = 18*/
// var c_oserct_chartExSpaceXLSXEXTERNAL = c_oserct_chartspaceXLSXEXTERNAL;/* = 19*/

var c_oserct_chartExDATA = 0;
var c_oserct_chartExEXTERNALDATA = 1;

var c_oserct_chartExExternalAUTOUPDATE = 0;

var c_oserct_chartExChartPLOTAREA = 0;
var c_oserct_chartExChartTITLE = 1;
var c_oserct_chartExChartLEGEND = 2;

var c_oserct_chartExChartAREAREGION = 0;
var c_oserct_chartExChartAXIS = 1;
var c_oserct_chartExChartSPPR = 2;

var c_oserct_chartExAreaPLOTSURFACE = 0;
var c_oserct_chartExAreaSERIES = 1;

var c_oserct_chartExAxisID = 0;

var c_oserct_chartExPlotSurfaceSPPR = 0;
var c_oserct_chartExAxisHIDDEN = 1;
var c_oserct_chartExAxisCATSCALING = 2;
var c_oserct_chartExAxisVALSCALING = 3;
var c_oserct_chartExAxisTITLE = 4;
var c_oserct_chartExAxisUNIT = 5;
var c_oserct_chartExAxisNUMFMT = 6;
var c_oserct_chartExAxisMAJORTICK = 7;
var c_oserct_chartExAxisMINORTICK = 8;
var c_oserct_chartExAxisMAJORGRID = 9;
var c_oserct_chartExAxisMINORGRID = 10;
var c_oserct_chartExAxisTICKLABELS = 11;
var c_oserct_chartExAxisTXPR = 12;
var c_oserct_chartExAxisSPPR = 13;

var c_oserct_chartExSeriesDATAPT = 0;
var c_oserct_chartExSeriesDATALABELS = 1;
var c_oserct_chartExSeriesLAYOUTPROPS = 2;
var c_oserct_chartExSeriesTEXT = 3;
var c_oserct_chartExSeriesAXIS = 4;
var c_oserct_chartExSeriesDATAID = 5;
var c_oserct_chartExSeriesSPPR = 6;
var c_oserct_chartExSeriesLAYOUTID = 7;
var c_oserct_chartExSeriesHIDDEN = 8;
var c_oserct_chartExSeriesOWNERIDX = 9;
var c_oserct_chartExSeriesFORMATIDX = 10;
var c_oserct_chartExSeriesUNIQUEID = 11;

var c_oserct_chartExDataPointIDX = 0;
var c_oserct_chartExDataPointSPPR = 1;

var c_oserct_chartExDataLabelsPOS = 0;
var c_oserct_chartExDataLabelsNUMFMT = 1;
var c_oserct_chartExDataLabelsTXPR = 2;
var c_oserct_chartExDataLabelsSPPR = 3;
var c_oserct_chartExDataLabelsVISABILITIES = 4;
var c_oserct_chartExDataLabelsSEPARATOR = 5;
var c_oserct_chartExDataLabelsDATALABEL = 6;
var c_oserct_chartExDataLabelsDATALABELHIDDEN = 7;

var c_oserct_chartExNumberFormatFORMATCODE = 0;
var c_oserct_chartExNumberFormatSOURCELINKED = 1;

var c_oserct_chartExDataLabelIDX = 0;
var c_oserct_chartExDataLabelPOS = 1;
var c_oserct_chartExDataLabelNUMFMT = 2;
var c_oserct_chartExDataLabelTXPR = 3;
var c_oserct_chartExDataLabelSPPR = 4;
var c_oserct_chartExDataLabelVISABILITIES = 5;
var c_oserct_chartExDataLabelSEPARATOR = 6;

var c_oserct_chartExDataLabelHiddenIDX = 0;

var c_oserct_chartExSeriesLayoutPARENT = 0;
var c_oserct_chartExSeriesLayoutREGION = 1;
var c_oserct_chartExSeriesLayoutVISABILITIES = 2;
var c_oserct_chartExSeriesLayoutAGGREGATION = 3;
var c_oserct_chartExSeriesLayoutBINNING = 4;
var c_oserct_chartExSeriesLayoutSTATISTIC = 5;
var c_oserct_chartExSeriesLayoutSUBTOTALS = 6;

var c_oserct_chartExDataLabelVisibilitiesSERIES = 0;
var c_oserct_chartExDataLabelVisibilitiesCATEGORY = 1;
var c_oserct_chartExDataLabelVisibilitiesVALUE = 2;

var c_oserct_chartExBinningBINSIZE = 0;
var c_oserct_chartExBinningBINCOUNT = 1;
var c_oserct_chartExBinningINTERVAL = 2;
var c_oserct_chartExBinningUNDERVAL = 3;
var c_oserct_chartExBinningUNDERAUTO = 4;
var c_oserct_chartExBinningOVERVAL = 5;
var c_oserct_chartExBinningOVERAUTO = 6;

var c_oserct_chartExTitleTX = 0;
var c_oserct_chartExTitleTXPR = 1;
var c_oserct_chartExTitleSPPR = 2;
var c_oserct_chartExTitlePOS = 3;
var c_oserct_chartExTitleALIGN = 4;
var c_oserct_chartExTitleOVERLAY = 5;

var c_oserct_chartExLegendTXPR = 0;
var c_oserct_chartExLegendSPPR = 1;
var c_oserct_chartExLegendPOS = 2;
var c_oserct_chartExLegendALIGN = 3;
var c_oserct_chartExLegendOVERLAY = 4;

var c_oserct_chartExTextRICH = 0;
var c_oserct_chartExTextDATA = 1;

var c_oserct_chartExTextDataFORMULA = 0;
var c_oserct_chartExTextDataVALUE = 1;

var c_oserct_chartExDataID = 0;
var c_oserct_chartExDataSTRDIMENSION = 1;
var c_oserct_chartExDataNUMDIMENSION = 2;

var c_oserct_chartExSubtotalsIDX = 0;

var c_oserct_chartExSeriesVisibilitiesCONNECTOR = 0;
var c_oserct_chartExSeriesVisibilitiesMEANLINE = 1;
var c_oserct_chartExSeriesVisibilitiesMEANMARKER = 2;
var c_oserct_chartExSeriesVisibilitiesNONOUTLIERS = 3;
var c_oserct_chartExSeriesVisibilitiesOUTLIERS = 4;

var c_oserct_chartExCatScalingGAPAUTO = 0;
var c_oserct_chartExCatScalingGAPVAL = 1;

var c_oserct_chartExValScalingMAXAUTO = 0;
var c_oserct_chartExValScalingMAXVAL = 1;
var c_oserct_chartExValScalingMINAUTO = 2;
var c_oserct_chartExValScalingMINVAL = 3;
var c_oserct_chartExValScalingMAJUNITAUTO = 4;
var c_oserct_chartExValScalingMAJUNITVAL = 5;
var c_oserct_chartExValScalingMINUNITAUTO = 6;
var c_oserct_chartExValScalingMINUNITVAL = 7;

var c_oserct_chartExAxisUnitTYPE = 0;
var c_oserct_chartExAxisUnitLABEL = 1;

var c_oserct_chartExAxisUnitsLabelTEXT = 0;
var c_oserct_chartExAxisUnitsLabelSPPR = 1;
var c_oserct_chartExAxisUnitsLabelTXPR = 2;

var c_oserct_chartExTickMarksTYPE = 0;

var c_oserct_chartExGridlinesSPPR = 0;

var c_oserct_chartExStatisticsMETHOD = 0;

var c_oserct_chartExDataDimensionTYPE = 0;
var c_oserct_chartExDataDimensionFORMULA = 1;
var c_oserct_chartExDataDimensionNF = 2;
var c_oserct_chartExDataDimensionSTRINGLEVEL = 3;
var c_oserct_chartExDataDimensionNUMERICLEVEL = 4;

var c_oserct_chartExFormulaCONTENT = 0;
var c_oserct_chartExFormulaDIRECTION = 1;

var c_oserct_chartExDataLevelNAME = 0;
var c_oserct_chartExDataLevelCOUNT = 1;
var c_oserct_chartExDataLevelPT = 2;
var c_oserct_chartExDataLevelFORMATCODE = 3;

var c_oserct_chartExDataValueIDX = 0;
var c_oserct_chartExDataValueCONTENT = 1;

// extens ... 0x80
var c_oserct_dataLabel = 0x81;
var c_oserct_chartFiltering = 0x82;

var c_oserct_dataLabelsRange = 0x90;
var c_oserct_filteredLineSeries = 0x91;
var c_oserct_filteredScatterSeries = 0x92;
var c_oserct_filteredRadarSeries = 0x93;
var c_oserct_filteredBarSeries = 0x94;
var c_oserct_filteredAreaSeries = 0x95;
var c_oserct_filteredBubbleSeries = 0x96;
var c_oserct_filteredSurfaceSeries = 0x97;
var c_oserct_filteredPieSeries = 0x98;
var c_oserct_fullRef = 0x99;
var c_oserct_levelRef = 0x9A;
var c_oserct_formulaRef = 0x9B;
var c_oserct_categoryFilterExceptions = 0x9C;
var c_oserct_categoryFilterException = 0x9D;
var c_oserct_filteredSeriesTitle = 0x9E;
var c_oserct_filteredCategoryTitle = 0x9EF;

var c_oserct_dataLabelsRangeFormula = 0x100;
var c_oserct_dataLabelsRangeCache = 0x101;

var c_oserct_filterSqref = 0x110;
var c_oserct_filterSpPr = 0x111;
var c_oserct_filterExplosion = 0x112;
var c_oserct_filterInvertIfNegative = 0x113;
var c_oserct_filterBubble3D = 0x114;
var c_oserct_filterMarker = 0x115;
var c_oserct_filterLbl = 0x116;

var SIZE_REPRESENTS_AREA = 0;
var SIZE_REPRESENTS_W = 1;

var ERR_BAR_TYPE_BOTH = 0;
var ERR_BAR_TYPE_MINUS = 1;
var ERR_BAR_TYPE_PLUS = 2;

var ERR_DIR_X = 0;
var ERR_DIR_Y = 1;

var ERR_VAL_TYPE_CUST = 0;
var ERR_VAL_TYPE_FIXED_VAL = 1;
var ERR_VAL_TYPE_PERCENTAGE = 2;
var ERR_VAL_TYPE_STD_DEV = 3;
var ERR_VAL_TYPE_STD_ERR = 4;

var LAYOUT_TARGET_INNER = 0;
var LAYOUT_TARGET_OUTER = 1;

var LAYOUT_MODE_EDGE = 0;
var LAYOUT_MODE_FACTOR = 1;

var OF_PIE_TYPE_BAR = 0;
var OF_PIE_TYPE_PIE = 1;

var SPLIT_TYPE_AUTO = 0;
var SPLIT_TYPE_CUST = 1;
var SPLIT_TYPE_PERCENT = 2;
var SPLIT_TYPE_POS = 3;
var SPLIT_TYPE_VAL = 4;

var PICTURE_FORMAT_STACK = 0;
var PICTURE_FORMAT_STACK_SCALE = 1;
var PICTURE_FORMAT_STACK_STRETCH = 2;

var RADAR_STYLE_STANDARD = 0;
var RADAR_STYLE_MARKER = 1;
var RADAR_STYLE_FILLED = 2;

var TRENDLINE_TYPE_EXP = 0;
var TRENDLINE_TYPE_LINEAR = 1;
var TRENDLINE_TYPE_LOG = 2;
var TRENDLINE_TYPE_MOVING_AVG = 3;
var TRENDLINE_TYPE_POLY = 4;
var TRENDLINE_TYPE_POWER = 5;

function BinaryChartWriter(memory) {
    this.memory = memory;
    this.bs = new AscCommon.BinaryCommonWriter(this.memory);
}
BinaryChartWriter.prototype.WriteCT_extLst = function (oVal) {
    var oThis = this;
    if (null != oVal.m_ext) {
        for (var i = 0, length = oVal.m_ext.length; i < length; ++i) {
            var oCurVal = oVal.m_ext[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_extlstEXT, function () {
                    oThis.WriteCT_Extension(oCurVal);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_ChartSpace = function (oVal) {
    var oThis = this;
    if (null != oVal.date1904) {
        this.bs.WriteItem(c_oserct_chartspaceDATE1904, function () {
            oThis.WriteCT_Boolean(oVal.date1904);
        });
    }
    if (null != oVal.lang) {
        this.bs.WriteItem(c_oserct_chartspaceLANG, function () {
            oThis.WriteCT_TextLanguageID(oVal.lang);
        });
    }
    if (null != oVal.roundedCorners) {
        this.bs.WriteItem(c_oserct_chartspaceROUNDEDCORNERS, function () {
            oThis.WriteCT_Boolean(oVal.roundedCorners);
        });
    }
    if (null != oVal.style) {
        this.bs.WriteItem(c_oserct_chartspaceALTERNATECONTENT, function () {
            oThis.bs.WriteItem(c_oseralternatecontentCHOICE, function () {
                oThis.bs.WriteItem(c_oseralternatecontentchoiceREQUIRES, function () {
                    oThis.memory.WriteString3("c14");
                });
                oThis.bs.WriteItem(c_oseralternatecontentchoiceSTYLE, function () {
                    oThis.WriteCT_Style(100 + oVal.style);
                });
            });
            oThis.bs.WriteItem(c_oseralternatecontentFALLBACK, function () {
                oThis.bs.WriteItem(c_oseralternatecontentfallbackSTYLE, function () {
                    oThis.WriteCT_Style1(oVal.style);
                });
            });
        });
    }
    var oCurVal = oVal.clrMapOvr;
    if (null != oCurVal) {
       this.bs.WriteItem(c_oserct_chartspaceCLRMAPOVR, function () {
            oThis.WriteClrMapOverride(oCurVal);
       });
    }
    if (null != oVal.pivotSource) {
        this.bs.WriteItem(c_oserct_chartspacePIVOTSOURCE, function () {
            oThis.WriteCT_PivotSource(oVal.pivotSource);
        });
    }
    if (null != oVal.protection) {
        this.bs.WriteItem(c_oserct_chartspacePROTECTION, function () {
            oThis.WriteCT_Protection(oVal.protection);
        });
    }
    if (null != oVal.chart) {
        this.bs.WriteItem(c_oserct_chartspaceCHART, function () {
            oThis.WriteCT_Chart(oVal.chart);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_chartspaceSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_chartspaceTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    //var oCurVal = oVal.m_externalData;
    //if (null != oCurVal) {
    //    this.bs.WriteItem(c_oserct_chartspaceEXTERNALDATA, function () {
    //        oThis.WriteCT_ExternalData(oCurVal);
    //    });
    //}
    if (null != oVal.printSettings) {
        this.bs.WriteItem(c_oserct_chartspacePRINTSETTINGS, function () {
            oThis.WriteCT_PrintSettings(oVal.printSettings);
        });
    }

    if(oVal.userShapes.length > 0){
        this.bs.WriteItem(c_oserct_chartspaceUSERSHAPES, function () {
            oThis.WriteCT_UserShapes(oVal.userShapes);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_chartspaceEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
    if (null != oVal.themeOverride)
	    this.bs.WriteItem(c_oserct_chartspaceTHEMEOVERRIDE, function () { AscCommon.pptx_content_writer.WriteTheme(oThis.memory, oVal.themeOverride); });

    if(null != oVal.chartStyle) {
        this.bs.WriteItem(c_oserct_chartspaceSTYLES, function() {
           oThis.WriteCT_ChartStyle(oVal.chartStyle);
        });
    }
    if(null != oVal.chartColors) {
        this.bs.WriteItem(c_oserct_chartspaceCOLORS, function() {
           oThis.WriteCT_ChartColors(oVal.chartColors);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_ChartExSpace = function (oVal) {
    var oThis = this;
    if(oVal.chartData !== null) {
        this.bs.WriteItem(c_oserct_chartExSpaceCHARTDATA, function() {
           oThis.WriteCT_ChartData(oVal.chartData);
        });
    }
    if (oVal.chart !== null) {
        this.bs.WriteItem(c_oserct_chartExSpaceCHART, function () {
            oThis.WriteCT_ChartEx(oVal.chart);
        });
    }
    if (oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_chartExSpaceSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (oVal.txPr !== null) {
        this.bs.WriteItem(c_oserct_chartExSpaceTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if (oVal.clrMapOvr !== null) {
        this.bs.WriteItem(c_oserct_chartExSpaceCLRMAPOVR, function () {
             oThis.WriteClrMapOverride(oVal.clrMapOvr);
        });
     }
     if(oVal.chartStyle !== null) {
        this.bs.WriteItem(c_oserct_chartExSpaceSTYLES, function() {
           oThis.WriteCT_ChartStyle(oVal.chartStyle);
        });
    }
     if(oVal.chartColors !== null) {
        this.bs.WriteItem(c_oserct_chartExSpaceCOLORS, function() {
           oThis.WriteCT_ChartColors(oVal.chartColors);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_FromTo = function(oVal){
        this.memory.WriteByte(Asc.c_oSer_DrawingPosType.X);
        this.memory.WriteByte(AscCommon.c_oSerPropLenType.Double);
        this.memory.WriteDouble2(oVal.x);
        this.memory.WriteByte(Asc.c_oSer_DrawingPosType.Y);
        this.memory.WriteByte(AscCommon.c_oSerPropLenType.Double);
        this.memory.WriteDouble2(oVal.y);
    };
BinaryChartWriter.prototype.WriteCT_UserShape = function (oVal){
        var oThis = this;
        var res = c_oSerConstants.ReadOk;
        if(AscFormat.isRealNumber(oVal.fromX) && AscFormat.isRealNumber(oVal.fromY))
        {
            var oNewVal = {x: oVal.fromX, y: oVal.fromY};
            this.bs.WriteItem(Asc.c_oSer_DrawingType.From, function () { oThis.WriteCT_FromTo(oNewVal); });
        }
        if(AscFormat.isRealNumber(oVal.toX) && AscFormat.isRealNumber(oVal.toY))
        {
            var oNewVal = {x: oVal.toX, y: oVal.toY};
            var type = oVal.getObjectType() === AscDFH.historyitem_type_AbsSizeAnchor ? Asc.c_oSer_DrawingType.Ext : Asc.c_oSer_DrawingType.To;
            this.bs.WriteItem(type, function () { oThis.WriteCT_FromTo(oNewVal); });
        }
        this.bs.WriteItem(Asc.c_oSer_DrawingType.pptxDrawing, function(){pptx_content_writer.WriteDrawing(oThis.memory, oVal.object, null, null, null);});
    };
BinaryChartWriter.prototype.WriteCT_UserShapes = function (oVal) {

    var oThis = this;
    this.bs.WriteItem(c_oserct_usershapes_COUNT, function () {
        oThis.memory.WriteLong(oVal.length);
    });
    for(var i = 0; i < oVal.length; ++i)
    {
        if(oVal[i] instanceof AscFormat.CRelSizeAnchor)
        {
            this.bs.WriteItem(c_oserct_usershapes_SHAPE_REL, function(t, l){
               oThis.WriteCT_UserShape(oVal[i]);
            });
        }
        else
        {
            this.bs.WriteItem(c_oserct_usershapes_SHAPE_ABS, function(t, l){
                oThis.WriteCT_UserShape(oVal[i]);
            });
        }
    }

};
BinaryChartWriter.prototype.WriteCT_ChartStyle = function (oVal) {
    var oThis = this;
    if(oVal.id !== null) {
        this.bs.WriteItem(c_oserct_chartstyleID, function() {
            oThis.memory.WriteLong(oVal.id);
        });
    }
    var aEntries = oVal.getStyleEntries(), oEntry;
    for(var nEntry = 0; nEntry < aEntries.length; ++nEntry) {
        oEntry = aEntries[nEntry];
        if(oEntry) {
            this.bs.WriteItem(c_oserct_chartstyleENTRY, function() {
                oThis.WriteCT_ChartStyleEntry(oEntry);
            });
        }
    }
    if(oVal.markerLayout) {
        this.bs.WriteItem(c_oserct_chartstyleMARKERLAYOUT, function() {
            oThis.WriteCT_MarkerLayout(oVal.markerLayout);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_ChartStyleEntry = function (oVal) {
    var oThis = this;
    if(oVal.type !== null) {
        this.bs.WriteItem(c_oserct_chartstyleENTRYTYPE, function() {
            oThis.memory.WriteByte(oVal.type);
        });
    }
    if(oVal.lnRef !== null) {
        this.bs.WriteItem(c_oserct_chartstyleLNREF, function() {
            AscCommon.pptx_content_writer.WriteStyleRef(oThis.memory, oVal.lnRef);
        });
    }
    if(oVal.fillRef !== null) {
        this.bs.WriteItem(c_oserct_chartstyleFILLREF, function() {
            AscCommon.pptx_content_writer.WriteStyleRef(oThis.memory, oVal.fillRef);
        });
    }
    if(oVal.effectRef !== null) {
        this.bs.WriteItem(c_oserct_chartstyleEFFECTREF, function() {
            AscCommon.pptx_content_writer.WriteStyleRef(oThis.memory, oVal.effectRef);
        });
    }
    if(oVal.fontRef !== null) {
        this.bs.WriteItem(c_oserct_chartstyleFONTREF, function() {
            AscCommon.pptx_content_writer.WriteFontRef(oThis.memory, oVal.fontRef);
        });
    }
    if(oVal.defRPr !== null) {
        this.bs.WriteItem(c_oserct_chartstyleDEFPR, function() {
            AscCommon.pptx_content_writer.WriteRunProperties(oThis.memory, oVal.defRPr);
        });
    }
    if(oVal.bodyPr !== null) {
        this.bs.WriteItem(c_oserct_chartstyleBODYPR, function() {
            AscCommon.pptx_content_writer.WriteBodyPr(oThis.memory, oVal.bodyPr);
        });
    }
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_chartstyleSPPR, function() {
            AscCommon.pptx_content_writer.WriteSpPr(oThis.memory, oVal.spPr);
        });
    }
    if(oVal.lineWidthScale !== null) {
        this.bs.WriteItem(c_oserct_chartstyleLINEWIDTH, function() {
            oThis.memory.WriteDouble2(oVal.lineWidthScale);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_MarkerLayout = function (oVal) {
    var oThis = this;
    if(oVal.symbol !== null) {
        this.bs.WriteItem(c_oserct_chartstyleMARKERSYMBOL, function() {
            oThis.memory.WriteByte(oVal.symbol);
        });
    }
    if(oVal.size !== null) {
        this.bs.WriteItem(c_oserct_chartstyleMARKERSIZE, function() {
            oThis.memory.WriteLong(oVal.size);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_ChartColors = function (oVal) {
    var oThis = this;
    if(oVal.id !== null) {
        this.bs.WriteItem(c_oserct_chartcolorsID, function() {
            oThis.memory.WriteLong(oVal.id);
        });
    }
    if(oVal.meth !== null) {
        this.bs.WriteItem(c_oserct_chartcolorsMETH, function() {
            oThis.memory.WriteString3(oVal.meth);
        });
    }
    var aItems = oVal.items, nItem, oItem;
    for(nItem = 0; nItem < aItems.length; ++nItem) {
        oItem = aItems[nItem];
        if(oItem instanceof AscFormat.CUniColor) {
            this.bs.WriteItem(c_oserct_chartcolorsCOLOR, function() {
                AscCommon.pptx_content_writer.WriteUniColor(oThis.memory, oItem)
            });
        }
        else {
            this.bs.WriteItem(c_oserct_chartcolorsVARIATION, function() {
                oThis.WriteCT_ColorsVariation(oItem);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_ColorsVariation = function (oVal) {
    var oThis = this;
    var aMods = oVal.Mods, nMod, oMod;
    for(nMod = 0; nMod < aMods.length; ++nMod) {
        oMod = aMods[nMod];
        this.bs.WriteItem(c_oserct_chartcolorsEFFECT, function() {
            AscCommon.pptx_content_writer.WriteMod(oThis.memory, oMod)
        });
    }
};
BinaryChartWriter.prototype.WriteSpPr = function (oVal) {
  AscCommon.pptx_content_writer.WriteSpPr(this.memory, oVal);
};
BinaryChartWriter.prototype.WriteClrMapOverride = function (oVal) {
  AscCommon.pptx_content_writer.WriteClrMapOverride(this.memory, oVal);
};
BinaryChartWriter.prototype.WriteTxPr = function (oVal) {
  AscCommon.pptx_content_writer.WriteTextBody(this.memory, oVal);
};
BinaryChartWriter.prototype.percentToString = function (val, bInteger, bSign) {
    var sRes;
    if (bInteger)
        sRes = parseInt(val).toString();
    else
        sRes = val.toString();
    if (bSign)
        sRes += "%";
    return sRes;
};
BinaryChartWriter.prototype.metricToString = function (val, bInteger) {
    var sRes;
    if (bInteger)
        sRes = parseInt(val).toString();
    else
        sRes = val.toString();
    sRes += "mm";
    return sRes;
};
BinaryChartWriter.prototype.WriteCT_Boolean = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_booleanVAL, function () {
            oThis.memory.WriteBool(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_RelId = function (oVal) {
    var oThis = this;
    var oCurVal = oVal.m_id;
    if (null != oCurVal) {
        this.bs.WriteItem(c_oserct_relidID, function () {
            //todo
            oThis.memory.WriteString3(oCurVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_PageSetup = function (oVal) {
    var oThis = this;
    if (null != oVal.paperSize) {
        this.bs.WriteItem(c_oserct_pagesetupPAPERSIZE, function () {
            oThis.memory.WriteLong(oVal.paperSize);
        });
    }
    if (null != oVal.paperHeight) {
        this.bs.WriteItem(c_oserct_pagesetupPAPERHEIGHT, function () {
            oThis.memory.WriteString3(oThis.metricToString(oVal.paperHeight, false));
        });
    }
    if (null != oVal.paperWidth) {
        this.bs.WriteItem(c_oserct_pagesetupPAPERWIDTH, function () {
            oThis.memory.WriteString3(oThis.metricToString(oVal.paperWidth, false));
        });
    }
    if (null != oVal.firstPageNumber) {
        this.bs.WriteItem(c_oserct_pagesetupFIRSTPAGENUMBER, function () {
            oThis.memory.WriteLong(oVal.firstPageNumber);
        });
    }
    if (null != oVal.orientation) {
        var nVal = null;
        switch (oVal.orientation) {
            case AscFormat.PAGE_SETUP_ORIENTATION_DEFAULT: nVal = st_pagesetuporientationDEFAULT; break;
            case AscFormat.PAGE_SETUP_ORIENTATION_PORTRAIT: nVal = st_pagesetuporientationPORTRAIT; break;
            case AscFormat.PAGE_SETUP_ORIENTATION_LANDSCAPE: nVal = st_pagesetuporientationLANDSCAPE; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_pagesetupORIENTATION, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
    if (null != oVal.blackAndWhite) {
        this.bs.WriteItem(c_oserct_pagesetupBLACKANDWHITE, function () {
            oThis.memory.WriteBool(oVal.blackAndWhite);
        });
    }
    if (null != oVal.draft) {
        this.bs.WriteItem(c_oserct_pagesetupDRAFT, function () {
            oThis.memory.WriteBool(oVal.draft);
        });
    }
    if (null != oVal.useFirstPageNumb) {
        this.bs.WriteItem(c_oserct_pagesetupUSEFIRSTPAGENUMBER, function () {
            oThis.memory.WriteBool(oVal.useFirstPageNumb);
        });
    }
    if (null != oVal.horizontalDpi) {
        this.bs.WriteItem(c_oserct_pagesetupHORIZONTALDPI, function () {
            oThis.memory.WriteLong(oVal.horizontalDpi);
        });
    }
    if (null != oVal.verticalDpi) {
        this.bs.WriteItem(c_oserct_pagesetupVERTICALDPI, function () {
            oThis.memory.WriteLong(oVal.verticalDpi);
        });
    }
    if (null != oVal.copies) {
        this.bs.WriteItem(c_oserct_pagesetupCOPIES, function () {
            oThis.memory.WriteLong(oVal.copies);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_PageMargins = function (oVal) {
    var oThis = this;
    if (null != oVal.l) {
        this.bs.WriteItem(c_oserct_pagemarginsL, function () {
            oThis.memory.WriteDouble2(oVal.l);
        });
    }
    if (null != oVal.r) {
        this.bs.WriteItem(c_oserct_pagemarginsR, function () {
            oThis.memory.WriteDouble2(oVal.r);
        });
    }
    if (null != oVal.t) {
        this.bs.WriteItem(c_oserct_pagemarginsT, function () {
            oThis.memory.WriteDouble2(oVal.t);
        });
    }
    if (null != oVal.b) {
        this.bs.WriteItem(c_oserct_pagemarginsB, function () {
            oThis.memory.WriteDouble2(oVal.b);
        });
    }
    if (null != oVal.header) {
        this.bs.WriteItem(c_oserct_pagemarginsHEADER, function () {
            oThis.memory.WriteDouble2(oVal.header);
        });
    }
    if (null != oVal.footer) {
        this.bs.WriteItem(c_oserct_pagemarginsFOOTER, function () {
            oThis.memory.WriteDouble2(oVal.footer);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_HeaderFooter = function (oVal) {
    var oThis = this;
    if (null != oVal.oddHeader) {
        this.bs.WriteItem(c_oserct_headerfooterODDHEADER, function () {
            oThis.memory.WriteString3(oVal.oddHeader);
        });
    }
    if (null != oVal.oddFooter) {
        this.bs.WriteItem(c_oserct_headerfooterODDFOOTER, function () {
            oThis.memory.WriteString3(oVal.oddFooter);
        });
    }
    if (null != oVal.evenHeader) {
        this.bs.WriteItem(c_oserct_headerfooterEVENHEADER, function () {
            oThis.memory.WriteString3(oVal.evenHeader);
        });
    }
    if (null != oVal.evenFooter) {
        this.bs.WriteItem(c_oserct_headerfooterEVENFOOTER, function () {
            oThis.memory.WriteString3(oVal.evenFooter);
        });
    }
    if (null != oVal.firstHeader) {
        this.bs.WriteItem(c_oserct_headerfooterFIRSTHEADER, function () {
            oThis.memory.WriteString3(oVal.firstHeader);
        });
    }
    if (null != oVal.firstFooter) {
        this.bs.WriteItem(c_oserct_headerfooterFIRSTFOOTER, function () {
            oThis.memory.WriteString3(oVal.firstFooter);
        });
    }
    if (null != oVal.alignWithMargins) {
        this.bs.WriteItem(c_oserct_headerfooterALIGNWITHMARGINS, function () {
            oThis.memory.WriteBool(oVal.alignWithMargins);
        });
    }
    if (null != oVal.differentOddEven) {
        this.bs.WriteItem(c_oserct_headerfooterDIFFERENTODDEVEN, function () {
            oThis.memory.WriteBool(oVal.differentOddEven);
        });
    }
    if (null != oVal.differentFirst) {
        this.bs.WriteItem(c_oserct_headerfooterDIFFERENTFIRST, function () {
            oThis.memory.WriteBool(oVal.differentFirst);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_PrintSettings = function (oVal) {
    var oThis = this;
    if (null != oVal.headerFooter) {
        this.bs.WriteItem(c_oserct_printsettingsHEADERFOOTER, function () {
            oThis.WriteCT_HeaderFooter(oVal.headerFooter);
        });
    }
    if (null != oVal.pageMargins) {
        this.bs.WriteItem(c_oserct_printsettingsPAGEMARGINS, function () {
            oThis.WriteCT_PageMargins(oVal.pageMargins);
        });
    }
    if (null != oVal.pageSetup) {
        this.bs.WriteItem(c_oserct_printsettingsPAGESETUP, function () {
            oThis.WriteCT_PageSetup(oVal.pageSetup);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_ExternalData = function (oVal) {
    var oThis = this;
    var oCurVal = oVal.m_autoUpdate;
    if (null != oCurVal) {
        this.bs.WriteItem(c_oserct_externaldataAUTOUPDATE, function () {
            oThis.WriteCT_Boolean(oCurVal);
        });
    }
    var oCurVal = oVal.m_id;
    if (null != oCurVal) {
        this.bs.WriteItem(c_oserct_externaldataID, function () {
            //todo
            oThis.memory.WriteString3(oCurVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_DispBlanksAs = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case AscFormat.DISP_BLANKS_AS_SPAN: nVal = st_dispblanksasSPAN; break;
            case AscFormat.DISP_BLANKS_AS_GAP: nVal = st_dispblanksasGAP; break;
            case AscFormat.DISP_BLANKS_AS_ZERO: nVal = st_dispblanksasZERO; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_dispblanksasVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_LegendEntry = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_legendentryIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.bDelete) {
        this.bs.WriteItem(c_oserct_legendentryDELETE, function () {
            oThis.WriteCT_Boolean(oVal.bDelete);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_legendentryTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_legendentryEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_UnsignedInt = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_unsignedintVAL, function () {
            oThis.memory.WriteLong(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Extension = function (oVal) {
    var oThis = this;
    var oCurVal = oVal.m_Any;
    if (null != oCurVal) {
        this.bs.WriteItem(c_oserct_extensionANY, function () {
            oThis.memory.WriteString3(oCurVal);
        });
    }
    var oCurVal = oVal.m_uri;
    if (null != oCurVal) {
        this.bs.WriteItem(c_oserct_extensionURI, function () {
            oThis.memory.WriteString3(oCurVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_LegendPos = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case c_oAscChartLegendShowSettings.bottom: nVal = st_legendposB; break;
            case c_oAscChartLegendShowSettings.topRight: nVal = st_legendposTR; break;
            case c_oAscChartLegendShowSettings.left:
            case c_oAscChartLegendShowSettings.leftOverlay:
              nVal = st_legendposL; break;
            case c_oAscChartLegendShowSettings.right:
            case c_oAscChartLegendShowSettings.rightOverlay:
              nVal = st_legendposR; break;
            case c_oAscChartLegendShowSettings.top: nVal = st_legendposT; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_legendposVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_Legend = function (oVal) {
    var oThis = this;
    if (null != oVal.legendPos) {
        this.bs.WriteItem(c_oserct_legendLEGENDPOS, function () {
            oThis.WriteCT_LegendPos(oVal.legendPos);
        });
    }
    if (null != oVal.legendEntryes) {
        for (var i = 0, length = oVal.legendEntryes.length; i < length; ++i) {
            var oCurVal = oVal.legendEntryes[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_legendLEGENDENTRY, function () {
                    oThis.WriteCT_LegendEntry(oCurVal);
                });
            }
        }
    }
    this.bs.WriteItem(c_oserct_legendLAYOUT, function () {
        oThis.WriteCT_Layout(oVal);
    });
    if (null != oVal.overlay) {
        this.bs.WriteItem(c_oserct_legendOVERLAY, function () {
            oThis.WriteCT_Boolean(oVal.overlay);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_legendSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_legendTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if (null != oVal.align) {
        this.bs.WriteItem(c_oserct_legendALIGN, function () {
            oThis.memory.WriteByte(oVal.align);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_legendEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_Layout = function (oVal) {
    var oThis = this;
    if (null != oVal.layout) {
        this.bs.WriteItem(c_oserct_layoutMANUALLAYOUT, function () {
            oThis.WriteCT_ManualLayout(oVal.layout);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_layoutEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_ManualLayout = function (oVal) {
    var oThis = this;
    if (null != oVal.layoutTarget) {
        this.bs.WriteItem(c_oserct_manuallayoutLAYOUTTARGET, function () {
            oThis.WriteCT_LayoutTarget(oVal.layoutTarget);
        });
    }
    if (null != oVal.xMode) {
        this.bs.WriteItem(c_oserct_manuallayoutXMODE, function () {
            oThis.WriteCT_LayoutMode(oVal.xMode);
        });
    }
    if (null != oVal.yMode) {
        this.bs.WriteItem(c_oserct_manuallayoutYMODE, function () {
            oThis.WriteCT_LayoutMode(oVal.yMode);
        });
    }
    if (null != oVal.wMode) {
        this.bs.WriteItem(c_oserct_manuallayoutWMODE, function () {
            oThis.WriteCT_LayoutMode(oVal.wMode);
        });
    }
    if (null != oVal.hMode) {
        this.bs.WriteItem(c_oserct_manuallayoutHMODE, function () {
            oThis.WriteCT_LayoutMode(oVal.hMode);
        });
    }
    if (null != oVal.x) {
        this.bs.WriteItem(c_oserct_manuallayoutX, function () {
            oThis.WriteCT_Double(oVal.x);
        });
    }
    if (null != oVal.y) {
        this.bs.WriteItem(c_oserct_manuallayoutY, function () {
            oThis.WriteCT_Double(oVal.y);
        });
    }
    if (null != oVal.w) {
        this.bs.WriteItem(c_oserct_manuallayoutW, function () {
            oThis.WriteCT_Double(oVal.w);
        });
    }
    if (null != oVal.h) {
        this.bs.WriteItem(c_oserct_manuallayoutH, function () {
            oThis.WriteCT_Double(oVal.h);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_manuallayoutEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_LayoutTarget = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case LAYOUT_TARGET_INNER: nVal = st_layouttargetINNER; break;
            case LAYOUT_TARGET_OUTER: nVal = st_layouttargetOUTER; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_layouttargetVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_LayoutMode = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case LAYOUT_MODE_EDGE: nVal = st_layoutmodeEDGE; break;
            case LAYOUT_MODE_FACTOR: nVal = st_layoutmodeFACTOR; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_layoutmodeVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_Double = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_doubleVAL, function () {
            oThis.memory.WriteDouble2(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_DTable = function (oVal) {
    var oThis = this;
    if (null != oVal.showHorzBorder) {
        this.bs.WriteItem(c_oserct_dtableSHOWHORZBORDER, function () {
            oThis.WriteCT_Boolean(oVal.showHorzBorder);
        });
    }
    if (null != oVal.showVertBorder) {
        this.bs.WriteItem(c_oserct_dtableSHOWVERTBORDER, function () {
            oThis.WriteCT_Boolean(oVal.showVertBorder);
        });
    }
    if (null != oVal.showOutline) {
        this.bs.WriteItem(c_oserct_dtableSHOWOUTLINE, function () {
            oThis.WriteCT_Boolean(oVal.showOutline);
        });
    }
    if (null != oVal.showKeys) {
        this.bs.WriteItem(c_oserct_dtableSHOWKEYS, function () {
            oThis.WriteCT_Boolean(oVal.showKeys);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_dtableSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_dtableTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_dtableEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_SerAx = function (oVal) {
    var oThis = this;
    if (null != oVal.axId) {
        this.bs.WriteItem(c_oserct_seraxAXID, function () {
            oThis.WriteCT_UnsignedInt(oVal.axId);
        });
    }
    if (null != oVal.scaling) {
        this.bs.WriteItem(c_oserct_seraxSCALING, function () {
            oThis.WriteCT_Scaling(oVal.scaling);
        });
    }
    if (null != oVal.bDelete) {
        this.bs.WriteItem(c_oserct_seraxDELETE, function () {
            oThis.WriteCT_Boolean(oVal.bDelete);
        });
    }
    if (null != oVal.axPos) {
        this.bs.WriteItem(c_oserct_seraxAXPOS, function () {
            oThis.WriteCT_AxPos(oVal.axPos);
        });
    }
    if (null != oVal.majorGridlines) {
        this.bs.WriteItem(c_oserct_seraxMAJORGRIDLINES, function () {
            oThis.WriteCT_ChartLines(oVal.majorGridlines);
        });
    }
    if (null != oVal.minorGridlines) {
        this.bs.WriteItem(c_oserct_seraxMINORGRIDLINES, function () {
            oThis.WriteCT_ChartLines(oVal.minorGridlines);
        });
    }
   if (null != oVal.title) {
   this.bs.WriteItem(c_oserct_seraxTITLE, function () {
    oThis.WriteCT_Title(oVal.title);
    });
   }
    if (null != oVal.numFmt) {
        this.bs.WriteItem(c_oserct_seraxNUMFMT, function () {
            oThis.WriteCT_NumFmt(oVal.numFmt);
        });
    }
    if (null != oVal.majorTickMark) {
        this.bs.WriteItem(c_oserct_seraxMAJORTICKMARK, function () {
            oThis.WriteCT_TickMark(oVal.majorTickMark);
        });
    }
    if (null != oVal.minorTickMark) {
        this.bs.WriteItem(c_oserct_seraxMINORTICKMARK, function () {
            oThis.WriteCT_TickMark(oVal.minorTickMark);
        });
    }
    if (null != oVal.tickLblPos) {
        this.bs.WriteItem(c_oserct_seraxTICKLBLPOS, function () {
            oThis.WriteCT_TickLblPos(oVal.tickLblPos);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_seraxSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_seraxTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if (null != oVal.crossAx) {
        this.bs.WriteItem(c_oserct_seraxCROSSAX, function () {
            oThis.WriteCT_UnsignedInt(oVal.crossAx.axId);
        });
    }
    if (null != oVal.crosses) {
        this.bs.WriteItem(c_oserct_seraxCROSSES, function () {
            oThis.WriteCT_Crosses(oVal.crosses);
        });
    }
    if (null != oVal.crossesAt) {
        this.bs.WriteItem(c_oserct_seraxCROSSESAT, function () {
            oThis.WriteCT_Double(oVal.crossesAt);
        });
    }
    if (null != oVal.tickLblSkip) {
        this.bs.WriteItem(c_oserct_seraxTICKLBLSKIP, function () {
            oThis.WriteCT_Skip(oVal.tickLblSkip);
        });
    }
    if (null != oVal.tickMarkSkip) {
        this.bs.WriteItem(c_oserct_seraxTICKMARKSKIP, function () {
            oThis.WriteCT_Skip(oVal.tickMarkSkip);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_seraxEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_Scaling = function (oVal) {
    var oThis = this;
    if (null != oVal.logBase) {
        this.bs.WriteItem(c_oserct_scalingLOGBASE, function () {
            oThis.WriteCT_LogBase(oVal.logBase);
        });
    }
    if (null != oVal.orientation) {
        this.bs.WriteItem(c_oserct_scalingORIENTATION, function () {
            oThis.WriteCT_Orientation(oVal.orientation);
        });
    }
    if (null != oVal.max) {
        this.bs.WriteItem(c_oserct_scalingMAX, function () {
            oThis.WriteCT_Double(oVal.max);
        });
    }
    if (null != oVal.min) {
        this.bs.WriteItem(c_oserct_scalingMIN, function () {
            oThis.WriteCT_Double(oVal.min);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_scalingEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_LogBase = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_logbaseVAL, function () {
            oThis.memory.WriteDouble2(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Orientation = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case AscFormat.ORIENTATION_MAX_MIN: nVal = st_orientationMAXMIN; break;
            case AscFormat.ORIENTATION_MIN_MAX: nVal = st_orientationMINMAX; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_orientationVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_AxPos = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case AscFormat.AX_POS_B: nVal = st_axposB; break;
            case AscFormat.AX_POS_L: nVal = st_axposL; break;
            case AscFormat.AX_POS_R: nVal = st_axposR; break;
            case AscFormat.AX_POS_T: nVal = st_axposT; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_axposVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_ChartLines = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_chartlinesSPPR, function () {
            oThis.WriteSpPr(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Title = function (oVal) {
    var oThis = this;
    if (null != oVal.tx) {
        this.bs.WriteItem(c_oserct_titleTX, function () {
            oThis.WriteCT_Tx(oVal.tx);
        });
    }
    this.bs.WriteItem(c_oserct_titleLAYOUT, function () {
        oThis.WriteCT_Layout(oVal);
    });
    if (null != oVal.overlay) {
        this.bs.WriteItem(c_oserct_titleOVERLAY, function () {
            oThis.WriteCT_Boolean(oVal.overlay);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_titleSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_titleTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if (null != oVal.align) {
        this.bs.WriteItem(c_oserct_titleALIGN, function () {
            oThis.memory.WriteByte(oVal.align);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_titleEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_Tx = function (oVal) {
    var oThis = this;
    if (null != oVal.rich) {
        this.bs.WriteItem(c_oserct_txRICH, function () {
            oThis.WriteTxPr(oVal.rich);
        });
    }
    else if (null != oVal.strRef) {
        this.bs.WriteItem(c_oserct_txSTRREF, function () {
            oThis.WriteCT_StrRef(oVal.strRef);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_StrRef = function (oVal) {
    var oThis = this;
    if (null != oVal.f) {
        this.bs.WriteItem(c_oserct_strrefF, function () {
            oThis.memory.WriteString3(oVal.f);
        });
    }
    if (null != oVal.strCache) {
        this.bs.WriteItem(c_oserct_strrefSTRCACHE, function () {
            oThis.WriteCT_StrData(oVal.strCache);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_strrefEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_StrData = function (oVal) {
    var oThis = this;
    if (null != oVal.ptCount) {
        this.bs.WriteItem(c_oserct_strdataPTCOUNT, function () {
            oThis.WriteCT_UnsignedInt(oVal.ptCount);
        });
    }
    if (null != oVal.pts) {
        for (var i = 0, length = oVal.pts.length; i < length; ++i) {
            var oCurVal = oVal.pts[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_strdataPT, function () {
                    oThis.WriteCT_StrVal(oCurVal);
                });
            }
        }
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_strdataEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_StrVal = function (oVal) {
    var oThis = this;
    if (null != oVal.val) {
        this.bs.WriteItem(c_oserct_strvalV, function () {
            oThis.memory.WriteString3(oVal.val);
        });
    }
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_strvalIDX, function () {
            oThis.memory.WriteLong(oVal.idx);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_NumFmt = function (oVal) {
    var oThis = this;
    if (null != oVal.formatCode) {
        this.bs.WriteItem(c_oserct_numfmtFORMATCODE, function () {
            oThis.memory.WriteString3(oVal.formatCode);
        });
    }
    if (null != oVal.sourceLinked) {
        this.bs.WriteItem(c_oserct_numfmtSOURCELINKED, function () {
            oThis.memory.WriteBool(oVal.sourceLinked);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_TickMark = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case c_oAscTickMark.TICK_MARK_CROSS: nVal = st_tickmarkCROSS; break;
            case c_oAscTickMark.TICK_MARK_IN: nVal = st_tickmarkIN; break;
            case c_oAscTickMark.TICK_MARK_NONE: nVal = st_tickmarkNONE; break;
            case c_oAscTickMark.TICK_MARK_OUT: nVal = st_tickmarkOUT; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_tickmarkVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_TickLblPos = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case c_oAscTickLabelsPos.TICK_LABEL_POSITION_HIGH: nVal = st_ticklblposHIGH; break;
            case c_oAscTickLabelsPos.TICK_LABEL_POSITION_LOW: nVal = st_ticklblposLOW; break;
            case c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO: nVal = st_ticklblposNEXTTO; break;
            case c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE: nVal = st_ticklblposNONE; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_ticklblposVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_Crosses = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case AscFormat.CROSSES_AUTO_ZERO: nVal = st_crossesAUTOZERO; break;
            case AscFormat.CROSSES_MAX: nVal = st_crossesMAX; break;
            case AscFormat.CROSSES_MIN: nVal = st_crossesMIN; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_crossesVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_Skip = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_skipVAL, function () {
            oThis.memory.WriteLong(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_TimeUnit = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case AscFormat.TIME_UNIT_DAYS: nVal = st_timeunitDAYS; break;
            case AscFormat.TIME_UNIT_MONTHS: nVal = st_timeunitMONTHS; break;
            case AscFormat.TIME_UNIT_YEARS: nVal = st_timeunitYEARS; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_timeunitVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_DateAx = function (oVal) {
    var oThis = this;
    if (null != oVal.axId) {
        this.bs.WriteItem(c_oserct_dateaxAXID, function () {
            oThis.WriteCT_UnsignedInt(oVal.axId);
        });
    }
    if (null != oVal.scaling) {
        this.bs.WriteItem(c_oserct_dateaxSCALING, function () {
            oThis.WriteCT_Scaling(oVal.scaling);
        });
    }
    if (null != oVal.bDelete) {
        this.bs.WriteItem(c_oserct_dateaxDELETE, function () {
            oThis.WriteCT_Boolean(oVal.bDelete);
        });
    }
    if (null != oVal.axPos) {
        this.bs.WriteItem(c_oserct_dateaxAXPOS, function () {
            oThis.WriteCT_AxPos(oVal.axPos);
        });
    }
    if (null != oVal.majorGridlines) {
        this.bs.WriteItem(c_oserct_dateaxMAJORGRIDLINES, function () {
            oThis.WriteCT_ChartLines(oVal.majorGridlines);
        });
    }
    if (null != oVal.minorGridlines) {
        this.bs.WriteItem(c_oserct_dateaxMINORGRIDLINES, function () {
            oThis.WriteCT_ChartLines(oVal.minorGridlines);
        });
    }
   if (null != oVal.title) {
    this.bs.WriteItem(c_oserct_dateaxTITLE, function () {
        oThis.WriteCT_Title(oVal.title);
        });
   }
    if (null != oVal.numFmt) {
        this.bs.WriteItem(c_oserct_dateaxNUMFMT, function () {
            oThis.WriteCT_NumFmt(oVal.numFmt);
        });
    }
    if (null != oVal.majorTickMark) {
        this.bs.WriteItem(c_oserct_dateaxMAJORTICKMARK, function () {
            oThis.WriteCT_TickMark(oVal.majorTickMark);
        });
    }
    if (null != oVal.minorTickMark) {
        this.bs.WriteItem(c_oserct_dateaxMINORTICKMARK, function () {
            oThis.WriteCT_TickMark(oVal.minorTickMark);
        });
    }
    if (null != oVal.tickLblPos) {
        this.bs.WriteItem(c_oserct_dateaxTICKLBLPOS, function () {
            oThis.WriteCT_TickLblPos(oVal.tickLblPos);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_dateaxSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_dateaxTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if (null != oVal.crossAx) {
        this.bs.WriteItem(c_oserct_dateaxCROSSAX, function () {
            oThis.WriteCT_UnsignedInt(oVal.crossAx.axId);
        });
    }
    if (null != oVal.crosses) {
        this.bs.WriteItem(c_oserct_dateaxCROSSES, function () {
            oThis.WriteCT_Crosses(oVal.crosses);
        });
    }
    if (null != oVal.crossesAt) {
        this.bs.WriteItem(c_oserct_dateaxCROSSESAT, function () {
            oThis.WriteCT_Double(oVal.crossesAt);
        });
    }
    if (null != oVal.auto) {
        this.bs.WriteItem(c_oserct_dateaxAUTO, function () {
            oThis.WriteCT_Boolean(oVal.auto);
        });
    }
    if (null != oVal.lblOffset) {
        this.bs.WriteItem(c_oserct_dateaxLBLOFFSET, function () {
            oThis.WriteCT_LblOffset(oVal.lblOffset);
        });
    }
    if (null != oVal.baseTimeUnit) {
        this.bs.WriteItem(c_oserct_dateaxBASETIMEUNIT, function () {
            oThis.WriteCT_TimeUnit(oVal.baseTimeUnit);
        });
    }
    if (null != oVal.majorUnit) {
        this.bs.WriteItem(c_oserct_dateaxMAJORUNIT, function () {
            oThis.WriteCT_AxisUnit(oVal.majorUnit);
        });
    }
    if (null != oVal.majorTimeUnit) {
        this.bs.WriteItem(c_oserct_dateaxMAJORTIMEUNIT, function () {
            oThis.WriteCT_TimeUnit(oVal.majorTimeUnit);
        });
    }
    if (null != oVal.minorUnit) {
        this.bs.WriteItem(c_oserct_dateaxMINORUNIT, function () {
            oThis.WriteCT_AxisUnit(oVal.minorUnit);
        });
    }
    if (null != oVal.minorTimeUnit) {
        this.bs.WriteItem(c_oserct_dateaxMINORTIMEUNIT, function () {
            oThis.WriteCT_TimeUnit(oVal.minorTimeUnit);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_dateaxEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_LblOffset = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_lbloffsetVAL, function () {
            oThis.memory.WriteString3(oThis.percentToString(oVal, true, false));
        });
    }
};
BinaryChartWriter.prototype.WriteCT_AxisUnit = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_axisunitVAL, function () {
            oThis.memory.WriteDouble2(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_LblAlgn = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case AscFormat.LBL_ALG_CTR: nVal = st_lblalgnCTR; break;
            case AscFormat.LBL_ALG_L: nVal = st_lblalgnL; break;
            case AscFormat.LBL_ALG_R: nVal = st_lblalgnR; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_lblalgnVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_CatAx = function (oVal) {
    //todo ax
    var oThis = this;
    if (null != oVal.axId) {
        this.bs.WriteItem(c_oserct_cataxAXID, function () {
            oThis.WriteCT_UnsignedInt(oVal.axId);
        });
    }
    if (null != oVal.scaling) {
        this.bs.WriteItem(c_oserct_cataxSCALING, function () {
            oThis.WriteCT_Scaling(oVal.scaling);
        });
    }
    if (null != oVal.bDelete) {
        this.bs.WriteItem(c_oserct_cataxDELETE, function () {
            oThis.WriteCT_Boolean(oVal.bDelete);
        });
    }
    if (null != oVal.axPos) {
        this.bs.WriteItem(c_oserct_cataxAXPOS, function () {
            oThis.WriteCT_AxPos(oVal.axPos);
        });
    }
    if (null != oVal.majorGridlines) {
        this.bs.WriteItem(c_oserct_cataxMAJORGRIDLINES, function () {
            oThis.WriteCT_ChartLines(oVal.majorGridlines);
        });
    }
    if (null != oVal.minorGridlines) {
        this.bs.WriteItem(c_oserct_cataxMINORGRIDLINES, function () {
            oThis.WriteCT_ChartLines(oVal.minorGridlines);
        });
    }
     if (null != oVal.title) {
     this.bs.WriteItem(c_oserct_cataxTITLE, function () {
     oThis.WriteCT_Title(oVal.title);
     });
     }
    if (null != oVal.numFmt) {
        this.bs.WriteItem(c_oserct_cataxNUMFMT, function () {
            oThis.WriteCT_NumFmt(oVal.numFmt);
        });
    }
    if (null != oVal.majorTickMark) {
        this.bs.WriteItem(c_oserct_cataxMAJORTICKMARK, function () {
            oThis.WriteCT_TickMark(oVal.majorTickMark);
        });
    }
    if (null != oVal.minorTickMark) {
        this.bs.WriteItem(c_oserct_cataxMINORTICKMARK, function () {
            oThis.WriteCT_TickMark(oVal.minorTickMark);
        });
    }
    if (null != oVal.tickLblPos) {
        this.bs.WriteItem(c_oserct_cataxTICKLBLPOS, function () {
            oThis.WriteCT_TickLblPos(oVal.tickLblPos);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_cataxSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_cataxTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if (null != oVal.crossAx) {
        this.bs.WriteItem(c_oserct_cataxCROSSAX, function () {
            oThis.WriteCT_UnsignedInt(oVal.crossAx.axId);
        });
    }
    if (null != oVal.crosses) {
        this.bs.WriteItem(c_oserct_cataxCROSSES, function () {
            oThis.WriteCT_Crosses(oVal.crosses);
        });
    }
    if (null != oVal.crossesAt) {
        this.bs.WriteItem(c_oserct_cataxCROSSESAT, function () {
            oThis.WriteCT_Double(oVal.crossesAt);
        });
    }
    if (null != oVal.auto) {
        this.bs.WriteItem(c_oserct_cataxAUTO, function () {
            oThis.WriteCT_Boolean(oVal.auto);
        });
    }
    if (null != oVal.lblAlgn) {
        this.bs.WriteItem(c_oserct_cataxLBLALGN, function () {
            oThis.WriteCT_LblAlgn(oVal.lblAlgn);
        });
    }
    if (null != oVal.lblOffset) {
        this.bs.WriteItem(c_oserct_cataxLBLOFFSET, function () {
            oThis.WriteCT_LblOffset(oVal.lblOffset);
        });
    }
    if (null != oVal.tickLblSkip) {
        this.bs.WriteItem(c_oserct_cataxTICKLBLSKIP, function () {
            oThis.WriteCT_Skip(oVal.tickLblSkip);
        });
    }
    if (null != oVal.tickMarkSkip) {
        this.bs.WriteItem(c_oserct_cataxTICKMARKSKIP, function () {
            oThis.WriteCT_Skip(oVal.tickMarkSkip);
        });
    }
    if (null != oVal.noMultiLvlLbl) {
        this.bs.WriteItem(c_oserct_cataxNOMULTILVLLBL, function () {
            oThis.WriteCT_Boolean(oVal.noMultiLvlLbl);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_cataxEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_DispUnitsLbl = function (oVal) {
    var oThis = this;
    this.bs.WriteItem(c_oserct_dispunitslblLAYOUT, function () {
        oThis.WriteCT_Layout(oVal);
    });
    if (null != oVal.tx) {
        this.bs.WriteItem(c_oserct_dispunitslblTX, function () {
            oThis.WriteCT_Tx(oVal.tx);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_dispunitslblSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_dispunitslblTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_BuiltInUnit = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case c_oAscValAxUnits.HUNDREDS: nVal = st_builtinunitHUNDREDS; break;
            case c_oAscValAxUnits.THOUSANDS: nVal = st_builtinunitTHOUSANDS; break;
            case c_oAscValAxUnits.TEN_THOUSANDS: nVal = st_builtinunitTENTHOUSANDS; break;
            case c_oAscValAxUnits.HUNDRED_THOUSANDS: nVal = st_builtinunitHUNDREDTHOUSANDS; break;
            case c_oAscValAxUnits.MILLIONS: nVal = st_builtinunitMILLIONS; break;
            case c_oAscValAxUnits.TEN_MILLIONS: nVal = st_builtinunitTENMILLIONS; break;
            case c_oAscValAxUnits.HUNDRED_MILLIONS: nVal = st_builtinunitHUNDREDMILLIONS; break;
            case c_oAscValAxUnits.BILLIONS: nVal = st_builtinunitBILLIONS; break;
            case c_oAscValAxUnits.TRILLIONS: nVal = st_builtinunitTRILLIONS; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_builtinunitVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_DispUnits = function (oVal) {
    var oThis = this;
    if (null != oVal.builtInUnit) {
        this.bs.WriteItem(c_oserct_dispunitsBUILTINUNIT, function () {
            oThis.WriteCT_BuiltInUnit(oVal.builtInUnit);
        });
    }
    if (null != oVal.custUnit) {
        this.bs.WriteItem(c_oserct_dispunitsCUSTUNIT, function () {
            oThis.WriteCT_Double(oVal.custUnit);
        });
    }
    if (null != oVal.dispUnitsLbl) {
        this.bs.WriteItem(c_oserct_dispunitsDISPUNITSLBL, function () {
            oThis.WriteCT_DispUnitsLbl(oVal.dispUnitsLbl);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_dispunitsEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_CrossBetween = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case AscFormat.CROSS_BETWEEN_BETWEEN: nVal = st_crossbetweenBETWEEN; break;
            case AscFormat.CROSS_BETWEEN_MID_CAT: nVal = st_crossbetweenMIDCAT; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_crossbetweenVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_ValAx = function (oVal) {
    //todo ax
    var oThis = this;
    if (null != oVal.axId) {
        this.bs.WriteItem(c_oserct_valaxAXID, function () {
            oThis.WriteCT_UnsignedInt(oVal.axId);
        });
    }
    if (null != oVal.scaling) {
        this.bs.WriteItem(c_oserct_valaxSCALING, function () {
            oThis.WriteCT_Scaling(oVal.scaling);
        });
    }
    if (null != oVal.bDelete) {
        this.bs.WriteItem(c_oserct_valaxDELETE, function () {
            oThis.WriteCT_Boolean(oVal.bDelete);
        });
    }
    if (null != oVal.axPos) {
        this.bs.WriteItem(c_oserct_valaxAXPOS, function () {
            oThis.WriteCT_AxPos(oVal.axPos);
        });
    }
    if (null != oVal.majorGridlines) {
        this.bs.WriteItem(c_oserct_valaxMAJORGRIDLINES, function () {
            oThis.WriteCT_ChartLines(oVal.majorGridlines);
        });
    }
    if (null != oVal.minorGridlines) {
        this.bs.WriteItem(c_oserct_valaxMINORGRIDLINES, function () {
            oThis.WriteCT_ChartLines(oVal.minorGridlines);
        });
    }
     if (null != oVal.title) {
     this.bs.WriteItem(c_oserct_valaxTITLE, function () {
     oThis.WriteCT_Title(oVal.title);
     });
     }
    if (null != oVal.numFmt) {
        this.bs.WriteItem(c_oserct_valaxNUMFMT, function () {
            oThis.WriteCT_NumFmt(oVal.numFmt);
        });
    }
    if (null != oVal.majorTickMark) {
        this.bs.WriteItem(c_oserct_valaxMAJORTICKMARK, function () {
            oThis.WriteCT_TickMark(oVal.majorTickMark);
        });
    }
    if (null != oVal.minorTickMark) {
        this.bs.WriteItem(c_oserct_valaxMINORTICKMARK, function () {
            oThis.WriteCT_TickMark(oVal.minorTickMark);
        });
    }
    if (null != oVal.tickLblPos) {
        this.bs.WriteItem(c_oserct_valaxTICKLBLPOS, function () {
            oThis.WriteCT_TickLblPos(oVal.tickLblPos);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_valaxSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_valaxTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if (null != oVal.crossAx) {
        this.bs.WriteItem(c_oserct_valaxCROSSAX, function () {
            oThis.WriteCT_UnsignedInt(oVal.crossAx.axId);
        });
    }
    if (null != oVal.crosses) {
        this.bs.WriteItem(c_oserct_valaxCROSSES, function () {
            oThis.WriteCT_Crosses(oVal.crosses);
        });
    }
    if (null != oVal.crossesAt) {
        this.bs.WriteItem(c_oserct_valaxCROSSESAT, function () {
            oThis.WriteCT_Double(oVal.crossesAt);
        });
    }
    if (null != oVal.crossBetween) {
        this.bs.WriteItem(c_oserct_valaxCROSSBETWEEN, function () {
            oThis.WriteCT_CrossBetween(oVal.crossBetween);
        });
    }
    if (null != oVal.majorUnit) {
        this.bs.WriteItem(c_oserct_valaxMAJORUNIT, function () {
            oThis.WriteCT_AxisUnit(oVal.majorUnit);
        });
    }
    if (null != oVal.minorUnit) {
        this.bs.WriteItem(c_oserct_valaxMINORUNIT, function () {
            oThis.WriteCT_AxisUnit(oVal.minorUnit);
        });
    }
    if (null != oVal.dispUnits) {
        this.bs.WriteItem(c_oserct_valaxDISPUNITS, function () {
            oThis.WriteCT_DispUnits(oVal.dispUnits);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_valaxEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_SizeRepresents = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case SIZE_REPRESENTS_AREA: nVal = st_sizerepresentsAREA; break;
            case SIZE_REPRESENTS_W: nVal = st_sizerepresentsW; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_sizerepresentsVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_BubbleScale = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_bubblescaleVAL, function () {
            oThis.memory.WriteString3(oThis.percentToString(oVal, true, false));
        });
    }
};
BinaryChartWriter.prototype.WriteCT_BubbleSer = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_bubbleserIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.order) {
        this.bs.WriteItem(c_oserct_bubbleserORDER, function () {
            oThis.WriteCT_UnsignedInt(oVal.order);
        });
    }
    if (null != oVal.tx && oVal.tx.isValid && oVal.tx.isValid()) {
        this.bs.WriteItem(c_oserct_bubbleserTX, function () {
            oThis.WriteCT_SerTx(oVal.tx);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_bubbleserSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.invertIfNegative) {
        this.bs.WriteItem(c_oserct_bubbleserINVERTIFNEGATIVE, function () {
            oThis.WriteCT_Boolean(oVal.invertIfNegative);
        });
    }
    if (null != oVal.dPt) {
        for (var i = 0, length = oVal.dPt.length; i < length; ++i) {
            var oCurVal = oVal.dPt[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_bubbleserDPT, function () {
                    oThis.WriteCT_DPt(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_bubbleserDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.trendline) {
        this.bs.WriteItem(c_oserct_bubbleserTRENDLINE, function () {
            oThis.WriteCT_Trendline(oVal.trendline);
        });
    }
	for (let nIdx = 0; nIdx < oVal.errBars.length; ++nIdx) {
		this.bs.WriteItem(c_oserct_bubbleserERRBARS, function () {
			oThis.WriteCT_ErrBars(oVal.errBars[nIdx]);
		});
	}
    if (null != oVal.xVal && oVal.xVal.isValid && oVal.xVal.isValid()) {
        this.bs.WriteItem(c_oserct_bubbleserXVAL, function () {
            oThis.WriteCT_AxDataSource(oVal.xVal);
        });
    }
    if (null != oVal.yVal && oVal.yVal.isValid && oVal.yVal.isValid()) {
        this.bs.WriteItem(c_oserct_bubbleserYVAL, function () {
            oThis.WriteCT_NumDataSource(oVal.yVal);
        });
    }
    if (null != oVal.bubbleSize && oVal.bubbleSize.isValid && oVal.bubbleSize.isValid()) {
        this.bs.WriteItem(c_oserct_bubbleserBUBBLESIZE, function () {
            oThis.WriteCT_NumDataSource(oVal.bubbleSize);
        });
    }
    if (null != oVal.bubble3D) {
        this.bs.WriteItem(c_oserct_bubbleserBUBBLE3D, function () {
            oThis.WriteCT_Boolean(oVal.bubble3D);
        });
    }
    if (null != oVal.datalabelsRange) {
        this.bs.WriteItem(c_oserct_chartFiltering, function () {
            oThis.WriteChartFiltering(oVal);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_bubbleserEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_SerTx = function (oVal) {
    var oThis = this;
    if (null != oVal.strRef) {
        this.bs.WriteItem(c_oserct_sertxSTRREF, function () {
            oThis.WriteCT_StrRef(oVal.strRef);
        });
    }
    else if (null != oVal.val) {
        this.bs.WriteItem(c_oserct_sertxV, function () {
            oThis.memory.WriteString3(oVal.val);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_DPt = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_dptIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.invertIfNegative) {
        this.bs.WriteItem(c_oserct_dptINVERTIFNEGATIVE, function () {
            oThis.WriteCT_Boolean(oVal.invertIfNegative);
        });
    }
    if (null != oVal.marker) {
        this.bs.WriteItem(c_oserct_dptMARKER, function () {
            oThis.WriteCT_Marker(oVal.marker);
        });
    }
    if (null != oVal.bubble3D) {
        this.bs.WriteItem(c_oserct_dptBUBBLE3D, function () {
            oThis.WriteCT_Boolean(oVal.bubble3D);
        });
    }
    if (null != oVal.explosion) {
        this.bs.WriteItem(c_oserct_dptEXPLOSION, function () {
            oThis.WriteCT_UnsignedInt(oVal.explosion);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_dptSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.pictureOptions) {
        this.bs.WriteItem(c_oserct_dptPICTUREOPTIONS, function () {
            oThis.WriteCT_PictureOptions(oVal.pictureOptions);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_dptEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_Marker = function (oVal) {
    var oThis = this;
    if (null != oVal.symbol) {
        this.bs.WriteItem(c_oserct_markerSYMBOL, function () {
            oThis.WriteCT_MarkerStyle(oVal.symbol);
        });
    }
    if (null != oVal.size) {
        this.bs.WriteItem(c_oserct_markerSIZE, function () {
            oThis.WriteCT_MarkerSize(oVal.size);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_markerSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_markerEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_MarkerStyle = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case AscFormat.SYMBOL_CIRCLE: nVal = st_markerstyleCIRCLE; break;
            case AscFormat.SYMBOL_DASH: nVal = st_markerstyleDASH; break;
            case AscFormat.SYMBOL_DIAMOND: nVal = st_markerstyleDIAMOND; break;
            case AscFormat.SYMBOL_DOT: nVal = st_markerstyleDOT; break;
            case AscFormat.SYMBOL_NONE: nVal = st_markerstyleNONE; break;
            case AscFormat.SYMBOL_PICTURE: nVal = st_markerstylePICTURE; break;
            case AscFormat.SYMBOL_PLUS: nVal = st_markerstylePLUS; break;
            case AscFormat.SYMBOL_SQUARE: nVal = st_markerstyleSQUARE; break;
            case AscFormat.SYMBOL_STAR: nVal = st_markerstyleSTAR; break;
            case AscFormat.SYMBOL_TRIANGLE: nVal = st_markerstyleTRIANGLE; break;
            case AscFormat.SYMBOL_X: nVal = st_markerstyleX; break;
            // case : nVal = st_markerstyleAUTO; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_markerstyleVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_MarkerSize = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_markersizeVAL, function () {
            oThis.memory.WriteByte(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_PictureOptions = function (oVal) {
    var oThis = this;
    if (null != oVal.applyToFront) {
        this.bs.WriteItem(c_oserct_pictureoptionsAPPLYTOFRONT, function () {
            oThis.WriteCT_Boolean(oVal.applyToFront);
        });
    }
    if (null != oVal.applyToSides) {
        this.bs.WriteItem(c_oserct_pictureoptionsAPPLYTOSIDES, function () {
            oThis.WriteCT_Boolean(oVal.applyToSides);
        });
    }
    if (null != oVal.applyToEnd) {
        this.bs.WriteItem(c_oserct_pictureoptionsAPPLYTOEND, function () {
            oThis.WriteCT_Boolean(oVal.applyToEnd);
        });
    }
    if (null != oVal.pictureFormat) {
        this.bs.WriteItem(c_oserct_pictureoptionsPICTUREFORMAT, function () {
            oThis.WriteCT_PictureFormat(oVal.pictureFormat);
        });
    }
    if (null != oVal.pictureStackUnit) {
        this.bs.WriteItem(c_oserct_pictureoptionsPICTURESTACKUNIT, function () {
            oThis.WriteCT_PictureStackUnit(oVal.pictureStackUnit);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_PictureFormat = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case PICTURE_FORMAT_STACK_STRETCH: nVal = st_pictureformatSTRETCH; break;
            case PICTURE_FORMAT_STACK: nVal = st_pictureformatSTACK; break;
            case PICTURE_FORMAT_STACK_SCALE: nVal = st_pictureformatSTACKSCALE; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_pictureformatVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_PictureStackUnit = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_picturestackunitVAL, function () {
            oThis.memory.WriteDouble2(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_DLbls = function (oVal) {
    var oThis = this;
    if (null != oVal.dLbl) {
        for (var i = 0, length = oVal.dLbl.length; i < length; ++i) {
            var oCurVal = oVal.dLbl[i];
            if (null != oCurVal && null != oCurVal.idx) {
                this.bs.WriteItem(c_oserct_dlblsDLBL, function () {
                    oThis.WriteCT_DLbl(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLblPos) {
        this.bs.WriteItem(c_oserct_dlblsDLBLPOS, function () {
            oThis.WriteCT_DLblPos(oVal.dLblPos);
        });
    }
    if (null != oVal.bDelete) {
        this.bs.WriteItem(c_oserct_dlblsDELETE, function () {
            oThis.WriteCT_Boolean(oVal.bDelete);
        });
    }
    if (null != oVal.leaderLines) {
        this.bs.WriteItem(c_oserct_dlblsLEADERLINES, function () {
            oThis.WriteCT_ChartLines(oVal.leaderLines);
        });
    }
    if (null != oVal.numFmt) {
        this.bs.WriteItem(c_oserct_dlblsNUMFMT, function () {
            oThis.WriteCT_NumFmt(oVal.numFmt);
        });
    }
    if (null != oVal.separator) {
        this.bs.WriteItem(c_oserct_dlblsSEPARATOR, function () {
            oThis.memory.WriteString3(oVal.separator);
        });
    }
    if (null != oVal.showBubbleSize) {
        this.bs.WriteItem(c_oserct_dlblsSHOWBUBBLESIZE, function () {
            oThis.WriteCT_Boolean(oVal.showBubbleSize);
        });
    }
    if (null != oVal.showCatName) {
        this.bs.WriteItem(c_oserct_dlblsSHOWCATNAME, function () {
            oThis.WriteCT_Boolean(oVal.showCatName);
        });
    }
    if (null != oVal.showLeaderLines) {
        this.bs.WriteItem(c_oserct_dlblsSHOWLEADERLINES, function () {
            oThis.WriteCT_Boolean(oVal.showLeaderLines);
        });
    }
    if (null != oVal.showLegendKey) {
        this.bs.WriteItem(c_oserct_dlblsSHOWLEGENDKEY, function () {
            oThis.WriteCT_Boolean(oVal.showLegendKey);
        });
    }
    if (null != oVal.showPercent) {
        this.bs.WriteItem(c_oserct_dlblsSHOWPERCENT, function () {
            oThis.WriteCT_Boolean(oVal.showPercent);
        });
    }
    if (null != oVal.showSerName) {
        this.bs.WriteItem(c_oserct_dlblsSHOWSERNAME, function () {
            oThis.WriteCT_Boolean(oVal.showSerName);
        });
    }
    if (null != oVal.showVal) {
        this.bs.WriteItem(c_oserct_dlblsSHOWVAL, function () {
            oThis.WriteCT_Boolean(oVal.showVal);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_dlblsSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_dlblsTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_dlblsEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_DLbl = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_dlblIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.dLblPos) {
        this.bs.WriteItem(c_oserct_dlblDLBLPOS, function () {
            oThis.WriteCT_DLblPos(oVal.dLblPos);
        });
    }
    if (null != oVal.bDelete) {
        this.bs.WriteItem(c_oserct_dlblDELETE, function () {
            oThis.WriteCT_Boolean(oVal.bDelete);
        });
    }
    this.bs.WriteItem(c_oserct_dlblLAYOUT, function () {
        oThis.WriteCT_Layout(oVal);
    });
    if (null != oVal.numFmt) {
        this.bs.WriteItem(c_oserct_dlblNUMFMT, function () {
            oThis.WriteCT_NumFmt(oVal.numFmt);
        });
    }
    if (null != oVal.separator) {
        this.bs.WriteItem(c_oserct_dlblSEPARATOR, function () {
            oThis.memory.WriteString3(oVal.separator);
        });
    }
    if (null != oVal.showBubbleSize) {
        this.bs.WriteItem(c_oserct_dlblSHOWBUBBLESIZE, function () {
            oThis.WriteCT_Boolean(oVal.showBubbleSize);
        });
    }
    if (null != oVal.showCatName) {
        this.bs.WriteItem(c_oserct_dlblSHOWCATNAME, function () {
            oThis.WriteCT_Boolean(oVal.showCatName);
        });
    }
    if (null != oVal.showLegendKey) {
        this.bs.WriteItem(c_oserct_dlblSHOWLEGENDKEY, function () {
            oThis.WriteCT_Boolean(oVal.showLegendKey);
        });
    }
    if (null != oVal.showPercent) {
        this.bs.WriteItem(c_oserct_dlblSHOWPERCENT, function () {
            oThis.WriteCT_Boolean(oVal.showPercent);
        });
    }
    if (null != oVal.showSerName) {
        this.bs.WriteItem(c_oserct_dlblSHOWSERNAME, function () {
            oThis.WriteCT_Boolean(oVal.showSerName);
        });
    }
    if (null != oVal.showVal) {
        this.bs.WriteItem(c_oserct_dlblSHOWVAL, function () {
            oThis.WriteCT_Boolean(oVal.showVal);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_dlblSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.tx) {
        this.bs.WriteItem(c_oserct_dlblTX, function () {
            oThis.WriteCT_Tx(oVal.tx);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_dlblTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }

	if(null != oVal.showDlblsRange) {
		this.bs.WriteItem(c_oserct_dataLabel, function () {
			oThis.bs.WriteItem(c_oserct_showDataLabelsRange, function () {
				oThis.WriteCT_Boolean(oVal.showDlblsRange);
			});
		});
	}
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_dlblEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_DLblPos = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case c_oAscChartDataLabelsPos.bestFit: nVal = st_dlblposBESTFIT; break;
            case c_oAscChartDataLabelsPos.b: nVal = st_dlblposB; break;
            case c_oAscChartDataLabelsPos.ctr: nVal = st_dlblposCTR; break;
            case c_oAscChartDataLabelsPos.inBase: nVal = st_dlblposINBASE; break;
            case c_oAscChartDataLabelsPos.inEnd: nVal = st_dlblposINEND; break;
            case c_oAscChartDataLabelsPos.l: nVal = st_dlblposL; break;
            case c_oAscChartDataLabelsPos.outEnd: nVal = st_dlblposOUTEND; break;
            case c_oAscChartDataLabelsPos.r: nVal = st_dlblposR; break;
            case c_oAscChartDataLabelsPos.t: nVal = st_dlblposT; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_dlblposVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_Trendline = function (oVal) {
    var oThis = this;
    if (null != oVal.name) {
        this.bs.WriteItem(c_oserct_trendlineNAME, function () {
            oThis.memory.WriteString3(oVal.name);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_trendlineSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.trendlineType) {
        this.bs.WriteItem(c_oserct_trendlineTRENDLINETYPE, function () {
            oThis.WriteCT_TrendlineType(oVal.trendlineType);
        });
    }
    if (null != oVal.order) {
        this.bs.WriteItem(c_oserct_trendlineORDER, function () {
            oThis.WriteCT_Order(oVal.order);
        });
    }
    if (null != oVal.period) {
        this.bs.WriteItem(c_oserct_trendlinePERIOD, function () {
            oThis.WriteCT_Period(oVal.period);
        });
    }
    if (null != oVal.forward) {
        this.bs.WriteItem(c_oserct_trendlineFORWARD, function () {
            oThis.WriteCT_Double(oVal.forward);
        });
    }
    if (null != oVal.backward) {
        this.bs.WriteItem(c_oserct_trendlineBACKWARD, function () {
            oThis.WriteCT_Double(oVal.backward);
        });
    }
    if (null != oVal.intercept) {
        this.bs.WriteItem(c_oserct_trendlineINTERCEPT, function () {
            oThis.WriteCT_Double(oVal.intercept);
        });
    }
    if (null != oVal.dispRSqr) {
        this.bs.WriteItem(c_oserct_trendlineDISPRSQR, function () {
            oThis.WriteCT_Boolean(oVal.dispRSqr);
        });
    }
    if (null != oVal.dispEq) {
        this.bs.WriteItem(c_oserct_trendlineDISPEQ, function () {
            oThis.WriteCT_Boolean(oVal.dispEq);
        });
    }
    if (null != oVal.trendlineLbl) {
        this.bs.WriteItem(c_oserct_trendlineTRENDLINELBL, function () {
            oThis.WriteCT_TrendlineLbl(oVal.trendlineLbl);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_trendlineEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_TrendlineType = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case TRENDLINE_TYPE_EXP: nVal = st_trendlinetypeEXP; break;
            case TRENDLINE_TYPE_LINEAR: nVal = st_trendlinetypeLINEAR; break;
            case TRENDLINE_TYPE_LOG: nVal = st_trendlinetypeLOG; break;
            case TRENDLINE_TYPE_MOVING_AVG: nVal = st_trendlinetypeMOVINGAVG; break;
            case TRENDLINE_TYPE_POLY: nVal = st_trendlinetypePOLY; break;
            case TRENDLINE_TYPE_POWER: nVal = st_trendlinetypePOWER; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_trendlinetypeVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_Order = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_orderVAL, function () {
            oThis.memory.WriteByte(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Period = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_periodVAL, function () {
            oThis.memory.WriteLong(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_TrendlineLbl = function (oVal) {
    var oThis = this;
    this.bs.WriteItem(c_oserct_trendlinelblLAYOUT, function () {
        oThis.WriteCT_Layout(oVal);
    });
    if (null != oVal.tx) {
        this.bs.WriteItem(c_oserct_trendlinelblTX, function () {
            oThis.WriteCT_Tx(oVal.tx);
        });
    }
    if (null != oVal.numFmt) {
        this.bs.WriteItem(c_oserct_trendlinelblNUMFMT, function () {
            oThis.WriteCT_NumFmt(oVal.numFmt);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_trendlinelblSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_trendlinelblTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_trendlinelblEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_ErrBars = function (oVal) {
    var oThis = this;
    if (null != oVal.errDir) {
        this.bs.WriteItem(c_oserct_errbarsERRDIR, function () {
            oThis.WriteCT_ErrDir(oVal.errDir);
        });
    }
    if (null != oVal.errBarType) {
        this.bs.WriteItem(c_oserct_errbarsERRBARTYPE, function () {
            oThis.WriteCT_ErrBarType(oVal.errBarType);
        });
    }
    if (null != oVal.errValType) {
        this.bs.WriteItem(c_oserct_errbarsERRVALTYPE, function () {
            oThis.WriteCT_ErrValType(oVal.errValType);
        });
    }
    if (null != oVal.noEndCap) {
        this.bs.WriteItem(c_oserct_errbarsNOENDCAP, function () {
            oThis.WriteCT_Boolean(oVal.noEndCap);
        });
    }
    if (null != oVal.plus && oVal.plus.isValid && oVal.plus.isValid()) {
        this.bs.WriteItem(c_oserct_errbarsPLUS, function () {
            oThis.WriteCT_NumDataSource(oVal.plus);
        });
    }
    if (null != oVal.minus && oVal.minus.isValid && oVal.minus.isValid()) {
        this.bs.WriteItem(c_oserct_errbarsMINUS, function () {
            oThis.WriteCT_NumDataSource(oVal.minus);
        });
    }
    if (null != oVal.val) {
        this.bs.WriteItem(c_oserct_errbarsVAL, function () {
            oThis.WriteCT_Double(oVal.val);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_errbarsSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_errbarsEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_ErrDir = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case ERR_DIR_X: nVal = st_errdirX; break;
            case ERR_DIR_Y: nVal = st_errdirY; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_errdirVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_ErrBarType = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case ERR_BAR_TYPE_BOTH: nVal = st_errbartypeBOTH; break;
            case ERR_BAR_TYPE_MINUS: nVal = st_errbartypeMINUS; break;
            case ERR_BAR_TYPE_PLUS: nVal = st_errbartypePLUS; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_errbartypeVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_ErrValType = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case ERR_VAL_TYPE_CUST: nVal = st_errvaltypeCUST; break;
            case ERR_VAL_TYPE_FIXED_VAL: nVal = st_errvaltypeFIXEDVAL; break;
            case ERR_VAL_TYPE_PERCENTAGE: nVal = st_errvaltypePERCENTAGE; break;
            case ERR_VAL_TYPE_STD_DEV: nVal = st_errvaltypeSTDDEV; break;
            case ERR_VAL_TYPE_STD_ERR: nVal = st_errvaltypeSTDERR; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_errvaltypeVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_NumDataSource = function (oVal) {
    var oThis = this;
    if (null != oVal.numRef) {
        this.bs.WriteItem(c_oserct_numdatasourceNUMREF, function () {
            oThis.WriteCT_NumRef(oVal.numRef);
        });
    }
    else if (null != oVal.numLit) {
        this.bs.WriteItem(c_oserct_numdatasourceNUMLIT, function () {
            oThis.WriteCT_NumData(oVal.numLit);
        });
    }
}
BinaryChartWriter.prototype.WriteCT_NumData = function (oVal) {
    var oThis = this;
    if (null != oVal.formatCode) {
        this.bs.WriteItem(c_oserct_numdataFORMATCODE, function () {
            oThis.memory.WriteString3(oVal.formatCode);
        });
    }
    if (null != oVal.ptCount) {
        this.bs.WriteItem(c_oserct_numdataPTCOUNT, function () {
            oThis.WriteCT_UnsignedInt(oVal.ptCount);
        });
    }
    if (null != oVal.pts) {
        for (var i = 0, length = oVal.pts.length; i < length; ++i) {
            var oCurVal = oVal.pts[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_numdataPT, function () {
                    oThis.WriteCT_NumVal(oCurVal);
                });
            }
        }
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_numdataEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_NumVal = function (oVal) {
    var oThis = this;
    if (null != oVal.val) {
        this.bs.WriteItem(c_oserct_numvalV, function () {
            oThis.memory.WriteString3(oVal.val);
        });
    }
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_numvalIDX, function () {
            oThis.memory.WriteLong(oVal.idx);
        });
    }
    if (null != oVal.formatCode) {
        this.bs.WriteItem(c_oserct_numvalFORMATCODE, function () {
            oThis.memory.WriteString3(oVal.formatCode);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_NumRef = function (oVal) {
    var oThis = this;
    if (null != oVal.f) {
        this.bs.WriteItem(c_oserct_numrefF, function () {
            oThis.memory.WriteString3(oVal.f);
        });
    }
    if (null != oVal.numCache) {
        this.bs.WriteItem(c_oserct_numrefNUMCACHE, function () {
            oThis.WriteCT_NumData(oVal.numCache);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_numrefEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_AxDataSource = function (oVal) {
    var oThis = this;
    if (null != oVal.multiLvlStrRef) {
        this.bs.WriteItem(c_oserct_axdatasourceMULTILVLSTRREF, function () {
            oThis.WriteCT_MultiLvlStrRef(oVal.multiLvlStrRef);
        });
    }
    else if (null != oVal.numLit) {
        this.bs.WriteItem(c_oserct_axdatasourceNUMLIT, function () {
            oThis.WriteCT_NumData(oVal.numLit);
        });
    }
    else if (null != oVal.numRef) {
        this.bs.WriteItem(c_oserct_axdatasourceNUMREF, function () {
            oThis.WriteCT_NumRef(oVal.numRef);
        });
    }
    else if (null != oVal.strLit) {
        this.bs.WriteItem(c_oserct_axdatasourceSTRLIT, function () {
            oThis.WriteCT_StrData(oVal.strLit);
        });
    }
    else if (null != oVal.strRef) {
        this.bs.WriteItem(c_oserct_axdatasourceSTRREF, function () {
            oThis.WriteCT_StrRef(oVal.strRef);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_MultiLvlStrRef = function (oVal) {
    var oThis = this;
    if (null != oVal.f) {
        this.bs.WriteItem(c_oserct_multilvlstrrefF, function () {
            oThis.memory.WriteString3(oVal.f);
        });
    }
    if (null != oVal.multiLvlStrCache) {
        this.bs.WriteItem(c_oserct_multilvlstrrefMULTILVLSTRCACHE, function () {
            oThis.WriteCT_MultiLvlStrData(oVal.multiLvlStrCache);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_multilvlstrrefEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_lvl = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        for (var i = 0, length =  oVal.pts.length; i < length; ++i) {
            var oCurVal = oVal.pts[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_lvlPT, function () {
                    oThis.WriteCT_StrVal(oCurVal);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_MultiLvlStrData = function (oVal) {
    var oThis = this;
    if (null != oVal.ptCount) {
        this.bs.WriteItem(c_oserct_multilvlstrdataPTCOUNT, function () {
            oThis.WriteCT_UnsignedInt(oVal.ptCount);
        });
    }
    var nLvl;
    for(nLvl = 0; nLvl < oVal.lvl.length; ++nLvl) {
        this.bs.WriteItem(c_oserct_multilvlstrdataLVL, function () {
            oThis.WriteCT_lvl(oVal.lvl[nLvl]);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_multilvlstrdataEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_BubbleChart = function (oVal) {
    var oThis = this;
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_bubblechartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_bubblechartSER, function () {
                    oThis.WriteCT_BubbleSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_bubblechartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.bubble3D) {
        this.bs.WriteItem(c_oserct_bubblechartBUBBLE3D, function () {
            oThis.WriteCT_Boolean(oVal.bubble3D);
        });
    }
    if (null != oVal.bubbleScale) {
        this.bs.WriteItem(c_oserct_bubblechartBUBBLESCALE, function () {
            oThis.WriteCT_BubbleScale(oVal.bubbleScale);
        });
    }
    if (null != oVal.showNegBubbles) {
        this.bs.WriteItem(c_oserct_bubblechartSHOWNEGBUBBLES, function () {
            oThis.WriteCT_Boolean(oVal.showNegBubbles);
        });
    }
    if (null != oVal.sizeRepresents) {
        this.bs.WriteItem(c_oserct_bubblechartSIZEREPRESENTS, function () {
            oThis.WriteCT_SizeRepresents(oVal.sizeRepresents);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_bubblechartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_bubblechartEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_bandFmts = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        for (var i = 0, length = oVal.length; i < length; ++i) {
            var oCurVal = oVal[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_bandfmtsBANDFMT, function () {
                    oThis.WriteCT_BandFmt(oCurVal);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_Surface3DChart = function (oVal) {
    var oThis = this;
    if (null != oVal.wireframe) {
        this.bs.WriteItem(c_oserct_surface3dchartWIREFRAME, function () {
            oThis.WriteCT_Boolean(oVal.wireframe);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_surface3dchartSER, function () {
                    oThis.WriteCT_SurfaceSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.bandFmts && oVal.bandFmts.length > 0) {
        this.bs.WriteItem(c_oserct_surface3dchartBANDFMTS, function () {
            oThis.WriteCT_bandFmts(oVal.bandFmts);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_surface3dchartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_surface3dchartEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_SurfaceSer = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_surfaceserIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.order) {
        this.bs.WriteItem(c_oserct_surfaceserORDER, function () {
            oThis.WriteCT_UnsignedInt(oVal.order);
        });
    }
    if (null != oVal.tx && oVal.tx.isValid && oVal.tx.isValid()) {
        this.bs.WriteItem(c_oserct_surfaceserTX, function () {
            oThis.WriteCT_SerTx(oVal.tx);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_surfaceserSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.cat && oVal.cat.isValid && oVal.cat.isValid()) {
        this.bs.WriteItem(c_oserct_surfaceserCAT, function () {
            oThis.WriteCT_AxDataSource(oVal.cat);
        });
    }
    if (null != oVal.val && oVal.val.isValid && oVal.val.isValid()) {
        this.bs.WriteItem(c_oserct_surfaceserVAL, function () {
            oThis.WriteCT_NumDataSource(oVal.val);
        });
    }
	if
	(null != oVal.datalabelsRange) {
		this.bs.WriteItem(c_oserct_chartFiltering, function () {
			oThis.WriteChartFiltering(oVal);
		});
	}
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_surfaceserEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_BandFmt = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_bandfmtIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_bandfmtSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_SurfaceChart = function (oVal) {
    var oThis = this;
    if (null != oVal.wireframe) {
        this.bs.WriteItem(c_oserct_surfacechartWIREFRAME, function () {
            oThis.WriteCT_Boolean(oVal.wireframe);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_surfacechartSER, function () {
                    oThis.WriteCT_SurfaceSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.bandFmts && oVal.bandFmts.length > 0) {
        this.bs.WriteItem(c_oserct_surfacechartBANDFMTS, function () {
            oThis.WriteCT_bandFmts(oVal.bandFmts);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_surfacechartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_surfacechartEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_SecondPieSize = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_secondpiesizeVAL, function () {
            oThis.memory.WriteString3(oThis.percentToString(oVal, true, false));
        });
    }
};
BinaryChartWriter.prototype.WriteCT_SplitType = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case SPLIT_TYPE_AUTO: nVal = st_splittypeAUTO; break;
            case SPLIT_TYPE_CUST: nVal = st_splittypeCUST; break;
            case SPLIT_TYPE_PERCENT: nVal = st_splittypePERCENT; break;
            case SPLIT_TYPE_POS: nVal = st_splittypePOS; break;
            case SPLIT_TYPE_VAL: nVal = st_splittypeVAL; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_splittypeVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_OfPieType = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case OF_PIE_TYPE_PIE: nVal = st_ofpietypePIE; break;
            case OF_PIE_TYPE_BAR: nVal = st_ofpietypeBAR; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_ofpietypeVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_custSplit = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        for (var i = 0, length = oVal.length; i < length; ++i) {
            var oCurVal = oVal[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_custsplitSECONDPIEPT, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_OfPieChart = function (oVal) {
    var oThis = this;
    if (null != oVal.ofPieType) {
        this.bs.WriteItem(c_oserct_ofpiechartOFPIETYPE, function () {
            oThis.WriteCT_OfPieType(oVal.ofPieType);
        });
    }
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_ofpiechartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_ofpiechartSER, function () {
                    oThis.WriteCT_PieSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_ofpiechartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.gapWidth) {
        this.bs.WriteItem(c_oserct_ofpiechartGAPWIDTH, function () {
            oThis.WriteCT_GapAmount(oVal.gapWidth);
        });
    }
    if (null != oVal.splitType) {
        this.bs.WriteItem(c_oserct_ofpiechartSPLITTYPE, function () {
            oThis.WriteCT_SplitType(oVal.splitType);
        });
    }
    if (null != oVal.splitPos) {
        this.bs.WriteItem(c_oserct_ofpiechartSPLITPOS, function () {
            oThis.WriteCT_Double(oVal.splitPos);
        });
    }
    if (null != oVal.custSplit && oVal.custSplit.length > 0) {
        this.bs.WriteItem(c_oserct_ofpiechartCUSTSPLIT, function () {
            oThis.WriteCT_custSplit(oVal.custSplit);
        });
    }
    if (null != oVal.secondPieSize) {
        this.bs.WriteItem(c_oserct_ofpiechartSECONDPIESIZE, function () {
            oThis.WriteCT_SecondPieSize(oVal.secondPieSize);
        });
    }
    //todo array
    if (null != oVal.serLines) {
        this.bs.WriteItem(c_oserct_ofpiechartSERLINES, function () {
            oThis.WriteCT_ChartLines(oVal.serLines);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_ofpiechartEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_PieSer = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_pieserIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.order) {
        this.bs.WriteItem(c_oserct_pieserORDER, function () {
            oThis.WriteCT_UnsignedInt(oVal.order);
        });
    }
    if (null != oVal.tx && oVal.tx.isValid && oVal.tx.isValid()) {
        this.bs.WriteItem(c_oserct_pieserTX, function () {
            oThis.WriteCT_SerTx(oVal.tx);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_pieserSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.explosion) {
        this.bs.WriteItem(c_oserct_pieserEXPLOSION, function () {
            oThis.WriteCT_UnsignedInt(oVal.explosion);
        });
    }
    if (null != oVal.dPt) {
        for (var i = 0, length = oVal.dPt.length; i < length; ++i) {
            var oCurVal = oVal.dPt[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_pieserDPT, function () {
                    oThis.WriteCT_DPt(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_pieserDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.cat && oVal.cat.isValid && oVal.cat.isValid()) {
        this.bs.WriteItem(c_oserct_pieserCAT, function () {
            oThis.WriteCT_AxDataSource(oVal.cat);
        });
    }
    if (null != oVal.val && oVal.val.isValid && oVal.val.isValid()) {
        this.bs.WriteItem(c_oserct_pieserVAL, function () {
            oThis.WriteCT_NumDataSource(oVal.val);
        });
    }
	if (null != oVal.datalabelsRange) {
		this.bs.WriteItem(c_oserct_chartFiltering, function () {
			oThis.WriteChartFiltering(oVal);
		});
	}
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_pieserEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_GapAmount = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_gapamountVAL, function () {
            oThis.memory.WriteString3(oThis.percentToString(oVal, true, false));
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Bar3DChart = function (oVal) {
    var oThis = this;
    if (null != oVal.barDir) {
        this.bs.WriteItem(c_oserct_bar3dchartBARDIR, function () {
            oThis.WriteCT_BarDir(oVal.barDir);
        });
    }
    if (null != oVal.grouping) {
        this.bs.WriteItem(c_oserct_bar3dchartGROUPING, function () {
            oThis.WriteCT_BarGrouping(oVal.grouping);
        });
    }
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_bar3dchartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_bar3dchartSER, function () {
                    oThis.WriteCT_BarSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_bar3dchartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.gapWidth) {
        this.bs.WriteItem(c_oserct_bar3dchartGAPWIDTH, function () {
            oThis.WriteCT_GapAmount(oVal.gapWidth);
        });
    }
    if (null != oVal.gapDepth) {
        this.bs.WriteItem(c_oserct_bar3dchartGAPDEPTH, function () {
            oThis.WriteCT_GapAmount(oVal.gapDepth);
    });
    }
    if (null != oVal.shape) {
        this.bs.WriteItem(c_oserct_bar3dchartSHAPE, function () {
            oThis.WriteCT_Shape(oVal.shape);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_bar3dchartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_bar3dchartEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_BarDir = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case AscFormat.BAR_DIR_BAR: nVal = st_bardirBAR; break;
            case AscFormat.BAR_DIR_COL: nVal = st_bardirCOL; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_bardirVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_BarGrouping = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case AscFormat.BAR_GROUPING_PERCENT_STACKED: nVal = st_bargroupingPERCENTSTACKED; break;
            case AscFormat.BAR_GROUPING_CLUSTERED: nVal = st_bargroupingCLUSTERED; break;
            case AscFormat.BAR_GROUPING_STANDARD: nVal = st_bargroupingSTANDARD; break;
            case AscFormat.BAR_GROUPING_STACKED: nVal = st_bargroupingSTACKED; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_bargroupingVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteChartFiltering = function(oSer) {
	if(!oSer) {
		return;
	}
	if(oSer.datalabelsRange) {
		let oThis = this;
		this.bs.WriteItem(c_oserct_dataLabelsRange, function () {
			oThis.WriteCT_datalabelsRange(oSer.datalabelsRange);
		});
	}
};
BinaryChartWriter.prototype.WriteCT_datalabelsRange = function(oVal) {
	if(!oVal) {
		return;
	}
	let oThis = this;
	if (null != oVal.f) {
		this.bs.WriteItem(0, function () {
			oThis.memory.WriteString3(oVal.f);
		});
	}
	if (null != oVal.strCache) {
		this.bs.WriteItem(1, function () {
			oThis.WriteCT_StrData(oVal.strCache);
		});
	}
};
BinaryChartWriter.prototype.WriteCT_BarSer = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_barserIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.order) {
        this.bs.WriteItem(c_oserct_barserORDER, function () {
            oThis.WriteCT_UnsignedInt(oVal.order);
        });
    }
    if (null != oVal.tx && oVal.tx.isValid && oVal.tx.isValid()) {
        this.bs.WriteItem(c_oserct_barserTX, function () {
            oThis.WriteCT_SerTx(oVal.tx);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_barserSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.invertIfNegative) {
        this.bs.WriteItem(c_oserct_barserINVERTIFNEGATIVE, function () {
            oThis.WriteCT_Boolean(oVal.invertIfNegative);
        });
    }
    if (null != oVal.pictureOptions) {
        this.bs.WriteItem(c_oserct_barserPICTUREOPTIONS, function () {
            oThis.WriteCT_PictureOptions(oVal.pictureOptions);
        });
    }
    if (null != oVal.dPt) {
        for (var i = 0, length = oVal.dPt.length; i < length; ++i) {
            var oCurVal = oVal.dPt[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_barserDPT, function () {
                    oThis.WriteCT_DPt(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_barserDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    //todo array
    if (null != oVal.trendline) {
        this.bs.WriteItem(c_oserct_barserTRENDLINE, function () {
            oThis.WriteCT_Trendline(oVal.trendline);
        });
    }

	for (let nIdx = 0; nIdx < oVal.errBars.length; ++nIdx) {
		this.bs.WriteItem(c_oserct_barserERRBARS, function () {
			oThis.WriteCT_ErrBars(oVal.errBars[nIdx]);
		});
	}
    if (null != oVal.cat && oVal.cat.isValid && oVal.cat.isValid()) {
        this.bs.WriteItem(c_oserct_barserCAT, function () {
            oThis.WriteCT_AxDataSource(oVal.cat);
        });
    }
    if (null != oVal.val && oVal.val.isValid && oVal.val.isValid()) {
        this.bs.WriteItem(c_oserct_barserVAL, function () {
            oThis.WriteCT_NumDataSource(oVal.val);
        });
    }
    if (null != oVal.shape) {
        this.bs.WriteItem(c_oserct_barserSHAPE, function () {
            oThis.WriteCT_Shape(oVal.shape);
        });
    }
	if (null != oVal.datalabelsRange) {
		this.bs.WriteItem(c_oserct_chartFiltering, function () {
			oThis.WriteChartFiltering(oVal);
		});
	}
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_barserEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_Shape = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case AscFormat.BAR_SHAPE_CONE: nVal = st_shapeCONE; break;
            case AscFormat.BAR_SHAPE_CONETOMAX: nVal = st_shapeCONETOMAX; break;
            case AscFormat.BAR_SHAPE_BOX: nVal = st_shapeBOX; break;
            case AscFormat.BAR_SHAPE_CYLINDER: nVal = st_shapeCYLINDER; break;
            case AscFormat.BAR_SHAPE_PYRAMID: nVal = st_shapePYRAMID; break;
            case AscFormat.BAR_SHAPE_PYRAMIDTOMAX: nVal = st_shapePYRAMIDTOMAX; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_shapeVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_Overlap = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_overlapVAL, function () {
            oThis.memory.WriteString3(oThis.percentToString(oVal, true, false));
        });
    }
};
BinaryChartWriter.prototype.WriteCT_BarChart = function (oVal) {
    var oThis = this;
    if (null != oVal.barDir) {
        this.bs.WriteItem(c_oserct_barchartBARDIR, function () {
            oThis.WriteCT_BarDir(oVal.barDir);
        });
    }
    if (null != oVal.grouping) {
        this.bs.WriteItem(c_oserct_barchartGROUPING, function () {
            oThis.WriteCT_BarGrouping(oVal.grouping);
        });
    }
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_barchartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_barchartSER, function () {
                    oThis.WriteCT_BarSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_barchartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.gapWidth) {
        this.bs.WriteItem(c_oserct_barchartGAPWIDTH, function () {
            oThis.WriteCT_GapAmount(oVal.gapWidth);
        });
    }
    if (null != oVal.overlap) {
        this.bs.WriteItem(c_oserct_barchartOVERLAP, function () {
            oThis.WriteCT_Overlap(oVal.overlap);
        });
    }
    //todo array
    if (null != oVal.serLines) {
        this.bs.WriteItem(c_oserct_barchartSERLINES, function () {
            oThis.WriteCT_ChartLines(oVal.serLines);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_barchartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_barchartEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_HoleSize = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_holesizeVAL, function () {
            oThis.memory.WriteString3(oThis.percentToString(oVal, true, false));
        });
    }
};
BinaryChartWriter.prototype.WriteCT_DoughnutChart = function (oVal) {
    var oThis = this;
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_doughnutchartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_doughnutchartSER, function () {
                    oThis.WriteCT_PieSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_doughnutchartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.firstSliceAng) {
        this.bs.WriteItem(c_oserct_doughnutchartFIRSTSLICEANG, function () {
            oThis.WriteCT_FirstSliceAng(oVal.firstSliceAng);
        });
    }
    if (null != oVal.holeSize) {
        this.bs.WriteItem(c_oserct_doughnutchartHOLESIZE, function () {
            oThis.WriteCT_HoleSize(oVal.holeSize);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_doughnutchartEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_FirstSliceAng = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_firstsliceangVAL, function () {
            oThis.memory.WriteLong(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Pie3DChart = function (oVal) {
    var oThis = this;
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_pie3dchartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_pie3dchartSER, function () {
                    oThis.WriteCT_PieSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_pie3dchartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_pie3dchartEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_PieChart = function (oVal) {
    var oThis = this;
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_piechartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_piechartSER, function () {
                    oThis.WriteCT_PieSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_piechartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.firstSliceAng) {
        this.bs.WriteItem(c_oserct_piechartFIRSTSLICEANG, function () {
            oThis.WriteCT_FirstSliceAng(oVal.firstSliceAng);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_piechartEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_ScatterSer = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_scatterserIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.order) {
        this.bs.WriteItem(c_oserct_scatterserORDER, function () {
            oThis.WriteCT_UnsignedInt(oVal.order);
        });
    }
    if (null != oVal.tx && oVal.tx.isValid && oVal.tx.isValid()) {
        this.bs.WriteItem(c_oserct_scatterserTX, function () {
            oThis.WriteCT_SerTx(oVal.tx);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_scatterserSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.marker) {
        this.bs.WriteItem(c_oserct_scatterserMARKER, function () {
            oThis.WriteCT_Marker(oVal.marker);
        });
    }
    if (null != oVal.dPt) {
        for (var i = 0, length = oVal.dPt.length; i < length; ++i) {
            var oCurVal = oVal.dPt[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_scatterserDPT, function () {
                    oThis.WriteCT_DPt(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_scatterserDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    //todo array
    if (null != oVal.trendline) {
        this.bs.WriteItem(c_oserct_scatterserTRENDLINE, function () {
            oThis.WriteCT_Trendline(oVal.trendline);
        });
    }
	for (let nIdx = 0; nIdx < oVal.errBars.length; ++nIdx) {
		this.bs.WriteItem(c_oserct_scatterserERRBARS, function () {
			oThis.WriteCT_ErrBars(oVal.errBars[nIdx]);
		});
	}
    if (null != oVal.xVal && oVal.xVal.isValid && oVal.xVal.isValid()) {
        this.bs.WriteItem(c_oserct_scatterserXVAL, function () {
            oThis.WriteCT_AxDataSource(oVal.xVal);
        });
    }
    if (null != oVal.yVal && oVal.yVal.isValid && oVal.yVal.isValid()) {
        this.bs.WriteItem(c_oserct_scatterserYVAL, function () {
            oThis.WriteCT_NumDataSource(oVal.yVal);
        });
    }
    if (null != oVal.smooth) {
        this.bs.WriteItem(c_oserct_scatterserSMOOTH, function () {
            oThis.WriteCT_Boolean(oVal.smooth);
        });
    }
	if (null != oVal.datalabelsRange) {
		this.bs.WriteItem(c_oserct_chartFiltering, function () {
			oThis.WriteChartFiltering(oVal);
		});
	}
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_scatterserEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_ScatterStyle = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case AscFormat.SCATTER_STYLE_NONE: nVal = st_scatterstyleNONE; break;
            case AscFormat.SCATTER_STYLE_LINE: nVal = st_scatterstyleLINE; break;
            case AscFormat.SCATTER_STYLE_LINE_MARKER: nVal = st_scatterstyleLINEMARKER; break;
            case AscFormat.SCATTER_STYLE_MARKER: nVal = st_scatterstyleMARKER; break;
            case AscFormat.SCATTER_STYLE_SMOOTH: nVal = st_scatterstyleSMOOTH; break;
            case AscFormat.SCATTER_STYLE_SMOOTH_MARKER: nVal = st_scatterstyleSMOOTHMARKER; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_scatterstyleVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_ScatterChart = function (oVal) {
    var oThis = this;
    if (null != oVal.scatterStyle) {
        this.bs.WriteItem(c_oserct_scatterchartSCATTERSTYLE, function () {
            oThis.WriteCT_ScatterStyle(oVal.scatterStyle);
        });
    }
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_scatterchartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_scatterchartSER, function () {
                    oThis.WriteCT_ScatterSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_scatterchartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_scatterchartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_scatterchartEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_RadarSer = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_radarserIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.order) {
        this.bs.WriteItem(c_oserct_radarserORDER, function () {
            oThis.WriteCT_UnsignedInt(oVal.order);
        });
    }
    if (null != oVal.tx && oVal.tx.isValid && oVal.tx.isValid()) {
        this.bs.WriteItem(c_oserct_radarserTX, function () {
            oThis.WriteCT_SerTx(oVal.tx);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_radarserSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.marker) {
        this.bs.WriteItem(c_oserct_radarserMARKER, function () {
            oThis.WriteCT_Marker(oVal.marker);
        });
    }
    if (null != oVal.dPt) {
        for (var i = 0, length = oVal.dPt.length; i < length; ++i) {
            var oCurVal = oVal.dPt[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_radarserDPT, function () {
                    oThis.WriteCT_DPt(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_radarserDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.cat && oVal.cat.isValid && oVal.cat.isValid()) {
        this.bs.WriteItem(c_oserct_radarserCAT, function () {
            oThis.WriteCT_AxDataSource(oVal.cat);
        });
    }
    if (null != oVal.val && oVal.val.isValid && oVal.val.isValid()) {
        this.bs.WriteItem(c_oserct_radarserVAL, function () {
            oThis.WriteCT_NumDataSource(oVal.val);
        });
    }
	if (null != oVal.datalabelsRange) {
		this.bs.WriteItem(c_oserct_chartFiltering, function () {
			oThis.WriteChartFiltering(oVal);
		});
	}
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_radarserEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_RadarStyle = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case RADAR_STYLE_STANDARD: nVal = st_radarstyleSTANDARD; break;
            case RADAR_STYLE_MARKER: nVal = st_radarstyleMARKER; break;
            case RADAR_STYLE_FILLED: nVal = st_radarstyleFILLED; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_radarstyleVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_RadarChart = function (oVal) {
    var oThis = this;
    if (null != oVal.radarStyle) {
        this.bs.WriteItem(c_oserct_radarchartRADARSTYLE, function () {
            oThis.WriteCT_RadarStyle(oVal.radarStyle);
        });
    }
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_radarchartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_radarchartSER, function () {
                    oThis.WriteCT_RadarSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_radarchartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_radarchartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_radarchartEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_StockChart = function (oVal) {
    var oThis = this;
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_stockchartSER, function () {
                    oThis.WriteCT_LineSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_stockchartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.dropLines) {
        this.bs.WriteItem(c_oserct_stockchartDROPLINES, function () {
            oThis.WriteCT_ChartLines(oVal.dropLines);
        });
    }
    if (null != oVal.hiLowLines) {
        this.bs.WriteItem(c_oserct_stockchartHILOWLINES, function () {
            oThis.WriteCT_ChartLines(oVal.hiLowLines);
        });
    }
    if (null != oVal.upDownBars) {
        this.bs.WriteItem(c_oserct_stockchartUPDOWNBARS, function () {
            oThis.WriteCT_UpDownBars(oVal.upDownBars);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_stockchartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_stockchartEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_LineSer = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_lineserIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.order) {
        this.bs.WriteItem(c_oserct_lineserORDER, function () {
            oThis.WriteCT_UnsignedInt(oVal.order);
        });
    }
    if (null != oVal.tx && oVal.tx.isValid && oVal.tx.isValid()) {
        this.bs.WriteItem(c_oserct_lineserTX, function () {
            oThis.WriteCT_SerTx(oVal.tx);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_lineserSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.marker) {
        this.bs.WriteItem(c_oserct_lineserMARKER, function () {
            oThis.WriteCT_Marker(oVal.marker);
        });
    }
    if (null != oVal.dPt) {
        for (var i = 0, length = oVal.dPt.length; i < length; ++i) {
            var oCurVal = oVal.dPt[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_lineserDPT, function () {
                    oThis.WriteCT_DPt(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_lineserDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    //todo array
    if (null != oVal.trendline) {
        this.bs.WriteItem(c_oserct_lineserTRENDLINE, function () {
            oThis.WriteCT_Trendline(oVal.trendline);
        });
    }
	for (let nIdx = 0; nIdx < oVal.errBars.length; ++nIdx) {
		this.bs.WriteItem(c_oserct_lineserERRBARS, function () {
			oThis.WriteCT_ErrBars(oVal.errBars[nIdx]);
		});
	}
    if (null != oVal.cat && oVal.cat.isValid && oVal.cat.isValid()) {
        this.bs.WriteItem(c_oserct_lineserCAT, function () {
            oThis.WriteCT_AxDataSource(oVal.cat);
        });
    }
    if (null != oVal.val && oVal.val.isValid && oVal.val.isValid()) {
        this.bs.WriteItem(c_oserct_lineserVAL, function () {
            oThis.WriteCT_NumDataSource(oVal.val);
        });
    }
    if (null != oVal.smooth) {
        this.bs.WriteItem(c_oserct_lineserSMOOTH, function () {
            oThis.WriteCT_Boolean(oVal.smooth);
        });
    }

	if (null != oVal.datalabelsRange) {
		this.bs.WriteItem(c_oserct_chartFiltering, function () {
			oThis.WriteChartFiltering(oVal);
		});
	}
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_lineserEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_UpDownBars = function (oVal) {
    var oThis = this;
    if (null != oVal.gapWidth) {
        this.bs.WriteItem(c_oserct_updownbarsGAPWIDTH, function () {
            oThis.WriteCT_GapAmount(oVal.gapWidth);
        });
    }
    if (null != oVal.upBars) {
        this.bs.WriteItem(c_oserct_updownbarsUPBARS, function () {
            oThis.WriteCT_UpDownBar(oVal.upBars);
        });
    }
    if (null != oVal.downBars) {
        this.bs.WriteItem(c_oserct_updownbarsDOWNBARS, function () {
            oThis.WriteCT_UpDownBar(oVal.downBars);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_updownbarsEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_UpDownBar = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_updownbarSPPR, function () {
            oThis.WriteSpPr(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Line3DChart = function (oVal) {
    var oThis = this;
    if (null != oVal.grouping) {
        this.bs.WriteItem(c_oserct_line3dchartGROUPING, function () {
            oThis.WriteCT_Grouping(oVal.grouping);
        });
    }
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_line3dchartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_line3dchartSER, function () {
                    oThis.WriteCT_LineSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_line3dchartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.dropLines) {
        this.bs.WriteItem(c_oserct_line3dchartDROPLINES, function () {
            oThis.WriteCT_ChartLines(oVal.dropLines);
        });
    }
    if (null != oVal.gapDepth) {
        this.bs.WriteItem(c_oserct_line3dchartGAPDEPTH, function () {
            oThis.WriteCT_GapAmount(oVal.gapDepth);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_line3dchartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_line3dchartEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_Grouping = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
            case AscFormat.GROUPING_PERCENT_STACKED: nVal = st_groupingPERCENTSTACKED; break;
            case AscFormat.GROUPING_STANDARD: nVal = st_groupingSTANDARD; break;
            case AscFormat.GROUPING_STACKED: nVal = st_groupingSTACKED; break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_groupingVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_LineChart = function (oVal) {
    var oThis = this;
    if (null != oVal.grouping) {
        this.bs.WriteItem(c_oserct_linechartGROUPING, function () {
            oThis.WriteCT_Grouping(oVal.grouping);
        });
    }
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_linechartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_linechartSER, function () {
                    oThis.WriteCT_LineSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_linechartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.dropLines) {
        this.bs.WriteItem(c_oserct_linechartDROPLINES, function () {
            oThis.WriteCT_ChartLines(oVal.dropLines);
        });
    }
    if (null != oVal.hiLowLines) {
        this.bs.WriteItem(c_oserct_linechartHILOWLINES, function () {
            oThis.WriteCT_ChartLines(oVal.hiLowLines);
        });
    }
    if (null != oVal.upDownBars) {
        this.bs.WriteItem(c_oserct_linechartUPDOWNBARS, function () {
            oThis.WriteCT_UpDownBars(oVal.upDownBars);
        });
    }
    if (null != oVal.marker) {
        this.bs.WriteItem(c_oserct_linechartMARKER, function () {
            oThis.WriteCT_Boolean(oVal.marker);
        });
    }
    if (null != oVal.smooth) {
        this.bs.WriteItem(c_oserct_linechartSMOOTH, function () {
            oThis.WriteCT_Boolean(oVal.smooth);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_linechartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_linechartEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_Area3DChart = function (oVal) {
    var oThis = this;
    if (null != oVal.grouping) {
        this.bs.WriteItem(c_oserct_area3dchartGROUPING, function () {
            oThis.WriteCT_Grouping(oVal.grouping);
        });
    }
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_area3dchartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_area3dchartSER, function () {
                    oThis.WriteCT_AreaSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_area3dchartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.dropLines) {
        this.bs.WriteItem(c_oserct_area3dchartDROPLINES, function () {
            oThis.WriteCT_ChartLines(oVal.dropLines);
        });
    }
    // if (null != oCurVal.gapDepth) {
    // this.bs.WriteItem(c_oserct_area3dchartGAPDEPTH, function () {
    // oThis.WriteCT_GapAmount(oCurVal);
    // });
    // }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_area3dchartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_area3dchartEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_AreaSer = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_areaserIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.order) {
        this.bs.WriteItem(c_oserct_areaserORDER, function () {
            oThis.WriteCT_UnsignedInt(oVal.order);
        });
    }
    if (null != oVal.tx && oVal.tx.isValid && oVal.tx.isValid()) {
        this.bs.WriteItem(c_oserct_areaserTX, function () {
            oThis.WriteCT_SerTx(oVal.tx);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_areaserSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.pictureOptions) {
        this.bs.WriteItem(c_oserct_areaserPICTUREOPTIONS, function () {
            oThis.WriteCT_PictureOptions(oVal.pictureOptions);
        });
    }
    if (null != oVal.dPt) {
        for (var i = 0, length = oVal.dPt.length; i < length; ++i) {
            var oCurVal = oVal.dPt[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_areaserDPT, function () {
                    oThis.WriteCT_DPt(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_areaserDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    //todo array
    if (null != oVal.trendline) {
        this.bs.WriteItem(c_oserct_areaserTRENDLINE, function () {
            oThis.WriteCT_Trendline(oVal.trendline);
        });
    }

	for (let nIdx = 0; nIdx < oVal.errBars.length; ++nIdx) {
		this.bs.WriteItem(c_oserct_areaserERRBARS, function () {
			oThis.WriteCT_ErrBars(oVal.errBars[nIdx]);
		});
	}
    if (null != oVal.cat && oVal.cat.isValid && oVal.cat.isValid()) {
        this.bs.WriteItem(c_oserct_areaserCAT, function () {
            oThis.WriteCT_AxDataSource(oVal.cat);
        });
    }
    if (null != oVal.val && oVal.val.isValid && oVal.val.isValid()) {
        this.bs.WriteItem(c_oserct_areaserVAL, function () {
            oThis.WriteCT_NumDataSource(oVal.val);
        });
    }

	if (null != oVal.datalabelsRange) {
		this.bs.WriteItem(c_oserct_chartFiltering, function () {
			oThis.WriteChartFiltering(oVal);
		});
	}
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_areaserEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_AreaChart = function (oVal) {
    var oThis = this;
    if (null != oVal.grouping) {
        this.bs.WriteItem(c_oserct_areachartGROUPING, function () {
            oThis.WriteCT_Grouping(oVal.grouping);
        });
    }
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_areachartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_areachartSER, function () {
                    oThis.WriteCT_AreaSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_areachartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.dropLines) {
        this.bs.WriteItem(c_oserct_areachartDROPLINES, function () {
            oThis.WriteCT_ChartLines(oVal.dropLines);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_areachartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_areachartEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_PlotArea = function (oVal, oChart) {
    var oThis = this;
    this.bs.WriteItem(c_oserct_plotareaLAYOUT, function () {
        oThis.WriteCT_Layout(oVal);
    });
    for (var i = 0, length = oVal.charts.length; i < length; ++i) {
        var chart = oVal.charts[i];
        if (chart instanceof AscFormat.CAreaChart) {
            this.bs.WriteItem(c_oserct_plotareaAREACHART, function () {
                oThis.WriteCT_AreaChart(chart);
            });
        }
        // else if(chart instanceof CArea3DChart)
        // {
        // this.bs.WriteItem(c_oserct_plotareaAREA3DCHART, function () {
        // oThis.WriteCT_Area3DChart(chart);
        // });
        // }
        else if (chart instanceof AscFormat.CBarChart) {
            if(chart.b3D){
                this.bs.WriteItem(c_oserct_plotareaBAR3DCHART, function () {
                    oThis.WriteCT_Bar3DChart(chart);
                });
            }
            else{
                this.bs.WriteItem(c_oserct_plotareaBARCHART, function () {
                    oThis.WriteCT_BarChart(chart);
                });
            }
        }
        else if (chart instanceof AscFormat.CBubbleChart) {
            this.bs.WriteItem(c_oserct_plotareaBUBBLECHART, function () {
                oThis.WriteCT_BubbleChart(chart);
            });
        }
        else if (chart instanceof AscFormat.CDoughnutChart) {
            this.bs.WriteItem(c_oserct_plotareaDOUGHNUTCHART, function () {
                oThis.WriteCT_DoughnutChart(chart);
            });
        }
        else if (chart instanceof AscFormat.CRadarChart) {
	        this.bs.WriteItem(c_oserct_plotareaRADARCHART, function () {
		        oThis.WriteCT_RadarChart(chart);
	        });
        }
        else if (chart instanceof AscFormat.CLineChart) {
            if(!oChart.view3D) {
                this.bs.WriteItem(c_oserct_plotareaLINECHART, function () {
                    oThis.WriteCT_LineChart(chart);
                });
            }
            else {
                this.bs.WriteItem(c_oserct_plotareaLINE3DCHART, function () {
                oThis.WriteCT_Line3DChart(chart);
                });
            }
        }
        // else if(chart instanceof CLine3DChart)
        // {
        // this.bs.WriteItem(c_oserct_plotareaLINE3DCHART, function () {
        // oThis.WriteCT_Line3DChart(chart);
        // });
        // }
        else if (chart instanceof AscFormat.COfPieChart) {
            this.bs.WriteItem(c_oserct_plotareaOFPIECHART, function () {
                oThis.WriteCT_OfPieChart(chart);
            });
        }
        else if (chart instanceof AscFormat.CPieChart) {
            if(!oChart.view3D && !chart.b3D) {
                this.bs.WriteItem(c_oserct_plotareaPIECHART, function () {
                    oThis.WriteCT_PieChart(chart);
                });
            }
            else{
                this.bs.WriteItem(c_oserct_plotareaPIE3DCHART, function () {
                    oThis.WriteCT_Pie3DChart(chart);
                });
            }
        }
        // else if(chart instanceof CPie3DChart)
        // {
        // this.bs.WriteItem(c_oserct_plotareaPIE3DCHART, function () {
        // oThis.WriteCT_Pie3DChart(chart);
        // });
        // }
        else if (chart instanceof AscFormat.CScatterChart) {
            this.bs.WriteItem(c_oserct_plotareaSCATTERCHART, function () {
                oThis.WriteCT_ScatterChart(chart);
            });
        }
        else if (chart instanceof AscFormat.CStockChart) {
            this.bs.WriteItem(c_oserct_plotareaSTOCKCHART, function () {
                oThis.WriteCT_StockChart(chart);
            });
        }
        else if (chart instanceof AscFormat.CSurfaceChart) {
            this.bs.WriteItem(c_oserct_plotareaSURFACECHART, function () {
                oThis.WriteCT_SurfaceChart(chart);
            });
        }
        // else if(chart instanceof CSurface3DChart)
        // {
        // this.bs.WriteItem(c_oserct_plotareaSURFACE3DCHART, function () {
        // oThis.WriteCT_Surface3DChart(chart);
        // });
        // }
    }
    for (var i = 0, length = oVal.axId.length; i < length; ++i) {
        var axis = oVal.axId[i];
        if (axis instanceof AscFormat.CCatAx) {
            this.bs.WriteItem(c_oserct_plotareaCATAX, function () {
                oThis.WriteCT_CatAx(axis);
            });
        }
        else if (axis instanceof AscFormat.CValAx) {
            this.bs.WriteItem(c_oserct_plotareaVALAX, function () {
                oThis.WriteCT_ValAx(axis);
            });
        }
        else if (axis instanceof AscFormat.CDateAx) {
            this.bs.WriteItem(c_oserct_plotareaDATEAX, function () {
                oThis.WriteCT_DateAx(axis);
            });
        }
        else if (axis instanceof AscFormat.CSerAx) {
            this.bs.WriteItem(c_oserct_plotareaSERAX, function () {
                oThis.WriteCT_SerAx(axis);
            });
        }
    }
    if (null != oVal.dTable) {
        this.bs.WriteItem(c_oserct_plotareaDTABLE, function () {
            oThis.WriteCT_DTable(oVal.dTable);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_plotareaSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.plotAreaRegion) {
        this.bs.WriteItem(c_oserct_plotareaPLOTAREAREGION, function () {
            oThis.WriteCT_PlotAreaRegion(oVal.plotAreaRegion);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_plotareaEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_Thickness = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_thicknessVAL, function () {
            oThis.memory.WriteString3(oThis.percentToString(oVal, true, false));
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Surface = function (oVal) {
    var oThis = this;
    if (null != oVal.thickness) {
        this.bs.WriteItem(c_oserct_surfaceTHICKNESS, function () {
            oThis.WriteCT_Thickness(oVal.thickness);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_surfaceSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.pictureOptions) {
        this.bs.WriteItem(c_oserct_surfacePICTUREOPTIONS, function () {
            oThis.WriteCT_PictureOptions(oVal.pictureOptions);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_surfaceEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_Perspective = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_perspectiveVAL, function () {
            oThis.memory.WriteByte(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_DepthPercent = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_depthpercentVAL, function () {
            oThis.memory.WriteString3(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_RotY = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_rotyVAL, function () {
            oThis.memory.WriteLong(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_HPercent = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_hpercentVAL, function () {
            oThis.memory.WriteString3(oThis.percentToString(oVal, true, false));
        });
    }
};
BinaryChartWriter.prototype.WriteCT_RotX = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_rotxVAL, function () {
            oThis.memory.WriteSByte(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_View3D = function (oVal) {
    var oThis = this;
    if (null != oVal.rotX) {
        this.bs.WriteItem(c_oserct_view3dROTX, function () {
            oThis.WriteCT_RotX(oVal.rotX);
        });
    }
    if (null != oVal.hPercent) {
        this.bs.WriteItem(c_oserct_view3dHPERCENT, function () {
            oThis.WriteCT_HPercent(oVal.hPercent);
        });
    }
    if (null != oVal.rotY) {
        this.bs.WriteItem(c_oserct_view3dROTY, function () {
            oThis.WriteCT_RotY(oVal.rotY);
        });
    }
    if (null != oVal.depthPercent) {
        this.bs.WriteItem(c_oserct_view3dDEPTHPERCENT, function () {
            oThis.WriteCT_DepthPercent(oVal.depthPercent);
        });
    }
    if (null != oVal.rAngAx) {
        this.bs.WriteItem(c_oserct_view3dRANGAX, function () {
            oThis.WriteCT_Boolean(oVal.rAngAx);
        });
    }
    if (null != oVal.perspective) {
        this.bs.WriteItem(c_oserct_view3dPERSPECTIVE, function () {
            oThis.WriteCT_Perspective(oVal.perspective);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_view3dEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_PivotFmt = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_pivotfmtIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_pivotfmtSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_pivotfmtTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if (null != oVal.marker) {
        this.bs.WriteItem(c_oserct_pivotfmtMARKER, function () {
            oThis.WriteCT_Marker(oVal.marker);
        });
    }
    if (null != oVal.dLbl && null != oVal.dLbl.idx) {
        this.bs.WriteItem(c_oserct_pivotfmtDLBL, function () {
            oThis.WriteCT_DLbl(oVal.dLbl);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_pivotfmtEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_pivotFmts = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        for (var i = 0, length = oVal.length; i < length; ++i) {
            var oCurVal = oVal[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_pivotfmtsPIVOTFMT, function () {
                    oThis.WriteCT_PivotFmt(oCurVal);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_Chart = function (oVal) {
    var oThis = this;

    if (null != oVal.title) {
        this.bs.WriteItem(c_oserct_chartTITLE, function () {
            oThis.WriteCT_Title(oVal.title);
        });
    }
    if (null != oVal.autoTitleDeleted) {
        this.bs.WriteItem(c_oserct_chartAUTOTITLEDELETED, function () {
            oThis.WriteCT_Boolean(oVal.autoTitleDeleted);
        });
    }
    if (null != oVal.pivotFmts && oVal.pivotFmts.length > 0) {
        this.bs.WriteItem(c_oserct_chartPIVOTFMTS, function () {
            oThis.WriteCT_pivotFmts(oVal.pivotFmts);
        });
    }
    if (null != oVal.view3D) {
        this.bs.WriteItem(c_oserct_chartVIEW3D, function () {
            oThis.WriteCT_View3D(oVal.view3D);
        });
    }
    if (null != oVal.floor) {
        this.bs.WriteItem(c_oserct_chartFLOOR, function () {
            oThis.WriteCT_Surface(oVal.floor);
        });
    }
    if (null != oVal.sideWall) {
        this.bs.WriteItem(c_oserct_chartSIDEWALL, function () {
            oThis.WriteCT_Surface(oVal.sideWall);
        });
    }
    if (null != oVal.backWall) {
        this.bs.WriteItem(c_oserct_chartBACKWALL, function () {
            oThis.WriteCT_Surface(oVal.backWall);
        });
    }
    if (null != oVal.plotArea) {
        this.bs.WriteItem(c_oserct_chartPLOTAREA, function () {
            oThis.WriteCT_PlotArea(oVal.plotArea, oVal);
        });
    }
    if (null != oVal.legend) {
        this.bs.WriteItem(c_oserct_chartLEGEND, function () {
            oThis.WriteCT_Legend(oVal.legend);
        });
    }
    if (null != oVal.plotVisOnly) {
        this.bs.WriteItem(c_oserct_chartPLOTVISONLY, function () {
            oThis.WriteCT_Boolean(oVal.plotVisOnly);
        });
    }
    if (null != oVal.dispBlanksAs) {
        this.bs.WriteItem(c_oserct_chartDISPBLANKSAS, function () {
            oThis.WriteCT_DispBlanksAs(oVal.dispBlanksAs);
        });
    }
    if (null != oVal.showDLblsOverMax) {
        this.bs.WriteItem(c_oserct_chartSHOWDLBLSOVERMAX, function () {
            oThis.WriteCT_Boolean(oVal.showDLblsOverMax);
        });
    }
    // var oCurVal = oVal.m_extLst;
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_chartEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
};
BinaryChartWriter.prototype.WriteCT_Protection = function (oVal) {
    var oThis = this;
    if (null != oVal.chartObject) {
        this.bs.WriteItem(c_oserct_protectionCHARTOBJECT, function () {
            oThis.WriteCT_Boolean(oVal.chartObject);
        });
    }
    if (null != oVal.data) {
        this.bs.WriteItem(c_oserct_protectionDATA, function () {
            oThis.WriteCT_Boolean(oVal.data);
        });
    }
    if (null != oVal.formatting) {
        this.bs.WriteItem(c_oserct_protectionFORMATTING, function () {
            oThis.WriteCT_Boolean(oVal.formatting);
        });
    }
    if (null != oVal.selection) {
        this.bs.WriteItem(c_oserct_protectionSELECTION, function () {
            oThis.WriteCT_Boolean(oVal.selection);
        });
    }
    if (null != oVal.userInterface) {
        this.bs.WriteItem(c_oserct_protectionUSERINTERFACE, function () {
            oThis.WriteCT_Boolean(oVal.userInterface);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_PivotSource = function (oVal) {
    var oThis = this;
    if (null != oVal.name) {
        this.bs.WriteItem(c_oserct_pivotsourceNAME, function () {
            oThis.memory.WriteString3(oVal.name);
        });
    }
    if (null != oVal.fmtId) {
        this.bs.WriteItem(c_oserct_pivotsourceFMTID, function () {
            oThis.WriteCT_UnsignedInt(oVal.fmtId);
        });
    }
    // if (null != oVal.m_extLst) {
    // for (var i = 0, length = oVal.m_extLst.length; i < length; ++i) {
    // var oCurVal = oVal.m_extLst[i];
    // if (null != oCurVal) {
    // this.bs.WriteItem(c_oserct_pivotsourceEXTLST, function () {
    // oThis.WriteCT_extLst(oCurVal);
    // });
    // }
    // }
    // }
};
BinaryChartWriter.prototype.WriteCT_Style1 = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_style1VAL, function () {
            oThis.memory.WriteByte(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Style = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_styleVAL, function () {
            oThis.memory.WriteByte(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_TextLanguageID = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_textlanguageidVAL, function () {
            oThis.memory.WriteString3(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Axis = function (oVal) {
    var oThis = this;
    if(oVal.axId !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisID, function() {
            oThis.memory.WriteLong(oVal.axId);
        });
    }
    if(oVal.hidden !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisHIDDEN, function() {
            oThis.memory.WriteBool(oVal.hidden);
        });
    }
    if(oVal.scaling !== null) {
        if (oVal.scaling instanceof AscFormat.CCategoryAxisScaling) {
            this.bs.WriteItem(c_oserct_chartExAxisCATSCALING, function() {
                oThis.WriteCT_CategoryAxisScaling(oVal.scaling);
            });
        } else if (oVal.scaling instanceof AscFormat.CValueAxisScaling) {
            this.bs.WriteItem(c_oserct_chartExAxisVALSCALING, function() {
                oThis.WriteCT_ValueAxisScaling(oVal.scaling);
            });
        }
    }
    if(oVal.title !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisTITLE, function() {
            oThis.WriteCT_ChartExTitle(oVal.title);
        });
    }
    if(oVal.units !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisUNIT, function() {
            oThis.WriteCT_AxisUnits(oVal.units);
        });
    }
    if(oVal.numFmt !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisNUMFMT, function() {
            oThis.WriteCT_ChartExNumFmt(oVal.numFmt);
        });
    }
    if(oVal.majorTickMark !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisMAJORTICK, function() {
            oThis.WriteCT_TickMarks(oVal.majorTickMark);
        });
    }
    if(oVal.minorTickMark !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisMINORTICK, function() {
            oThis.WriteCT_TickMarks(oVal.minorTickMark);
        });
    }
    if(oVal.majorGridlines !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisMAJORGRID, function() {
            oThis.WriteCT_Gridlines(oVal.majorGridlines);
        });
    }
    if(oVal.minorGridlines !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisMINORGRID, function() {
            oThis.WriteCT_Gridlines(oVal.minorGridlines);
        });
    }
    if(oVal.tickLabels !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisTICKLABELS, function() {
            oThis.memory.WriteBool(oVal.tickLabels);
        });
    }
    if(oVal.txPr !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisTXPR, function() {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisSPPR, function() {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_ChartData = function (oVal) {
    var oThis = this;
    if (oVal.data !== null) {
        for (var i = 0, length = oVal.data.length; i < length; ++i) {
            var oCurVal = oVal.data[i];
            if (oCurVal !== null) {
                this.bs.WriteItem(c_oserct_chartExDATA, function () {
                    oThis.WriteCT_Data(oCurVal);
                });
            }
        }
    }
    if(oVal.externalData !== null) {
        this.bs.WriteItem(c_oserct_chartExEXTERNALDATA, function() {
            oThis.WriteCT_ChartExExternalData(oVal.externalData);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_ChartExExternalData = function (oVal) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oCurVal = oVal.m_autoUpdate;
    if (oCurVal !== null) {
        this.bs.WriteItem(c_oserct_chartExExternalAUTOUPDATE, function () {
            oThis.WriteCT_Boolean(oCurVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_ChartEx = function (oVal) {
    var oThis = this;
    if(oVal.plotArea !== null) {
        this.bs.WriteItem(c_oserct_chartExChartPLOTAREA, function() {
            oThis.WriteCT_ChartExPlotArea(oVal.plotArea);
        });
    }
    if(oVal.title !== null) {
        this.bs.WriteItem(c_oserct_chartExChartTITLE, function() {
            oThis.WriteCT_ChartExTitle(oVal.title);
        });
    }
    if(oVal.legend !== null) {
        this.bs.WriteItem(c_oserct_chartExChartLEGEND, function() {
            oThis.WriteCT_ChartExLegend(oVal.legend);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_ChartExPlotArea = function (oVal) {
    var oThis = this;
    if(oVal.plotAreaRegion !== null) {
        this.bs.WriteItem(c_oserct_chartExChartAREAREGION, function() {
            oThis.WriteCT_PlotAreaRegion(oVal.plotAreaRegion);
        });
    }
    if (oVal.axId !== null) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (oCurVal !== null) {
                this.bs.WriteItem(c_oserct_chartExChartAXIS, function () {
                    oThis.WriteCT_Axis(oCurVal);
                });
            }
        }
    }
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_chartExChartSPPR, function() {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_PlotAreaRegion = function (oVal) {
    var oThis = this;
    if(oVal.plotSurface !== null) {
        this.bs.WriteItem(c_oserct_chartExAreaPLOTSURFACE, function() {
            oThis.WriteCT_PlotSurface(oVal.plotSurface);
        });
    }
    if (oVal.series !== null) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_chartExAreaSERIES, function () {
                    oThis.WriteCT_Series(oCurVal);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_PlotSurface = function (oVal) {
    var oThis = this;
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_chartExPlotSurfaceSPPR, function() {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_SeriesLayout = function (oVal) {
    var oThis = this;
    var nVal = null;
    switch (oVal) {
        case AscFormat.SERIES_LAYOUT_BOX_WHISKER: nVal = st_serieslayoutBOXWHISKER; break;
        case AscFormat.SERIES_LAYOUT_CLUSTERED_COLUMN: nVal = st_serieslayoutCLUSTEREDCOLUMN; break;
        case AscFormat.SERIES_LAYOUT_FUNNEL: nVal = st_serieslayoutFUNNEL; break;
        case AscFormat.SERIES_LAYOUT_PARETO_LINE: nVal = st_serieslayoutPARETOLINE; break;
        case AscFormat.SERIES_LAYOUT_REGION_MAP: nVal = st_serieslayoutREGIONMAP; break;
        case AscFormat.SERIES_LAYOUT_SUNBURST: nVal = st_serieslayoutSUNBURST; break;
        case AscFormat.SERIES_LAYOUT_TREEMAP: nVal = st_serieslayoutTREEMAP; break;
        case AscFormat.SERIES_LAYOUT_WATERFALL: 
        default: nVal = st_serieslayoutWATERFALL; break;
    }
    oThis.memory.WriteByte(nVal);
};
BinaryChartWriter.prototype.WriteCT_Series = function (oVal) {
    var oThis = this;
    if (oVal.dPt !== null) {
        for (var i = 0, length = oVal.dPt.length; i < length; ++i) {
            var oCurVal = oVal.dPt[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_chartExSeriesDATAPT, function () {
                    oThis.WriteCT_DataPoint(oCurVal);
                });
            }
        }
    }
    if(oVal.dataLabels !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesDATALABELS, function() {
            oThis.WriteCT_DataLabels(oVal.dataLabels);
        });
    }
    if(oVal.layoutPr !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesLAYOUTPROPS, function() {
            oThis.WriteCT_SeriesLayoutProperties(oVal.layoutPr);
        });
    }
    if(oVal.tx !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesTEXT, function() {
            oThis.WriteCT_Text(oVal.tx);
        });
    }
    if (oVal.axisId !== null) {
        for (var i = 0, length = oVal.axisId.length; i < length; ++i) {
            var oCurVal = oVal.axisId[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_chartExSeriesAXIS, function() {
					oThis.memory.WriteLong(oCurVal);
				});
            }
        }
    }
    if(oVal.dataId !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesDATAID, function() {
            oThis.memory.WriteLong(oVal.dataId);
        });
    }
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesSPPR, function() {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if(oVal.layoutId !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesLAYOUTID, function() {
            oThis.WriteCT_SeriesLayout(oVal.layoutId);
        });
    }
    if(oVal.hidden !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesHIDDEN, function() {
            oThis.memory.WriteBool(oVal.hidden);
        });
    }
    if(oVal.ownerIdx !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesOWNERIDX, function() {
            oThis.memory.WriteLong(oVal.ownerIdx);
        });
    }
    if(oVal.formatIdx !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesFORMATIDX, function() {
            oThis.memory.WriteLong(oVal.formatIdx);
        });
    }
    if(oVal.uniqueId !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesUNIQUEID, function() {
            oThis.memory.WriteString3(oVal.uniqueId);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_DataPoint = function (oVal) {
    var oThis = this;
    if(oVal.idx !== null) {
        this.bs.WriteItem(c_oserct_chartExDataPointIDX, function() {
            oThis.memory.WriteLong(oVal.idx);
        });
    }
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_chartExDataPointSPPR, function() {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_DataLabels = function (oVal) {
    var oThis = this;
    if(oVal.pos !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelsPOS, function() {
            oThis.WriteCT_DataLabelPos(oVal.pos);
        });
    }
    if(oVal.numFmt !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelsNUMFMT, function() {
            oThis.WriteCT_ChartExNumFmt(oVal.numFmt);
        });
    }
    if(oVal.txPr !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelsTXPR, function() {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelsSPPR, function() {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if(oVal.visibility !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelsVISABILITIES, function() {
            oThis.WriteCT_DataLabelVisibilities(oVal.visibility);
        });
    }
    if(oVal.separator !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelsSEPARATOR, function() {
            oThis.memory.WriteString3(oVal.separator);
        });
    }
    if (oVal.dataLabel !== null) {
        for (var i = 0, length = oVal.dataLabel.length; i < length; ++i) {
            var oCurVal = oVal.dataLabel[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_chartExDataLabelsDATALABEL, function () {
                    oThis.WriteCT_DataLabel(oCurVal);
                });
            }
        }
    }
    if (oVal.dataLabelHidden !== null) {
        for (var i = 0, length = oVal.dataLabelHidden.length; i < length; ++i) {
            var oCurVal = oVal.dataLabelHidden[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_chartExDataLabelsDATALABELHIDDEN, function () {
                    oThis.WriteCT_DataLabelHidden(oCurVal);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_ChartExNumFmt = function (oVal) {
    var oThis = this;
    if (oVal.formatCode !== null) {
        this.bs.WriteItem(c_oserct_chartExNumberFormatFORMATCODE, function () {
            oThis.memory.WriteString3(oVal.formatCode);
        });
    }
    if (oVal.sourceLinked !== null) {
        this.bs.WriteItem(c_oserct_chartExNumberFormatSOURCELINKED, function () {
            oThis.memory.WriteBool(oVal.sourceLinked);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_DataLabelPos = function (oVal) {
    var oThis = this;
    var nVal = null;
    switch (oVal) {
        case AscFormat.DATA_LABEL_POS_BEST_FIT: nVal = st_datalabelposBESTFIT; break;
        case AscFormat.DATA_LABEL_POS_B: nVal = st_datalabelposB; break;
        case AscFormat.DATA_LABEL_POS_CTR: nVal = st_datalabelposCTR; break;
        case AscFormat.DATA_LABEL_POS_IN_BASE: nVal = st_datalabelposINBASE; break;
        case AscFormat.DATA_LABEL_POS_IN_END: nVal = st_datalabelposINEND; break;
        case AscFormat.DATA_LABEL_POS_L: nVal = st_datalabelposL; break;
        case AscFormat.DATA_LABEL_POS_OUT_END: nVal = st_datalabelposOUTEND; break;
        case AscFormat.DATA_LABEL_POS_R: nVal = st_datalabelposR; break;
        case AscFormat.DATA_LABEL_POS_T:
        default: nVal = st_datalabelposT; break;
    }
    oThis.memory.WriteByte(nVal);
};
BinaryChartWriter.prototype.WriteCT_DataLabel = function (oVal) {
    var oThis = this;
    if(oVal.idx !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelIDX, function() {
            oThis.memory.WriteLong(oVal.idx);
        });
    }
    if(oVal.pos !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelPOS, function() {
            oThis.WriteCT_DataLabelPos(oVal.pos);
        });
    }
    if(oVal.numFmt !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelNUMFMT, function() {
            oThis.WriteCT_ChartExNumFmt(oVal.numFmt);
        });
    }
    if(oVal.txPr !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelTXPR, function() {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelSPPR, function() {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if(oVal.visibility !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelVISABILITIES, function() {
            oThis.WriteCT_DataLabelVisibilities(oVal.visibility);
        });
    }
    if(oVal.separator !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelSEPARATOR, function() {
            oThis.memory.WriteString3(oVal.separator);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_DataLabelHidden = function (oVal) {
    var oThis = this;
    if(oVal.idx !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelHiddenIDX, function() {
            oThis.memory.WriteLong(oVal.idx);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_ParentLabelLayout = function (oVal) {
    var oThis = this;
    var nVal = null;
    switch (oVal) {
        case AscFormat.PARENT_LABEL_LAYOUT_NONE: nVal = st_parentlabellayoutNONE; break;
        case AscFormat.PARENT_LABEL_LAYOUT_BANNER: nVal = st_parentlabellayoutBANNER; break;
        case AscFormat.PARENT_LABEL_LAYOUT_OVERLAPPING:
        default: nVal = st_parentlabellayoutOVERLAPPING; break;
    }
    oThis.memory.WriteByte(nVal);
};
BinaryChartWriter.prototype.WriteCT_RegionLabelLayout = function (oVal) {
    var oThis = this;
    var nVal = null;
    switch (oVal) {
        case AscFormat.REGION_LABEL_LAYOUT_NONE: nVal = st_regionlabellayoutNONE; break;
        case AscFormat.REGION_LABEL_LAYOUT_BEST_FIT_ONLY: nVal = st_regionlabellayoutBESTFITONLY; break;
        case AscFormat.REGION_LABEL_LAYOUT_SHOW_ALL:
        default: nVal = st_regionlabellayoutSHOWALL; break;
    }
    oThis.memory.WriteByte(nVal);
};
BinaryChartWriter.prototype.WriteCT_SeriesLayoutProperties = function (oVal) {
    var oThis = this;
    if(oVal.parentLabelLayout !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesLayoutPARENT, function() {
            oThis.WriteCT_ParentLabelLayout(oVal.parentLabelLayout);
        });
    }
    if(oVal.regionLabelLayout !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesLayoutREGION, function() {
            oThis.WriteCT_RegionLabelLayout(oVal.regionLabelLayout);
        });
    }
    if(oVal.visibility !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesLayoutVISABILITIES, function() {
            oThis.WriteCT_SeriesElementVisibilities(oVal.visibility);
        });
    }
    if(oVal.aggregation !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesLayoutAGGREGATION, function() {
            oThis.memory.WriteBool(oVal.aggregation);
        });
    }
    if(oVal.binning !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesLayoutBINNING, function() {
            oThis.WriteCT_Binning(oVal.binning);
        });
    }
    if(oVal.statistics !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesLayoutSTATISTIC, function() {
            oThis.WriteCT_Statistics(oVal.statistics);
        });
    }
    if(oVal.subtotals !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesLayoutSUBTOTALS, function() {
            oThis.WriteCT_Subtotals(oVal.subtotals);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_DataLabelVisibilities = function (oVal) {
    var oThis = this;
    if(oVal.seriesName !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelVisibilitiesSERIES, function() {
            oThis.memory.WriteBool(oVal.seriesName);
        });
    }
    if(oVal.categoryName !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelVisibilitiesCATEGORY, function() {
            oThis.memory.WriteBool(oVal.categoryName);
        });
    }
    if(oVal.value !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelVisibilitiesVALUE, function() {
            oThis.memory.WriteBool(oVal.value);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_IntervalClosedSide = function (oVal) {
    var oThis = this;
    var nVal = null;
    switch (oVal) {
        case AscFormat.INTERVAL_CLOSED_SIDE_L: nVal = st_intervalclosedsideL; break;
        case AscFormat.INTERVAL_CLOSED_SIDE_R:
        default: nVal = st_intervalclosedsideR; break;
    }
    oThis.memory.WriteByte(nVal);
};
BinaryChartWriter.prototype.WriteCT_Binning = function (oVal) {
    var oThis = this;
    if(oVal.binSize !== null) {
        this.bs.WriteItem(c_oserct_chartExBinningBINSIZE, function() {
            oThis.memory.WriteDouble2(oVal.binSize);
        });
    }
    if(oVal.binCount !== null) {
        this.bs.WriteItem(c_oserct_chartExBinningBINCOUNT, function() {
            oThis.memory.WriteLong(oVal.binCount);
        });
    }
    if(oVal.intervalClosed !== null) {
        this.bs.WriteItem(c_oserct_chartExBinningINTERVAL, function() {
            oThis.WriteCT_IntervalClosedSide(oVal.intervalClosed);
        });
    }
    if(oVal.underflow !== null) {
        if (typeof oVal.underflow === "undefined") {
            this.bs.WriteItem(c_oserct_chartExBinningUNDERAUTO, function() {
                oThis.memory.WriteByte(0);
            });
        } else {
            this.bs.WriteItem(c_oserct_chartExBinningUNDERVAL, function() {
                oThis.memory.WriteDouble2(oVal.underflow);
            });
        }
    }
    if(oVal.overflow !== null) {
        if (typeof oVal.underflow === "undefined") {
            this.bs.WriteItem(c_oserct_chartExBinningOVERAUTO, function() {
                oThis.memory.WriteByte(oVal.overflow);
            });
        } else {
            this.bs.WriteItem(c_oserct_chartExBinningOVERVAL, function() {
                oThis.memory.WriteDouble2(oVal.overflow);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_PosAlign = function (oVal) {
    var oThis = this;
    var nVal = null;
    switch (oVal) {
        case AscFormat.POS_ALIGN_MIN: nVal = st_posalignMIN; break;
        case AscFormat.POS_ALIGN_CTR: nVal = st_posalignCTR; break;
        case AscFormat.POS_ALIGN_MAX:
        default: nVal = st_posalignMAX; break;
    }
    oThis.memory.WriteByte(nVal);
};
BinaryChartWriter.prototype.WriteCT_SidePos = function (oVal) {
    var oThis = this;
    var nVal = null;
    switch (oVal) {
        case AscFormat.SIDE_POS_L: nVal = st_sideposL; break;
        case AscFormat.SIDE_POS_T: nVal = st_sideposT; break;
        case AscFormat.SIDE_POS_R: nVal = st_sideposR; break;
        case AscFormat.SIDE_POS_B:
        default: nVal = st_sideposB; break;
    }
    oThis.memory.WriteByte(nVal);
};
BinaryChartWriter.prototype.WriteCT_ChartExTitle = function (oVal) {
    var oThis = this;
    if(oVal.tx !== null) {
        this.bs.WriteItem(c_oserct_chartExTitleTX, function() {
            oThis.WriteCT_Text(oVal.tx);
        });
    }
    if(oVal.txPr !== null) {
        this.bs.WriteItem(c_oserct_chartExTitleTXPR, function() {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_chartExTitleSPPR, function() {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if(oVal.pos !== null) {
        this.bs.WriteItem(c_oserct_chartExTitlePOS, function() {
            oThis.WriteCT_SidePos(oVal.pos);
        });
    }
    if(oVal.align !== null) {
        this.bs.WriteItem(c_oserct_chartExTitleALIGN, function() {
            oThis.WriteCT_PosAlign(oVal.align);
        });
    }
    // if(oVal.overlay !== null) {
    //     this.bs.WriteItem(c_oserct_chartExTitleOVERLAY, function() {
    //         oThis.memory.WriteBool(oVal.overlay);
    //     });
    // }
};
BinaryChartWriter.prototype.WriteCT_ChartExLegend = function (oVal) {
    var oThis = this;
    if(oVal.txPr !== null) {
        this.bs.WriteItem(c_oserct_chartExLegendTXPR, function() {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_chartExLegendSPPR, function() {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if(oVal.legendPos !== null) {
        this.bs.WriteItem(c_oserct_chartExLegendPOS, function() {
			let nVal = st_legendposT;
			switch (oVal.legendPos) {
				case c_oAscChartLegendShowSettings.bottom: nVal = sideBottom; break;
				case c_oAscChartLegendShowSettings.topRight: nVal = sideRight; break;
				case c_oAscChartLegendShowSettings.left:
				case c_oAscChartLegendShowSettings.leftOverlay:
					nVal = sideLeft; break;
				case c_oAscChartLegendShowSettings.right:
				case c_oAscChartLegendShowSettings.rightOverlay:
					nVal = sideRight; break;
				case c_oAscChartLegendShowSettings.top: nVal = sideTop; break;
			}

            oThis.memory.WriteByte(nVal);
        });
    }
    if(oVal.align !== null) {
        this.bs.WriteItem(c_oserct_chartExLegendALIGN, function() {
            oThis.WriteCT_PosAlign(oVal.align);
        });
    }
    if(oVal.overlay !== null) {
        this.bs.WriteItem(c_oserct_chartExLegendOVERLAY, function() {
            oThis.memory.WriteBool(oVal.overlay);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Text = function (oVal) {
    var oThis = this;
    if(oVal.rich !== null) {
        this.bs.WriteItem(c_oserct_chartExTextRICH, function() {
            oThis.WriteTxPr(oVal.rich);
        });
    }
    if(oVal.txData !== null) {
        this.bs.WriteItem(c_oserct_chartExTextDATA, function() {
            oThis.WriteCT_TextData(oVal.txData);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_TextData = function (oVal) {
    var oThis = this;
    if(oVal.f !== null) {
        this.bs.WriteItem(c_oserct_chartExTextDataFORMULA, function() {
            oThis.WriteCT_Formula(oVal.f);
        });
    }
    if(oVal.v !== null) {
        this.bs.WriteItem(c_oserct_chartExTextDataVALUE, function() {
            oThis.memory.WriteString3(oVal.v);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Data = function (oVal) {
    var oThis = this;
    if(oVal.id !== null) {
        this.bs.WriteItem(c_oserct_chartExDataID, function() {
            oThis.memory.WriteLong(oVal.id);
        });
    }
    if(oVal.dimension !== null) {
        for (var i = 0, length = oVal.dimension.length; i < length; ++i) {
            var oDimension = oVal.dimension[i];
            if (oDimension instanceof AscFormat.CNumericDimension) {
                this.bs.WriteItem(c_oserct_chartExDataNUMDIMENSION, function() {
                    oThis.WriteCT_NumericDimension(oDimension);
                });
            } else {
                this.bs.WriteItem(c_oserct_chartExDataSTRDIMENSION, function() {
                    oThis.WriteCT_StringDimension(oDimension);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_Subtotals = function (oVal) {
    var oThis = this;
    if(oVal.idx !== null) {
        for (var i = 0, length = oVal.idx.length; i < length; ++i) {
            var oCurVal = oVal.idx[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_chartExSubtotalsIDX, function () {
                    oThis.memory.WriteLong(oCurVal);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_SeriesElementVisibilities = function (oVal) {
    var oThis = this;
    if(oVal.connectorLines !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesVisibilitiesCONNECTOR, function() {
            oThis.memory.WriteBool(oVal.connectorLines);
        });
    }
    if(oVal.meanLine !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesVisibilitiesMEANLINE, function() {
            oThis.memory.WriteBool(oVal.meanLine);
        });
    }
    if(oVal.meanMarker !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesVisibilitiesMEANMARKER, function() {
            oThis.memory.WriteBool(oVal.meanMarker);
        });
    }
    if(oVal.nonoutliers !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesVisibilitiesNONOUTLIERS, function() {
            oThis.memory.WriteBool(oVal.nonoutliers);
        });
    }
    if(oVal.outliers !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesVisibilitiesOUTLIERS, function() {
            oThis.memory.WriteBool(oVal.outliers);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_CategoryAxisScaling = function (oVal) {
    var oThis = this;
    if(oVal.gapWidth !== null) {
        if (typeof oVal.gapWidth === "undefined") {
            this.bs.WriteItem(c_oserct_chartExCatScalingGAPAUTO, function() {
                oThis.memory.WriteByte(0);
            });
        } else {
            this.bs.WriteItem(c_oserct_chartExCatScalingGAPVAL, function() {
                oThis.memory.WriteDouble2(oVal.gapWidth);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_ValueAxisScaling = function (oVal) {
    var oThis = this;
    if(oVal.max !== null) {
        if (typeof oVal.max === "undefined") {
            this.bs.WriteItem(c_oserct_chartExValScalingMAXAUTO, function() {
                oThis.memory.WriteByte(oVal.max);
            });
        } else {
            this.bs.WriteItem(c_oserct_chartExValScalingMAXVAL, function() {
                oThis.memory.WriteDouble2(oVal.max);
            });
        }
    }
    if(oVal.min !== null) {
        if (typeof oVal.min === "undefined") {
            this.bs.WriteItem(c_oserct_chartExValScalingMINAUTO, function() {
                oThis.memory.WriteByte(oVal.min);
            });
        } else {
            this.bs.WriteItem(c_oserct_chartExValScalingMINVAL, function() {
                oThis.memory.WriteDouble2(oVal.min);
            });
        }
    }
    if(oVal.majorUnit !== null) {
        if (typeof oVal.majorUnit === "undefined") {
            this.bs.WriteItem(c_oserct_chartExValScalingMAJUNITAUTO, function() {
                oThis.memory.WriteByte(oVal.majorUnit);
            });
        } else {
            this.bs.WriteItem(c_oserct_chartExValScalingMAJUNITVAL, function() {
                oThis.memory.WriteDouble2(oVal.majorUnit);
            });
        }
    }
    if(oVal.minorUnit !== null) {
        if (typeof oVal.minorUnit === "undefined") {
            this.bs.WriteItem(c_oserct_chartExValScalingMINUNITAUTO, function() {
                oThis.memory.WriteByte(oVal.minorUnit);
            });
        } else {
            this.bs.WriteItem(c_oserct_chartExValScalingMINUNITVAL, function() {
                oThis.memory.WriteDouble2(oVal.minorUnit);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_ChartExAxisUnit = function (oVal) {
    var oThis = this;
    var nVal = null;
    switch (oVal) {
        case AscFormat.AXIS_UNIT_HUNDREDS: nVal = st_axisunitHUNDREDS; break;
        case AscFormat.AXIS_UNIT_THOUSANDS: nVal = st_axisunitTHOUSANDS; break;
        case AscFormat.AXIS_UNIT_TEN_THOUSANDS: nVal = st_axisunitTENTHOUSANDS; break;
        case AscFormat.AXIS_UNIT_HUNDRED_THOUSANDS: nVal = st_axisunitHUNDREDTHOUSANDS; break;
        case AscFormat.AXIS_UNIT_MILLIONS: nVal = st_axisunitMILLIONS; break;
        case AscFormat.AXIS_UNIT_TEN_MILLIONS: nVal = st_axisunitTENMILLIONS; break;
        case AscFormat.AXIS_UNIT_HUNDRED_MILLIONS: nVal = st_axisunitHUNDREDMILLIONS; break;
        case AscFormat.AXIS_UNIT_BILLIONS: nVal = st_axisunitBILLIONS; break;
        case AscFormat.AXIS_UNIT_TRILLIONS: nVal = st_axisunitTRILLIONS; break;
        case AscFormat.AXIS_UNIT_PERCENTAGE:
        default: nVal = st_axisunitPERCENTAGE; break;
    }
    oThis.memory.WriteByte(nVal);
};
BinaryChartWriter.prototype.WriteCT_AxisUnits = function (oVal) {
    var oThis = this;
    if(oVal.unitsLabel !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisUnitLABEL, function() {
            oThis.WriteCT_AxisUnitsLabel(oVal.unitsLabel);
        });
    }
    if(oVal.unit !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisUnitTYPE, function() {
            oThis.WriteCT_ChartExAxisUnit(oVal.unit);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_AxisUnitsLabel = function (oVal) {
    var oThis = this;
    if(oVal.tx !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisUnitsLabelTEXT, function() {
            oThis.WriteCT_Text(oVal.tx);
        });
    }
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisUnitsLabelSPPR, function() {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if(oVal.txPr !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisUnitsLabelTXPR, function() {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_TickMarksType = function (oVal) {
    var oThis = this;
    var nVal = null;
    switch (oVal) {
        case AscFormat.TICK_MARKS_TYPE_IN: nVal = st_tickmarkstypeIN; break;
        case AscFormat.TICK_MARKS_TYPE_OUT: nVal = st_tickmarkstypeOUT; break;
        case AscFormat.TICK_MARKS_TYPE_CROSS: nVal = st_tickmarkstypeCROSS; break;
        case AscFormat.TICK_MARKS_TYPE_NONE:
        default: nVal = st_tickmarkstypeNONE; break;
    }
    oThis.memory.WriteByte(nVal);
};
BinaryChartWriter.prototype.WriteCT_TickMarks = function (oVal) {
    var oThis = this;
    if(oVal.type !== null) {
        this.bs.WriteItem(c_oserct_chartExTickMarksTYPE, function() {
            oThis.WriteCT_TickMarksType(oVal.type);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Gridlines = function (oVal) {
    var oThis = this;
    if(oVal !== null) {
        this.bs.WriteItem(c_oserct_chartExGridlinesSPPR, function() {
            oThis.WriteSpPr(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_QuartileMethod = function (oVal) {
    var oThis = this;
    var nVal = null;
    switch (oVal) {
        case AscFormat.QUARTILE_METHOD_INCLUSIVE: nVal = st_quartilemethodINCLUSIVE; break;
        case AscFormat.QUARTILE_METHOD_EXCLUSIVE:
        default: nVal = st_quartilemethodEXCLUSIVE; break;
    }
    oThis.memory.WriteByte(nVal);
};
BinaryChartWriter.prototype.WriteCT_Statistics = function (oVal) {
    var oThis = this;
    if(oVal.quartileMethod !== null) {
        this.bs.WriteItem(c_oserct_chartExStatisticsMETHOD, function() {
            oThis.WriteCT_QuartileMethod(oVal.quartileMethod);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_StringDimensionType = function (oVal) {
    var oThis = this;
    var nVal = null;
    switch (oVal) {
        case AscFormat.STRING_DIMENSION_TYPE_CAT: nVal = st_stringdimensiontypeCAT; break;
        case AscFormat.STRING_DIMENSION_TYPE_COLOR_STR:
        default: nVal = st_stringdimensiontypeCOLORSTR; break;
    }
    oThis.memory.WriteByte(nVal);
};
BinaryChartWriter.prototype.WriteCT_StringDimension = function (oVal) {
    var oThis = this;
    if(oVal.type !== null) {
        this.bs.WriteItem(c_oserct_chartExDataDimensionTYPE, function() {
            oThis.WriteCT_StringDimensionType(oVal.type);
        });
    }
    if(oVal.f !== null) {
        this.bs.WriteItem(c_oserct_chartExDataDimensionFORMULA, function() {
            oThis.WriteCT_Formula(oVal.f);
        });
    }
    if(oVal.nf !== null) {
        this.bs.WriteItem(c_oserct_chartExDataDimensionNF, function() {
            oThis.memory.WriteString3(oVal.nf);
        });
    }
    if(oVal.levelData !== null) {
        for (var i = 0, length = oVal.levelData.length; i < length; ++i) {
            var oCurVal = oVal.levelData[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_chartExDataDimensionSTRINGLEVEL, function () {
                    oThis.WriteCT_StringLevel(oCurVal);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_NumericDimensionType = function (oVal) {
    var oThis = this;
    var nVal = null;
    switch (oVal) {
        case AscFormat.NUMERIC_DIMENSION_TYPE_VAL: nVal = st_numericdimensiontypeVAL; break;
        case AscFormat.NUMERIC_DIMENSION_TYPE_X: nVal = st_numericdimensiontypeX; break;
        case AscFormat.NUMERIC_DIMENSION_TYPE_Y: nVal = st_numericdimensiontypeY; break;
        case AscFormat.NUMERIC_DIMENSION_TYPE_SIZE: nVal = st_numericdimensiontypeSIZE; break;
        case AscFormat.NUMERIC_DIMENSION_TYPE_COLOR_VAL:
        default: nVal = st_numericdimensiontypeCOLORVAL; break;
    }
    oThis.memory.WriteByte(nVal);
};
BinaryChartWriter.prototype.WriteCT_NumericDimension = function (oVal) {
    var oThis = this;
    if(oVal.type !== null) {
        this.bs.WriteItem(c_oserct_chartExDataDimensionTYPE, function() {
            oThis.WriteCT_NumericDimensionType(oVal.type);
        });
    }
    if(oVal.f !== null) {
        this.bs.WriteItem(c_oserct_chartExDataDimensionFORMULA, function() {
            oThis.WriteCT_Formula(oVal.f);
        });
    }
    if(oVal.nf !== null) {
        this.bs.WriteItem(c_oserct_chartExDataDimensionNF, function() {
            oThis.memory.WriteString3(oVal.nf);
        });
    }
    if(oVal.levelData !== null) {
        for (var i = 0, length = oVal.levelData.length; i < length; ++i) {
            var oCurVal = oVal.levelData[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_chartExDataDimensionNUMERICLEVEL, function () {
                    oThis.WriteCT_NumericLevel(oCurVal);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_FormulaDirection = function (oVal) {
    var oThis = this;
    var nVal = null;
    switch (oVal) {
        case AscFormat.FORMULA_DIRECTION_COL: nVal = st_formuladirectionCOL; break;
        case AscFormat.FORMULA_DIRECTION_ROW:
        default: nVal = st_formuladirectionROW; break;
    }
    oThis.memory.WriteByte(nVal);
};
BinaryChartWriter.prototype.WriteCT_Formula = function (oVal) {
    var oThis = this;
    if(oVal.content !== null) {
        this.bs.WriteItem(c_oserct_chartExFormulaCONTENT, function() {
            oThis.memory.WriteString3(oVal.content);
        });
    }
    if(oVal.dir !== null) {
        this.bs.WriteItem(c_oserct_chartExFormulaDIRECTION, function() {
            oThis.WriteCT_FormulaDirection(oVal.dir);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_StringLevel = function (oVal) {
    var oThis = this;
    if(oVal.name !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLevelNAME, function() {
            oThis.memory.WriteString3(oVal.name);
        });
    }
    if(oVal.ptCount !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLevelCOUNT, function() {
            oThis.memory.WriteLong(oVal.ptCount);
        });
    }
	for (var i = 0, length = oVal.pts.length; i < length; ++i) {
		var oCurVal = oVal.pts[i];
		if (null != oCurVal) {
			this.bs.WriteItem(c_oserct_chartExDataLevelPT, function () {
				oThis.WriteCT_StringValue(oCurVal);
			});
		}
	}
};
BinaryChartWriter.prototype.WriteCT_NumericLevel = function (oVal) {
    var oThis = this;
    if(oVal.name !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLevelNAME, function() {
            oThis.memory.WriteString3(oVal.name);
        });
    }
    if(oVal.ptCount !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLevelCOUNT, function() {
            oThis.memory.WriteLong(oVal.ptCount);
        });
    }

	for (var i = 0, length = oVal.pts.length; i < length; ++i) {
		var oCurVal = oVal.pts[i];
		if (null != oCurVal) {
			this.bs.WriteItem(c_oserct_chartExDataLevelPT, function () {
				oThis.WriteCT_NumericValue(oCurVal);
			});
		}
	}
    if(oVal.formatCode !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLevelFORMATCODE, function() {
            oThis.memory.WriteString3(oVal.formatCode);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_StringValue = function (oVal) {
    var oThis = this;
    if(oVal.idx !== null) {
        this.bs.WriteItem(c_oserct_chartExDataValueIDX, function() {
            oThis.memory.WriteLong(oVal.idx);
        });
    }
    if(oVal.val !== null) {
        this.bs.WriteItem(c_oserct_chartExDataValueCONTENT, function() {
            oThis.memory.WriteString3(oVal.val);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_NumericValue = function (oVal) {
    var oThis = this;
    if(oVal.idx !== null) {
        this.bs.WriteItem(c_oserct_chartExDataValueIDX, function() {
            oThis.memory.WriteLong(oVal.idx);
        });
    }
    if(oVal.content !== null) {
        this.bs.WriteItem(c_oserct_chartExDataValueCONTENT, function() {
            oThis.memory.WriteDouble2(oVal.val);
        });
    }
};
BinaryChartWriter.prototype.WriteAlternateContent = function (oVal) {
    var oThis = this;
    if (null != oVal.m_Choice) {
        for (var i = 0, length = oVal.m_Choice.length; i < length; ++i) {
            var oCurVal = oVal.m_Choice[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oseralternatecontentCHOICE, function () {
                    oThis.WriteAlternateContentChoice(oCurVal);
                });
            }
        }
    }
    var oCurVal = oVal.m_Fallback;
    if (null != oCurVal) {
        this.bs.WriteItem(c_oseralternatecontentFALLBACK, function () {
            oThis.WriteAlternateContentFallback(oCurVal);
        });
    }
};
BinaryChartWriter.prototype.WriteAlternateContentChoice = function (oVal) {
    var oThis = this;
    var oCurVal = oVal.m_style;
    if (null != oCurVal) {
        this.bs.WriteItem(c_oseralternatecontentchoiceSTYLE, function () {
            oThis.WriteCT_Style(oCurVal);
        });
    }
    var oCurVal = oVal.m_Requires;
    if (null != oCurVal) {
        this.bs.WriteItem(c_oseralternatecontentchoiceREQUIRES, function () {
            oThis.memory.WriteString3(oCurVal);
        });
    }
};
BinaryChartWriter.prototype.WriteAlternateContentFallback = function (oVal) {
    var oThis = this;
    var oCurVal = oVal.m_style;
    if (null != oCurVal) {
        this.bs.WriteItem(c_oseralternatecontentfallbackSTYLE, function () {
            oThis.WriteCT_Style1(oCurVal);
        });
    }
};
function BinaryChartReader(stream) {
    this.stream = stream;
    this.bcr = new AscCommon.Binary_CommonReader(this.stream);
    this.drawingDocument = null;
}
BinaryChartReader.prototype.ReadCT_extLst = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_extlstEXT === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Extension(t, l, oNewVal);
        });
        if (null == val.m_ext)
            val.m_ext = [];
        val.m_ext.push(oNewVal);
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ExternalReadCT_ChartSpace = function (length, val, curWorksheet) {
    var res = c_oSerConstants.ReadOk;
    this.curWorksheet = curWorksheet;
    this.drawingDocument = null;
    if(this.curWorksheet) {
        if(this.curWorksheet.getDrawingDocument) {
            this.drawingDocument = this.curWorksheet.getDrawingDocument();
        }
        if (!this.drawingDocument && this.curWorksheet.DrawingDocument) {
            this.drawingDocument = this.curWorksheet.DrawingDocument;
        }
    }

    var oThis = this;
    this.curChart = val;
    res = this.bcr.Read1(length, function (t, l) {
        return oThis.ReadCT_ChartSpace(t, l, val);
    });
    if(val){
		val.correctAxes();
        }
    /*if(this.curWorksheet) {
        var aStyles = null;
        var sName = this.curWorksheet.sName;
        if(sName === "Bar") {

            if(!Array.isArray(AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.barNormal"])) {
                AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.barNormal"] = [];
            }
            aStyles = AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.barNormal"];
        }
        else if(sName === "BarStacked") {
            if(!Array.isArray(AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.barStacked"])) {
                AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.barStacked"] = [];
            }
            aStyles = AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.barStacked"];
        }
        else if(sName === "BarStackedPer") {
            if(!Array.isArray(AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.barStackedPer"])) {
                AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.barStackedPer"] = [];
            }
            aStyles = AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.barStackedPer"];
        }
        else if(sName === "3DClusteredColumn") {
            if(!Array.isArray(AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.barNormal3d"])) {
                AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.barNormal3d"] = [];
            }
            aStyles = AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.barNormal3d"];
        }
        else if(sName === "3DStackedColumn") {
            if(!Array.isArray(AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.barStacked3d"])) {
                AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.barStacked3d"] = [];
            }
            aStyles = AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.barStacked3d"];
        }
        else if(sName === "3DStackedColumnPer") {
            if(!Array.isArray(AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.barStackedPer3d"])) {
                AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.barStackedPer3d"] = [];
            }
            aStyles = AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.barStackedPer3d"];
        }
        else if(sName === "3DColumn") {
            if(!Array.isArray(AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.barNormal3dPerspective"])) {
                AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.barNormal3dPerspective"] = [];
            }
            aStyles = AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.barNormal3dPerspective"];
        }
        else if(sName === "2DBar") {
            if(!Array.isArray(AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.hBarNormal"])) {
                AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.hBarNormal"] = [];
            }
            aStyles = AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.hBarNormal"];
        }
        else if(sName === "StackedBar") {
            if(!Array.isArray(AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.hBarStacked"])) {
                AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.hBarStacked"] = [];
            }
            aStyles = AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.hBarStacked"];
        }
        else if(sName === "StackedBarPer") {
            if(!Array.isArray(AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.hBarStackedPer"])) {
                AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.hBarStackedPer"] = [];
            }
            aStyles = AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.hBarStackedPer"];
        }
        else if(sName === "3DClusteredBar") {
            if(!Array.isArray(AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.hBarNormal3d"])) {
                AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.hBarNormal3d"] = [];
            }
            aStyles = AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.hBarNormal3d"];
        }
        else if(sName === "3DStackedBar") {
            if(!Array.isArray(AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.hBarStacked3d"])) {
                AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.hBarStacked3d"] = [];
            }
            aStyles = AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.hBarStacked3d"];
        }
        else if(sName === "Line") {
            if(!Array.isArray(AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.lineNormal"])) {
                AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.lineNormalMarker"] =
                    AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.lineStackedMarker"] =
                        AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.lineStackedPerMarker"] =
                AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.lineNormal"] =
                    AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.lineStacked"] =
                        AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.lineStackedPer"] = [];
            }
            aStyles = AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.lineNormal"];
        }
        else if(sName === "Line3D") {
            if(!Array.isArray(AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.line3d"])) {
                AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.line3d"] = [];
            }
            aStyles = AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.line3d"];
        }
        else if(sName === "Pie") {
            if(!Array.isArray(AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.pie"])) {
                AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.pie"] = [];
            }
            aStyles = AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.pie"];
        }
        else if(sName === "Pie3D") {
            if(!Array.isArray(AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.pie3d"])) {
                AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.pie3d"] = [];
            }
            aStyles = AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.pie3d"];
        }
        else if(sName === "Doughnut") {
            if(!Array.isArray(AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.doughnut"])) {
                AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.doughnut"] = [];
            }
            aStyles = AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.doughnut"];
        }
        else if(sName === "Area") {
            if(!Array.isArray(AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.areaNormal"])) {
                AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.areaNormal"] =
                    AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.areaStacked"] =
                        AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.areaStackedPer"] = [];
            }
            aStyles = AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.areaNormal"];
        }
        else if(sName === "Stock") {
            if(!Array.isArray(AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.stock"])) {
                AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.stock"] = [];
            }
            aStyles = AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.stock"];
        }
        if(sName === "ScatterLine") {
            if(!Array.isArray(AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.scatter"])) {
                AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.scatter"] =
                    AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.scatterLine"] =
                    AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.scatterLineMarker"] =
                    AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.scatterMarker"] =
                    AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.scatterNone"] =
                    AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.scatterSmooth"] =
                    AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.scatterSmoothMarker"] = [];
            }
            aStyles = AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.scatter"];
        }
        else if(sName === "Combo") {
            if(!Array.isArray(AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.comboCustom"])) {
                AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.comboCustom"] =
                    AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.comboBarLine"] =
                    AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.comboBarLineSecondary"] =
                    AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.comboAreaBar"] = [];
            }
            aStyles = AscCommon.g_oChartStyles["Asc.c_oAscChartTypeSettings.comboCustom"];
        }
        if(Array.isArray(aStyles)) {
            if(this.curChart.oDataLablesData) {
                AscCommon.g_oDataLabelsBinaries[this.curChart.oDataLablesData.crc32] = this.curChart.oDataLablesData.data;
            }
            if(this.curChart.oCatAxData) {
                AscCommon.g_oCatBinaries[this.curChart.oCatAxData.crc32] = this.curChart.oCatAxData.data;
            }
            if(this.curChart.oValAxData) {
                AscCommon.g_oValBinaries[this.curChart.oValAxData.crc32] = this.curChart.oValAxData.data;
            }
            if(this.curChart.oView3DData) {
                AscCommon.g_oView3dBinaries[this.curChart.oView3DData.crc32] = this.curChart.oView3DData.data;
            }
            if(this.curChart.oLegendData) {
                AscCommon.g_oLegendBinaries[this.curChart.oLegendData.crc32] = this.curChart.oLegendData.data;
            }
            if(this.curChart.oChartStyleData) {
                AscCommon.g_oStylesBinaries[this.curChart.oChartStyleData.crc32] = this.curChart.oChartStyleData.data;
                AscCommon.g_oChartStylesIdMap[this.curChart.chartStyle.id] = this.curChart.oChartStyleData.crc32;
            }
            if(this.curChart.oChartColorsData) {
                AscCommon.g_oColorsBinaries[this.curChart.oChartColorsData.crc32] = this.curChart.oChartColorsData.data;
            }
            var oBarChart;
            var aCharts = val.chart.plotArea.charts;
            if(aCharts.length === 1 && aCharts[0].getObjectType() === AscDFH.historyitem_type_BarChart) {
                oBarChart = aCharts[0];
            }
            var crc32BarParams = null;
            if(oBarChart) {
                var aBarParams = [];
                aBarParams.push(oBarChart.gapWidth);
                aBarParams.push(oBarChart.overlap);
                aBarParams.push(oBarChart.gapDepth);
                var sJSON = JSON.stringify(aBarParams);
                crc32BarParams = AscCommon.g_oCRC32.Calculate_ByString(sJSON, sJSON.length);
                AscCommon.g_oBarParams[crc32BarParams] = aBarParams;
            }
            aStyles.push([
                val.oChartStyleData && val.oChartStyleData.crc32 || null,
                val.oChartColorsData && val.oChartColorsData.crc32 || null,
                val.oDataLablesData && val.oDataLablesData.crc32 || null,
                val.oCatAxData && val.oCatAxData.crc32 || null,
                val.oValAxData && val.oValAxData.crc32 || null,
                val.oView3DData && val.oView3DData.crc32 || null,
                val.oLegendData && val.oLegendData.crc32 || null,
                crc32BarParams
            ]);
        }
    }*/
    return res;
};
BinaryChartReader.prototype.ExternalReadCT_ChartExSpace = function (length, val, curWorksheet) {
    var res = c_oSerConstants.ReadOk;
    this.curWorksheet = curWorksheet;
    this.drawingDocument = null;
    if(this.curWorksheet) {
        if(this.curWorksheet.getDrawingDocument) {
            this.drawingDocument = this.curWorksheet.getDrawingDocument();
        }
        else {
            if(this.curWorksheet.DrawingDocument) {
                this.drawingDocument = this.curWorksheet.DrawingDocument;
            }
        }
    }

    var oThis = this;
    this.curChart = val;
    res = this.bcr.Read1(length, function (t, l) {
        return oThis.ReadCT_ChartExSpace(t, l, val);
    });
    if(val) {
		val.correctAxes();
	}
    return res;
};
BinaryChartReader.prototype.ReadCT_ChartSpace = function (type, length, val, curWorksheet) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartspaceDATE1904 === type) {
        oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setDate1904(oNewVal.m_val);
        else
            val.setDate1904(true);
    }
    else if (c_oserct_chartspaceLANG === type) {
        oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TextLanguageID(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setLang(oNewVal.m_val);
    }
    else if (c_oserct_chartspaceROUNDEDCORNERS === type) {
        oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setRoundedCorners(oNewVal.m_val);
    }
    else if (c_oserct_chartspaceALTERNATECONTENT === type) {
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadAlternateContent(t, l, oNewVal);
        });
        var nNewStyle = null;
        if (null != oNewVal.m_Choice && oNewVal.m_Choice.length > 0) {
            var choice = oNewVal.m_Choice[0];
            if (null != choice.m_style && null != choice.m_style.m_val)
                nNewStyle = choice.m_style.m_val - 100;
        }
        if (null == nNewStyle && null != oNewVal.m_Fallback && null != oNewVal.m_Fallback.m_style && null != oNewVal.m_Fallback.m_style.m_val)
            nNewStyle = oNewVal.m_Fallback.m_style.m_val;
        if (null != nNewStyle)
            val.setStyle(nNewStyle);
    }
    else if (c_oserct_chartspaceSTYLE === type) {
        oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Style1(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setStyle(oNewVal.m_val);
    }
    else if (c_oserct_chartspaceCLRMAPOVR === type) {
        val.setClrMapOvr(this.ReadClrOverride(length));
    }
    else if (c_oserct_chartspacePIVOTSOURCE === type) {
        oNewVal = new AscFormat.CPivotSource();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PivotSource(t, l, oNewVal);
        });
        val.setPivotSource(oNewVal);
    }
    else if (c_oserct_chartspacePROTECTION === type) {
        oNewVal = new AscFormat.CProtection();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Protection(t, l, oNewVal);
        });
        val.setProtection(oNewVal);
    }
    else if (c_oserct_chartspaceCHART === type) {
        oNewVal = new AscFormat.CChart();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Chart(t, l, oNewVal);
        });
        val.setChart(oNewVal);
        // if(null === oNewVal.autoTitleDeleted){
        //     oNewVal.setAutoTitleDeleted(false);
        // }
        }
    else if (c_oserct_chartspaceSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
        val.spPr.setParent(val);
    }
    else if (c_oserct_chartspaceTXPR === type) {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    //else if (c_oserct_chartspaceEXTERNALDATA === type) {
    //    oNewVal;
    //    oNewVal = {};
    //    res = this.bcr.Read1(length, function (t, l) {
    //        return oThis.ReadCT_ExternalData(t, l, oNewVal);
    //    });
    //    val.m_externalData = oNewVal;
    //}
    else if (c_oserct_chartspacePRINTSETTINGS === type) {
        oNewVal = new AscFormat.CPrintSettings();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PrintSettings(t, l, oNewVal);
        });
        val.setPrintSettings(oNewVal);
    }
    else if (c_oserct_chartspaceUSERSHAPES === type) {
       res = this.bcr.Read1(length, function (t, l) {
           return oThis.ReadCT_UserShapes(t, l, val);
       });
    }
    else if (c_oserct_chartspaceEXTLST === type) {
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else if (c_oserct_chartspaceTHEMEOVERRIDE === type) {
        var theme = AscCommon.pptx_content_loader.ReadTheme(this, this.stream);
        if (null != theme)
            val.setThemeOverride(theme);
    }
    else if(c_oserct_chartspaceXLSX === type) {
        //todo
        res = c_oSerConstants.ReadUnknown;
    }
    else if(c_oserct_chartspaceSTYLES === type) {
        oNewVal = new AscFormat.CChartStyle();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartStyle(t, l, oNewVal);
        });
        if(oNewVal) {
            val.setChartStyle(oNewVal);
        }
    }
    else if(c_oserct_chartspaceCOLORS === type) {
        oNewVal = new AscFormat.CChartColors();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartColors(t, l, oNewVal);
        });
        if(oNewVal) {
            val.setChartColors(oNewVal);
        }
    }
    else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_ChartExSpace = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if(c_oserct_chartExSpaceCHARTDATA === type) 
    {
        oNewVal = new AscFormat.CChartData();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartData(t, l, oNewVal);
        });
        val.setChartData(oNewVal);
    } 
    else if (c_oserct_chartExSpaceCHART === type) {
        oNewVal = new AscFormat.CChart();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartEx(t, l, oNewVal);
        });
        val.setChart(oNewVal);
    } 
    else if (c_oserct_chartExSpaceSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_chartExSpaceTXPR === type) {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    } 
    else if (c_oserct_chartExSpaceCLRMAPOVR === type) {
        val.setClrMapOvr(this.ReadClrOverride(length));
    } 
    // else if(c_oserct_chartExSpaceXLSX === type) {
    //     //todo
    //     res = c_oSerConstants.ReadUnknown;
    // } 
    else if(c_oserct_chartExSpaceCOLORS === type) {
        oNewVal = new AscFormat.CChartColors();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartColors(t, l, oNewVal);
        });
        val.setChartColors(oNewVal);
    } 
    else if(c_oserct_chartExSpaceSTYLES === type) {
        oNewVal = new AscFormat.CChartStyle();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartStyle(t, l, oNewVal);
        });
        val.setChartStyle(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadSpPr = function (length) {
    return AscCommon.pptx_content_loader.ReadShapeProperty(this.stream);
};

BinaryChartReader.prototype.ReadClrOverride = function(lenght)
{
    var loader = new AscCommon.BinaryPPTYLoader();

    loader.stream = new AscCommon.FileStream();
    loader.stream.obj    = this.stream.obj;
    loader.stream.data   = this.stream.data;
    loader.stream.size   = this.stream.size;

    loader.stream.pos    = this.stream.pos;
    loader.stream.cur    = this.stream.cur;
    var s = loader.stream;
    var _main_type = s.GetUChar(); // 0!!!

    var clr_map =  new AscFormat.ClrMap();
    loader.ReadClrMap(clr_map);

    this.stream.pos = s.pos;
    this.stream.cur = s.cur;
    return clr_map;

};

BinaryChartReader.prototype.ReadTxPr = function (length) {
    var cur = this.stream.cur;
    var ret = AscCommon.pptx_content_loader.ReadTextBody(null, this.stream, null, this.curWorksheet, this.drawingDocument);
    this.stream.cur = cur + length;
    return ret;
};
BinaryChartReader.prototype.ParsePersent = function (val) {
    var nVal = parseFloat(val);
    if (!isNaN(nVal))
        return nVal;
    else
        return null;
};
BinaryChartReader.prototype.ParseMetric = function (val) {
    var nVal = parseFloat(val);
    var nRes = null;
    if (!isNaN(nVal)) {
        if (-1 != val.indexOf("mm"))
            nRes = nVal;
        else if (-1 != val.indexOf("cm"))
            nRes = nVal * 10;
        else if (-1 != val.indexOf("in"))
            nRes = nVal * 2.54 * 10;
        else if (-1 != val.indexOf("pt"))
            nRes = nVal * 2.54 * 10 / 72;
        else if (-1 != val.indexOf("pc") || -1 != val.indexOf("pi"))
            nRes = nVal * 12 * 2.54 * 10 / 72;
    }
    return nRes;
};
BinaryChartReader.prototype.CorrectChartWithAxis = function (chartOld, chartNew, aChartWithAxis) {
    for (var i = 0, length = aChartWithAxis.length; i < length; ++i) {
        var item = aChartWithAxis[i];
        if (item.chart == chartOld)
            item.chart = chartNew;
    }
};
BinaryChartReader.prototype.ReadCT_Boolean = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_booleanVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetBool();
        val.m_val = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ExternalReadCT_RelId = function (length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    res = this.bcr.Read1(length, function (t, l) {
        return oThis.ReadCT_RelId(t, l, val);
    });
    return res;
};
BinaryChartReader.prototype.ReadCT_RelId = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_relidID === type) {
        //todo
        var oNewVal;
        oNewVal = this.stream.GetString2LE(length);
        val.m_id = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_UserShapes = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var nCount;
    if (c_oserct_usershapes_COUNT === type) {
        nCount = this.stream.GetULongLE();
    }
    else if(c_oserct_usershapes_SHAPE_REL){
        var oNewVal = new AscFormat.CRelSizeAnchor();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_userShape(t, l, oNewVal);
        });
        val.addUserShape(undefined, oNewVal);
    }
    else if(c_oserct_usershapes_SHAPE_ABS){
        var oNewVal = new AscFormat.CAbsSizeAnchor();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_userShape(t, l, oNewVal);
        });
        val.addUserShape(undefined, oNewVal);
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};

BinaryChartReader.prototype.ReadCT_ChartStyle = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if(c_oserct_chartstyleID === type) {
        val.setId(this.stream.GetULongLE());
    }
    else if (c_oserct_chartstyleENTRY === type) {
        oNewVal = new AscFormat.CStyleEntry();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_StyleEntry(t, l, oNewVal);
        });
        if(res === c_oSerConstants.ReadOk) {
            val.addEntry(oNewVal);
        }
    }
    else if (c_oserct_chartstyleMARKERLAYOUT === type) {
        oNewVal = new AscFormat.CMarkerLayout();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_MarkerLayout(t, l, oNewVal);
        });
        if(res === c_oSerConstants.ReadOk) {
            val.setMarkerLayout(oNewVal);
        }
    }
    else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_StyleEntry = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oNewVal;
    if (c_oserct_chartstyleENTRYTYPE == type)
    {
        val.setType(this.stream.GetUChar());
    }
    else if (c_oserct_chartstyleLNREF == type)
    {
        oNewVal = AscCommon.pptx_content_loader.ReadStyleRef(this, this.stream);
        if(oNewVal)
        {
            val.setLnRef(oNewVal);
        }
    }
    else if (c_oserct_chartstyleFILLREF == type)
    {
        oNewVal = AscCommon.pptx_content_loader.ReadStyleRef(this, this.stream);
        if(oNewVal)
        {
            val.setFillRef(oNewVal);
        }
    }
    else if (c_oserct_chartstyleEFFECTREF == type)
    {
        oNewVal = AscCommon.pptx_content_loader.ReadStyleRef(this, this.stream);
        if(oNewVal)
        {
            val.setEffectRef(oNewVal);
        }
    }
    else if (c_oserct_chartstyleFONTREF == type)
    {
        oNewVal = AscCommon.pptx_content_loader.ReadFontRef(this, this.stream);
        if(oNewVal)
        {
            val.setFontRef(oNewVal);
        }
    }
    else if (c_oserct_chartstyleDEFPR == type)
    {
        oNewVal = AscCommon.pptx_content_loader.ReadRunProperties(this.stream, 0);
        if(oNewVal)
        {
            val.setDefRPr(oNewVal);
        }
    }
    else if (c_oserct_chartstyleBODYPR == type)
    {
        oNewVal = AscCommon.pptx_content_loader.ReadBodyPr(this, this.stream);
        if(oNewVal)
        {
            val.setBodyPr(oNewVal);
        }
    }
    else if (c_oserct_chartstyleSPPR == type)
    {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_chartstyleLINEWIDTH == type)
    {
        val.setLineWidthScale(this.stream.GetDoubleLE());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_MarkerLayout = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_chartstyleMARKERSYMBOL == type)
    {
        val.setSymbol(this.MarkerStyleToFormat(this.stream.GetUChar()));
    }
    else if (c_oserct_chartstyleMARKERSIZE == type)
    {
        val.setSize(this.stream.GetULongLE());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_ChartColors = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartcolorsID === type)
    {
        val.setId(this.stream.GetULongLE());
    }
    else if (c_oserct_chartcolorsMETH === type)
    {
        val.setMeth(this.stream.GetString2LE(length));
    }
    else if(c_oserct_chartcolorsVARIATION === type)
    {
        oNewVal = new AscFormat.CColorModifiers();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ColorsVariation(t, l, oNewVal);
        });
        val.addItem(oNewVal);
    }
    else if(c_oserct_chartcolorsCOLOR === type)
    {
        oNewVal = AscCommon.pptx_content_loader.ReadUniColor(this, this.stream);
        if(oNewVal)
        {
            val.addItem(oNewVal);
        }
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_ColorsVariation = function (type, length, val)
{
    var res = c_oSerConstants.ReadOk;
    if (c_oserct_chartcolorsEFFECT === type)
    {
        var oMod = AscCommon.pptx_content_loader.ReadColorMod(this, this.stream);
        if(oMod)
        {
            val.addMod(oMod);
        }
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

BinaryChartReader.prototype.ReadCT_FromTo = function(type, length, poResult)
{
    var res = c_oSerConstants.ReadOk;
    if(Asc.c_oSer_DrawingPosType.X == type)
    {
        poResult.x = this.stream.GetDoubleLE();
    }
    else if(Asc.c_oSer_DrawingPosType.Y == type)
    {
        poResult.y = this.stream.GetDoubleLE();
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_userShape = function(type, length, poResult)
{
    var oThis = this;

    var res = c_oSerConstants.ReadOk;
    if(Asc.c_oSer_DrawingType.From == type)
    {
        var oNewVal = {};
        res = this.bcr.Read2Spreadsheet(length, function (t, l) {
            return oThis.ReadCT_FromTo(t, l, oNewVal);
        });
        poResult.setFromTo(oNewVal.x, oNewVal.y, poResult.toX, poResult.toY);
    }
    else if(Asc.c_oSer_DrawingType.To == type)
    {
        var oNewVal = {};
        res = this.bcr.Read2Spreadsheet(length, function (t, l) {
            return oThis.ReadCT_FromTo(t, l, oNewVal);
        });
        poResult.setFromTo( poResult.fromX, poResult.fromY, oNewVal.x, oNewVal.y);
    }
    else if(Asc.c_oSer_DrawingType.Ext == type)
    {
        var oNewVal = {};
        res = this.bcr.Read2Spreadsheet(length, function (t, l) {
            return oThis.ReadCT_FromTo(t, l, oNewVal);
        });
        poResult.setFromTo( poResult.fromX, poResult.fromY, oNewVal.x, oNewVal.y);
    }
    else if(Asc.c_oSer_DrawingType.pptxDrawing == type)
    {
        var oGraphicObject = AscCommon.pptx_content_loader.ReadGraphicObject(this.stream, this.curWorksheet, this.drawingDocument);
        poResult.setObject(oGraphicObject);
        // oGraphicObject.createTextBody();
        // oGraphicObject.txBody.content.AddText("Test user Shapes");
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_PageSetup = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_pagesetupPAPERSIZE === type) {
        val.setPaperSize(this.stream.GetULongLE());
    }
    else if (c_oserct_pagesetupPAPERHEIGHT === type) {
        var mm = this.ParseMetric(this.stream.GetString2LE(length));
        if (null != mm)
            val.setPaperHeight(mm);
    }
    else if (c_oserct_pagesetupPAPERWIDTH === type) {
        var mm = this.ParseMetric(this.stream.GetString2LE(length));
        if (null != mm)
            val.setPaperWidth(mm);
    }
    else if (c_oserct_pagesetupFIRSTPAGENUMBER === type) {
        val.setFirstPageNumber(this.stream.GetULongLE());
    }
    else if (c_oserct_pagesetupORIENTATION === type) {
        switch (this.stream.GetUChar()) {
            case st_pagesetuporientationDEFAULT: val.setOrientation(AscFormat.PAGE_SETUP_ORIENTATION_DEFAULT); break;
            case st_pagesetuporientationPORTRAIT: val.setOrientation(AscFormat.PAGE_SETUP_ORIENTATION_PORTRAIT); break;
            case st_pagesetuporientationLANDSCAPE: val.setOrientation(AscFormat.PAGE_SETUP_ORIENTATION_LANDSCAPE); break;
        }
    }
    else if (c_oserct_pagesetupBLACKANDWHITE === type) {
        val.setBlackAndWhite(this.stream.GetBool());
    }
    else if (c_oserct_pagesetupDRAFT === type) {
        val.setBlackAndWhite(this.stream.GetBool());
    }
    else if (c_oserct_pagesetupUSEFIRSTPAGENUMBER === type) {
        val.setUseFirstPageNumb(this.stream.GetBool());
    }
    else if (c_oserct_pagesetupHORIZONTALDPI === type) {
        val.setHorizontalDpi(this.stream.GetULongLE());
    }
    else if (c_oserct_pagesetupVERTICALDPI === type) {
        val.setVerticalDpi(this.stream.GetULongLE());
    }
    else if (c_oserct_pagesetupCOPIES === type) {
        val.setCopies(this.stream.GetULongLE());
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_PageMargins = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_pagemarginsL === type) {
        val.setL(this.stream.GetDoubleLE());
    }
    else if (c_oserct_pagemarginsR === type) {
        val.setR(this.stream.GetDoubleLE());
    }
    else if (c_oserct_pagemarginsT === type) {
        val.setT(this.stream.GetDoubleLE());
    }
    else if (c_oserct_pagemarginsB === type) {
        val.setB(this.stream.GetDoubleLE());
    }
    else if (c_oserct_pagemarginsHEADER === type) {
        val.setHeader(this.stream.GetDoubleLE());
    }
    else if (c_oserct_pagemarginsFOOTER === type) {
        val.setFooter(this.stream.GetDoubleLE());
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_HeaderFooter = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_headerfooterODDHEADER === type) {
        val.setOddHeader(this.stream.GetString2LE(length));
    }
    else if (c_oserct_headerfooterODDFOOTER === type) {
        val.setOddFooter(this.stream.GetString2LE(length));
    }
    else if (c_oserct_headerfooterEVENHEADER === type) {
        val.setEvenHeader(this.stream.GetString2LE(length));
    }
    else if (c_oserct_headerfooterEVENFOOTER === type) {
        val.setEvenFooter(this.stream.GetString2LE(length));
    }
    else if (c_oserct_headerfooterFIRSTHEADER === type) {
        val.setFirstHeader(this.stream.GetString2LE(length));
    }
    else if (c_oserct_headerfooterFIRSTFOOTER === type) {
        val.setFirstFooter(this.stream.GetString2LE(length));
    }
    else if (c_oserct_headerfooterALIGNWITHMARGINS === type) {
        val.setAlignWithMargins(this.stream.GetBool());
    }
    else if (c_oserct_headerfooterDIFFERENTODDEVEN === type) {
        val.setDifferentOddEven(this.stream.GetBool());
    }
    else if (c_oserct_headerfooterDIFFERENTFIRST === type) {
        val.setDifferentFirst(this.stream.GetBool());
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_PrintSettings = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_printsettingsHEADERFOOTER === type) {
        var oNewVal = new AscFormat.CHeaderFooterChart();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_HeaderFooter(t, l, oNewVal);
        });
        val.setHeaderFooter(oNewVal);
    }
    else if (c_oserct_printsettingsPAGEMARGINS === type) {
        var oNewVal = new AscFormat.CPageMarginsChart();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PageMargins(t, l, oNewVal);
        });
        val.setPageMargins(oNewVal);
    }
    else if (c_oserct_printsettingsPAGESETUP === type) {
        var oNewVal = new AscFormat.CPageSetup();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PageSetup(t, l, oNewVal);
        });
        val.setPageSetup(oNewVal);
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_ExternalData = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_externaldataAUTOUPDATE === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        val.m_autoUpdate = oNewVal;
    }
    else if (c_oserct_externaldataID === type) {
        //todo
        var oNewVal;
        oNewVal = this.stream.GetString2LE(length);
        val.m_id = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_DispBlanksAs = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_dispblanksasVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_dispblanksasSPAN: val.m_val = AscFormat.DISP_BLANKS_AS_SPAN; break;
            case st_dispblanksasGAP: val.m_val = AscFormat.DISP_BLANKS_AS_GAP; break;
            case st_dispblanksasZERO: val.m_val = AscFormat.DISP_BLANKS_AS_ZERO; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_LegendEntry = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_legendentryIDX === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setIdx(oNewVal.m_val);
    }
    else if (c_oserct_legendentryDELETE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setDelete(oNewVal.m_val);
        else
            val.setDelete(true);
    }
    else if (c_oserct_legendentryTXPR === type) {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_legendentryEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_UnsignedInt = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_unsignedintVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetULongLE();
        val.m_val = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Extension = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_extensionANY === type) {
        var oNewVal;
        oNewVal = this.stream.GetString2LE(length);
        val.m_Any = oNewVal;
    }
    else if (c_oserct_extensionURI === type) {
        var oNewVal;
        oNewVal = this.stream.GetString2LE(length);
        val.m_uri = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_LegendPos = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_legendposVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_legendposB: val.m_val = c_oAscChartLegendShowSettings.bottom; break;
            case st_legendposTR: val.m_val = c_oAscChartLegendShowSettings.topRight; break;
            case st_legendposL: val.m_val = c_oAscChartLegendShowSettings.left; break;
            case st_legendposR: val.m_val = c_oAscChartLegendShowSettings.right; break;
            case st_legendposT: val.m_val = c_oAscChartLegendShowSettings.top; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Legend = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_legendLEGENDPOS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_LegendPos(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setLegendPos(oNewVal.m_val);
    }
    else if (c_oserct_legendLEGENDENTRY === type) {
        var oNewVal = new AscFormat.CLegendEntry();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_LegendEntry(t, l, oNewVal);
        });
        val.addLegendEntry(oNewVal);
    }
    else if (c_oserct_legendLAYOUT === type) {
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Layout(t, l, val);
        });
    }
    else if (c_oserct_legendOVERLAY === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setOverlay(oNewVal.m_val);
    }
    else if (c_oserct_legendSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_legendTXPR === type) {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_legendALIGN === type) {
        val.setAlign(this.stream.GetUChar())
    }
    else if (c_oserct_legendEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Layout = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_layoutMANUALLAYOUT === type) {
        var oNewVal = new AscFormat.CLayout();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ManualLayout(t, l, oNewVal);
        });
        val.setLayout(oNewVal);
    }
    else if (c_oserct_layoutEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_ManualLayout = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_manuallayoutLAYOUTTARGET === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_LayoutTarget(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setLayoutTarget(oNewVal.m_val);
    }
    else if (c_oserct_manuallayoutXMODE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_LayoutMode(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setXMode(oNewVal.m_val);
    }
    else if (c_oserct_manuallayoutYMODE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_LayoutMode(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setYMode(oNewVal.m_val);
    }
    else if (c_oserct_manuallayoutWMODE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_LayoutMode(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setWMode(oNewVal.m_val);
    }
    else if (c_oserct_manuallayoutHMODE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_LayoutMode(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setHMode(oNewVal.m_val);
    }
    else if (c_oserct_manuallayoutX === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Double(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setX(oNewVal.m_val);
    }
    else if (c_oserct_manuallayoutY === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Double(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setY(oNewVal.m_val);
    }
    else if (c_oserct_manuallayoutW === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Double(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setW(oNewVal.m_val);
    }
    else if (c_oserct_manuallayoutH === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Double(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setH(oNewVal.m_val);
    }
    else if (c_oserct_manuallayoutEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_LayoutTarget = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_layouttargetVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_layouttargetINNER: val.m_val = LAYOUT_TARGET_INNER; break;
            case st_layouttargetOUTER: val.m_val = LAYOUT_TARGET_OUTER; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_LayoutMode = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_layoutmodeVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_layoutmodeEDGE: val.m_val = LAYOUT_MODE_EDGE; break;
            case st_layoutmodeFACTOR: val.m_val = LAYOUT_MODE_FACTOR; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Double = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_doubleVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetDoubleLE();
        val.m_val = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_DTable = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_dtableSHOWHORZBORDER === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setShowHorzBorder(oNewVal.m_val);
    }
    else if (c_oserct_dtableSHOWVERTBORDER === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setShowVertBorder(oNewVal.m_val);
    }
    else if (c_oserct_dtableSHOWOUTLINE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setShowOutline(oNewVal.m_val);
    }
    else if (c_oserct_dtableSHOWKEYS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setShowKeys(oNewVal.m_val);
    }
    else if (c_oserct_dtableSPPR === type) {
        val.setSpPr(this.ReadSpPr(length))
    }
    else if (c_oserct_dtableTXPR === type) {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_dtableEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_SerAx = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_seraxAXID === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setAxId(oNewVal.m_val);
    }
    else if (c_oserct_seraxSCALING === type) {
        var oNewVal = new AscFormat.CScaling();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Scaling(t, l, oNewVal);
        });
        val.setScaling(oNewVal);
    }
    else if (c_oserct_seraxDELETE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setDelete(oNewVal.m_val);
        else
            val.setDelete(true);
    }
    else if (c_oserct_seraxAXPOS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AxPos(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setAxPos(oNewVal.m_val);
    }
    else if (c_oserct_seraxMAJORGRIDLINES === type) {
        var oNewVal = { spPr: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartLines(t, l, oNewVal);
        });
        if (null != oNewVal.spPr)
            val.setMajorGridlines(oNewVal.spPr);
        else
            val.setMajorGridlines(new AscFormat.CSpPr());
    }
    else if (c_oserct_seraxMINORGRIDLINES === type) {
        var oNewVal = { spPr: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartLines(t, l, oNewVal);
        });
        if (null != oNewVal.spPr)
            val.setMinorGridlines(oNewVal.spPr);
        else
            val.setMinorGridlines(new AscFormat.CSpPr());
    }
    else if (c_oserct_seraxTITLE === type) {
        var oNewVal = new AscFormat.CTitle();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Title(t, l, oNewVal);
        });
        if(!AscFormat.isRealBool(oNewVal.overlay))
        {
            oNewVal.setOverlay(false);
        }
        val.setTitle(oNewVal);
    }
    else if (c_oserct_seraxNUMFMT === type) {
        var oNewVal = new AscFormat.CNumFmt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumFmt(t, l, oNewVal);
        });
        val.setNumFmt(oNewVal);
    }
    else if (c_oserct_seraxMAJORTICKMARK === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TickMark(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setMajorTickMark(oNewVal.m_val);
        else{
            val.setMajorTickMark(c_oAscTickMark.TICK_MARK_CROSS);
        }
    }
    else if (c_oserct_seraxMINORTICKMARK === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TickMark(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setMinorTickMark(oNewVal.m_val);
        else{
            val.setMajorTickMark(c_oAscTickMark.TICK_MARK_CROSS);
        }
    }
    else if (c_oserct_seraxTICKLBLPOS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TickLblPos(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setTickLblPos(oNewVal.m_val);
    }
    else if (c_oserct_seraxSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_seraxTXPR === type) {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_seraxCROSSAX === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });

        if (null != oNewVal.m_val)
        {
            val.crossAxId = oNewVal.m_val;
        }
    }
    else if (c_oserct_seraxCROSSES === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Crosses(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setCrosses(oNewVal.m_val);
    }
    else if (c_oserct_seraxCROSSESAT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Double(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setCrossesAt(oNewVal.m_val);
    }
    else if (c_oserct_seraxTICKLBLSKIP === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Skip(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setTickLblSkip(oNewVal.m_val);
    }
    else if (c_oserct_seraxTICKMARKSKIP === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Skip(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setTickMarkSkip(oNewVal.m_val);
    }
    else if (c_oserct_seraxEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Scaling = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_scalingLOGBASE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_LogBase(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setLogBase(oNewVal.m_val);
    }
    else if (c_oserct_scalingORIENTATION === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Orientation(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setOrientation(oNewVal.m_val);
    }
    else if (c_oserct_scalingMAX === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Double(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setMax(oNewVal.m_val);
    }
    else if (c_oserct_scalingMIN === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Double(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setMin(oNewVal.m_val);
    }
    else if (c_oserct_scalingEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_LogBase = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_logbaseVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetDoubleLE();
        val.m_val = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Orientation = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_orientationVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_orientationMAXMIN: val.m_val = AscFormat.ORIENTATION_MAX_MIN; break;
            case st_orientationMINMAX: val.m_val = AscFormat.ORIENTATION_MIN_MAX; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_AxPos = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_axposVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_axposB: val.m_val = AscFormat.AX_POS_B; break;
            case st_axposL: val.m_val = AscFormat.AX_POS_L; break;
            case st_axposR: val.m_val = AscFormat.AX_POS_R; break;
            case st_axposT: val.m_val = AscFormat.AX_POS_T; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_ChartLines = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_chartlinesSPPR === type) {
        val.spPr = this.ReadSpPr(length);
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Title = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_titleTX === type) {
        var oNewVal = new AscFormat.CChartText();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Tx(t, l, oNewVal);
        });
        oNewVal.setChart(this.curChart);
        val.setTx(oNewVal);
    }
    else if (c_oserct_titleLAYOUT === type) {
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Layout(t, l, val);
        });
    }
    else if (c_oserct_titleOVERLAY === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setOverlay(oNewVal.m_val);
    }
    else if (c_oserct_titleSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_titleTXPR === type) {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_titleALIGN === type) { 
        val.setAlign(this.stream.GetUChar());
    }
    else if (c_oserct_titleEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Tx = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_txRICH === type) {
        val.setRich(this.ReadTxPr(length));
        val.rich.setParent(val);
    }
    else if (c_oserct_txSTRREF === type) {
        var oNewVal = new AscFormat.CStrRef();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_StrRef(t, l, oNewVal);
        });
        val.setStrRef(oNewVal);
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_StrRef = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_strrefF === type) {
        val.setF(this.stream.GetString2LE(length));
    }
    else if (c_oserct_strrefSTRCACHE === type) {
        var oNewVal = new AscFormat.CStrCache();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_StrData(t, l, oNewVal);
        });
        val.setStrCache(oNewVal);
    }
    else if (c_oserct_strrefEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_StrData = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_strdataPTCOUNT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setPtCount(oNewVal.m_val);
    }
    else if (c_oserct_strdataPT === type) {
        var oNewVal = new AscFormat.CStringPoint();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_StrVal(t, l, oNewVal);
        });
        val.addPt(oNewVal);
    }
    else if (c_oserct_strdataEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_StrVal = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_strvalV === type) {
        val.setVal(this.stream.GetString2LE(length));
    }
    else if (c_oserct_strvalIDX === type) {
        val.setIdx(this.stream.GetULongLE());
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_NumFmt = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_numfmtFORMATCODE === type) {
        val.setFormatCode(this.stream.GetString2LE(length));
    }
    else if (c_oserct_numfmtSOURCELINKED === type) {
        val.setSourceLinked(this.stream.GetBool());
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_TickMark = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_tickmarkVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_tickmarkCROSS: val.m_val = c_oAscTickMark.TICK_MARK_CROSS; break;
            case st_tickmarkIN: val.m_val = c_oAscTickMark.TICK_MARK_IN; break;
            case st_tickmarkNONE: val.m_val = c_oAscTickMark.TICK_MARK_NONE; break;
            case st_tickmarkOUT: val.m_val = c_oAscTickMark.TICK_MARK_OUT; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_TickLblPos = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_ticklblposVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_ticklblposHIGH: val.m_val = c_oAscTickLabelsPos.TICK_LABEL_POSITION_HIGH; break;
            case st_ticklblposLOW: val.m_val = c_oAscTickLabelsPos.TICK_LABEL_POSITION_LOW; break;
            case st_ticklblposNEXTTO: val.m_val = c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO; break;
            case st_ticklblposNONE: val.m_val = c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Crosses = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_crossesVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_crossesAUTOZERO: val.m_val = AscFormat.CROSSES_AUTO_ZERO; break;
            case st_crossesMAX: val.m_val = AscFormat.CROSSES_MAX; break;
            case st_crossesMIN: val.m_val = AscFormat.CROSSES_MIN; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Skip = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_skipVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetULongLE();
        val.m_val = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_TimeUnit = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_timeunitVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_timeunitDAYS: val.m_val = AscFormat.TIME_UNIT_DAYS; break;
            case st_timeunitMONTHS: val.m_val = AscFormat.TIME_UNIT_MONTHS; break;
            case st_timeunitYEARS: val.m_val = AscFormat.TIME_UNIT_YEARS; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_DateAx = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_dateaxAXID === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setAxId(oNewVal.m_val);
    }
    else if (c_oserct_dateaxSCALING === type) {
        var oNewVal = new AscFormat.CScaling();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Scaling(t, l, oNewVal);
        });
        val.setScaling(oNewVal);
    }
    else if (c_oserct_dateaxDELETE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setDelete(oNewVal.m_val);
        else
            val.setDelete(true);
    }
    else if (c_oserct_dateaxAXPOS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AxPos(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setAxPos(oNewVal.m_val);
    }
    else if (c_oserct_dateaxMAJORGRIDLINES === type) {
        var oNewVal = { spPr: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartLines(t, l, oNewVal);
        });
        if (null != oNewVal.spPr)
            val.setMajorGridlines(oNewVal.spPr);
        else
            val.setMajorGridlines(new AscFormat.CSpPr());
    }
    else if (c_oserct_dateaxMINORGRIDLINES === type) {
        var oNewVal = { spPr: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartLines(t, l, oNewVal);
        });
        if (null != oNewVal.spPr)
            val.setMinorGridlines(oNewVal.spPr);
        else
            val.setMinorGridlines(new AscFormat.CSpPr());
    }
    else if (c_oserct_dateaxTITLE === type) {
        var oNewVal = new AscFormat.CTitle();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Title(t, l, oNewVal);
        });
        if(!AscFormat.isRealBool(oNewVal.overlay))
        {
            oNewVal.setOverlay(false);
        }
        val.setTitle(oNewVal);
    }
    else if (c_oserct_dateaxNUMFMT === type) {
        var oNewVal = new AscFormat.CNumFmt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumFmt(t, l, oNewVal);
        });
        val.setNumFmt(oNewVal);
    }
    else if (c_oserct_dateaxMAJORTICKMARK === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TickMark(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setMajorTickMark(oNewVal.m_val);
        else{
            val.setMajorTickMark(c_oAscTickMark.TICK_MARK_CROSS);
        }
    }
    else if (c_oserct_dateaxMINORTICKMARK === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TickMark(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setMinorTickMark(oNewVal.m_val);
        else{
            val.setMajorTickMark(c_oAscTickMark.TICK_MARK_CROSS);
        }
    }
    else if (c_oserct_dateaxTICKLBLPOS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TickLblPos(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setTickLblPos(oNewVal.m_val);
    }
    else if (c_oserct_dateaxSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_dateaxTXPR === type) {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_dateaxCROSSAX === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });

        if (null != oNewVal.m_val)
        {
            val.crossAxId = oNewVal.m_val;
        }
    }
    else if (c_oserct_dateaxCROSSES === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Crosses(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setCrosses(oNewVal.m_val);
    }
    else if (c_oserct_dateaxCROSSESAT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Double(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setCrossesAt(oNewVal.m_val);
    }
    else if (c_oserct_dateaxAUTO === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setAuto(oNewVal.m_val);
    }
    else if (c_oserct_dateaxLBLOFFSET === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_LblOffset(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setLblOffset(oNewVal.m_val);
    }
    else if (c_oserct_dateaxBASETIMEUNIT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TimeUnit(t, l, oNewVal);
        });
        // if (null != oNewVal.m_val) {
        // val.setMinorTimeUnit(oNewVal.m_val);
    }
    else if (c_oserct_dateaxMAJORUNIT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AxisUnit(t, l, oNewVal);
        });
        // if (null != oNewVal.m_val)
        // val.setMajorUnit(oNewVal.m_val);
    }
    else if (c_oserct_dateaxMAJORTIMEUNIT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TimeUnit(t, l, oNewVal);
        });
        // if (null != oNewVal.m_val) {
        // val.setMinorTimeUnit(oNewVal.m_val);
    }
    else if (c_oserct_dateaxMINORUNIT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AxisUnit(t, l, oNewVal);
        });
        // if (null != oNewVal.m_val)
        // val.setMinorUnit(oNewVal.m_val);
    }
    else if (c_oserct_dateaxMINORTIMEUNIT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TimeUnit(t, l, oNewVal);
        });
        // if (null != oNewVal.m_val)
        // val.setMinorTimeUnit(oNewVal.m_val);
    }
    else if (c_oserct_dateaxEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_LblOffset = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_lbloffsetVAL === type) {
        val.m_val = this.ParsePersent(this.stream.GetString2LE(length));
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_AxisUnit = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_axisunitVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetDoubleLE();
        val.m_val = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_LblAlgn = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_lblalgnVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_lblalgnCTR: val.m_val = AscFormat.LBL_ALG_CTR; break;
            case st_lblalgnL: val.m_val = AscFormat.LBL_ALG_L; break;
            case st_lblalgnR: val.m_val = AscFormat.LBL_ALG_R; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_CatAx = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_cataxAXID === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setAxId(oNewVal.m_val);
    }
    else if (c_oserct_cataxSCALING === type) {
        var oNewVal = new AscFormat.CScaling();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Scaling(t, l, oNewVal);
        });
        val.setScaling(oNewVal);
    }
    else if (c_oserct_cataxDELETE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setDelete(oNewVal.m_val);
        else
            val.setDelete(true);
    }
    else if (c_oserct_cataxAXPOS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AxPos(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setAxPos(oNewVal.m_val);
    }
    else if (c_oserct_cataxMAJORGRIDLINES === type) {
        var oNewVal = { spPr: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartLines(t, l, oNewVal);
        });
        if (null != oNewVal.spPr)
            val.setMajorGridlines(oNewVal.spPr);
        else
            val.setMajorGridlines(new AscFormat.CSpPr());
    }
    else if (c_oserct_cataxMINORGRIDLINES === type) {
        var oNewVal = { spPr: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartLines(t, l, oNewVal);
        });
        if (null != oNewVal.spPr)
            val.setMinorGridlines(oNewVal.spPr);
        else
            val.setMinorGridlines(new AscFormat.CSpPr());
    }
    else if (c_oserct_cataxTITLE === type) {
        var oNewVal = new AscFormat.CTitle();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Title(t, l, oNewVal);
        });
        if(!AscFormat.isRealBool(oNewVal.overlay))
        {
            oNewVal.setOverlay(true);
        }
        val.setTitle(oNewVal);
    }
    else if (c_oserct_cataxNUMFMT === type) {
        var oNewVal = new AscFormat.CNumFmt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumFmt(t, l, oNewVal);
        });
        val.setNumFmt(oNewVal);
    }
    else if (c_oserct_cataxMAJORTICKMARK === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TickMark(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setMajorTickMark(oNewVal.m_val);
        else{
            val.setMajorTickMark(c_oAscTickMark.TICK_MARK_CROSS);
        }
    }
    else if (c_oserct_cataxMINORTICKMARK === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TickMark(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setMinorTickMark(oNewVal.m_val);
        else{
            val.setMajorTickMark(c_oAscTickMark.TICK_MARK_CROSS);
        }
    }
    else if (c_oserct_cataxTICKLBLPOS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TickLblPos(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setTickLblPos(oNewVal.m_val);
    }
    else if (c_oserct_cataxSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_cataxTXPR === type) {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_cataxCROSSAX === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
        {
            val.crossAxId = oNewVal.m_val;
        }
    }
    else if (c_oserct_cataxCROSSES === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Crosses(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setCrosses(oNewVal.m_val);

    }
    else if (c_oserct_cataxCROSSESAT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Double(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setCrossesAt(oNewVal.m_val);
    }
    else if (c_oserct_cataxAUTO === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setAuto(oNewVal.m_val);
    }
    else if (c_oserct_cataxLBLALGN === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_LblAlgn(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setLblAlgn(oNewVal.m_val);
    }
    else if (c_oserct_cataxLBLOFFSET === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_LblOffset(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setLblOffset(oNewVal.m_val);
    }
    else if (c_oserct_cataxTICKLBLSKIP === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Skip(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setTickLblSkip(oNewVal.m_val);
    }
    else if (c_oserct_cataxTICKMARKSKIP === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Skip(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setTickMarkSkip(oNewVal.m_val);
    }
    else if (c_oserct_cataxNOMULTILVLLBL === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setNoMultiLvlLbl(oNewVal.m_val);
    }
    else if (c_oserct_cataxEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_DispUnitsLbl = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_dispunitslblLAYOUT === type) {
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Layout(t, l, val);
        });
    }
    else if (c_oserct_dispunitslblTX === type) {
        var oNewVal = new AscFormat.CChartText();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Tx(t, l, oNewVal);
        });
        oNewVal.setChart(this.curChart);
        val.setTx(oNewVal);
    }
    else if (c_oserct_dispunitslblSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_dispunitslblTXPR === type) {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_BuiltInUnit = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_builtinunitVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_builtinunitHUNDREDS: val.m_val = c_oAscValAxUnits.HUNDREDS; break;
            case st_builtinunitTHOUSANDS: val.m_val = c_oAscValAxUnits.THOUSANDS; break;
            case st_builtinunitTENTHOUSANDS: val.m_val = c_oAscValAxUnits.TEN_THOUSANDS; break;
            case st_builtinunitHUNDREDTHOUSANDS: val.m_val = c_oAscValAxUnits.HUNDRED_THOUSANDS; break;
            case st_builtinunitMILLIONS: val.m_val = c_oAscValAxUnits.MILLIONS; break;
            case st_builtinunitTENMILLIONS: val.m_val = c_oAscValAxUnits.TEN_MILLIONS; break;
            case st_builtinunitHUNDREDMILLIONS: val.m_val = c_oAscValAxUnits.HUNDRED_MILLIONS; break;
            case st_builtinunitBILLIONS: val.m_val = c_oAscValAxUnits.BILLIONS; break;
            case st_builtinunitTRILLIONS: val.m_val = c_oAscValAxUnits.TRILLIONS; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_DispUnits = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_dispunitsBUILTINUNIT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_BuiltInUnit(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setBuiltInUnit(oNewVal.m_val);
    }
    else if (c_oserct_dispunitsCUSTUNIT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Double(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setCustUnit(oNewVal.m_val);
    }
    else if (c_oserct_dispunitsDISPUNITSLBL === type) {
        var oNewVal = new AscFormat.CDLbl();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DispUnitsLbl(t, l, oNewVal);
        });
		oNewVal.correctValues();
        val.setDispUnitsLbl(oNewVal);
    }
    else if (c_oserct_dispunitsEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_CrossBetween = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_crossbetweenVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_crossbetweenBETWEEN: val.m_val = AscFormat.CROSS_BETWEEN_BETWEEN; break;
            case st_crossbetweenMIDCAT: val.m_val = AscFormat.CROSS_BETWEEN_MID_CAT; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_ValAx = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_valaxAXID === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setAxId(oNewVal.m_val);
    }
    else if (c_oserct_valaxSCALING === type) {
        var oNewVal = new AscFormat.CScaling();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Scaling(t, l, oNewVal);
        });
        val.setScaling(oNewVal);
    }
    else if (c_oserct_valaxDELETE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setDelete(oNewVal.m_val);
        else
            val.setDelete(true);
    }
    else if (c_oserct_valaxAXPOS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AxPos(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setAxPos(oNewVal.m_val);
    }
    else if (c_oserct_valaxMAJORGRIDLINES === type) {
        var oNewVal = { spPr: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartLines(t, l, oNewVal);
        });
        if (null != oNewVal.spPr)
            val.setMajorGridlines(oNewVal.spPr);
        else
            val.setMajorGridlines(new AscFormat.CSpPr());
    }
    else if (c_oserct_valaxMINORGRIDLINES === type) {
        var oNewVal = { spPr: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartLines(t, l, oNewVal);
        });
        if (null != oNewVal.spPr)
            val.setMinorGridlines(oNewVal.spPr);
        else
            val.setMinorGridlines(new AscFormat.CSpPr());
    }
    else if (c_oserct_valaxTITLE === type) {
        var oNewVal = new AscFormat.CTitle();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Title(t, l, oNewVal);
        });
        if(!AscFormat.isRealBool(oNewVal.overlay))
        {
            oNewVal.setOverlay(true);
        }
        val.setTitle(oNewVal);
    }
    else if (c_oserct_valaxNUMFMT === type) {
        var oNewVal = new AscFormat.CNumFmt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumFmt(t, l, oNewVal);
        });
        val.setNumFmt(oNewVal);
    }
    else if (c_oserct_valaxMAJORTICKMARK === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TickMark(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setMajorTickMark(oNewVal.m_val);
        else{
            val.setMajorTickMark(c_oAscTickMark.TICK_MARK_CROSS);
        }
    }
    else if (c_oserct_valaxMINORTICKMARK === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TickMark(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setMinorTickMark(oNewVal.m_val);
        else{
            val.setMajorTickMark(c_oAscTickMark.TICK_MARK_CROSS);
        }
    }
    else if (c_oserct_valaxTICKLBLPOS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TickLblPos(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setTickLblPos(oNewVal.m_val);
    }
    else if (c_oserct_valaxSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_valaxTXPR === type) {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_valaxCROSSAX === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
        {
            val.crossAxId = oNewVal.m_val;
        }
    }
    else if (c_oserct_valaxCROSSES === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Crosses(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setCrosses(oNewVal.m_val);
        else
            val.setCrosses(AscFormat.CROSSES_AUTO_ZERO);
    }
    else if (c_oserct_valaxCROSSESAT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Double(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setCrossesAt(oNewVal.m_val);
    }
    else if (c_oserct_valaxCROSSBETWEEN === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_CrossBetween(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setCrossBetween(oNewVal.m_val);
    }
    else if (c_oserct_valaxMAJORUNIT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AxisUnit(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setMajorUnit(oNewVal.m_val);
    }
    else if (c_oserct_valaxMINORUNIT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AxisUnit(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setMinorUnit(oNewVal.m_val);
    }
    else if (c_oserct_valaxDISPUNITS === type) {
        var oNewVal = new AscFormat.CDispUnits();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DispUnits(t, l, oNewVal);
        });
        val.setDispUnits(oNewVal);
    }
    else if (c_oserct_valaxEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_SizeRepresents = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_sizerepresentsVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_sizerepresentsAREA: val.m_val = SIZE_REPRESENTS_AREA; break;
            case st_sizerepresentsW: val.m_val = SIZE_REPRESENTS_W; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_BubbleScale = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_bubblescaleVAL === type) {
        val.m_val = this.ParsePersent(this.stream.GetString2LE(length));
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_BubbleSer = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_bubbleserIDX === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setIdx(oNewVal.m_val);
    }
    else if (c_oserct_bubbleserORDER === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setOrder(oNewVal.m_val);
    }
    else if (c_oserct_bubbleserTX === type) {
        var oNewVal = new AscFormat.CTx();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_SerTx(t, l, oNewVal);
        });
        val.setTx(oNewVal);
    }
    else if (c_oserct_bubbleserSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_bubbleserINVERTIFNEGATIVE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setInvertIfNegative(oNewVal.m_val);
    }
    else if (c_oserct_bubbleserDPT === type) {
        var oNewVal = new AscFormat.CDPt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DPt(t, l, oNewVal);
        });
        val.addDPt(oNewVal);
    }
    else if (c_oserct_bubbleserDLBLS === type) {
        var oNewVal = new AscFormat.CDLbls();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbls(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.setDLbls(oNewVal);
    }
    else if (c_oserct_bubbleserTRENDLINE === type) {
        //todo array
        var oNewVal = new AscFormat.CTrendLine();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Trendline(t, l, oNewVal);
        });
        val.setTrendline(oNewVal);
    }
    else if (c_oserct_bubbleserERRBARS === type) {
        var oNewVal = new AscFormat.CErrBars();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ErrBars(t, l, oNewVal);
        });
        val.addErrBars(oNewVal);
    }
    else if (c_oserct_bubbleserXVAL === type) {
        var oNewVal = new AscFormat.CCat();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AxDataSource(t, l, oNewVal);
        });
        val.setXVal(oNewVal);
    }
    else if (c_oserct_bubbleserYVAL === type) {
        var oNewVal = new AscFormat.CYVal();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumDataSource(t, l, oNewVal);
        });
        val.setYVal(oNewVal);
    }
    else if (c_oserct_bubbleserBUBBLESIZE === type) {
        var oNewVal = new AscFormat.CYVal();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumDataSource(t, l, oNewVal);
        });
        val.setBubbleSize(oNewVal);
    }
    else if (c_oserct_bubbleserBUBBLE3D === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setBubble3D(oNewVal.m_val);
    }
    else if (c_oserct_bubbleserEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
	else if(c_oserct_chartFiltering === type) {
	    res = this.bcr.Read1(length, function (t, l) {
		    return oThis.ReadCT_ChartFiltering(t, l, val);
	    });
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_SerTx = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_sertxSTRREF === type) {
        var oNewVal = new AscFormat.CStrRef();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_StrRef(t, l, oNewVal);
        });
        val.setStrRef(oNewVal);
    }
    else if (c_oserct_sertxV === type) {
        val.setVal(this.stream.GetString2LE(length));
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_DPt = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_dptIDX === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setIdx(oNewVal.m_val);
    }
    else if (c_oserct_dptINVERTIFNEGATIVE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setInvertIfNegative(oNewVal.m_val);
    }
    else if (c_oserct_dptMARKER === type) {
        var oNewVal = new AscFormat.CMarker();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Marker(t, l, oNewVal);
        });
        val.setMarker(oNewVal);
    }
    else if (c_oserct_dptBUBBLE3D === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setBubble3D(oNewVal.m_val);
    }
    else if (c_oserct_dptEXPLOSION === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setExplosion(oNewVal.m_val);
    }
    else if (c_oserct_dptSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_dptPICTUREOPTIONS === type) {
        var oNewVal = new AscFormat.CPictureOptions();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PictureOptions(t, l, oNewVal);
        });
        val.setPictureOptions(oNewVal);
    }
    else if (c_oserct_dptEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Marker = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_markerSYMBOL === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_MarkerStyle(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setSymbol(oNewVal.m_val);
    }
    else if (c_oserct_markerSIZE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_MarkerSize(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setSize(oNewVal.m_val);
    }
    else if (c_oserct_markerSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_markerEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.MarkerStyleToFormat = function(markerStyle) {

    var val = null;
    switch (markerStyle) {
        case st_markerstyleCIRCLE: val = AscFormat.SYMBOL_CIRCLE; break;
        case st_markerstyleDASH: val = AscFormat.SYMBOL_DASH; break;
        case st_markerstyleDIAMOND: val = AscFormat.SYMBOL_DIAMOND; break;
        case st_markerstyleDOT: val = AscFormat.SYMBOL_DOT; break;
        case st_markerstyleNONE: val = AscFormat.SYMBOL_NONE; break;
        case st_markerstylePICTURE: val = AscFormat.SYMBOL_PICTURE; break;
        case st_markerstylePLUS: val = AscFormat.SYMBOL_PLUS; break;
        case st_markerstyleSQUARE: val = AscFormat.SYMBOL_SQUARE; break;
        case st_markerstyleSTAR: val = AscFormat.SYMBOL_STAR; break;
        case st_markerstyleTRIANGLE: val = AscFormat.SYMBOL_TRIANGLE; break;
        case st_markerstyleX: val = AscFormat.SYMBOL_X; break;
        case st_markerstyleAUTO: break;
    }
    return val;
};
BinaryChartReader.prototype.ReadCT_MarkerStyle = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    if (c_oserct_markerstyleVAL === type) {
        val.m_val = this.MarkerStyleToFormat(this.stream.GetUChar());
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_MarkerSize = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_markersizeVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetUChar();
        val.m_val = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_PictureOptions = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_pictureoptionsAPPLYTOFRONT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setApplyToFront(oNewVal.m_val);
    }
    else if (c_oserct_pictureoptionsAPPLYTOSIDES === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setApplyToSides(oNewVal.m_val);
    }
    else if (c_oserct_pictureoptionsAPPLYTOEND === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setApplyToEnd(oNewVal.m_val);
    }
    else if (c_oserct_pictureoptionsPICTUREFORMAT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PictureFormat(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setPictureFormat(oNewVal.m_val);
    }
    else if (c_oserct_pictureoptionsPICTURESTACKUNIT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PictureStackUnit(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setPictureStackUnit(oNewVal.m_val);
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_PictureFormat = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_pictureformatVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_pictureformatSTRETCH: val.m_val = PICTURE_FORMAT_STACK_STRETCH; break;
            case st_pictureformatSTACK: val.m_val = PICTURE_FORMAT_STACK; break;
            case st_pictureformatSTACKSCALE: val.m_val = PICTURE_FORMAT_STACK_SCALE; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_PictureStackUnit = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_picturestackunitVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetDoubleLE();
        val.m_val = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_DLbls = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_dlblsDLBL === type) {
        var oNewVal = new AscFormat.CDLbl();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbl(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.addDLbl(oNewVal);
    }
    else if (c_oserct_dlblsDLBLPOS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLblPos(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setDLblPos(oNewVal.m_val);
    }
    else if (c_oserct_dlblsDELETE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setDelete(oNewVal.m_val);
        else
            val.setDelete(true);
    }
    else if (c_oserct_dlblsLEADERLINES === type) {
        var oNewVal = { spPr: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartLines(t, l, oNewVal);
        });
        if (null != oNewVal.spPr)
            val.setLeaderLines(oNewVal.spPr);
        else
            val.setLeaderLines(new AscFormat.CSpPr());
    }
    else if (c_oserct_dlblsNUMFMT === type) {
        var oNewVal = new AscFormat.CNumFmt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumFmt(t, l, oNewVal);
        });
        val.setNumFmt(oNewVal);
    }
    else if (c_oserct_dlblsSEPARATOR === type) {
        val.setSeparator(this.stream.GetString2LE(length));
    }
    else if (c_oserct_dlblsSHOWBUBBLESIZE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setShowBubbleSize(oNewVal.m_val);
        else
            val.setShowBubbleSize(true);
    }
    else if (c_oserct_dlblsSHOWCATNAME === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setShowCatName(oNewVal.m_val);
        else
            val.setShowCatName(true);
    }
    else if (c_oserct_dlblsSHOWLEADERLINES === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setShowLeaderLines(oNewVal.m_val);
        else
            val.setShowLeaderLines(true);
    }
    else if (c_oserct_dlblsSHOWLEGENDKEY === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setShowLegendKey(oNewVal.m_val);
        else
            val.setShowLegendKey(true);
    }
    else if (c_oserct_dlblsSHOWPERCENT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setShowPercent(oNewVal.m_val);
        else
            val.setShowPercent(true);
    }
    else if (c_oserct_dlblsSHOWSERNAME === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setShowSerName(oNewVal.m_val);
        else
            val.setShowSerName(true);
    }
    else if (c_oserct_dlblsSHOWVAL === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setShowVal(oNewVal.m_val);
        else
            val.setShowVal(true);
    }
    else if (c_oserct_dlblsSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_dlblsTXPR === type) {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_dlblsEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_DLbl = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_dlblIDX === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setIdx(oNewVal.m_val);
    }
    else if (c_oserct_dlblDLBLPOS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLblPos(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setDLblPos(oNewVal.m_val);
    }
    else if (c_oserct_dlblDELETE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setDelete(oNewVal.m_val);
        else
            val.setDelete(true);
    }
    else if (c_oserct_dlblLAYOUT === type) {
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Layout(t, l, val);
        });
    }
    else if (c_oserct_dlblNUMFMT === type) {
        var oNewVal = new AscFormat.CNumFmt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumFmt(t, l, oNewVal);
        });
        val.setNumFmt(oNewVal);
    }
    else if (c_oserct_dlblSEPARATOR === type) {
        val.setSeparator(this.stream.GetString2LE(length));
    }
    else if (c_oserct_dlblSHOWBUBBLESIZE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setShowBubbleSize(oNewVal.m_val);
        else
            val.setShowBubbleSize(true);
    }
    else if (c_oserct_dlblSHOWCATNAME === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setShowCatName(oNewVal.m_val);
        else
            val.setShowCatName(true);
    }
    else if (c_oserct_dlblSHOWLEGENDKEY === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setShowLegendKey(oNewVal.m_val);
        else
            val.setShowLegendKey(true);
    }
    else if (c_oserct_dlblSHOWPERCENT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setShowPercent(oNewVal.m_val);
        else
            val.setShowPercent(true);
    }
    else if (c_oserct_dlblSHOWSERNAME === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setShowSerName(oNewVal.m_val);
        else
            val.setShowSerName(true);
    }
    else if (c_oserct_dlblSHOWVAL === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setShowVal(oNewVal.m_val);
        else
            val.setShowVal(true);
    }
    else if (c_oserct_dlblSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_dlblTX === type) {
        var oNewVal = new AscFormat.CChartText();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Tx(t, l, oNewVal);
        });
        oNewVal.setChart(this.curChart);
        val.setTx(oNewVal);
    }
    else if (c_oserct_dlblTXPR === type) {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_dlblEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else if (c_oserct_dataLabel === type) {
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLblExt(t, l, val);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_DLblExt = function(type, length, val) {

	let res = c_oSerConstants.ReadOk;
	let oThis = this;
	if (c_oserct_showDataLabelsRange === type) {
		let oNewVal = { m_val: null };
		res = this.bcr.Read1(length, function (t, l) {
			return oThis.ReadCT_Boolean(t, l, oNewVal);
		});
		if (null != oNewVal.m_val)
			val.setShowDlblsRange(oNewVal.m_val);
	}
	else
		res = c_oSerConstants.ReadUnknown;
	return res;
};
BinaryChartReader.prototype.ReadCT_DLblPos = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_dlblposVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_dlblposBESTFIT: val.m_val = c_oAscChartDataLabelsPos.bestFit; break;
            case st_dlblposB: val.m_val = c_oAscChartDataLabelsPos.b; break;
            case st_dlblposCTR: val.m_val = c_oAscChartDataLabelsPos.ctr; break;
            case st_dlblposINBASE: val.m_val = c_oAscChartDataLabelsPos.inBase; break;
            case st_dlblposINEND: val.m_val = c_oAscChartDataLabelsPos.inEnd; break;
            case st_dlblposL: val.m_val = c_oAscChartDataLabelsPos.l; break;
            case st_dlblposOUTEND: val.m_val = c_oAscChartDataLabelsPos.outEnd; break;
            case st_dlblposR: val.m_val = c_oAscChartDataLabelsPos.r; break;
            case st_dlblposT: val.m_val = c_oAscChartDataLabelsPos.t; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Trendline = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_trendlineNAME === type) {
        val.setName(this.stream.GetString2LE(length));
    }
    else if (c_oserct_trendlineSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_trendlineTRENDLINETYPE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TrendlineType(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setTrendlineType(oNewVal.m_val);
    }
    else if (c_oserct_trendlineORDER === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Order(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setOrder(oNewVal.m_val);
    }
    else if (c_oserct_trendlinePERIOD === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Period(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setPeriod(oNewVal.m_val);
    }
    else if (c_oserct_trendlineFORWARD === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Double(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setForward(oNewVal.m_val);
    }
    else if (c_oserct_trendlineBACKWARD === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Double(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setBackward(oNewVal.m_val);
    }
    else if (c_oserct_trendlineINTERCEPT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Double(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setIntercept(oNewVal.m_val);
    }
    else if (c_oserct_trendlineDISPRSQR === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setDispRSqr(oNewVal.m_val);
    }
    else if (c_oserct_trendlineDISPEQ === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setDispEq(oNewVal.m_val);
    }
    else if (c_oserct_trendlineTRENDLINELBL === type) {
        var oNewVal = new AscFormat.CDLbl();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TrendlineLbl(t, l, oNewVal);
        });
		oNewVal.correctValues();
        val.setTrendlineLbl(oNewVal);
    }
    else if (c_oserct_trendlineEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_TrendlineType = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_trendlinetypeVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_trendlinetypeEXP: val.m_val = TRENDLINE_TYPE_EXP; break;
            case st_trendlinetypeLINEAR: val.m_val = TRENDLINE_TYPE_LINEAR; break;
            case st_trendlinetypeLOG: val.m_val = TRENDLINE_TYPE_LOG; break;
            case st_trendlinetypeMOVINGAVG: val.m_val = TRENDLINE_TYPE_MOVING_AVG; break;
            case st_trendlinetypePOLY: val.m_val = TRENDLINE_TYPE_POLY; break;
            case st_trendlinetypePOWER: val.m_val = TRENDLINE_TYPE_POWER; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Order = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_orderVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetUChar();
        val.m_val = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Period = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_periodVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetULongLE();
        val.m_val = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_TrendlineLbl = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_trendlinelblLAYOUT === type) {
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Layout(t, l, val);
        });
    }
    else if (c_oserct_trendlinelblTX === type) {
        var oNewVal = new AscFormat.CChartText();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Tx(t, l, oNewVal);
        });
        oNewVal.setChart(this.curChart);
        val.setTx(oNewVal);
    }
    else if (c_oserct_trendlinelblNUMFMT === type) {
        var oNewVal = new AscFormat.CNumFmt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumFmt(t, l, oNewVal);
        });
        val.setNumFmt(oNewVal);
    }
    else if (c_oserct_trendlinelblSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_trendlinelblTXPR === type) {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_trendlinelblEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_ErrBars = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_errbarsERRDIR === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ErrDir(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setErrDir(oNewVal.m_val);
    }
    else if (c_oserct_errbarsERRBARTYPE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ErrBarType(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setErrBarType(oNewVal.m_val);
    }
    else if (c_oserct_errbarsERRVALTYPE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ErrValType(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setErrValType(oNewVal.m_val);
    }
    else if (c_oserct_errbarsNOENDCAP === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setNoEndCap(oNewVal.m_val);
    }
    else if (c_oserct_errbarsPLUS === type) {
        var oNewVal = new AscFormat.CMinusPlus();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumDataSource(t, l, oNewVal);
        });
        val.setPlus(oNewVal);
    }
    else if (c_oserct_errbarsMINUS === type) {
        var oNewVal = new AscFormat.CMinusPlus();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumDataSource(t, l, oNewVal);
        });
        val.setMinus(oNewVal);
    }
    else if (c_oserct_errbarsVAL === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Double(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setVal(oNewVal.m_val);
    }
    else if (c_oserct_errbarsSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_errbarsEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_ErrDir = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_errdirVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_errdirX: val.m_val = ERR_DIR_X; break;
            case st_errdirY: val.m_val = ERR_DIR_Y; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_ErrBarType = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_errbartypeVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_errbartypeBOTH: val.m_val = ERR_BAR_TYPE_BOTH; break;
            case st_errbartypeMINUS: val.m_val = ERR_BAR_TYPE_MINUS; break;
            case st_errbartypePLUS: val.m_val = ERR_BAR_TYPE_PLUS; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_ErrValType = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_errvaltypeVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_errvaltypeCUST: val.m_val = ERR_VAL_TYPE_CUST; break;
            case st_errvaltypeFIXEDVAL: val.m_val = ERR_VAL_TYPE_FIXED_VAL; break;
            case st_errvaltypePERCENTAGE: val.m_val = ERR_VAL_TYPE_PERCENTAGE; break;
            case st_errvaltypeSTDDEV: val.m_val = ERR_VAL_TYPE_STD_DEV; break;
            case st_errvaltypeSTDERR: val.m_val = ERR_VAL_TYPE_STD_ERR; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_NumDataSource = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_numdatasourceNUMLIT === type) {
        var oNewVal = new AscFormat.CNumLit();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumData(t, l, oNewVal);
        });
        val.setNumLit(oNewVal);
    }
    else if (c_oserct_numdatasourceNUMREF === type) {
        var oNewVal = new AscFormat.CNumRef();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumRef(t, l, oNewVal);
        });
        val.setNumRef(oNewVal);
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_NumData = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_numdataFORMATCODE === type) {
        val.setFormatCode(this.stream.GetString2LE(length));
    }
    else if (c_oserct_numdataPTCOUNT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setPtCount(oNewVal.m_val);
    }
    else if (c_oserct_numdataPT === type) {
        var oNewVal = new AscFormat.CNumericPoint();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumVal(t, l, oNewVal);
        });
        val.addPt(oNewVal);
    }
    else if (c_oserct_numdataEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_NumVal = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_numvalV === type) {
        var nVal = parseFloat(this.stream.GetString2LE(length));
        if(isNaN(nVal))
            nVal = 0;
        val.setVal(nVal);
    }
    else if (c_oserct_numvalIDX === type) {
        val.setIdx(this.stream.GetULongLE());
    }
    else if (c_oserct_numvalFORMATCODE === type) {
        val.setFormatCode(this.stream.GetString2LE(length));
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_NumRef = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_numrefF === type) {
        val.setF(this.stream.GetString2LE(length));
    }
    else if (c_oserct_numrefNUMCACHE === type) {
        var oNewVal = new AscFormat.CNumLit();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumData(t, l, oNewVal);
        });
        val.setNumCache(oNewVal);
    }
    else if (c_oserct_numrefEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_AxDataSource = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_axdatasourceMULTILVLSTRREF === type) {
        var oNewVal = new AscFormat.CMultiLvlStrRef();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_MultiLvlStrRef(t, l, oNewVal);
        });
        val.setMultiLvlStrRef(oNewVal);
    }
    else if (c_oserct_axdatasourceNUMLIT === type) {
        var oNewVal = new AscFormat.CNumLit();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumData(t, l, oNewVal);
        });
        val.setNumLit(oNewVal);
    }
    else if (c_oserct_axdatasourceNUMREF === type) {
        var oNewVal = new AscFormat.CNumRef();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumRef(t, l, oNewVal);
        });
        val.setNumRef(oNewVal);
    }
    else if (c_oserct_axdatasourceSTRLIT === type) {
        var oNewVal = new AscFormat.CStrCache();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_StrData(t, l, oNewVal);
        });
        val.setStrLit(oNewVal);
    }
    else if (c_oserct_axdatasourceSTRREF === type) {
        var oNewVal = new AscFormat.CStrRef();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_StrRef(t, l, oNewVal);
        });
        val.setStrRef(oNewVal);
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_MultiLvlStrRef = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_multilvlstrrefF === type) {
        val.setF(this.stream.GetString2LE(length));
    }
    else if (c_oserct_multilvlstrrefMULTILVLSTRCACHE === type) {
        var oNewVal = new AscFormat.CMultiLvlStrCache();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_MultiLvlStrData(t, l, oNewVal);
        });
        val.setMultiLvlStrCache(oNewVal);
    }
    else if (c_oserct_multilvlstrrefEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_lvl = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_lvlPT === type) {
        var oNewVal = new AscFormat.CStringPoint();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_StrVal(t, l, oNewVal);
        });
        val.addPt(oNewVal);
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_MultiLvlStrData = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_multilvlstrdataPTCOUNT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setPtCount(oNewVal.m_val);
    }
    else if (c_oserct_multilvlstrdataLVL === type) {
        var oNewVal = new AscFormat.CStrCache();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_lvl(t, l, oNewVal);
        });
        val.addLvl(oNewVal);
    }
    else if (c_oserct_multilvlstrdataEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_BubbleChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_bubblechartVARYCOLORS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setVaryColors(oNewVal.m_val);
    }
    else if (c_oserct_bubblechartSER === type) {
        var oNewVal = new AscFormat.CBubbleSeries();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_BubbleSer(t, l, oNewVal);
        });
        val.addSer(oNewVal);
    }
    else if (c_oserct_bubblechartDLBLS === type) {
        var oNewVal = new AscFormat.CDLbls();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbls(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.setDLbls(oNewVal);
    }
    else if (c_oserct_bubblechartBUBBLE3D === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setBubble3D(oNewVal.m_val);
    }
    else if (c_oserct_bubblechartBUBBLESCALE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_BubbleScale(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setBubbleScale(oNewVal.m_val);
    }
    else if (c_oserct_bubblechartSHOWNEGBUBBLES === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setShowNegBubbles(oNewVal.m_val);
    }
    else if (c_oserct_bubblechartSIZEREPRESENTS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_SizeRepresents(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setSizeRepresents(oNewVal.m_val);
    }
    else if (c_oserct_bubblechartAXID === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            aChartWithAxis.push({ axisId: oNewVal.m_val, chart: val });
    }
    else if (c_oserct_bubblechartEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_bandFmts = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_bandfmtsBANDFMT === type) {
        var oNewVal = new AscFormat.CBandFmt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_BandFmt(t, l, oNewVal);
        });
        val.addBandFmt(oNewVal);
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Surface3DChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_surface3dchartWIREFRAME === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setWireframe(oNewVal.m_val);
    }
    else if (c_oserct_surface3dchartSER === type) {
        var oNewVal = new AscFormat.CSurfaceSeries();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_SurfaceSer(t, l, oNewVal);
        });
        val.addSer(oNewVal);
    }
    else if (c_oserct_surface3dchartBANDFMTS === type) {
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_bandFmts(t, l, val);
        });
    }
    else if (c_oserct_surface3dchartAXID === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            aChartWithAxis.push({ axisId: oNewVal.m_val, chart: val, surface: true });
    }
    else if (c_oserct_surface3dchartEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_SurfaceSer = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_surfaceserIDX === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setIdx(oNewVal.m_val);
    }
    else if (c_oserct_surfaceserORDER === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setOrder(oNewVal.m_val);
    }
    else if (c_oserct_surfaceserTX === type) {
        var oNewVal = new AscFormat.CTx();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_SerTx(t, l, oNewVal);
        });
        val.setTx(oNewVal);
    }
    else if (c_oserct_surfaceserSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_surfaceserCAT === type) {
        var oNewVal = new AscFormat.CCat();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AxDataSource(t, l, oNewVal);
        });
        val.setCat(oNewVal);
    }
    else if (c_oserct_surfaceserVAL === type) {
        var oNewVal = new AscFormat.CYVal();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumDataSource(t, l, oNewVal);
        });
        val.setVal(oNewVal);
    }
    else if (c_oserct_surfaceserEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else if(c_oserct_chartFiltering === type) {
	    res = this.bcr.Read1(length, function (t, l) {
		    return oThis.ReadCT_ChartFiltering(t, l, val);
	    });
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_BandFmt = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_bandfmtIDX === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setIdx(oNewVal.m_val);
    }
    else if (c_oserct_bandfmtSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_SurfaceChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_surfacechartWIREFRAME === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setWireframe(oNewVal.m_val);
    }
    else if (c_oserct_surfacechartSER === type) {
        var oNewVal = new AscFormat.CSurfaceSeries();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_SurfaceSer(t, l, oNewVal);
        });
        val.addSer(oNewVal);
    }
    else if (c_oserct_surfacechartBANDFMTS === type) {
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_bandFmts(t, l, val);
        });
    }
    else if (c_oserct_surfacechartAXID === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            aChartWithAxis.push({ axisId: oNewVal.m_val, chart: val, surface: true });
    }
    else if (c_oserct_surfacechartEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_SecondPieSize = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_secondpiesizeVAL === type) {
        val.m_val = this.ParsePersent(this.stream.GetString2LE(length));
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_SplitType = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_splittypeVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_splittypeAUTO: val.m_val = SPLIT_TYPE_AUTO; break;
            case st_splittypeCUST: val.m_val = SPLIT_TYPE_CUST; break;
            case st_splittypePERCENT: val.m_val = SPLIT_TYPE_PERCENT; break;
            case st_splittypePOS: val.m_val = SPLIT_TYPE_POS; break;
            case st_splittypeVAL: val.m_val = SPLIT_TYPE_VAL; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_OfPieType = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_ofpietypeVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_ofpietypePIE: val.m_val = OF_PIE_TYPE_PIE; break;
            case st_ofpietypeBAR: val.m_val = OF_PIE_TYPE_BAR; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_custSplit = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_custsplitSECONDPIEPT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.addCustSplit(oNewVal.m_val);
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_OfPieChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_ofpiechartOFPIETYPE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_OfPieType(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setOfPieType(oNewVal.m_val);
    }
    else if (c_oserct_ofpiechartVARYCOLORS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setVaryColors(oNewVal.m_val);
    }
    else if (c_oserct_ofpiechartSER === type) {
        var oNewVal = new AscFormat.CPieSeries();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PieSer(t, l, oNewVal);
        });
        val.addSer(oNewVal);
    }
    else if (c_oserct_ofpiechartDLBLS === type) {
        var oNewVal = new AscFormat.CDLbls();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbls(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.setDLbls(oNewVal);
    }
    else if (c_oserct_ofpiechartGAPWIDTH === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_GapAmount(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setGapWidth(oNewVal.m_val);
    }
    else if (c_oserct_ofpiechartSPLITTYPE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_SplitType(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setSplitType(oNewVal.m_val)
    }
    else if (c_oserct_ofpiechartSPLITPOS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Double(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setSplitPos(oNewVal.m_val);
    }
    else if (c_oserct_ofpiechartCUSTSPLIT === type) {
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_custSplit(t, l, val);
        });
    }
    else if (c_oserct_ofpiechartSECONDPIESIZE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_SecondPieSize(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setSecondPieSize(oNewVal.m_val);
    }
    else if (c_oserct_ofpiechartSERLINES === type) {
        var oNewVal = { spPr: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartLines(t, l, oNewVal);
        });
        if (null != oNewVal.spPr)
            val.setSerLines(oNewVal.spPr);
        else
            val.setSerLines(new AscFormat.CSpPr());
    }
    else if (c_oserct_ofpiechartEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_PieSer = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_pieserIDX === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setIdx(oNewVal.m_val);
    }
    else if (c_oserct_pieserORDER === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setOrder(oNewVal.m_val);
    }
    else if (c_oserct_pieserTX === type) {
        var oNewVal = new AscFormat.CTx();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_SerTx(t, l, oNewVal);
        });
        val.setTx(oNewVal);
    }
    else if (c_oserct_pieserSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_pieserEXPLOSION === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setExplosion(oNewVal.m_val);
    }
    else if (c_oserct_pieserDPT === type) {
        var oNewVal = new AscFormat.CDPt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DPt(t, l, oNewVal);
        });
        val.addDPt(oNewVal);
    }
    else if (c_oserct_pieserDLBLS === type) {
        var oNewVal = new AscFormat.CDLbls();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbls(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.setDLbls(oNewVal);
    }
    else if (c_oserct_pieserCAT === type) {
        var oNewVal = new AscFormat.CCat();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AxDataSource(t, l, oNewVal);
        });
        val.setCat(oNewVal);
    }
    else if (c_oserct_pieserVAL === type) {
        var oNewVal = new AscFormat.CYVal();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumDataSource(t, l, oNewVal);
        });
        val.setVal(oNewVal);
    }
    else if (c_oserct_pieserEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else if(c_oserct_chartFiltering === type) {
	    res = this.bcr.Read1(length, function (t, l) {
		    return oThis.ReadCT_ChartFiltering(t, l, val);
	    });
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_GapAmount = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_gapamountVAL === type) {
        val.m_val = this.ParsePersent(this.stream.GetString2LE(length));
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Bar3DChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_bar3dchartBARDIR === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_BarDir(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setBarDir(oNewVal.m_val);
    }
    else if (c_oserct_bar3dchartGROUPING === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_BarGrouping(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setGrouping(oNewVal.m_val);
    }
    else if (c_oserct_bar3dchartVARYCOLORS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setVaryColors(oNewVal.m_val);
    }
    else if (c_oserct_bar3dchartSER === type) {
        var oNewVal = new AscFormat.CBarSeries();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_BarSer(t, l, oNewVal);
        });
        val.addSer(oNewVal);
    }
    else if (c_oserct_bar3dchartDLBLS === type) {
        var oNewVal = new AscFormat.CDLbls();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbls(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.setDLbls(oNewVal);
    }
    else if (c_oserct_bar3dchartGAPWIDTH === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_GapAmount(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setGapWidth(oNewVal.m_val);
    }
    else if (c_oserct_bar3dchartGAPDEPTH === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_GapAmount(t, l, oNewVal);
        });
        if(null != oNewVal.m_val)
            val.setGapDepth(oNewVal.m_val);
    }
    else if (c_oserct_bar3dchartSHAPE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Shape(t, l, oNewVal);
        });
        if(null != oNewVal.m_val)
            val.setShape(oNewVal.m_val);
    }
    else if (c_oserct_bar3dchartAXID === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            aChartWithAxis.push({ axisId: oNewVal.m_val, chart: val });
    }
    else if (c_oserct_bar3dchartEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_BarDir = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_bardirVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_bardirBAR: val.m_val = AscFormat.BAR_DIR_BAR; break;
            case st_bardirCOL: val.m_val = AscFormat.BAR_DIR_COL; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_BarGrouping = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_bargroupingVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_bargroupingPERCENTSTACKED: val.m_val = AscFormat.BAR_GROUPING_PERCENT_STACKED; break;
            case st_bargroupingCLUSTERED: val.m_val = AscFormat.BAR_GROUPING_CLUSTERED; break;
            case st_bargroupingSTANDARD: val.m_val = AscFormat.BAR_GROUPING_STANDARD; break;
            case st_bargroupingSTACKED: val.m_val = AscFormat.BAR_GROUPING_STACKED; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_BarSer = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_barserIDX === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setIdx(oNewVal.m_val);
    }
    else if (c_oserct_barserORDER === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setOrder(oNewVal.m_val);
    }
    else if (c_oserct_barserTX === type) {
        var oNewVal = new AscFormat.CTx();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_SerTx(t, l, oNewVal);
        });
        val.setTx(oNewVal);
    }
    else if (c_oserct_barserSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_barserINVERTIFNEGATIVE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setInvertIfNegative(oNewVal.m_val);
    }
    else if (c_oserct_barserPICTUREOPTIONS === type) {
        var oNewVal = new AscFormat.CPictureOptions();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PictureOptions(t, l, oNewVal);
        });
        val.setPictureOptions(oNewVal);
    }
    else if (c_oserct_barserDPT === type) {
        var oNewVal = new AscFormat.CDPt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DPt(t, l, oNewVal);
        });
        val.addDPt(oNewVal);
    }
    else if (c_oserct_barserDLBLS === type) {
        var oNewVal = new AscFormat.CDLbls();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbls(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.setDLbls(oNewVal);
    }
    else if (c_oserct_barserTRENDLINE === type) {
        //todo array
        var oNewVal = new AscFormat.CTrendLine();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Trendline(t, l, oNewVal);
        });
		let tlType = oNewVal.trendlineType;
		let isAllowedType = (tlType !== TRENDLINE_TYPE_EXP && tlType !== TRENDLINE_TYPE_POLY)
		if (isAllowedType) {
			val.setTrendline(oNewVal);
		}
    }
    else if (c_oserct_barserERRBARS === type) {
        var oNewVal = new AscFormat.CErrBars();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ErrBars(t, l, oNewVal);
        });
        val.addErrBars(oNewVal);
    }
    else if (c_oserct_barserCAT === type) {
        var oNewVal = new AscFormat.CCat();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AxDataSource(t, l, oNewVal);
        });
        val.setCat(oNewVal);
    }
    else if (c_oserct_barserVAL === type) {
        var oNewVal = new AscFormat.CYVal();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumDataSource(t, l, oNewVal);
        });
        val.setVal(oNewVal);
    }
    else if (c_oserct_barserSHAPE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Shape(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setShape(oNewVal.m_val);
    }
    else if (c_oserct_barserEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else if(c_oserct_chartFiltering === type) {
	    res = this.bcr.Read1(length, function (t, l) {
		    return oThis.ReadCT_ChartFiltering(t, l, val);
	    });
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_ChartFiltering = function(type, length, val) {
	let res = c_oSerConstants.ReadOk;
	let oThis = this;
	if (c_oserct_dataLabelsRange === type) {
		var oNewVal = new AscFormat.CStrRef();
		res = this.bcr.Read1(length, function (t, l) {
			return oThis.ReadCT_dataLabelsRange(t, l, oNewVal);
		});
		val.setDataLabelsRange(oNewVal);
	}
	else
		res = c_oSerConstants.ReadUnknown;
	return res;
};
BinaryChartReader.prototype.ReadCT_dataLabelsRange = function(type, length, val) {
	let res = c_oSerConstants.ReadOk;
	let oThis = this;
	if (0 === type) {
		val.setF(this.stream.GetString2LE(length));
	}
	else if(1 === type) {
		var oNewVal = new AscFormat.CStrCache();
		res = this.bcr.Read1(length, function (t, l) {
			return oThis.ReadCT_StrData(t, l, oNewVal);
		});
		val.setStrCache(oNewVal);
	}
	else
		res = c_oSerConstants.ReadUnknown;
	return res;
};
BinaryChartReader.prototype.ReadCT_Shape = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_shapeVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_shapeCONE: val.m_val = AscFormat.BAR_SHAPE_CONE; break;
            case st_shapeCONETOMAX: val.m_val = AscFormat.BAR_SHAPE_CONETOMAX; break;
            case st_shapeBOX: val.m_val = AscFormat.BAR_SHAPE_BOX; break;
            case st_shapeCYLINDER: val.m_val = AscFormat.BAR_SHAPE_CYLINDER; break;
            case st_shapePYRAMID: val.m_val = AscFormat.BAR_SHAPE_PYRAMID; break;
            case st_shapePYRAMIDTOMAX: val.m_val = AscFormat.BAR_SHAPE_PYRAMIDTOMAX; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Overlap = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_overlapVAL === type) {
        val.m_val = this.ParsePersent(this.stream.GetString2LE(length));
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_BarChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_barchartBARDIR === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_BarDir(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setBarDir(oNewVal.m_val);
    }
    else if (c_oserct_barchartGROUPING === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_BarGrouping(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setGrouping(oNewVal.m_val);
    }
    else if (c_oserct_barchartVARYCOLORS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setVaryColors(oNewVal.m_val);
    }
    else if (c_oserct_barchartSER === type) {
        var oNewVal = new AscFormat.CBarSeries();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_BarSer(t, l, oNewVal);
        });
        val.addSer(oNewVal);
    }
    else if (c_oserct_barchartDLBLS === type) {
        var oNewVal = new AscFormat.CDLbls();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbls(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.setDLbls(oNewVal);
    }
    else if (c_oserct_barchartGAPWIDTH === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_GapAmount(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setGapWidth(oNewVal.m_val);
    }
    else if (c_oserct_barchartOVERLAP === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Overlap(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setOverlap(oNewVal.m_val);
    }
    else if (c_oserct_barchartSERLINES === type) {
        //todo array
        var oNewVal = { spPr: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartLines(t, l, oNewVal);
        });
        if (null != oNewVal.spPr)
            val.setSerLines(oNewVal.spPr);
        else
            val.setSerLines(new AscFormat.CSpPr());
    }
    else if (c_oserct_barchartAXID === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            aChartWithAxis.push({ axisId: oNewVal.m_val, chart: val });
    }
    else if (c_oserct_barchartEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_HoleSize = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_holesizeVAL === type) {
        val.m_val = this.ParsePersent(this.stream.GetString2LE(length));
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_DoughnutChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_doughnutchartVARYCOLORS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setVaryColors(oNewVal.m_val);
    }
    else if (c_oserct_doughnutchartSER === type) {
        var oNewVal = new AscFormat.CPieSeries();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PieSer(t, l, oNewVal);
        });
        val.addSer(oNewVal);
    }
    else if (c_oserct_doughnutchartDLBLS === type) {
        var oNewVal = new AscFormat.CDLbls();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbls(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.setDLbls(oNewVal);
    }
    else if (c_oserct_doughnutchartFIRSTSLICEANG === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_FirstSliceAng(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setFirstSliceAng(oNewVal.m_val);
    }
    else if (c_oserct_doughnutchartHOLESIZE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_HoleSize(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setHoleSize(oNewVal.m_val);
    }
    else if (c_oserct_doughnutchartEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_FirstSliceAng = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_firstsliceangVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetULongLE();
        val.m_val = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Pie3DChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_pie3dchartVARYCOLORS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setVaryColors(oNewVal.m_val);
    }
    else if (c_oserct_pie3dchartSER === type) {
        var oNewVal = new AscFormat.CPieSeries();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PieSer(t, l, oNewVal);
        });
        val.addSer(oNewVal);
    }
    else if (c_oserct_pie3dchartDLBLS === type) {
        var oNewVal = new AscFormat.CDLbls();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbls(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.setDLbls(oNewVal);
    }
    else if (c_oserct_pie3dchartEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_PieChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_piechartVARYCOLORS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setVaryColors(oNewVal.m_val);
    }
    else if (c_oserct_piechartSER === type) {
        var oNewVal = new AscFormat.CPieSeries();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PieSer(t, l, oNewVal);
        });
        val.addSer(oNewVal);
    }
    else if (c_oserct_piechartDLBLS === type) {
        var oNewVal = new AscFormat.CDLbls();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbls(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.setDLbls(oNewVal);
    }
    else if (c_oserct_piechartFIRSTSLICEANG === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_FirstSliceAng(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setFirstSliceAng(oNewVal.m_val);
    }
    else if (c_oserct_piechartEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_ScatterSer = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_scatterserIDX === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setIdx(oNewVal.m_val);
    }
    else if (c_oserct_scatterserORDER === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setOrder(oNewVal.m_val);
    }
    else if (c_oserct_scatterserTX === type) {
        var oNewVal = new AscFormat.CTx();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_SerTx(t, l, oNewVal);
        });
        val.setTx(oNewVal);
    }
    else if (c_oserct_scatterserSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_scatterserMARKER === type) {
        var oNewVal = new AscFormat.CMarker();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Marker(t, l, oNewVal);
        });
        val.setMarker(oNewVal);
    }
    else if (c_oserct_scatterserDPT === type) {
        var oNewVal = new AscFormat.CDPt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DPt(t, l, oNewVal);
        });
        val.addDPt(oNewVal);
    }
    else if (c_oserct_scatterserDLBLS === type) {
        var oNewVal = new AscFormat.CDLbls();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbls(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.setDLbls(oNewVal);
    }
    else if (c_oserct_scatterserTRENDLINE === type) {
        //todo array
        var oNewVal = new AscFormat.CTrendLine();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Trendline(t, l, oNewVal);
        });
        val.setTrendline(oNewVal);
    }
    else if (c_oserct_scatterserERRBARS === type) {
        var oNewVal = new AscFormat.CErrBars();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ErrBars(t, l, oNewVal);
        });
        val.addErrBars(oNewVal);
    }
    else if (c_oserct_scatterserXVAL === type) {
        var oNewVal = new AscFormat.CCat();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AxDataSource(t, l, oNewVal);
        });
        val.setXVal(oNewVal);
    }
    else if (c_oserct_scatterserYVAL === type) {
        var oNewVal = new AscFormat.CYVal();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumDataSource(t, l, oNewVal);
        });
        val.setYVal(oNewVal);
    }
    else if (c_oserct_scatterserSMOOTH === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val){
            val.setSmooth(oNewVal.m_val);
        }
        else{
            val.setSmooth(true);
        }
    }
    else if (c_oserct_scatterserEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else if(c_oserct_chartFiltering === type) {
	    res = this.bcr.Read1(length, function (t, l) {
		    return oThis.ReadCT_ChartFiltering(t, l, val);
	    });
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_ScatterStyle = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_scatterstyleVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_scatterstyleNONE: val.m_val = AscFormat.SCATTER_STYLE_NONE; break;
            case st_scatterstyleLINE: val.m_val = AscFormat.SCATTER_STYLE_LINE; break;
            case st_scatterstyleLINEMARKER: val.m_val = AscFormat.SCATTER_STYLE_LINE_MARKER; break;
            case st_scatterstyleMARKER: val.m_val = AscFormat.SCATTER_STYLE_MARKER; break;
            case st_scatterstyleSMOOTH: val.m_val = AscFormat.SCATTER_STYLE_SMOOTH; break;
            case st_scatterstyleSMOOTHMARKER: val.m_val = AscFormat.SCATTER_STYLE_SMOOTH_MARKER; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_ScatterChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_scatterchartSCATTERSTYLE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ScatterStyle(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setScatterStyle(oNewVal.m_val);
    }
    else if (c_oserct_scatterchartVARYCOLORS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setVaryColors(oNewVal.m_val);
    }
    else if (c_oserct_scatterchartSER === type) {
        var oNewVal = new AscFormat.CScatterSeries();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ScatterSer(t, l, oNewVal);
        });
        val.addSer(oNewVal);
        if(oNewVal.smooth === null){
           oNewVal.setSmooth(false);
        }
    }
    else if (c_oserct_scatterchartDLBLS === type) {
        var oNewVal = new AscFormat.CDLbls();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbls(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.setDLbls(oNewVal);
    }
    else if (c_oserct_scatterchartAXID === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            aChartWithAxis.push({ axisId: oNewVal.m_val, chart: val });
    }
    else if (c_oserct_scatterchartEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_RadarSer = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_radarserIDX === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setIdx(oNewVal.m_val);
    }
    else if (c_oserct_radarserORDER === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setOrder(oNewVal.m_val);
    }
    else if (c_oserct_radarserTX === type) {
        var oNewVal = new AscFormat.CTx();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_SerTx(t, l, oNewVal);
        });
        val.setTx(oNewVal);
    }
    else if (c_oserct_radarserSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_radarserMARKER === type) {
        var oNewVal = new AscFormat.CMarker();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Marker(t, l, oNewVal);
        });
        val.setMarker(oNewVal);
    }
    else if (c_oserct_radarserDPT === type) {
        var oNewVal = new AscFormat.CDPt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DPt(t, l, oNewVal);
        });
        val.addDPt(oNewVal);
    }
    else if (c_oserct_radarserDLBLS === type) {
        var oNewVal = new AscFormat.CDLbls();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbls(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.setDLbls(oNewVal);
    }
    else if (c_oserct_radarserCAT === type) {
        var oNewVal = new AscFormat.CCat();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AxDataSource(t, l, oNewVal);
        });
        val.setCat(oNewVal);
    }
    else if (c_oserct_radarserVAL === type) {
        var oNewVal = new AscFormat.CYVal();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumDataSource(t, l, oNewVal);
        });
        val.setVal(oNewVal);
    }
    else if (c_oserct_radarserEXTLST === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else if(c_oserct_chartFiltering === type) {
	    res = this.bcr.Read1(length, function (t, l) {
		    return oThis.ReadCT_ChartFiltering(t, l, val);
	    });
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_RadarStyle = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_radarstyleVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_radarstyleSTANDARD: val.m_val = RADAR_STYLE_STANDARD; break;
            case st_radarstyleMARKER: val.m_val = RADAR_STYLE_MARKER; break;
            case st_radarstyleFILLED: val.m_val = RADAR_STYLE_FILLED; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_RadarChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_radarchartRADARSTYLE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_RadarStyle(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setRadarStyle(oNewVal.m_val);
    }
    else if (c_oserct_radarchartVARYCOLORS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setVaryColors(oNewVal.m_val);
    }
    else if (c_oserct_radarchartSER === type) {
        var oNewVal = new AscFormat.CRadarSeries();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_RadarSer(t, l, oNewVal);
        });
        val.addSer(oNewVal);
    }
    else if (c_oserct_radarchartDLBLS === type) {
        var oNewVal = new AscFormat.CDLbls();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbls(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.setDLbls(oNewVal);
    }
    else if (c_oserct_radarchartAXID === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            aChartWithAxis.push({ axisId: oNewVal.m_val, chart: val });
    }
    else if (c_oserct_radarchartEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_StockChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_stockchartSER === type) {
        var oNewVal = new AscFormat.CLineSeries();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_LineSer(t, l, oNewVal);
        });
        val.addSer(oNewVal);
    }
    else if (c_oserct_stockchartDLBLS === type) {
        var oNewVal = new AscFormat.CDLbls();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbls(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.setDLbls(oNewVal);
    }
    else if (c_oserct_stockchartDROPLINES === type) {
        var oNewVal = { spPr: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartLines(t, l, oNewVal);
        });
        if (null != oNewVal.spPr)
            val.setDropLines(oNewVal.spPr);
        else
            val.setDropLines(new AscFormat.CSpPr());
    }
    else if (c_oserct_stockchartHILOWLINES === type) {
        var oNewVal = { spPr: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartLines(t, l, oNewVal);
        });
        if (null != oNewVal.spPr)
            val.setHiLowLines(oNewVal.spPr);
        else
            val.setHiLowLines(new AscFormat.CSpPr());
    }
    else if (c_oserct_stockchartUPDOWNBARS === type) {
        var oNewVal = new AscFormat.CUpDownBars();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UpDownBars(t, l, oNewVal);
        });
        val.setUpDownBars(oNewVal);
    }
    else if (c_oserct_stockchartAXID === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            aChartWithAxis.push({ axisId: oNewVal.m_val, chart: val });
    }
    else if (c_oserct_stockchartEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_LineSer = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_lineserIDX === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setIdx(oNewVal.m_val);
    }
    else if (c_oserct_lineserORDER === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setOrder(oNewVal.m_val);
    }
    else if (c_oserct_lineserTX === type) {
        var oNewVal = new AscFormat.CTx();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_SerTx(t, l, oNewVal);
        });
        val.setTx(oNewVal);
    }
    else if (c_oserct_lineserSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_lineserMARKER === type) {
        var oNewVal = new AscFormat.CMarker();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Marker(t, l, oNewVal);
        });
        val.setMarker(oNewVal);
    }
    else if (c_oserct_lineserDPT === type) {
        var oNewVal = new AscFormat.CDPt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DPt(t, l, oNewVal);
        });
        val.addDPt(oNewVal);
    }
    else if (c_oserct_lineserDLBLS === type) {
        var oNewVal = new AscFormat.CDLbls();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbls(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.setDLbls(oNewVal);
    }
    else if (c_oserct_lineserTRENDLINE === type) {
        //todo array
        var oNewVal = new AscFormat.CTrendLine();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Trendline(t, l, oNewVal);
        });
        val.setTrendline(oNewVal);
    }
    else if (c_oserct_lineserERRBARS === type) {
        var oNewVal = new AscFormat.CErrBars();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ErrBars(t, l, oNewVal);
        });
        val.addErrBars(oNewVal);
    }
    else if (c_oserct_lineserCAT === type) {
        var oNewVal = new AscFormat.CCat();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AxDataSource(t, l, oNewVal);
        });
        val.setCat(oNewVal);
    }
    else if (c_oserct_lineserVAL === type) {
        var oNewVal = new AscFormat.CYVal();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumDataSource(t, l, oNewVal);
        });
        val.setVal(oNewVal);
    }
    else if (c_oserct_lineserSMOOTH === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setSmooth(oNewVal.m_val);
        }
        else {
            val.setSmooth(true);
        }
    }
    else if (c_oserct_lineserEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else if(c_oserct_chartFiltering === type) {
	    res = this.bcr.Read1(length, function (t, l) {
		    return oThis.ReadCT_ChartFiltering(t, l, val);
	    });
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_UpDownBars = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_updownbarsGAPWIDTH === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_GapAmount(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setGapWidth(oNewVal.m_val);
    }
    else if (c_oserct_updownbarsUPBARS === type) {
        var oNewVal = { spPr: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UpDownBar(t, l, oNewVal);
        });
        if (null != oNewVal.spPr)
            val.setUpBars(oNewVal.spPr);
        else
            val.setUpBars(new AscFormat.CSpPr());
    }
    else if (c_oserct_updownbarsDOWNBARS === type) {
        var oNewVal = { spPr: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UpDownBar(t, l, oNewVal);
        });
        if (null != oNewVal.spPr)
            val.setDownBars(oNewVal.spPr);
        else
            val.setDownBars(new AscFormat.CSpPr());
    }
    else if (c_oserct_updownbarsEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_UpDownBar = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_updownbarSPPR === type) {
        val.spPr = this.ReadSpPr(length);
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Line3DChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_line3dchartGROUPING === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Grouping(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setGrouping(oNewVal.m_val);
    }
    else if (c_oserct_line3dchartVARYCOLORS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setVaryColors(oNewVal.m_val);
    }
    else if (c_oserct_line3dchartSER === type) {
        var oNewVal = new AscFormat.CLineSeries();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_LineSer(t, l, oNewVal);
        });
        if(oNewVal.smooth === null){
            oNewVal.setSmooth(false);
        }
        val.addSer(oNewVal);
    }
    else if (c_oserct_line3dchartDLBLS === type) {
        var oNewVal = new AscFormat.CDLbls();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbls(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.setDLbls(oNewVal);
    }
    else if (c_oserct_line3dchartDROPLINES === type) {
        var oNewVal = { spPr: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartLines(t, l, oNewVal);
        });
        if (null != oNewVal.spPr)
            val.setDropLines(oNewVal.spPr);
        else
            val.setDropLines(new AscFormat.CSpPr());
    }
    else if (c_oserct_line3dchartGAPDEPTH === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_GapAmount(t, l, oNewVal);
        });
        //val.m_gapDepth = oNewVal;
    }
    else if (c_oserct_line3dchartAXID === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            aChartWithAxis.push({ axisId: oNewVal.m_val, chart: val });
    }
    else if (c_oserct_line3dchartEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Grouping = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_groupingVAL === type) {
        switch (this.stream.GetUChar()) {
            case st_groupingPERCENTSTACKED: val.m_val = AscFormat.GROUPING_PERCENT_STACKED; break;
            case st_groupingSTANDARD: val.m_val = AscFormat.GROUPING_STANDARD; break;
            case st_groupingSTACKED: val.m_val = AscFormat.GROUPING_STACKED; break;
        }
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_LineChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_linechartGROUPING === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Grouping(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setGrouping(oNewVal.m_val);
    }
    else if (c_oserct_linechartVARYCOLORS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setVaryColors(oNewVal.m_val);
    }
    else if (c_oserct_linechartSER === type) {
        var oNewVal = new AscFormat.CLineSeries();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_LineSer(t, l, oNewVal);
        });
        val.addSer(oNewVal);
        if(oNewVal.smooth === null){
           oNewVal.setSmooth(false);
        }
    }
    else if (c_oserct_linechartDLBLS === type) {
        var oNewVal = new AscFormat.CDLbls();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbls(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.setDLbls(oNewVal);
    }
    else if (c_oserct_linechartDROPLINES === type) {
        var oNewVal = { spPr: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartLines(t, l, oNewVal);
        });
        if (null != oNewVal.spPr)
            val.setDropLines(oNewVal.spPr);
        else
            val.setDropLines(new AscFormat.CSpPr());
    }
    else if (c_oserct_linechartHILOWLINES === type) {
        var oNewVal = { spPr: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartLines(t, l, oNewVal);
        });
        if (null != oNewVal.spPr)
            val.setHiLowLines(oNewVal.spPr);
        else
            val.setHiLowLines(new AscFormat.CSpPr());
    }
    else if (c_oserct_linechartUPDOWNBARS === type) {
        var oNewVal = new AscFormat.CUpDownBars();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UpDownBars(t, l, oNewVal);
        });
        val.setUpDownBars(oNewVal);
    }
    else if (c_oserct_linechartMARKER === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setMarker(oNewVal.m_val);
    }
    else if (c_oserct_linechartSMOOTH === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val){
            val.setSmooth(oNewVal.m_val);
        }
        else{
            val.setSmooth(true);
        }
    }
    else if (c_oserct_linechartAXID === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            aChartWithAxis.push({ axisId: oNewVal.m_val, chart: val });
    }
    else if (c_oserct_linechartEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Area3DChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_area3dchartGROUPING === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Grouping(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setGrouping(oNewVal.m_val);
    }
    else if (c_oserct_area3dchartVARYCOLORS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setVaryColors(oNewVal.m_val);
    }
    else if (c_oserct_area3dchartSER === type) {
        var oNewVal = new AscFormat.CAreaSeries();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AreaSer(t, l, oNewVal);
        });
        val.addSer(oNewVal);
    }
    else if (c_oserct_area3dchartDLBLS === type) {
        var oNewVal = new AscFormat.CDLbls();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbls(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.setDLbls(oNewVal);
    }
    else if (c_oserct_area3dchartDROPLINES === type) {
        var oNewVal = { spPr: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartLines(t, l, oNewVal);
        });
        if (null != oNewVal.spPr)
            val.setDropLines(oNewVal.spPr);
        else
            val.setDropLines(new AscFormat.CSpPr());
    }
    else if (c_oserct_area3dchartGAPDEPTH === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_GapAmount(t, l, oNewVal);
        });
        //val.m_gapDepth = oNewVal;
    }
    else if (c_oserct_area3dchartAXID === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            aChartWithAxis.push({ axisId: oNewVal.m_val, chart: val });
    }
    else if (c_oserct_area3dchartEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_AreaSer = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_areaserIDX === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setIdx(oNewVal.m_val);
    }
    else if (c_oserct_areaserORDER === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setOrder(oNewVal.m_val);
    }
    else if (c_oserct_areaserTX === type) {
        var oNewVal = new AscFormat.CTx();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_SerTx(t, l, oNewVal);
        });
        val.setTx(oNewVal);
    }
    else if (c_oserct_areaserSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_areaserPICTUREOPTIONS === type) {
        var oNewVal = new AscFormat.CPictureOptions();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PictureOptions(t, l, oNewVal);
        });
        val.setPictureOptions(oNewVal);
    }
    else if (c_oserct_areaserDPT === type) {
        var oNewVal = new AscFormat.CDPt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DPt(t, l, oNewVal);
        });
        val.addDPt(oNewVal);
    }
    else if (c_oserct_areaserDLBLS === type) {
        var oNewVal = new AscFormat.CDLbls();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbls(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.setDLbls(oNewVal);
    }
    else if (c_oserct_areaserTRENDLINE === type) {
        //todo array
        var oNewVal = new AscFormat.CTrendLine();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Trendline(t, l, oNewVal);
        });
        val.setTrendline(oNewVal);
    }
    else if (c_oserct_areaserERRBARS === type) {
        var oNewVal = new AscFormat.CErrBars();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ErrBars(t, l, oNewVal);
        });
        val.addErrBars(oNewVal);
    }
    else if (c_oserct_areaserCAT === type) {
        var oNewVal = new AscFormat.CCat();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AxDataSource(t, l, oNewVal);
        });
        val.setCat(oNewVal);
    }
    else if (c_oserct_areaserVAL === type) {
        var oNewVal = new AscFormat.CYVal();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumDataSource(t, l, oNewVal);
        });
        val.setVal(oNewVal);
    }
    else if (c_oserct_areaserEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else if(c_oserct_chartFiltering === type) {
	    res = this.bcr.Read1(length, function (t, l) {
		    return oThis.ReadCT_ChartFiltering(t, l, val);
	    });
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_AreaChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_areachartGROUPING === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Grouping(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setGrouping(oNewVal.m_val);
    }
    else if (c_oserct_areachartVARYCOLORS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setVaryColors(oNewVal.m_val);
    }
    else if (c_oserct_areachartSER === type) {
        var oNewVal = new AscFormat.CAreaSeries();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AreaSer(t, l, oNewVal);
        });
        val.addSer(oNewVal);
    }
    else if (c_oserct_areachartDLBLS === type) {
        var oNewVal = new AscFormat.CDLbls();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbls(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.setDLbls(oNewVal);
    }
    else if (c_oserct_areachartDROPLINES === type) {
        var oNewVal = { spPr: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartLines(t, l, oNewVal);
        });
        if (null != oNewVal.spPr)
            val.setDropLines(oNewVal.spPr);
        else
            val.setDropLines(new AscFormat.CSpPr());
    }
    else if (c_oserct_areachartAXID === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            aChartWithAxis.push({ axisId: oNewVal.m_val, chart: val });
    }
    else if (c_oserct_areachartEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_PlotArea = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_plotareaLAYOUT === type) {
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Layout(t, l, val);
        });
    }
    else if (c_oserct_plotareaAREA3DCHART === type) {
        var oNewVal = new AscFormat.CAreaChart();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Area3DChart(t, l, oNewVal, aChartWithAxis);
        });
        val.addChart(oNewVal);
    }
    else if (c_oserct_plotareaAREACHART === type) {
        var oNewVal = new AscFormat.CAreaChart();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AreaChart(t, l, oNewVal, aChartWithAxis);
        });
        val.addChart(oNewVal);
    }
    else if (c_oserct_plotareaBAR3DCHART === type) {
        var oNewVal = new AscFormat.CBarChart();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Bar3DChart(t, l, oNewVal, aChartWithAxis);
        });
        oNewVal.set3D(true);
        //3d->2d
        /*if (AscFormat.BAR_GROUPING_STANDARD == oNewVal.grouping)
            oNewVal.setGrouping(AscFormat.BAR_GROUPING_CLUSTERED);
        else if(AscFormat.BAR_GROUPING_CLUSTERED != oNewVal.grouping){
            oNewVal.setOverlap(100);
        }*/
        val.addChart(oNewVal);
    }
    else if (c_oserct_plotareaBARCHART === type) {
        var oNewVal = new AscFormat.CBarChart();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_BarChart(t, l, oNewVal, aChartWithAxis);
        });
        val.addChart(oNewVal);
    }
    else if (c_oserct_plotareaBUBBLECHART === type) {
        var oNewVal = new AscFormat.CBubbleChart();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_BubbleChart(t, l, oNewVal, aChartWithAxis);
        });
        //bubble -> scatter
        var scatter = oNewVal.convertToScutterChart();
		this.CorrectChartWithAxis(oNewVal, scatter, aChartWithAxis);
        val.addChart(scatter);
    }
    else if (c_oserct_plotareaDOUGHNUTCHART === type) {
        var oNewVal = new AscFormat.CDoughnutChart();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DoughnutChart(t, l, oNewVal, aChartWithAxis);
        });
        val.addChart(oNewVal);
    }
    else if (c_oserct_plotareaLINE3DCHART === type) {
        var oNewVal = new AscFormat.CLineChart();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Line3DChart(t, l, oNewVal, aChartWithAxis);
        });
        oNewVal.convert3Dto2D();
        val.addChart(oNewVal);
    }
    else if (c_oserct_plotareaLINECHART === type) {
        var oNewVal = new AscFormat.CLineChart();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_LineChart(t, l, oNewVal, aChartWithAxis);
        });
        val.addChart(oNewVal);
    }
    else if (c_oserct_plotareaOFPIECHART === type) {
        var oNewVal = new AscFormat.COfPieChart();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_OfPieChart(t, l, oNewVal, aChartWithAxis);
        });
        //ofPie -> pie
        var pie = oNewVal.convertToPieChart();
		this.CorrectChartWithAxis(oNewVal, pie, aChartWithAxis);
        val.addChart(pie);
    }
    else if (c_oserct_plotareaPIE3DCHART === type) {
        var oNewVal = new AscFormat.CPieChart();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Pie3DChart(t, l, oNewVal, aChartWithAxis);
        });
        oNewVal.set3D(true);
        //3d->2d
       // oNewVal.setFirstSliceAng(0);
        val.addChart(oNewVal);
    }
    else if (c_oserct_plotareaPIECHART === type) {
        var oNewVal = new AscFormat.CPieChart();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PieChart(t, l, oNewVal, aChartWithAxis);
        });
        val.addChart(oNewVal);
    }
    else if (c_oserct_plotareaRADARCHART === type) {
        var oNewVal = new AscFormat.CRadarChart();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_RadarChart(t, l, oNewVal, aChartWithAxis);
        });
        //radar -> line
        //var line = this.ConvertRadarToLine(oNewVal, aChartWithAxis);
        val.addChart(oNewVal);
    }
    else if (c_oserct_plotareaSCATTERCHART === type) {
        var oNewVal = new AscFormat.CScatterChart();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ScatterChart(t, l, oNewVal, aChartWithAxis);
        });
        val.addChart(oNewVal);
    }
    else if (c_oserct_plotareaSTOCKCHART === type) {
        var oNewVal = new AscFormat.CStockChart();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_StockChart(t, l, oNewVal, aChartWithAxis);
        });
        val.addChart(oNewVal);
    }
    else if (c_oserct_plotareaSURFACE3DCHART === type) {
        var oNewVal = new AscFormat.CSurfaceChart();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Surface3DChart(t, l, oNewVal, aChartWithAxis);
        });
        val.addChart(oNewVal);
    }
    else if (c_oserct_plotareaSURFACECHART === type) {
        var oNewVal = new AscFormat.CSurfaceChart();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_SurfaceChart(t, l, oNewVal, aChartWithAxis);
        });
        val.addChart(oNewVal);
    }
    else if (c_oserct_plotareaCATAX === type) {
        var oNewVal = new AscFormat.CCatAx();

        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_CatAx(t, l, oNewVal);
        });
        val.addAxis(oNewVal);
    }
    else if (c_oserct_plotareaDATEAX === type) {
        var oNewVal = new AscFormat.CDateAx();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DateAx(t, l, oNewVal);
        });
        val.addAxis(oNewVal);
    }
    else if (c_oserct_plotareaSERAX === type) {
        var oNewVal = new AscFormat.CSerAx();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_SerAx(t, l, oNewVal);
        });
        val.addAxis(oNewVal);
    }
    else if (c_oserct_plotareaVALAX === type) {
        var oNewVal = new AscFormat.CValAx();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ValAx(t, l, oNewVal);
        });
        val.addAxis(oNewVal);
        //if(!AscFormat.isRealNumber(oNewVal.crossBetween))
        //{
        //    oNewVal.setCrossBetween(AscFormat.CROSS_BETWEEN_BETWEEN);
        //}
    }
    else if (c_oserct_plotareaDTABLE === type) {
        var oNewVal = new AscFormat.CDTable();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DTable(t, l, oNewVal);
        });
        val.setDTable(oNewVal);
    }
    else if (c_oserct_plotareaSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_plotareaEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else if (c_oserct_plotareaPLOTAREAREGION === type) {
        var oNewVal = new AscFormat.CPlotAreaRegion();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PlotAreaRegion(t, l, oNewVal);
        });
        val.setPlotAreaRegion(oNewVal);
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Thickness = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_thicknessVAL === type) {
        val.m_val = this.ParsePersent(this.stream.GetString2LE(length));
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Surface = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_surfaceTHICKNESS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Thickness(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setThickness(oNewVal.m_val);
    }
    else if (c_oserct_surfaceSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_surfacePICTUREOPTIONS === type) {
        var oNewVal = new AscFormat.CPictureOptions();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PictureOptions(t, l, oNewVal);
        });
        val.setPictureOptions(oNewVal);
    }
    else if (c_oserct_surfaceEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Perspective = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_perspectiveVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetUChar();
        val.m_val = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_DepthPercent = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_depthpercentVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetString2LE(length);
        val.m_val = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_RotY = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_rotyVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetULongLE();
        val.m_val = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_HPercent = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_hpercentVAL === type) {
        val.m_val = this.ParsePersent(this.stream.GetString2LE(length));
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_RotX = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_rotxVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetChar();
        val.m_val = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_View3D = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_view3dROTX === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_RotX(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setRotX(oNewVal.m_val);
    }
    else if (c_oserct_view3dHPERCENT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_HPercent(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setHPercent(oNewVal.m_val);
    }
    else if (c_oserct_view3dROTY === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_RotY(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setRotY(oNewVal.m_val);
    }
    else if (c_oserct_view3dDEPTHPERCENT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DepthPercent(t, l, oNewVal);
        });
        if (null != oNewVal.m_val){
            var nPercent = parseInt(oNewVal.m_val)
            if(AscFormat.isRealNumber(nPercent)){
                val.setDepthPercent(nPercent);
            }
        }
    }
    else if (c_oserct_view3dRANGAX === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setRAngAx(oNewVal.m_val);
    }
    else if (c_oserct_view3dPERSPECTIVE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Perspective(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setPerspective(oNewVal.m_val);
    }
    else if (c_oserct_view3dEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_PivotFmt = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_pivotfmtIDX === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setIdx(oNewVal.m_val);
    }
    else if (c_oserct_pivotfmtSPPR === type) {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_pivotfmtTXPR === type) {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_pivotfmtMARKER === type) {
        var oNewVal = new AscFormat.CMarker();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Marker(t, l, oNewVal);
        });
        val.setMarker(oNewVal);
    }
    else if (c_oserct_pivotfmtDLBL === type) {
        var oNewVal = new AscFormat.CDLbl();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbl(t, l, oNewVal);
        });
        oNewVal.correctValues();
        val.setLbl(oNewVal);
    }
    else if (c_oserct_pivotfmtEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_pivotFmts = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_pivotfmtsPIVOTFMT === type) {
        var oNewVal = new AscFormat.CPivotFmt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PivotFmt(t, l, oNewVal);
        });
        val.setPivotFmts(oNewVal);
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Chart = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_chartTITLE === type) {
        var oNewVal = new AscFormat.CTitle();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Title(t, l, oNewVal);
        });
        val.setTitle(oNewVal);
    }
    else if (c_oserct_chartAUTOTITLEDELETED === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setAutoTitleDeleted(oNewVal.m_val);
        else
            val.setAutoTitleDeleted(true);
    }
    else if (c_oserct_chartPIVOTFMTS === type) {
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_pivotFmts(t, l, val);
        });
    }
    else if (c_oserct_chartVIEW3D === type) {
        var oNewVal = new AscFormat.CView3d();

        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_View3D(t, l, oNewVal);
        });
        val.setView3D(oNewVal);
    }
    else if (c_oserct_chartFLOOR === type) {
        var oNewVal = new AscFormat.CChartWall();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Surface(t, l, oNewVal);
        });
        val.setFloor(oNewVal);
    }
    else if (c_oserct_chartSIDEWALL === type) {
        var oNewVal = new AscFormat.CChartWall();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Surface(t, l, oNewVal);
        });
        val.setSideWall(oNewVal);
    }
    else if (c_oserct_chartBACKWALL === type) {
        var oNewVal = new AscFormat.CChartWall();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Surface(t, l, oNewVal);
        });
        val.setBackWall(oNewVal);
    }
    else if (c_oserct_chartPLOTAREA === type) {
        var oNewVal = new AscFormat.CPlotArea();
        var aChartWithAxis = [];
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PlotArea(t, l, oNewVal, aChartWithAxis);
        });
		oNewVal.initPostOpen(aChartWithAxis);
		val.setPlotArea(oNewVal);
    }
    else if (c_oserct_chartLEGEND === type) {
        var oNewVal = new AscFormat.CLegend();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Legend(t, l, oNewVal);
        });
        oNewVal.updateLegendPos();
        val.setLegend(oNewVal);
    }
    else if (c_oserct_chartPLOTVISONLY === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setPlotVisOnly(oNewVal.m_val);
    }
    else if (c_oserct_chartDISPBLANKSAS === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DispBlanksAs(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setDispBlanksAs(oNewVal.m_val);
    }
    else if (c_oserct_chartSHOWDLBLSOVERMAX === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setShowDLblsOverMax(oNewVal.m_val);
        else
            val.setShowDLblsOverMax(true);
    }
    else if (c_oserct_chartEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.m_extLst = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Protection = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_protectionCHARTOBJECT === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setChartObject(oNewVal.m_val);
    }
    else if (c_oserct_protectionDATA === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setData(oNewVal.m_val);
    }
    else if (c_oserct_protectionFORMATTING === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setFormatting(oNewVal.m_val);
    }
    else if (c_oserct_protectionSELECTION === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setSelection(oNewVal.m_val);
    }
    else if (c_oserct_protectionUSERINTERFACE === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setUserInterface(oNewVal.m_val);
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_PivotSource = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_pivotsourceNAME === type) {
        val.setName(this.stream.GetString2LE(length));
    }
    else if (c_oserct_pivotsourceFMTID === type) {
        var oNewVal = { m_val: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val)
            val.setFmtId(oNewVal.m_val);
    }
    else if (c_oserct_pivotsourceEXTLST === type) {
        var oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // if (null == val.m_extLst)
        // val.m_extLst = [];
        // val.m_extLst.push(oNewVal);
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Style1 = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_style1VAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetUChar();
        val.m_val = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Style = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_styleVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetUChar();
        val.m_val = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_TextLanguageID = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_textlanguageidVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetString2LE(length);
        val.m_val = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_Axis = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExAxisID === type)
    {
        val.setAxId(this.stream.GetULongLE());
    }
    else if (c_oserct_chartExAxisHIDDEN === type)
    {
        val.setHidden(this.stream.GetBool());
    }
    else if (c_oserct_chartExAxisCATSCALING === type)
    {
        var oNewVal = new AscFormat.CCategoryAxisScaling();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_CategoryAxisScaling(t, l, oNewVal);
        });
        val.setScaling(oNewVal);
    }
    else if (c_oserct_chartExAxisVALSCALING === type)
    {
        var oNewVal = new AscFormat.CValueAxisScaling();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ValueAxisScaling(t, l, oNewVal);
        });
        val.setScaling(oNewVal);
    }
    else if (c_oserct_chartExAxisTITLE === type)
    {
        var oNewVal = new AscFormat.CTitle();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartExTitle(t, l, oNewVal);
        });
        val.setTitle(oNewVal);
    }
    else if (c_oserct_chartExAxisUNIT === type)
    {
        var oNewVal = new AscFormat.CAxisUnits();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AxisUnits(t, l, oNewVal);
        });
        val.setUnits(oNewVal);
    }
    else if (c_oserct_chartExAxisNUMFMT === type)
    {
        var oNewVal = new AscFormat.CNumFmt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartExNumFmt(t, l, oNewVal);
        });
        val.setNumFmt(oNewVal);
    }
    else if (c_oserct_chartExAxisMAJORTICK === type)
    {
        var oNewVal = new AscFormat.CTickMarks();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TickMarks(t, l, oNewVal);
        });
        val.setMajorTickMark(oNewVal);
    }
    else if (c_oserct_chartExAxisMINORTICK === type)
    {
        var oNewVal = new AscFormat.CTickMarks();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TickMarks(t, l, oNewVal);
        });
        val.setMinorTickMark(oNewVal);
    }
    else if (c_oserct_chartExAxisMAJORGRID === type)
    {
		let oNewVal = { spPr: null };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Gridlines(t, l, oNewVal);
        });
        val.setMajorGridlines(oNewVal.spPr || new AscFormat.CSpPr());
    }
    else if (c_oserct_chartExAxisMINORGRID === type)
    {
		let oNewVal = { spPr: null };
		res = this.bcr.Read1(length, function (t, l) {
			return oThis.ReadCT_Gridlines(t, l, oNewVal);
		});
		val.setMinorGridlines(oNewVal.spPr || new AscFormat.CSpPr());
    }
    else if (c_oserct_chartExAxisTICKLABELS === type)
    {
        val.setTickLabels(this.stream.GetBool());
    }
    else if (c_oserct_chartExAxisTXPR === type)
    {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_chartExAxisSPPR === type)
    {
        val.setSpPr(this.ReadSpPr(length));
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_ChartData = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDATA === type) {
        var oNewVal = new AscFormat.CData();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Data(t, l, oNewVal);
        });
        val.addData(oNewVal);
    }
    // else if (c_oserct_chartExEXTERNALDATA === type)
    // {
    //     var oNewVal = new AscFormat.CExternalData();
    //     res = this.bcr.Read1(length, function (t, l) {
    //         return oThis.ReadCT_ChartExExternalData(t, l, oNewVal);
    //     });
    //     val.setExternalData(oNewVal);
    // }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_ChartExExternalData = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_chartExExternalAUTOUPDATE === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        val.m_autoUpdate = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadCT_ChartEx = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExChartPLOTAREA === type)
    {
        var oNewVal = new AscFormat.CPlotArea();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartExPlotArea(t, l, oNewVal);
        });
        if (oNewVal && oNewVal.axId && Array.isArray(oNewVal.axId)) {
            for (let i = 0; i < oNewVal.axId.length; i++) {
                const axis = oNewVal.axId[i];
                const start = (oNewVal.axId.length > 1) ? i : i + 1;
                axis.initializeAxPos(start);
            }
            if (oNewVal.axId.length === 3) {
                oNewVal.axId[0].setCrossAx(oNewVal.axId[1]);
                oNewVal.axId[1].setCrossAx(oNewVal.axId[0]);
                oNewVal.axId[2].setCrossAx(oNewVal.axId[0]);
            } else if (oNewVal.axId.length === 2) {
                oNewVal.axId[0].setCrossAx(oNewVal.axId[1]);
                oNewVal.axId[1].setCrossAx(oNewVal.axId[0]);
            } else if (oNewVal.axId.length === 1) {
                oNewVal.axId[0].setCrossAx(oNewVal.axId[0]);
            }
        }
        val.setPlotArea(oNewVal);
    }
    else if (c_oserct_chartExChartTITLE === type)
    {
        var oNewVal = new AscFormat.CTitle();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartExTitle(t, l, oNewVal);
        });
        val.setTitle(oNewVal);
    }
    else if (c_oserct_chartExChartLEGEND === type)
    {
        var oNewVal = new AscFormat.CLegend();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartExLegend(t, l, oNewVal);
        });
        val.setLegend(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_ChartExPlotArea = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExChartAREAREGION === type)
    {
        var oNewVal = new AscFormat.CPlotAreaRegion();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PlotAreaRegion(t, l, oNewVal);
        });
        val.setPlotAreaRegion(oNewVal);
    }
    else if (c_oserct_chartExChartAXIS === type) {
        var oNewVal = new AscFormat.CAxis();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Axis(t, l, oNewVal);
        });
        val.addAxis(oNewVal);
    }
    else if (c_oserct_chartExChartSPPR === type)
    {
        val.setSpPr(this.ReadSpPr(length));
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_PlotAreaRegion = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExAreaPLOTSURFACE === type)
    {
        var oNewVal = new AscFormat.CPlotSurface();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PlotSurface(t, l, oNewVal);
        });
        val.setPlotSurface(oNewVal);
    }
    else if (c_oserct_chartExAreaSERIES === type) {
        var oNewVal = new AscFormat.CSeries();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Series(t, l, oNewVal);
        });
        val.addSeries(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_PlotSurface = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExPlotSurfaceSPPR === type)
    {
        val.setSpPr(this.ReadSpPr(length));
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_SeriesLayout = function () {
    let val = null;
    switch (this.stream.GetUChar()) {
        case st_serieslayoutBOXWHISKER: val = AscFormat.SERIES_LAYOUT_BOX_WHISKER; break;
        case st_serieslayoutCLUSTEREDCOLUMN: val = AscFormat.SERIES_LAYOUT_CLUSTERED_COLUMN; break;
        case st_serieslayoutFUNNEL: val = AscFormat.SERIES_LAYOUT_FUNNEL; break;
        case st_serieslayoutPARETOLINE: val = AscFormat.SERIES_LAYOUT_PARETO_LINE; break;
        case st_serieslayoutREGIONMAP: val = AscFormat.SERIES_LAYOUT_REGION_MAP; break;
        case st_serieslayoutSUNBURST: val = AscFormat.SERIES_LAYOUT_SUNBURST; break;
        case st_serieslayoutTREEMAP: val = AscFormat.SERIES_LAYOUT_TREEMAP; break;
        case st_serieslayoutWATERFALL: 
        default: val = AscFormat.SERIES_LAYOUT_WATERFALL; break;
    }
    return val;
};
BinaryChartReader.prototype.ReadCT_Series = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExSeriesDATAPT === type) {
        var oNewVal = new AscFormat.CDataPoint();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DataPoint(t, l, oNewVal);
        });
        val.addDataPt(oNewVal);
    }
    else if (c_oserct_chartExSeriesDATALABELS === type)
    {
        var oNewVal = new AscFormat.CDataLabels();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DataLabels(t, l, oNewVal);
        });
        val.setDataLabels(oNewVal);
    }
    else if (c_oserct_chartExSeriesLAYOUTPROPS === type)
    {
        var oNewVal = new AscFormat.CSeriesLayoutProperties();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_SeriesLayoutProperties(t, l, oNewVal);
        });
        val.setLayoutPr(oNewVal);
    }
    else if (c_oserct_chartExSeriesTEXT === type)
    {
        var oNewVal = new AscFormat.CChartText();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Text(t, l, oNewVal);
        });
        oNewVal.setChart(this.curChart);
        val.setTx(oNewVal);
    }
    else if (c_oserct_chartExSeriesAXIS === type) {
        val.addAxisId(this.stream.GetULongLE());
    }
    else if (c_oserct_chartExSeriesDATAID === type)
    {
        val.setDataId(this.stream.GetULongLE());
    }
    else if (c_oserct_chartExSeriesSPPR === type)
    {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_chartExSeriesLAYOUTID === type)
    {
        val.setLayoutId(oThis.ReadCT_SeriesLayout());
    } 
    else if (c_oserct_chartExSeriesHIDDEN === type)
    {
        val.setHidden(this.stream.GetBool());
    } 
    else if (c_oserct_chartExSeriesOWNERIDX === type) 
    {
        val.setOwnerIdx(this.stream.GetULongLE());
    } 
    else if (c_oserct_chartExSeriesFORMATIDX === type) 
    {
        val.setFormatIdx(this.stream.GetULongLE());
    }
    else if (c_oserct_chartExSeriesUNIQUEID === type)
    {
        val.setUniqueId(this.stream.GetString2LE(length));
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_DataPoint = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataPointIDX === type)
    {
        val.setIdx(this.stream.GetULongLE());
    }
    else if (c_oserct_chartExDataPointSPPR === type)
    {
        val.setSpPr(this.ReadSpPr(length));
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_DataLabels = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataLabelsPOS === type)
    {
        val.setPos(oThis.ReadCT_DataLabelPos());
    }
    else if (c_oserct_chartExDataLabelsNUMFMT === type)
    {
        var oNewVal = new AscFormat.CNumFmt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartExNumFmt(t, l, oNewVal);
        });
        val.setNumFmt(oNewVal);
    }
    else if (c_oserct_chartExDataLabelsTXPR === type)
    {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_chartExDataLabelsSPPR === type)
    {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_chartExDataLabelsVISABILITIES === type)
    {
        var oNewVal = new AscFormat.CDataLabelVisibilities();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DataLabelVisibilities(t, l, oNewVal);
        });
        val.setVisibility(oNewVal);
    }
    else if (c_oserct_chartExDataLabelsSEPARATOR === type)
    {
        val.setSeparator(this.stream.GetString2LE(length));
    }
    else if (c_oserct_chartExDataLabelsDATALABEL === type) {
        var oNewVal = new AscFormat.CDataLabel();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DataLabel(t, l, oNewVal);
        });
        val.addDataLabel(oNewVal);
    }
    else if (c_oserct_chartExDataLabelsDATALABELHIDDEN === type) {
        var oNewVal = new AscFormat.CDataLabelHidden();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DataLabelHidden(t, l, oNewVal);
        });
        val.addDataLabelHidden(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_ChartExNumFmt = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExNumberFormatFORMATCODE === type) {
        val.setFormatCode(this.stream.GetString2LE(length));
    }
    else if (c_oserct_chartExNumberFormatSOURCELINKED === type) {
        val.setSourceLinked(this.stream.GetBool());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_DataLabelPos = function () {
    let val = null;
    switch (this.stream.GetUChar()) {
        case st_datalabelposBESTFIT: val = AscFormat.DATA_LABEL_POS_BEST_FIT; break;
        case st_datalabelposB: val = AscFormat.DATA_LABEL_POS_B; break;
        case st_datalabelposCTR: val = AscFormat.DATA_LABEL_POS_CTR; break;
        case st_datalabelposINBASE: val = AscFormat.DATA_LABEL_POS_IN_BASE; break;
        case st_datalabelposINEND: val = AscFormat.DATA_LABEL_POS_IN_END; break;
        case st_datalabelposL: val = AscFormat.DATA_LABEL_POS_L; break;
        case st_datalabelposOUTEND: val = AscFormat.DATA_LABEL_POS_OUT_END; break;
        case st_datalabelposR: val = AscFormat.DATA_LABEL_POS_R; break;
        case st_datalabelposT: 
        default: val = AscFormat.DATA_LABEL_POS_T; break;
    }
    return val;
};
BinaryChartReader.prototype.ReadCT_DataLabel = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataLabelIDX === type) 
    {
        val.setIdx(this.stream.GetULongLE());
    }
    else if (c_oserct_chartExDataLabelPOS === type)
    {
        val.setPos(oThis.ReadCT_DataLabelPos());
    }
    else if (c_oserct_chartExDataLabelNUMFMT === type)
    {
        var oNewVal = new AscFormat.CNumFmt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartExNumFmt(t, l, oNewVal);
        });
        val.setNumFmt(oNewVal);
    }
    else if (c_oserct_chartExDataLabelTXPR === type)
    {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_chartExDataLabelSPPR === type)
    {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_chartExDataLabelVISABILITIES === type)
    {
        var oNewVal = new AscFormat.CDataLabelVisibilities();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DataLabelVisibilities(t, l, oNewVal);
        });
        val.setVisibility(oNewVal);
    }
    else if (c_oserct_chartExDataLabelSEPARATOR === type)
    {
        val.setSeparator(this.stream.GetString2LE(length));
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_DataLabelHidden = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataLabelHiddenIDX === type) 
    {
        val.setIdx(this.stream.GetULongLE());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_ParentLabelLayout = function () {
    let val = null;
    switch (this.stream.GetUChar()) {
        case st_parentlabellayoutNONE: val = AscFormat.PARENT_LABEL_LAYOUT_NONE; break;
        case st_parentlabellayoutBANNER: val = AscFormat.PARENT_LABEL_LAYOUT_BANNER; break;
        case st_parentlabellayoutOVERLAPPING: 
        default: val = AscFormat.PARENT_LABEL_LAYOUT_OVERLAPPING; break;
    }
    return val;
};
BinaryChartReader.prototype.ReadCT_RegionLabelLayout = function () {
    let val = null;
    switch (this.stream.GetUChar()) {
        case st_regionlabellayoutNONE: val = AscFormat.REGION_LABEL_LAYOUT_NONE; break;
        case st_regionlabellayoutBESTFITONLY: val = AscFormat.REGION_LABEL_LAYOUT_BEST_FIT_ONLY; break;
        case st_regionlabellayoutSHOWALL: 
        default: val = AscFormat.REGION_LABEL_LAYOUT_SHOW_ALL; break;
    }
    return val;
};
BinaryChartReader.prototype.ReadCT_SeriesLayoutProperties = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExSeriesLayoutPARENT === type)
    {
        val.setParentLabelLayout(oThis.ReadCT_ParentLabelLayout());
    }
    else if (c_oserct_chartExSeriesLayoutREGION === type)
    {
        val.setRegionLabelLayout(oThis.ReadCT_RegionLabelLayout());
    }
    else if (c_oserct_chartExSeriesLayoutVISABILITIES === type)
    {
        var oNewVal = new AscFormat.CSeriesElementVisibilities();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_SeriesElementVisibilities(t, l, oNewVal);
        });
        val.setVisibility(oNewVal);
    }
    else if (c_oserct_chartExSeriesLayoutAGGREGATION === type)
    {
        val.setAggregation(this.stream.GetBool());
    }
    else if (c_oserct_chartExSeriesLayoutBINNING === type)
    {
        var oNewVal = new AscFormat.CBinning();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Binning(t, l, oNewVal);
        });
        val.setBinning(oNewVal);
    }
    else if (c_oserct_chartExSeriesLayoutSTATISTIC === type)
    {
        var oNewVal = new AscFormat.CStatistics();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Statistics(t, l, oNewVal);
        });
        val.setStatistics(oNewVal);
    }
    else if (c_oserct_chartExSeriesLayoutSUBTOTALS === type)
    {
        var oNewVal = new AscFormat.CSubtotals();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Subtotals(t, l, oNewVal);
        });
        val.setSubtotals(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_DataLabelVisibilities = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataLabelVisibilitiesSERIES === type)
    {
        val.setSeriesName(this.stream.GetBool());
    }
    else if (c_oserct_chartExDataLabelVisibilitiesCATEGORY === type)
    {
        val.setCategoryName(this.stream.GetBool());
    }
    else if (c_oserct_chartExDataLabelVisibilitiesVALUE === type)
    {
        val.setValue(this.stream.GetBool());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_IntervalClosedSide = function () {
    let val = null;
    switch (this.stream.GetUChar()) {
        case st_intervalclosedsideL: val = AscFormat.INTERVAL_CLOSED_SIDE_L; break;
        case st_intervalclosedsideR: 
        default: val = AscFormat.INTERVAL_CLOSED_SIDE_R; break;
    }
    return val;
};
BinaryChartReader.prototype.ReadCT_Binning = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExBinningBINSIZE === type)
    {
        val.setBinSize(this.stream.GetDoubleLE());
    }
    else if (c_oserct_chartExBinningBINCOUNT === type)
    {
        val.setBinCount(this.stream.GetULongLE());
    }
    else if (c_oserct_chartExBinningINTERVAL === type)
    {
        val.setIntervalClosed(oThis.ReadCT_IntervalClosedSide());
    }
    else if (c_oserct_chartExBinningUNDERVAL === type)
    {
        val.setUnderflow(this.stream.GetDoubleLE());
    }
    else if (c_oserct_chartExBinningUNDERAUTO === type)
    {
		this.stream.GetUChar();
        val.setUnderflow(undefined);
    }
    else if (c_oserct_chartExBinningOVERVAL === type)
    {
        val.setOverflow(this.stream.GetDoubleLE());
    }
    else if (c_oserct_chartExBinningOVERAUTO === type)
    {
        val.setOverflow(this.stream.GetUChar());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_PosAlign = function () {
    let val = null;
    switch (this.stream.GetUChar()) {
        case st_posalignMIN: val = AscFormat.POS_ALIGN_MIN; break;
        case st_posalignCTR: val = AscFormat.POS_ALIGN_CTR; break;
        case st_posalignMAX: 
        default: val = AscFormat.POS_ALIGN_MAX; break;
    }
    return val;
};
BinaryChartReader.prototype.ReadCT_SidePos = function () {
    let val = null;
    switch (this.stream.GetUChar()) {
        case st_sideposL: val = AscFormat.SIDE_POS_L; break;
        case st_sideposT: val = AscFormat.SIDE_POS_T; break;
        case st_sideposR: val = AscFormat.SIDE_POS_R; break;
        case st_sideposB: 
        default: val = AscFormat.SIDE_POS_B; break;
    }
    return val;
};
BinaryChartReader.prototype.ReadCT_ChartExTitle = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExTitleTX === type)
    {
        var oNewVal = new AscFormat.CChartText();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Text(t, l, oNewVal);
        });
        oNewVal.setChart(this.curChart);
        val.setTx(oNewVal);
    }
    else if (c_oserct_chartExTitleTXPR === type)
    {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_chartExTitleSPPR === type)
    {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_chartExTitlePOS === type)
    {
        val.setPos(oThis.ReadCT_SidePos());
    }
    else if (c_oserct_chartExTitleALIGN === type)
    {
        val.setAlign(oThis.ReadCT_PosAlign());
    }
    else if (c_oserct_chartExTitleOVERLAY === type)
    {
        val.setOverlay(this.stream.GetBool());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_ChartExLegend = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExLegendTXPR === type)
    {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_chartExLegendSPPR === type)
    {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_chartExLegendPOS === type)
    {
		let nPos = c_oAscChartLegendShowSettings.top;
		switch (this.stream.GetUChar()) {
			case sideBottom: nPos = c_oAscChartLegendShowSettings.bottom; break;
			case sideLeft: nPos = c_oAscChartLegendShowSettings.left; break;
			case sideRight: nPos = c_oAscChartLegendShowSettings.right; break;
			case sideTop: nPos = c_oAscChartLegendShowSettings.top; break;
		}
        val.setLegendPos(nPos);
    }
    else if (c_oserct_chartExLegendALIGN === type)
    {
        val.setAlign(oThis.ReadCT_PosAlign());
    }
    else if (c_oserct_chartExLegendOVERLAY === type)
    {
        val.setOverlay(this.stream.GetBool());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Text = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExTextRICH === type)
    {
        // var oNewVal = new AscFormat.CTextBody();
        // res = this.bcr.Read1(length, function (t, l) {
        //     return oThis.ReadCT_TextBody(t, l, oNewVal);
        // });
        // val.setRich(oNewVal);
        val.setRich(this.ReadTxPr(length));
        val.rich.setParent(val);
    }
    else if (c_oserct_chartExTextDATA === type)
    {
        var oNewVal = new AscFormat.CTextData();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TextData(t, l, oNewVal);
        });
        val.setTxData(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_TextData = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExTextDataFORMULA === type)
    {
        var oNewVal = new AscFormat.CFormula();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Formula(t, l, oNewVal);
        });
        val.setF(oNewVal);
    }
    else if (c_oserct_chartExTextDataVALUE === type)
    {
        val.setV(this.stream.GetString2LE(length));
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Data = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataID === type)
    {
        val.setId(this.stream.GetULongLE());
    }
    else if (c_oserct_chartExDataSTRDIMENSION === type)
    {
        var oNewVal = new AscFormat.CStringDimension();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_StringDimension(t, l, oNewVal);
        });
        val.addDimension(oNewVal);
    }
    else if (c_oserct_chartExDataNUMDIMENSION === type)
    {
        var oNewVal = new AscFormat.CNumericDimension();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumericDimension(t, l, oNewVal);
        });
        val.addDimension(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Subtotals = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExSubtotalsIDX === type)
    {
        val.addIdx(this.stream.GetULongLE());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_SeriesElementVisibilities = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExSeriesVisibilitiesCONNECTOR === type)
    {
        val.setConnectorLines(this.stream.GetBool());
    }
    else if (c_oserct_chartExSeriesVisibilitiesMEANLINE === type)
    {
        val.setMeanLine(this.stream.GetBool());
    }
    else if (c_oserct_chartExSeriesVisibilitiesMEANMARKER === type)
    {
        val.setMeanMarker(this.stream.GetBool());
    }
    else if (c_oserct_chartExSeriesVisibilitiesNONOUTLIERS === type)
    {
        val.setNonoutliers(this.stream.GetBool());
    }
    else if (c_oserct_chartExSeriesVisibilitiesOUTLIERS === type)
    {
        val.setOutliers(this.stream.GetBool());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_CategoryAxisScaling = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExCatScalingGAPVAL === type)
    {
        val.setGapWidth(this.stream.GetDoubleLE());
    }
    else if (c_oserct_chartExCatScalingGAPAUTO === type)
    {
		this.stream.GetUChar();
        val.setGapWidth(undefined);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_ValueAxisScaling = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExValScalingMAXAUTO === type)
    {
        val.setMax(this.stream.GetUChar());
    }
    else if (c_oserct_chartExValScalingMAXVAL === type)
    {
        val.setMax(this.stream.GetDoubleLE());
    }
    else if (c_oserct_chartExValScalingMINAUTO === type)
    {
        val.setMin(this.stream.GetUChar());
    }
    else if (c_oserct_chartExValScalingMINVAL === type)
    {
        val.setMin(this.stream.GetDoubleLE());
    }
    else if (c_oserct_chartExValScalingMAJUNITAUTO === type)
    {
        val.setMajorUnit(this.stream.GetUChar());
    }
    else if (c_oserct_chartExValScalingMAJUNITVAL === type)
    {
        val.setMajorUnit(this.stream.GetDoubleLE());
    }
    else if (c_oserct_chartExValScalingMINUNITAUTO === type)
    {
        val.setMinorUnit(this.stream.GetUChar());
    }
    else if (c_oserct_chartExValScalingMINUNITVAL === type)
    {
        val.setMinorUnit(this.stream.GetDoubleLE());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_ChartExAxisUnit = function () {
    let val = null;
    switch (this.stream.GetUChar()) {
        case st_axisunitHUNDREDS: val = AscFormat.AXIS_UNIT_HUNDREDS; break;
        case st_axisunitTHOUSANDS: val = AscFormat.AXIS_UNIT_TEN_THOUSANDS; break;
        case st_axisunitTENTHOUSANDS: val = AscFormat.AXIS_UNIT_TEN_MILLIONS; break;
        case st_axisunitHUNDREDTHOUSANDS: val = AscFormat.AXIS_UNIT_HUNDRED_THOUSANDS; break;
        case st_axisunitMILLIONS: val = AscFormat.AXIS_UNIT_MILLIONS; break;
        case st_axisunitTENMILLIONS: val = AscFormat.AXIS_UNIT_TEN_MILLIONS; break;
        case st_axisunitHUNDREDMILLIONS: val = AscFormat.AXIS_UNIT_HUNDRED_MILLIONS; break;
        case st_axisunitBILLIONS: val = AscFormat.AXIS_UNIT_BILLIONS; break;
        case st_axisunitTRILLIONS: val = AscFormat.AXIS_UNIT_TRILLIONS; break;
        case st_axisunitPERCENTAGE: 
        default: val = AscFormat.AXIS_UNIT_PERCENTAGE; break;
    }
    return val;
};
BinaryChartReader.prototype.ReadCT_AxisUnits = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExAxisUnitLABEL === type)
    {
        var oNewVal = new AscFormat.CAxisUnitsLabel();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AxisUnitsLabel(t, l, oNewVal);
        });
        val.setUnitsLabel(oNewVal);
    }
    else if (c_oserct_chartExAxisUnitTYPE === type)
    {
        val.setUnit(oThis.ReadCT_ChartExAxisUnit()); 
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_AxisUnitsLabel = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExAxisUnitsLabelTEXT === type)
    {
        var oNewVal = new AscFormat.CChartText();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Text(t, l, oNewVal);
        });
        val.setTx(oNewVal);
    }
    else if (c_oserct_chartExAxisUnitsLabelSPPR === type)
    {
        val.setSpPr(this.ReadSpPr(length));
    }
    else if (c_oserct_chartExAxisUnitsLabelTXPR === type)
    {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_TickMarksType = function () {
    let val = null;
    switch (this.stream.GetUChar()) {
        case st_tickmarkstypeIN: val = AscFormat.TICK_MARKS_TYPE_IN; break;
        case st_tickmarkstypeOUT: val = AscFormat.TICK_MARKS_TYPE_OUT; break;
        case st_tickmarkstypeCROSS: val = AscFormat.TICK_MARKS_TYPE_CROSS; break;
        case st_tickmarkstypeNONE: 
        default: val = AscFormat.TICK_MARKS_TYPE_NONE; break;
    }
    return val;
};
BinaryChartReader.prototype.ReadCT_TickMarks = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExTickMarksTYPE === type)
    {
        val.setType(oThis.ReadCT_TickMarksType());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Gridlines = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExGridlinesSPPR === type)
    {
        val.spPr = this.ReadSpPr(length);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_QuartileMethod = function () {
    let val = null;
    switch (this.stream.GetUChar()) {
        case st_quartilemethodINCLUSIVE: val = AscFormat.QUARTILE_METHOD_INCLUSIVE; break;
        case st_quartilemethodEXCLUSIVE: 
        default: val = AscFormat.QUARTILE_METHOD_EXCLUSIVE; break;
    }
    return val;
};
BinaryChartReader.prototype.ReadCT_Statistics = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExStatisticsMETHOD === type)
    {
        val.setQuartileMethod(oThis.ReadCT_QuartileMethod());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_StringDimensionType = function () {
    let val = null;
    switch (this.stream.GetUChar()) {
        case st_stringdimensiontypeCAT: val = AscFormat.STRING_DIMENSION_TYPE_CAT; break;
        case st_stringdimensiontypeCOLORSTR: 
        default: val = AscFormat.STRING_DIMENSION_TYPE_COLOR_STR; break;
    }
    return val;
};
BinaryChartReader.prototype.ReadCT_StringDimension = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataDimensionTYPE === type)
    {
        val.setType(oThis.ReadCT_StringDimensionType());
    }
    else if (c_oserct_chartExDataDimensionFORMULA === type)
    {
        var oNewVal = new AscFormat.CFormula();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Formula(t, l, oNewVal);
        });
        val.setF(oNewVal);
    }
    else if (c_oserct_chartExDataDimensionNF === type)
    {
        val.setNf(this.stream.GetString2LE(length));
    }
    else if (c_oserct_chartExDataDimensionSTRINGLEVEL === type)
    {
        var oNewVal = new AscFormat.CStrCache();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_StringLevel(t, l, oNewVal);
        });
        val.addLevelData(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_NumericDimensionType = function () {
    let val = null;
    switch (this.stream.GetUChar()) {
        case st_numericdimensiontypeVAL: val = AscFormat.NUMERIC_DIMENSION_TYPE_VAL; break;
        case st_numericdimensiontypeX: val = AscFormat.NUMERIC_DIMENSION_TYPE_X; break;
        case st_numericdimensiontypeY: val = AscFormat.NUMERIC_DIMENSION_TYPE_Y; break;
        case st_numericdimensiontypeSIZE: val = AscFormat.NUMERIC_DIMENSION_TYPE_SIZE; break;
        case st_numericdimensiontypeCOLORVAL: 
        default: val = AscFormat.NUMERIC_DIMENSION_TYPE_COLOR_VAL; break;
    }
    return val;
};
BinaryChartReader.prototype.ReadCT_NumericDimension = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataDimensionTYPE === type)
    {
        val.setType(oThis.ReadCT_NumericDimensionType());
    }
    else if (c_oserct_chartExDataDimensionFORMULA === type)
    {
        var oNewVal = new AscFormat.CFormula();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Formula(t, l, oNewVal);
        });
        val.setF(oNewVal);
    }
    else if (c_oserct_chartExDataDimensionNF === type)
    {
        val.setNf(this.stream.GetString2LE(length));
    }
    else if (c_oserct_chartExDataDimensionNUMERICLEVEL === type)
    {
        var oNewVal = new AscFormat.CNumLit();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumericLevel(t, l, oNewVal);
        });
        val.addLevelData(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_FormulaDirection = function () {
    let val = null;
    switch (this.stream.GetUChar()) {
        case st_formuladirectionCOL: val = AscFormat.FORMULA_DIRECTION_COL; break;
        case st_formuladirectionROW: 
        default: val = AscFormat.FORMULA_DIRECTION_ROW; break;
    }
    return val;
};
BinaryChartReader.prototype.ReadCT_Formula = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExFormulaCONTENT === type)
    {
        val.setContent(this.stream.GetString2LE(length));
    }
    else if (c_oserct_chartExFormulaDIRECTION === type)
    {
        val.setDir(oThis.ReadCT_FormulaDirection());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_StringLevel = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataLevelNAME === type)
    {
        val.setName(this.stream.GetString2LE(length));
    }
    else if (c_oserct_chartExDataLevelCOUNT === type)
    {
        val.setPtCount(this.stream.GetULongLE());
    }
    else if (c_oserct_chartExDataLevelPT === type)
    {
        var oNewVal = new AscFormat.CStringPoint();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_StringValue(t, l, oNewVal);
        });
        val.addPt(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_NumericLevel = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataLevelNAME === type)
    {
        val.setName(this.stream.GetString2LE(length));
    }
    else if (c_oserct_chartExDataLevelCOUNT === type)
    {
        val.setPtCount(this.stream.GetULongLE());
    }
    else if (c_oserct_chartExDataLevelPT === type)
    {
        var oNewVal = new AscFormat.CNumericPoint();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumericValue(t, l, oNewVal);
        });
        val.addPt(oNewVal);
    }
    else if (c_oserct_chartExDataLevelFORMATCODE === type)
    {
        val.setFormatCode(this.stream.GetString2LE(length));
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_StringValue = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataValueIDX === type)
    {
        val.setIdx(this.stream.GetULongLE());
    }
    else if (c_oserct_chartExDataValueCONTENT === type)
    {
        val.setVal(this.stream.GetString2LE(length));
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_NumericValue = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataValueIDX === type)
    {
        val.setIdx(this.stream.GetULongLE());
    }
    else if (c_oserct_chartExDataValueCONTENT === type)
    {
        val.setVal(this.stream.GetDoubleLE());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadAlternateContent = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oseralternatecontentCHOICE === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadAlternateContentChoice(t, l, oNewVal);
        });
        if (null == val.m_Choice)
            val.m_Choice = [];
        val.m_Choice.push(oNewVal);
    }
    else if (c_oseralternatecontentFALLBACK === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadAlternateContentFallback(t, l, oNewVal);
        });
        val.m_Fallback = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadAlternateContentChoice = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oseralternatecontentchoiceSTYLE === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Style(t, l, oNewVal);
        });
        val.m_style = oNewVal;
    }
    else if (c_oseralternatecontentchoiceREQUIRES === type) {
        var oNewVal;
        oNewVal = this.stream.GetString2LE(length);
        val.m_Requires = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};
BinaryChartReader.prototype.ReadAlternateContentFallback = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oseralternatecontentfallbackSTYLE === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Style1(t, l, oNewVal);
        });
        val.m_style = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};



    //----------------------------------------------------------export----------------------------------------------------
    window['AscCommon'] = window['AscCommon'] || {};
    window['AscCommon'].BinaryChartWriter = BinaryChartWriter;
    window['AscCommon'].BinaryChartReader = BinaryChartReader;

    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].LAYOUT_MODE_EDGE = LAYOUT_MODE_EDGE;
    window['AscFormat'].LAYOUT_MODE_FACTOR = LAYOUT_MODE_FACTOR;

    window['AscFormat'].LAYOUT_TARGET_INNER = LAYOUT_TARGET_INNER;
    window['AscFormat'].LAYOUT_TARGET_OUTER = LAYOUT_TARGET_OUTER;

    window['AscFormat'].st_errbartypeBOTH       = st_errbartypeBOTH;
    window['AscFormat'].st_errbartypeMINUS      = st_errbartypeMINUS;
    window['AscFormat'].st_errbartypePLUS       = st_errbartypePLUS;
    window['AscFormat'].st_errdirX              = st_errdirX;
    window['AscFormat'].st_errdirY              = st_errdirY;
    window['AscFormat'].st_errvaltypeCUST       = st_errvaltypeCUST;
    window['AscFormat'].st_errvaltypeFIXEDVAL   = st_errvaltypeFIXEDVAL;
    window['AscFormat'].st_errvaltypePERCENTAGE = st_errvaltypePERCENTAGE;
    window['AscFormat'].st_errvaltypeSTDDEV     = st_errvaltypeSTDDEV;
    window['AscFormat'].st_errvaltypeSTDERR     = st_errvaltypeSTDERR;

    window['AscFormat'].st_trendlinetypeEXP       = st_trendlinetypeEXP;
    window['AscFormat'].st_trendlinetypeLINEAR    = st_trendlinetypeLINEAR;
    window['AscFormat'].st_trendlinetypeLOG       = st_trendlinetypeLOG;
    window['AscFormat'].st_trendlinetypeMOVINGAVG = st_trendlinetypeMOVINGAVG;
    window['AscFormat'].st_trendlinetypePOLY      = st_trendlinetypePOLY;
    window['AscFormat'].st_trendlinetypePOWER     = st_trendlinetypePOWER;

    window['AscFormat'].RADAR_STYLE_STANDARD = RADAR_STYLE_STANDARD;
    window['AscFormat'].RADAR_STYLE_MARKER   = RADAR_STYLE_MARKER;
    window['AscFormat'].RADAR_STYLE_FILLED   = RADAR_STYLE_FILLED;

    window['AscFormat'].SIZE_REPRESENTS_AREA = SIZE_REPRESENTS_AREA;
    window['AscFormat'].SIZE_REPRESENTS_W    = SIZE_REPRESENTS_W;

	window['AscFormat'].PICTURE_FORMAT_STACK = PICTURE_FORMAT_STACK;
	window['AscFormat'].PICTURE_FORMAT_STACK_SCALE    = PICTURE_FORMAT_STACK_SCALE;
	window['AscFormat'].PICTURE_FORMAT_STACK_STRETCH    = PICTURE_FORMAT_STACK_STRETCH;

	window['AscFormat'].TRENDLINE_TYPE_EXP = TRENDLINE_TYPE_EXP;
	window['AscFormat'].TRENDLINE_TYPE_LINEAR    = TRENDLINE_TYPE_LINEAR;
	window['AscFormat'].TRENDLINE_TYPE_LOG    = TRENDLINE_TYPE_LOG;
	window['AscFormat'].TRENDLINE_TYPE_MOVING_AVG    = TRENDLINE_TYPE_MOVING_AVG;
	window['AscFormat'].TRENDLINE_TYPE_POLY    = TRENDLINE_TYPE_POLY;
	window['AscFormat'].TRENDLINE_TYPE_POWER    = TRENDLINE_TYPE_POWER;

	window['AscFormat'].ERR_DIR_X    = ERR_DIR_X;
	window['AscFormat'].ERR_DIR_Y    = ERR_DIR_Y;

	window['AscFormat'].ERR_BAR_TYPE_BOTH    = ERR_BAR_TYPE_BOTH;
	window['AscFormat'].ERR_BAR_TYPE_MINUS    = ERR_BAR_TYPE_MINUS;
	window['AscFormat'].ERR_BAR_TYPE_PLUS    = ERR_BAR_TYPE_PLUS;

	window['AscFormat'].ERR_VAL_TYPE_CUST    = ERR_VAL_TYPE_CUST;
	window['AscFormat'].ERR_VAL_TYPE_FIXED_VAL    = ERR_VAL_TYPE_FIXED_VAL;
	window['AscFormat'].ERR_VAL_TYPE_PERCENTAGE    = ERR_VAL_TYPE_PERCENTAGE;
	window['AscFormat'].ERR_VAL_TYPE_STD_DEV    = ERR_VAL_TYPE_STD_DEV;
	window['AscFormat'].ERR_VAL_TYPE_STD_ERR    = ERR_VAL_TYPE_STD_ERR;

	window['AscFormat'].TICK_LABEL_POSITION_HIGH = st_ticklblposHIGH;
	window['AscFormat'].TICK_LABEL_POSITION_LOW = st_ticklblposLOW;
	window['AscFormat'].TICK_LABEL_POSITION_NEXT_TO = st_ticklblposNEXTTO;
	window['AscFormat'].TICK_LABEL_POSITION_NONE = st_ticklblposNONE;

})(window);
