import { useMemo } from 'react';
import useDebounce from './useDebounce';

export default function useDocumentSearch(searchText, getData) {
  const debouncedSearchQuery = useDebounce(searchText, 1000);
  useMemo(async () => {
    let query;
    if (debouncedSearchQuery && debouncedSearchQuery?.length !== 0) {
      query = {
        $or: [
          { displayId: { $iLike: `${debouncedSearchQuery}%` } },
          { '$customer.first_name$': { $iLike: `%${debouncedSearchQuery}%` } },
          { '$customer.last_name$': { $iLike: `%${debouncedSearchQuery}%` } },
          { '$customer.company_name$': { $iLike: `%${debouncedSearchQuery}%` } }
        ]
      };
      await getData(query);
    }
  }, [debouncedSearchQuery]);
}
