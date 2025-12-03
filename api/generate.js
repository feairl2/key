const crypto = require("crypto");

let sessions = {};   // 存 token + step
let keys = {};       // 存 key

function genToken() {
    return crypto.randomBytes(16).toString("hex");
}

function genKey() {
    return "LB-" + crypto.randomBytes(12).toString("hex");
}

export default function handler(req, res) {
    let { token, done } = req.query;

    if (!token || !sessions[token]) {
        token = genToken();
        sessions[token] = { step: 1 };
    }

    let user = sessions[token];

    if (done == 1) {
        user.step++;
    }

    if (user.step === 1)
        return res.json({ step: 1, token });

    if (user.step === 2)
        return res.json({ step: 2, token });

    // Step >= 3 → 產生後端 Key
    if (!keys[token]) {
        keys[token] = genKey();
    }

    return res.json({
        step: "key",
        key: keys[token]
    });
