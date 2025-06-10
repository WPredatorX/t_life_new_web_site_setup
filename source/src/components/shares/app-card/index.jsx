"use client";

import { Card, CardHeader, CardContent, Divider, Grid } from "@mui/material";

const AppCard = ({
  title = null,
  subheader = null,
  action = null,
  children,
  cardstyle = {},
}) => {
  return (
    <Card sx={{ ...cardstyle }}>
      <CardHeader title={title} subheader={subheader} action={action} />
      <Divider />
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default AppCard;
