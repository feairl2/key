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

    // 如果沒有 token，就建立新 token = Step1
    if (!token || !users[token]){
        token = genToken();
        users[token] = { step: 1 };
    }

    let user = users[token];

    // 如果 work.ink 回跳 triggering step +1
    if (done == 1){
        user.step++;
    }

    // Step1
    if (user.step === 1){
        return res.json({ step: 1, token });
    }

    // Step2
    if (user.step === 2){
        return res.json({ step: 2, token });
    }

    // Step3 →產生 Key 給使用者
    if (user.step >= 3){
        if (!user.key){
            user.key = genKey(token);
        }
        return res.json({ step: 3, token, key: user.key });
    }
}
