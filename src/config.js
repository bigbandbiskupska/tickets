export default {
    "apiRoot": process.env.NODE_ENV === "production" ? "https://seats.bigbandbiskupska.cz/api/v1" : "http://localhost:8002/api/v1",
    "env": process.env.NODE_ENV,
}