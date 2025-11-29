import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";

/**
 * Searchable Niche Input Component
 *
 * Provides a searchable input with suggestions for niche selection.
 * Shows suggestions as user types (e.g., typing 'ski' shows 'skincare').
 */
function SearchableNicheInput({
  selectedNiches = [],
  onNichesChange,
  placeholder = "Type to search niches",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredNiches, setFilteredNiches] = useState([]);
  const inputRef = useRef(null);

  // Available niche options with search keywords
  const nicheOptions = [
    // Beauty
    { value: "Beauty", keywords: ["beauty", "makeup", "cosmetics"] },
    { value: "Makeup", keywords: ["makeup", "cosmetics", "beauty", "makeup artistry"] },
    { value: "Skincare", keywords: ["skincare", "skin", "beauty", "face", "care", "dermatology"] },
    { value: "Haircare", keywords: ["haircare", "hair", "beauty", "hair care"] },
    { value: "Fragrance", keywords: ["fragrance", "perfume", "cologne", "scent"] },
    {
      value: "Professional esthetics",
      keywords: ["professional", "esthetics", "aesthetics", "beauty professional"],
    },
    { value: "Dermatology content", keywords: ["dermatology", "skin", "medical", "dermatologist"] },
    { value: "Beauty tutorials", keywords: ["beauty", "tutorials", "makeup", "how to"] },
    { value: "Makeup artistry", keywords: ["makeup", "artistry", "professional", "makeup artist"] },
    { value: "Cosmetic procedures", keywords: ["cosmetic", "procedures", "beauty", "medical"] },
    { value: "Nails", keywords: ["nails", "nail art", "manicure", "pedicure"] },
    { value: "Luxury beauty", keywords: ["luxury", "beauty", "high end", "premium"] },
    { value: "Drugstore beauty", keywords: ["drugstore", "beauty", "affordable", "budget"] },
    { value: "Clean beauty", keywords: ["clean", "beauty", "natural", "organic"] },
    { value: "Anti aging", keywords: ["anti aging", "anti-aging", "aging", "skincare"] },
    { value: "Beauty reviews", keywords: ["beauty", "reviews", "product", "review"] },
    { value: "Beauty hacks", keywords: ["beauty", "hacks", "tips", "tricks"] },

    // Fashion
    { value: "Fashion", keywords: ["fashion", "style", "clothing"] },
    { value: "Womens fashion", keywords: ["womens", "women", "fashion", "female"] },
    { value: "Mens fashion", keywords: ["mens", "men", "fashion", "male"] },
    { value: "Streetwear", keywords: ["streetwear", "street", "urban", "fashion"] },
    { value: "Luxury fashion", keywords: ["luxury", "fashion", "high end", "designer"] },
    { value: "Modest fashion", keywords: ["modest", "fashion", "conservative", "covered"] },
    { value: "Plus size fashion", keywords: ["plus size", "plus", "fashion", "curvy"] },
    { value: "Petite fashion", keywords: ["petite", "fashion", "small", "short"] },
    { value: "Thrifting", keywords: ["thrifting", "thrift", "vintage", "secondhand"] },
    { value: "Capsule wardrobe", keywords: ["capsule", "wardrobe", "minimalist", "fashion"] },
    { value: "Fashion hauls", keywords: ["fashion", "hauls", "shopping", "haul"] },
    { value: "Fashion reviews", keywords: ["fashion", "reviews", "product", "review"] },
    { value: "Footwear", keywords: ["footwear", "shoes", "sneakers", "boots"] },
    { value: "Handbags", keywords: ["handbags", "bags", "purses", "accessories"] },
    { value: "Jewelry", keywords: ["jewelry", "jewellery", "accessories", "rings"] },
    { value: "Accessories", keywords: ["accessories", "fashion", "add-ons"] },
    { value: "Sustainable fashion", keywords: ["sustainable", "fashion", "eco", "ethical"] },
    {
      value: "Runway/editorial fashion",
      keywords: ["runway", "editorial", "fashion", "high fashion"],
    },

    // Lifestyle
    { value: "Lifestyle", keywords: ["lifestyle", "life", "daily"] },
    { value: "Wellness", keywords: ["wellness", "health", "wellbeing", "self care"] },
    { value: "Productivity", keywords: ["productivity", "efficient", "time management"] },
    { value: "Daily routines", keywords: ["daily", "routines", "morning", "evening"] },
    { value: "Aesthetic lifestyle", keywords: ["aesthetic", "lifestyle", "vibe", "aesthetic"] },
    { value: "Minimalism", keywords: ["minimalism", "minimal", "simple", "declutter"] },
    { value: "Home decor", keywords: ["home", "decor", "decoration", "interior"] },
    { value: "Organization", keywords: ["organization", "organize", "organizing", "tidy"] },
    { value: "Cleaning", keywords: ["cleaning", "clean", "housekeeping"] },
    { value: "Homemaking", keywords: ["homemaking", "home", "house", "domestic"] },
    { value: "Self improvement", keywords: ["self improvement", "self help", "personal growth"] },
    { value: "Motivational", keywords: ["motivational", "motivation", "inspirational"] },
    {
      value: "Personal development",
      keywords: ["personal", "development", "growth", "self improvement"],
    },
    { value: "Digital nomad", keywords: ["digital", "nomad", "remote", "travel"] },
    { value: "Student life", keywords: ["student", "college", "university", "school"] },
    { value: "Couples lifestyle", keywords: ["couples", "relationship", "dating", "partner"] },
    { value: "Family lifestyle", keywords: ["family", "lifestyle", "family life"] },
    { value: "Luxury lifestyle", keywords: ["luxury", "lifestyle", "high end", "premium"] },
    { value: "Budget lifestyle", keywords: ["budget", "lifestyle", "affordable", "frugal"] },

    // Travel
    { value: "Travel", keywords: ["travel", "trip", "vacation"] },
    { value: "Luxury travel", keywords: ["luxury", "travel", "high end", "premium"] },
    { value: "Budget travel", keywords: ["budget", "travel", "affordable", "cheap"] },
    { value: "Solo travel", keywords: ["solo", "travel", "alone", "independent"] },
    { value: "Couples travel", keywords: ["couples", "travel", "romantic", "partner"] },
    { value: "Family travel", keywords: ["family", "travel", "kids", "children"] },
    { value: "Adventure travel", keywords: ["adventure", "travel", "outdoor", "extreme"] },
    { value: "Backpacking", keywords: ["backpacking", "backpack", "budget", "travel"] },
    { value: "Road trips", keywords: ["road", "trips", "driving", "car"] },
    { value: "Van life", keywords: ["van", "life", "vanlife", "nomadic"] },
    { value: "Hotel reviews", keywords: ["hotel", "reviews", "accommodation", "stay"] },
    { value: "Airbnb stays", keywords: ["airbnb", "stays", "rental", "accommodation"] },
    { value: "Resort content", keywords: ["resort", "vacation", "all inclusive", "luxury"] },
    { value: "Local city guides", keywords: ["local", "city", "guides", "guide"] },
    { value: "Food tourism", keywords: ["food", "tourism", "culinary", "dining"] },
    { value: "Nature tourism", keywords: ["nature", "tourism", "outdoor", "wildlife"] },
    { value: "Travel hacks", keywords: ["travel", "hacks", "tips", "tricks"] },
    { value: "Airports and points travel", keywords: ["airports", "points", "travel", "miles"] },
    { value: "International travel", keywords: ["international", "travel", "abroad", "overseas"] },
    { value: "Domestic travel", keywords: ["domestic", "travel", "local", "country"] },
    { value: "Cruising", keywords: ["cruising", "cruise", "cruise ship", "ships"] },

    // Food & Drink
    { value: "Food & Drink", keywords: ["food", "drink", "cooking", "dining"] },
    { value: "Cooking", keywords: ["cooking", "recipes", "chef", "culinary"] },
    { value: "Baking", keywords: ["baking", "bake", "desserts", "pastry"] },
    { value: "Meal prep", keywords: ["meal", "prep", "preparation", "meal planning"] },
    { value: "Healthy recipes", keywords: ["healthy", "recipes", "nutrition", "diet"] },
    { value: "Comfort food", keywords: ["comfort", "food", "comfortable", "homey"] },
    { value: "Restaurant reviews", keywords: ["restaurant", "reviews", "dining", "food"] },
    { value: "Food photography", keywords: ["food", "photography", "photo", "foodie"] },
    { value: "Street food", keywords: ["street", "food", "streetfood", "vendor"] },
    { value: "Coffee content", keywords: ["coffee", "cafe", "espresso", "latte"] },
    { value: "Tea content", keywords: ["tea", "teatime", "herbal", "beverage"] },
    { value: "Juicing/smoothies", keywords: ["juicing", "smoothies", "juice", "healthy"] },
    { value: "Food challenges", keywords: ["food", "challenges", "eating", "challenge"] },
    { value: "Vegan recipes", keywords: ["vegan", "recipes", "plant based", "vegetarian"] },
    { value: "Vegetarian recipes", keywords: ["vegetarian", "recipes", "veggie", "plant based"] },
    { value: "Keto", keywords: ["keto", "ketogenic", "low carb", "diet"] },
    { value: "Gluten free", keywords: ["gluten", "free", "gf", "celiac"] },
    { value: "Mixed drinks/cocktails", keywords: ["mixed", "drinks", "cocktails", "bartending"] },
    { value: "Wine content", keywords: ["wine", "vino", "wine tasting", "sommelier"] },
    { value: "Food science", keywords: ["food", "science", "culinary", "science"] },
    { value: "Food ASMR", keywords: ["food", "asmr", "sounds", "eating sounds"] },

    // Health & Fitness
    { value: "Health & Fitness", keywords: ["health", "fitness", "exercise", "workout"] },
    { value: "Weightlifting", keywords: ["weightlifting", "weights", "lifting", "strength"] },
    { value: "Cardio", keywords: ["cardio", "cardiovascular", "running", "aerobic"] },
    { value: "Pilates", keywords: ["pilates", "exercise", "fitness", "core"] },
    { value: "Yoga", keywords: ["yoga", "yogi", "meditation", "flexibility"] },
    { value: "Running", keywords: ["running", "runner", "jogging", "marathon"] },
    { value: "CrossFit", keywords: ["crossfit", "cross fit", "fitness", "workout"] },
    { value: "Healthy habits", keywords: ["healthy", "habits", "wellness", "lifestyle"] },
    { value: "Diet and nutrition", keywords: ["diet", "nutrition", "eating", "food"] },
    { value: "Mental health", keywords: ["mental", "health", "wellness", "therapy"] },
    { value: "Sports recovery", keywords: ["sports", "recovery", "rehab", "injury"] },
    { value: "Physiotherapy", keywords: ["physiotherapy", "physical therapy", "pt", "rehab"] },
    { value: "Healthy aging", keywords: ["healthy", "aging", "age", "senior"] },
    { value: "Athlete training", keywords: ["athlete", "training", "sports", "performance"] },
    { value: "Home workouts", keywords: ["home", "workouts", "exercise", "fitness"] },
    { value: "Gym lifestyle", keywords: ["gym", "lifestyle", "fitness", "workout"] },
    { value: "Supplements", keywords: ["supplements", "supplement", "nutrition", "vitamins"] },
    { value: "Injury prevention", keywords: ["injury", "prevention", "safety", "health"] },
    { value: "Bodybuilding", keywords: ["bodybuilding", "bodybuilder", "muscle", "strength"] },
    { value: "Weight loss", keywords: ["weight", "loss", "diet", "fitness"] },
    {
      value: "Mobility/flexibility training",
      keywords: ["mobility", "flexibility", "stretching", "training"],
    },

    // Parenting & Family
    { value: "Parenting & Family", keywords: ["parenting", "family", "kids", "children"] },
    { value: "New parents", keywords: ["new", "parents", "newborn", "baby"] },
    { value: "Pregnancy", keywords: ["pregnancy", "pregnant", "expecting", "maternity"] },
    { value: "Postpartum", keywords: ["postpartum", "after birth", "new mom", "recovery"] },
    { value: "Parenting tips", keywords: ["parenting", "tips", "advice", "help"] },
    { value: "Kids activities", keywords: ["kids", "activities", "children", "play"] },
    { value: "Family vlogs", keywords: ["family", "vlogs", "vlogging", "daily"] },
    { value: "Baby products", keywords: ["baby", "products", "infant", "toddler"] },
    { value: "Teen parenting", keywords: ["teen", "parenting", "teenager", "adolescent"] },
    { value: "Homeschooling", keywords: ["homeschooling", "homeschool", "education", "learning"] },
    { value: "Child development", keywords: ["child", "development", "growth", "milestones"] },
    { value: "Mom content", keywords: ["mom", "mother", "mama", "parenting"] },
    { value: "Dad content", keywords: ["dad", "father", "daddy", "parenting"] },

    // Tech & Gadgets
    { value: "Tech & Gadgets", keywords: ["tech", "technology", "gadgets", "devices"] },
    { value: "Tech reviews", keywords: ["tech", "reviews", "technology", "products"] },
    { value: "Smartphones", keywords: ["smartphones", "phone", "mobile", "iphone"] },
    { value: "Laptops", keywords: ["laptops", "computer", "notebook", "pc"] },
    { value: "Tablets", keywords: ["tablets", "ipad", "tablet", "device"] },
    { value: "Cameras", keywords: ["cameras", "camera", "photography", "dslr"] },
    { value: "Drones", keywords: ["drones", "drone", "quadcopter", "flying"] },
    { value: "Smart home", keywords: ["smart", "home", "automation", "iot"] },
    { value: "Wearables", keywords: ["wearables", "smartwatch", "fitness tracker", "watch"] },
    { value: "Gaming hardware", keywords: ["gaming", "hardware", "pc", "console"] },
    { value: "VR/AR", keywords: ["vr", "ar", "virtual reality", "augmented reality"] },
    { value: "App reviews", keywords: ["app", "reviews", "applications", "mobile"] },
    { value: "Software tutorials", keywords: ["software", "tutorials", "how to", "guide"] },
    { value: "AI tools", keywords: ["ai", "artificial intelligence", "tools", "machine learning"] },
    { value: "Programming content", keywords: ["programming", "coding", "developer", "software"] },
    { value: "Cybersecurity", keywords: ["cybersecurity", "security", "hacking", "privacy"] },
    { value: "Tech news", keywords: ["tech", "news", "technology", "updates"] },

    // Gaming
    { value: "Gaming", keywords: ["gaming", "games", "gamer", "play"] },
    { value: "PC gaming", keywords: ["pc", "gaming", "computer", "games"] },
    { value: "Console gaming", keywords: ["console", "gaming", "xbox", "playstation"] },
    { value: "Mobile gaming", keywords: ["mobile", "gaming", "phone", "games"] },
    { value: "Roblox", keywords: ["roblox", "game", "kids", "online"] },
    { value: "Minecraft", keywords: ["minecraft", "game", "building", "creative"] },
    { value: "Fortnite", keywords: ["fortnite", "game", "battle royale", "epic"] },
    { value: "RPG/MMO", keywords: ["rpg", "mmo", "role playing", "massively multiplayer"] },
    { value: "FPS competitive", keywords: ["fps", "competitive", "shooter", "first person"] },
    { value: "Strategy games", keywords: ["strategy", "games", "tactical", "planning"] },
    { value: "Game walkthroughs", keywords: ["game", "walkthroughs", "guide", "tutorial"] },
    { value: "Game commentary", keywords: ["game", "commentary", "reaction", "review"] },
    { value: "Game reviews", keywords: ["game", "reviews", "gaming", "review"] },
    { value: "Esports", keywords: ["esports", "competitive", "gaming", "tournament"] },
    { value: "Streaming", keywords: ["streaming", "streamer", "twitch", "live"] },
    { value: "Retro gaming", keywords: ["retro", "gaming", "vintage", "classic"] },

    // Finance & Business
    { value: "Finance & Business", keywords: ["finance", "business", "money", "investment"] },
    { value: "Personal finance", keywords: ["personal", "finance", "money", "budgeting"] },
    { value: "Investing", keywords: ["investing", "investment", "stocks", "portfolio"] },
    { value: "Crypto", keywords: ["crypto", "cryptocurrency", "bitcoin", "blockchain"] },
    { value: "Real estate", keywords: ["real", "estate", "property", "housing"] },
    { value: "Business tips", keywords: ["business", "tips", "advice", "entrepreneur"] },
    {
      value: "Entrepreneurship",
      keywords: ["entrepreneurship", "entrepreneur", "startup", "business"],
    },
    { value: "Side hustles", keywords: ["side", "hustles", "hustle", "extra income"] },
    { value: "Career and workplace", keywords: ["career", "workplace", "job", "professional"] },
    { value: "Budgeting", keywords: ["budgeting", "budget", "money", "finance"] },
    { value: "Taxes", keywords: ["taxes", "tax", "irs", "filing"] },
    { value: "Credit cards", keywords: ["credit", "cards", "credit card", "rewards"] },
    { value: "Travel hacking", keywords: ["travel", "hacking", "points", "miles"] },
    { value: "Frugality", keywords: ["frugality", "frugal", "saving", "budget"] },
    { value: "Wealth mindset", keywords: ["wealth", "mindset", "money", "success"] },
    {
      value: "Small business ownership",
      keywords: ["small", "business", "ownership", "entrepreneur"],
    },
    { value: "Ecom", keywords: ["ecom", "ecommerce", "online", "business"] },
    { value: "SaaS building", keywords: ["saas", "software", "building", "startup"] },
    { value: "Freelancing", keywords: ["freelancing", "freelance", "freelancer", "gig"] },
    { value: "Stocks", keywords: ["stocks", "stock market", "trading", "investing"] },
    { value: "Financial literacy", keywords: ["financial", "literacy", "education", "money"] },

    // Arts & Entertainment
    { value: "Arts & Entertainment", keywords: ["arts", "entertainment", "creative", "art"] },
    { value: "Music", keywords: ["music", "musician", "song", "artist"] },
    { value: "Singing", keywords: ["singing", "singer", "vocal", "voice"] },
    { value: "Dance", keywords: ["dance", "dancing", "dancer", "choreography"] },
    { value: "Acting", keywords: ["acting", "actor", "theater", "drama"] },
    { value: "Comedy", keywords: ["comedy", "comedian", "funny", "humor"] },
    { value: "Photography", keywords: ["photography", "photo", "camera", "photographer"] },
    { value: "Art tutorials", keywords: ["art", "tutorials", "drawing", "painting"] },
    { value: "Graphic design", keywords: ["graphic", "design", "designer", "digital"] },
    { value: "Drawing", keywords: ["drawing", "sketch", "illustration", "art"] },
    { value: "Painting", keywords: ["painting", "paint", "canvas", "art"] },
    { value: "Crafts", keywords: ["crafts", "crafting", "diy", "handmade"] },
    { value: "Theater", keywords: ["theater", "theatre", "stage", "drama"] },
    { value: "Film analysis", keywords: ["film", "analysis", "movies", "cinema"] },
    { value: "Book content", keywords: ["book", "books", "reading", "literature"] },
    { value: "Poetry", keywords: ["poetry", "poem", "poet", "writing"] },
    { value: "Cultural commentary", keywords: ["cultural", "commentary", "culture", "society"] },
    { value: "Animation", keywords: ["animation", "animated", "cartoon", "3d"] },
    { value: "Cosplay", keywords: ["cosplay", "costume", "convention", "character"] },

    // Education & Learning
    { value: "Education & Learning", keywords: ["education", "learning", "school", "student"] },
    { value: "Language learning", keywords: ["language", "learning", "languages", "study"] },
    { value: "Study tips", keywords: ["study", "tips", "studying", "academic"] },
    { value: "Science education", keywords: ["science", "education", "stem", "learning"] },
    { value: "Math tutorials", keywords: ["math", "tutorials", "mathematics", "learning"] },
    { value: "History content", keywords: ["history", "historical", "past", "education"] },
    { value: "Geography", keywords: ["geography", "geographic", "world", "maps"] },
    { value: "College advice", keywords: ["college", "advice", "university", "student"] },
    { value: "Academic productivity", keywords: ["academic", "productivity", "study", "learning"] },
    { value: "Exam prep", keywords: ["exam", "prep", "preparation", "test"] },
    { value: "Career education", keywords: ["career", "education", "professional", "job"] },
    { value: "STEM content", keywords: ["stem", "science", "technology", "engineering"] },
    { value: "Explainers", keywords: ["explainers", "explaining", "tutorial", "guide"] },
    { value: "Documentaries", keywords: ["documentaries", "documentary", "film", "educational"] },

    // Home & DIY
    { value: "Home & DIY", keywords: ["home", "diy", "do it yourself", "house"] },
    { value: "Home improvement", keywords: ["home", "improvement", "renovation", "remodel"] },
    { value: "Renovation content", keywords: ["renovation", "renovate", "remodel", "home"] },
    { value: "DIY hacks", keywords: ["diy", "hacks", "tips", "tricks"] },
    { value: "Interior design", keywords: ["interior", "design", "decor", "home"] },
    { value: "Gardening", keywords: ["gardening", "garden", "plants", "outdoor"] },
    { value: "Landscaping", keywords: ["landscaping", "landscape", "yard", "outdoor"] },
    { value: "Home organization", keywords: ["home", "organization", "organize", "tidy"] },
    { value: "Home cleaning", keywords: ["home", "cleaning", "clean", "housekeeping"] },
    { value: "Furniture flipping", keywords: ["furniture", "flipping", "refinish", "restore"] },
    { value: "Crafting", keywords: ["crafting", "crafts", "handmade", "diy"] },
    { value: "Real estate staging", keywords: ["real", "estate", "staging", "home"] },
    { value: "Smart home projects", keywords: ["smart", "home", "projects", "automation"] },

    // Pets & Animals
    { value: "Pets & Animals", keywords: ["pets", "animals", "pet", "animal"] },
    { value: "Dogs", keywords: ["dogs", "dog", "puppy", "canine"] },
    { value: "Cats", keywords: ["cats", "cat", "kitten", "feline"] },
    { value: "Reptiles", keywords: ["reptiles", "reptile", "snake", "lizard"] },
    { value: "Exotic pets", keywords: ["exotic", "pets", "unusual", "rare"] },
    { value: "Pet care", keywords: ["pet", "care", "pets", "animal care"] },
    { value: "Animal training", keywords: ["animal", "training", "train", "pets"] },
    { value: "Pet grooming", keywords: ["pet", "grooming", "groom", "pets"] },
    { value: "Veterinary advice", keywords: ["veterinary", "advice", "vet", "animal health"] },
    { value: "Horse content", keywords: ["horse", "horses", "equestrian", "riding"] },
    { value: "Pet rescue", keywords: ["pet", "rescue", "adoption", "animals"] },
    { value: "Animal lifestyle", keywords: ["animal", "lifestyle", "pets", "animals"] },

    // Automotive
    { value: "Automotive", keywords: ["automotive", "car", "vehicle", "auto"] },
    { value: "Cars", keywords: ["cars", "car", "vehicle", "automotive"] },
    { value: "Car reviews", keywords: ["car", "reviews", "automotive", "vehicle"] },
    { value: "Car mods", keywords: ["car", "mods", "modifications", "custom"] },
    { value: "Car detailing", keywords: ["car", "detailing", "detail", "clean"] },
    { value: "Electric vehicles", keywords: ["electric", "vehicles", "ev", "tesla"] },
    { value: "Motorsports", keywords: ["motorsports", "racing", "race", "sports"] },
    { value: "Car maintenance", keywords: ["car", "maintenance", "repair", "automotive"] },
    { value: "Road trips", keywords: ["road", "trips", "travel", "driving"] },
    { value: "Motorcycles", keywords: ["motorcycles", "motorcycle", "bike", "riding"] },
    { value: "Off roading", keywords: ["off", "roading", "offroad", "4x4"] },

    // Sports
    { value: "Sports", keywords: ["sports", "athlete", "athletic", "sport"] },
    { value: "Soccer", keywords: ["soccer", "football", "futbol", "sport"] },
    { value: "Basketball", keywords: ["basketball", "basketball", "nba", "sport"] },
    { value: "Football", keywords: ["football", "nfl", "american football", "sport"] },
    { value: "Baseball", keywords: ["baseball", "mlb", "sport", "bat"] },
    { value: "Tennis", keywords: ["tennis", "sport", "racket", "court"] },
    { value: "Golf", keywords: ["golf", "golfing", "sport", "course"] },
    { value: "Swimming", keywords: ["swimming", "swim", "sport", "pool"] },
    { value: "Martial arts", keywords: ["martial", "arts", "karate", "fighting"] },
    { value: "Boxing", keywords: ["boxing", "boxer", "fight", "sport"] },
    { value: "F1 racing", keywords: ["f1", "racing", "formula", "race"] },
    { value: "Cycling", keywords: ["cycling", "bike", "bicycle", "sport"] },
    { value: "Climbing", keywords: ["climbing", "climb", "rock", "outdoor"] },
    { value: "Skiing", keywords: ["skiing", "ski", "snow", "winter"] },
    { value: "Snowboarding", keywords: ["snowboarding", "snowboard", "snow", "winter"] },
    { value: "Surfing", keywords: ["surfing", "surf", "ocean", "water"] },

    // Events & Experiences
    { value: "Events & Experiences", keywords: ["events", "experiences", "event", "experience"] },
    { value: "Weddings", keywords: ["weddings", "wedding", "bride", "groom"] },
    { value: "Festivals", keywords: ["festivals", "festival", "music", "event"] },
    { value: "Concerts", keywords: ["concerts", "concert", "music", "live"] },
    { value: "Parties", keywords: ["parties", "party", "celebration", "event"] },
    { value: "Exhibitions", keywords: ["exhibitions", "exhibition", "art", "show"] },
    { value: "Conventions", keywords: ["conventions", "convention", "expo", "event"] },
    { value: "Theme parks", keywords: ["theme", "parks", "amusement", "park"] },
    { value: "Travel itineraries", keywords: ["travel", "itineraries", "itinerary", "plan"] },

    // Social Causes
    { value: "Social Causes", keywords: ["social", "causes", "activism", "cause"] },
    { value: "Sustainability", keywords: ["sustainability", "sustainable", "eco", "green"] },
    {
      value: "Climate activism",
      keywords: ["climate", "activism", "environment", "climate change"],
    },
    { value: "Body positivity", keywords: ["body", "positivity", "body positive", "self love"] },
    { value: "Inclusivity", keywords: ["inclusivity", "inclusive", "diversity", "inclusion"] },
    { value: "Mental health awareness", keywords: ["mental", "health", "awareness", "wellness"] },
    { value: "Animal rights", keywords: ["animal", "rights", "animals", "welfare"] },
    { value: "Nonprofit content", keywords: ["nonprofit", "charity", "non profit", "cause"] },
    {
      value: "LGBTQ content (non identity defining)",
      keywords: ["lgbtq", "lgbt", "pride", "community"],
    },
    {
      value: "Ethical consumerism",
      keywords: ["ethical", "consumerism", "ethical shopping", "sustainable"],
    },

    // Professional & Skills
    { value: "Professional & Skills", keywords: ["professional", "skills", "career", "work"] },
    { value: "Marketing", keywords: ["marketing", "advertising", "promotion", "business"] },
    { value: "Sales", keywords: ["sales", "selling", "business", "revenue"] },
    { value: "Leadership", keywords: ["leadership", "leader", "management", "business"] },
    { value: "Project management", keywords: ["project", "management", "pm", "planning"] },
    { value: "Coding", keywords: ["coding", "programming", "developer", "code"] },
    { value: "Law (general info)", keywords: ["law", "legal", "attorney", "lawyer"] },
    { value: "Medical content (general)", keywords: ["medical", "health", "doctor", "healthcare"] },
    { value: "HR/career", keywords: ["hr", "human resources", "career", "recruitment"] },
    { value: "Real estate", keywords: ["real", "estate", "property", "housing"] },
    { value: "Product design", keywords: ["product", "design", "designer", "ux"] },
    { value: "Business systems", keywords: ["business", "systems", "process", "operations"] },
    { value: "Productivity tools", keywords: ["productivity", "tools", "efficiency", "software"] },

    // Creator Economy / Meta Content
    {
      value: "Creator Economy / Meta Content",
      keywords: ["creator", "economy", "meta", "content"],
    },
    { value: "Behind the scenes creator life", keywords: ["behind", "scenes", "creator", "life"] },
    { value: "Editing tutorials", keywords: ["editing", "tutorials", "video", "post production"] },
    { value: "Filming tutorials", keywords: ["filming", "tutorials", "video", "production"] },
    { value: "Social media tips", keywords: ["social", "media", "tips", "strategy"] },
    {
      value: "Algorithm insights",
      keywords: ["algorithm", "insights", "social media", "platform"],
    },
    { value: "UGC creation", keywords: ["ugc", "creation", "user generated", "content"] },
    { value: "Brand deal advice", keywords: ["brand", "deal", "advice", "collaboration"] },
    { value: "Influencer growth", keywords: ["influencer", "growth", "follower", "audience"] },
    { value: "SaaS building as a creator", keywords: ["saas", "building", "creator", "software"] },

    // Micro Tags
    { value: "Irish boyfriend", keywords: ["irish", "boyfriend", "relationship", "culture"] },
    { value: "American expat", keywords: ["american", "expat", "expatriate", "living abroad"] },
    { value: "Couples comedy", keywords: ["couples", "comedy", "funny", "relationship"] },
    { value: "Hotel reviews Asia", keywords: ["hotel", "reviews", "asia", "accommodation"] },
    { value: "Luxury resort Bali", keywords: ["luxury", "resort", "bali", "vacation"] },
    {
      value: "Irish vs American culture",
      keywords: ["irish", "american", "culture", "comparison"],
    },
    { value: "Skincare for dry skin", keywords: ["skincare", "dry", "skin", "beauty"] },
    {
      value: "Professional grade skincare use",
      keywords: ["professional", "grade", "skincare", "beauty"],
    },
  ];

  // Filter niches based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredNiches([]);
      return;
    }

    const filtered = nicheOptions.filter((option) => {
      // Check if already selected
      if (selectedNiches.includes(option.value)) {
        return false;
      }

      // Check if search term matches value or keywords
      const searchLower = searchTerm.toLowerCase();
      const valueMatch = option.value.toLowerCase().includes(searchLower);
      const keywordMatch = option.keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchLower)
      );

      return valueMatch || keywordMatch;
    });

    setFilteredNiches(filtered);
  }, [searchTerm, selectedNiches]);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.trim() !== "");
  };

  // Handle niche selection
  const handleNicheSelect = (niche) => {
    const newNiches = [...selectedNiches, niche];
    onNichesChange(newNiches);
    setSearchTerm("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (searchTerm.trim() !== "") {
      setShowSuggestions(true);
    }
  };

  // Handle input blur (with delay to allow clicking suggestions)
  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 300);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && filteredNiches.length > 0) {
      e.preventDefault();
      handleNicheSelect(filteredNiches[0].value);
    }
  };

  return (
    <div className="space-y-2">
      {/* Search Input */}
      <div className="relative">
        <CustomInput
          label="Select Niche(s) *"
          customRef={inputRef}
          name="nicheSearch"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          startIcon={<Search className="w-4 h-4 text-gray-400" />}
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredNiches.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredNiches.map((niche) => (
              <button
                key={niche.value}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNicheSelect(niche.value);
                }}
                className="w-full text-left text-xs px-4 py-2 text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                {niche.value}
              </button>
            ))}
          </div>
        )}

        {/* No suggestions message */}
        {showSuggestions && filteredNiches.length === 0 && searchTerm.trim() !== "" && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            <p className="text-sm text-gray-500 text-center">No niches found for "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchableNicheInput;
