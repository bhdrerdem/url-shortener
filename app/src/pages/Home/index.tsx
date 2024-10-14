import styled from "@emotion/styled";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import axios from "axios";
import React from "react";
import { IconButton, Snackbar } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { TransitionProps } from "@mui/material/transitions";
import Fade from "@mui/material/Fade";

const MainContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
`;

const MainCardStyled = styled(Card)`
  padding: 20px;
  min-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

const isValidUrl = (url: string): boolean => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)" +
      "(([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+" + // Domain name
      "[a-zA-Z]{2,}" + // TLD
      "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" + // Port and path
      "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" + // Query string
      "(\\#[-a-zA-Z\\d_]*)?$" // Fragment locator
  );

  return urlPattern.test(url);
};

const Home: React.FC = () => {
  const [tinyUrl, setTinyUrl] = React.useState("");
  const [longUrl, setLongUrl] = React.useState("");
  const [error, setError] = React.useState("");
  const [snackbarState, snackbarSetState] = React.useState<{
    open: boolean;
    Transition: React.ComponentType<
      TransitionProps & {
        children: React.ReactElement<any, any>;
      }
    >;
  }>({
    open: false,
    Transition: Fade,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(tinyUrl);
    snackbarSetState({
      open: true,
      Transition: Fade,
    });
  };

  const handleSnackbarClose = () => {
    snackbarSetState({
      open: false,
      Transition: Fade,
    });
  };

  const handleShorten = async () => {
    setError("");
    setTinyUrl("");

    if (!longUrl) {
      setError("URL is required");
      return;
    }

    let url = longUrl;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `http://${url}`;
    }

    if (!isValidUrl(url)) {
      setError("Given URL is not valid");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/", { url: url });
      const tinyUrl = response.data.tinyUrl;
      setTinyUrl(tinyUrl);
    } catch (error) {
      setError("Something went wrong, please try again...");
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.replace(/\s/g, "");
    setLongUrl(newValue);
  };

  return (
    <>
      <MainContainer>
        <MainCardStyled>
          <h1
            style={{
              fontFamily: "sans-serif",
            }}
          >
            Free URL Shorten Service
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              gap: "10px",
            }}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              onChange={handleUrlChange}
              placeholder="Enter URL to shorten"
              size="small"
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleShorten}>
              Shorten
            </Button>
          </div>
          {error && (
            <Alert
              sx={{ width: "100%", marginTop: "10px" }}
              severity="warning"
              variant="filled"
              style={{
                boxSizing: "border-box",
              }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setError("");
                  }}
                >
                  X
                </IconButton>
              }
            >
              {error}
            </Alert>
          )}
          {tinyUrl && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "20px",
                backgroundColor: "#f0f0f0",
                width: "100%",
                borderRadius: "5px",
                padding: "10px",
                boxSizing: "border-box",
              }}
            >
              <p>{tinyUrl}</p>
              <IconButton aria-label="copy" onClick={handleCopy}>
                <ContentCopyIcon />
              </IconButton>
            </Box>
          )}
        </MainCardStyled>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={snackbarState.open}
          autoHideDuration={2000}
          TransitionComponent={snackbarState.Transition}
          onClose={handleSnackbarClose}
          message="Copied to clipboard"
        />
      </MainContainer>
    </>
  );
};

export default Home;
