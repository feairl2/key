const crypto = require("crypto");

let sessions = {};   // 記錄 token + step + key

function genToken() {
    return crypto.randomBytes(16).toString("hex");
}

function genKey() {
    return "LB-" + crypto.randomBytes(10).toString("hex");
}

export default function handler(req, res) {
    let { token, done } = req.query;

    // 沒 token → 建立新的
    if (!token || !sessions[token]) {
        token = genToken();
        sessions[token] = { step: 1, key: null };
    }

    let user = sessions[token];

    // work.ink 回跳 → step+1
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

    // Step 完成 → 建 Key
    if (!user.key) {
        user.key = genKey();
    }

    return res.json({ step: "key", key: user.key });
}
