let users = global.users || {};

export default function handler(req, res){
    let key = req.query.key;

    let match = Object.values(users).find(u => u.key === key);

    if (match){
        return res.json({ status: "ok", message: "Key is valid" });
    }

    return res.json({ status: "fail", message: "Invalid key" });
}
