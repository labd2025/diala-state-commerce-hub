import { supabase } from "@/integrations/supabase/client";

/**
 * Check if a table exists in the Supabase database.
 */
export const checkTableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      console.error(`Error checking table ${tableName}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Exception checking table ${tableName}:`, error);
    return false;
  }
};

/**
 * Check if the database is properly set up (all required tables exist).
 */
export const checkDatabaseSetup = async (): Promise<{
  isSetUp: boolean;
  missingTables: string[];
}> => {
  const requiredTables = ['products', 'cart_items'];
  const missingTables: string[] = [];
  
  for (const table of requiredTables) {
    const exists = await checkTableExists(table);
    if (!exists) {
      missingTables.push(table);
    }
  }
  
  return {
    isSetUp: missingTables.length === 0,
    missingTables
  };
};

/**
 * Initialize database with diagnostic logging
 */
export const initializeDatabase = async (): Promise<boolean> => {
  console.log("Initializing database connection...");
  
  try {
    // Check if Supabase URL and key are set
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase URL or key is not set in environment variables");
      return false;
    }
    
    console.log("Supabase URL:", supabaseUrl);
    console.log("Supabase key is set");
    
    // Check database setup
    const { isSetUp, missingTables } = await checkDatabaseSetup();
    
    if (!isSetUp) {
      console.error(`Database is not properly set up. Missing tables: ${missingTables.join(', ')}`);
      return false;
    }
    
    console.log("Database is properly set up");
    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    return false;
  }
};

/**
 * Add initial diagnostic logging to the application
 */
export const logSupabaseStatus = () => {
  console.log("Checking Supabase status...");
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKeyPrefix = import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 5);
  
  if (!supabaseUrl || !supabaseKeyPrefix) {
    console.error("Supabase environment variables are not properly configured");
  } else {
    console.log(`Supabase configured with URL: ${supabaseUrl}`);
    console.log(`Supabase key starts with: ${supabaseKeyPrefix}...`);
  }
}; 