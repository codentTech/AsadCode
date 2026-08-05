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

const categoryIcons = {
  General: <HelpCircle className="w-6 h-6" />,
  "Profiles & Media Kits": <Users className="w-6 h-6" />,
  "Collaboration & Campaign Management": <MessageSquare className="w-6 h-6" />,
  "Payments & Escrow": <CreditCard className="w-6 h-6" />,
  "Legal & Contracts": <FileText className="w-6 h-6" />,
  "Analytics & Reporting": <BarChart className="w-6 h-6" />,
  "Safety & Verification": <Shield className="w-6 h-6" />,
  "Platform Tools & Features": <MessageSquare className="w-6 h-6" />,
  "Billing & Account Help": <CreditCard className="w-6 h-6" />,
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
    categoryIcons,
    categorySectionId,
  };
}

export default useFaqHook;
