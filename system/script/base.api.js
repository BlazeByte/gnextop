/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Gnextop                                                    *
* A PSP Portal by BlazeByte (http://blazebyte.org/gnextop)   *
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Database API
============

The database API allows application to use a simple database structure that can be saved and loaded from the virtual disk.

The structure of a database:
- Database
- - Table
- - - Field
- - - - Record

Thus the value of a record can be obtained by doing the following
 var value = Base["baseid"].Table["table"].Field["field"].Record[intRecord].Value

The base ID is an identity the application gives the database when it is opened. For example, Gnextop's settings database has id "sys".


Functions:
---------

Base.CreateBase (string Filename)
- Creates a database and write it to the virutal disk
- Filename specifies what to call the database
- Returns the outcome of Disk.WriteFile

Base.LoadBase (string Filename, string ID)
- Loads a database
- Filename is the name of the database to load
- ID is the Database's ID. It will be used when referencing to the database.
- Returns true on success, false if it failed

Base.WriteBase (string ID)
- Writes the database to disk
- ID is the Database's ID.

Base.CreateTable (string ID, string Table, array [string Field, string Field, ...])
- Creates a new table
- ID is the Database's ID.
- Table is the name of the Table to create
- [string Field, string Field, ...] is an array of Fields to create in the new table
- Returns true on success

Base.CreateField (string ID, string Table, string Field, string DefaultValue)
- Creates a new field
- ID is the Database's ID.
- Table is the name of the table to create the field in
- Field is the name of the new field
- DefaultValue is the value that all records will have this field set to
- Returns true on success

Base.CreateRecord (string ID, string Table, string Criteria)
- Creates a new record
- ID is the Database's ID.
- Table is the name of the table to create the record in
- Criteria is the fields and values. For example "name=dorris,age=32"
- Returns true on success

Base.DeleteRecords (string ID, string Table, array [integer Record, integer Record, ...])
- Deletes records
- ID is the Database's ID.
- Table is the name of the table to delete records from
- [integer Record, integer Record, ...] is an array of records to delete (eg [1,7,19])
- Returns true on success

Base.FindRecords (string ID, string Table, string Criteria)
- Find records
- ID is the Database's ID.
- Table is the name of the table to look in
- Criteria is the search parameters.  For example "name=dorris,age=32" (where field=value)
- Returns an array of records found

*/

var Base = new Array();                  // Multiple Databases can be open at once
Base.Char1 = String.fromCharCode(167);   // Separates Tables (Comes before each TableName)
Base.Char2 = String.fromCharCode(184);   // Separates Fields  (Comes before each FieldName)
Base.Char3 = String.fromCharCode(171);   // Separates Records (before each record)


Base.CreateBase = function (strFilename) {
  return Disk.WriteFile(strFilename, "Type=Database;", "");
}

Base.LoadBase = function (strFilename, strID) {
  Base[strID] = new Object();                    // Make the new database object
  Base[strID].TMP = new Object();
  Base[strID].Filename = strFilename;
  Base[strID].TMP.File = Disk.LoadFile(Base[strID].Filename);   // Grab the database from the disk
  if (Base[strID].TMP.File == null)                            // If the file does not exist, return 0.
    return false;
  
  Base[strID].Table = new Array();
  Base[strID].TableID = new Array();
  Base[strID].TMP.Table = Base[strID].TMP.File.split(Base.Char1);                   // Now split up the tables with Char1
  
  for(var intTable = 0; intTable < Base[strID].TMP.Table.length; intTable++) {  //## TABLES ##
    Base[strID].TMP.Field = Base[strID].TMP.Table[intTable].split(Base.Char2);     // Split up fields from the table
    strTable = Base[strID].TMP.Field.shift();
    Base[strID].TableID[intTable] = strTable;
    Base[strID].Table[strTable] = new Object();
    Base[strID].Table[strTable].Index = intTable             // Set index number of Table
    Base[strID].Table[strTable].Field = new Array();
    Base[strID].Table[strTable].FieldID = new Array();
    
    for(var intField = 0; intField < Base[strID].TMP.Field.length; intField++){          // ## FIELDS ##
      Base[strID].TMP.Record = Base[strID].TMP.Field[intField].split(Base.Char3);
      strField = Base[strID].TMP.Record.shift();
      Base[strID].Table[strTable].FieldID[intField] = strField;
      Base[strID].Table[strTable].Field[strField] = new Object();
      Base[strID].Table[strTable].Field[strField].Index = intField;
      Base[strID].Table[strTable].Field[strField].Record = new Array();
      Base[strID].Table[strTable].RecordCount = Base[strID].TMP.Record.length;
      
      for(var intRecord = 0; intRecord < Base[strID].TMP.Record.length; intRecord++) {   // ## RECORDS ##
        Base[strID].Table[strTable].Field[strField].Record[intRecord] = new Object();
        Base[strID].Table[strTable].Field[strField].Record[intRecord].Value = Base[strID].TMP.Record[intRecord];
      }
    }
  }
  delete Base[strID].TMP;
  return true;
}

Base.WriteBase = function(strID){
  Base[strID].File = "";
  
  for(var intTable = 0; intTable < Base[strID].TableID.length; intTable++) {
    var strTable = Base[strID].TableID[intTable];
    Base[strID].File += strTable;
    for(var intField = 0; intField < Base[strID].Table[strTable].FieldID.length; intField++){
      var strField = Base[strID].Table[strTable].FieldID[intField];
      Base[strID].File += Base.Char2 + strField;
      for(var intRecord = 0; intRecord < Base[strID].Table[strTable].Field[strField].Record.length; intRecord++) {
        Base[strID].File += Base.Char3 + Base[strID].Table[strTable].Field[strField].Record[intRecord].Value;
      }
    }
    Base[strID].File += Base.Char1;
  }
  return Disk.WriteFile(Base[strID].Filename, "Type=Database;", Base[strID].File.slice(0,-1), 0);       // Write the database
}

Base.CreateTable = function (strID, strTableName, strFieldNames) {
  var intTable = Base[strID].TableID.length;
  Base[strID].TableID[intTable] = strTableName;
  Base[strID].Table[strTableName] = new Object();
  Base[strID].Table[strTableName].FieldID = new Array();
  Base[strID].Table[strTableName].Field = new Array();
  Base[strID].Table[strTableName].Index = intTable;
  Base[strID].Table[strTableName].RecordCount = 0;
  strFields = strFieldNames.split(",");
  for (var i = 0; i < strFields.length; i++) 
    Base.CreateField(strID, strTableName, strFields[i]);
  Base.WriteBase(strID);
  return true;
}

Base.CreateField = function (strID, strTable, strFieldName, strDefaultValue) {
  var intField = Base[strID].Table[strTable].FieldID.length;
  Base[strID].Table[strTable].FieldID[intField] = strFieldName;
  Base[strID].Table[strTable].Field[strFieldName] = new Object();
  Base[strID].Table[strTable].Field[strFieldName].Record = new Array();
  Base[strID].Table[strTable].Field[strFieldName].Index = intField;
  for(var intRecord = 0; intRecord < Base[strID].Table[strTable].RecordCount; intRecord++) {
    Base[strID].Table[strTable].Field[strFieldName].Record[intRecord].Value = strDefaultValue;
  }
  Base.WriteBase(strID);
  return true;
}

Base.CreateRecord = function (strID, strTable, strCriteria) {
  Criteria = strCriteria.split(",");
  var intRecord = Base[strID].Table[strTable].RecordCount;
  for (var intField = 0; intField < Base[strID].Table[strTable].FieldID.length; intField++) {
    var strField = Base[strID].Table[strTable].FieldID[intField];
    Base[strID].Table[strTable].Field[strField].Record[intRecord] = new Object();
    Base[strID].Table[strTable].Field[strField].Record[intRecord].Value = "";
  }
  for (var intCriteria = 0; intCriteria < Criteria.length; intCriteria++) {
    CriteriaParts = Criteria[intCriteria].split("=");
    strField = CriteriaParts[0];
    strValue = Base.UnEscape(CriteriaParts[1]);
    Base[strID].Table[strTable].Field[strField].Record[intRecord].Value = strValue;
  }
  Base[strID].Table[strTable].RecordCount++;
  Base.WriteBase(strID);
  return true;
}

Base.DeleteRecords = function (strID, strTable, Records) {
  for (var intRecord = 0; intRecord < Records.length; intRecord++) {         // for each record
    for (var intField = 0; intField < Base[strID].Table[strTable].FieldID.length; intField++)          // for each field
      Base[strID].Table[strTable].Field[Base[strID].Table[strTable].FieldID[intField]].Record.splice(Records[intRecord],1);   // delete the record
    Base[strID].Table[strTable].RecordCount--;
  }
  Base.WriteBase(strID);
  return true;
}

Base.DeleteRecord = function (strID, strTable, intRecord) {
  for (var intField = 0; intField < Base[strID].Table[strTable].FieldID.length; intField++)          // for each field
    Base[strID].Table[strTable].Field[Base[strID].Table[strTable].FieldID[intField]].Record.splice(intRecord,1);   // delete the record
  Base[strID].Table[strTable].RecordCount--;
  Base.WriteBase(strID);
  return true;
}

Base.FindRecords = function (strID, strTable, strCriteria) {
  var FoundRecord = new Array();
  if (!isset(Base[strID].Table)) return FoundRecord;
  var Criteria = new Array();
  var Match = false;
  var arrCriteria = strCriteria.split(",");

  for (var intCriteria = 0; intCriteria < arrCriteria.length; intCriteria++) {
    var CriteriaParts = arrCriteria[intCriteria].split("=");
    Criteria[intCriteria] = new Object();
    Criteria[intCriteria].Field = CriteriaParts[0];
    Criteria[intCriteria].Value = Base.UnEscape(CriteriaParts[1]);
  }

  for (var intRecord = 0; intRecord < Base[strID].Table[strTable].RecordCount; intRecord++) {
    for (var intCriteria = 0; intCriteria < Criteria.length; intCriteria++) {
      Match = true;
      if(Base[strID].Table[strTable].Field[Criteria[intCriteria].Field].Record[intRecord].Value != Criteria[intCriteria].Value) { 
        Match = false;
        break;
      }
    }
    if (Match) FoundRecord[FoundRecord.length] = intRecord;
  }
  
  return FoundRecord;
}

Base.Escape = function(strText) {
  return strText.replace(/,/g,"\\%comma%\\");
}

Base.UnEscape = function(strText) {
  return strText.replace(/\\%comma%\\/g,",");
}