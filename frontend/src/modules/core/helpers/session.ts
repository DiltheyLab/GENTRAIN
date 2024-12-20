export const createSessionId = () => {
    // generate short id for usertests -> easier to write down, but has to be replaced with uuidv4 for production
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let i = 0; i < 8; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    id = id.slice(0, 4) + "-" + id.slice(4);
    return id;
};
