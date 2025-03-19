import { setSnackBar } from "@stores/slices";
import { useAppDispatch, useAppSelector } from "@hooks";

const useAppSnackbar = () => {
  const dispatch = useAppDispatch();
  const { snackBar } = useAppSelector((state) => state.global);

  const handleSnackAlert = ({
    open = false,
    autoHideDuration = 5000,
    onClose = null,
    message = "Message",
    action = null,
    anchorOr0igin = {
      horizontal: "left",
      vertical: "bottom",
    },
  }) => {
    dispatch(
      setSnackBar({
        ...snackBar,
        ...{
          open: open,
          autoHideDuration: autoHideDuration,
          onClose: onClose,
          message: message,
          action: action,
          anchorOrigin: anchorOr0igin,
        },
      })
    );
  };

  return { snackBar, handleSnackAlert };
};

export default useAppSnackbar;
