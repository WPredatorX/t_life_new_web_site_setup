"use client";
import { useState, useEffect } from "react";
import { useAppSnackbar, useAppRouter, useAppForm } from "@hooks";
import { Yup } from "@/utilities";
import {
  Grid,
  TextField,
  Typography,
  FormHelperText,
  Switch,
  FormControlLabel,
  Button,
  Card,
  useTheme,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppCard, AppDirectBrokerCard } from "@/components";
import { Controller } from "react-hook-form";
import { setDialog } from "@stores/slices";
import { useAppDispatch, useAppSelector } from "@hooks";

const PageDirect = () => {
  const router = useAppRouter();
  const theme = useTheme();
  const [data, setData] = useState();
  const { handleSnackAlert } = useAppSnackbar();
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const { dialog } = useAppSelector((state) => state.global);
  return <AppDirectBrokerCard mode={"Direct"} />;
};
export default PageDirect;
