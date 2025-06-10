import { useState, useEffect } from "react";
import {
  Tab,
  Card,
  Button,
  Grid,
  Tabs,
  Typography,
  CardHeader,
  CardContent,
  Divider,
} from "@mui/material";
import { AppCard } from "@/components";

const AppCardWithTabs = ({ mode, tabLabels, tabContent, cardstyle = {} }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Card sx={{ ...cardstyle }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        indicatorColor="primary"
        textColor="primary"
      >
        {tabLabels &&
          tabLabels.map((label, index) => <Tab key={index} label={label} />)}
      </Tabs>
      <Divider />
      <CardContent>
        <Grid container>
          {tabContent &&
            tabContent.map(
              (content, index) =>
                value === index && (
                  <Grid item xs={12} key={index}>
                    {content}
                  </Grid>
                )
            )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AppCardWithTabs;
