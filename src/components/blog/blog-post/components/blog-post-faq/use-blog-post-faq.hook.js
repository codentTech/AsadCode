import { useCallback, useState } from "react";

export default function useBlogPostFaq() {
  const [openQuestionIds, setOpenQuestionIds] = useState([]);

  const toggleQuestion = useCallback((questionId) => {
    setOpenQuestionIds((current) =>
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId]
    );
  }, []);

  const isQuestionOpen = useCallback(
    (questionId) => openQuestionIds.includes(questionId),
    [openQuestionIds]
  );

  return {
    toggleQuestion,
    isQuestionOpen,
  };
}
