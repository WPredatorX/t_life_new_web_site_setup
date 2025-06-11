import { useMemo } from "react";
import { useAppSelector } from ".";

const useAppFeatureCheck = (requiredFeature) => {
  const { auth } = useAppSelector((state) => state.global);

  const validFeature = useMemo(() => {
    if (!auth) return false;
    if (!requiredFeature || requiredFeature.length === 0) return true;

    const features =
      auth.roles?.flatMap((role) =>
        role.menus.flatMap((menuItem) =>
          menuItem.feature.map((featureItem) => featureItem.code)
        )
      ) || [];

    return requiredFeature.some((item) => features.includes(item));
  }, [auth, requiredFeature]);

  return { validFeature };
};

export default useAppFeatureCheck;
