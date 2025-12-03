const crypto = require("crypto");

let users = {}; 

function genToken(){
    return crypto.randomBytes(16).toString("hex");
}

function genKey(token){
    return "LB-" + crypto.createHash("sha256").update(token + "LAOBEI_SECRET").digest("hex").slice(0,32);
}

export default function handler(req, res){
    let { token, done } = req.query;

    if (!token || !users[token]){
        token = genToken();
        users[token] = { step: 1 };
    }

    let user = users[token];

    if (done == 1){
        user.step++;
    }

    // Step 1
    if (user.step === 1){
        return res.json({ step: 1, token });
    }

    // Step 2
    if (user.step === 2){
        return res.json({ step: 2, token });
    }

    // 完成 Step 2 → 直接產生 Key
    if (user.step >= 3){
        if (!user.key){
            user.key = genKey(token);
        }
        return res.json({ step: "key", token, key: user.key });
    }
}
