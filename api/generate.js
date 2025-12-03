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

    if (user.step === 1){
        return res.json({ step: 1, token });
    }

    if (user.step === 2){
        return res.json({ step: 2, token });
    }

    if (user.step >= 3){
        if (!user.key){
            user.key = genKey(token);
        }
        return res.json({ step: 3, token, key: user.key });
    }
}
