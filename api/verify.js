import keys from "./keys.js"; // 若不支援 import, 全部放同一檔案也可

export default function handler(req, res) {
    let key = req.query.key;
    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";

    let record = Object.values(keys).find(k => k.key === key);

    if (!record) {
        return res.json({ status: "fail", message: "Key not found" });
    }

    // IP 是否正確
    if (record.ip !== ip) {
        return res.json({ status: "fail", message: "Wrong IP" });
    }

    // 是否過期
    if (Date.now() > record.expires) {
        return res.json({ status: "expired", message: "Key expired" });
    }

    return res.json({ status: "ok", message: "Key valid" });
}
