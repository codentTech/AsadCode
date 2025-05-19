import { setIsCreatorModeMode } from '@/provider/features/auth/auth.slice';
import { useDispatch, useSelector } from 'react-redux';

function useLandingPageHook() {
  const dispatch = useDispatch();
  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);

  const handleSelectMode = (isCreator) => {
    dispatch(setIsCreatorModeMode(isCreator));
  };
  return { isCreatorMode, handleSelectMode };
}

export default useLandingPageHook;
