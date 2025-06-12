"use client";

import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { APPLICATION_LOGIN_REQUEST } from "@constants";
import { useAppDispatch, useAppSelector } from "@hooks";
import {
  setUserProfile,
  setAuth,
  setSasToken,
  setActivator,
} from "@stores/slices";

const PageLayoutAuthInitializer = ({ children }) => {
  const dispatch = useAppDispatch();
  const { instance, accounts } = useMsal();
  const { auth } = useAppSelector((state) => state.global);

  useEffect(() => {
    const checkAccount = async () => {
      try {
        const currentAccounts = instance.getAllAccounts();
        if (currentAccounts.length === 0) {
          await instance.ssoSilent(APPLICATION_LOGIN_REQUEST);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (accounts === undefined || accounts === null) {
      checkAccount();
    }
  }, [instance, auth]);

  useEffect(() => {
    const fetchAccountRole = async () => {
      try {
        const _account = accounts[0];
        const payload = {
          email: _account.username,
        };
        const response = await fetch(`/api/auth?action=getUserRolesData`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        const activator = _account?.username?.split("@")[0] ?? null;
        dispatch(setActivator(activator));
        dispatch(setAuth(data));
        dispatch(setUserProfile(_account));
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSasToken = async () => {
      try {
        const response = await fetch(`/api/auth?action=getBlobSasToken`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        dispatch(setSasToken(data));
      } catch (error) {
        console.error(error);
      }
    };

    if (accounts !== undefined && accounts !== null) {
      fetchAccountRole();
      fetchSasToken();
    }
  }, [accounts]);

  return <>{children}</>;
};

export default PageLayoutAuthInitializer;
