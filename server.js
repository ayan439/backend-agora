import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "agora-access-token";
const { RtcTokenBuilder, RtcRole } = pkg;


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Agora Token Server Running"));

app.post("/agora-token", (req, res) => {
  const appID = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;

  const { channelName, uid } = req.body;
  if (!channelName) {
    return res.status(400).json({ error: "channelName required" });
  }

  const role = RtcRole.PUBLISHER;
  const expireTime = 3600; // 1 hour
  const current = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = current + expireTime;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid || 0,
    role,
    privilegeExpiredTs
  );

  return res.json({ token, appID, channelName });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
