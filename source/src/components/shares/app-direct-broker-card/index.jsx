"use client";

import { useState, useEffect } from "react";
import { Tab, Card, Grid, Tabs, CardContent, Divider } from "@mui/material";
import {
  AppProfile,
  AppPromotion,
  AppCommonData,
  AppProductList,
} from "./components";
import { AppLoadData } from "@components";
import {
  useAppFeatureCheck,
  useAppDispatch,
  useAppSnackbar,
  useAppSelector,
  useAppRouter,
} from "@hooks";
import { setBrokerId } from "@stores/slices";

// ใช้ร่วมกัน direct และ broker
const AppDirectBrokerCard = ({ mode, channel }) => {
  const dispatch = useAppDispatch();
  const router = useAppRouter();
  const { handleSnackAlert } = useAppSnackbar();
  const { validFeature: grantCommon } = useAppFeatureCheck([
    "direct.general.read",
    "direct.general.write",
    "broker.general.read",
    "broker.general.write",
  ]);
  const { validFeature: grantProduct } = useAppFeatureCheck([
    "direct.product.query",
    "direct.product.general.read",
    "direct.product.general.write",
    "direct.product.general.request",
    "direct.product.general.approve",
    "direct.product.display.read",
    "direct.product.display.write",
    "direct.product.display.request",
    "direct.product.display.approve",
    "direct.product.display.drop",
    "direct.product.drop",
    "broker.product.query",
    "broker.product.general.read",
    "broker.product.general.write",
    "broker.product.general.request",
    "broker.product.general.approve",
    "broker.product.display.read",
    "broker.product.display.write",
    "broker.product.display.request",
    "broker.product.display.approve",
    "broker.product.display.drop",
    "broker.product.drop",
  ]);
  const { validFeature: grantProfile } = useAppFeatureCheck([
    "direct.profile.read",
    "direct.profile.write",
    "direct.profile.request",
    "direct.profile.approve",
    "direct.profile.drop",
    "broker.profile.read",
    "broker.profile.write",
    "broker.profile.request",
    "broker.profile.approve",
    "broker.profile.drop",
  ]);
  const { validFeature: grantPromotion } = useAppFeatureCheck([
    "direct.promotion.query",
    "direct.promotion.read",
    "direct.promotion.write",
    "direct.promotion.request",
    "direct.promotion.approve",
    "direct.promotion.drop",
  ]);
  const { tabIndex } = useAppSelector((state) => state.global);
  const [value, setValue] = useState(tabIndex);
  const [brokerData, setBrokerData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event, newValue) => {
    const newUrl = `${window.location.pathname}?tabIndex=${newValue}`;
    router.push(newUrl, undefined, { shallow: true });
  };

  const createChannelSilent = async (payload) => {
    let brokerId = "";

    try {
      const response = await fetch(`/api/direct?action=AddOrUpdateDirect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      brokerId = data;
    } catch (error) {
      console.error(error);
    }

    return brokerId;
  };

  const handleFetchData = async () => {
    setLoading(true);

    try {
      const payload = {
        i_subbusiness_line: channel,
      };
      const response = await fetch(`/api/direct?action=GetDirectGeneralInfo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.status !== 200) throw new Error("");

      const data = await response.json();

      let result = Array.from(data).map((item) => {
        return {
          ...item,
          mail_to: item?.mail_to?.split(";") ?? [],
          mail_cc: item?.mail_cc?.split(";") ?? [],
        };
      });

      if (result.length < 2) {
        result.push(result[0]);
      }

      let silentPayload = [...result];
      if (result[0]?.broker_id === "00000000-0000-0000-0000-000000000000") {
        silentPayload = [
          {
            ...result[0],
            template_code: "01",
            mail_to: "",
            mail_cc: "",
            is_active: true,
          },
          {
            ...result[1],
            template_code: "02",
            mail_to: "",
            mail_cc: "",
            is_active: true,
          },
        ];

        const newBroker = await createChannelSilent(silentPayload);
        silentPayload = silentPayload.map((item) => {
          return {
            ...item,
            broker_id: newBroker.broker_id,
          };
        });
        silentPayload[0].recipient_id = newBroker.recipient_id1;
        silentPayload[1].recipient_id = newBroker.recipient_id2;

        // map ข้อมูลกลับ
        silentPayload = Array.from(silentPayload).map((item) => {
          return {
            ...item,
            mail_to: item?.mail_to?.split(";"),
            mail_cc: item?.mail_cc?.split(";"),
          };
        });
      }

      let _confirmEmail = silentPayload[0] ?? {
        mail_to: [],
        mail_cc: [],
      };

      if (_confirmEmail.mail_to[0] === "") {
        _confirmEmail = { ..._confirmEmail, mail_to: [] };
      }

      if (_confirmEmail.mail_cc[0] === "") {
        _confirmEmail = { ..._confirmEmail, mail_cc: [] };
      }

      let _contactEmail = silentPayload[1] ?? {
        mail_to: [],
        mail_cc: [],
      };

      if (_contactEmail.mail_to[0] === "") {
        _contactEmail = { ..._contactEmail, mail_to: [] };
      }

      if (_contactEmail.mail_cc[0] === "") {
        _contactEmail = { ..._contactEmail, mail_cc: [] };
      }

      const brokerData = {
        generalInfo: silentPayload,
        confirmEmail: _confirmEmail.mail_to,
        confirmEmailCC: _confirmEmail.mail_cc,
        contactEmail: _contactEmail.mail_to,
        contactEmailCC: _contactEmail.mail_cc,
      };

      setBrokerData(brokerData);
      dispatch(setBrokerId(silentPayload[0].broker_id));
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: `ล้มเหลวเกิดข้อผิดพลาด ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInitChannel = async () => {
    await handleFetchData();
  };

  useEffect(() => {
    if (!brokerData) {
      handleInitChannel();
    }
  }, [brokerData]);

  useEffect(() => {
    setValue(tabIndex);
  }, [tabIndex]);

  if (loading || !brokerData) {
    return <AppLoadData loadingState={0} />;
  }

  return (
    <Grid>
      <Card>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
          textColor="primary"
        >
          {grantCommon && <Tab value={0} label={"ข้อมูลทั่วไป"} />}
          {grantProduct && <Tab value={1} label={"ผลิตภัณฑ์ที่ขาย"} />}
          {grantProfile && <Tab value={2} label={"โปรไฟล์แสดงผล"} />}
          {grantPromotion && mode.toLowerCase() === "direct" ? (
            <Tab value={3} label={"โปรโมชั่น"} />
          ) : null}
        </Tabs>
        <Divider />
        <CardContent>
          <Grid container>
            <Grid item xs={12}>
              {value === 0 && grantCommon && (
                <AppCommonData
                  mode={mode}
                  channel={channel}
                  brokerData={brokerData}
                />
              )}
              {value === 1 && grantProduct && (
                <AppProductList
                  mode={mode}
                  channel={channel}
                  brokerData={brokerData}
                />
              )}
              {value === 2 && grantProfile && (
                <AppProfile
                  mode={mode}
                  channel={channel}
                  brokerData={brokerData}
                />
              )}
              {value === 3 &&
                grantPromotion &&
                mode.toLowerCase() === "direct" && (
                  <AppPromotion
                    mode={mode}
                    brokerData={brokerData}
                    channel={channel}
                  />
                )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default AppDirectBrokerCard;
