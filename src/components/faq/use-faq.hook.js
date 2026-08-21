import { FAQ_DATA } from "@/common/constants/faq.constant";
import {
  BarChart,
  CreditCard,
  FileText,
  HelpCircle,
  MessageSquare,
  Shield,
  Users,
} from "lucide-react";
import { useCallback, useState } from "react";

const CATEGORY_ICON_COMPONENTS = {
  General: HelpCircle,
  "Profiles & Media Kits": Users,
  "Collaboration & Campaign Management": MessageSquare,
  "Payments & Escrow": CreditCard,
  "Legal & Contracts": FileText,
  "Analytics & Reporting": BarChart,
  "Safety & Verification": Shield,
  "Platform Tools & Features": MessageSquare,
  "Billing & Account Help": CreditCard,
};

function categorySectionId(category) {
  return `faq-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function useFaqHook() {
  const [activeCategory, setActiveCategory] = useState("General");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleCategorySelect = useCallback((category) => {
    setActiveCategory(category);
    setIsSearching(false);
    setSearchQuery("");
    setSearchResults([]);

    if (typeof document === "undefined") return;
    const el = document.getElementById(categorySectionId(category));
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    const results = [];
    FAQ_DATA.forEach((category) => {
      category.questions.forEach((qa) => {
        if (
          qa.question.toLowerCase().includes(query.toLowerCase()) ||
          qa.answer.toLowerCase().includes(query.toLowerCase())
        ) {
          results.push({
            ...qa,
            category: category.category,
          });
        }
      });
    });

    setSearchResults(results);
  }, []);

  return {
    activeCategory,
    searchQuery,
    searchResults,
    isSearching,
    setIsSearching,
    setSearchQuery,
    handleCategorySelect,
    handleSearch,
    faqData: FAQ_DATA,
    categoryIconComponents: CATEGORY_ICON_COMPONENTS,
    categorySectionId,
  };
}

export default useFaqHook;
