// src/data/mockData.ts
import { User, Product, ProductRequest, Branch, UserRole, Supplier } from '@/types';

export const DEMO_USERS: User[] = [
  {
    id: '1',
    username: 'main.manager',
    password: 'main123',
    role: 'main_manager',
    name: 'Sarah Johnson'
  },
  {
    id: '2',
    username: 'branch.downtown',
    password: 'branch123',
    role: 'branch_manager',
    name: 'Mike Chen',
    branchId: 'branch-1'
  },
  {
    id: '3',
    username: 'branch.uptown',
    password: 'branch123',
    role: 'branch_manager',
    name: 'Lisa Rodriguez',
    branchId: 'branch-2'
  },
  {
    id: '4',
    username: 'kitchen.manager',
    password: 'kitchen123',
    role: 'central_kitchen_manager',
    name: 'David Kim'
  },
  {
    id: '5',
    username: 'inventory.manager',
    password: 'inventory123',
    role: 'inventory_manager',
    name: 'Emma Wilson'
  },
  {
    id: '6',
    username: 'supplier.manager',
    password: 'supplier123',
    role: 'supplier_manager',
    name: 'James Brown'
  },
  {
    id: '7',
    username: 'logistics.manager',
    password: 'logistics123',
    role: 'logistics_manager',
    name: 'Maria Santos'
  }
];

export const BRANCHES: Branch[] = [
  {
    id: 'branch-1',
    name: 'Blumen Downtown',
    location: '123 Main Street',
    managerId: '2'
  },
  {
    id: 'branch-2',
    name: 'Blumen Uptown',
    location: '456 Oak Avenue',
    managerId: '3'
  },
  {
    id: 'central-kitchen',
    name: 'Central Kitchen',
    location: '789 Industrial District',
    managerId: '4'
  },
  {
    id: 'main-warehouse',
    name: 'Main Warehouse',
    location: '321 Storage Complex',
    managerId: '5'
  }
];

export const SUPPLIERS: Supplier[] = [
  {
    id: 'supplier-1',
    name: 'RUKN AL MOUWAREDEN',
    contactPerson: 'Ahmed Al-Rashid',
    email: 'ahmed@rukn.com',
    phone: '+966-11-123-4567',
    categories: ['Dairy', 'Condiments', 'Baking Supplies', 'Spices'],
    reliability: 'excellent'
  },
  {
    id: 'supplier-2',
    name: 'WAHEJ AL KHAYAL',
    contactPerson: 'Fatima Al-Zahra',
    email: 'fatima@wahej.com',
    phone: '+966-11-234-5678',
    categories: ['Fresh Produce', 'Fruits', 'Vegetables'],
    reliability: 'excellent'
  },
  {
    id: 'supplier-3',
    name: 'CDC',
    contactPerson: 'Omar Hassan',
    email: 'omar@cdc.com',
    phone: '+966-11-345-6789',
    categories: ['Food Coloring', 'Additives'],
    reliability: 'good'
  },
  {
    id: 'supplier-4',
    name: 'MAWADUNA',
    contactPerson: 'Aisha Mohammed',
    email: 'aisha@mawaduna.com',
    phone: '+966-11-456-7890',
    categories: ['Glucose', 'Stabilizers'],
    reliability: 'good'
  },
  {
    id: 'supplier-5',
    name: 'SAUDI SANDS',
    contactPerson: 'Khalid Al-Nasser',
    email: 'khalid@saudisands.com',
    phone: '+966-11-567-8901',
    categories: ['Vanilla', 'Chocolate', 'Specialty Items'],
    reliability: 'excellent'
  },
  {
    id: 'supplier-6',
    name: 'MARAEE',
    contactPerson: 'Nora Al-Fahad',
    email: 'nora@maraee.com',
    phone: '+966-11-678-9012',
    categories: ['Dairy', 'Bread', 'Cheese', 'Meat'],
    reliability: 'excellent'
  },
  {
    id: 'supplier-7',
    name: 'TRANSMED',
    contactPerson: 'Saeed Al-Qahtani',
    email: 'saeed@transmed.com',
    phone: '+966-11-789-0123',
    categories: ['Meat', 'Protein'],
    reliability: 'good'
  },
  {
    id: 'supplier-8',
    name: 'TAMIMI',
    contactPerson: 'Hind Al-Otaibi',
    email: 'hind@tamimi.com',
    phone: '+966-11-890-1234',
    categories: ['Pickles', 'Preserved Foods'],
    reliability: 'good'
  },
  {
    id: 'supplier-9',
    name: 'AL WIKALAT AL ARABIA',
    contactPerson: 'Youssef Al-Maliki',
    email: 'youssef@wikalat.com',
    phone: '+966-11-901-2345',
    categories: ['Dairy', 'Specialty Items'],
    reliability: 'excellent'
  },
  {
    id: 'supplier-10',
    name: 'HESHAM SAYED',
    contactPerson: 'Hesham Sayed',
    email: 'hesham@hesham.com',
    phone: '+966-11-012-3456',
    categories: ['Cocoa', 'Chocolate Products'],
    reliability: 'good'
  },
  {
    id: 'supplier-11',
    name: 'FOOD CHOICE',
    contactPerson: 'Layla Al-Shehri',
    email: 'layla@foodchoice.com',
    phone: '+966-11-123-4567',
    categories: ['Flour', 'Grains'],
    reliability: 'excellent'
  }
];

// Branch Items - for outlets/branches
export const BRANCH_PRODUCTS: Product[] = [
  // Coffee Beans
  { id: 'branch-1', name: 'Peaberry beans', category: 'Coffee Beans', description: 'Premium peaberry coffee beans', basePrice: 45.00, productType: 'branch_item' },
  { id: 'branch-2', name: 'Iywana beans', category: 'Coffee Beans', description: 'Iywana specialty coffee beans', basePrice: 42.00, productType: 'branch_item' },
  { id: 'branch-3', name: 'Fazenda beans', category: 'Coffee Beans', description: 'Fazenda premium coffee beans', basePrice: 48.00, productType: 'branch_item' },
  { id: 'branch-4', name: 'William morra beans', category: 'Coffee Beans', description: 'William morra artisan coffee beans', basePrice: 50.00, productType: 'branch_item' },
  { id: 'branch-5', name: 'Guji beans', category: 'Coffee Beans', description: 'Ethiopian Guji coffee beans', basePrice: 52.00, productType: 'branch_item' },
  
  // Dairy & Liquids
  { id: 'branch-6', name: 'Milk', category: 'Dairy', description: 'Fresh whole milk', basePrice: 8.00, productType: 'branch_item' },
  { id: 'branch-7', name: 'Nova water', category: 'Beverages', description: 'Nova bottled water', basePrice: 2.50, productType: 'branch_item' },
  { id: 'branch-8', name: 'Condensed Milk', category: 'Dairy', description: 'Sweetened condensed milk', basePrice: 6.00, productType: 'branch_item' },
  
  // Syrups
  { id: 'branch-9', name: 'Passion fruit syrup', category: 'Syrups', description: 'Passion fruit flavored syrup', basePrice: 12.00, productType: 'branch_item' },
  { id: 'branch-10', name: 'Rose berry syrup', category: 'Syrups', description: 'Rose berry flavored syrup', basePrice: 12.00, productType: 'branch_item' },
  { id: 'branch-11', name: 'Watermelon syrup', category: 'Syrups', description: 'Watermelon flavored syrup', basePrice: 12.00, productType: 'branch_item' },
  { id: 'branch-12', name: 'Vanilla syrup', category: 'Syrups', description: 'Vanilla flavored syrup', basePrice: 10.00, productType: 'branch_item' },
  { id: 'branch-13', name: 'Carmel syrup', category: 'Syrups', description: 'Caramel flavored syrup', basePrice: 10.00, productType: 'branch_item' },
  { id: 'branch-14', name: 'Mint syrup', category: 'Syrups', description: 'Mint flavored syrup', basePrice: 10.00, productType: 'branch_item' },
  { id: 'branch-15', name: 'Mango syrup', category: 'Syrups', description: 'Mango flavored syrup', basePrice: 12.00, productType: 'branch_item' },
  { id: 'branch-16', name: 'Sugar syrup', category: 'Syrups', description: 'Simple sugar syrup', basePrice: 8.00, productType: 'branch_item' },
  
  // Equipment
  { id: 'branch-17', name: 'v60 drip funnel', category: 'Equipment', description: 'V60 coffee drip funnel', basePrice: 25.00, productType: 'branch_item' },
  { id: 'branch-18', name: 'Hibiscus flower', category: 'Ingredients', description: 'Dried hibiscus flowers', basePrice: 15.00, productType: 'branch_item' },
  { id: 'branch-19', name: 'Chocolate powder', category: 'Ingredients', description: 'Hot chocolate powder', basePrice: 18.00, productType: 'branch_item' },
  { id: 'branch-20', name: 'Coffee day filters', category: 'Equipment', description: 'Coffee day paper filters', basePrice: 12.00, productType: 'branch_item' },
  { id: 'branch-21', name: 'v6 filters', category: 'Equipment', description: 'V6 coffee filters', basePrice: 15.00, productType: 'branch_item' },
  
  // Beverages
  { id: 'branch-22', name: 'Spark', category: 'Beverages', description: 'Spark energy drink', basePrice: 8.00, productType: 'branch_item' },
  { id: 'branch-23', name: 'Soda', category: 'Beverages', description: 'Assorted soda drinks', basePrice: 6.00, productType: 'branch_item' },
  { id: 'branch-24', name: 'Rosberry', category: 'Beverages', description: 'Rosberry flavored drink', basePrice: 7.00, productType: 'branch_item' },
  { id: 'branch-25', name: 'Blackberry', category: 'Beverages', description: 'Blackberry flavored drink', basePrice: 7.00, productType: 'branch_item' },
  
  // Powders & Additives
  { id: 'branch-26', name: 'Vanilla powder', category: 'Ingredients', description: 'Vanilla powder additive', basePrice: 20.00, productType: 'branch_item' },
  { id: 'branch-27', name: 'Almond', category: 'Ingredients', description: 'Almond pieces', basePrice: 25.00, productType: 'branch_item' },
  { id: 'branch-28', name: 'Flake chocolate', category: 'Ingredients', description: 'Chocolate flakes', basePrice: 18.00, productType: 'branch_item' },
  
  // Packaging
  { id: 'branch-29', name: 'Bamboo box', category: 'Packaging', description: 'Bamboo takeaway box', basePrice: 3.00, productType: 'branch_item' },
  { id: 'branch-30', name: 'ice cream cup 4oz', category: 'Packaging', description: '4oz ice cream cups', basePrice: 0.50, productType: 'branch_item' },
  { id: 'branch-31', name: 'ice cream cup 8oz', category: 'Packaging', description: '8oz ice cream cups', basePrice: 0.75, productType: 'branch_item' },
  { id: 'branch-32', name: '12 oz take away cup', category: 'Packaging', description: '12oz takeaway cups', basePrice: 0.60, productType: 'branch_item' },
  { id: 'branch-33', name: 'alumunium plate', category: 'Packaging', description: 'Aluminum serving plates', basePrice: 2.00, productType: 'branch_item' },
  { id: 'branch-34', name: 'Croissant dine in plate', category: 'Packaging', description: 'Croissant dine-in plates', basePrice: 4.00, productType: 'branch_item' },
  { id: 'branch-35', name: 'Choco Bomb plate', category: 'Packaging', description: 'Chocolate bomb serving plates', basePrice: 5.00, productType: 'branch_item' },
  
  // Supplies
  { id: 'branch-36', name: 'expiration roll', category: 'Supplies', description: 'Expiration date labels', basePrice: 8.00, productType: 'branch_item' },
  { id: 'branch-37', name: 'black sticker', category: 'Supplies', description: 'Black label stickers', basePrice: 5.00, productType: 'branch_item' },
  { id: 'branch-38', name: 'Cling film', category: 'Supplies', description: 'Food-grade cling film', basePrice: 12.00, productType: 'branch_item' },
  { id: 'branch-39', name: 'steel plate', category: 'Equipment', description: 'Stainless steel plates', basePrice: 15.00, productType: 'branch_item' },
  
  // Paper Cups
  { id: 'branch-40', name: '12 oz paper cup', category: 'Packaging', description: '12oz paper cups', basePrice: 0.40, productType: 'branch_item' },
  { id: 'branch-41', name: '8 oz paper cup', category: 'Packaging', description: '8oz paper cups', basePrice: 0.35, productType: 'branch_item' },
  { id: 'branch-42', name: '6 oz paper cup', category: 'Packaging', description: '6oz paper cups', basePrice: 0.30, productType: 'branch_item' },
  { id: 'branch-43', name: '4 oz paper cup', category: 'Packaging', description: '4oz paper cups', basePrice: 0.25, productType: 'branch_item' },
  
  // Plastic Cups
  { id: 'branch-44', name: '16 oz plastic cup', category: 'Packaging', description: '16oz plastic cups', basePrice: 0.50, productType: 'branch_item' },
  { id: 'branch-45', name: '12 oz plastic cup', category: 'Packaging', description: '12oz plastic cups', basePrice: 0.45, productType: 'branch_item' },
  { id: 'branch-46', name: '12 oz karkade cup', category: 'Packaging', description: '12oz karkade cups', basePrice: 0.60, productType: 'branch_item' },
  { id: 'branch-47', name: '16 oz ice blumen cup', category: 'Packaging', description: '16oz ice blumen cups', basePrice: 0.70, productType: 'branch_item' },
  
  // Safety & Hygiene
  { id: 'branch-48', name: 'Gloves box L / xL', category: 'Safety', description: 'Disposable gloves L/XL', basePrice: 15.00, productType: 'branch_item' },
  { id: 'branch-49', name: 'Mask box', category: 'Safety', description: 'Disposable face masks', basePrice: 20.00, productType: 'branch_item' },
  { id: 'branch-50', name: 'Blue tissue', category: 'Supplies', description: 'Blue cleaning tissues', basePrice: 8.00, productType: 'branch_item' },
  
  // Lids
  { id: 'branch-51', name: '12 oz pepper (lid)', category: 'Packaging', description: '12oz cup lids', basePrice: 0.20, productType: 'branch_item' },
  { id: 'branch-52', name: '8 oz paper (lid)', category: 'Packaging', description: '8oz paper cup lids', basePrice: 0.18, productType: 'branch_item' },
  { id: 'branch-53', name: '6 oz paper (lid)', category: 'Packaging', description: '6oz paper cup lids', basePrice: 0.15, productType: 'branch_item' },
  { id: 'branch-54', name: '4 oz paper (lid)', category: 'Packaging', description: '4oz paper cup lids', basePrice: 0.12, productType: 'branch_item' },
  { id: 'branch-55', name: '16 oz plastic (lid)', category: 'Packaging', description: '16oz plastic cup lids', basePrice: 0.25, productType: 'branch_item' },
  { id: 'branch-56', name: '12 oz plastic (lid)', category: 'Packaging', description: '12oz plastic cup lids', basePrice: 0.22, productType: 'branch_item' },
  
  // Additional Supplies
  { id: 'branch-57', name: 'White Tissue roll', category: 'Supplies', description: 'White tissue roll', basePrice: 6.00, productType: 'branch_item' },
  { id: 'branch-58', name: 'Spoon', category: 'Utensils', description: 'Disposable spoons', basePrice: 4.00, productType: 'branch_item' },
  { id: 'branch-59', name: 'White tissue', category: 'Supplies', description: 'White napkins', basePrice: 5.00, productType: 'branch_item' },
  { id: 'branch-60', name: 'Straw', category: 'Utensils', description: 'Drinking straws', basePrice: 3.00, productType: 'branch_item' },
  { id: 'branch-61', name: 'Cup holder (2 Disposable)', category: 'Packaging', description: '2-cup disposable holders', basePrice: 1.00, productType: 'branch_item' },
  { id: 'branch-62', name: 'Cup holder (4 Disposable)', category: 'Packaging', description: '4-cup disposable holders', basePrice: 1.50, productType: 'branch_item' },
  
  // Professional Equipment
  { id: 'branch-63', name: 'stainless steel shaker', category: 'Equipment', description: 'Stainless steel cocktail shaker', basePrice: 35.00, productType: 'branch_item' },
  { id: 'branch-64', name: 'Shoot glass', category: 'Equipment', description: 'Shot glasses', basePrice: 8.00, productType: 'branch_item' },
  { id: 'branch-65', name: 'Milk pitcher', category: 'Equipment', description: 'Milk steaming pitcher', basePrice: 25.00, productType: 'branch_item' },
  { id: 'branch-66', name: 'Tray', category: 'Equipment', description: 'Serving trays', basePrice: 20.00, productType: 'branch_item' },
  
  // Office Supplies
  { id: 'branch-67', name: 'stapler - Staples', category: 'Office', description: 'Stapler with staples', basePrice: 15.00, productType: 'branch_item' },
  { id: 'branch-68', name: 'Cash rolls', category: 'Office', description: 'Cash register paper rolls', basePrice: 10.00, productType: 'branch_item' },
  { id: 'branch-69', name: 'Span rolls', category: 'Office', description: 'Span receipt rolls', basePrice: 12.00, productType: 'branch_item' },
  
  // Stickers & Labels
  { id: 'branch-70', name: 'V60 sticker', category: 'Supplies', description: 'V60 product stickers', basePrice: 5.00, productType: 'branch_item' },
  { id: 'branch-71', name: 'Delivery stickers', category: 'Supplies', description: 'Delivery labels', basePrice: 6.00, productType: 'branch_item' },
  { id: 'branch-72', name: 'Chocomiso cup stickers', category: 'Supplies', description: 'Chocomiso cup stickers', basePrice: 7.00, productType: 'branch_item' },
  
  // Barista Tools
  { id: 'branch-73', name: 'tamper and distributor', category: 'Equipment', description: 'Espresso tamper and distributor', basePrice: 45.00, productType: 'branch_item' },
  { id: 'branch-74', name: 'Small brush', category: 'Equipment', description: 'Small cleaning brush', basePrice: 8.00, productType: 'branch_item' },
  { id: 'branch-75', name: 'Coffe day box', category: 'Packaging', description: 'Coffee day boxes', basePrice: 2.00, productType: 'branch_item' },
  { id: 'branch-76', name: 'Espresso ceramic', category: 'Equipment', description: 'Espresso ceramic cups', basePrice: 12.00, productType: 'branch_item' },
  { id: 'branch-77', name: 'V60 servers', category: 'Equipment', description: 'V60 coffee servers', basePrice: 30.00, productType: 'branch_item' }
];

// Kitchen Raw Items - for central kitchen
export const KITCHEN_PRODUCTS: Product[] = [
  // Dairy Products
  { id: 'kitchen-1', name: 'Cream cheese', category: 'Dairy', description: 'Philadelphia cream cheese', basePrice: 15.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-2', name: 'Lady finger', category: 'Baking', description: 'Lady finger cookies', basePrice: 12.00, productType: 'kitchen_ingredient', supplier: 'AL WIKALAT AL ARABIA' },
  { id: 'kitchen-3', name: 'Egg box', category: 'Dairy', description: 'Fresh eggs (30 pcs)', basePrice: 20.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  
  // Fresh Fruits
  { id: 'kitchen-4', name: 'Strawberry', category: 'Fruits', description: 'Fresh strawberries', basePrice: 25.00, productType: 'kitchen_ingredient', supplier: 'WAHEJ AL KHAYAL' },
  { id: 'kitchen-5', name: 'Blackberry', category: 'Fruits', description: 'Fresh blackberries', basePrice: 30.00, productType: 'kitchen_ingredient', supplier: 'WAHEJ AL KHAYAL' },
  { id: 'kitchen-6', name: 'Raspberry', category: 'Fruits', description: 'Fresh raspberries', basePrice: 32.00, productType: 'kitchen_ingredient', supplier: 'WAHEJ AL KHAYAL' },
  { id: 'kitchen-7', name: 'Blueberry', category: 'Fruits', description: 'Fresh blueberries', basePrice: 35.00, productType: 'kitchen_ingredient', supplier: 'WAHEJ AL KHAYAL' },
  
  // Dairy & Fats
  { id: 'kitchen-8', name: 'Butter', category: 'Dairy', description: 'Unsalted butter', basePrice: 18.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-9', name: 'Condensed milk', category: 'Dairy', description: 'Sweetened condensed milk', basePrice: 8.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-10', name: 'Bony milk', category: 'Dairy', description: 'Bony brand milk', basePrice: 6.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  
  // Confectionery
  { id: 'kitchen-11', name: 'Bueno', category: 'Confectionery', description: 'Kinder Bueno', basePrice: 22.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  
  // Spices & Seasonings
  { id: 'kitchen-12', name: 'Cardamom', category: 'Spices', description: 'Ground cardamom', basePrice: 45.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-13', name: 'Cinnamon powder', category: 'Spices', description: 'Ground cinnamon', basePrice: 20.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-14', name: 'Milk powder', category: 'Dairy', description: 'Whole milk powder', basePrice: 25.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  
  // Baking & Desserts
  { id: 'kitchen-15', name: 'Disgestive biscuit', category: 'Baking', description: 'Digestive biscuits', basePrice: 8.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-16', name: 'Nesquik', category: 'Beverages', description: 'Nesquik chocolate drink', basePrice: 15.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  
  // Condiments
  { id: 'kitchen-17', name: 'Meyonise', category: 'Condiments', description: 'Mayonnaise', basePrice: 12.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-18', name: 'Hot sauce', category: 'Condiments', description: 'Hot chili sauce', basePrice: 8.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-19', name: 'Tomato ketchup', category: 'Condiments', description: 'Tomato ketchup', basePrice: 6.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  
  // Baking Ingredients
  { id: 'kitchen-20', name: 'Gelatine sheet', category: 'Baking', description: 'Gelatine sheets 400g', basePrice: 18.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-21', name: 'Oreo', category: 'Baking', description: 'Oreo cookies', basePrice: 15.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-22', name: 'Baking powder', category: 'Baking', description: 'Baking powder 200g', basePrice: 8.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-23', name: 'Baking soda', category: 'Baking', description: 'Baking soda 100g', basePrice: 5.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  
  // Oils & Fats
  { id: 'kitchen-24', name: 'Corn Oil', category: 'Oils', description: 'Corn oil 3L', basePrice: 25.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-25', name: 'Vanilla essence', category: 'Flavorings', description: 'Vanilla essence 1L', basePrice: 35.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  
  // Food Coloring
  { id: 'kitchen-26', name: 'Red color', category: 'Coloring', description: 'Red food coloring', basePrice: 12.00, productType: 'kitchen_ingredient', supplier: 'CDC' },
  { id: 'kitchen-27', name: 'Black color', category: 'Coloring', description: 'Black food coloring', basePrice: 15.00, productType: 'kitchen_ingredient', supplier: 'CDC' },
  
  // Specialty Items
  { id: 'kitchen-28', name: 'Glucose powder', category: 'Baking', description: 'Glucose powder', basePrice: 20.00, productType: 'kitchen_ingredient', supplier: 'MAWADUNA' },
  { id: 'kitchen-29', name: 'Stabilizer 2000', category: 'Baking', description: 'Food stabilizer', basePrice: 25.00, productType: 'kitchen_ingredient', supplier: 'MAWADUNA' },
  { id: 'kitchen-30', name: 'Worcester sauce', category: 'Condiments', description: 'Worcestershire sauce', basePrice: 15.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  
  // Specialty Baking
  { id: 'kitchen-31', name: 'Lotus biscuit', category: 'Baking', description: 'Lotus biscuits', basePrice: 18.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-32', name: 'Lotus spread', category: 'Spreads', description: 'Lotus biscuit spread', basePrice: 22.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-33', name: 'Nutella', category: 'Spreads', description: 'Nutella hazelnut spread', basePrice: 25.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-34', name: 'Vanilla pods', category: 'Flavorings', description: 'Vanilla pods 250g', basePrice: 65.00, productType: 'kitchen_ingredient', supplier: 'SAUDI SANDS' },
  
  // More Condiments
  { id: 'kitchen-35', name: 'Mustard paste', category: 'Condiments', description: 'Dijon mustard paste', basePrice: 12.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-36', name: 'Ginger Gaelic paste', category: 'Condiments', description: 'Ginger garlic paste', basePrice: 10.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-37', name: 'Pesto', category: 'Condiments', description: 'Basil pesto sauce', basePrice: 18.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  
  // Cheese & Meat
  { id: 'kitchen-38', name: 'Halloumi cheese', category: 'Dairy', description: 'Halloumi cheese', basePrice: 28.00, productType: 'kitchen_ingredient', supplier: 'MARAEE' },
  { id: 'kitchen-39', name: 'Roast Beef', category: 'Meat', description: 'Sliced roast beef 250g', basePrice: 35.00, productType: 'kitchen_ingredient', supplier: 'TRANSMED' },
  { id: 'kitchen-40', name: 'Turkey', category: 'Meat', description: 'Sliced turkey 250g', basePrice: 32.00, productType: 'kitchen_ingredient', supplier: 'TRANSMED' },
  
  // Vegetables
  { id: 'kitchen-41', name: 'Tomato', category: 'Vegetables', description: 'Fresh tomatoes 1kg', basePrice: 8.00, productType: 'kitchen_ingredient', supplier: 'WAHEJ AL KHAYAL' },
  { id: 'kitchen-42', name: 'Salt', category: 'Seasonings', description: 'Table salt 2kg', basePrice: 4.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-43', name: 'Corn flour', category: 'Flour', description: 'Corn starch flour 1kg', basePrice: 6.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-44', name: 'Dedicated coconut', category: 'Baking', description: 'Desiccated coconut 1kg', basePrice: 12.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-45', name: 'Dry yeast', category: 'Baking', description: 'Active dry yeast 500g', basePrice: 8.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  
  // Chocolate Products
  { id: 'kitchen-46', name: 'Milk chcokate', category: 'Chocolate', description: 'Milk chocolate 7kg', basePrice: 180.00, productType: 'kitchen_ingredient', supplier: 'SAUDI SANDS' },
  { id: 'kitchen-47', name: 'Dark chcokate', category: 'Chocolate', description: 'Dark chocolate 3kg', basePrice: 95.00, productType: 'kitchen_ingredient', supplier: 'SAUDI SANDS' },
  { id: 'kitchen-48', name: 'Lemon essence', category: 'Flavorings', description: 'Lemon essence 2 bottles', basePrice: 15.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-49', name: 'Peacan', category: 'Nuts', description: 'Pecan nuts 500g', basePrice: 45.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-50', name: 'Mushroom', category: 'Vegetables', description: 'Fresh mushrooms 1kg', basePrice: 15.00, productType: 'kitchen_ingredient', supplier: 'WAHEJ AL KHAYAL' },
  { id: 'kitchen-51', name: 'Olive oil', category: 'Oils', description: 'Extra virgin olive oil 1L', basePrice: 28.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  
  // Bread & Bakery
  { id: 'kitchen-52', name: 'Brioche bread', category: 'Bread', description: 'Brioche bread 10 pieces', basePrice: 25.00, productType: 'kitchen_ingredient', supplier: 'MARAEE' },
  { id: 'kitchen-53', name: 'Milk fresh', category: 'Dairy', description: 'Fresh milk 40L', basePrice: 120.00, productType: 'kitchen_ingredient', supplier: 'MARAEE' },
  
  // Leafy Greens
  { id: 'kitchen-54', name: 'Lettuce', category: 'Vegetables', description: 'Fresh lettuce 2 heads', basePrice: 8.00, productType: 'kitchen_ingredient', supplier: 'WAHEJ AL KHAYAL' },
  { id: 'kitchen-55', name: 'Rocket leaves', category: 'Vegetables', description: 'Fresh rocket leaves 2 packs', basePrice: 12.00, productType: 'kitchen_ingredient', supplier: 'WAHEJ AL KHAYAL' },
  
  // Dairy Products
  { id: 'kitchen-56', name: 'Labna', category: 'Dairy', description: 'Labna cheese 2 containers', basePrice: 15.00, productType: 'kitchen_ingredient', supplier: 'MARAEE' },
  { id: 'kitchen-57', name: 'Maqdoos', category: 'Pickles', description: 'Pickled baby eggplant 2 jars', basePrice: 18.00, productType: 'kitchen_ingredient', supplier: 'TAMIMI' },
  { id: 'kitchen-58', name: 'Cheese slice', category: 'Dairy', description: 'Sliced cheese 4 packs', basePrice: 20.00, productType: 'kitchen_ingredient', supplier: 'MARAEE' },
  { id: 'kitchen-59', name: 'Crossiant', category: 'Pastries', description: 'Croissants 25 pieces', basePrice: 50.00, productType: 'kitchen_ingredient', supplier: 'SAUDI SANDS' },
  { id: 'kitchen-60', name: 'Yoghurt', category: 'Dairy', description: 'Greek yogurt 2kg', basePrice: 25.00, productType: 'kitchen_ingredient', supplier: 'MARAEE' },
  
  // Fruits
  { id: 'kitchen-61', name: 'Fresh mango', category: 'Fruits', description: 'Fresh mangoes 4kg', basePrice: 60.00, productType: 'kitchen_ingredient', supplier: 'WAHEJ AL KHAYAL' },
  { id: 'kitchen-62', name: 'Mascarpone', category: 'Dairy', description: 'Mascarpone cheese 70 containers', basePrice: 350.00, productType: 'kitchen_ingredient', supplier: 'SAUDI SANDS' },
  { id: 'kitchen-63', name: 'Whipping cream', category: 'Dairy', description: 'Heavy whipping cream 90L', basePrice: 450.00, productType: 'kitchen_ingredient', supplier: 'AL WIKALAT AL ARABIA' },
  { id: 'kitchen-64', name: 'Chicken', category: 'Meat', description: 'Fresh chicken 2kg', basePrice: 35.00, productType: 'kitchen_ingredient', supplier: 'MARAEE' },
  { id: 'kitchen-65', name: 'Mango puree', category: 'Fruits', description: 'Mango puree 1.3kg', basePrice: 45.00, productType: 'kitchen_ingredient', supplier: 'SAUDI SANDS' },
  
  // Basic Ingredients
  { id: 'kitchen-66', name: 'Sugar', category: 'Baking', description: 'White sugar 6kg', basePrice: 18.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-67', name: 'Icing sugar', category: 'Baking', description: 'Powdered sugar 8kg', basePrice: 24.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-68', name: 'Cocoa powder', category: 'Baking', description: 'Cocoa powder 1kg', basePrice: 35.00, productType: 'kitchen_ingredient', supplier: 'HESHAM SAYED' },
  { id: 'kitchen-69', name: 'Flour', category: 'Baking', description: 'All-purpose flour 10kg', basePrice: 25.00, productType: 'kitchen_ingredient', supplier: 'FOOD CHOICE' },
  
  // Spices
  { id: 'kitchen-70', name: 'Black pepper', category: 'Spices', description: 'Ground black pepper 1 pack', basePrice: 12.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-71', name: 'White pepper', category: 'Spices', description: 'Ground white pepper 1 pack', basePrice: 14.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-72', name: 'Coking cream', category: 'Dairy', description: 'Cooking cream 2 containers', basePrice: 16.00, productType: 'kitchen_ingredient', supplier: 'MARAEE' },
  { id: 'kitchen-73', name: 'almond powder', category: 'Nuts', description: 'Almond powder', basePrice: 35.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' },
  { id: 'kitchen-74', name: 'almond flakes', category: 'Nuts', description: 'Almond flakes', basePrice: 30.00, productType: 'kitchen_ingredient', supplier: 'RUKN AL MOUWAREDEN' }
];

// Combine all products
export const PRODUCTS: Product[] = [
  ...BRANCH_PRODUCTS,
  ...KITCHEN_PRODUCTS,
  // Legacy products for backward compatibility
  {
    id: 'prod-1',
    name: 'Chocomisu',
    category: 'Desserts',
    description: 'Rich chocolate tiramisu with coffee essence',
    basePrice: 8.50,
    productType: 'branch_item'
  },
  {
    id: 'prod-2',
    name: 'Cake Flake',
    category: 'Pastries',
    description: 'Delicate layered cake with vanilla cream',
    basePrice: 6.75,
    productType: 'branch_item'
  },
  {
    id: 'prod-3',
    name: 'Mango Cream',
    category: 'Desserts',
    description: 'Fresh mango mousse with tropical flavors',
    basePrice: 7.25,
    productType: 'branch_item'
  },
  {
    id: 'prod-4',
    name: 'Espresso Blend',
    category: 'Beverages',
    description: 'Premium coffee blend for espresso drinks',
    basePrice: 4.50,
    productType: 'branch_item'
  },
  {
    id: 'prod-5',
    name: 'Croissant Classic',
    category: 'Pastries',
    description: 'Buttery French croissant, freshly baked',
    basePrice: 3.25,
    productType: 'branch_item'
  },
  {
    id: 'prod-6',
    name: 'Berry Tart',
    category: 'Desserts',
    description: 'Mixed berry tart with custard filling',
    basePrice: 9.00,
    productType: 'branch_item'
  },
  {
    id: 'prod-7',
    name: 'Matcha Latte Mix',
    category: 'Beverages',
    description: 'Premium matcha powder for lattes',
    basePrice: 5.75,
    productType: 'branch_item'
  },
  {
    id: 'prod-8',
    name: 'Chocolate Eclair',
    category: 'Pastries',
    description: 'Classic eclair filled with chocolate cream',
    basePrice: 4.95,
    productType: 'branch_item'
  }
];

export const MOCK_REQUESTS: ProductRequest[] = [
  {
    id: 'req-1',
    type: 'product_request',
    productId: 'prod-1',
    branchId: 'branch-1',
    requestedBy: '2',
    orderQuantity: 50,
    balanceQuantity: 15,
    status: 'pending',
    currentApprover: 'main_manager',
    approvalHistory: [
      {
        role: 'branch_manager',
        userId: '2',
        action: 'approved',
        timestamp: '2024-01-15T10:30:00Z',
        notes: 'High demand for weekend rush'
      }
    ],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    notes: 'Weekend special promotion'
  },
  {
    id: 'req-2',
    type: 'product_request',
    productId: 'prod-3',
    branchId: 'branch-2',
    requestedBy: '3',
    orderQuantity: 30,
    balanceQuantity: 8,
    status: 'in_progress',
    currentApprover: 'central_kitchen_manager',
    approvalHistory: [
      {
        role: 'branch_manager',
        userId: '3',
        action: 'approved',
        timestamp: '2024-01-14T14:20:00Z'
      },
      {
        role: 'main_manager',
        userId: '1',
        action: 'approved',
        timestamp: '2024-01-14T16:45:00Z',
        notes: 'Approved for seasonal menu'
      }
    ],
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T16:45:00Z'
  },
  {
    id: 'req-3',
    type: 'product_request',
    productId: 'prod-5',
    branchId: 'branch-1',
    requestedBy: '2',
    orderQuantity: 100,
    balanceQuantity: 25,
    status: 'approved',
    currentApprover: null,
    approvalHistory: [
      {
        role: 'branch_manager',
        userId: '2',
        action: 'approved',
        timestamp: '2024-01-13T09:15:00Z'
      },
      {
        role: 'main_manager',
        userId: '1',
        action: 'approved',
        timestamp: '2024-01-13T11:30:00Z'
      },
      {
        role: 'central_kitchen_manager',
        userId: '4',
        action: 'approved',
        timestamp: '2024-01-13T13:45:00Z'
      },
      {
        role: 'main_manager',
        userId: '1',
        action: 'approved',
        timestamp: '2024-01-13T14:00:00Z'
      },
      {
        role: 'inventory_manager',
        userId: '5',
        action: 'approved',
        timestamp: '2024-01-13T15:20:00Z'
      },
      {
        role: 'main_manager',
        userId: '1',
        action: 'approved',
        timestamp: '2024-01-13T15:35:00Z'
      },
      {
        role: 'supplier_manager',
        userId: '6',
        action: 'approved',
        timestamp: '2024-01-13T16:50:00Z'
      },
      {
        role: 'main_manager',
        userId: '1',
        action: 'approved',
        timestamp: '2024-01-13T17:00:00Z'
      }
    ],
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T17:00:00Z'
  }
];