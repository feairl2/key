const crypto = require("crypto");

let users = {};
let keys = {};

function genToken() {
    return crypto.randomBytes(16).toString("hex");
}

function genKey(ip) {
    return "LB-" + crypto.randomBytes(16).toString("hex").slice(0, 12) + "-" + ip.replace(/\./g, "");
}

export default function handler(req, res) {
    const { token, done } = req.query;

    // 取得使用者 IP
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";

    // 初始化 token
    let t = token;
    if (!t || !users[t]) {
        t = genToken();
        users[t] = { step: 1 };
    }

    let user = users[t];

    // 完成後跳下一步
    if (done == 1) {
        user.step++;
    }

    // Step 1
    if (user.step === 1) {
        return res.json({ step: 1, token: t });
    }

    // Step 2
    if (user.step === 2) {
        return res.json({ step: 2, token: t });
    }

    // Step >= 3 → 產生 Key
    if (!keys[t]) {
        const key = genKey(ip);

        keys[t] = {
            key,
            ip,
            created: Date.now(),
            expires: Date.now() + 24 * 60 * 60 * 1000
        };
    }

    return res.json({
        step: "key",
        key: keys[t].key,
        expires: keys[t].expires
    });
}
