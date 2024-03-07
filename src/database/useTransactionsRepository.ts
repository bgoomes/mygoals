import { useSQLiteContext } from "expo-sqlite/next"

export type TransactionCreateDatabase = {
    amount: number
    goalId: number
}

export type TransactionResponseDatabase = {
    id: string
    amount: number
    goal_id: number
    created_at: number
}

export function useTransationrepository(){
    const database = useSQLiteContext()

    function findLatest() {
        try {
          return database.getAllSync<TransactionResponseDatabase>(
            "SELECT * FROM transactions1 ORDER BY created_at DESC LIMIT 10"
          )
        } catch (error) {
          throw error
        }
      }

      function findByGoal(goalId: number) {
        try {
          const statement = database.prepareSync(
            "SELECT * FROM transactions1 WHERE goal_id = $goal_id"
          )
    
          const result = statement.executeSync<TransactionResponseDatabase>({
            $goal_id: goalId,
          })
    
          return result.getAllSync()
        } catch (error) {
          throw error
        }
      }

    function create(transactions: TransactionCreateDatabase){
        try {
            const statement = database.prepareSync(
                "INSERT INTO transactions1 (amount, goal_id) VALUES ($amount, $goal_id)"
            )

            statement.executeSync({
                $amount: transactions.amount,
                $goal_id: transactions.goalId
            })

        } catch (error) {
            throw error
        }
    }

    return{
        create,
        findByGoal,
        findLatest,
    }
    
}