const sessions = new Map();

const getSession = (id) => sessions.get(id) || { questionCount: 0, score: 0 };
const setSession = (id, data) => sessions.set(id, data);

module.exports = { getSession, setSession };
