const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const users = [
  {
    name: 'Barista Admin',
    email: 'admin@cafebarista.com',
    password: 'admin123', // Will be hashed by pre-save middleware
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'customer@gmail.com',
    password: 'customer123', // Will be hashed by pre-save middleware
    role: 'user'
  }
];

const products = [
  // Cakes
  {
    name: 'Belgian Chocolate Truffle Cake',
    price: 350.00,
    rating: 4.9,
    category: 'Cakes',
    description: 'Rich and dense Belgian dark chocolate cake layered with silky chocolate truffle ganache. A true chocolate lover’s dream.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600',
    isFeatured: true,
    isTrending: true
  },
  {
    name: 'Red Velvet Cream Cheese Cake',
    price: 380.00,
    rating: 4.8,
    category: 'Cakes',
    description: 'Vibrant red cocoa sponge cake layered with premium rich cream cheese frosting and dusted with red velvet crumbs.',
    image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Blueberry Cheesecake',
    price: 420.00,
    rating: 4.9,
    category: 'Cakes',
    description: 'Creamy New York style baked cheesecake on a graham cracker crust, topped with sweet organic wild blueberry compote.',
    image: 'https://images.unsplash.com/photo-1524351199679-46cddf530c04?auto=format&fit=crop&q=80&w=600',
    isFeatured: true
  },
  {
    name: 'Lotus Biscoff Crunch Cake',
    price: 450.00,
    rating: 4.9,
    category: 'Cakes',
    description: 'Indulgent cake infused with Lotus Biscoff spread, layered with cookie butter cream, and topped with crunchy Biscoff biscuit crumbs.',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=600',
    isTrending: true
  },
  {
    name: 'Classic Black Forest Cake',
    price: 320.00,
    rating: 4.6,
    category: 'Cakes',
    description: 'Traditional German style cake with layers of chocolate sponge, whipped cream, sour cherries, and shaved dark chocolate.',
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Tiramisu Coffee Cake (Italian)',
    price: 390.00,
    rating: 4.8,
    category: 'Cakes',
    description: 'Sponges soaked in robust espresso syrup, layered with smooth mascarpone cheese cream, and dusted with dark cocoa powder.',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Mango Vanilla Celebration Cake',
    price: 340.00,
    rating: 4.7,
    category: 'Cakes',
    description: 'Light vanilla sponge layered with fresh, sweet Alphonso mango cream and chunks of juicy local mangoes.',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Japanese Cotton Cheesecake (Japanese)',
    price: 480.00,
    rating: 4.9,
    category: 'Cakes',
    description: 'Incredibly light, fluffy, and jiggly cheesecake made using traditional Japanese baking techniques. Melts in your mouth.',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600',
    isFeatured: true
  },
  {
    name: 'Rasmalai Fusion Cake (Indian)',
    price: 400.00,
    rating: 4.9,
    category: 'Cakes',
    description: 'Delectable fusion dessert featuring cardamom-infused sponge soaked in saffron milk and layered with real Rasmalai chunks.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Hazelnut Ferrero Rocher Cake',
    price: 490.00,
    rating: 4.9,
    category: 'Cakes',
    description: 'Rich hazelnut cocoa sponge layered with Nutella buttercream, roasted hazelnut pieces, and crowned with Ferrero Rocher chocolates.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
    isTrending: true
  },

  // Pastries
  {
    name: 'Chocolate Éclair (French)',
    price: 120.00,
    rating: 4.7,
    category: 'Pastries',
    description: 'Crisp choux pastry shell filled with rich chocolate pastry cream and topped with shiny dark chocolate glaze.',
    image: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Strawberry Mille-Feuille (French)',
    price: 150.00,
    rating: 4.8,
    category: 'Pastries',
    description: 'Layers of crispy puff pastry sandwiched with rich vanilla pastry cream and fresh strawberries. Dusted with powdered sugar.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600',
    isFeatured: true
  },
  {
    name: 'Opera Pastry (French)',
    price: 160.00,
    rating: 4.8,
    category: 'Pastries',
    description: 'Classic French almond sponge cake layered with coffee buttercream and chocolate ganache, topped with chocolate glaze.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
    isTrending: true
  },
  {
    name: 'Biscoff Cream Pastry',
    price: 140.00,
    rating: 4.6,
    category: 'Pastries',
    description: 'Soft layered pastry filled with cookie butter frosting and crushed Biscoff cookies.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Pineapple Fresh Cream Pastry',
    price: 100.00,
    rating: 4.5,
    category: 'Pastries',
    description: 'Light vanilla sponge pastry layered with whipped fresh cream, juicy pineapple chunks, and cherry toppings.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Matcha Cream Pastry (Japanese)',
    price: 160.00,
    rating: 4.7,
    category: 'Pastries',
    description: 'Elegant pastry featuring ceremonial matcha green tea cream layered between light sponge sheets.',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Tiramisu Pastry (Italian)',
    price: 150.00,
    rating: 4.8,
    category: 'Pastries',
    description: 'Single-serving slice of Italian tiramisu, soaked in espresso syrup and layered with sweet mascarpone cream.',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Choco Lava Pastry',
    price: 110.00,
    rating: 4.9,
    category: 'Pastries',
    description: 'Warm, soft chocolate pastry with a gooey, molten dark chocolate lava center. Served ready to melt in your mouth.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
    isFeatured: true
  },

  // Cupcakes
  {
    name: 'Vanilla Buttercream Cupcake',
    price: 80.00,
    rating: 4.5,
    category: 'Cupcakes',
    description: 'Fluffy vanilla bean cupcake topped with a classic, silky smooth vanilla buttercream swirl and sprinkles.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Triple Chocolate Cupcake',
    price: 90.00,
    rating: 4.8,
    category: 'Cupcakes',
    description: 'Chocolate sponge cupcake filled with fudge sauce, topped with rich chocolate buttercream and chocolate chips.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Red Velvet Cupcake',
    price: 90.00,
    rating: 4.7,
    category: 'Cupcakes',
    description: 'Mild cocoa velvet cupcake decorated with a signature swirls of sweet cream cheese frosting.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Cookies & Cream Cupcake',
    price: 95.00,
    rating: 4.6,
    category: 'Cupcakes',
    description: 'Vanilla cupcake baked with Oreo cookie chunks, topped with cookies and cream frosting and a mini Oreo.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Salted Caramel Cupcake',
    price: 95.00,
    rating: 4.8,
    category: 'Cupcakes',
    description: 'Caramel sponge cupcake filled with liquid salted caramel, topped with caramel buttercream and sea salt flakes.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600',
    isFeatured: true
  },
  {
    name: 'Matcha Green Tea Cupcake (Japanese)',
    price: 110.00,
    rating: 4.7,
    category: 'Cupcakes',
    description: 'Japanese-style cupcake made with Uji matcha, frosted with a light and earthy matcha green tea buttercream.',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Espresso Mocha Cupcake',
    price: 100.00,
    rating: 4.8,
    category: 'Cupcakes',
    description: 'Rich coffee and chocolate cupcake frosted with a robust espresso-infused mocha buttercream.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600',
    isTrending: true
  },

  // Donuts
  {
    name: 'Classic Glazed Donut',
    price: 90.00,
    rating: 4.6,
    category: 'Donuts',
    description: 'Soft, airy yeast-raised donut covered in a thin, sweet sugar glaze that melts in your mouth.',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Nutella Filled Donut',
    price: 120.00,
    rating: 4.9,
    category: 'Donuts',
    description: 'Fluffy donut rolled in sugar and generously filled with creamy hazelnut Nutella spread.',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Cinnamon Sugar Donut',
    price: 90.00,
    rating: 4.5,
    category: 'Donuts',
    description: 'Freshly fried donut tossed in a sweet mixture of aromatic ground cinnamon and sugar.',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Lotus Biscoff Donut',
    price: 130.00,
    rating: 4.8,
    category: 'Donuts',
    description: 'Brioche donut dipped in Lotus Biscoff cookie spread and sprinkled with crunchy caramelized biscuit bits.',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600',
    isFeatured: true
  },
  {
    name: 'Strawberry Sprinkle Donut',
    price: 95.00,
    rating: 4.6,
    category: 'Donuts',
    description: 'Classic ring donut glazed with pink strawberry frosting and topped with colorful rainbow sprinkles.',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Korean Garlic Cream Cheese Donut (Korean Inspired)',
    price: 140.00,
    rating: 4.9,
    category: 'Donuts',
    description: 'Savory sweet donut loaded with garlic herb butter glaze and filled with sweet cream cheese frosting.',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600',
    isTrending: true
  },
  {
    name: 'Chocolate Oreo Donut',
    price: 110.00,
    rating: 4.7,
    category: 'Donuts',
    description: 'Donut coated with chocolate glaze and topped with crushed Oreo chocolate cookies.',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600'
  },

  // Cookies
  {
    name: 'Classic Choco Chip Cookies',
    price: 60.00,
    rating: 4.7,
    category: 'Cookies',
    description: 'Crispy on the edges, chewy in the center cookie loaded with premium semi-sweet chocolate chips.',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Double Chocolate Cookies',
    price: 70.00,
    rating: 4.8,
    category: 'Cookies',
    description: 'Fudgy cocoa cookie packed with white and dark chocolate chips for double the chocolate punch.',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Almond Butter Cookies',
    price: 80.00,
    rating: 4.6,
    category: 'Cookies',
    description: 'Rich cookies baked with pure almond butter and topped with slivered toasted almonds.',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Red Velvet Cookies',
    price: 75.00,
    rating: 4.7,
    category: 'Cookies',
    description: 'Beautiful red velvet cookies with a soft center, loaded with sweet white chocolate chips.',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Matcha White Chocolate Cookies (Japanese)',
    price: 90.00,
    rating: 4.8,
    category: 'Cookies',
    description: 'Earthy green tea matcha cookies loaded with sweet white chocolate chunks. A perfect sweet balance.',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=600',
    isFeatured: true
  },
  {
    name: 'Peanut Butter Cookies',
    price: 75.00,
    rating: 4.5,
    category: 'Cookies',
    description: 'Traditional chewy cookies made with creamy peanut butter and marked with the classic fork pattern.',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Oatmeal Raisin Cookies',
    price: 70.00,
    rating: 4.6,
    category: 'Cookies',
    description: 'Hearty whole oats cookie spiced with cinnamon and sweetened with plump organic raisins.',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Nutella Stuffed Cookies',
    price: 95.00,
    rating: 4.9,
    category: 'Cookies',
    description: 'Thick chocolate chip cookie with a surprise molten core of sweet hazelnut Nutella spread.',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=600',
    isTrending: true
  },

  // Sandwiches
  {
    name: 'Veg Grilled Cheese Sandwich',
    price: 120.00,
    rating: 4.6,
    category: 'Sandwiches',
    description: 'Crispy grilled sandwich loaded with cheddar, mozzarella, bell peppers, corn, and house herbs.',
    image: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Paneer Tikka Sandwich (Indian)',
    price: 150.00,
    rating: 4.9,
    category: 'Sandwiches',
    description: 'Tandoori spiced paneer cubes grilled with mint chutney, sliced onions, and melted cheese on wheat bread.',
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Bombay Masala Sandwich (Indian)',
    price: 130.00,
    rating: 4.8,
    category: 'Sandwiches',
    description: 'Classic Bombay street-style sandwich loaded with potato masala, cucumber, tomatoes, mint chutney, and sandwich masala.',
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Chicken Peri Peri Sandwich',
    price: 180.00,
    rating: 4.8,
    category: 'Sandwiches',
    description: 'Juicy shredded chicken tossed in spicy peri peri sauce, layered with cheese and fresh lettuce in grilled bread.',
    image: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?auto=format&fit=crop&q=80&w=600',
    isFeatured: true
  },
  {
    name: 'Korean Kimchi Chicken Sandwich (Korean)',
    price: 190.00,
    rating: 4.9,
    category: 'Sandwiches',
    description: 'Spicy gochujang glazed chicken thigh, tangy house-made kimchi, and sesame mayo served in toasted brioche bread.',
    image: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?auto=format&fit=crop&q=80&w=600',
    isTrending: true
  },
  {
    name: 'Mexican Bean Salsa Sandwich (Mexican)',
    price: 160.00,
    rating: 4.7,
    category: 'Sandwiches',
    description: 'Mexican style refried beans, spicy tomato salsa, jalapeños, and melted cheese toasted to perfection.',
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Italian Pesto Mozzarella Sandwich (Italian)',
    price: 180.00,
    rating: 4.8,
    category: 'Sandwiches',
    description: 'Toasted focaccia spread with fresh basil pesto, filled with thick fresh mozzarella slices and heirloom tomatoes.',
    image: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Japanese Katsu Sandwich (Japanese)',
    price: 200.00,
    rating: 4.9,
    category: 'Sandwiches',
    description: 'Crispy fried panko-breaded chicken breast with tonkatsu sauce and shredded cabbage between soft milk bread.',
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=600',
    isFeatured: true
  },

  // Fries
  {
    name: 'Classic Salted Fries',
    price: 90.00,
    rating: 4.5,
    category: 'Fries',
    description: 'Golden crispy double-cooked potato fries sprinkled with fine sea salt. Served with ketchup.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Peri Peri Fries',
    price: 110.00,
    rating: 4.7,
    category: 'Fries',
    description: 'Crispy potato fries tossed in a spicy, tangy African-inspired peri peri seasoning mix.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Loaded Cheese Fries',
    price: 140.00,
    rating: 4.8,
    category: 'Fries',
    description: 'Crispy fries smothered in warm cheese sauce, topped with spring onions and pickled jalapeños.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600',
    isTrending: true
  },
  {
    name: 'Mexican Salsa Fries (Mexican)',
    price: 150.00,
    rating: 4.7,
    category: 'Fries',
    description: 'French fries topped with freshly chopped pico de gallo, sour cream, guacamole, and cheese sauce.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Korean Spicy Fries (Korean)',
    price: 150.00,
    rating: 4.8,
    category: 'Fries',
    description: 'Crispy French fries tossed in a sweet and spicy gochujang glaze, topped with sesame seeds and green onions.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Truffle Parmesan Fries (French Inspired)',
    price: 180.00,
    rating: 4.9,
    category: 'Fries',
    description: 'Crispy fries drizzled with aromatic white truffle oil, grated Parmesan cheese, and fresh rosemary.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600',
    isFeatured: true
  },
  {
    name: 'Schezwan Fries (Chinese)',
    price: 130.00,
    rating: 4.6,
    category: 'Fries',
    description: 'Crispy potato fries tossed in hot and spicy Schezwan sauce, topped with roasted garlic.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600'
  },

  // Pasta
  {
    name: 'Alfredo White Sauce Pasta (Italian)',
    price: 220.00,
    rating: 4.8,
    category: 'Pasta',
    description: 'Penne pasta tossed in rich, creamy Parmesan cheese sauce with mushrooms and Italian herbs.',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Arrabbiata Red Sauce Pasta (Italian)',
    price: 200.00,
    rating: 4.7,
    category: 'Pasta',
    description: 'Penne pasta in a fiery red tomato sauce infused with chili flakes, garlic, and fresh basil.',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Pink Sauce Pasta',
    price: 210.00,
    rating: 4.8,
    category: 'Pasta',
    description: 'A perfect fusion of rich creaminess and tangy tomato sauces tossed with mixed seasonal vegetables.',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Pesto Basil Pasta (Italian)',
    price: 240.00,
    rating: 4.9,
    category: 'Pasta',
    description: 'Penne or fusilli pasta coated in aromatic house-made basil pine nut pesto, cherry tomatoes, and Parmesan.',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=600',
    isFeatured: true
  },
  {
    name: 'Mac & Cheese Pasta',
    price: 220.00,
    rating: 4.7,
    category: 'Pasta',
    description: 'Macaroni baked in a ultra-creamy, gooey cheddar and mozzarella cheese sauce, topped with toasted breadcrumbs.',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Spicy Korean Gochujang Pasta (Korean Fusion)',
    price: 250.00,
    rating: 4.9,
    category: 'Pasta',
    description: 'Pasta in a creamy, sweet, and spicy Korean gochujang chili sauce with green onion and sesame garnish.',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=600',
    isTrending: true
  },
  {
    name: 'Cheesy Baked Pasta',
    price: 260.00,
    rating: 4.8,
    category: 'Pasta',
    description: 'Pasta loaded with red sauce, fresh veggies, and a double layer of mozzarella baked golden brown.',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=600'
  },

  // Pizza
  {
    name: 'Margherita Pizza (Italian)',
    price: 250.00,
    rating: 4.8,
    category: 'Pizza',
    description: 'Classic neapolitan-style pizza with house tomato sauce, fresh mozzarella cheese, and fresh basil leaves.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Farmhouse Veg Pizza',
    price: 290.00,
    rating: 4.7,
    category: 'Pizza',
    description: 'Loaded with crunchy bell peppers, onions, tomatoes, mushrooms, olives, and mozzarella.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Paneer Tikka Pizza (Indian Fusion)',
    price: 320.00,
    rating: 4.9,
    category: 'Pizza',
    description: 'Topped with tandoori paneer tikka cubes, capsicum, onions, coriander, and spicy mint chutney drizzle.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
    isFeatured: true
  },
  {
    name: 'Mexican Fiesta Pizza (Mexican)',
    price: 320.00,
    rating: 4.8,
    category: 'Pizza',
    description: 'Spicy tomato sauce, sweet corn, black beans, jalapeños, onions, and cheese, topped with fresh salsa.',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Korean BBQ Chicken Pizza (Korean Fusion)',
    price: 350.00,
    rating: 4.9,
    category: 'Pizza',
    description: 'Sweet and smoky Korean BBQ chicken, red onions, mozzarella, sesame seed drizzle, and green scallions.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
    isTrending: true
  },
  {
    name: 'Pepperoni Pizza',
    price: 380.00,
    rating: 4.9,
    category: 'Pizza',
    description: 'Simple and premium. Generous slices of spicy Italian pork pepperoni and melted mozzarella cheese.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Four Cheese Pizza',
    price: 360.00,
    rating: 4.7,
    category: 'Pizza',
    description: 'A white pizza featuring mozzarella, gorgonzola, Parmesan, and cream cheese for cheese lovers.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Spicy Schezwan Pizza (Chinese Fusion)',
    price: 310.00,
    rating: 4.6,
    category: 'Pizza',
    description: 'Topped with a spicy Schezwan sauce base, paneer or chicken, bell peppers, and scallions.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600'
  },

  // Burgers
  {
    name: 'Classic Veg Burger',
    price: 120.00,
    rating: 4.6,
    category: 'Burgers',
    description: 'Crispy potato-veggie patty in a toasted sesame bun with lettuce, tomato, onions, and burger mayo.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Crispy Chicken Burger',
    price: 160.00,
    rating: 4.8,
    category: 'Burgers',
    description: 'Crispy panko-fried chicken breast fillet topped with cheese, spicy mayo, and pickles on a brioche bun.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Paneer Maharaja Burger (Indian)',
    price: 180.00,
    rating: 4.9,
    category: 'Burgers',
    description: 'Thick paneer tikka patty double-stacked with tandoori mayo, onion rings, lettuce, and slice of cheese.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
    isFeatured: true
  },
  {
    name: 'Korean Spicy Chicken Burger (Korean)',
    price: 190.00,
    rating: 4.9,
    category: 'Burgers',
    description: 'Crispy chicken thigh glazed with sweet and spicy gochujang sauce, topped with sesame coleslaw.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
    isTrending: true
  },
  {
    name: 'Mexican Jalapeño Burger (Mexican)',
    price: 170.00,
    rating: 4.7,
    category: 'Burgers',
    description: 'Veg or chicken patty topped with spicy salsa, nacho cheese sauce, and pickled jalapeños.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Double Cheese Burger',
    price: 200.00,
    rating: 4.8,
    category: 'Burgers',
    description: 'Two flame-grilled chicken patties or veg patties with double cheese slices and signature burger sauce.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'BBQ Smoky Burger',
    price: 180.00,
    rating: 4.7,
    category: 'Burgers',
    description: 'Grilled patty loaded with caramelized onions, crispy onion rings, and sweet smoky BBQ sauce.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Mushroom Melt Burger',
    price: 190.00,
    rating: 4.8,
    category: 'Burgers',
    description: 'Juicy patty topped with sautéed wild mushrooms and melted Swiss cheese sauce.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600'
  },

  // Noodles
  {
    name: 'Veg Hakka Noodles (Chinese)',
    price: 160.00,
    rating: 4.6,
    category: 'Noodles',
    description: 'Stir-fried Hakka noodles tossed with crunchy cabbage, capsicum, carrots, and spring onions with soy sauce.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Chicken Schezwan Noodles (Chinese)',
    price: 190.00,
    rating: 4.8,
    category: 'Noodles',
    description: 'Hot stir-fried noodles tossed with shredded chicken, veggies, and a fiery Schezwan chili paste.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Korean Ramen Bowl (Korean)',
    price: 250.00,
    rating: 4.9,
    category: 'Noodles',
    description: 'Authentic spicy broth ramen topped with a soft-boiled egg, tofu or chicken, green onion, and sesame seeds.',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=600',
    isFeatured: true
  },
  {
    name: 'Garlic Butter Udon (Japanese)',
    price: 240.00,
    rating: 4.8,
    category: 'Noodles',
    description: 'Thick chew udon noodles tossed in rich garlic butter, light soy sauce, and topped with nori strips.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Teriyaki Stir Fry Noodles (Japanese)',
    price: 220.00,
    rating: 4.7,
    category: 'Noodles',
    description: 'Stir fried noodles coated in sweet and savory teriyaki glaze with bell peppers, broccoli, and sesame seeds.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Spicy Kimchi Noodles (Korean)',
    price: 200.00,
    rating: 4.8,
    category: 'Noodles',
    description: 'Stir-fried noodles with tangy fermented kimchi, vegetables, and Korean chili flakes.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600',
    isTrending: true
  },
  {
    name: 'Chili Garlic Noodles (Chinese)',
    price: 170.00,
    rating: 4.7,
    category: 'Noodles',
    description: 'Spicy noodles stir-fried with dry red chilies, crushed garlic cloves, and mixed vegetables.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600'
  },

  // Quick Bites
  {
    name: 'Cheesy Nachos (Mexican)',
    price: 150.00,
    rating: 4.6,
    category: 'Quick Bites',
    description: 'Crispy corn tortilla chips smothered in hot nacho cheese sauce, jalapeños, and fresh tomato salsa.',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Chicken Popcorn',
    price: 160.00,
    rating: 4.8,
    category: 'Quick Bites',
    description: 'Bite-sized tender chicken pieces double-breaded and deep fried. Served with spicy dipping sauce.',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=600',
    isTrending: true
  },
  {
    name: 'Veg Spring Rolls (Chinese)',
    price: 120.00,
    rating: 4.5,
    category: 'Quick Bites',
    description: 'Crispy golden rolls filled with stir-fried Chinese cabbage, carrot, and onion shreds. Served with sweet chili sauce.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Korean Corn Cheese Cups (Korean)',
    price: 140.00,
    rating: 4.8,
    category: 'Quick Bites',
    description: 'Sweet corn kernels baked in mayonnaise, butter, and loaded with mozzarella cheese. Served piping hot.',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Japanese Takoyaki Bites (Japanese Inspired)',
    price: 180.00,
    rating: 4.8,
    category: 'Quick Bites',
    description: 'Savory ball-shaped snacks filled with octopus or veg, drizzled with takoyaki sauce and mayonnaise.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Paneer Tikka Skewers (Indian)',
    price: 160.00,
    rating: 4.9,
    category: 'Quick Bites',
    description: 'Grilled paneer cubes marinated in yogurt and Indian spices, skewered with bell peppers and onions.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Loaded Bruschetta (Italian)',
    price: 150.00,
    rating: 4.7,
    category: 'Quick Bites',
    description: 'Toasted baguette slices topped with marinated tomatoes, fresh garlic, olive oil, basil, and balsamic glaze.',
    image: 'https://images.unsplash.com/photo-1573145959956-e9dac559146e?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Momos with Schezwan Dip (Chinese Fusion)',
    price: 130.00,
    rating: 4.9,
    category: 'Quick Bites',
    description: 'Steamed vegetable or chicken dumplings served with a super spicy local Schezwan dipping sauce.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
    isFeatured: true
  },

  // Coffee
  {
    name: 'Espresso',
    price: 90.00,
    rating: 4.8,
    category: 'Coffee',
    description: 'A concentrated double shot of our house blend arabica beans with a thick, golden crema.',
    image: 'https://images.unsplash.com/photo-151097252790b-af4f40d91fd7?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Americano',
    price: 110.00,
    rating: 4.7,
    category: 'Coffee',
    description: 'Espresso shot diluted with hot water, presenting a robust coffee flavor profile.',
    image: 'https://images.unsplash.com/photo-151097252790b-af4f40d91fd7?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Cappuccino',
    price: 140.00,
    rating: 4.9,
    category: 'Coffee',
    description: 'Classic brew of equal parts espresso, steamed milk, and dense velvety milk microfoam. Dusted with cocoa.',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=600',
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: 'Latte',
    price: 150.00,
    rating: 4.8,
    category: 'Coffee',
    description: 'Espresso shot topped with steamed milk and a thin layer of microfoam. Smooth and creamy.',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Mocha',
    price: 160.00,
    rating: 4.8,
    category: 'Coffee',
    description: 'Espresso combined with dark chocolate sauce and steamed milk, topped with whipped cream.',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Caramel Macchiato',
    price: 180.00,
    rating: 4.9,
    category: 'Coffee',
    description: 'Steamed milk stained with espresso and vanilla syrup, drizzled with sweet caramel sauce.',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=600',
    isTrending: true
  },
  {
    name: 'Hazelnut Cold Coffee',
    price: 170.00,
    rating: 4.9,
    category: 'Coffee',
    description: 'Creamy chilled espresso blended with milk, vanilla ice cream, and premium hazelnut syrup.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Vanilla Iced Latte',
    price: 160.00,
    rating: 4.8,
    category: 'Coffee',
    description: 'Chilled espresso poured over ice and cold milk, sweetened with sweet vanilla bean syrup.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Korean Dalgona Coffee (Korean)',
    price: 150.00,
    rating: 4.8,
    category: 'Coffee',
    description: 'Whipped, frothy caramelized coffee cream layered over sweet chilled milk. A popular Korean trend.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Affogato (Italian)',
    price: 180.00,
    rating: 4.9,
    category: 'Coffee',
    description: 'A scoop of creamy vanilla bean gelato drowned in a hot shot of freshly pulled espresso.',
    image: 'https://images.unsplash.com/photo-151097252790b-af4f40d91fd7?auto=format&fit=crop&q=80&w=600',
    isFeatured: true
  },

  // Tea
  {
    name: 'Masala Chai (Indian)',
    price: 60.00,
    rating: 4.9,
    category: 'Tea',
    description: 'Spiced Indian milk tea brewed with crushed cardamom, cloves, cinnamon, ginger, and black tea leaves.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Elaichi Tea (Indian)',
    price: 60.00,
    rating: 4.8,
    category: 'Tea',
    description: 'Fragrant and comforting milk tea brewed with fresh green cardamom pods.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'English Breakfast Tea',
    price: 90.00,
    rating: 4.6,
    category: 'Tea',
    description: 'A robust blend of fine black tea leaves. Served hot with milk and sugar on the side.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Green Tea',
    price: 80.00,
    rating: 4.7,
    category: 'Tea',
    description: 'Antioxidant-rich organic green tea leaves steeped to perfection. Refreshing and light.',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Matcha Latte (Japanese)',
    price: 180.00,
    rating: 4.9,
    category: 'Tea',
    description: 'Whisked ceremonial Japanese Uji matcha green tea powder layered with steamed vanilla milk.',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600',
    isFeatured: true
  },
  {
    name: 'Lemon Honey Tea',
    price: 90.00,
    rating: 4.6,
    category: 'Tea',
    description: 'Warm black or green tea sweetened with wild organic honey and squeezed fresh lemon.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Kashmiri Kahwa (Indian)',
    price: 120.00,
    rating: 4.9,
    category: 'Tea',
    description: 'Traditional Kashmiri green tea brewed with saffron strands, cardamom, cinnamon, and slivered almonds.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600',
    isTrending: true
  },
  {
    name: 'Thai Iced Tea',
    price: 150.00,
    rating: 4.8,
    category: 'Tea',
    description: 'Sweet, orange-colored brewed tea spiced with star anise, served over ice and topped with condensed milk.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600'
  },

  // Cold Beverages
  {
    name: 'Oreo Milkshake',
    price: 160.00,
    rating: 4.8,
    category: 'Cold Beverages',
    description: 'Chilled milkshake blended with Oreo cookies, vanilla ice cream, and topped with whipped cream.',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Belgian Chocolate Shake',
    price: 180.00,
    rating: 4.9,
    category: 'Cold Beverages',
    description: 'Creamy milkshake made with genuine melted Belgian chocolate ganache and chocolate ice cream.',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Strawberry Cheesecake Shake',
    price: 190.00,
    rating: 4.9,
    category: 'Cold Beverages',
    description: 'Thick gourmet shake blended with real cream cheese, fresh strawberries, and biscuit crumbs.',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600',
    isFeatured: true
  },
  {
    name: 'Mango Smoothie',
    price: 160.00,
    rating: 4.7,
    category: 'Cold Beverages',
    description: 'Creamy yogurt smoothie blended with ripe sweet mango pulp and raw honey.',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Virgin Mojito',
    price: 130.00,
    rating: 4.6,
    category: 'Cold Beverages',
    description: 'Refreshing cooler made with muddled fresh mint leaves, lime wedges, simple syrup, and sparkling soda.',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Blue Lagoon Cooler',
    price: 130.00,
    rating: 4.7,
    category: 'Cold Beverages',
    description: 'A vibrant blue, fizzy citrus mocktail made with blue curaçao syrup, lime juice, and sprite.',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Peach Iced Tea',
    price: 120.00,
    rating: 4.8,
    category: 'Cold Beverages',
    description: 'Chilled black tea shaken with sweet peach syrup, ice cubes, and fresh mint.',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Watermelon Mint Cooler',
    price: 130.00,
    rating: 4.7,
    category: 'Cold Beverages',
    description: 'Freshly pressed cold watermelon juice shaken with lime juice, mint leaves, and ice.',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Korean Strawberry Milk (Korean)',
    price: 160.00,
    rating: 4.9,
    category: 'Cold Beverages',
    description: 'Fresh hand-mashed strawberry compote layered with cold milk. Sweet, fresh, and cute.',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600',
    isTrending: true
  },
  {
    name: 'Japanese Yuzu Soda (Japanese)',
    price: 170.00,
    rating: 4.8,
    category: 'Cold Beverages',
    description: 'Sparkling citrus soda made with real yuzu fruit puree imported from Japan.',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600'
  },

  // Desserts
  {
    name: 'Chocolate Brownie with Ice Cream',
    price: 150.00,
    rating: 4.9,
    category: 'Desserts',
    description: 'Warm, gooey chocolate walnut brownie topped with a scoop of vanilla bean gelato and hot fudge chocolate sauce.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Belgian Waffle Sundae',
    price: 180.00,
    rating: 4.8,
    category: 'Desserts',
    description: 'Freshly baked warm Belgian waffle topped with chocolate curls, maple syrup, chocolate syrup, and vanilla gelato.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Tiramisu Cup (Italian)',
    price: 160.00,
    rating: 4.9,
    category: 'Desserts',
    description: 'Premium cup layering espresso-infused ladyfingers with rich mascarpone egg custard and cocoa.',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=600',
    isFeatured: true
  },
  {
    name: 'Gulab Jamun Cheesecake (Indian Fusion)',
    price: 190.00,
    rating: 4.9,
    category: 'Desserts',
    description: 'A decadent cardamom-spiced cheesecake built on a biscuit crust with soft Gulab Jamuns embedded inside.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true
  },
  {
    name: 'Macarons (French)',
    price: 180.00,
    rating: 4.7,
    category: 'Desserts',
    description: 'Assortment of five delicate French almond meringue cookies with ganache filling (pistachio, chocolate, rose, raspberry, lemon).',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
    isTrending: true
  },
  {
    name: 'Mochi Ice Cream (Japanese)',
    price: 160.00,
    rating: 4.8,
    category: 'Desserts',
    description: 'Three soft, chewy sweet rice dough balls filled with premium ice cream (matcha, strawberry, chocolate).',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Korean Bingsu (Korean)',
    price: 200.00,
    rating: 4.9,
    category: 'Desserts',
    description: 'Traditional Korean shaved milk snow topped with sweet red beans, fresh mangoes, condensed milk, and mochi.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
    isFeatured: true
  },
  {
    name: 'Churros with Chocolate Dip (Mexican)',
    price: 150.00,
    rating: 4.8,
    category: 'Desserts',
    description: 'Crispy fried Mexican dough sticks dusted in cinnamon sugar, served with warm dark chocolate dipping sauce.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Crème Brûlée (French)',
    price: 180.00,
    rating: 4.8,
    category: 'Desserts',
    description: 'A rich and creamy custard base topped with a hard, contrastingly texturized layer of caramelized sugar burnt with a blowtorch.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
    isTrending: true
  },
  {
    name: 'Honey Toast Delight (Japanese Inspired)',
    price: 195.00,
    rating: 4.9,
    category: 'Desserts',
    description: 'A thick block of hollowed honey-butter toasted bread filled with toasted bread cubes, topped with vanilla gelato and whipped cream.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600'
  }
];

const imageMapping = {
  // Cakes
  'Belgian Chocolate Truffle Cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600',
  'Red Velvet Cream Cheese Cake': 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&q=80&w=600',
  'Blueberry Cheesecake': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=600',
  'Lotus Biscoff Crunch Cake': 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=600',
  'Classic Black Forest Cake': 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=600',
  'Tiramisu Coffee Cake (Italian)': 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=600',
  'Mango Vanilla Celebration Cake': 'https://images.unsplash.com/photo-1562007908-859b4ba9a1a2?auto=format&fit=crop&q=80&w=600',
  'Japanese Cotton Cheesecake (Japanese)': 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&q=80&w=600',
  'Rasmalai Fusion Cake (Indian)': 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=600',
  'Hazelnut Ferrero Rocher Cake': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',

  // Pastries
  'Chocolate Éclair (French)': 'https://images.unsplash.com/photo-1626200419199-391ae4be7e41?auto=format&fit=crop&q=80&w=600',
  'Strawberry Mille-Feuille (French)': 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&q=80&w=600',
  'Opera Pastry (French)': 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&q=80&w=600',
  'Biscoff Cream Pastry': 'https://images.unsplash.com/photo-1508737804141-4c3b688e25be?auto=format&fit=crop&q=80&w=600',
  'Pineapple Fresh Cream Pastry': 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=600',
  'Matcha Cream Pastry (Japanese)': 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600',
  'Tiramisu Pastry (Italian)': 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=600',
  'Choco Lava Pastry': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',

  // Cupcakes
  'Vanilla Buttercream Cupcake': 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=600',
  'Triple Chocolate Cupcake': 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&q=80&w=600',
  'Red Velvet Cupcake': 'https://images.unsplash.com/photo-1614707267537-b85acf00c4b8?auto=format&fit=crop&q=80&w=600',
  'Cookies & Cream Cupcake': 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=600',
  'Salted Caramel Cupcake': 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=600',
  'Matcha Green Tea Cupcake (Japanese)': 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600',
  'Espresso Mocha Cupcake': 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=600',

  // Donuts
  'Classic Glazed Donut': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600',
  'Nutella Filled Donut': 'https://images.unsplash.com/photo-1533930027538-ee98425d57b2?auto=format&fit=crop&q=80&w=600',
  'Cinnamon Sugar Donut': 'https://images.unsplash.com/photo-1612240498936-65f5101365d2?auto=format&fit=crop&q=80&w=600',
  'Lotus Biscoff Donut': 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=600',
  'Strawberry Sprinkle Donut': 'https://images.unsplash.com/photo-1614081396447-da71b791e86a?auto=format&fit=crop&q=80&w=600',
  'Korean Garlic Cream Cheese Donut (Korean Inspired)': 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?auto=format&fit=crop&q=80&w=600',
  'Chocolate Oreo Donut': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600',

  // Cookies
  'Classic Choco Chip Cookies': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=600',
  'Double Chocolate Cookies': 'https://images.unsplash.com/photo-1584080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600',
  'Almond Butter Cookies': 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600',
  'Red Velvet Cookies': 'https://images.unsplash.com/photo-1618922896942-881bfa7d206f?auto=format&fit=crop&q=80&w=600',
  'Matcha White Chocolate Cookies (Japanese)': 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600',
  'Peanut Butter Cookies': 'https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&q=80&w=600',
  'Oatmeal Raisin Cookies': 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600',
  'Nutella Stuffed Cookies': 'https://images.unsplash.com/photo-1558961309-dbdf000302c6?auto=format&fit=crop&q=80&w=600',

  // Sandwiches
  'Veg Grilled Cheese Sandwich': 'https://images.unsplash.com/photo-1521302200748-a286975f7f8f?auto=format&fit=crop&q=80&w=600',
  'Paneer Tikka Sandwich (Indian)': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=600',
  'Bombay Masala Sandwich (Indian)': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=600',
  'Chicken Peri Peri Sandwich': 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?auto=format&fit=crop&q=80&w=600',
  'Korean Kimchi Chicken Sandwich (Korean)': 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&q=80&w=600',
  'Mexican Bean Salsa Sandwich (Mexican)': 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&q=80&w=600',
  'Italian Pesto Mozzarella Sandwich (Italian)': 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&q=80&w=600',
  'Japanese Katsu Sandwich (Japanese)': 'https://images.unsplash.com/photo-1626201026522-a7d0e9112fa5?auto=format&fit=crop&q=80&w=600',

  // Fries
  'Classic Salted Fries': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600',
  'Peri Peri Fries': 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=600',
  'Loaded Cheese Fries': 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&q=80&w=600',
  'Mexican Salsa Fries (Mexican)': 'https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?auto=format&fit=crop&q=80&w=600',
  'Korean Spicy Fries (Korean)': 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=600',
  'Truffle Parmesan Fries (French Inspired)': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600',
  'Schezwan Fries (Chinese)': 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=600',

  // Pasta
  'Alfredo White Sauce Pasta (Italian)': 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=600',
  'Arrabbiata Red Sauce Pasta (Italian)': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600',
  'Pink Sauce Pasta': 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=600',
  'Pesto Basil Pasta (Italian)': 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&q=80&w=600',
  'Mac & Cheese Pasta': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=600',
  'Spicy Korean Gochujang Pasta (Korean Fusion)': 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=600',
  'Cheesy Baked Pasta': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=600',

  // Pizza
  'Margherita Pizza (Italian)': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
  'Farmhouse Veg Pizza': 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80&w=600',
  'Paneer Tikka Pizza (Indian Fusion)': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600',
  'Mexican Fiesta Pizza (Mexican)': 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=600',
  'Korean BBQ Chicken Pizza (Korean Fusion)': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
  'Pepperoni Pizza': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=600',
  'Four Cheese Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
  'Spicy Schezwan Pizza (Chinese Fusion)': 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80&w=600',

  // Burgers
  'Classic Veg Burger': 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=600',
  'Crispy Chicken Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
  'Paneer Maharaja Burger (Indian)': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
  'Korean Spicy Chicken Burger (Korean)': 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&q=80&w=600',
  'Mexican Jalapeño Burger (Mexican)': 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=600',
  'Double Cheese Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
  'BBQ Smoky Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
  'Mushroom Melt Burger': 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=600',

  // Noodles
  'Veg Hakka Noodles (Chinese)': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600',
  'Chicken Schezwan Noodles (Chinese)': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600',
  'Korean Ramen Bowl (Korean)': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=600',
  'Garlic Butter Udon (Japanese)': 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&q=80&w=600',
  'Teriyaki Stir Fry Noodles (Japanese)': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600',
  'Spicy Kimchi Noodles (Korean)': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=600',
  'Chili Garlic Noodles (Chinese)': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600',

  // Quick Bites
  'Cheesy Nachos (Mexican)': 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=600',
  'Chicken Popcorn': 'https://images.unsplash.com/photo-1562967914-608b82629710?auto=format&fit=crop&q=80&w=600',
  'Veg Spring Rolls (Chinese)': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
  'Korean Corn Cheese Cups (Korean)': 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=600',
  'Japanese Takoyaki Bites (Japanese Inspired)': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
  'Paneer Tikka Skewers (Indian)': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=600',
  'Loaded Bruschetta (Italian)': 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&q=80&w=600',
  'Momos with Schezwan Dip (Chinese Fusion)': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=600',

  // Coffee
  'Espresso': 'https://images.unsplash.com/photo-1510972527409-cef7e2b067f3?auto=format&fit=crop&q=80&w=600',
  'Americano': 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&q=80&w=600',
  'Cappuccino': 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=600',
  'Latte': 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600',
  'Mocha': 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&q=80&w=600',
  'Caramel Macchiato': 'https://images.unsplash.com/photo-1595434061149-868752a2130e?auto=format&fit=crop&q=80&w=600',
  'Hazelnut Cold Coffee': 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=600',
  'Vanilla Iced Latte': 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&q=80&w=600',
  'Korean Dalgona Coffee (Korean)': 'https://images.unsplash.com/photo-1594911774802-8822a707caff?auto=format&fit=crop&q=80&w=600',
  'Affogato (Italian)': 'https://images.unsplash.com/photo-1594911774802-8822a707caff?auto=format&fit=crop&q=80&w=600',

  // Tea
  'Masala Chai (Indian)': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600',
  'Elaichi Tea (Indian)': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600',
  'English Breakfast Tea': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600',
  'Green Tea': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600',
  'Matcha Latte (Japanese)': 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600',
  'Lemon Honey Tea': 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=600',
  'Kashmiri Kahwa (Indian)': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600',
  'Thai Iced Tea': 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&q=80&w=600',

  // Cold Beverages
  'Oreo Milkshake': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600',
  'Belgian Chocolate Shake': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600',
  'Strawberry Cheesecake Shake': 'https://images.unsplash.com/photo-1461023717537-b15f37d47b3c?auto=format&fit=crop&q=80&w=600',
  'Mango Smoothie': 'https://images.unsplash.com/photo-1553530979-7ee52a2670c4?auto=format&fit=crop&q=80&w=600',
  'Virgin Mojito': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
  'Blue Lagoon Cooler': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
  'Peach Iced Tea': 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=600',
  'Watermelon Mint Cooler': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
  'Korean Strawberry Milk (Korean)': 'https://images.unsplash.com/photo-1553530979-7ee52a2670c4?auto=format&fit=crop&q=80&w=600',
  'Japanese Yuzu Soda (Japanese)': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',

  // Desserts
  'Chocolate Brownie with Ice Cream': 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&q=80&w=600',
  'Belgian Waffle Sundae': 'https://images.unsplash.com/photo-1562376502-6f769499c886?auto=format&fit=crop&q=80&w=600',
  'Tiramisu Cup (Italian)': 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=600',
  'Gulab Jamun Cheesecake (Indian Fusion)': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600',
  'Macarons (French)': 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=600',
  'Mochi Ice Cream (Japanese)': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=600',
  'Korean Bingsu (Korean)': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=600',
  'Churros with Chocolate Dip (Mexican)': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600',
  'Crème Brûlée (French)': 'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&q=80&w=600',
  'Honey Toast Delight (Japanese Inspired)': 'https://images.unsplash.com/photo-1508737804141-4c3b688e25be?auto=format&fit=crop&q=80&w=600'
};

const seedDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cafe-barista';
    await mongoose.connect(connUri);
    console.log('Seed: Connected to Database');

    // Clean existing records
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log('Seed: Cleared old users, products, and orders');

    // Insert users
    const createdUsers = await User.create(users);
    console.log(`Seed: Created ${createdUsers.length} users`);

    // Insert products with mapped images
    const productsWithImages = products.map(p => {
      if (imageMapping[p.name]) {
        p.image = imageMapping[p.name];
      }
      return p;
    });

    const createdProducts = await Product.create(productsWithImages);
    console.log(`Seed: Created ${createdProducts.length} products`);

    console.log('Seed: Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seed Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
