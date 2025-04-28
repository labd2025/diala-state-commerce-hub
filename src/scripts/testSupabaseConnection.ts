import { supabase } from "@/integrations/supabase/client";

const testSupabaseConnection = async () => {
  try {
    console.log("Testing Supabase connection...");
    
    // Test Supabase URL and API key
    console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log("Supabase Key (First 10 chars):", import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 10) + "...");
    
    // Check if supabase object is properly initialized
    if (!supabase) {
      console.error("Supabase client is not initialized!");
      return;
    }
    
    // Test connection with a simple query
    const { data, error } = await supabase.from("products").select("id").limit(1);
    
    if (error) {
      console.error("Error connecting to Supabase:", error);
      return;
    }
    
    console.log("Successfully connected to Supabase!");
    console.log("Sample data:", data);
    
    // Check tables
    const { data: tables, error: tablesError } = await supabase.rpc('dbschema');
    
    if (tablesError) {
      console.error("Error fetching schema:", tablesError);
    } else {
      console.log("Available tables:", tables);
    }
    
    // List products table
    console.log("Checking products table...");
    const { data: productsCount, error: productsError } = await supabase
      .from("products")
      .select("id", { count: "exact" });
    
    if (productsError) {
      console.error("Error with products table:", productsError);
    } else {
      console.log(`Found ${productsCount?.length || 0} products in database`);
    }
    
    // List cart_items table
    console.log("Checking cart_items table...");
    const { data: cartItemsCount, error: cartItemsError } = await supabase
      .from("cart_items")
      .select("id", { count: "exact" });
    
    if (cartItemsError) {
      console.error("Error with cart_items table:", cartItemsError);
    } else {
      console.log(`Found ${cartItemsCount?.length || 0} cart items in database`);
    }
    
    console.log("Supabase connection test completed");
  } catch (error) {
    console.error("Unexpected error during Supabase connection test:", error);
  }
};

// Execute the test
testSupabaseConnection(); 