import { useEffect, useMemo, useRef, useState } from "react";

const kw = (value, extra = []) => {
  const base = value
    .toLowerCase()
    .replace(/[&,/]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  return [...new Set([...base, ...extra.map((e) => e.toLowerCase())])];
};

export default function useSearchableNicheInput({
  selectedNiches = [],
  onNichesChange,
  placeholder = "Type to search niches",
  handleNicheRemove,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredNiches, setFilteredNiches] = useState([]);
  const inputRef = useRef(null);

  const nicheOptions = useMemo(() => {
    const rows = [
      ["Beauty", ["beauty", "makeup", "cosmetics"]],
      ["Makeup", ["makeup", "cosmetics", "beauty", "makeup artistry"]],
      ["Skincare", ["skincare", "skin", "face", "care", "dermatology"]],
      ["Haircare", ["haircare", "hair", "hair care"]],
      ["Fragrance", ["fragrance", "perfume", "cologne", "scent"]],
      ["Professional esthetics", ["professional", "esthetics", "aesthetics", "beauty professional"]],
      ["Dermatology content", ["dermatology", "skin", "medical", "dermatologist"]],
      ["Beauty tutorials", ["beauty", "tutorials", "how to"]],
      ["Makeup artistry", ["makeup", "artistry", "makeup artist"]],
      ["Cosmetic procedures", ["cosmetic", "procedures", "medical"]],
      ["Nails", ["nails", "nail art", "manicure", "pedicure"]],
      ["Luxury beauty", ["luxury", "beauty", "high end", "premium"]],
      ["Drugstore beauty", ["drugstore", "beauty", "affordable", "budget"]],
      ["Clean beauty", ["clean", "beauty", "natural", "organic"]],
      ["Anti aging", ["anti aging", "anti-aging", "aging", "skincare"]],
      ["Beauty reviews", ["beauty", "reviews", "product"]],
      ["Beauty hacks", ["beauty", "hacks", "tips", "tricks"]],
      ["Fashion", ["fashion", "style", "clothing", "apparel"]],

      ["Womens fashion", ["women", "womens", "fashion", "style", "clothing"]],
      ["Mens fashion", ["men", "mens", "fashion", "style"]],
      ["Streetwear", ["streetwear", "street", "urban", "sneakers"]],
      ["Luxury fashion", ["luxury", "fashion", "designer", "high end"]],
      ["Modest fashion", ["modest", "fashion", "hijab", "coverage"]],
      ["Plus size fashion", ["plus size", "fashion", "curve", "inclusive"]],
      ["Petite fashion", ["petite", "fashion", "small", "size"]],
      ["Thrifting", ["thrifting", "thrift", "vintage", "secondhand"]],
      ["Capsule wardrobe", ["capsule", "wardrobe", "minimal", "closet"]],
      ["Fashion hauls", ["fashion", "hauls", "shopping", "unboxing"]],
      ["Fashion reviews", ["fashion", "reviews", "clothing"]],
      ["Footwear", ["footwear", "shoes", "sneakers", "boots"]],
      ["Handbags", ["handbags", "bags", "purses", "luxury bags"]],
      ["Jewelry", ["jewelry", "jewellery", "accessories", "rings"]],
      ["Accessories", ["accessories", "belts", "hats", "scarves"]],
      ["Sustainable fashion", ["sustainable", "fashion", "eco", "ethical"]],
      ["Runway/editorial fashion", ["runway", "editorial", "fashion", "model"]],
      ["Lifestyle", ["lifestyle", "living", "life", "day in the life"]],

      ["Wellness", ["wellness", "health", "self care", "mindfulness"]],
      ["Productivity", ["productivity", "habits", "focus", "work"]],
      ["Daily routines", ["daily", "routines", "morning", "evening"]],
      ["Aesthetic lifestyle", ["aesthetic", "lifestyle", "vibe", "content"]],
      ["Minimalism", ["minimalism", "minimal", "simple", "declutter"]],
      ["Home decor", ["home", "decor", "interior", "decoration"]],
      ["Organization", ["organization", "organizing", "tidy", "storage"]],
      ["Cleaning", ["cleaning", "clean", "household", "chores"]],
      ["Homemaking", ["homemaking", "home", "domestic", "household"]],
      ["Self improvement", ["self improvement", "growth", "better"]],
      ["Motivational", ["motivational", "motivation", "inspire"]],
      ["Personal development", ["personal development", "growth", "skills"]],
      ["Digital nomad", ["digital nomad", "remote", "travel work"]],
      ["Student life", ["student", "college", "university", "study"]],
      ["Couples lifestyle", ["couples", "relationship", "lifestyle"]],
      ["Family lifestyle", ["family", "lifestyle", "home life"]],
      ["Luxury lifestyle", ["luxury", "lifestyle", "premium", "rich"]],
      ["Budget lifestyle", ["budget", "lifestyle", "frugal", "affordable"]],
      ["Travel", ["travel", "trip", "vacation", "journey", "tourist"]],

      ["Luxury travel", ["luxury", "travel", "five star", "premium"]],
      ["Budget travel", ["budget", "travel", "cheap", "backpacker"]],
      ["Solo travel", ["solo", "travel", "alone", "independent"]],
      ["Couples travel", ["couples", "travel", "romantic", "honeymoon"]],
      ["Family travel", ["family", "travel", "kids", "vacation"]],
      ["Adventure travel", ["adventure", "travel", "outdoor", "explore"]],
      ["Backpacking", ["backpacking", "backpack", "hostel", "budget"]],
      ["Road trips", ["road trip", "driving", "car", "highway"]],
      ["Van life", ["van life", "camper", "rv", "nomad"]],
      ["Hotel reviews", ["hotel", "reviews", "stay", "accommodation"]],
      ["Airbnb stays", ["airbnb", "rental", "stay", "short term"]],
      ["Resort content", ["resort", "vacation", "beach", "pool"]],
      ["Local city guides", ["city", "guides", "local", "tourism"]],
      ["Food tourism", ["food", "tourism", "culinary", "eat"]],
      ["Nature tourism", ["nature", "tourism", "outdoor", "parks"]],
      ["Travel hacks", ["travel", "hacks", "tips", "flying"]],
      ["Airports and points travel", ["airports", "points", "miles", "loyalty"]],
      ["International travel", ["international", "travel", "abroad", "passport"]],
      ["Domestic travel", ["domestic", "travel", "local", "country"]],
      ["Cruising", ["cruising", "cruise", "ship", "ocean"]],
      ["Food & Drink", ["food", "drink", "eating", "beverage", "culinary", "dining"]],

      ["Cooking", ["cooking", "recipes", "kitchen", "chef"]],
      ["Baking", ["baking", "baker", "cakes", "pastry"]],
      ["Meal prep", ["meal prep", "prep", "weekly", "containers"]],
      ["Healthy recipes", ["healthy", "recipes", "nutrition", "clean eating"]],
      ["Comfort food", ["comfort food", "homemade", "cozy"]],
      ["Restaurant reviews", ["restaurant", "reviews", "dining", "food critic"]],
      ["Food photography", ["food", "photography", "styling", "aesthetic"]],
      ["Street food", ["street food", "vendor", "local food"]],
      ["Coffee content", ["coffee", "espresso", "cafe", "barista"]],
      ["Tea content", ["tea", "matcha", "brew"]],
      ["Juicing/smoothies", ["juicing", "smoothies", "juice", "blender"]],
      ["Food challenges", ["food", "challenges", "eating", "mukbang"]],
      ["Vegan recipes", ["vegan", "plant based", "recipes"]],
      ["Vegetarian recipes", ["vegetarian", "veggie", "recipes"]],
      ["Keto", ["keto", "ketogenic", "low carb", "diet"]],
      ["Gluten free", ["gluten free", "celiac", "gf"]],
      ["Mixed drinks/cocktails", ["cocktails", "drinks", "bartending", "mixology"]],
      ["Wine content", ["wine", "sommelier", "tasting", "vino"]],
      ["Food science", ["food science", "chemistry", "how food works"]],
      ["Food ASMR", ["food asmr", "asmr", "eating sounds"]],

      ["Weightlifting", ["weightlifting", "lifting", "gym", "strength"]],
      ["Cardio", ["cardio", "heart", "endurance", "running machine"]],
      ["Pilates", ["pilates", "core", "reformer"]],
      ["Yoga", ["yoga", "stretch", "mindfulness", "asana"]],
      ["Running", ["running", "runner", "marathon", "jog"]],
      ["CrossFit", ["crossfit", "wod", "functional"]],
      ["Healthy habits", ["healthy", "habits", "routine", "wellness"]],
      ["Diet and nutrition", ["diet", "nutrition", "macros", "eating"]],
      ["Mental health", ["mental health", "therapy", "anxiety", "mind"]],
      ["Sports recovery", ["recovery", "rest", "athlete", "massage"]],
      ["Physiotherapy", ["physiotherapy", "pt", "injury", "rehab"]],
      ["Healthy aging", ["aging", "senior", "longevity"]],
      ["Athlete training", ["athlete", "training", "sport", "performance"]],
      ["Home workouts", ["home", "workouts", "no equipment", "living room"]],
      ["Gym lifestyle", ["gym", "fitness", "workout", "lifting"]],
      ["Supplements", ["supplements", "protein", "vitamins", "stack"]],
      ["Injury prevention", ["injury", "prevention", "mobility", "warm up"]],
      ["Bodybuilding", ["bodybuilding", "muscle", "bulk", "physique"]],
      ["Weight loss", ["weight loss", "fat loss", "cutting", "diet"]],
      ["Mobility/flexibility training", ["mobility", "flexibility", "stretching", "range"]],
      ["Parenting & Family", ["parenting", "family", "kids", "children", "parents"]],

      ["New parents", ["new parents", "baby", "newborn"]],
      ["Pregnancy", ["pregnancy", "pregnant", "maternity", "expecting"]],
      ["Postpartum", ["postpartum", "after birth", "recovery"]],
      ["Parenting tips", ["parenting", "tips", "kids", "advice"]],
      ["Kids activities", ["kids", "activities", "play", "children"]],
      ["Family vlogs", ["family", "vlogs", "daily", "kids"]],
      ["Baby products", ["baby", "products", "gear", "reviews"]],
      ["Teen parenting", ["teen", "parenting", "adolescent"]],
      ["Homeschooling", ["homeschooling", "education", "home school"]],
      ["Child development", ["child", "development", "milestones", "early"]],
      ["Mom content", ["mom", "mother", "mommy", "parent"]],
      ["Dad content", ["dad", "father", "parenting", "daddy"]],

      ["Tech reviews", ["tech", "reviews", "gadgets", "unboxing"]],
      ["Smartphones", ["smartphones", "phone", "iphone", "android"]],
      ["Laptops", ["laptops", "notebook", "macbook", "pc"]],
      ["Tablets", ["tablets", "ipad", "surface"]],
      ["Cameras", ["cameras", "photography gear", "dslr", "mirrorless"]],
      ["Drones", ["drones", "fpv", "aerial"]],
      ["Smart home", ["smart home", "alexa", "automation", "iot"]],
      ["Wearables", ["wearables", "watch", "fitness tracker", "smartwatch"]],
      ["Gaming hardware", ["gaming", "hardware", "gpu", "keyboard"]],
      ["VR/AR", ["vr", "ar", "virtual reality", "headset"]],
      ["App reviews", ["app", "reviews", "mobile", "software"]],
      ["Software tutorials", ["software", "tutorials", "how to", "apps"]],
      ["AI tools", ["ai", "tools", "chatgpt", "machine learning"]],
      ["Programming content", ["programming", "coding", "developer", "code"]],
      ["Cybersecurity", ["cybersecurity", "security", "hacking", "privacy"]],
      ["Tech news", ["tech news", "industry", "startups"]],
      ["Gaming", ["gaming", "games", "gamer", "video games", "esports"]],

      ["PC gaming", ["pc gaming", "steam", "computer games"]],
      ["Console gaming", ["console", "playstation", "xbox", "nintendo"]],
      ["Mobile gaming", ["mobile gaming", "ios", "android games"]],
      ["Roblox", ["roblox", "roblox creator"]],
      ["Minecraft", ["minecraft", "blocks", "survival"]],
      ["Fortnite", ["fortnite", "battle royale", "epic"]],
      ["RPG/MMO", ["rpg", "mmo", "mmorpg", "role playing"]],
      ["FPS competitive", ["fps", "shooter", "valorant", "cs"]],
      ["Strategy games", ["strategy", "rts", "turn based"]],
      ["Game walkthroughs", ["walkthrough", "guide", "playthrough"]],
      ["Game commentary", ["commentary", "gaming", "reaction"]],
      ["Game reviews", ["game reviews", "rating", "critique"]],
      ["Esports", ["esports", "competitive", "pro gaming"]],
      ["Streaming", ["streaming", "twitch", "live", "broadcast"]],
      ["Retro gaming", ["retro", "classic games", "nostalgia"]],
      ["Finance & Business", ["finance", "business", "money", "investing", "entrepreneur"]],

      ["Personal finance", ["personal finance", "money", "budget"]],
      ["Investing", ["investing", "stocks", "portfolio", "market"]],
      ["Crypto", ["crypto", "bitcoin", "blockchain", "defi"]],
      ["Real estate", ["real estate", "property", "housing", "mortgage"]],
      ["Business tips", ["business", "tips", "small business"]],
      ["Entrepreneurship", ["entrepreneurship", "startup", "founder"]],
      ["Side hustles", ["side hustle", "extra income", "gig"]],
      ["Career and workplace", ["career", "workplace", "job", "office"]],
      ["Budgeting", ["budgeting", "budget", "save money"]],
      ["Taxes", ["taxes", "tax", "irs", "filing"]],
      ["Credit cards", ["credit cards", "points", "rewards"]],
      ["Travel hacking", ["travel hacking", "miles", "points travel"]],
      ["Frugality", ["frugality", "frugal", "save", "cheap"]],
      ["Wealth mindset", ["wealth", "mindset", "abundance"]],
      ["Small business ownership", ["small business", "owner", "smb"]],
      ["Ecom", ["ecom", "ecommerce", "shopify", "online store"]],
      ["SaaS building", ["saas", "software business", "b2b"]],
      ["Freelancing", ["freelancing", "freelancer", "clients"]],
      ["Stocks", ["stocks", "equity", "trading", "shares"]],
      ["Financial literacy", ["financial literacy", "education", "money skills"]],

      ["Music", ["music", "artist", "song", "audio"]],
      ["Singing", ["singing", "vocal", "voice"]],
      ["Dance", ["dance", "dancing", "choreo"]],
      ["Acting", ["acting", "actor", "theatre", "film"]],
      ["Comedy", ["comedy", "comedian", "funny", "standup"]],
      ["Photography", ["photography", "photo", "camera", "shoot"]],
      ["Art tutorials", ["art", "tutorials", "learn art"]],
      ["Graphic design", ["graphic design", "design", "illustrator", "figma"]],
      ["Drawing", ["drawing", "sketch", "illustration"]],
      ["Painting", ["painting", "paint", "canvas", "fine art"]],
      ["Crafts", ["crafts", "diy", "handmade"]],
      ["Theater", ["theater", "theatre", "stage", "drama"]],
      ["Film analysis", ["film", "analysis", "movies", "cinema"]],
      ["Book content", ["book", "reading", "novel", "literature"]],
      ["Poetry", ["poetry", "poem", "spoken word"]],
      ["Cultural commentary", ["cultural", "commentary", "society"]],
      ["Animation", ["animation", "animated", "2d", "3d"]],
      ["Cosplay", ["cosplay", "costume", "convention"]],

      ["Language learning", ["language", "learning", "duolingo", "fluent"]],
      ["Study tips", ["study", "tips", "exam", "student"]],
      ["Science education", ["science", "education", "stem", "experiments"]],
      ["Math tutorials", ["math", "mathematics", "algebra", "calculus"]],
      ["History content", ["history", "historical", "past"]],
      ["Geography", ["geography", "maps", "countries"]],
      ["College advice", ["college", "advice", "admissions", "campus"]],
      ["Academic productivity", ["academic", "productivity", "study"]],
      ["Exam prep", ["exam", "prep", "test", "sat"]],
      ["Career education", ["career", "education", "skills"]],
      ["STEM content", ["stem", "science", "engineering", "tech education"]],
      ["Explainers", ["explainer", "how it works", "education"]],
      ["Documentaries", ["documentaries", "doc", "nonfiction"]],
      ["Home & DIY", ["home", "diy", "house", "projects", "handyman"]],

      ["Home improvement", ["home improvement", "diy", "repair", "reno"]],
      ["Renovation content", ["renovation", "remodel", "construction"]],
      ["DIY hacks", ["diy", "hacks", "projects", "build"]],
      ["Interior design", ["interior design", "decor", "spaces"]],
      ["Gardening", ["gardening", "garden", "plants", "grow"]],
      ["Landscaping", ["landscaping", "yard", "outdoor design"]],
      ["Home organization", ["home", "organization", "declutter"]],
      ["Home cleaning", ["home", "cleaning", "deep clean"]],
      ["Furniture flipping", ["furniture", "flipping", "resell", "upcycle"]],
      ["Crafting", ["crafting", "crafts", "maker"]],
      ["Real estate staging", ["staging", "real estate", "sell home"]],
      ["Smart home projects", ["smart home", "projects", "automation"]],
      ["Pets & Animals", ["pets", "animals", "pet", "creature"]],

      ["Dogs", ["dogs", "dog", "puppy", "canine"]],
      ["Cats", ["cats", "cat", "kitten", "feline"]],
      ["Reptiles", ["reptiles", "snake", "lizard", "gecko"]],
      ["Exotic pets", ["exotic", "pets", "unusual animals"]],
      ["Pet care", ["pet care", "care", "animals"]],
      ["Animal training", ["animal", "training", "obedience", "behavior"]],
      ["Pet grooming", ["grooming", "pets", "salon"]],
      ["Veterinary advice", ["veterinary", "vet", "animal health"]],
      ["Horse content", ["horse", "equestrian", "riding"]],
      ["Pet rescue", ["rescue", "adoption", "shelter"]],
      ["Animal lifestyle", ["animal", "lifestyle", "pets life"]],
      ["Automotive", ["automotive", "cars", "vehicles", "auto", "driving"]],

      ["Cars", ["cars", "automotive", "vehicle"]],
      ["Car reviews", ["car reviews", "auto review", "test drive"]],
      ["Car mods", ["mods", "modified", "tuning", "aftermarket"]],
      ["Car detailing", ["detailing", "wash", "wax", "shine"]],
      ["Electric vehicles", ["electric", "ev", "tesla", "battery"]],
      ["Motorsports", ["motorsports", "racing", "track"]],
      ["Car maintenance", ["maintenance", "repair", "mechanic"]],
      ["Car road trips", ["road trip", "driving", "car travel", "automotive"]],
      ["Motorcycles", ["motorcycles", "bike", "riding"]],
      ["Off roading", ["off road", "4x4", "truck"]],
      ["Sports", ["sports", "athletic", "athlete", "competition", "team"]],

      ["Soccer", ["soccer", "football", "futbol"]],
      ["Basketball", ["basketball", "nba", "hoops"]],
      ["Football", ["football", "nfl", "gridiron"]],
      ["Baseball", ["baseball", "mlb"]],
      ["Tennis", ["tennis", "court", "racket"]],
      ["Golf", ["golf", "swing", "course"]],
      ["Swimming", ["swimming", "pool", "swim"]],
      ["Martial arts", ["martial arts", "mma", "karate", "bjj"]],
      ["Boxing", ["boxing", "fight", "ring"]],
      ["F1 racing", ["f1", "formula 1", "racing"]],
      ["Cycling", ["cycling", "bike", "bicycle"]],
      ["Climbing", ["climbing", "rock climb", "bouldering"]],
      ["Skiing", ["skiing", "snow", "slopes"]],
      ["Snowboarding", ["snowboarding", "snowboard"]],
      ["Surfing", ["surfing", "surf", "waves"]],

      ["Weddings", ["weddings", "wedding", "bride", "ceremony"]],
      ["Festivals", ["festivals", "music festival", "events"]],
      ["Concerts", ["concerts", "live music", "shows"]],
      ["Parties", ["parties", "celebration", "event"]],
      ["Exhibitions", ["exhibitions", "gallery", "museum"]],
      ["Conventions", ["conventions", "con", "expo"]],
      ["Theme parks", ["theme parks", "disney", "rides"]],
      ["Travel itineraries", ["itineraries", "travel plan", "trip"]],
      ["Social Causes", ["social causes", "activism", "advocacy", "charity"]],

      ["Sustainability", ["sustainability", "sustainable", "eco", "green"]],
      ["Climate activism", ["climate", "activism", "environment"]],
      ["Body positivity", ["body positivity", "self love", "inclusive"]],
      ["Inclusivity", ["inclusivity", "inclusive", "diversity"]],
      ["Mental health awareness", ["mental health", "awareness", "advocacy"]],
      ["Animal rights", ["animal rights", "welfare", "activism"]],
      ["Nonprofit content", ["nonprofit", "charity", "ngo"]],
      ["LGBTQ content (non identity defining)", ["lgbtq", "pride", "community"]],
      ["Ethical consumerism", ["ethical", "consumerism", "conscious"]],
      ["Professional & Skills", ["professional", "skills", "workplace", "expertise"]],

      ["Marketing", ["marketing", "growth", "ads", "brand"]],
      ["Sales", ["sales", "selling", "pipeline"]],
      ["Leadership", ["leadership", "manager", "executive"]],
      ["Project management", ["project management", "pm", "agile"]],
      ["Coding", ["coding", "programming", "developer"]],
      ["Law (general info)", ["law", "legal", "general information"]],
      ["Medical content (general)", ["medical", "health info", "general"]],
      ["HR/career", ["hr", "human resources", "hiring", "career"]],
      ["Real estate career", ["real estate", "agent", "broker", "realtor"]],
      ["Product design", ["product design", "ux", "ui"]],
      ["Business systems", ["business systems", "operations", "process"]],
      ["Productivity tools", ["productivity tools", "notion", "software"]],
      ["Creator Economy / Meta Content", ["creator economy", "content creator", "influencer", "creator tips"]],

      ["Behind the scenes creator life", ["bts", "creator", "behind the scenes"]],
      ["Editing tutorials", ["editing", "tutorials", "premiere", "davinci"]],
      ["Filming tutorials", ["filming", "camera", "lighting", "shoot"]],
      ["Social media tips", ["social media", "tips", "instagram", "tiktok"]],
      ["Algorithm insights", ["algorithm", "reach", "growth", "platform"]],
      ["UGC creation", ["ugc", "user generated", "brand content"]],
      ["Brand deal advice", ["brand deals", "sponsorship", "partnerships"]],
      ["Influencer growth", ["influencer", "growth", "followers"]],
      ["SaaS building as a creator", ["saas", "creator", "build product"]],

      ["Irish boyfriend", ["irish", "boyfriend", "couple", "culture"]],
      ["American expat", ["american", "expat", "abroad", "living overseas"]],
      ["Couples comedy", ["couples", "comedy", "funny", "relationship"]],
      ["Hotel reviews Asia", ["hotel", "asia", "reviews", "travel"]],
      ["Luxury resort Bali", ["luxury", "resort", "bali", "indonesia"]],
      ["Irish vs American culture", ["irish", "american", "culture", "comparison"]],
      ["Skincare for dry skin", ["skincare", "dry skin", "moisture"]],
      ["Professional grade skincare use", ["professional", "skincare", "clinical"]],
    ];

    return rows.map(([value, keywords]) => ({ value, keywords: kw(value, keywords) }));
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredNiches([]);
      return;
    }

    const searchLower = searchTerm.toLowerCase();

    const filtered = nicheOptions.filter((option) => {
      if (selectedNiches.includes(option.value)) return false;

      const valueMatch = option.value.toLowerCase().includes(searchLower);
      const keywordMatch = option.keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchLower)
      );

      return valueMatch || keywordMatch;
    });

    setFilteredNiches(filtered);
  }, [searchTerm, selectedNiches, nicheOptions]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.trim() !== "");
  };

  const handleNicheSelect = (niche) => {
    const newNiches = [...selectedNiches, niche];
    onNichesChange(newNiches);
    setSearchTerm("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    if (searchTerm.trim() !== "") setShowSuggestions(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && filteredNiches.length > 0) {
      e.preventDefault();
      handleNicheSelect(filteredNiches[0].value);
    }
  };

  return {
    selectedNiches,
    placeholder,
    handleNicheRemove,

    searchTerm,
    showSuggestions,
    filteredNiches,

    inputRef,

    handleInputChange,
    handleNicheSelect,
    handleInputFocus,
    handleKeyPress,
  };
}
