import * as productsData from "@/data/products";

const checkMockProducts = () => {
  try {
    console.log("Checking mock product data...");
    
    // Get all products from mock data
    const products = productsData.products || [];
    console.log(`Found ${products.length} products in mock data`);
    
    if (products.length === 0) {
      console.error("No products found in mock data!");
      return;
    }
    
    // Print a sample product
    console.log("Sample product:", products[0]);
    
    // Check if the getProductById function works correctly
    const sampleProductId = products[0].id;
    const retrievedProduct = productsData.getProductById(sampleProductId);
    
    if (retrievedProduct) {
      console.log(`Successfully retrieved product by ID: ${sampleProductId}`);
      console.log("Retrieved product:", retrievedProduct);
    } else {
      console.error(`Failed to retrieve product by ID: ${sampleProductId}`);
    }
    
    // Check all IDs are unique
    const productIds = new Set();
    const duplicateIds = [];
    
    products.forEach(product => {
      if (productIds.has(product.id)) {
        duplicateIds.push(product.id);
      } else {
        productIds.add(product.id);
      }
    });
    
    if (duplicateIds.length > 0) {
      console.error(`Found ${duplicateIds.length} duplicate product IDs:`, duplicateIds);
    } else {
      console.log("All product IDs are unique");
    }
    
    // Verify that all parent_id references are valid
    const invalidParentIds = [];
    
    products.forEach(product => {
      if (product.parent_id && !productIds.has(product.parent_id)) {
        invalidParentIds.push({
          productId: product.id,
          invalidParentId: product.parent_id
        });
      }
    });
    
    if (invalidParentIds.length > 0) {
      console.error(`Found ${invalidParentIds.length} invalid parent_id references:`, invalidParentIds);
    } else {
      console.log("All parent_id references are valid");
    }
    
    console.log("Mock data check completed");
  } catch (error) {
    console.error("Error checking mock data:", error);
  }
};

// Execute the check
checkMockProducts(); 