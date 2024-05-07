import PouchDB from "pouchdb";

/**
 * Initializes a PouchDB database with specified collections if they do not
 * exist.
 *
 * This function creates a new PouchDB instance with the given database name. It
 * attempts to retrieve collections for 'words' and 'games'. If these
 * collections do not exist, it creates them with initial empty arrays.
 *
 * @param {string} dbname - The name of the database to initialize.
 */
const initdb = async (dbname) => {

    const db = new PouchDB(dbname);
  
    try {
      const questions = await db.get("questions");
    } catch (e) {
      db.put({ _id: "questions", questions: [] });
    }
  
    db.close();
  };

const Database = (dbname) => {
    initdb(dbname);

    const getDB = () => new PouchDB(dbname);
    const obj = {
        //we cna put db functions in here
    }
    return obj
}