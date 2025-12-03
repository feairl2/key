const crypto = require("crypto");

let keys = {}; // 存所有 Key（包含 IP & 過期時間）
let users = {}; // 進度（Step）

function genToken() {
    return crypto.randomBytes(16).toString("hex");
}

function genKey(ip) {
    return "LB-" + crypto.randomBytes(16).toString("hex").slice(0, 16) + "-" + ip.replace(/\./g, "");
}

export default function handler(req, res) {
    let { token, done } = req.query;

    // 取得使用者 IP
    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";

    // 初始化 Token & Step
    if (!token || !users[token]) {
        token = genToken();
        users[token] = { step: 1 };
    }

    let user = users[token];

    // 完成任務 → step++
    if (done == 1) {
        user.step++;
    }

    // Step1
    if (user.step === 1) {
        return res.json({ step: 1, token });
    }

    // Step2
    if (user.step === 2) {
        return res.json({ step: 2, token });
    }

    // 完成（step >= 3）
    if (!keys[token]) {
        let key = genKey(ip);

        keys[token] = {
            key,
            ip,
            created: Date.now(),
            expires: Date.now() + 24 * 60 * 60 * 1000 // 24 小時
        };
    }

    return res.json({
        step: "key",
        key: keys[token].key,
        expires: keys[token].expires
    });
}
