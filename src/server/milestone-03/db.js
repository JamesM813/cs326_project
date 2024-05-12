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
    await db.get("scores");
  } catch (e) {
    await db.put({ _id: "scores", scores: [] });
  }

  await db.close();
};

const Database = async (dbname) => {
    await initdb(dbname);

    const getDB = () => new PouchDB(dbname);

    const obj = {
        
        /**
         * Asynchronously records a user's score in the database.
         *
         * @param {number} score - The score achieved by the user.
         * @returns {Promise<object>} A promise indicating the result of the operation.
         */
        savePlayerScore: async (score) => {
            try{
                const db = getDB()
                const data = await db.get("scores")
                data.scores.push({ score })
                await db.put(data)
                await db.close()
                return { status: "success" }
            } catch(err){
                return {
                    status: "Error",
                    message: "Failed to save player score",
                    error: err.message
                }
            }
        },

        updatePlayerScore: async (newScore) => {
            try{
                const db = getDB()
                const data = db.get("scores");
                data.scores.push({score: newScore})
                await db.put(data)
                await db.close()
                return { status: "success" }
            } catch(err){
                return {
                    status: "Error",
                    message: "Failed to update player score",
                    error: err.message
                }
            }
        },

        /**
         * Asynchronously retrieves the top 10 scores from the database.
         *
         * @returns {Promise<object>} A promise containing the top 10 scores.
         */
        top10Scores: async () => {
            try{
                const db = getDB()
                const data = await db.get("scores")
                const sorted = data.scores.sort((a,b) => b.score - a.score)
                const top10 = sorted.slice(0,10)
                await db.close()
                return { status: "success", data: top10 }
            } catch(err){
                return {
                    status: "Error",
                    message: "Failed to get top 10 scores",
                    error: err.message
                }
            }
        },

        deletePlayerScore: async () => {
            try {
              const db = getDB()
              const data = await db.get("scores")
              data.scores = []
              await db.put(data)
              await db.close()
              return { status: "success" }
            } catch (err) {
              return {
                status: "Error",
                message: "Failed to delete player scores",
                error: err.message,
              }
            }
          }
    }
    return obj
}

export default Database;