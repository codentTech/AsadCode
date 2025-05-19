import { useRouter } from "next/navigation";

function useDiscoverDreatorsHook() {
  const router = useRouter();
  return { router };
}

export default useDiscoverDreatorsHook;
