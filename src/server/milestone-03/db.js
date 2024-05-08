import PouchDB from "pouchdb";

/**
 * Initializes a PouchDB database with specified collections if they do not
 * exist.
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

    try {
        const games = await db.get("games");
      } catch (e) {
        db.put({ _id: "games", games: [] });
      }
  
    db.close();
  };

const Database = async (dbname) => {
    await initdb(dbname);

    const getDB = () => new PouchDB(dbname);
    const obj = {
        //we can put db functions in here
        savePlayerScore: async (name, score) => {
            try{
                const db = getDB()
                const data = await db.get("games")
                data.games.push({ name, score })
                await db.put(data)
                db.close()
                return { status: "success" }
            } catch(err){
                return {
                    status: "Error",
                    message: "Failed to save player score",
                    error: err.message
                }
            }
        }
    }
    return obj
}

export default Database