import PouchDB from "pouchdb";

/**
 * Initializes a PouchDB database with specified collections if they do not
 * exist.
 *
 * @param {string} dbname - The name of the database to initialize.
 */
const initdb = async (dbname, questions) => {
  const db = new PouchDB(dbname);

  try {
      await db.put({
          _id: "questions",
          questions: questions
      });
      console.log("Questions stored in the database.");
  } catch (e) {
      console.error("Error storing questions in the database:", e);
  }

  db.close();
};

const Database = async (dbname, questions) => {
    await initdb(dbname, questions);

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