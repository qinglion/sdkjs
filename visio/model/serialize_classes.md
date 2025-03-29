# Visio Document Serialization Class Implementation Table

## Table Description

This table serves as a reference for classes used for serialization/deserialization of Visio documents in SDKJS. It contains the following information:

1. **JavaScript Class (fromXml)** - The name of the JavaScript class that implements the `prototype.fromXml` method. Classes are listed in the order they appear in the `sdkjs-ooxml/visio/model/VisioDocument.js` file. The `AscVisio.` prefix is omitted for readability.Do not add or remove existing names in 1 column

2. **C++ Class (fromPPTY)** - The corresponding C++ class that implements the `fromPPTY` method for deserialization from binary format. An empty cell indicates that there is no corresponding C++ class or that its name is unknown.

3. **Binary Reading Implementation (Serialize.js)** - Indicator of the presence or absence of binary format reading method implementations in JavaScript (in the `visio/model/Serialize.js` file):
   - "+" means the class has binary reading method implementations (readAttribute/readChild)
   - "-" means the class does not have binary reading method implementations

At the end of the table, C++ classes that have no direct JavaScript counterparts are also listed.

This table is used to track the status of class serialization/deserialization implementations and can serve as a guide when developing new serialization methods.

## Current task specification

Look at the any row in the table that have non empty first and second column and doesn't have a plus sign in the 3rd column.
Add implementation of the prototype of the class from the 1st column to the file @[visio/model/Serialize.js]. Use the C++ code of the "fromPPTY" function of the class from the 2nd column in the @[VsdxFormat] folder as the basis for the logic.
No need to add init to class members that are declared in @[visio/model/VisioDocument.js] or @[visio/model/ooxmlApi/ooxmlApiIndex.js]
Use Shape_Type.prototype.readAttribute and Shape_Type.prototype.readChild as references for implementation.
Do not check initialized values in the methods (e.g., no need to check "if (!this.authorList) {").
At the end, add a plus sign to this row.

| JavaScript Class (fromXml) | C++ Class (fromPPTY) | Binary Reading Implementation (Serialize.js) |
| --- | --- | --- |
| CVisioDocument | CDocumentFile | + |
| CWindows | CWindowsFile | + |
| CMasters | CMastersFile | + |
| CPageContents | CPageFile | + |
| CMasterContents | CMasterFile | + |
| CPages | CPagesFile | + |
| CComments | CComments | + |
| CExtensions | | - |
| CDataConnections | CDataConnections | + |
| CDataRecordSets | CDataRecordSets | + |
| CValidation | CValidationFile | + |
| CSolutions | CSolutions | + |
| CSolutionXML | | - |
| Comments_Type | CCommentsFile | + |
| RuleTest_Type | CRuleTest | + |
| RuleFilter_Type | CRuleFilter | + |
| RowKeyValue_Type | CRowKeyValue | + |
| DataColumn_Type | CDataColumn | + |
| RuleInfo_Type | CRuleInfo | + |
| IssueTarget_Type | CIssueTarget | + |
| Rule_Type | CRule | + |
| RuleSetFlags_Type | CRuleSetFlags | + |
| AutoLinkComparison_Type | | - |
| RefreshConflict_Type | | - |
| RowMap_Type | CRowMap | + |
| PrimaryKey_Type | CPrimaryKey | + |
| DataColumns_Type | CDataColumns | + |
| ADOData_Type | | - |
| TabSplitterPos_Type | | - |
| ShowConnectionPoints_Type | | - |
| ShowGuides_Type | | - |
| ShowPageBreaks_Type | | - |
| ShowGrid_Type | | - |
| ShowRulers_Type | | - |
| StencilGroupPos_Type | | - |
| StencilGroup_Type | | - |
| Icon_Type | CIcon | + |
| PageSheet_Type | CPageSheet | + |
| tp_Type | CText_tp | + |
| pp_Type | CText_pp | + |
| fld_Type | CText_fld | + |
| cp_Type | CText_cp | + |
| Rel_Type | | - |
| CommentEntry_Type | CCommentEntry | + |
| AuthorEntry_Type | CAuthorEntry | + |
| RefreshableData_Type | | - |
| PublishedPage_Type | | - |
| HeaderFooterFont_Type | | - |
| FooterRight_Type | | - |
| FooterCenter_Type | | - |
| FooterLeft_Type | | - |
| HeaderRight_Type | | - |
| HeaderCenter_Type | | - |
| HeaderLeft_Type | | - |
| FooterMargin_Type | | - |
| HeaderMargin_Type | | - |
| AttachedToolbars_Type | | - |
| CustomToolbarsFile_Type | | - |
| CustomMenusFile_Type | | - |
| ProtectBkgnds_Type | | - |
| ProtectMasters_Type | | - |
| ProtectShapes_Type | | - |
| ProtectStyles_Type | | - |
| DynamicGridEnabled_Type | | - |
| SnapAngle_Type | | - |
| SnapExtensions_Type | | - |
| SnapSettings_Type | | - |
| GlueSettings_Type | | - |
| TimePrinted_Type | | - |
| TimeEdited_Type | | - |
| TimeSaved_Type | | - |
| TimeCreated_Type | | - |
| CustomProp_Type | | - |
| PreviewPicture_Type | | - |
| BuildNumberEdited_Type | | - |
| BuildNumberCreated_Type | | - |
| Template_Type | | - |
| AlternateNames_Type | | - |
| HyperlinkBase_Type | | - |
| Desc_Type | | - |
| Keywords_Type | | - |
| Category_Type | | - |
| Company_Type | | - |
| Manager_Type | | - |
| Creator_Type | | - |
| Subject_Type | | - |
| Title_Type | | - |
| SectionDef_Type | | - |
| FunctionDef_Type | | - |
| CellDef_Type | | - |
| Issue_Type | CIssue | + |
| RuleSet_Type | CRuleSet | + |
| ValidationProperties_Type | CValidationProperties | + |
| DataRecordSet_Type | CDataRecordSet | + |
| DataConnection_Type | CDataConnection | + |
| Solution_Type | CSolution | + |
| Window_Type | CWindow | + |
| Page_Type | CPage | + |
| Connect_Type | CConnect | + |
| Shape_Type | CShape | + |
| MasterShortcut_Type | | - |
| Master_Type | CMaster | + |
| Text_Type | CText | + |
| ForeignData_Type | CForeignData | + |
| Data_Type | | - |
| RefBy_Type | CRefBy | + |
| PublishSettings_Type | | - |
| DataTransferInfo_Type | | - |
| HeaderFooter_Type | CHeaderFooter | + |
| EventItem_Type | CEventItem | + |
| DocumentSheet_Type | CDocumentSheet | + |
| StyleSheet_Type | CStyleSheet | + |
| FaceName_Type | CFaceName | + |
| ColorEntry_Type | CColorEntry | + |
| DocumentSettings_Type | CDocumentSettings | + |
| DocumentProperties_Type | | - |
| CellDefBase_Type | | - |
| ShapeSheet_Type | | - |
| Section_Type | CSection | + |
| Trigger_Type | CTrigger | + |
| GeometryRow_Type | | - |
| IndexedRow_Type | | - |
| NamedIndexedRow_Type | | - |
| Row_Type | CRow | + |
| SolutionXML_Type | | - |
| ExtendableCell_Type | | - |
| Cell_Type | CCell | + |
|  | CText_text | + |
|  | CShapes | + |
|  | CConnects | - |
|  | CEventList | + |
|  | CStyleSheets | + |
|  | CColors | + |
|  | CFaceNames | + |
|  | CSolutionFile | - |
|  | CSolutionsFile | - |
|  | CIssues | - |
|  | CRuleSets | - |
|  | CCommentList | - |
|  | CAuthorList | - |
|  | CRuleFormula | - |
|  | CConnectionsFile | - |
|  | CRecordsetFile | - |
|  | CRecordsetsFile | - |
